import Image from 'next/image'
import Link from 'next/link'

import type { MediaRef, MiniCaseBlock, MiniCaseInline } from './types'

/**
 * Карточка кейса: фото + краткие факты + ссылка на /kejsy/<slug>/.
 *
 * Контракт: US-0 sa-seo AC-2.5 «MiniCase — фото + 3-4 факта (срок, бригада,
 * объём, цена) + ссылка на /kejsy/<slug>/».
 *
 * Server component. Принимает либо `caseRef` (relationship to Cases), либо
 * `inline` (mock-данные). Если caseRef — пробуем разрешить slug в URL и title;
 * полная Payload-resolution делает caller (page.tsx) и подставляет в `inline`.
 */

function pickPhotoUrl(photo: MediaRef | string | null | undefined): string | null {
  if (!photo) return null
  if (typeof photo === 'string') return photo
  return photo.url ?? null
}

function pickPhotoAlt(photo: MediaRef | string | null | undefined, fallback: string): string {
  if (!photo || typeof photo === 'string') return fallback
  return photo.alt ?? fallback
}

function resolveInline(block: MiniCaseBlock): MiniCaseInline | null {
  if (block.inline) return block.inline

  if (block.caseRef && typeof block.caseRef === 'object') {
    const ref = block.caseRef as { slug?: string; title?: string }
    if (ref.slug && ref.title) {
      return {
        title: ref.title,
        link: `/kejsy/${ref.slug}/`,
      }
    }
  }
  return null
}

export function MiniCase(block: MiniCaseBlock) {
  const data = resolveInline(block)
  if (!data) return null

  const photoUrl = pickPhotoUrl(data.photo)
  const facts = (data.facts ?? []).filter(
    (f) => f && typeof f.label === 'string' && typeof f.value === 'string',
  )
  const link = data.link ?? null

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(32px, 5vw, 64px) 0' }}>
      <div className="wrap">
        <article
          style={{
            display: 'grid',
            gap: 'clamp(20px, 3vw, 32px)',
            gridTemplateColumns: photoUrl ? 'minmax(0, 1fr) minmax(0, 1.2fr)' : '1fr',
            background: 'var(--c-bg)',
            border: '1px solid var(--c-line, color-mix(in oklab, var(--c-ink) 10%, transparent))',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(20px, 3vw, 32px)',
            alignItems: 'center',
          }}
          className="mini-case"
        >
          {photoUrl && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                background: 'var(--c-bg-alt)',
              }}
            >
              <Image
                src={photoUrl}
                alt={pickPhotoAlt(data.photo, data.title)}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}

          <div>
            <span className="eyebrow" style={{ color: 'var(--c-primary)' }}>
              Кейс
            </span>
            <h3
              style={{
                margin: '8px 0 16px',
                fontSize: 'clamp(20px, 2.4vw, 26px)',
                lineHeight: 1.25,
                fontWeight: 600,
                color: 'var(--c-ink)',
              }}
            >
              {data.title}
            </h3>

            {facts.length > 0 && (
              <dl
                style={{
                  margin: '0 0 20px',
                  display: 'grid',
                  gap: 8,
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                }}
              >
                {facts.map((f, i) => (
                  <div key={`${f.label}-${i}`} style={{ display: 'flex', flexDirection: 'column' }}>
                    <dt
                      style={{
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--c-ink-soft)',
                        marginBottom: 4,
                      }}
                    >
                      {f.label}
                    </dt>
                    <dd
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 600,
                        color: 'var(--c-ink)',
                      }}
                    >
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {link && (
              <Link
                href={link}
                className="btn btn-ghost"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 44,
                }}
              >
                Подробности кейса →
              </Link>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
