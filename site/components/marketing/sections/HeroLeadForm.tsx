'use client'

import { useState } from 'react'

/**
 * HeroLeadForm — клиентская форма-карточка в Hero (§01).
 * Source: newui/homepage-classic.html · .hpc-form-card.
 * POST → /api/leads.
 */

const SERVICE_OPTIONS = [
  { slug: '', label: 'Выберите услугу', disabled: true },
  { slug: 'arboristika', label: 'Арбористика — спил, обрезка, удаление' },
  { slug: 'chistka-krysh', label: 'Чистка крыш — снег, наледь, водостоки' },
  { slug: 'vyvoz-musora', label: 'Вывоз мусора — контейнеры, газель' },
  { slug: 'demontazh', label: 'Демонтаж — сараи, бани, дома' },
  { slug: 'consultation', label: 'Не уверен — нужна консультация' },
]

type FormState = {
  name: string
  phone: string
  service: string
  address: string
  email_url: string
}

const empty: FormState = { name: '', phone: '', service: '', address: '', email_url: '' }

export function HeroLeadForm() {
  const [form, setForm] = useState<FormState>(empty)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.phone) {
      setErrMsg('Укажите телефон')
      setStatus('error')
      return
    }
    setStatus('sending')
    setErrMsg('')
    try {
      const utm = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone,
          name: form.name || undefined,
          service: form.service || undefined,
          source: 'homepage-hero',
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/',
          utmSource: utm.get('utm_source') ?? undefined,
          utmMedium: utm.get('utm_medium') ?? undefined,
          utmCampaign: utm.get('utm_campaign') ?? undefined,
          email_url: form.email_url,
        }),
      })
      if (!res.ok) {
        if (res.status === 429) setErrMsg('Слишком частые запросы. Попробуйте через минуту.')
        else setErrMsg('Не удалось отправить. Позвоните +7 (495) 000-00-00.')
        setStatus('error')
        return
      }
      setStatus('sent')
      setForm(empty)
    } catch {
      setErrMsg('Сеть недоступна. Позвоните +7 (495) 000-00-00.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="hpc-form-card">
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: '32px 24px',
            background: 'var(--c-success)',
            color: 'var(--c-on-primary)',
            borderRadius: 'var(--radius)',
            textAlign: 'center',
          }}
        >
          <strong style={{ fontSize: '20px', display: 'block', marginBottom: '8px' }}>
            Заявка принята
          </strong>
          Перезвоним в течение 10 минут в WhatsApp / Telegram.
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
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="hero-name">Имя</label>
          <input
            id="hero-name"
            type="text"
            placeholder="Как к вам обращаться"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="hero-phone">Телефон</label>
          <input
            id="hero-phone"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            autoComplete="tel"
            required
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="hero-service">Услуга</label>
          <select
            id="hero-service"
            value={form.service}
            onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
          >
            {SERVICE_OPTIONS.map((o) => (
              <option key={o.slug} value={o.slug} disabled={o.disabled}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="hero-address">
            Адрес или район{' '}
            <span className="muted" style={{ fontWeight: '400' }}>
              (опционально)
            </span>
          </label>
          <input
            id="hero-address"
            type="text"
            placeholder="Истра, ул. Лесная, СНТ Берёзовая роща"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />
        </div>
        {/* honeypot */}
        <input
          type="text"
          name="email_url"
          tabIndex={-1}
          autoComplete="off"
          value={form.email_url}
          onChange={(e) => setForm((f) => ({ ...f, email_url: e.target.value }))}
          style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
          aria-hidden="true"
        />
        {status === 'error' && errMsg && (
          <p role="alert" style={{ color: 'var(--c-error)', fontSize: '13px', margin: '6px 0 0' }}>
            {errMsg}
          </p>
        )}
        <button
          className="btn btn-primary"
          type="submit"
          disabled={status === 'sending'}
          style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
        >
          {status === 'sending' ? 'Отправляем…' : 'Получить смету →'}
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
