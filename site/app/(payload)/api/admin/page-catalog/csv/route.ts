import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { payloadClient } from '@/lib/payload'

/**
 * GET /api/admin/page-catalog/csv
 *
 * CSV export каталога опубликованных страниц 7 коллекций (Wave 3 · PAN-6).
 *
 * Authentication: only admin (через payload.auth с user-headers).
 * 401 без аутентификации, 403 если user без admin/manager role.
 *
 * Response:
 * - Content-Type: text/csv; charset=utf-8
 * - UTF-8 BOM (для правильного открытия в Excel)
 * - Content-Disposition: attachment; filename="page-catalog-YYYY-MM-DD.csv"
 *
 * brand-guide §12.3 PageCatalog · sa-panel-wave3.md §3.3.
 */

interface CollectionQuery {
  slug: 'services' | 'service-districts' | 'cases' | 'blog' | 'b2b-pages' | 'authors' | 'districts'
  label: string
  urlPrefix: string
}

const COLLECTIONS: CollectionQuery[] = [
  { slug: 'services', label: 'Услуги', urlPrefix: '/' },
  { slug: 'service-districts', label: 'Programmatic SD', urlPrefix: '' },
  { slug: 'cases', label: 'Кейсы', urlPrefix: '/kejsy/' },
  { slug: 'blog', label: 'Блог', urlPrefix: '/blog/' },
  { slug: 'b2b-pages', label: 'B2B', urlPrefix: '/b2b/' },
  { slug: 'authors', label: 'Авторы', urlPrefix: '/avtory/' },
  { slug: 'districts', label: 'Районы', urlPrefix: '/raiony/' },
]

interface CsvRow {
  section: string
  title: string
  url: string
  updatedAt: string
  status: string
  editUrl: string
}

function escapeCsvField(field: string): string {
  // CSV formula injection guard: префикс `'` если поле начинается с =/+/-/@/Tab/CR.
  // Без этого Excel/Numbers исполняют `=HYPERLINK("evil.com","click")` как формулу.
  // См. OWASP CSV Injection.
  const safeField = /^[=+\-@\t\r]/.test(field) ? `'${field}` : field
  // RFC 4180: всегда оборачиваем в кавычки + удваиваем internal quotes.
  return `"${safeField.replace(/"/g, '""')}"`
}

function rowToCsv(row: CsvRow): string {
  return [
    escapeCsvField(row.section),
    escapeCsvField(row.title),
    escapeCsvField(row.url),
    escapeCsvField(row.updatedAt),
    escapeCsvField(row.status),
    escapeCsvField(row.editUrl),
  ].join(',')
}

export async function GET() {
  const payload = await payloadClient()

  // Authentication
  const headersList = await nextHeaders()
  const auth = await payload.auth({ headers: headersList })
  if (!auth.user) {
    return NextResponse.json(
      { error: { code: 'unauthorized', message: 'Требуется вход в админку.' } },
      { status: 401 },
    )
  }
  // Role-check: 403 если role отсутствует (legacy user / новый user до миграции)
  // ИЛИ не входит в admin/manager. Без `!role` — empty role bypass.
  const role = (auth.user as { role?: string }).role
  if (!role || !['admin', 'manager'].includes(role)) {
    return NextResponse.json(
      { error: { code: 'forbidden', message: 'Нет прав на экспорт.' } },
      { status: 403 },
    )
  }

  // Aggregate 7 collections в параллель — sequential await был узким местом
  // (E2 cr-panel review): 7 round-trip к Postgres последовательно.
  const perCollectionResults = await Promise.all(
    COLLECTIONS.map((q) =>
      payload
        .find({
          collection: q.slug,
          where: { _status: { equals: 'published' } },
          limit: 1000,
          sort: '-updatedAt',
          depth: q.slug === 'service-districts' ? 1 : 0,
        })
        .then((res) => ({ q, docs: res.docs }))
        .catch(() => ({ q, docs: [] as Record<string, unknown>[] })),
    ),
  )

  const rows: CsvRow[] = []
  for (const { q, docs } of perCollectionResults) {
    for (const doc of docs) {
      const d = doc as Record<string, unknown>
      const slug = typeof d.slug === 'string' ? d.slug : String(d.id)
      const title =
        (typeof d.title === 'string' && d.title) ||
        (typeof d.computedTitle === 'string' && d.computedTitle) ||
        (typeof d.nameNominative === 'string' && d.nameNominative) ||
        slug

      let url = `${q.urlPrefix}${slug}/`
      if (q.slug === 'service-districts') {
        const service = d.service as { slug?: string } | null
        const district = d.district as { slug?: string } | null
        if (service?.slug && district?.slug) {
          url = `/${service.slug}/${district.slug}/`
        } else {
          continue
        }
      }

      const updatedAt =
        typeof d.updatedAt === 'string'
          ? d.updatedAt.split('T')[0]
          : new Date().toISOString().split('T')[0]

      rows.push({
        section: q.label,
        title,
        url,
        updatedAt,
        status: 'live',
        editUrl: `https://obikhod.ru/admin/collections/${q.slug}/${d.id}`,
      })
    }
  }

  // Build CSV
  const header = ['Раздел', 'Title', 'URL', 'Обновлено', 'Статус', 'Edit']
    .map(escapeCsvField)
    .join(',')
  const body = rows.map(rowToCsv).join('\n')
  const csv = `﻿${header}\n${body}\n` // UTF-8 BOM для Excel

  const today = new Date().toISOString().split('T')[0]
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="page-catalog-${today}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
