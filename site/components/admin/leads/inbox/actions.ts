'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { isAdminUser } from '@/lib/auth/access'
import { payloadClient } from '@/lib/payload'
import { CONTACT_RESULT_OPTIONS, LEAD_STATUSES } from '@/lib/leads/status'

/**
 * Действия панели заявок (план 09, этап 5.2): статус, итог первого звонка, напоминание,
 * комментарий менеджера. Права проверяем сами (isAdminUser + вторая ступень 2FA по cookie) —
 * Local API без запроса не видит cookie, поэтому запись идёт с overrideAccess, но от имени
 * пользователя: история статусов и журнал изменений знают, кто менял.
 */

const patchSchema = z
  .object({
    status: z.enum(LEAD_STATUSES),
    contactResult: z.enum(CONTACT_RESULT_OPTIONS.map((o) => o.value) as [string, ...string[]]),
    nextActionAt: z.iso.datetime({ offset: true }).nullable(),
    managerComment: z.string().max(4000),
  })
  .partial()
  .strict()

export type LeadPatch = z.input<typeof patchSchema>
export type LeadActionResult = { ok: true } | { ok: false; error: string }

export async function updateLead(id: number, patch: LeadPatch): Promise<LeadActionResult> {
  const h = await headers()
  const payload = await payloadClient()
  const { user } = await payload.auth({ headers: h })
  if (!isAdminUser(user, h)) return { ok: false, error: 'Нет доступа — войдите заново' }

  const parsed = patchSchema.safeParse(patch)
  if (!Number.isInteger(id) || !parsed.success) return { ok: false, error: 'Неверные данные' }

  try {
    await payload.update({
      collection: 'leads',
      id,
      data: parsed.data as never,
      overrideAccess: true,
      user,
    })
    return { ok: true }
  } catch (err) {
    console.error('[leads-inbox] update failed:', err instanceof Error ? err.message : err)
    return { ok: false, error: 'Не сохранилось — попробуйте ещё раз' }
  }
}
