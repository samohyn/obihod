'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

/**
 * Gallery — секция §09.5 (горизонтальный скроллер с фото объектов).
 * Source: newui/homepage-classic.html · 8 photos + scroll-snap + dots + prev/next.
 */

const PHOTOS: Array<{ src: string; alt: string; caption: string }> = [
  {
    src: '/img-generated/gal-01-spil-alpinist.jpg',
    alt: 'Арборист-альпинист на высоте 20 м',
    caption: 'Альпинизм · спил берёзы 20 м · Истра',
  },
  {
    src: '/img-generated/gal-02-avtowyshka.jpg',
    alt: 'Автовышка на спиле дерева',
    caption: 'Автовышка АГП-22 · кронирование сосны · Одинцово',
  },
  {
    src: '/img-generated/gal-03-pyen-frezer.jpg',
    alt: 'Фрезерование пня',
    caption: 'Корчевание пня фрезой · дуб 80 см · Раменское',
  },
  {
    src: '/img-generated/gal-04-roof-winter.jpg',
    alt: 'Чистка крыши от снега',
    caption: 'Чистка крыши · снег + наледь · посёлок Мытищи',
  },
  {
    src: '/img-generated/gal-05-container-musor.jpg',
    alt: 'Контейнер вывоз мусора',
    caption: 'Контейнер 8 м³ · строительный мусор · Химки',
  },
  {
    src: '/img-generated/gal-06-demolition-saray.jpg',
    alt: 'Демонтаж сарая',
    caption: 'Снос деревянного сарая · вывоз в одном договоре · Пушкино',
  },
  {
    src: '/img-generated/gal-07-kronirovanie-sad.jpg',
    alt: 'Кронирование яблоневого сада',
    caption: 'Кронирование сада · яблони 20 лет · Жуковский',
  },
  {
    src: '/img-generated/gal-08-brigada-work.jpg',
    alt: 'Бригада Обихода за работой',
    caption: 'Бригада 4 человека · уборка после спила · Красногорск',
  },
]

export function Gallery() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  // Calculate item width (item + gap from CSS)
  const itemWidth = (): number => {
    const track = trackRef.current
    if (!track) return 420
    const item = track.querySelector('.hp-gallery-item') as HTMLElement | null
    if (!item) return 420
    const gap = parseInt(getComputedStyle(track).gap || '20', 10)
    return item.offsetWidth + gap
  }

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: dir * itemWidth() * 2, behavior: 'smooth' })
  }

  const scrollToDot = (i: number) => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: i * itemWidth(), behavior: 'smooth' })
  }

  // Sync active dot with scroll position
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const idx = Math.round(track.scrollLeft / itemWidth())
        setActiveIdx(Math.min(Math.max(idx, 0), PHOTOS.length - 1))
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="hp-section hp-gallery-section">
      <div className="wrap">
        <div className="eyebrow">§ 09.5 · Фото с объектов · реальные работы</div>
        <h2 style={{ maxWidth: '22ch' }}>Что происходит на объекте</h2>
        <p className="lead" style={{ marginBottom: '28px' }}>
          Фото наших бригад в работе — арбористика, чистка крыш, вывоз мусора, демонтаж. Без
          постановок.
        </p>
      </div>

      <div className="hp-gallery-wrap">
        <div className="hp-gallery-track" id="hp-gallery-track" ref={trackRef}>
          {PHOTOS.map((p, i) => (
            <figure className="hp-gallery-item" key={p.src}>
              <Image
                src={p.src}
                alt={p.alt}
                width={400}
                height={280}
                sizes="(max-width: 768px) 85vw, 400px"
                loading={i < 2 ? 'eager' : 'lazy'}
              />
              <figcaption>{p.caption}</figcaption>
            </figure>
          ))}
        </div>
        <button
          className="hp-gallery-btn hp-gallery-prev"
          aria-label="Назад"
          type="button"
          onClick={() => scrollBy(-1)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          className="hp-gallery-btn hp-gallery-next"
          aria-label="Вперёд"
          type="button"
          onClick={() => scrollBy(1)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="hp-gallery-dots" id="hp-gallery-dots">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            type="button"
            className={activeIdx === i ? 'hp-gallery-dot active' : 'hp-gallery-dot'}
            aria-label={`Перейти к фото ${i + 1}`}
            aria-current={activeIdx === i ? 'true' : undefined}
            onClick={() => scrollToDot(i)}
          />
        ))}
      </div>
    </section>
  )
}
