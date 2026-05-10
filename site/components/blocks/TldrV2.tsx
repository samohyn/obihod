// brand-guide v2.6 §tldr-block (line 1889+)
// EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10 · fe role
//
// 3-5 bullets card-style с border-accent left, badge + title + checkmark bullets.
// Server component. Speakable атрибуты для нейровыдачи (sustained US-3).

import type { TldrV2Block } from './types'

export function TldrV2(block: TldrV2Block) {
  const bullets = (block.bullets ?? []).filter(Boolean)
  if (bullets.length === 0) return null

  const badge = block.badge ?? 'Кратко'
  const title = block.title ?? null

  return (
    <section
      id={block.anchor ?? undefined}
      style={{ padding: 'clamp(24px, 4vw, 40px) 0' }}
      data-speakable="true"
    >
      <div className="wrap">
        <aside className="sp-tldr-block" aria-label="Краткий ответ">
          <div className="sp-tldr-head">
            <span className="sp-tldr-badge">{badge}</span>
            {title && <p className="sp-tldr-title">{title}</p>}
          </div>
          <ul className="sp-tldr-list">
            {bullets.map((b, i) => (
              <li key={`tl-${i}`}>{b}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}
