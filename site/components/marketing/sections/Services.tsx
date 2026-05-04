import Link from 'next/link'

export function Services() {
  return (
    <section className="hp-section alt">
      <div className="wrap">
        <div className="eyebrow">§ 02 · Что мы делаем · 4 направления</div>
        <h2 style={{ maxWidth: '22ch' }}>Один подрядчик — все хозяйственные работы на участке</h2>
        <p className="lead">
          Не нужно искать арбориста, кровельщика, мусоровоз и демонтажника по отдельности. Бригада,
          техника, смета и договор — у одного оператора.
        </p>

        <div className="hp-pillars">
          <Link href="/arboristika" className="hp-pillar" style={{ textDecoration: 'none' }}>
            <svg
              className="ic"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M8 6c-2 2-2 5 0 7M16 6c2 2 2 5 0 7M6 13c-1 1-1 3 0 4M18 13c1 1 1 3 0 4" />
            </svg>
            <h3>Арбористика</h3>
            <p>
              Спил, валка, аварийное удаление, кронирование, каблинг, удаление пней, расчистка
              участка. Альпинизм и автовышка.
            </p>
            <div className="price">
              <div>
                <div className="from">от</div>
                <div className="num">
                  700 ₽{' '}
                  <span className="muted" style={{ fontSize: '11px', fontWeight: 500 }}>
                    / дерево
                  </span>
                </div>
              </div>
              <span className="arrow-link">Подробнее →</span>
            </div>
          </Link>

          <Link href="/chistka-krysh" className="hp-pillar" style={{ textDecoration: 'none' }}>
            <svg
              className="ic"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12l9-9 9 9M5 10v10h14V10M9 20v-6h6v6" />
            </svg>
            <h3>Чистка крыш</h3>
            <p>
              От снега и наледи, сбивание сосулек, промальп, автовышка. С оформлением акта по форме.
            </p>
            <div className="price">
              <div>
                <div className="from">от</div>
                <div className="num">
                  25 ₽{' '}
                  <span className="muted" style={{ fontSize: '11px', fontWeight: 500 }}>
                    / м²
                  </span>
                </div>
              </div>
              <span className="arrow-link">Подробнее →</span>
            </div>
          </Link>

          <Link href="/vyvoz-musora" className="hp-pillar" style={{ textDecoration: 'none' }}>
            <svg
              className="ic"
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
            <h3>Вывоз мусора</h3>
            <p>
              Контейнеры 7-30 м³, газель, старая мебель, строительный мусор, садовый, крупногабарит.
            </p>
            <div className="price">
              <div>
                <div className="from">от</div>
                <div className="num">
                  5 500 ₽{' '}
                  <span className="muted" style={{ fontSize: '11px', fontWeight: 500 }}>
                    / объект
                  </span>
                </div>
              </div>
              <span className="arrow-link">Подробнее →</span>
            </div>
          </Link>

          <Link href="/demontazh" className="hp-pillar" style={{ textDecoration: 'none' }}>
            <svg
              className="ic"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18M5 21V10l4-3 6 3v11M9 21v-6h6v6" />
            </svg>
            <h3>Демонтаж</h3>
            <p>
              Снос дома, бани, сарая, внутренний демонтаж под ремонт. Утилизация и вывоз отходов в
              одном договоре.
            </p>
            <div className="price">
              <div>
                <div className="from">от</div>
                <div className="num">
                  25 000 ₽{' '}
                  <span className="muted" style={{ fontSize: '11px', fontWeight: 500 }}>
                    / объект
                  </span>
                </div>
              </div>
              <span className="arrow-link">Подробнее →</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
