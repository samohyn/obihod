import Link from 'next/link'

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
