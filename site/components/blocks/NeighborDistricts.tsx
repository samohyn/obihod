import Link from 'next/link'

import type { NeighborDistrictItem, NeighborDistrictsBlock } from './types'

/**
 * 3 ближайших района из District.relatedDistricts.
 *
 * Используется на /raiony/<district>/ и /<service>/<district>/.
 * Если задан serviceSlug — ссылки уходят на /<service>/<district>/,
 * иначе — на /raiony/<district>/ (district hub).
 *
 * Контракт: US-0 sa-seo AC-2.5 «NeighborDistricts — 3 ближайших района
 * из District.relatedDistricts».
 *
 * Server component.
 */
function buildHref(districtSlug: string, serviceSlug?: string | null): string {
  if (serviceSlug) {
    const svc = serviceSlug.replace(/^\/+|\/+$/g, '')
    return `/${svc}/${districtSlug}/`
  }
  return `/raiony/${districtSlug}/`
}

function Card({ item, serviceSlug }: { item: NeighborDistrictItem; serviceSlug?: string | null }) {
  const href = buildHref(item.slug, serviceSlug)
  return (
    <Link
      href={href}
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
    .filter((it): it is NeighborDistrictItem =>
      Boolean(it && typeof it.name === 'string' && typeof it.slug === 'string'),
    )
    .slice(0, 3)

  if (items.length === 0) return null

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
          {block.heading ?? 'Соседние районы'}
        </h2>
        <div
          style={{
            display: 'grid',
            gap: 'clamp(10px, 1.5vw, 16px)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          }}
        >
          {items.map((it) => (
            <Card key={it.slug} item={it} serviceSlug={block.serviceSlug} />
          ))}
        </div>
      </div>
    </section>
  )
}
