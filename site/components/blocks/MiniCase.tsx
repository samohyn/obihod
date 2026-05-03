import Image from 'next/image'
import Link from 'next/link'

import type { MediaRef, MiniCaseBlock, MiniCaseInline } from './types'

/**
 * Карточка кейса.
 *
 * Поддерживает обе схемы (US-0 W3 Track B-3):
 *  - cw-схема: items[] = [{ title, imageUrl, imageAlt, facts, href }, ...]
 *  - legacy:    inline = { title, photo, facts, link } (одна карточка)
 *  - legacy:    caseRef relationship to Cases
 *
 * Renderer-приоритет: items[] → inline → caseRef.
 *
 * Если items[].length > 1 — рендерится grid из карточек.
 *
 * Server component.
 */

interface NormalizedCase {
  title: string
  photoUrl: string | null
  photoAlt: string
  facts: { label: string; value: string }[]
  href: string | null
}

function pickPhotoUrl(photo: MediaRef | string | null | undefined): string | null {
  if (!photo) return null
  if (typeof photo === 'string') return photo
  return photo.url ?? null
}

function pickPhotoAlt(photo: MediaRef | string | null | undefined, fallback: string): string {
  if (!photo || typeof photo === 'string') return fallback
  return photo.alt ?? fallback
}

function normalize(it: MiniCaseInline): NormalizedCase | null {
  const title = it.title
  if (!title) return null
  // imageUrl (cw) приоритет над photo (legacy)
  const photoUrl = it.imageUrl ?? pickPhotoUrl(it.photo)
  const photoAlt = it.imageAlt ?? pickPhotoAlt(it.photo, title)
  const facts = (it.facts ?? []).filter(
    (f) => f && typeof f.label === 'string' && typeof f.value === 'string',
  )
  const href = it.href ?? it.link ?? null
  return { title, photoUrl, photoAlt, facts, href }
}

function resolveCases(block: MiniCaseBlock): NormalizedCase[] {
  // 1) cw-схема — items[]
  if (block.items && block.items.length > 0) {
    return block.items.map(normalize).filter((c): c is NormalizedCase => Boolean(c))
  }
  // 2) legacy inline
  if (block.inline) {
    const c = normalize(block.inline)
    return c ? [c] : []
  }
  // 3) legacy caseRef relationship — minimum data
  if (block.caseRef && typeof block.caseRef === 'object') {
    const ref = block.caseRef as { slug?: string; title?: string }
    if (ref.slug && ref.title) {
      return [
        {
          title: ref.title,
          photoUrl: null,
          photoAlt: ref.title,
          facts: [],
          href: `/kejsy/${ref.slug}/`,
        },
      ]
    }
  }
  return []
}

function Card({ data, layout }: { data: NormalizedCase; layout: 'wide' | 'compact' }) {
  return (
    <article
      style={{
        display: 'grid',
        gap: 'clamp(16px, 2.5vw, 24px)',
        gridTemplateColumns: data.photoUrl
          ? layout === 'wide'
            ? 'minmax(0, 1fr) minmax(0, 1.2fr)'
            : '1fr'
          : '1fr',
        background: 'var(--c-bg)',
        border: '1px solid var(--c-line, color-mix(in oklab, var(--c-ink) 10%, transparent))',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(16px, 2.5vw, 28px)',
        alignItems: 'center',
      }}
      className="mini-case"
    >
      {data.photoUrl && (
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
            src={data.photoUrl}
            alt={data.photoAlt}
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
            fontSize: 'clamp(18px, 2.2vw, 24px)',
            lineHeight: 1.25,
            fontWeight: 600,
            color: 'var(--c-ink)',
          }}
        >
          {data.title}
        </h3>

        {data.facts.length > 0 && (
          <dl
            style={{
              margin: '0 0 20px',
              display: 'grid',
              gap: 8,
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            }}
          >
            {data.facts.map((f, i) => (
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
                    fontSize: 15,
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

        {data.href && (
          <Link
            href={data.href}
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
  )
}

export function MiniCase(block: MiniCaseBlock) {
  const cases = resolveCases(block)
  if (cases.length === 0) return null
  const heading = block.h2 ?? null
  const isMulti = cases.length > 1

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(32px, 5vw, 64px) 0' }}>
      <div className="wrap">
        {heading && (
          <h2 className="h-l" style={{ marginBottom: 24, maxWidth: 760 }}>
            {heading}
          </h2>
        )}
        <div
          style={{
            display: 'grid',
            gap: 'clamp(16px, 2vw, 24px)',
            gridTemplateColumns: isMulti ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
          }}
        >
          {cases.map((c, i) => (
            <Card key={`${c.title}-${i}`} data={c} layout={isMulti ? 'compact' : 'wide'} />
          ))}
        </div>
      </div>
    </section>
  )
}
