// brand-guide v2.6 §mini-case (line 1554+)
// EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10 · fe role
//
// 1 case с photo 16:11 + KPI bullets + 4 thumbnails + CTA «Полный кейс →».
// Mobile: vertical stack, photo full-width.
// Server component.

import Image from 'next/image'
import Link from 'next/link'

import { toStringList, type MiniCaseV2Block } from './types'

export function MiniCaseV2(block: MiniCaseV2Block) {
  const title = block.title
  if (!title) return null

  const badge = block.badge ?? 'Кейс'
  const meta = toStringList(block.meta)
  const photoUrl = block.imageUrl ?? null
  const photoAlt = block.imageAlt ?? title
  const photoLabel = block.photoLabel ?? null
  const kpis = block.kpis ?? []
  const thumbs = toStringList(block.thumbs)
  const ctaLabel = block.ctaLabel ?? 'Полный кейс'
  const ctaHref = block.ctaHref ?? null

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
      <div className="wrap">
        <article className="sp-mini-case">
          <div className="sp-mc-photo">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={photoAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            ) : null}
            <span className="sp-mc-badge">{badge}</span>
            {photoLabel && <span className="sp-mc-photo-label">{photoLabel}</span>}
          </div>
          <div className="sp-mc-body">
            {meta.length > 0 && (
              <ul className="sp-mc-meta">
                {meta.map((m, i) => (
                  <li key={`m-${i}`}>{m}</li>
                ))}
              </ul>
            )}
            <h3 className="sp-mc-title">{title}</h3>
            {kpis.length > 0 && (
              <ul className="sp-mc-kpi">
                {kpis.map((kpi, i) => (
                  <li key={`kpi-${i}`}>
                    <span className="k">{kpi.k}</span>
                    <span className="v">{kpi.v}</span>
                  </li>
                ))}
              </ul>
            )}
            {thumbs.length > 0 && (
              <div className="sp-mc-thumbs" aria-label="Дополнительные фото">
                {thumbs.slice(0, 4).map((url, i) => (
                  <span
                    key={`t-${i}`}
                    className="sp-thumb"
                    style={
                      url ? { backgroundImage: `url(${url})`, backgroundSize: 'cover' } : undefined
                    }
                    aria-hidden
                  />
                ))}
              </div>
            )}
            {ctaHref && (
              <Link href={ctaHref} className="sp-mc-cta">
                {ctaLabel}
              </Link>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
