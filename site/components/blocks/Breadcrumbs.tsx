import Link from 'next/link'

import { breadcrumbListSchema } from '@/lib/seo/jsonld'

import type { BreadcrumbsBlock } from './types'

/**
 * Хлебные крошки + JSON-LD BreadcrumbList.
 *
 * Server component. На главной (1 элемент) или при пустом списке — не рендерится
 * (защита от <li> с одним элементом и от мусорной разметки).
 *
 * A11y: role="navigation" + aria-label="Хлебные крошки".
 * Текущая страница (последний элемент) рендерится без <a>, с aria-current="page".
 *
 * Контракт: brand-guide §10 Nav, US-0 sa-seo AC-2.5 «Breadcrumbs — UI +
 * BreadcrumbList JSON-LD schema (генератор из site/lib/seo/jsonld.ts)».
 */
export function Breadcrumbs(block: BreadcrumbsBlock) {
  const items = (block.items ?? []).filter((it): it is { name: string; url: string } =>
    Boolean(it && typeof it.name === 'string' && typeof it.url === 'string'),
  )

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
