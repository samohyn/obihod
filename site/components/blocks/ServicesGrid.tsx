import Link from 'next/link'

import type { ServicesGridBlock, ServicesGridItem } from './types'

/**
 * Сетка карточек услуг с иконками.
 *
 * Контракт: US-0 sa-seo AC-2.5 «список карточек sub-services под pillar
 * (4-9 шт), иконки из реестра §9 brand-guide (services line: 22 иконки),
 * заголовок + ссылка».
 *
 * Сетка: 2-кол на mobile, 3-кол на md, 4-кол на lg.
 *
 * Иконка — placeholder div с инициалами/маркером линии (реальные SVG-glyph'ы
 * из brand-guide §9 подвозятся отдельным PR в site/components/icons/, не
 * блокируем US-0). Ключ icon хранится; при отсутствии иконки — рисуется
 * декоративный квадрат с символом услуги.
 *
 * Server component.
 */
function IconPlaceholder({ icon }: { icon?: string | null }) {
  // Берём первую букву после префикса (s-musor → М-как-маркер).
  const symbol =
    (icon ?? '')
      .replace(/^s-|^sh-|^d-|^c-/, '')
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

function Card({ item }: { item: ServicesGridItem }) {
  const href = item.slug.startsWith('/') ? item.slug : `/${item.slug}/`
  return (
    <Link
      href={href}
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
      <IconPlaceholder icon={item.icon} />
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
      {item.summary && (
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.5,
            color: 'var(--c-ink-soft)',
          }}
        >
          {item.summary}
        </p>
      )}
    </Link>
  )
}

export function ServicesGrid(block: ServicesGridBlock) {
  const items = (block.items ?? []).filter((it): it is ServicesGridItem =>
    Boolean(it && typeof it.title === 'string' && typeof it.slug === 'string'),
  )
  if (items.length === 0) return null

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
      <div className="wrap">
        {(block.eyebrow || block.heading) && (
          <header style={{ maxWidth: 760, marginBottom: 32 }}>
            {block.eyebrow && <span className="eyebrow">{block.eyebrow}</span>}
            {block.heading && (
              <h2 className="h-l" style={{ marginTop: block.eyebrow ? 12 : 0 }}>
                {block.heading}
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
          {items.map((it) => (
            <Card key={it.slug} item={it} />
          ))}
        </div>
      </div>
    </section>
  )
}
