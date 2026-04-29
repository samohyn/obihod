import type { CSSProperties, FC } from 'react'

import { payloadClient } from '@/lib/payload'
import { EmptyState } from './EmptyErrorStates'

/**
 * PageCatalog — каталог опубликованных страниц на dashboard /admin.
 *
 * OBI-29 / Wave 3 из OBI-19 admin redesign. Anatomy — specs/
 * US-12-admin-redesign/art-concept-v2.md §3 + brand-guide.html §12.3.
 *
 * Запрос оператора (art-concept-v2 §3): «приходит в admin утром → видит
 * что выпустил вместо шарения по 8 коллекциям». Server component с REST
 * aggregation 7 коллекций.
 *
 * Не покрывает в Wave 3 (отдельные итерации в OBI-19 хвост):
 * - Filter dropdown ▾ (требует client-component с hover-state)
 * - CSV export (отдельный API endpoint)
 * - Click row → navigate (Payload навигация делается через Link, требует
 *   import из @payloadcms/ui — сложнее без проверки)
 *
 * RSC — Payload подхватывает через importMap.
 */

interface CatalogItem {
  id: string
  title: string
  url: string
  updatedAt: string
}

interface CatalogGroup {
  label: string
  count: number
  items: CatalogItem[]
  collectionSlug: string
}

const wrapStyle: CSSProperties = {
  padding: '24px 32px',
  fontFamily: 'var(--font-body)',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
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
  paddingBottom: 12,
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

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
}

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '8px 12px',
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--brand-obihod-muted, #6b6256)',
  background: 'var(--brand-obihod-paper, #f7f5f0)',
  borderBottom: '1px solid var(--brand-obihod-line, #e6e1d6)',
}

const tdStyle: CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--brand-obihod-paper-warm, #efebe0)',
  verticalAlign: 'middle',
}

const sectionLabelStyle: CSSProperties = {
  fontWeight: 600,
  color: 'var(--brand-obihod-ink, #1c1c1c)',
}

const urlStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--brand-obihod-ink-soft, #2b2b2b)',
}

const dateStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--brand-obihod-muted, #6b6256)',
}

const statusLiveStyle: CSSProperties = {
  color: 'var(--brand-obihod-primary, #2d5a3d)',
  fontWeight: 600,
}

const emptyStyle: CSSProperties = {
  ...tdStyle,
  textAlign: 'center',
  color: 'var(--brand-obihod-muted, #6b6256)',
  padding: '20px 12px',
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

async function loadCatalog(): Promise<{ groups: CatalogGroup[]; total: number }> {
  try {
    const payload = await payloadClient()
    const queries = [
      { slug: 'services' as const, label: 'Услуги', urlPrefix: '/' },
      { slug: 'service-districts' as const, label: 'Programmatic SD', urlPrefix: '' },
      { slug: 'cases' as const, label: 'Кейсы', urlPrefix: '/kejsy/' },
      { slug: 'blog' as const, label: 'Блог', urlPrefix: '/blog/' },
      { slug: 'b2b-pages' as const, label: 'B2B', urlPrefix: '/b2b/' },
      { slug: 'authors' as const, label: 'Авторы', urlPrefix: '/avtory/' },
      { slug: 'districts' as const, label: 'Районы', urlPrefix: '/raiony/' },
    ]

    const groups: CatalogGroup[] = []
    let total = 0

    for (const q of queries) {
      try {
        const res = await payload.find({
          collection: q.slug,
          where: { _status: { equals: 'published' } },
          limit: 50,
          sort: '-updatedAt',
          depth: q.slug === 'service-districts' ? 1 : 0,
        })

        const items: CatalogItem[] = []
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
          })
        }

        if (items.length > 0) {
          groups.push({ label: q.label, count: items.length, items, collectionSlug: q.slug })
          total += items.length
        }
      } catch {
        // коллекция может быть недоступна (миграция, БД пустая) — пропускаем
      }
    }

    return { groups, total }
  } catch {
    return { groups: [], total: 0 }
  }
}

export const PageCatalog: FC = async () => {
  const { groups, total } = await loadCatalog()

  return (
    <section style={wrapStyle} aria-label="Каталог опубликованных страниц">
      <header style={headerStyle}>
        <h2 style={titleStyle}>Каталог опубликованных страниц</h2>
        <span style={counterStyle}>{total} шт.</span>
      </header>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Раздел</th>
            <th style={thStyle}>URL</th>
            <th style={thStyle}>Обновлено</th>
            <th style={thStyle}>Статус</th>
            <th style={thStyle} aria-hidden="true">
              {' '}
            </th>
          </tr>
        </thead>
        <tbody>
          {groups.length === 0 ? (
            <tr>
              <td colSpan={5} style={emptyStyle}>
                <EmptyState
                  title="Пока нет опубликованных страниц"
                  text="Откройте коллекцию и опубликуйте первую запись — она появится здесь и в каталоге сайта."
                  actionLabel="Открыть Услуги"
                  actionHref="/admin/collections/services"
                />
              </td>
            </tr>
          ) : (
            groups.flatMap((group) =>
              group.items.map((item, idx) => {
                const editHref = `/admin/collections/${group.collectionSlug}/${item.id}`
                return (
                  <tr key={`${group.label}-${item.id}`}>
                    <td style={tdStyle}>
                      {idx === 0 ? (
                        <span style={sectionLabelStyle}>
                          {group.label}{' '}
                          <span
                            style={{
                              color: 'var(--brand-obihod-muted, #6b6256)',
                              fontWeight: 400,
                            }}
                          >
                            ({group.count})
                          </span>
                        </span>
                      ) : null}
                    </td>
                    <td style={{ ...tdStyle, ...urlStyle }}>{item.url}</td>
                    <td style={{ ...tdStyle, ...dateStyle }}>{formatDate(item.updatedAt)}</td>
                    <td style={tdStyle}>
                      <span style={statusLiveStyle}>✓ live</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <a
                        href={editHref}
                        style={{
                          color: 'var(--brand-obihod-primary, #2d5a3d)',
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                        aria-label={`Открыть «${item.title}» в редакторе`}
                      >
                        →
                      </a>
                    </td>
                  </tr>
                )
              }),
            )
          )}
        </tbody>
      </table>
    </section>
  )
}

export default PageCatalog
