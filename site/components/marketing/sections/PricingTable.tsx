import Link from 'next/link'
/**
 * PricingTable — секция §04
 * Note: 7 price rows with icons
 * Source: newui/homepage-classic.html (Phase 1: hardcoded; Phase 2: read from Payload Homepage global)
 */
export function PricingTable() {
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
          <div className="hpc-price-row">
            <div className="hpc-price-ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v18" />
                <path d="M8 7c-2 2-2 5 0 7" />
                <path d="M16 7c2 2 2 5 0 7" />
                <path d="M6 14c-1 1-1 2.5 0 3.5" />
                <path d="M18 14c1 1 1 2.5 0 3.5" />
              </svg>
            </div>
            <div className="name">Спил дерева до 10 м</div>
            <div className="desc">
              С автовышки или альпинистом, со страховкой 5 млн ₽. С удалением пня — отдельно.
            </div>
            <div className="hpc-price-cta">
              <div className="price">
                <span className="from">от</span>4 500 ₽<span className="unit">/ дерево</span>
              </div>
              <Link className="cta" href="/arboristika/spil-derevev">
                Подробнее →
              </Link>
            </div>
          </div>
          <div className="hpc-price-row">
            <div className="hpc-price-ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L4.5 13.5H12L11 22l8.5-11.5H12.5z" />
              </svg>
            </div>
            <div className="name">Аварийное удаление 10-25 м</div>
            <div className="desc">
              Дерево упало или висит — приедем в течение 4 часов в МО, 2 часов в Москве. Каблинг при
              необходимости.
            </div>
            <div className="hpc-price-cta">
              <div className="price">
                <span className="from">от</span>12 000 ₽<span className="unit">/ дерево</span>
              </div>
              <Link className="cta" href="/arboristika/avarijnoe">
                Подробнее →
              </Link>
            </div>
          </div>
          <div className="hpc-price-row">
            <div className="hpc-price-ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12l9-9 9 9M5 10v10h14V10" />
                <path d="M8 4.5L8 2.5M12 3.5L12 1.5M16 4.5L16 2.5" />
              </svg>
            </div>
            <div className="name">Чистка крыши от снега</div>
            <div className="desc">
              Со снеговалом и сосульками. С автовышки или промальпом — выбираем по геометрии и
              доступу.
            </div>
            <div className="hpc-price-cta">
              <div className="price">
                <span className="from">от</span>25 ₽<span className="unit">/ м²</span>
              </div>
              <Link className="cta" href="/chistka-krysh/ot-snega">
                Подробнее →
              </Link>
            </div>
          </div>
          <div className="hpc-price-row">
            <div className="hpc-price-ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="8" width="18" height="11" rx="1" />
                <path d="M3 12h18M7 8V5h10v3" />
              </svg>
            </div>
            <div className="name">Контейнер 7-8 м³</div>
            <div className="desc">
              Привезём, оставим на 2-7 дней, вывезем с актом на полигон. Бытовой / строительный /
              смешанный мусор.
            </div>
            <div className="hpc-price-cta">
              <div className="price">
                <span className="from">от</span>5 500 ₽<span className="unit">/ объект</span>
              </div>
              <Link className="cta" href="/vyvoz-musora/kontejner">
                Подробнее →
              </Link>
            </div>
          </div>
          <div className="hpc-price-row">
            <div className="hpc-price-ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 3h15v13H1z" />
                <path d="M16 8h4l3 4v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="name">Газель + грузчики 2 чел.</div>
            <div className="desc">
              3 часа работы. Старая мебель, бытовая техника, садовый мусор, крупногабарит.
            </div>
            <div className="hpc-price-cta">
              <div className="price">
                <span className="from">от</span>4 800 ₽<span className="unit">/ ходка</span>
              </div>
              <Link className="cta" href="/vyvoz-musora/gazel">
                Подробнее →
              </Link>
            </div>
          </div>
          <div className="hpc-price-row">
            <div className="hpc-price-ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21h18M5 21V9l7-6 7 6v12" />
                <path d="M3 5l2 2M21 5l-2 2M12 3V1M7 13l2-2 2 2" />
              </svg>
            </div>
            <div className="name">Демонтаж бани, сарая</div>
            <div className="desc">
              Каркасное / брусовое / щитовое строение. С вывозом отходов в одном договоре.
            </div>
            <div className="hpc-price-cta">
              <div className="price">
                <span className="from">от</span>25 000 ₽<span className="unit">/ объект</span>
              </div>
              <Link className="cta" href="/demontazh/saraj">
                Подробнее →
              </Link>
            </div>
          </div>
          <div className="hpc-price-row">
            <div className="hpc-price-ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6" />
                <line x1="4" y1="5" x2="7" y2="8" strokeWidth="2" />
                <line x1="5" y1="3" x2="9" y2="7" strokeWidth="2" />
              </svg>
            </div>
            <div className="name">Снос дома до 100 м²</div>
            <div className="desc">
              Деревянный или каркасный одноэтажный. С разрешительными документами и вывозом.
            </div>
            <div className="hpc-price-cta">
              <div className="price">
                <span className="from">от</span>85 000 ₽<span className="unit">/ объект</span>
              </div>
              <Link className="cta" href="/demontazh/dom">
                Подробнее →
              </Link>
            </div>
          </div>
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
