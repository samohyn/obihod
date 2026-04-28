import type { CSSProperties, FC } from 'react'
import Link from 'next/link'
import { payloadClient } from '@/lib/payload'

/**
 * PageCatalogWidget — компактный widget на dashboard с top-6 last-updated
 * страницами из 7 коллекций (Wave 3 · PAN-6 part 1).
 *
 * Decision popanel Q2 (2026-04-28): отдельная страница `/admin/catalog`
 * + компактный widget на dashboard (top-6). Этот компонент — widget.
 *
 * Существующий `PageCatalog.tsx` остаётся как full-table вариант для будущей
 * `/admin/catalog` route (Wave 3 part 2). Сейчас `afterDashboard` указывает
 * на этот widget вместо full-table.
 *
 * brand-guide §12.3 (compact widget anatomy).
 *
 * RSC — Payload подхватывает через importMap. ADR-0005 уровень 2.
 */

interface CatalogItem {
  id: string
  title: string
  url: string
  updatedAt: string
  collectionLabel: string
  collectionSlug: string
}

const wrapStyle: CSSProperties = {
  padding: '20px 24px',
  fontFamily: 'var(--font-body)',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  background: 'var(--brand-obihod-card, #ffffff)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius, 10px)',
  maxWidth: 1080,
  marginTop: 32,
}

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 12,
  borderBottom: '1px solid var(--brand-obihod-line, #e6e1d6)',
  paddingBottom: 10,
}

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  margin: 0,
}

const counterStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--brand-obihod-muted, #6b6256)',
}

const listStyle: CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
}

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 12,
  padding: '8px 0',
  borderBottom: '1px solid var(--brand-obihod-paper-warm, #efebe0)',
  fontSize: 13,
}

const itemLastStyle: CSSProperties = {
  ...itemStyle,
  borderBottom: 'none',
}

const labelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--brand-obihod-muted, #6b6256)',
  flex: '0 0 auto',
  minWidth: 110,
}

const titleCellStyle: CSSProperties = {
  flex: '1 1 auto',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const urlStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--brand-obihod-muted, #6b6256)',
  flex: '0 1 auto',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: 280,
}

const dateStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--brand-obihod-muted, #6b6256)',
  flex: '0 0 auto',
  minWidth: 48,
  textAlign: 'right' as const,
}

const linkStyle: CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.04em',
  color: 'var(--brand-obihod-primary, #2d5a3d)',
  textDecoration: 'none',
  alignSelf: 'flex-end',
}

const emptyStyle: CSSProperties = {
  fontSize: 13,
  color: 'var(--brand-obihod-muted, #6b6256)',
  padding: '12px 0',
  textAlign: 'center' as const,
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${month}-${day}`
  } catch {
    return ''
  }
}

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

const TOP_N = 6

async function loadTopN(): Promise<{ items: CatalogItem[]; total: number }> {
  try {
    const payload = await payloadClient()
    const items: CatalogItem[] = []
    let total = 0

    for (const q of COLLECTIONS) {
      try {
        const res = await payload.find({
          collection: q.slug,
          where: { _status: { equals: 'published' } },
          limit: TOP_N,
          sort: '-updatedAt',
          depth: q.slug === 'service-districts' ? 1 : 0,
        })
        total += res.totalDocs ?? res.docs.length

        for (const doc of res.docs) {
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

          items.push({
            id: String(d.id),
            title,
            url,
            updatedAt: typeof d.updatedAt === 'string' ? d.updatedAt : new Date().toISOString(),
            collectionLabel: q.label,
            collectionSlug: q.slug,
          })
        }
      } catch {
        // коллекция может быть недоступна (миграция, БД пустая) — пропускаем
      }
    }

    // Sort across all collections by updatedAt desc, take top N
    items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))

    return { items: items.slice(0, TOP_N), total }
  } catch {
    return { items: [], total: 0 }
  }
}

export const PageCatalogWidget: FC = async () => {
  const { items, total } = await loadTopN()

  return (
    <section style={wrapStyle} aria-label="Свежие изменения каталога">
      <header style={headerStyle}>
        <h2 style={titleStyle}>Свежие изменения</h2>
        <span style={counterStyle}>
          {items.length > 0 ? `${items.length} из ${total} стр.` : `${total} стр.`}
        </span>
      </header>

      {items.length === 0 ? (
        <p style={emptyStyle}>
          Опубликованных страниц пока нет.{' '}
          <Link href="/admin/collections/services">Открыть Услуги →</Link>
        </p>
      ) : (
        <ul style={listStyle}>
          {items.map((item, idx) => {
            const editHref = `/admin/collections/${item.collectionSlug}/${item.id}`
            const isLast = idx === items.length - 1
            return (
              <li
                key={`${item.collectionSlug}-${item.id}`}
                style={isLast ? itemLastStyle : itemStyle}
              >
                <span style={labelStyle}>{item.collectionLabel}</span>
                <Link
                  href={editHref}
                  style={titleCellStyle}
                  aria-label={`Открыть «${item.title}» в редакторе`}
                >
                  {item.title}
                </Link>
                <span style={urlStyle}>{item.url}</span>
                <span style={dateStyle}>{formatDate(item.updatedAt)}</span>
              </li>
            )
          })}
        </ul>
      )}

      <Link href="/admin/catalog" style={linkStyle}>
        Открыть полный каталог →
      </Link>
    </section>
  )
}

export default PageCatalogWidget
