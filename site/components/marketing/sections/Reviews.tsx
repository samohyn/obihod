import type { HomepageGlobal } from '@/lib/homepage'

/**
 * Reviews — секция §07 (4 source tiles + 6 review cards).
 * Source: newui/homepage-classic.html.
 * Phase 3: контент из Homepage.reviewSources / Homepage.reviews с graceful fallback.
 */

const FALLBACK_SOURCES = [
  { name: 'Я.Карты', rating: 4.9, reviewCount: 128, isNps: false },
  { name: '2ГИС', rating: 4.8, reviewCount: 42, isNps: false },
  { name: 'Авито', rating: 4.9, reviewCount: 31, isNps: false },
  { name: 'NPS', rating: 98, reviewCount: 100, isNps: true },
]

const FALLBACK_REVIEWS = [
  {
    author: 'Мария К.',
    meta: 'Истра · Я.Карты · 14 апр 2026',
    text: '«Сфоткала упавшую берёзу — через 8 минут пришёл ответ в WhatsApp. Приехали через день, всё убрали за 3 часа, увезли пенёк. Цена точно как в смете.»',
  },
  {
    author: 'Виктор С.',
    meta: 'Раменское · Я.Карты · 6 апр 2026',
    text: '«Демонтаж старой бани с вывозом. Бригада в форме, договор на месте, страховка. Сертификат с печатью отдали вместе с актом.»',
  },
  {
    author: 'Анна Л.',
    meta: 'FM · посёлок Красногорск · 2ГИС · 3 апр 2026',
    text: '«Заключили годовой договор на крыши и арбо. Один менеджер на всё, штрафы ГЖИ они забрали в свой риск, а это — главное для нас.»',
  },
  {
    author: 'Николай Ф.',
    meta: 'Одинцово · Авито · 22 мар 2026',
    text: '«Пять лет искал нормального арбориста. Тут — фото отправил в чат, через 10 минут ответили. Сделали ровно как обещали.»',
  },
  {
    author: 'Елена Г.',
    meta: 'Мытищи · Я.Карты · 18 мар 2026',
    text: '«Чистка крыши. Приехали ровно в обещанное время, сделали акт, прислали фото до и после. Никто не пытался впарить дополнительные услуги.»',
  },
  {
    author: 'Дмитрий К.',
    meta: 'Химки · УК · 2ГИС · 15 мар 2026',
    text: '«Восемь домов под управлением. Четвёртый сезон с Обиходом. По вывозу мусора закрыли вопрос с ОАТИ полностью.»',
  },
]

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
  const sources = data?.reviewSources ?? FALLBACK_SOURCES
  const reviews = data?.reviews ?? FALLBACK_REVIEWS

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
