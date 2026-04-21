import { BeforeAfter } from '../_shared/BeforeAfter'

type Case = {
  n: string
  loc: string
  area: string
  svc: string
  title: string
  facts: Array<[string, string]>
  before: string
  after: string
}

const CASES: Case[] = [
  {
    n: '01',
    loc: 'СНТ «Берёзовая роща»',
    area: 'Истра',
    svc: 'Спил · 2 берёзы',
    title: 'Аварийные берёзы у дома, 18 м',
    facts: [
      ['14 200 ₽', 'цена по договору'],
      ['3 ч', 'работа бригады'],
      ['12 мес', 'гарантия'],
    ],
    before: 'ДО · 2 БЕРЁЗЫ, 18 М',
    after: 'ПОСЛЕ · ПЕНЬ СФРЕЗЕРОВАН',
  },
  {
    n: '02',
    loc: 'Коттеджный посёлок',
    area: 'Одинцово',
    svc: 'Демонтаж · Баня 6×4',
    title: 'Старая баня под новую террасу',
    facts: [
      ['128 500 ₽', 'под ключ'],
      ['2 дня', 'с вывозом'],
      ['27 м³', 'мусора вывезли'],
    ],
    before: 'ДО · БАНЯ ИЗ БРУСА',
    after: 'ПОСЛЕ · РОВНАЯ ПЛОЩАДКА',
  },
  {
    n: '03',
    loc: 'ИЖС',
    area: 'Мытищи',
    svc: 'Зимний абонемент',
    title: 'Сезон уборки снега, 2025–2026',
    facts: [
      ['89 000 ₽', 'за сезон'],
      ['11', 'выездов'],
      ['850 м²', 'участка'],
    ],
    before: 'ДО · СУГРОБЫ ПО ПОЯС',
    after: 'ПОСЛЕ · УЧАСТОК ЧИСТЫЙ',
  },
]

export function Cases() {
  return (
    <section id="cases">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">§&nbsp;05 · Кейсы</span>
            <h2 className="h-xl">Делали. Покажем.</h2>
          </div>
          <p className="section-sub">
            Три примера из&nbsp;последнего месяца — с&nbsp;точной локацией, ценой в&nbsp;договоре
            и&nbsp;сроком исполнения. Потяните за&nbsp;жёлтый ползунок — увидите «до/после».
          </p>
        </div>

        <div className="cases-grid">
          {CASES.map((c, i) => (
            <div key={i} className="case-card">
              <span className="case-ghost" aria-hidden="true">
                {c.n}
              </span>
              <div className="case-shot">
                <BeforeAfter caption={{ before: c.before, after: c.after }} />
              </div>
              <div className="case-meta">
                <span>{c.svc}</span>
                <span className="case-dot">·</span>
                <span>{c.area}</span>
              </div>
              <div className="case-title">{c.title}</div>
              <div style={{ color: 'var(--c-muted)', fontSize: '14px' }}>{c.loc}</div>
              <div className="case-facts">
                {c.facts.map((f, j) => (
                  <div key={j} className="case-fact">
                    <div className="v">{f[0]}</div>
                    <div className="l">{f[1]}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <a href="#" className="btn btn-ghost btn-lg">
            Смотреть все кейсы в Telegram-канале
          </a>
        </div>
      </div>
    </section>
  )
}
