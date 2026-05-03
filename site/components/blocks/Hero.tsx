import Image from 'next/image'
import Link from 'next/link'

import type { CtaLink, HeroBlock, HeroImage, MediaRef } from './types'

/**
 * Hero-блок для публичного рендера.
 *
 * Поддерживает обе схемы (US-0 W3 Track B-3 Consolidation):
 *  - cw-схема: h1, eyebrow, subUsp, ctaPrimary{label,href}, ctaSecondary,
 *    image{src,alt,width,height}, trustRow[]
 *  - legacy Track B-1 / Payload Block config: heading/title, subheading/subtitle,
 *    primaryCta, secondaryCta, backgroundMedia, ctaLabel+ctaHref
 *
 * Renderer-приоритет: новое поле → старое (h1 → heading → title).
 *
 * seasonalTheme задаёт accent.
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

/**
 * Universal media URL extractor — поддерживает HeroImage{src,...},
 * MediaRef{url,...}, string, или Payload upload-relationship `{id, url}`.
 */
function pickMediaUrl(
  m: HeroImage | MediaRef | string | { url?: string | null } | null | undefined,
): string | null {
  if (!m) return null
  if (typeof m === 'string') return m
  // HeroImage cw-схема
  if ('src' in m && typeof m.src === 'string') return m.src
  // MediaRef / Payload upload
  if ('url' in m && typeof m.url === 'string') return m.url
  return null
}

function pickMediaAlt(m: HeroImage | MediaRef | string | null | undefined): string {
  if (!m || typeof m === 'string') return ''
  if ('alt' in m && typeof m.alt === 'string') return m.alt
  return ''
}

/**
 * Получить эффективный CTA: в cw-схеме ctaPrimary / ctaSecondary;
 * в Payload legacy-схеме — ctaLabel + ctaHref (для primary, secondary не было).
 */
function pickPrimaryCta(block: HeroBlock): CtaLink | null {
  if (block.ctaPrimary?.label || block.ctaPrimary?.href) return block.ctaPrimary
  if (block.primaryCta?.label || block.primaryCta?.href) return block.primaryCta
  // Payload legacy: ctaLabel/ctaHref как плоские поля.
  const legacy = block as unknown as { ctaLabel?: string; ctaHref?: string }
  if (legacy.ctaLabel && legacy.ctaHref) {
    return { label: legacy.ctaLabel, href: legacy.ctaHref }
  }
  return null
}

function pickSecondaryCta(block: HeroBlock): CtaLink | null {
  if (block.ctaSecondary?.label || block.ctaSecondary?.href) return block.ctaSecondary
  if (block.secondaryCta?.label || block.secondaryCta?.href) return block.secondaryCta
  return null
}

function pickHeading(block: HeroBlock): string | null {
  if (block.h1) return block.h1
  if (block.heading) return block.heading
  // Payload legacy `title`
  const legacy = block as unknown as { title?: string }
  if (legacy.title) return legacy.title
  return null
}

function pickSubheading(block: HeroBlock): string | null {
  if (block.subUsp) return block.subUsp
  if (block.subheading) return block.subheading
  const legacy = block as unknown as { subtitle?: string }
  if (legacy.subtitle) return legacy.subtitle
  return null
}

function pickImage(block: HeroBlock): HeroImage | MediaRef | string | null | undefined {
  if (block.image) return block.image
  if (block.coverImage) return block.coverImage
  if (block.avatar) return block.avatar
  if (block.backgroundMedia) return block.backgroundMedia
  return null
}

function trustRowItems(block: HeroBlock): string[] {
  if (!block.trustRow) return []
  // Payload may serialise array<{value:string}> as well as plain string[].
  return block.trustRow
    .map((it) =>
      typeof it === 'string' ? it : ((it as unknown as { value?: string }).value ?? ''),
    )
    .filter(Boolean)
}

export function Hero(block: HeroBlock) {
  const theme = block.seasonalTheme ?? 'summer'
  const tokens = themeTokens[theme]
  const image = pickImage(block)
  const bgUrl = pickMediaUrl(image)
  const overlay = Math.max(0, Math.min(100, block.overlayOpacity ?? 40)) / 100

  const heading = pickHeading(block)
  const subheading = pickSubheading(block)
  const primary = pickPrimaryCta(block)
  const secondary = pickSecondaryCta(block)
  const trust = trustRowItems(block)
  const eyebrow = block.eyebrow ?? null
  const isInlineImage = Boolean(image && !block.backgroundMedia && pickMediaUrl(image))
  // ── B-3 layout: для cw-схемы (image как HeroImage) рендерим inline-photo
  // справа (col 60/40). Старый backgroundMedia остаётся на full-bleed bg.
  const showAsBg = Boolean(block.backgroundMedia) && bgUrl

  return (
    <section
      id={block.anchor ?? undefined}
      className="relative overflow-hidden"
      style={{
        padding: 'clamp(64px, 10vw, 120px) 0',
        background: showAsBg ? '#1c1c1c' : 'var(--c-bg-alt)',
        color: showAsBg ? 'var(--c-on-primary)' : 'var(--c-ink)',
      }}
    >
      {showAsBg && bgUrl && (
        <>
          <Image
            src={bgUrl}
            alt={pickMediaAlt(image)}
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

      <div
        className="wrap"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: isInlineImage ? 'minmax(0, 60fr) minmax(0, 40fr)' : '1fr',
          gap: 'clamp(24px, 4vw, 56px)',
          alignItems: 'center',
        }}
      >
        <div>
          {(eyebrow || theme === 'winter' || theme === 'promo') && (
            <span
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: 999,
                background: showAsBg ? 'rgba(255,255,255,0.14)' : tokens.badgeBg,
                color: showAsBg ? 'var(--c-on-primary)' : tokens.badgeText,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 500,
                marginBottom: 24,
              }}
            >
              {eyebrow ??
                (theme === 'winter' ? 'Зима' : theme === 'promo' ? 'Акция' : 'Сезон работ')}
            </span>
          )}

          {heading && (
            <h1
              className="h-display"
              style={{
                maxWidth: 960,
                color: showAsBg ? 'var(--c-on-primary)' : 'var(--c-ink)',
              }}
            >
              {heading}
            </h1>
          )}

          {subheading && (
            <p
              className="lead"
              style={{
                marginTop: 24,
                maxWidth: 640,
                color: showAsBg
                  ? 'color-mix(in oklab, var(--c-on-primary) 85%, transparent)'
                  : 'var(--c-ink-soft)',
              }}
            >
              {subheading}
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
                    showAsBg
                      ? { color: 'var(--c-on-primary)', borderColor: 'rgba(255,255,255,0.4)' }
                      : undefined
                  }
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          )}

          {trust.length > 0 && (
            <ul
              aria-label="Доверие"
              style={{
                listStyle: 'none',
                margin: '32px 0 0',
                padding: 0,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {trust.map((t, i) => (
                <li
                  key={`${t}-${i}`}
                  style={{
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--c-ink-soft)',
                    background: 'var(--c-bg)',
                    border: '1px solid color-mix(in oklab, var(--c-ink) 12%, transparent)',
                    borderRadius: 999,
                    padding: '4px 10px',
                  }}
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>

        {isInlineImage && bgUrl && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 3',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'var(--c-bg)',
            }}
          >
            <Image
              src={bgUrl}
              alt={pickMediaAlt(image)}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
