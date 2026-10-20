'use client'

// Короткая форма заявки → POST /api/leads. Согласие на ПДн — отдельный неотмеченный чекбокс (152-ФЗ),
// после отправки — «Перезвоним до HH:MM» (оффер, 10_offer.md §3). Фото API пока не принимает
// (этап 5 плана 09), поэтому вместо загрузки — ссылка в мессенджер, без молчаливой потери файлов.

import Link from 'next/link'
import { useId, useState, type FormEvent } from 'react'

import { callbackDeadline } from '@/lib/leads/callbackDeadline'

import { Icon } from './shared'
import s from './FinalForm.module.css'

const PHONE_RE = /^[+\d][\d\s()-]{9,}$/

export function LeadFormV3({
  title,
  source,
  photoHref,
  phoneDisplay,
}: {
  title: string
  source: string
  photoHref: string | null
  phoneDisplay: string
}) {
  const uid = useId()
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')
  const [deadline, setDeadline] = useState('')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!PHONE_RE.test(phone.trim())) {
      setError('Укажите телефон, например +7 916 123-45-67')
      setStatus('error')
      return
    }
    if (!consent) {
      setError('Отметьте согласие на обработку персональных данных')
      setStatus('error')
      return
    }
    setStatus('sending')
    setError('')
    try {
      const utm = new URLSearchParams(window.location.search)
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          source,
          sourcePage: window.location.pathname,
          utmSource: utm.get('utm_source') ?? undefined,
          utmMedium: utm.get('utm_medium') ?? undefined,
          utmCampaign: utm.get('utm_campaign') ?? undefined,
          email_url: honeypot,
        }),
      })
      if (!res.ok) {
        setError(
          res.status === 429
            ? 'Слишком много заявок подряд. Попробуйте через минуту.'
            : `Не удалось отправить заявку. Позвоните: ${phoneDisplay}`,
        )
        setStatus('error')
        return
      }
      setDeadline(callbackDeadline())
      setStatus('sent')
    } catch {
      setError(`Нет связи с сервером. Позвоните: ${phoneDisplay}`)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className={s.card} role="status" aria-live="polite">
        <div className={s.sent}>
          <Icon name="checkCircle" size={40} />
          <b>Заявка принята</b>
          <p>
            Перезвоним до <span className={s.mono}>{deadline}</span>.
            {photoHref && ' Пришлите фото участка — так посчитаем точнее.'}
          </p>
          {photoHref && (
            <a href={photoHref} className={s.photoLink}>
              <Icon name="camera" size={20} />
              Отправить фото
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <form className={s.card} onSubmit={onSubmit} noValidate>
      <div className={s.cardHead}>
        <b>{title}</b>
        <span>ответ за 10 мин</span>
      </div>
      <div className={s.field}>
        <label htmlFor={`${uid}-phone`}>Телефон</label>
        <input
          id={`${uid}-phone`}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={status === 'error' && !PHONE_RE.test(phone.trim())}
          aria-describedby={error ? `${uid}-err` : undefined}
        />
      </div>
      {photoHref && (
        <div className={s.field}>
          <span className={s.fieldLabel}>Фото участка — по желанию</span>
          <a href={photoHref} className={s.photoLink}>
            <Icon name="camera" size={20} />
            Отправить 2–3 фото
          </a>
        </div>
      )}
      <input
        className={s.hp}
        type="text"
        name="email_url"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
      />
      <button type="submit" className={s.submit} disabled={status === 'sending'}>
        {status === 'sending' ? 'Отправляем…' : 'Получить смету'}
        {status !== 'sending' && <Icon name="arrow" size={18} />}
      </button>
      <label className={s.consent}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          Согласен на обработку персональных данных в соответствии с{' '}
          <Link href="/soglasie-na-obrabotku-personalnyh-dannyh/">согласием</Link> и{' '}
          <Link href="/politika-konfidentsialnosti/">политикой конфиденциальности</Link>
        </span>
      </label>
      {status === 'error' && error && (
        <p id={`${uid}-err`} className={s.error} role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
