// brand-guide v2.6 §district-chips (line 1964+)
// EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10 · fe role
//
// 30 city links grid pills с arrow indicator. Priority chip — accent border.
// Server component. Mobile: 2-col @≤600px, 1-col @≤414px.

import Link from 'next/link'

import type { DistrictChipsBlock } from './types'

export function DistrictChips(block: DistrictChipsBlock) {
  const items = block.items ?? []
  if (items.length === 0) return null

  const title = block.title ?? 'Работаем по районам Москвы и МО'
  const meta = block.meta ?? `${items.length} районов`

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
      <div className="wrap">
        <div className="sp-district-chips">
          <div className="sp-dc-head">
            <h2 className="sp-dc-title">{title}</h2>
            <span className="sp-dc-meta">{meta}</span>
          </div>
          <ul className="sp-dc-grid" aria-label="Районы и города">
            {items.map((chip, i) => (
              <li key={`chip-${i}`}>
                <Link href={chip.href} className={`sp-dc-chip ${chip.priority ? 'priority' : ''}`}>
                  <span>{chip.label}</span>
                  <span className="sp-dc-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
