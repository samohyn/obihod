import Link from 'next/link'

import type { RelatedServiceItem, RelatedServicesBlock } from './types'

/**
 * 3 карточки cross-link на pillar/sub-services.
 *
 * Контракт: US-0 sa-seo AC-2.5 «RelatedServices — 3 карточки cross-link
 * (на соседние pillar/sub)». 1..3 элементов; больше — обрезается.
 *
 * Server component.
 */
function Card({ item }: { item: RelatedServiceItem }) {
  const href = item.slug.startsWith('/') ? item.slug : `/${item.slug}/`
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 'clamp(16px, 2.4vw, 24px)',
        borderRadius: 'var(--radius)',
        background: 'var(--c-bg)',
        border: '1px solid var(--c-line, color-mix(in oklab, var(--c-ink) 10%, transparent))',
        textDecoration: 'none',
        color: 'var(--c-ink)',
        minHeight: 120,
        transition: 'border-color 120ms ease',
      }}
      className="related-service-card"
    >
      <h3
        style={{
          margin: 0,
          fontSize: 'clamp(16px, 1.6vw, 19px)',
          lineHeight: 1.3,
          fontWeight: 600,
        }}
      >
        {item.title}
      </h3>
      {item.summary && (
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--c-ink-soft)' }}>
          {item.summary}
        </p>
      )}
      <span
        aria-hidden
        style={{
          marginTop: 'auto',
          fontSize: 13,
          color: 'var(--c-primary)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        Подробнее →
      </span>
    </Link>
  )
}

export function RelatedServices(block: RelatedServicesBlock) {
  const items = (block.items ?? [])
    .filter((it): it is RelatedServiceItem =>
      Boolean(it && typeof it.title === 'string' && typeof it.slug === 'string'),
    )
    .slice(0, 3)

  if (items.length === 0) return null

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
      <div className="wrap">
        <h2 className="h-l" style={{ marginBottom: 32, maxWidth: 760 }}>
          {block.heading ?? 'Похожие услуги'}
        </h2>
        <div
          style={{
            display: 'grid',
            gap: 'clamp(12px, 1.5vw, 20px)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          }}
        >
          {items.map((it) => (
            <Card key={it.slug} item={it} />
          ))}
        </div>
      </div>
    </section>
  )
}
