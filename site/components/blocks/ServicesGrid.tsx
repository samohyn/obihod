import Link from 'next/link'

import type { ServicesGridBlock, ServicesGridItem } from './types'

/**
 * Сетка карточек услуг с иконками.
 *
 * Поддерживает обе схемы (US-0 W3 Track B-3):
 *  - cw-схема: items[] = { title, description, href, iconId, priceAnchor }
 *  - legacy:    items[] = { title, slug, icon, summary }
 *
 * Renderer-приоритет: href → /<slug>/, iconId → icon, description → summary.
 *
 * Server component.
 */

interface NormalizedItem {
  title: string
  href: string
  description?: string | null
  iconId?: string | null
  priceAnchor?: string | null
}

function normalizeItem(it: ServicesGridItem): NormalizedItem | null {
  const title = it.title ?? null
  const href = it.href ?? (it.slug ? (it.slug.startsWith('/') ? it.slug : `/${it.slug}/`) : null)
  if (!title || !href) return null
  return {
    title,
    href,
    description: it.description ?? it.summary ?? null,
    iconId: it.iconId ?? it.icon ?? null,
    priceAnchor: it.priceAnchor ?? null,
  }
}

function IconPlaceholder({ icon }: { icon?: string | null }) {
  const symbol =
    (icon ?? '')
      .replace(/^s-|^sh-|^d-|^c-|^vyvoz-|^arboristika|^chistka-|^demontazh/, '')
      .slice(0, 1)
      .toUpperCase() || '·'
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
        borderRadius: 'var(--radius-sm)',
        background: 'color-mix(in oklab, var(--c-primary) 12%, var(--c-bg))',
        color: 'var(--c-primary)',
        fontFamily: 'var(--font-mono)',
        fontSize: 18,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {symbol}
    </span>
  )
}

function Card({ item }: { item: NormalizedItem }) {
  return (
    <Link
      href={item.href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 'clamp(16px, 2vw, 24px)',
        borderRadius: 'var(--radius)',
        background: 'var(--c-bg)',
        border: '1px solid var(--c-line, color-mix(in oklab, var(--c-ink) 10%, transparent))',
        textDecoration: 'none',
        color: 'var(--c-ink)',
        minHeight: 132,
        transition: 'border-color 120ms ease, transform 120ms ease',
      }}
      className="services-grid-card"
    >
      <IconPlaceholder icon={item.iconId} />
      <h3
        style={{
          margin: 0,
          fontSize: 'clamp(16px, 1.6vw, 18px)',
          lineHeight: 1.3,
          fontWeight: 600,
          color: 'var(--c-ink)',
        }}
      >
        {item.title}
      </h3>
      {item.description && (
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.5,
            color: 'var(--c-ink-soft)',
          }}
        >
          {item.description}
        </p>
      )}
      {item.priceAnchor && (
        <span
          style={{
            marginTop: 'auto',
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
            color: 'var(--c-primary)',
            fontWeight: 600,
          }}
        >
          {item.priceAnchor}
        </span>
      )}
    </Link>
  )
}

export function ServicesGrid(block: ServicesGridBlock) {
  const items = (block.items ?? [])
    .map(normalizeItem)
    .filter((it): it is NormalizedItem => Boolean(it))

  if (items.length === 0) return null

  const heading = block.h2 ?? block.heading ?? null

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
      <div className="wrap">
        {(block.eyebrow || heading) && (
          <header style={{ maxWidth: 760, marginBottom: 32 }}>
            {block.eyebrow && <span className="eyebrow">{block.eyebrow}</span>}
            {heading && (
              <h2 className="h-l" style={{ marginTop: block.eyebrow ? 12 : 0 }}>
                {heading}
              </h2>
            )}
          </header>
        )}

        <div
          style={{
            display: 'grid',
            gap: 'clamp(12px, 1.5vw, 20px)',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
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
