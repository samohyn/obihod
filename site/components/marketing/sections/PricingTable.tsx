import Link from 'next/link'

import type { HomepageGlobal } from '@/lib/homepage'

/**
 * PricingTable — секция §04 (7 строк цен с иконками).
 * Source: newui/homepage-classic.html.
 * Phase 3: контент из Homepage.pricingRows[] с graceful fallback.
 * Иконки остаются inline (по позиции 0-6) — admin меняет только name/desc/price/unit/link.
 */

const FALLBACK_ROWS = [
  {
    name: 'Спил дерева до 10 м',
    desc: 'С автовышки или альпинистом, со страховкой 5 млн ₽. С удалением пня — отдельно.',
    priceFrom: 4500,
    unit: '/ дерево',
    link: '/arboristika/spil-derevev/',
  },
  {
    name: 'Аварийное удаление 10-25 м',
    desc: 'Дерево упало или висит — приедем в течение 4 часов в МО, 2 часов в Москве. Каблинг при необходимости.',
    priceFrom: 12000,
    unit: '/ дерево',
    link: '/arboristika/avarijnoe/',
  },
  {
    name: 'Чистка крыши от снега',
    desc: 'Со снеговалом и сосульками. С автовышки или промальпом — выбираем по геометрии и доступу.',
    priceFrom: 25,
    unit: '/ м²',
    link: '/chistka-krysh/ot-snega/',
  },
  {
    name: 'Контейнер 7-8 м³',
    desc: 'Привезём, оставим на 2-7 дней, вывезем с актом на полигон. Бытовой / строительный / смешанный мусор.',
    priceFrom: 5500,
    unit: '/ объект',
    link: '/vyvoz-musora/kontejner/',
  },
  {
    name: 'Газель + грузчики 2 чел.',
    desc: '3 часа работы. Старая мебель, бытовая техника, садовый мусор, крупногабарит.',
    priceFrom: 4800,
    unit: '/ ходка',
    link: '/vyvoz-musora/gazel/',
  },
  {
    name: 'Демонтаж бани, сарая',
    desc: 'Каркасное / брусовое / щитовое строение. С вывозом отходов в одном договоре.',
    priceFrom: 25000,
    unit: '/ объект',
    link: '/demontazh/saraj/',
  },
  {
    name: 'Снос дома до 100 м²',
    desc: 'Деревянный или каркасный одноэтажный. С разрешительными документами и вывозом.',
    priceFrom: 85000,
    unit: '/ объект',
    link: '/demontazh/dom/',
  },
]

const ROW_ICONS = [
  // 0: tree
  <g key="0">
    <path d="M12 3v18" />
    <path d="M8 7c-2 2-2 5 0 7" />
    <path d="M16 7c2 2 2 5 0 7" />
    <path d="M6 14c-1 1-1 2.5 0 3.5" />
    <path d="M18 14c1 1 1 2.5 0 3.5" />
  </g>,
  // 1: lightning
  <path key="1" d="M13 2L4.5 13.5H12L11 22l8.5-11.5H12.5z" />,
  // 2: roof + snow
  <g key="2">
    <path d="M3 12l9-9 9 9M5 10v10h14V10" />
    <path d="M8 4.5L8 2.5M12 3.5L12 1.5M16 4.5L16 2.5" />
  </g>,
  // 3: container
  <g key="3">
    <rect x="3" y="8" width="18" height="11" rx="1" />
    <path d="M3 12h18M7 8V5h10v3" />
  </g>,
  // 4: truck
  <g key="4">
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 4v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </g>,
  // 5: barn demolition
  <g key="5">
    <path d="M3 21h18M5 21V9l7-6 7 6v12" />
    <path d="M3 5l2 2M21 5l-2 2M12 3V1M7 13l2-2 2 2" />
  </g>,
  // 6: house demolition
  <g key="6">
    <path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6" />
    <line x1="4" y1="5" x2="7" y2="8" strokeWidth="2" />
    <line x1="5" y1="3" x2="9" y2="7" strokeWidth="2" />
  </g>,
]

const formatPrice = (n: number) => n.toLocaleString('ru-RU') + ' ₽'

export function PricingTable({ data }: { data?: HomepageGlobal }) {
  const rows = data?.pricingRows ?? FALLBACK_ROWS

  return (
    <section className="hp-section alt">
      <div className="wrap">
        <div className="eyebrow">§ 04 · Цены · открытый прайс</div>
        <h2 style={{ maxWidth: '22ch' }}>Прозрачные цены · без «по запросу»</h2>
        <p className="lead">
          Конкретные суммы за конкретные работы. Финальная цена — после бесплатного замера:
          учитываем доступ, объём и сложность. Точная цифра — в договоре, не выше сметы.
        </p>

        <div className="hpc-prices">
          {rows.map((r, i) => (
            <div className="hpc-price-row" key={i}>
              <div className="hpc-price-ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ROW_ICONS[i] ?? ROW_ICONS[0]}
                </svg>
              </div>
              <div className="name">{r.name}</div>
              <div className="desc">{r.desc}</div>
              <div className="hpc-price-cta">
                <div className="price">
                  <span className="from">от</span>
                  {formatPrice(r.priceFrom)}
                  <span className="unit">{r.unit}</span>
                </div>
                <Link className="cta" href={r.link}>
                  Подробнее →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="hpc-prices-note">
          Указаны минимальные цены за стандартные работы. Финальная стоимость — в смете после
          бесплатного замера. Выезд замерщика — 0 ₽ при любом исходе. Полный прайс по 47 подуслугам
          — на странице{' '}
          <Link
            href="/ceny"
            style={{ color: 'var(--c-primary)', borderBottom: '1px dashed var(--c-primary)' }}
          >
            «Цены»
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
