import Link from 'next/link'

import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'

import type { CtaAccent, CtaBannerBlock, CtaLink } from './types'

/**
 * Контрастный CTA-баннер.
 *
 * Поддерживает обе схемы (US-0 W3 Track B-3):
 *  - cw-схема: h2, body, ctaPrimary{label,href}, variant
 *  - legacy:    heading, cta{label,href}, accent, variant, ctaLabel/ctaHref
 *
 * Server component.
 */
const accentMap: Record<CtaAccent, { bg: string; text: string; btnClass: string }> = {
  primary: {
    bg: 'var(--c-primary)',
    text: 'var(--c-on-primary)',
    btnClass: 'btn-accent',
  },
  warning: {
    bg: 'var(--c-accent)',
    text: 'var(--c-ink)',
    btnClass: 'btn-primary',
  },
  success: {
    bg: 'var(--c-success)',
    text: 'var(--c-on-primary)',
    btnClass: 'btn-accent',
  },
}

function resolveAccent(block: CtaBannerBlock): CtaAccent {
  if (block.accent) return block.accent
  if (block.variant === 'accent') return 'warning'
  if (block.variant === 'dark') return 'primary' // dark всё равно тёмный фон — используем primary токены
  return 'primary'
}

function pickCta(block: CtaBannerBlock): CtaLink | null {
  if (block.ctaPrimary?.label || block.ctaPrimary?.href) return block.ctaPrimary
  if (block.cta?.label || block.cta?.href) return block.cta
  // Payload legacy `ctaLabel/ctaHref` (плоские поля).
  const legacy = block as unknown as { ctaLabel?: string; ctaHref?: string }
  if (legacy.ctaLabel && legacy.ctaHref) {
    return { label: legacy.ctaLabel, href: legacy.ctaHref }
  }
  return null
}

export function CtaBanner(block: CtaBannerBlock) {
  const accent = resolveAccent(block)
  const tokens = accentMap[accent]
  const isDark = block.variant === 'dark'
  const heading = block.h2 ?? block.heading ?? null
  const cta = pickCta(block)

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
      <div className="wrap">
        <div
          style={{
            background: isDark ? 'var(--c-ink)' : tokens.bg,
            color: tokens.text,
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(32px, 5vw, 64px)',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <div>
            {heading && (
              <h2 className="h-xl" style={{ color: tokens.text, margin: 0 }}>
                {heading}
              </h2>
            )}
            {block.body &&
              (typeof block.body === 'string' ? (
                <p
                  style={{
                    marginTop: 16,
                    fontSize: 'clamp(16px, 1.6vw, 19px)',
                    lineHeight: 1.5,
                    color:
                      accent === 'warning'
                        ? 'var(--c-ink-soft)'
                        : 'color-mix(in oklab, var(--c-on-primary) 85%, transparent)',
                    maxWidth: 640,
                  }}
                >
                  {block.body}
                </p>
              ) : (
                <div
                  style={{
                    marginTop: 16,
                    fontSize: 'clamp(16px, 1.6vw, 19px)',
                    lineHeight: 1.5,
                    color:
                      accent === 'warning'
                        ? 'var(--c-ink-soft)'
                        : 'color-mix(in oklab, var(--c-on-primary) 85%, transparent)',
                    maxWidth: 640,
                  }}
                >
                  <RichTextRenderer data={block.body} />
                </div>
              ))}
          </div>

          {cta?.label && cta?.href && (
            <div>
              <Link href={cta.href} className={`btn btn-lg ${tokens.btnClass}`}>
                {cta.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
