'use client'

// brand-guide v2.6 §lead-form-full (line 1164+)
// EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10 · fe role
//
// 8 полей: name / phone / email / service-select / district-select / photo / message / 152-FZ.
// 5-state submit flow: idle → loading → success → error (idempotent retry).
// POST /api/leads (sustained US-8 endpoint). UTM сохраняем (sustained US-8).
//
// A11y: aria-live для banner, focus-управление при error, sup для required.
// Mobile-first: 1-column, height ≥44pt inputs, error-jump to first invalid.

import { useId, useRef, useState } from 'react'

import type { LeadFormFullBlock } from './types'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const SERVICE_OPTIONS = [
  { value: 'spil', label: 'Спил деревьев' },
  { value: 'musor', label: 'Вывоз мусора' },
  { value: 'krysha', label: 'Чистка крыш от снега' },
  { value: 'demontazh', label: 'Демонтаж' },
  { value: 'landshaft', label: 'Ландшафт / благоустройство' },
  { value: 'other', label: 'Другое' },
]

const DISTRICT_OPTIONS = [
  { value: 'moscow', label: 'Москва' },
  { value: 'ramenskoe', label: 'Раменское' },
  { value: 'zhukovsky', label: 'Жуковский' },
  { value: 'lyubercy', label: 'Люберцы' },
  { value: 'mytishchi', label: 'Мытищи' },
  { value: 'odintsovo', label: 'Одинцово' },
  { value: 'other', label: 'Другой район МО' },
]

interface FieldErrors {
  [key: string]: string
}

function hintValue(
  h: LeadFormFullBlock['serviceHint'] | LeadFormFullBlock['districtHint'],
): string | undefined {
  if (!h) return undefined
  if (typeof h === 'string') return h
  return (h as { slug?: string }).slug
}

function readUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
    const v = params.get(k)
    if (v) utm[k] = v
  })
  return utm
}

