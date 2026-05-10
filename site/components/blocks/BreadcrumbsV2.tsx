// brand-guide v2.6 §breadcrumbs (line 1826+)
// EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10 · fe role
//
// Mono uppercase крошки + chevron via CSS pseudo. BreadcrumbList JSON-LD.
// Server component.

import Link from 'next/link'

import { breadcrumbListSchema } from '@/lib/seo/jsonld'

import type { BreadcrumbItem, BreadcrumbsV2Block } from './types'

interface NormalizedItem {
  name: string
  url: string
}

function normalize(it: BreadcrumbItem): NormalizedItem | null {
  const name = it.label ?? it.name ?? null
  const url = it.href ?? it.url ?? null
  if (!name || !url) return null
  return { name, url }
}

export function BreadcrumbsV2(block: BreadcrumbsV2Block) {
  const raw = block.items ?? []
  const items = raw.map(normalize).filter((it): it is NormalizedItem => Boolean(it))
  if (items.length < 2) return null

  const generateSchema = block.generateSchema !== false
  const schema = generateSchema ? breadcrumbListSchema(items) : null

  return (
    <nav id={block.anchor ?? undefined} aria-label="Хлебные крошки" className="sp-breadcrumbs">
      <div className="wrap" style={{ padding: '12px var(--pad)' }}>
        <ol>
          {items.map((it, i) => {
            const isLast = i === items.length - 1
            return (
              <li key={`${it.url}-${i}`} aria-current={isLast ? 'page' : undefined}>
                {isLast ? <span>{it.name}</span> : <Link href={it.url}>{it.name}</Link>}
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
