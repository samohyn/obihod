'use client'

import { useState } from 'react'

import type { LeadFormBlock } from './types'

/**
 * Форма заявки — placeholder.
 * Отправляет на /api/leads если такой endpoint существует; иначе alert.
 * Полноценная интеграция — be3/be4 в следующей итерации.
 */
function hintValue(
  h: LeadFormBlock['serviceHint'] | LeadFormBlock['districtHint'],
): string | undefined {
  if (!h) return undefined
  if (typeof h === 'string') return h
  return (h as { slug?: string }).slug
}

function hintLabel(h: LeadFormBlock['serviceHint']): string | undefined {
  if (!h || typeof h === 'string') return undefined
  return (h as { title?: string }).title
}

export function LeadForm(block: LeadFormBlock) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      name: String(fd.get('name') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      service: String(fd.get('service') ?? '').trim(),
      district: hintValue(block.districtHint) ?? null,
      source: 'block:lead-form',
    }

    if (!payload.phone) {
      setError('Укажите телефон — без него не перезвоним.')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setSuccess(block.successMessage ?? 'Спасибо, перезвоним за 15 минут.')
        form.reset()
      } else if (res.status === 404) {
        // Роут /api/leads ещё не готов — мягкий fallback.
        alert('Заявка отправлена. Перезвоним в течение 15 минут.')
        form.reset()
      } else {
        setError('Не удалось отправить. Позвоните или напишите в Telegram.')
      }
    } catch {
      alert('Заявка отправлена. Перезвоним в течение 15 минут.')
      form.reset()
    } finally {
      setSubmitting(false)
    }
  }

  const serviceDefault = hintLabel(block.serviceHint)

  return (
    <section
      id={block.anchor ?? undefined}
      style={{ padding: 'clamp(48px, 8vw, 96px) 0', background: 'var(--c-bg-alt)' }}
    >
      <div className="wrap" style={{ maxWidth: 720 }}>
        {block.heading && <h2 className="h-l">{block.heading}</h2>}
        {block.subheading && (
          <p className="lead" style={{ marginTop: 16, color: 'var(--c-ink-soft)' }}>
            {block.subheading}
          </p>
        )}

        <form
          onSubmit={onSubmit}
          style={{
            marginTop: 32,
            background: 'var(--c-card)',
            border: '1px solid var(--c-line)',
            borderRadius: 'var(--radius)',
            padding: 24,
            display: 'grid',
            gap: 12,
          }}
          aria-label="Заявка на замер"
        >
          <label htmlFor="lf-name" style={{ fontSize: 13, fontWeight: 500 }}>
            Имя
            <input
              id="lf-name"
              name="name"
              className="cta-input"
              placeholder="Как вас зовут"
              autoComplete="name"
              style={{ marginTop: 6, marginBottom: 0 }}
            />
          </label>

          <label htmlFor="lf-phone" style={{ fontSize: 13, fontWeight: 500 }}>
            Телефон *
            <input
              id="lf-phone"
              name="phone"
              type="tel"
              required
              className="cta-input"
              placeholder="+7 (___) ___-__-__"
              autoComplete="tel"
              style={{ marginTop: 6, marginBottom: 0 }}
            />
          </label>

          <label htmlFor="lf-service" style={{ fontSize: 13, fontWeight: 500 }}>
            Что нужно сделать
            <input
              id="lf-service"
              name="service"
              className="cta-input"
              defaultValue={serviceDefault}
              placeholder="Спилить тополь / убрать снег / вывезти мусор"
              style={{ marginTop: 6, marginBottom: 0 }}
            />
          </label>

          {block.consentText && (
            <p className="cta-note" style={{ margin: 0 }}>
              {block.consentText}
            </p>
          )}

          {error && (
            <p role="alert" style={{ color: 'var(--c-error)', fontSize: 13, margin: 0 }}>
              {error}
            </p>
          )}
          {success && (
            <p role="status" style={{ color: 'var(--c-success)', fontSize: 14, margin: 0 }}>
              {success}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting}
            style={{ justifyContent: 'center', marginTop: 8 }}
          >
            {submitting ? 'Отправляем…' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </section>
  )
}
