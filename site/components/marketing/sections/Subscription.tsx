import { Icon } from '../_shared/Icon'

type Sub = {
  name: string
  tier: string
  price: string
  per: string
  desc: string
  featured?: boolean
  feats: string[]
}

const SUBS: Sub[] = [
  {
    name: 'Обиход.Эконом',
    tier: 'Минимум',
    price: '49',
    per: '7 400 ₽/мес · годовой платёж',
    desc: 'Для участка до 10 соток. Сезонные работы по звонку, без приоритета в расписании.',
    feats: [
      'Весенняя обрезка плодовых',
      'Осенняя уборка листвы (1 выезд)',
      'Снег — до 6 выездов за сезон',
      'Вывоз КГМ — 2 раза в год',
      'Скидка 10% на разовые работы',
    ],
  },
  {
    name: 'Обиход.Участок',
    tier: 'Стандарт',
    price: '89',
    per: '7 400 ₽/мес · годовой платёж',
    desc: 'Базовый пакет для большинства хозяев. Полный цикл сезонных работ + приоритетное расписание.',
    featured: true,
    feats: [
      'Весенняя обрезка + санитарка',
      'Лето: вывоз листвы и КГМ по звонку',
      'Снег — до 10 выездов за сезон',
      'Чистка кровли от наледи (2 раза)',
      'Персональный менеджер в Telegram',
      'Страховка на каждый выезд',
      'Приоритет в расписании',
    ],
  },
  {
    name: 'Обиход.Забота',
    tier: 'Премиум',
    price: '149',
    per: '12 400 ₽/мес · годовой платёж',
    desc: 'Для тех, кто хочет забыть об участке. SLA 4 часа на любой выезд, ежемесячный чек-ап.',
    feats: [
      'Всё из «Стандарт»',
      'SLA 4 часа на аварийный выезд',
      'Ежемесячный осмотр участка',
      'Фото-отчёт раз в месяц',
      'Круглосуточная связь с бригадиром',
      'Скидка 25% на разовые работы',
      'Выездной арборист по запросу',
    ],
  },
]

export function Subscription() {
  return (
    <section id="subscription">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">§&nbsp;08 · Абонемент</span>
            <h2 className="h-xl">
              Заплатили раз в&nbsp;год —<br />
              забыли об&nbsp;участке.
            </h2>
          </div>
          <p className="section-sub">
            Три годовых пакета для частных хозяев. Все сезонные работы, документы и&nbsp;выезды
            по&nbsp;звонку — под одним договором, без повторных согласований.
          </p>
        </div>

        <div className="sub-grid">
          {SUBS.map((s, i) => (
            <div key={i} className={'sub-card ' + (s.featured ? 'featured' : '')}>
              {s.featured && <div className="sub-ribbon">Выбор 72% клиентов</div>}
              <div className="sub-name">{s.name}</div>
              <div className="sub-tier">{s.tier}</div>
              <div className="sub-price tnum">
                {s.price}
                <span className="unit">тыс&nbsp;₽/год</span>
              </div>
              <div className="sub-per">{s.per}</div>
              <div className="sub-desc">{s.desc}</div>
              <ul className="sub-list">
                {s.feats.map((f, j) => (
                  <li key={j}>
                    <Icon.Check size={14} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="sub-cta">
                <a
                  href="#contact"
                  className={'btn ' + (s.featured ? 'btn-accent' : 'btn-ghost') + ' btn-lg'}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Оформить абонемент
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
