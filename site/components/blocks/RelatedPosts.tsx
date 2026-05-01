import Link from 'next/link'

import type { RelatedPostsBlock, RelatedPostItem } from './types'

/**
 * Карточки статей блога — для author-эталона (cw-схема).
 *
 * cw fixture `author.json` использует blockType `related-posts` с items =
 * [{ title, href, description, publishedAt }, ...]. Это специализированный
 * близнец RelatedServices, но для блога.
 *
 * Server component.
 */
interface NormalizedItem {
  title: string
  href: string
  description?: string | null
  publishedAt?: string | null
}

function normalize(it: RelatedPostItem): NormalizedItem | null {
  if (!it.title || !it.href) return null
  return {
    title: it.title,
    href: it.href,
    description: it.description ?? null,
    publishedAt: it.publishedAt ?? null,
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
        minHeight: 132,
      }}
      className="related-post-card"
    >
      {item.publishedAt && (
        <span
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--c-ink-soft)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {new Date(item.publishedAt).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
          })}
        </span>
      )}
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
        Читать →
      </span>
    </Link>
  )
}

export function RelatedPosts(block: RelatedPostsBlock) {
  const items = (block.items ?? []).map(normalize).filter((it): it is NormalizedItem => Boolean(it))

  if (items.length === 0) return null

  const heading = block.h2 ?? 'Статьи автора'

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
