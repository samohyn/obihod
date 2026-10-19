import type { Payload } from 'payload'

import { sendEmail } from '@/lib/messengers/email'

/**
 * Письмо менеджеру о новой заявке — план 09, этап 1.
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
  photos?: unknown[] | null
  sourcePage?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
}

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
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'
  const utm = [doc.utmSource, doc.utmMedium, doc.utmCampaign].filter(Boolean).join(' / ')
  const details = [
    doc.phone && `Телефон: ${doc.phone}`,
    doc.name && `Имя: ${doc.name}`,
    doc.email && `Email: ${doc.email}`,
    doc.preferredChannel && `Удобный канал: ${doc.preferredChannel}`,
    service && `Услуга: ${service}`,
    district && `Район: ${district}`,
    doc.photos?.length ? `Фото: ${doc.photos.length} шт. — в заявке` : null,
    doc.sourcePage && `Страница: ${doc.sourcePage}`,
    utm && `Реклама (UTM): ${utm}`,
    `Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)`,
  ].filter(Boolean)
  const link = doc.id ? `\n\nОткрыть в админке: ${site}/admin/collections/leads/${doc.id}` : ''

  await sendEmail({
    to,
    subject: `Новая заявка${doc.id ? ` № ${doc.id}` : ''}${service ? ` — ${service}` : ''}`,
    text: details.join('\n') + link,
  })
}
