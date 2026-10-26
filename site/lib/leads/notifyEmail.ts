import type { Payload } from 'payload'

import { formatClockMsk, formatDuration } from '@/lib/leads/sla'
import { sendEmail } from '@/lib/messengers/email'

/**
 * Письмо менеджеру о новой заявке — план 09, этап 1; с этапа 2 — описание задачи, адрес и число фото
 * (сами фото — только в админке по ссылке).
 *
 * Telegram с VPS в РФ недоступен (api.telegram.org — таймаут), поэтому основной канал — почта
 * через SMTP Beget (РФ): телефон и имя в письме — не трансграничная передача. Получатель —
 * LEAD_NOTIFY_EMAIL. Не настроено (нет SMTP_HOST / LEAD_NOTIFY_EMAIL) — тихий пропуск с warn.
 */

export interface LeadEmailDoc {
  id?: string | number
  phone?: string | null
  name?: string | null
  email?: string | null
  preferredChannel?: string | null
  service?: number | string | { title?: string | null } | null
  district?: number | string | { nameNominative?: string | null } | null
  message?: string | null
  address?: string | null
  photoFiles?: unknown[] | null
  sourcePage?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  replyDueAt?: string | null
}

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'
/** Ссылка сразу на карточку в панели заявок (план 09, этап 5.4). */
export const leadCardUrl = (id: string | number) =>
  `${siteUrl()}/admin/collections/leads?tab=all&lead=${id}`

async function relationLabel(
  payload: Payload,
  collection: 'services' | 'districts',
  value: LeadEmailDoc['service'] | LeadEmailDoc['district'],
): Promise<string | null> {
  if (!value) return null
  if (typeof value === 'object') {
    return (
      ('title' in value ? value.title : null) ??
      ('nameNominative' in value ? value.nameNominative : null) ??
      null
    )
  }
  try {
    const doc = (await payload.findByID({ collection, id: value, depth: 0 })) as {
      title?: string
      nameNominative?: string
    }
    return doc.title ?? doc.nameNominative ?? null
  } catch {
    return String(value)
  }
}

export async function emailManagerAboutLead(doc: LeadEmailDoc, payload: Payload): Promise<void> {
  const to = process.env.LEAD_NOTIFY_EMAIL
  if (!to || !process.env.SMTP_HOST) {
    console.warn('[lead-email-notify] skipped: SMTP_HOST / LEAD_NOTIFY_EMAIL not configured')
    return
  }
  const [service, district] = await Promise.all([
    relationLabel(payload, 'services', doc.service),
    relationLabel(payload, 'districts', doc.district),
  ])
  const utm = [doc.utmSource, doc.utmMedium, doc.utmCampaign].filter(Boolean).join(' / ')
  const due = doc.replyDueAt ? formatClockMsk(new Date(doc.replyDueAt)) : null
  const details = [
    due && `Ответить до ${due} (МСК)`,
    doc.phone && `Телефон: ${doc.phone}`,
    doc.name && `Имя: ${doc.name}`,
    doc.email && `Email: ${doc.email}`,
    doc.preferredChannel && `Удобный канал: ${doc.preferredChannel}`,
    service && `Услуга: ${service}`,
    district && `Район: ${district}`,
    doc.address && `Адрес или район: ${doc.address}`,
    doc.message && `Что сделать: ${doc.message.slice(0, 1000)}`,
    // сами фото в письмо не кладём: снимки участка с адресом — персональные данные, смотреть в админке
    doc.photoFiles?.length ? `Фото: ${doc.photoFiles.length} шт. — открыть в заявке` : null,
    doc.sourcePage && `Страница: ${doc.sourcePage}`,
    utm && `Реклама (UTM): ${utm}`,
    `Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)`,
  ].filter(Boolean)
  const link = doc.id ? `\n\nОткрыть заявку: ${leadCardUrl(doc.id)}` : ''

  await sendEmail({
    to,
    subject: `Новая заявка${doc.id ? ` № ${doc.id}` : ''}${service ? ` — ${service}` : ''}${due ? ` · ответить до ${due}` : ''}`,
    text: details.join('\n') + link,
  })
}

export interface OverdueLead {
  id: number
  phone?: string | null
  name?: string | null
  service?: LeadEmailDoc['service']
  replyDueAt: string
}

/** Письмо «Просрочена заявка» — одно на запуск таймера, со всеми новыми просрочками. */
export async function emailManagerAboutOverdue(
  leads: OverdueLead[],
  payload: Payload,
  now = new Date(),
): Promise<void> {
  const to = process.env.LEAD_NOTIFY_EMAIL
  if (!to || !process.env.SMTP_HOST) {
    console.warn('[lead-overdue-notify] skipped: SMTP_HOST / LEAD_NOTIFY_EMAIL not configured')
    return
  }
  const lines = await Promise.all(
    leads.map(async (l) => {
      const service = await relationLabel(payload, 'services', l.service)
      const late = formatDuration(now.getTime() - new Date(l.replyDueAt).getTime())
      return [
        `№ ${l.id} · ${l.name || 'Без имени'} · ${l.phone ?? ''}${service ? ` · ${service}` : ''}`,
        `Срок был ${formatClockMsk(new Date(l.replyDueAt))} — просрочено на ${late}`,
        `Открыть: ${leadCardUrl(l.id)}`,
      ].join('\n')
    }),
  )
  const first = leads[0]
  await sendEmail({
    to,
    subject:
      leads.length === 1
        ? `Просрочена заявка № ${first.id} — ${first.phone ?? ''}`
        : `Просрочено заявок: ${leads.length}`,
    text: `Срок ответа вышел, итог звонка не отмечен.\n\n${lines.join('\n\n')}`,
  })
}
