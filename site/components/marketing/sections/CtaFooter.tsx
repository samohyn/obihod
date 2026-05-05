'use client'

import { useState } from 'react'

/**
 * CtaFooter — секция §11 (pre-footer).
 * Source: newui/homepage-classic.html · 2 forms (фото-upload и phone-form).
 * POST → /api/leads (existing endpoint), honeypot (email_url) включён.
 */

type FormState = { name: string; phone: string; comment: string; email_url: string }

const empty: FormState = { name: '', phone: '', comment: '', email_url: '' }

export function CtaFooter() {
  const [form, setForm] = useState<FormState>(empty)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState<string>('')

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
          source: 'homepage-cta-footer',
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/',
          utmSource: utm.get('utm_source') ?? undefined,
          utmMedium: utm.get('utm_medium') ?? undefined,
          utmCampaign: utm.get('utm_campaign') ?? undefined,
          email_url: form.email_url, // honeypot
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
          style={{ textAlign: 'center', maxWidth: '22ch', marginLeft: 'auto', marginRight: 'auto' }}
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
            <a
              className="hp-dropzone"
              href="#foto-smeta"
              style={{ minHeight: '180px', textDecoration: 'none' }}
            >
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
            </a>
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

            {status === 'sent' ? (
              <div
                role="status"
                aria-live="polite"
                style={{
                  padding: '24px',
                  background: 'var(--c-success)',
                  color: 'var(--c-on-primary)',
                  borderRadius: 'var(--radius)',
                  textAlign: 'center',
                }}
              >
                <strong>Заявка принята.</strong>
                <br />
                Перезвоним в течение 10 минут.
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <input
                    className="input"
                    type="text"
                    placeholder="Имя"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="field">
                  <input
                    className="input"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    autoComplete="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="field">
                  <input
                    className="input"
                    type="text"
                    placeholder="Например: спил 3 берёз, Раменское, аварийно"
                    value={form.comment}
                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                  />
                </div>
                {/* honeypot — скрыт от пользователя */}
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
                  <p
                    role="alert"
                    style={{ color: 'var(--c-error)', fontSize: '13px', margin: '4px 0 0' }}
                  >
                    {errMsg}
                  </p>
                )}
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={status === 'sending'}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  {status === 'sending' ? 'Отправляем…' : 'Отправить заявку →'}
                </button>
                <p
                  className="muted"
                  style={{
                    fontSize: '11px',
                    margin: '10px 0 0',
                    lineHeight: '1.55',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  152-ФЗ: согласие на обработку персональных данных при отправке формы.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
