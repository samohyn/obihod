'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from '@payloadcms/ui'

import { formatClockMsk } from '@/lib/leads/sla'
import {
  CONTACT_RESULT_OPTIONS,
  LEAD_STATUSES,
  LEAD_STATUS_HINTS,
  LEAD_STATUS_LABELS,
  type ContactResult,
  type LeadStatus,
} from '@/lib/leads/status'

import { updateLead, type LeadPatch } from './actions'
import { PhotoViewer } from './PhotoViewer'
import { SlaChip } from './SlaChip'
import type { InboxLead } from './types'

const NOT_SET = 'Не указано'

const dateTime = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Europe/Moscow',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso))
    : NOT_SET

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

/** ISO → значение <input type="datetime-local"> в часовом поясе браузера. */
function toLocalInput(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function tomorrowAt(hour: number): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

export function LeadCard({
  lead,
  queueHref,
  nextHref,
}: {
  lead: InboxLead
  queueHref: string
  nextHref: string | null
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [comment, setComment] = useState(lead.managerComment ?? '')
  const [reminder, setReminder] = useState(toLocalInput(lead.nextActionAt))

  const save = (patch: LeadPatch, done: string) =>
    startTransition(async () => {
      const res = await updateLead(lead.id, patch)
      if (res.ok) {
        toast.success(done)
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })

  const setResult = (value: ContactResult) =>
    save(
      { contactResult: value },
      `Итог звонка: «${CONTACT_RESULT_OPTIONS.find((o) => o.value === value)?.label}»`,
    )
  const setStatus = (value: LeadStatus) =>
    save({ status: value }, `Статус «${LEAD_STATUS_LABELS[value]}»`)
  const setNext = (iso: string | null) => {
    setReminder(toLocalInput(iso))
    save({ nextActionAt: iso }, iso ? `Напомним ${dateTime(iso)}` : 'Напоминание убрано')
  }

  const title = lead.name ?? 'Без имени'
  const place = [lead.serviceTitle, lead.districtTitle].filter(Boolean).join(' · ')

  return (
    <article className="lead-card" aria-labelledby="lead-card-title" aria-busy={pending}>
      <Link href={queueHref} scroll={false} className="lead-card__back">
        ← К очереди
      </Link>

      <header className="lead-card__head">
        <div>
          <h2 id="lead-card-title" className="lead-card__title">
            {title}
          </h2>
          <p className="lead-card__meta">
            Заявка № {lead.id} · {dateTime(lead.createdAt)}
            {place && ` · ${place}`}
          </p>
        </div>
        <span className={`lead-status-badge lead-status-badge--${lead.status}`}>
          {LEAD_STATUS_LABELS[lead.status]}
        </span>
      </header>

      <section className="lead-card__call" aria-label="Звонок">
        <a className="lead-card__phone" href={telHref(lead.phone)}>
          {lead.phone}
        </a>
        <a className="lead-card__call-btn" href={telHref(lead.phone)}>
          Позвонить
        </a>
        <SlaChip lead={lead} size="lg" />
        {lead.firstContactAt && (
          <p className="lead-card__note">
            Итог первого звонка отмечен в {formatClockMsk(new Date(lead.firstContactAt))}
          </p>
        )}
      </section>

      <fieldset className="lead-card__group">
        <legend>Первый звонок</legend>
        <div className="lead-card__buttons">
          {CONTACT_RESULT_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              className="lead-btn"
              aria-pressed={lead.contactResult === o.value}
              disabled={pending}
              onClick={() => setResult(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="lead-card__hint">Таймер останавливает только итог звонка.</p>
      </fieldset>

      <fieldset className="lead-card__group">
        <legend>Статус</legend>
        <div className="lead-card__buttons lead-card__buttons--status">
          {LEAD_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              className="lead-btn"
              aria-pressed={lead.status === s}
              title={LEAD_STATUS_HINTS[s]}
              disabled={pending}
              onClick={() => lead.status !== s && setStatus(s)}
            >
              {LEAD_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <p className="lead-card__hint">{LEAD_STATUS_HINTS[lead.status]}</p>
      </fieldset>

      <fieldset className="lead-card__group">
        <legend>Напомнить</legend>
        <div className="lead-card__buttons">
          <button
            type="button"
            className="lead-btn"
            disabled={pending}
            onClick={() => setNext(new Date(Date.now() + 3_600_000).toISOString())}
          >
            Через час
          </button>
          <button
            type="button"
            className="lead-btn"
            disabled={pending}
            onClick={() => setNext(tomorrowAt(10))}
          >
            Завтра в 10:00
          </button>
          <label className="lead-card__datetime">
            <span className="lead-sr">Дата и время напоминания</span>
            <input
              type="datetime-local"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              onBlur={() => {
                const iso = reminder ? new Date(reminder).toISOString() : null
                if (iso !== lead.nextActionAt) setNext(iso)
              }}
            />
          </label>
          {lead.nextActionAt && (
            <button
              type="button"
              className="lead-btn lead-btn--quiet"
              disabled={pending}
              onClick={() => setNext(null)}
            >
              Убрать
            </button>
          )}
        </div>
        <p className="lead-card__hint">
          {lead.nextActionAt
            ? `Напомним ${dateTime(lead.nextActionAt)}. Срок ответа не меняется.`
            : 'Например, «перезвонить завтра». Срок ответа не меняется.'}
        </p>
      </fieldset>

      <section className="lead-card__group" aria-labelledby="lead-task">
        <h3 id="lead-task">Что нужно сделать</h3>
        <p className="lead-card__text">{lead.message ?? NOT_SET}</p>
        <dl className="lead-card__facts">
          <dt>Адрес или район</dt>
          <dd>{lead.address ?? NOT_SET}</dd>
          <dt>Услуга</dt>
          <dd>{lead.serviceTitle ?? NOT_SET}</dd>
          <dt>Район</dt>
          <dd>{lead.districtTitle ?? NOT_SET}</dd>
          {lead.email && (
            <>
              <dt>Почта</dt>
              <dd>
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </dd>
            </>
          )}
        </dl>
        <PhotoViewer photos={lead.photos} />
      </section>

      <section className="lead-card__group" aria-labelledby="lead-comment-label">
        <h3 id="lead-comment-label">Комментарий менеджера</h3>
        <textarea
          className="lead-card__comment"
          aria-labelledby="lead-comment-label"
          rows={3}
          maxLength={4000}
          value={comment}
          placeholder="Что договорились, что уточнить. Клиент не видит."
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="button"
          className="lead-btn"
          disabled={pending || comment === (lead.managerComment ?? '')}
          onClick={() => save({ managerComment: comment }, 'Комментарий сохранён')}
        >
          Сохранить комментарий
        </button>
      </section>

      <section className="lead-card__group" aria-labelledby="lead-source">
        <h3 id="lead-source">Источник</h3>
        <dl className="lead-card__facts">
          <dt>Страница</dt>
          <dd>
            {lead.sourcePage ? (
              <a href={lead.sourcePage} target="_blank" rel="noreferrer">
                {lead.sourcePage}
              </a>
            ) : (
              NOT_SET
            )}
          </dd>
          <dt>Рекламный канал</dt>
          <dd>{lead.utmSource ?? NOT_SET}</dd>
          <dt>Тип трафика</dt>
          <dd>{lead.utmMedium ?? NOT_SET}</dd>
          <dt>Кампания</dt>
          <dd>{lead.utmCampaign ?? NOT_SET}</dd>
        </dl>
        <details className="lead-card__consent">
          <summary>Согласие на обработку персональных данных</summary>
          <p>
            Дано: {dateTime(lead.consentAt)} · редакция: {lead.consentVersion ?? NOT_SET}
          </p>
        </details>
      </section>

      <footer className="lead-card__foot">
        <a href={`/admin/collections/leads/${lead.id}`}>Все поля заявки</a>
        {nextHref && (
          <Link href={nextHref} scroll={false} className="lead-btn">
            Следующая заявка →
          </Link>
        )}
      </footer>

      <div className="lead-card__sticky">
        <a className="lead-card__call-btn" href={telHref(lead.phone)}>
          Позвонить {lead.phone}
        </a>
      </div>
    </article>
  )
}
