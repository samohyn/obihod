import Link from 'next/link'

import { breadcrumbListSchema } from '@/lib/seo/jsonld'

import type { BreadcrumbItem, BreadcrumbsBlock } from './types'

/**
 * Хлебные крошки + JSON-LD BreadcrumbList.
 *
 * Поддерживает обе схемы (US-0 W3 Track B-3):
 *  - cw-схема: items[] = [{ label, href }, ...]
 *  - legacy:    items[] = [{ name, url }, ...]
 *
 * Renderer-приоритет: label → name; href → url.
 *
 * Server component. На главной (1 элемент) или при пустом списке — не рендерится.
 *
 * A11y: role="navigation" + aria-label="Хлебные крошки".
 * Текущая страница (последний элемент) рендерится без <a>, с aria-current="page".
 */

interface NormalizedItem {
  name: string
  url: string
}

function normalizeItem(it: BreadcrumbItem): NormalizedItem | null {
  const name = it.label ?? it.name ?? null
  const url = it.href ?? it.url ?? null
  if (!name || !url) return null
  return { name, url }
}

export function Breadcrumbs(block: BreadcrumbsBlock) {
  const rawItems = block.items ?? []
  const items = rawItems.map(normalizeItem).filter((it): it is NormalizedItem => Boolean(it))

  // Защита от пустого/одно-элементного списка (на главной).
  if (items.length < 2) return null

  const generateSchema = block.generateSchema !== false
  const schema = generateSchema ? breadcrumbListSchema(items) : null

  return (
    <nav
      id={block.anchor ?? undefined}
      aria-label="Хлебные крошки"
      role="navigation"
      style={{
        padding: '16px 0 0 0',
        background: 'var(--c-bg)',
      }}
    >
      <div className="wrap">
        <ol
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            lineHeight: 1.5,
            color: 'var(--c-ink-soft)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {items.map((it, i) => {
            const isLast = i === items.length - 1
            return (
              <li
                key={`${it.url}-${i}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                {isLast ? (
                  <span aria-current="page" style={{ color: 'var(--c-ink)', fontWeight: 500 }}>
                    {it.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={it.url}
                      style={{
                        color: 'var(--c-ink-soft)',
                        textDecoration: 'underline',
                        textDecorationColor:
                          'color-mix(in oklab, var(--c-ink-soft) 30%, transparent)',
                        textUnderlineOffset: '3px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        minHeight: 44,
                        padding: '10px 0',
                      }}
                    >
                      {it.name}
                    </Link>
                    <span aria-hidden style={{ color: 'var(--c-ink-soft)', opacity: 0.5 }}>
                      /
                    </span>
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </div>

      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ '@context': 'https://schema.org', ...schema }),
          }}
        />
      )}
    </nav>
  )
}
