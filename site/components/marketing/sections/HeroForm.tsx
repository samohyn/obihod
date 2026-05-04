'use client'

import { useState } from 'react'

type State = 'idle' | 'loading' | 'success' | 'error'

export function HeroForm() {
  const [state, setState] = useState<State>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'loading') return
    setState('loading')

    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/leads/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name') ?? undefined,
          phone: fd.get('phone') ?? '',
          service: fd.get('service') ?? undefined,
          district: fd.get('district') ?? undefined,
          sourcePage: '/',
          source: 'hero-form',
        }),
      })
      if (res.status === 201 || res.status === 200) {
        setState('success')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="hpc-form-card">
        <div className="head">
          <div className="eyebrow">§ Заявка · отправлена</div>
          <h3 className="t">Спасибо!</h3>
          <p className="s">Менеджер пришлёт смету в WhatsApp / Telegram в течение 10 минут.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hpc-form-card">
      <div className="head">
        <div className="eyebrow">§ Заявка · ответ за 10 минут</div>
        <h3 className="t">Рассчитать стоимость</h3>
        <p className="s">Менеджер пришлёт смету в WhatsApp / Telegram</p>
      </div>
      <form onSubmit={handleSubmit}>
        {/* honeypot */}
        <input name="email_url" type="text" style={{ display: 'none' }} tabIndex={-1} />

        <div className="field">
          <label htmlFor="hf-name">Имя</label>
          <input
            id="hf-name"
            name="name"
            type="text"
            placeholder="Как к вам обращаться"
            autoComplete="name"
          />
        </div>
        <div className="field">
          <label htmlFor="hf-phone">Телефон</label>
          <input
            id="hf-phone"
            name="phone"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            autoComplete="tel"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="hf-service">Услуга</label>
          <select id="hf-service" name="service" required defaultValue="">
            <option value="" disabled>
              Выберите услугу
            </option>
            <option value="arboristika">Арбористика — спил, обрезка, удаление</option>
            <option value="chistka-krysh">Чистка крыш — снег, наледь, водостоки</option>
            <option value="vyvoz-musora">Вывоз мусора — контейнеры, газель</option>
            <option value="demontazh">Демонтаж — сараи, бани, дома</option>
            <option value="consultation">Не уверен — нужна консультация</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="hf-district">
            Адрес или район{' '}
            <span className="muted" style={{ fontWeight: 400 }}>
              (опционально)
            </span>
          </label>
          <input
            id="hf-district"
            name="district"
            type="text"
            placeholder="Истра, ул. Лесная, СНТ Берёзовая роща"
          />
        </div>

        {state === 'error' && (
          <p style={{ color: 'var(--c-error, #c0392b)', fontSize: 13, margin: '0 0 8px' }}>
            Ошибка отправки. Позвоните нам напрямую.
          </p>
        )}

        <button
          className="btn btn-primary"
          type="submit"
          disabled={state === 'loading'}
          style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
          aria-label="Получить смету"
        >
          {state === 'loading' ? 'Отправляем…' : 'Получить смету →'}
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
