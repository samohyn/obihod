export function How() {
  return (
    <section className="hp-section">
      <div className="wrap">
        <div className="eyebrow">§ 03 · Как мы работаем · от заявки до акта</div>
        <h2 style={{ maxWidth: '22ch' }}>5 шагов · фикс-цена · без сюрпризов</h2>

        <div className="hp-how">
          <div className="hp-how-card">
            <svg
              className="ic"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2.03Z" />
            </svg>
            <h4 className="t">Заявка</h4>
            <p className="sla">15 мин · диспетчер</p>
            <p className="d">
              Отвечаем на звонок или сообщение в WhatsApp / Telegram. Уточняем задачу, район.
            </p>
          </div>

          <div className="hp-how-card">
            <svg
              className="ic"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 20 L22 20" />
              <path d="M4 20 L4 16 L10 16 L10 20" />
              <circle cx="6" cy="20" r="1.2" />
              <circle cx="8" cy="20" r="1.2" />
              <path d="M10 18 L15 13" />
              <path d="M17 8 L21 8 L21 12 L17 12 Z" />
            </svg>
            <h4 className="t">Выезд</h4>
            <p className="sla">бесплатно · в день обращения</p>
            <p className="d">
              Замерщик приезжает на объект по согласованному времени. Без предоплаты, без
              обязательств.
            </p>
          </div>

          <div className="hp-how-card">
            <svg
              className="ic"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="3" width="16" height="18" rx="1" />
              <path d="M8 7h8M8 11h8M8 15h5" />
            </svg>
            <h4 className="t">Смета</h4>
            <p className="sla">фикс на 14 дней</p>
            <p className="d">
              Письменная смета с разбивкой работ. Цена в смете = цена в договоре. Доплат не
              бывает.
            </p>
          </div>

          <div className="hp-how-card">
            <svg
              className="ic"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18M5 21V10l7-5 7 5v11M10 21v-6h4v6" />
            </svg>
            <h4 className="t">Работа</h4>
            <p className="sla">по графику · с фото-отчётом</p>
            <p className="d">
              Бригада в фирменной одежде, со страховкой и сертификатами. В день работы — фото в
              чат.
            </p>
          </div>

          <div className="hp-how-card">
            <svg
              className="ic"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <h4 className="t">Оплата + гарантия</h4>
            <p className="sla">после акта · 12 мес</p>
            <p className="d">
              Оплата налом / картой / СБП / счёт юрлицу. Сертификат с печатью и страховым
              полисом.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
