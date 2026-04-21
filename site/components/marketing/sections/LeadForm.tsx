'use client'

import { Icon } from '../_shared/Icon'

/**
 * UI-форма заявки на замер. На этой стадии без обработчика (UI-only).
 * TODO: Server Action → Leads коллекция + webhook в amoCRM/Telegram — после
 * того, как оператор даст секреты и подтверждение интеграций.
 */
export function LeadForm() {
  return (
    <form className="cta-form" aria-label="Заявка на замер" onSubmit={(e) => e.preventDefault()}>
      <div className="cta-form-title">Заявка на замер</div>
      <label htmlFor="cta-name" style={{ display: 'none' }}>
        Имя
      </label>
      <input
        id="cta-name"
        name="name"
        className="cta-input"
        placeholder="Ваше имя"
        autoComplete="name"
      />
      <label htmlFor="cta-phone" style={{ display: 'none' }}>
        Телефон
      </label>
      <input
        id="cta-phone"
        name="phone"
        type="tel"
        className="cta-input"
        placeholder="+7 (___) ___-__-__"
        autoComplete="tel"
      />
      <label htmlFor="cta-addr" style={{ display: 'none' }}>
        Адрес
      </label>
      <input id="cta-addr" name="address" className="cta-input" placeholder="Адрес или район" />
      <label htmlFor="cta-svc" style={{ display: 'none' }}>
        Тип работы
      </label>
      <select id="cta-svc" name="service" className="cta-input" defaultValue="">
        <option value="" disabled>
          Тип работы
        </option>
        <option value="arbo">Спил деревьев</option>
        <option value="sneg">Уборка снега</option>
        <option value="demontazh">Демонтаж</option>
        <option value="musor">Вывоз мусора</option>
        <option value="subscription">Абонемент на участок</option>
      </select>
      <button
        type="submit"
        className="btn btn-primary btn-lg"
        style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
      >
        Отправить заявку
        <Icon.ArrowRight size={18} />
      </button>
      <div className="cta-note">
        Отправляя форму, вы&nbsp;соглашаетесь с&nbsp;политикой обработки персональных данных.
        Ответим в&nbsp;течение 15&nbsp;минут в&nbsp;будний день.
      </div>
    </form>
  )
}