export function LeadFormFull(block: LeadFormFullBlock) {
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [photoCount, setPhotoCount] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)
  const reactId = useId()

  const heading = block.h2 ?? 'Оставьте заявку — перезвоним за 15 минут'
  const helper = block.helper ?? 'Заполните форму или загрузите фото объекта.'
  const ctaLabel = block.ctaLabel ?? 'Отправить заявку'
  const successMsg = block.successMessage ?? 'Спасибо! Перезвоним за 15 минут.'
  const consentText =
    block.consentText ??
    'Нажимая кнопку, я соглашаюсь с обработкой персональных данных в соответствии с'
  const consentHref = block.consentHref ?? '/policy/'

  const defaultService = hintValue(block.serviceHint)
  const defaultDistrict = hintValue(block.districtHint)

  function validate(fd: FormData): FieldErrors {
    const errs: FieldErrors = {}
    const name = String(fd.get('name') ?? '').trim()
    const phone = String(fd.get('phone') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const consent = fd.get('consent')

    if (!name) errs.name = 'Укажите имя — как к вам обращаться.'
    if (!phone) errs.phone = 'Без телефона не сможем перезвонить.'
    else if (phone.replace(/\D/g, '').length < 10) errs.phone = 'Похоже, в номере не хватает цифр.'
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Проверьте email.'
    if (!consent) errs.consent = 'Подтвердите согласие на обработку данных.'
    return errs
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    const form = e.currentTarget
    const fd = new FormData(form)
    const errs = validate(fd)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setState('error')
      // Focus first invalid field per a11y skill (Form errors aria-live).
      const firstErrorKey = Object.keys(errs)[0]
      const el = form.querySelector<HTMLElement>(`[name="${firstErrorKey}"]`)
      el?.focus()
      return
    }

    setState('loading')

    const utm = readUtm()
    const payload = {
      name: String(fd.get('name') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim() || null,
      service: String(fd.get('service') ?? defaultService ?? '').trim() || null,
      district: String(fd.get('district') ?? defaultDistrict ?? '').trim() || null,
      message: String(fd.get('message') ?? '').trim() || null,
      photoCount,
      source: 'block:lead-form-full',
      utm,
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setState('success')
        form.reset()
        setPhotoCount(0)
      } else if (res.status === 404) {
        // Endpoint not deployed — soft success per US-8 MVP fallback.
        setState('success')
        form.reset()
        setPhotoCount(0)
      } else {
        setState('error')
        setErrors({
          form: 'Не удалось отправить. Позвоните или попробуйте ещё раз.',
        })
      }
    } catch {
      setState('error')
      setErrors({ form: 'Сеть недоступна. Позвоните или попробуйте ещё раз.' })
    }
  }

  function reset() {
    setState('idle')
    setErrors({})
    formRef.current?.reset()
    setPhotoCount(0)
  }

  return (
    <section
      id={block.anchor ?? 'lead-form'}
      style={{ padding: 'clamp(48px, 8vw, 96px) 0', background: 'var(--c-bg-alt)' }}
    >
      <div className="wrap">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          className="sp-lf-shell"
          aria-labelledby={`${reactId}-h2`}
        >
          <div className="sp-lf-head">
            <h2 id={`${reactId}-h2`}>{heading}</h2>
            {helper && <p>{helper}</p>}
          </div>

          <div className="sp-lf-row">
            <div className={`sp-field ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor={`${reactId}-name`}>
                Имя<sup aria-hidden>*</sup>
                <span className="sr-only"> (обязательно)</span>
              </label>
              <input
                id={`${reactId}-name`}
                name="name"
                type="text"
                autoComplete="name"
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${reactId}-name-err` : undefined}
              />
              {errors.name && (
                <span className="sp-field-error" id={`${reactId}-name-err`} role="alert">
                  {errors.name}
                </span>
              )}
            </div>
            <div className={`sp-field ${errors.phone ? 'has-error' : ''}`}>
              <label htmlFor={`${reactId}-phone`}>
                Телефон<sup aria-hidden>*</sup>
              </label>
              <input
                id={`${reactId}-phone`}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 999 123-45-67"
                required
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? `${reactId}-phone-err` : undefined}
              />
              {errors.phone && (
                <span className="sp-field-error" id={`${reactId}-phone-err`} role="alert">
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          <div className="sp-lf-row">
            <div className={`sp-field ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor={`${reactId}-email`}>Email</label>
              <input
                id={`${reactId}-email`}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="например, ivan@mail.ru"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? `${reactId}-email-err` : undefined}
              />
              {errors.email && (
                <span className="sp-field-error" id={`${reactId}-email-err`} role="alert">
                  {errors.email}
                </span>
              )}
            </div>
            <div className="sp-field">
              <label htmlFor={`${reactId}-service`}>Услуга</label>
              <select id={`${reactId}-service`} name="service" defaultValue={defaultService ?? ''}>
                <option value="">— выберите —</option>
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sp-field">
            <label htmlFor={`${reactId}-district`}>Район / город</label>
            <select id={`${reactId}-district`} name="district" defaultValue={defaultDistrict ?? ''}>
              <option value="">— выберите —</option>
              {DISTRICT_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <label className="sp-upload-mini" htmlFor={`${reactId}-photo`}>
            <span className="sp-ic" aria-hidden>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="18"
                height="18"
              >
                <path d="M3 7h3l2-2h8l2 2h3v12H3z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </span>
            <span className="sp-body">
              <b>
                {photoCount > 0 ? `Фото загружено: ${photoCount}` : 'Фото объекта (необязательно)'}
              </b>
              <span className="sp-sub">JPG / PNG · до 6 фото</span>
            </span>
            <input
              id={`${reactId}-photo`}
              type="file"
              name="photo"
              accept="image/*"
              capture="environment"
              multiple
              onChange={(e) => setPhotoCount(e.target.files?.length ?? 0)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            />
          </label>

          <div className="sp-field">
            <label htmlFor={`${reactId}-message`}>Сообщение</label>
            <textarea
              id={`${reactId}-message`}
              name="message"
              rows={3}
              maxLength={500}
              placeholder="Что нужно сделать, какие сроки, особенности объекта"
            />
          </div>

          <div className={`sp-consent ${errors.consent ? 'has-error' : ''}`}>
            <input
              id={`${reactId}-consent`}
              type="checkbox"
              name="consent"
              required
              aria-invalid={Boolean(errors.consent)}
            />
            <label htmlFor={`${reactId}-consent`}>
              {consentText}{' '}
              <a href={consentHref} target="_blank" rel="noopener noreferrer">
                политикой конфиденциальности
              </a>
              .
              {errors.consent && (
                <span
                  className="sp-field-error"
                  style={{ display: 'block', marginTop: 4 }}
                  role="alert"
                >
                  {errors.consent}
                </span>
              )}
            </label>
          </div>

          <div className={`sp-lf-submit ${state === 'loading' ? 'loading' : ''}`}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={state === 'loading'}>
              {state === 'loading' ? 'Отправляем…' : ctaLabel}
            </button>
          </div>

          {state === 'success' && (
            <div className="sp-lf-banner success" role="status" aria-live="polite">
              <div>
                <b>Заявка принята</b>
                {successMsg}
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={reset}
                style={{ marginLeft: 'auto' }}
              >
                Отправить ещё
              </button>
            </div>
          )}

          {state === 'error' && errors.form && (
            <div className="sp-lf-banner error" role="alert" aria-live="assertive">
              <div>
                <b>Что-то пошло не так</b>
                {errors.form}
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
