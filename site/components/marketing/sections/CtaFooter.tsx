'use client'

export function CtaFooter() {
  return (
    <section
      className="hp-section"
      id="cta"
      style={{ background: 'var(--c-bg-alt)', paddingTop: '72px' }}
    >
      <div className="wrap">
        <div className="eyebrow" style={{ textAlign: 'center' }}>
          § 11 · Получить смету · 2 способа
        </div>
        <h2
          style={{
            textAlign: 'center',
            maxWidth: '22ch',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Сфотографируйте или позвоните — ответим за 10 минут
        </h2>

        <div className="hp-cta-dual">
          <div className="hp-cta-block">
            <div className="eyebrow" style={{ marginBottom: '8px' }}>
              Способ 1 · Быстро
            </div>
            <h3>Прислать фото</h3>
            <p style={{ marginBottom: '16px' }}>
              AI распознаёт объект, диспетчер пришлёт ориентир в течение 10 минут.
            </p>
            <div className="hp-dropzone" style={{ minHeight: '180px' }}>
              <svg
                className="ic"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '36px', height: '36px' }}
              >
                <path d="M3 7h3l2-3h8l2 3h3v12H3z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <div className="t">Загрузить фото</div>
              <div className="h">До 8 фото · ответ за 10 мин</div>
            </div>
          </div>

          <div className="hp-cta-divider">или</div>

          <div className="hp-cta-block">
            <div className="eyebrow" style={{ marginBottom: '8px' }}>
              Способ 2 · Если фото нет
            </div>
            <h3>Заполнить форму</h3>
            <p style={{ marginBottom: '16px' }}>
              Расскажите коротко задачу — диспетчер перезвонит и уточнит.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert('Демо-макет: форма не подключена')
              }}
            >
              <div className="field">
                <input className="input" type="text" placeholder="Имя" autoComplete="name" />
              </div>
              <div className="field">
                <input
                  className="input"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  autoComplete="tel"
                  required
                />
              </div>
              <div className="field">
                <input
                  className="input"
                  type="text"
                  placeholder="Например: спил 3 берёз, Раменское, аварийно"
                />
              </div>
              <button
                className="btn btn-primary"
                type="submit"
                style={{ width: '100%', marginTop: '8px' }}
              >
                Отправить заявку →
              </button>
              <p
                className="muted"
                style={{
                  fontSize: '11px',
                  margin: '10px 0 0',
                  lineHeight: 1.55,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                152-ФЗ: согласие на обработку персональных данных при отправке формы.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
