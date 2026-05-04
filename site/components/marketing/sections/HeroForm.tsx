'use client'

export function HeroForm() {
  return (
    <div className="hpc-form-card">
      <div className="head">
        <div className="eyebrow">§ Заявка · ответ за 10 минут</div>
        <h3 className="t">Рассчитать стоимость</h3>
        <p className="s">Менеджер пришлёт смету в WhatsApp / Telegram</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          alert('Демо-макет: форма не подключена')
        }}
      >
        <div className="field">
          <label>Имя</label>
          <input type="text" placeholder="Как к вам обращаться" autoComplete="name" />
        </div>
        <div className="field">
          <label>Телефон</label>
          <input type="tel" placeholder="+7 (___) ___-__-__" autoComplete="tel" required />
        </div>
        <div className="field">
          <label>Услуга</label>
          <select required defaultValue="">
            <option value="" disabled>
              Выберите услугу
            </option>
            <option>Арбористика — спил, обрезка, удаление</option>
            <option>Чистка крыш — снег, наледь, водостоки</option>
            <option>Вывоз мусора — контейнеры, газель</option>
            <option>Демонтаж — сараи, бани, дома</option>
            <option>Не уверен — нужна консультация</option>
          </select>
        </div>
        <div className="field">
          <label>
            Адрес или район{' '}
            <span className="muted" style={{ fontWeight: 400 }}>
              (опционально)
            </span>
          </label>
          <input type="text" placeholder="Истра, ул. Лесная, СНТ Берёзовая роща" />
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
        >
          Получить смету →
        </button>
        <div className="or">или</div>
        <a className="photo-cta" href="#foto-smeta">
          <svg
            className="ic"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 7h3l2-3h8l2 3h3v12H3z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span>
            <strong>Прислать фото →</strong> расчёт за 10 минут по фото объекта
          </span>
        </a>
        <p className="note">
          Нажимая «Получить смету», вы соглашаетесь с обработкой персональных данных согласно
          политике конфиденциальности (152-ФЗ).
        </p>
      </form>
    </div>
  )
}
