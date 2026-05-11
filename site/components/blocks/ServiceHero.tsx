// brand-guide v2.6 §service-hero (line 858+)
// EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10 · fe role
//
// T2 pillar variant: H1 + USP × 3 + dual-CTA (photo→quote primary + phone secondary)
// + 4 trust-pills + photo BG (4:5 aspect, hidden on T3/T4 per brand-guide §service-hero).
//
// Server component — no client interactivity. Photo через next/image для LCP.
// Mobile-first: stack vertical 375px, photo на top, USP single-col.

import Image from 'next/image'
import Link from 'next/link'

import { toStringList, type ServiceHeroBlock } from './types'

function pickHref(cta?: { href?: string | null } | null): string | null {
  return cta?.href ?? null
}

function pickLabel(cta?: { label?: string | null } | null): string | null {
  return cta?.label ?? null
}

export function ServiceHero(block: ServiceHeroBlock) {
  const variant = block.variant ?? 'T2_PILLAR'
  const variantClass = variant === 'T3_SUB' ? 't3' : variant === 'T4_SD' ? 't4' : ''
  const eyebrow = block.eyebrow ?? null
  const h1 = block.h1 ?? null
  const strapline = block.strapline ?? null
  const usps = block.usps ?? []
  const trust = toStringList(block.trust)
  const primaryHref = pickHref(block.ctaPrimary) ?? '#calculator'
  const primaryLabel = pickLabel(block.ctaPrimary) ?? 'Загрузить фото — получить смету'
  const secondaryHref = pickHref(block.ctaSecondary) ?? null
  const secondaryLabel = pickLabel(block.ctaSecondary) ?? null
  const imageSrc = block.image?.src ?? null
  const imageAlt = block.image?.alt ?? h1 ?? ''
  const photoTag = block.photoTag ?? null
  const showPhoto = variant === 'T2_PILLAR'

  return (
    <section
      id={block.anchor ?? undefined}
      style={{ padding: 'clamp(24px, 4vw, 48px) 0' }}
      aria-labelledby={h1 ? 'sp-hero-h1' : undefined}
    >
      <div className="wrap">
        <div className={`sp-hero ${variantClass}`}>
          <div>
            {eyebrow && <p className="sp-hero-eyebrow">{eyebrow}</p>}
            {h1 && <h1 id="sp-hero-h1">{h1}</h1>}
            {strapline && <p className="sp-hero-strapline">{strapline}</p>}

            {usps.length > 0 && (
              <ul className="sp-hero-usp">
                {usps.map((u, i) => (
                  <li key={`usp-${i}`}>
                    {u.num && <span className="usp-num">{u.num}</span>}
                    <span>{u.text}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="sp-hero-cta-row">
              <Link href={primaryHref} className="sp-btn-photo">
                <span className="ic" aria-hidden>
                  {/* line-art camera icon — 1.5px stroke per brand-guide §icons */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="14"
                    height="14"
                  >
                    <path d="M3 7h3l2-2h8l2 2h3v12H3z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </span>
                {primaryLabel}
              </Link>
              {secondaryHref && secondaryLabel && (
                <a href={secondaryHref} className="sp-btn-phone">
                  <span className="ic" aria-hidden>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="16"
                      height="16"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.91.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  {secondaryLabel}
                </a>
              )}
            </div>

            {trust.length > 0 && (
              <ul className="sp-hero-trust" aria-label="Гарантии и доверие">
                {trust.map((t, i) => (
                  <li key={`trust-${i}`}>{t}</li>
                ))}
              </ul>
            )}
          </div>

          {showPhoto && (
            <div className="sp-hero-photo">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                  style={{ objectFit: 'cover' }}
                />
              ) : null}
              {photoTag && <span className="sp-photo-tag">{photoTag}</span>}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
