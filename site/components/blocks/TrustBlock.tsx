// brand-guide v2.6 §trust-block (line 1445+)
// EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10 · fe role
//
// 3 variants:
//  - bar (4-pill hero-adjacent, compact)
//  - cards-4 (pricing-adjacent)
//  - cards-6 (pre-footer)
// Server component.

import Link from 'next/link'

import type { TrustBlockBlock, TrustItem } from './types'

function TrustCard({ item }: { item: TrustItem }) {
  const inner = (
    <>
      <span className="sp-trust-icon" aria-hidden>
        {/* Default doc-shield icon — line-art 1.5px */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="20"
          height="20"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </span>
      <div className="sp-trust-meta">
        <p className="sp-trust-label">{item.label}</p>
        {item.sub && <p className="sp-trust-sub">{item.sub}</p>}
      </div>
    </>
  )
  if (item.href) {
    return (
      <Link href={item.href} className="sp-trust-card">
        {inner}
      </Link>
    )
  }
  return <div className="sp-trust-card">{inner}</div>
}

export function TrustBlock(block: TrustBlockBlock) {
  const items = block.items ?? []
  if (items.length === 0) return null

  const variant = block.variant ?? 'cards-4'
  const title = block.title ?? null

  if (variant === 'bar') {
    return (
      <section
        id={block.anchor ?? undefined}
        style={{ padding: 'clamp(16px, 3vw, 32px) 0' }}
        aria-label={title ?? 'Доверие'}
      >
        <div className="wrap">
          <div className="sp-trust-block bar">
            {title && <p className="sp-trust-title">{title}</p>}
            <ul className="sp-trust-bar">
              {items.map((item, i) => (
                <li key={`pill-${i}`} className="sp-trust-pill">
                  {item.label}
                  {item.sub && <span className="sp-num">· {item.sub}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    )
  }

  const gridClass = variant === 'cards-6' ? 'cols-6' : 'cols-4'

  return (
    <section
      id={block.anchor ?? undefined}
      style={{ padding: 'clamp(32px, 5vw, 64px) 0' }}
      aria-label={title ?? 'Доверие'}
    >
      <div className="wrap">
        <div className="sp-trust-block">
          {title && <p className="sp-trust-title">{title}</p>}
          <div className={`sp-trust-grid ${gridClass}`}>
            {items.map((item, i) => (
              <TrustCard key={`card-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
