import { NextResponse } from 'next/server'

import { isCronRequest } from '@/lib/internal/cronSecret'
import { notifyOverdueLeads } from '@/lib/leads/jobs'
import { payloadClient } from '@/lib/payload'

/**
 * POST — письмо «Просрочена заявка» (план 09, этап 5.4). Дёргает таймер
 * obikhod-leads-overdue раз в минуту (deploy/leads/).
 */
export async function POST(req: Request) {
  if (!isCronRequest(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const result = await notifyOverdueLeads(await payloadClient())
  return NextResponse.json(result)
}
