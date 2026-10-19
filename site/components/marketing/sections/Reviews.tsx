import type { HomepageGlobal } from '@/lib/homepage'

/**
 * Reviews — секция §07 (плашки площадок + карточки отзывов).
 * Source: archive/newui/homepage-classic.html.
 * Только настоящие данные из Homepage.reviewSources / Homepage.reviews: выдуманные отзывы и
 * рейтинги из макета убраны (план 09, этап 1; ст. 5 закона «О рекламе»). Пусто — секции нет.
 */

const reviewCountWord = (count: number): string => {
  if (count % 10 === 1 && count % 100 !== 11) return 'отзыв'
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'отзыва'
  return 'отзывов'
}

const initial = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0] ?? '')
    .join('')
    .slice(0, 1)
    .toUpperCase()

export function Reviews({ data }: { data?: HomepageGlobal }) {
  const sources = data?.reviewSources ?? []
  const reviews = data?.reviews ?? []
  if (sources.length === 0 && reviews.length === 0) return null

  return (
    <section className="hp-section">
      <div className="wrap">
        <div className="eyebrow">§ 07 · Отзывы · независимые источники</div>
        <h2 style={{ maxWidth: '22ch' }}>Что пишут заказчики на Я.Картах, 2ГИС, Авито</h2>

        <div className="hp-rev-sources">
          {sources.map((s, i) => (
            <div className="stat-tile" key={i}>
              <div className="lbl">{s.name}</div>
              <div className="val">
                {s.isNps ? (
                  <>
                    {s.rating}{' '}
                    <span className="muted" style={{ fontSize: '14px' }}>
                      /{s.reviewCount}
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ color: 'var(--c-accent)' }}>★</span> {s.rating}
                  </>
                )}
              </div>
              <div className="delta">
                {s.isNps
                  ? 'внутренний опрос Q1 2026'
                  : `${s.reviewCount} ${reviewCountWord(s.reviewCount)}`}
              </div>
            </div>
          ))}
        </div>

        <div className="hp-revs">
          {reviews.map((r, i) => (
            <article className="hp-rev-card" key={i}>
              <div className="head">
                <div className="av">{initial(r.author)}</div>
                <div>
                  <div className="n">{r.author}</div>
                  <div className="meta">{r.meta}</div>
                </div>
              </div>
              <div className="stars">★★★★★</div>
              <p className="text">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
