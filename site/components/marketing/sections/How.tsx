import { Icon, type IconName } from '../_shared/Icon'

type Step = {
  n: string
  sla: string
  icon: Extract<IconName, 'Phone2' | 'Clipboard' | 'Truck' | 'Camera' | 'Hand'>
  t: string
  d: string
}

const STEPS: Step[] = [
  {
    n: '01',
    sla: 'ТАЙМИНГ · <15 МИН',
    icon: 'Phone2',
    t: 'Звонок или заявка',
    d: 'Диспетчер отвечает по имени, параллельно забивает адрес в калькулятор. Называем вилку цены в первую минуту.',
  },
  {
    n: '02',
    sla: 'ТАЙМИНГ · 24 ЧАСА',
    icon: 'Clipboard',
    t: 'Замер и смета',
    d: 'Замерщик приезжает бесплатно. Финализируем смету, фиксируем цену в договоре — без «откроется на месте».',
  },
  {
    n: '03',
    sla: 'ТАЙМИНГ · В НАЗНАЧЕННЫЙ ДЕНЬ',
    icon: 'Truck',
    t: 'Работа бригады',
    d: 'Форма, каска, бейдж. Инструктаж ТБ, обход участка с хозяином. Каждые 90 минут — апдейт в Telegram.',
  },
  {
    n: '04',
    sla: 'ТАЙМИНГ · ДЕНЬ РАБОТЫ',
    icon: 'Camera',
    t: 'Фото-отчёт',
    d: 'Все ракурсы «до/после» в Telegram-боте автоматически. PDF-акт, чек онлайн-кассы, гарантийный сертификат.',
  },
  {
    n: '05',
    sla: 'ТАЙМИНГ · 12 МЕСЯЦЕВ',
    icon: 'Hand',
    t: 'Гарантия и связь',
    d: 'Бригадир остаётся на связи. Что-то не так — возвращаемся. Через полгода напомним о сезонных работах.',
  },
]

export function How() {
  return (
    <section id="how">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">§&nbsp;03 · Процесс</span>
            <h2 className="h-xl">Как это работает.</h2>
          </div>
          <p className="section-sub">
            Пять простых шагов от&nbsp;первого звонка до&nbsp;гарантийной поддержки. На&nbsp;каждом
            — понятный SLA: мы&nbsp;называем срок и&nbsp;держим его.
          </p>
        </div>
        <div className="how-grid">
          {STEPS.map((s) => {
            const IconCmp = Icon[s.icon]
            return (
              <div key={s.n} className="how-step">
                <span className="step-ghost" aria-hidden="true">
                  {s.n.replace('0', '')}
                </span>
                <span className="how-num">{s.n} / 05</span>
                <div className="how-icon">
                  <IconCmp size={36} />
                </div>
                <div className="how-title">{s.t}</div>
                <div className="how-desc">{s.d}</div>
                <div className="how-sla">{s.sla}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
