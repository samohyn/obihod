import Link from 'next/link'

import type { CtaBannerBlock, CtaAccent } from './types'

/**
 * Контрастный CTA-баннер. Accent берётся из `accent` или `variant`:
 *  - primary → зелёный (--c-primary)
 *  - warning → янтарный (--c-accent)  [= variant=accent]
 *  - success → зелёный более светлый (--c-success)
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

export function CtaBanner(block: CtaBannerBlock) {
  const accent = resolveAccent(block)
  const tokens = accentMap[accent]
  const isDark = block.variant === 'dark'

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
            {block.heading && (
              <h2 className="h-xl" style={{ color: tokens.text, margin: 0 }}>
                {block.heading}
              </h2>
            )}
            {block.body && (
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
            )}
          </div>

          {block.cta?.label && block.cta?.href && (
            <div>
              <Link href={block.cta.href} className={`btn btn-lg ${tokens.btnClass}`}>
                {block.cta.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
