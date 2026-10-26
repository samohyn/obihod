import { NextResponse } from 'next/server'

import { isCronRequest } from '@/lib/internal/cronSecret'
import { purgeClosedLeadPhotos } from '@/lib/leads/jobs'
import { payloadClient } from '@/lib/payload'

/**
 * POST — удаление фото закрытых заявок по сроку из «Компания и контакты» (план 09, этап 5.4;
 * 152-ФЗ, ст. 21). Дёргает таймер obikhod-leads-purge раз в сутки после бэкапа (deploy/leads/).
 */
export async function POST(req: Request) {
  if (!isCronRequest(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const result = await purgeClosedLeadPhotos(await payloadClient())
  console.log('[lead-photos-purge]', JSON.stringify(result))
  return NextResponse.json(result)
}
