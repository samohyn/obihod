// brand-guide v2.6 §pricing-table (line 1236+)
// EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10 · fe role
//
// 3 variants: tiers (3-tier highlighted middle) / list (single-list) / per-district.
// tabular-nums per brand-guide §type. Mobile collapse — accordion-cards.
// Server component.

import Link from 'next/link'

import type { PricingTableBlock } from './types'

export function PricingTable(block: PricingTableBlock) {
  const tiers = block.tiers ?? []
  if (tiers.length === 0) return null

  const heading = block.h2 ?? null
  const helper = block.helper ?? null

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
      <div className="wrap">
        {heading && (
          <h2 className="h-l" style={{ marginBottom: helper ? 12 : 24, maxWidth: 760 }}>
            {heading}
          </h2>
        )}
        {helper && (
          <p
            className="lead"
            style={{ marginBottom: 32, maxWidth: 720, color: 'var(--c-ink-soft)' }}
          >
            {helper}
          </p>
        )}

        <div className="sp-pricing-tiers" role="list" aria-label={heading ? undefined : 'Тарифы'}>
          {tiers.map((tier, i) => {
            const isHighlighted = Boolean(tier.highlighted)
            return (
              <article
                key={`tier-${i}`}
                className={`sp-pricing-tier ${isHighlighted ? 'highlighted' : ''}`}
                role="listitem"
              >
                {isHighlighted && tier.badge && <span className="sp-tier-badge">{tier.badge}</span>}
                <h3 className="sp-tier-name">{tier.name}</h3>
                <div className="sp-tier-price">
                  <span className="from">от</span>
                  <span>{tier.price}</span>
                  {tier.unit && <span className="unit">/ {tier.unit}</span>}
                </div>
                {tier.tagline && <p className="sp-tier-tagline">{tier.tagline}</p>}
                {tier.features && tier.features.length > 0 && (
                  <ul className="sp-tier-features">
                    {tier.features.map((f, fi) => (
                      <li key={`f-${fi}`}>{f}</li>
                    ))}
                  </ul>
                )}
                {tier.ctaLabel && tier.ctaHref && (
                  <Link
                    href={tier.ctaHref}
                    className={`btn ${isHighlighted ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    {tier.ctaLabel}
                  </Link>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
