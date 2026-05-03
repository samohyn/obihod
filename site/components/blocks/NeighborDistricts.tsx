import Link from 'next/link'

import type { NeighborDistrictItem, NeighborDistrictsBlock } from './types'

/**
 * 3 ближайших района.
 *
 * Поддерживает обе схемы (US-0 W3 Track B-3):
 *  - cw-схема: items[] = { name|label, href, distance }
 *  - legacy:    items[] = { name, slug, distance }
 *
 * Если задан `serviceSlug` — ссылки на /<service>/<district>/, иначе fallback
 * на href (если cw уже передал) или /raiony/<slug>/.
 *
 * Server component.
 */

interface NormalizedItem {
  name: string
  href: string
  distance?: string | null
}

function buildHref(item: NeighborDistrictItem, serviceSlug?: string | null): string | null {
  // cw уже передал готовый href
  if (item.href) {
    if (serviceSlug && item.slug) {
      const svc = serviceSlug.replace(/^\/+|\/+$/g, '')
      return `/${svc}/${item.slug}/`
    }
    return item.href
  }
  if (!item.slug) return null
  if (serviceSlug) {
    const svc = serviceSlug.replace(/^\/+|\/+$/g, '')
    return `/${svc}/${item.slug}/`
  }
  return `/raiony/${item.slug}/`
}

function normalizeItem(
  it: NeighborDistrictItem,
  serviceSlug?: string | null,
): NormalizedItem | null {
  const name = it.name ?? it.label ?? null
  const href = buildHref(it, serviceSlug)
  if (!name || !href) return null
  return { name, href, distance: it.distance ?? null }
}

function Card({ item }: { item: NormalizedItem }) {
  return (
    <Link
      href={item.href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: 'clamp(14px, 2vw, 20px)',
        borderRadius: 'var(--radius)',
        background: 'var(--c-bg)',
        border: '1px solid var(--c-line, color-mix(in oklab, var(--c-ink) 10%, transparent))',
        textDecoration: 'none',
        color: 'var(--c-ink)',
        minHeight: 88,
      }}
      className="neighbor-district-card"
    >
      <span
        style={{
          fontSize: 16,
          fontWeight: 600,
          lineHeight: 1.25,
        }}
      >
        {item.name}
      </span>
      {item.distance && (
        <span
          style={{
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            color: 'var(--c-ink-soft)',
          }}
        >
          {item.distance}
        </span>
      )}
    </Link>
  )
}

export function NeighborDistricts(block: NeighborDistrictsBlock) {
  const items = (block.items ?? [])
    .map((it) => normalizeItem(it, block.serviceSlug))
    .filter((it): it is NormalizedItem => Boolean(it))
    .slice(0, 3)

  if (items.length === 0) return null

  const heading = block.h2 ?? block.heading ?? 'Соседние районы'

  return (
    <section
      id={block.anchor ?? undefined}
      style={{ padding: 'clamp(40px, 6vw, 72px) 0', background: 'var(--c-bg-alt)' }}
    >
      <div className="wrap">
        <h2
          className="h-m"
          style={{
            marginBottom: 24,
            fontSize: 'clamp(20px, 2.4vw, 26px)',
            maxWidth: 760,
          }}
        >
          {heading}
        </h2>
        <div
          style={{
            display: 'grid',
            gap: 'clamp(10px, 1.5vw, 16px)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          }}
        >
          {items.map((it, i) => (
            <Card key={`${it.href}-${i}`} item={it} />
          ))}
        </div>
      </div>
    </section>
  )
}
