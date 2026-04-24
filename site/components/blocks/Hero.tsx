import Image from 'next/image'
import Link from 'next/link'

import type { HeroBlock } from './types'

/**
 * Hero-блок для публичного рендера.
 *
 * seasonalTheme задаёт accent:
 *  - summer → зелёный (primary) — дефолт летней волны (арбористика, вывоз мусора)
 *  - winter → синий (на --c-primary-ink подменой) — чистка крыш
 *  - promo  → янтарный (accent) — акции и промо-посадочные
 *
 * Server component (картинка через next/image).
 */
const themeTokens: Record<
  NonNullable<HeroBlock['seasonalTheme']>,
  { bg: string; badgeBg: string; badgeText: string; accent: string }
> = {
  summer: {
    bg: 'var(--c-primary)',
    badgeBg: 'color-mix(in oklab, var(--c-primary) 12%, var(--c-bg))',
    badgeText: 'var(--c-primary-ink)',
    accent: 'var(--c-primary)',
  },
  winter: {
    bg: '#1e3a5f',
    badgeBg: 'color-mix(in oklab, #1e3a5f 12%, var(--c-bg))',
    badgeText: '#1e3a5f',
    accent: '#1e3a5f',
  },
  promo: {
    bg: 'var(--c-accent)',
    badgeBg: 'color-mix(in oklab, var(--c-accent) 18%, var(--c-bg))',
    badgeText: 'var(--c-accent-ink)',
    accent: 'var(--c-accent-ink)',
  },
}

function mediaUrl(m: HeroBlock['backgroundMedia']): string | null {
  if (!m) return null
  if (typeof m === 'string') return m
  return m.url ?? null
}

function mediaAlt(m: HeroBlock['backgroundMedia']): string {
  if (!m || typeof m === 'string') return ''
  return m.alt ?? ''
}

export function Hero(block: HeroBlock) {
  const theme = block.seasonalTheme ?? 'summer'
  const tokens = themeTokens[theme]
  const bgUrl = mediaUrl(block.backgroundMedia)
  const overlay = Math.max(0, Math.min(100, block.overlayOpacity ?? 40)) / 100

  const primary = block.primaryCta
  const secondary = block.secondaryCta

  return (
    <section
      id={block.anchor ?? undefined}
      className="relative overflow-hidden"
      style={{
        padding: 'clamp(64px, 10vw, 120px) 0',
        background: bgUrl ? '#1c1c1c' : 'var(--c-bg-alt)',
        color: bgUrl ? 'var(--c-on-primary)' : 'var(--c-ink)',
      }}
    >
      {bgUrl && (
        <>
          <Image
            src={bgUrl}
            alt={mediaAlt(block.backgroundMedia)}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: 'cover', zIndex: 0 }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: '#000',
              opacity: overlay,
              zIndex: 1,
            }}
          />
        </>
      )}

      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        <span
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: 999,
            background: bgUrl ? 'rgba(255,255,255,0.14)' : tokens.badgeBg,
            color: bgUrl ? 'var(--c-on-primary)' : tokens.badgeText,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          {theme === 'winter' ? 'Зима' : theme === 'promo' ? 'Акция' : 'Сезон работ'}
        </span>

        {block.heading && (
          <h1
            className="h-display"
            style={{
              maxWidth: 960,
              color: bgUrl ? 'var(--c-on-primary)' : 'var(--c-ink)',
            }}
          >
            {block.heading}
          </h1>
        )}

        {block.subheading && (
          <p
            className="lead"
            style={{
              marginTop: 24,
              maxWidth: 640,
              color: bgUrl
                ? 'color-mix(in oklab, var(--c-on-primary) 85%, transparent)'
                : 'var(--c-ink-soft)',
            }}
          >
            {block.subheading}
          </p>
        )}

        {(primary?.label || secondary?.label) && (
          <div
            style={{
              display: 'flex',
              gap: 12,
              marginTop: 40,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {primary?.label && primary?.href && (
              <Link
                href={primary.href}
                className={`btn btn-lg ${primary.variant === 'ghost' ? 'btn-ghost' : 'btn-primary'}`}
                style={
                  primary.variant !== 'ghost'
                    ? {
                        background: tokens.bg,
                        color: theme === 'promo' ? 'var(--c-ink)' : 'var(--c-on-primary)',
                      }
                    : undefined
                }
              >
                {primary.label}
              </Link>
            )}
            {secondary?.label && secondary?.href && (
              <Link
                href={secondary.href}
                className="btn btn-ghost btn-lg"
                style={
                  bgUrl
                    ? { color: 'var(--c-on-primary)', borderColor: 'rgba(255,255,255,0.4)' }
                    : undefined
                }
              >
                {secondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
