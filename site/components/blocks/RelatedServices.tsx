import Link from 'next/link'

import type { RelatedServiceItem, RelatedServicesBlock } from './types'

/**
 * 3 карточки cross-link на pillar/sub-services.
 *
 * Поддерживает обе схемы (US-0 W3 Track B-3):
 *  - cw-схема: items[] = { title, description, href, iconId }
 *  - legacy:    items[] = { title, slug, summary }
 *
 * 1..3 элементов; больше — обрезается.
 *
 * Server component.
 */
interface NormalizedItem {
  title: string
  href: string
  description?: string | null
  iconId?: string | null
}

function normalizeItem(it: RelatedServiceItem): NormalizedItem | null {
  const title = it.title ?? null
  const href = it.href ?? (it.slug ? (it.slug.startsWith('/') ? it.slug : `/${it.slug}/`) : null)
  if (!title || !href) return null
  return {
    title,
    href,
    description: it.description ?? it.summary ?? null,
    iconId: it.iconId ?? null,
  }
}

function Card({ item }: { item: NormalizedItem }) {
  return (
    <Link
      href={item.href}
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
      {item.description && (
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--c-ink-soft)' }}>
          {item.description}
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
    .map(normalizeItem)
    .filter((it): it is NormalizedItem => Boolean(it))
    .slice(0, 3)

  if (items.length === 0) return null

  const heading = block.h2 ?? block.heading ?? 'Похожие услуги'

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
      <div className="wrap">
        <h2 className="h-l" style={{ marginBottom: 32, maxWidth: 760 }}>
          {heading}
        </h2>
        <div
          style={{
            display: 'grid',
            gap: 'clamp(12px, 1.5vw, 20px)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
