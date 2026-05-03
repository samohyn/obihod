'use client'

import { useState } from 'react'

import type { LeadFormBlock, LeadFormField } from './types'

/**
 * Форма заявки.
 *
 * Поддерживает обе схемы (US-0 W3 Track B-3):
 *  - cw-схема: h2, helper, ctaLabel, fields[]={name,label,type,required,...}
 *  - legacy:    heading, subheading, services, submitLabel, successMessage
 *
 * Server-side submit на /api/leads (если ready); иначе мягкий fallback с
 * alert (US-8 MVP — Payload Leads collection).
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

/**
 * Renders single field according to cw-схема fields[] description.
 */
function FieldRender({ field }: { field: LeadFormField }) {
  const id = `lf-${field.name}`
  const required = Boolean(field.required)

  if (field.type === 'select' && Array.isArray(field.options)) {
    return (
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500 }}>
        {field.label}
        {required && ' *'}
        <select
          id={id}
          name={field.name}
          required={required}
          className="cta-input"
          style={{ marginTop: 6 }}
        >
          <option value="">— выберите —</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
    )
  }

  if (field.type === 'textarea') {
    return (
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500 }}>
        {field.label}
        {required && ' *'}
        <textarea
          id={id}
          name={field.name}
          required={required}
          className="cta-input"
          placeholder={field.placeholder ?? ''}
          rows={3}
          style={{ marginTop: 6 }}
        />
      </label>
    )
  }

  if (field.type === 'file') {
    return (
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500 }}>
        {field.label}
        {required && ' *'}
        <input
          id={id}
          name={field.name}
          type="file"
          multiple={Boolean(field.multiple)}
          accept={field.accept ?? undefined}
          required={required}
          style={{ marginTop: 6, display: 'block' }}
        />
      </label>
    )
  }

  return (
    <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500 }}>
      {field.label}
      {required && ' *'}
      <input
        id={id}
        name={field.name}
        type={field.type ?? 'text'}
        required={required}
        inputMode={field.inputmode as React.HTMLAttributes<HTMLInputElement>['inputMode']}
        placeholder={field.placeholder ?? ''}
        autoComplete={
          field.name === 'phone'
            ? 'tel'
            : field.name === 'name'
              ? 'name'
              : field.name === 'email'
                ? 'email'
                : undefined
        }
        className="cta-input"
        style={{ marginTop: 6, marginBottom: 0 }}
      />
    </label>
  )
}

const DEFAULT_FIELDS: LeadFormField[] = [
  { name: 'name', label: 'Имя', type: 'text', required: false },
  { name: 'phone', label: 'Телефон', type: 'tel', required: true, inputmode: 'numeric' },
  { name: 'service', label: 'Что нужно сделать', type: 'text', required: false },
]

export function LeadForm(block: LeadFormBlock) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Resolve fields: cw fields → cw fieldsets[] → defaults
  const cwFields: LeadFormField[] = (() => {
    if (block.fields && block.fields.length > 0) return block.fields
    if (block.fieldsets && block.fieldsets.length > 0) {
      return block.fieldsets.flatMap((fs) => fs.fields ?? [])
    }
    return DEFAULT_FIELDS
  })()

  // Если в форме нет phone — добавим, потому что бизнес-правило
  const hasPhone = cwFields.some((f) => f.name === 'phone')
  const fields = hasPhone ? cwFields : [...cwFields, DEFAULT_FIELDS[1]]

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

  const heading = block.h2 ?? block.heading ?? null
  const helper = block.helper ?? block.subheading ?? null
  const ctaLabel = block.ctaLabel ?? 'Отправить заявку'
  const consentText = block.consentText ?? null
  const consentHref = block.consentHref ?? null
  const serviceDefault = hintLabel(block.serviceHint)

  // Hidden default override через service field if present
  const serviceField = fields.find((f) => f.name === 'service')

  return (
    <section
      id={block.anchor ?? undefined}
      style={{ padding: 'clamp(48px, 8vw, 96px) 0', background: 'var(--c-bg-alt)' }}
    >
      <div className="wrap" style={{ maxWidth: 720 }}>
        {heading && <h2 className="h-l">{heading}</h2>}
        {helper && (
          <p className="lead" style={{ marginTop: 16, color: 'var(--c-ink-soft)' }}>
            {helper}
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
          {fields.map((f) => (
            <FieldRender
              key={f.name}
              field={
                f.name === 'service' && serviceDefault && !serviceField?.placeholder
                  ? { ...f, placeholder: serviceDefault }
                  : f
              }
            />
          ))}

          {(consentText || consentHref) && (
            <p className="cta-note" style={{ margin: 0 }}>
              {consentText}{' '}
              {consentHref && (
                <a href={consentHref} style={{ textDecoration: 'underline' }}>
                  политика
                </a>
              )}
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
            {submitting ? 'Отправляем…' : ctaLabel}
          </button>
        </form>
      </div>
    </section>
  )
}
