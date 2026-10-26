'use client'

import { useEffect, useRef, useState } from 'react'

import type { InboxPhoto } from './types'

/**
 * Фото заявки: сетка миниатюр и просмотр на весь экран (план 09, этап 5.2–5.3).
 * Нативный <dialog>: фокус внутри, Esc закрывает; ← → и свайп листают.
 */
export function PhotoViewer({ photos }: { photos: InboxPhoto[] }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState<number | null>(null)
  const startX = useRef<number | null>(null)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (index !== null && !d.open) d.showModal()
    if (index === null && d.open) d.close()
  }, [index])

  if (!photos.length) return null
  const go = (step: number) =>
    setIndex((i) => (i === null ? i : (i + step + photos.length) % photos.length))
  const current = index !== null ? photos[index] : null

  return (
    <>
      <ul className="lead-photos" aria-label="Фото объекта">
        {photos.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              className="lead-photos__thumb"
              onClick={() => setIndex(i)}
              aria-label={`Открыть фото ${i + 1} из ${photos.length}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- закрытый файл админки, next/image его не отдаст */}
              <img src={p.thumbUrl} alt="" loading="lazy" />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        className="lead-viewer"
        aria-label="Фото объекта"
        onClose={() => setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1)
          if (e.key === 'ArrowLeft') go(-1)
        }}
        onPointerDown={(e) => {
          startX.current = e.clientX
        }}
        onPointerUp={(e) => {
          if (startX.current === null) return
          const dx = e.clientX - startX.current
          startX.current = null
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
        }}
      >
        {current && (
          <figure className="lead-viewer__figure">
            {/* eslint-disable-next-line @next/next/no-img-element -- закрытый файл админки */}
            <img
              src={current.url}
              alt={`Фото ${index! + 1} из ${photos.length}`}
              draggable={false}
            />
            <figcaption>
              {index! + 1} / {photos.length} ·{' '}
              <a href={current.url} target="_blank" rel="noreferrer">
                Открыть оригинал
              </a>
            </figcaption>
          </figure>
        )}
        <div className="lead-viewer__bar">
          {photos.length > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label="Предыдущее фото">
                ←
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Следующее фото">
                →
              </button>
            </>
          )}
          <button type="button" onClick={() => setIndex(null)} autoFocus>
            Закрыть
          </button>
        </div>
      </dialog>
    </>
  )
}
