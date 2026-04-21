import { AmberSeal } from '../_shared/graphics'

type Seal = { c: string; l: string }
type Guarantee = {
  big: string
  unit: string
  t: string
  d: string
  foot: string
  seal?: Seal
}

const GUARS: Guarantee[] = [
  {
    big: '5',
    unit: 'млн ₽',
    t: 'Страхование ответственности',
    d: 'Полис на каждый выезд. Если бригада что-то повредит — компенсация через страховую, без нервов и судов.',
    foot: 'ПОЛИС · ИНГОССТРАХ',
    seal: { c: '5\nмлн ₽', l: 'СТРАХОВКА · ИНГОССТРАХ · ' },
  },
  {
    big: '12',
    unit: 'мес',
    t: 'Гарантия на работу',
    d: 'Санитарная обрезка — 12 мес. Фрезеровка пня — 3 года на отсутствие прорастания. Сертификат на руки в день работы.',
    foot: 'СЕРТИФИКАТ · A5 · ПЕЧАТЬ',
    seal: { c: '12\nмес', l: 'ГАРАНТИЯ · ОБИХОД · ' },
  },
  {
    big: '−10',
    unit: '%',
    t: 'Опоздали — скидка',
    d: 'Назвали время — держим. Опоздание больше 30 минут — автоматически снижаем цену на 10%. Без звонков и напоминаний.',
    foot: 'АВТО · В ДОГОВОРЕ',
  },
  {
    big: '0',
    unit: '₽',
    t: 'Замер и выезд',
    d: 'Замерщик приезжает бесплатно в любой район МО в радиусе 120 км от МКАД. Не понравилась смета — не платите ничего.',
    foot: 'ВСЯ МО · 120 КМ ОТ МКАД',
  },
  {
    big: '100',
    unit: '%',
    t: 'Цена в договоре = в калькуляторе',
    d: 'Любое отклонение от сметы — только с вашего письменного согласия в мессенджере. Никаких «открылось на месте».',
    foot: 'ФИКС · В ПИСЬМЕННОМ ВИДЕ',
  },
  {
    big: '24',
    unit: '/7',
    t: 'Аварийный телефон',
    d: 'Упавшее дерево ночью, сугроб заблокировал ворота, срочный демонтаж после пожара — выезжаем в любое время.',
    foot: 'КРУГЛОСУТОЧНО',
  },
]

export function Guarantees() {
  return (
    <section id="guarantees" className="band-alt">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">§&nbsp;04 · Гарантии и SLA</span>
            <h2 className="h-xl">
              Мы продаём не&nbsp;услугу,
              <br />
              а&nbsp;спокойствие.
            </h2>
          </div>
          <p className="section-sub">
            Шесть обязательств, которые прописаны в&nbsp;договоре и&nbsp;в&nbsp;сертификате.
            Не&nbsp;маркетинг — операционный стандарт каждого выезда.
          </p>
        </div>
        <div className="guar-grid">
          {GUARS.map((g, i) => (
            <div key={i} className="guar-card">
              {g.seal && (
                <div className="amber-seal-inline">
                  <AmberSeal size={72} label={g.seal.l} center={g.seal.c} />
                </div>
              )}
              <div className="guar-big tnum">
                {g.big}
                <span className="sm">&nbsp;{g.unit}</span>
              </div>
              <div className="guar-title">{g.t}</div>
              <div className="guar-desc">{g.d}</div>
              <div className="guar-foot">{g.foot}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
