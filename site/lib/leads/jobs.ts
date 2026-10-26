import type { Payload } from 'payload'

import { CLOSED_STATUSES } from '@/lib/leads/status'
import { DEFAULT_COMPANY } from '@/lib/offer'

import { emailManagerAboutOverdue, type OverdueLead } from './notifyEmail'

/**
 * Задачи по заявкам, которые запускает таймер systemd на сервере (план 09, этап 5.4;
 * deploy/leads/): письмо о просрочке — раз в минуту, удаление фото закрытых заявок — раз в сутки
 * после бэкапа. Обе идемпотентны: повторный запуск ничего не дублирует.
 */

const MINUTE = 60_000
// Старые просрочки письмом не поднимаем: первый запуск не должен засыпать почту давними заявками.
const OVERDUE_LOOKBACK_MS = 6 * 60 * MINUTE

export async function notifyOverdueLeads(payload: Payload, now = new Date()) {
  const res = await payload.find({
    collection: 'leads',
    depth: 0,
    limit: 50,
    overrideAccess: true,
    sort: 'replyDueAt',
    where: {
      and: [
        { archivedAt: { exists: false } },
        { status: { not_in: [...CLOSED_STATUSES] } },
        { firstContactAt: { exists: false } },
        { overdueNotifiedAt: { exists: false } },
        { replyDueAt: { less_than: now.toISOString() } },
        {
          replyDueAt: { greater_than: new Date(now.getTime() - OVERDUE_LOOKBACK_MS).toISOString() },
        },
      ],
    },
  })
  if (!res.docs.length) return { notified: 0 }

  const leads = res.docs as unknown as OverdueLead[]
  // Сначала отметка, потом письмо: при сбое почты лучше одно пропущенное письмо, чем письмо
  // каждую минуту. Сбой виден в журнале таймера (journalctl -u obikhod-leads-overdue).
  await Promise.all(
    leads.map((l) =>
      payload.update({
        collection: 'leads',
        id: l.id,
        data: { overdueNotifiedAt: now.toISOString() } as never,
        overrideAccess: true,
      }),
    ),
  )
  await emailManagerAboutOverdue(leads, payload, now)
  return { notified: leads.length }
}

export async function purgeClosedLeadPhotos(payload: Payload, now = new Date()) {
  const company = await payload.findGlobal({ slug: 'company', depth: 0 }).catch(() => null)
  const raw = Number(
    (company as { leadPhotoRetentionDays?: unknown } | null)?.leadPhotoRetentionDays,
  )
  const days = Math.min(30, Math.max(1, raw > 0 ? raw : DEFAULT_COMPANY.leadPhotoRetentionDays))
  const cutoff = new Date(now.getTime() - days * 24 * 60 * MINUTE).toISOString()

  // От фото, а не от заявок: закрытые заявки без фото не копятся в выборке каждую ночь.
  const res = await payload.find({
    collection: 'lead-photos',
    depth: 0,
    limit: 500,
    overrideAccess: true,
    where: { 'lead.closedAt': { less_than: cutoff } },
  })
  const byLead = new Map<number, number[]>()
  for (const p of res.docs) {
    const leadId = typeof p.lead === 'object' && p.lead ? (p.lead as { id: number }).id : p.lead
    if (typeof leadId !== 'number') continue
    byLead.set(leadId, [...(byLead.get(leadId) ?? []), p.id as number])
  }

  let photos = 0
  for (const [leadId, ids] of byLead) {
    // удаление документа «Фото заявок» удаляет и файлы — оригинал и миниатюру
    const deleted = await payload.delete({
      collection: 'lead-photos',
      where: { id: { in: ids } },
      overrideAccess: true,
    })
    await payload.update({
      collection: 'leads',
      id: leadId,
      data: { photosDeletedAt: now.toISOString() } as never,
      overrideAccess: true,
    })
    photos += deleted.docs.length
  }
  return { days, leads: byLead.size, photos }
}
