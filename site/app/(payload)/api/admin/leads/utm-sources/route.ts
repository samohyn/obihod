import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'

import { payloadClient } from '@/lib/payload'

/**
 * GET /api/admin/leads/utm-sources
 *
 * Возвращает DISTINCT utmSource значений для source-фильтра в LeadsQuickFilters
 * (PANEL-LEADS-INBOX § B.4). Сейчас не используется UI (filter chip set
 * ограничен статусами в Phase 3) — endpoint готов для будущей итерации.
 *
 * Response 200: { data: { sources: [{ value: 'yandex', count: 12 }, ...] } }
 * Cache: private, max-age=300 (источники не меняются часто).
 *
 * Реализация: используем raw SQL через payload.db.drizzle adapter (быстрее чем
 * find-all + group-by в JS). Top 20 by frequency.
 */

export async function GET() {
  const payload = await payloadClient()
  const headersList = await nextHeaders()
  const auth = await payload.auth({ headers: headersList })
  if (!auth.user) {
    return NextResponse.json(
      { error: { code: 'unauthorized', message: 'Требуется вход в админку.' } },
      { status: 401 },
    )
  }
  const role = (auth.user as { role?: string }).role
  if (!role || !['admin', 'manager'].includes(role)) {
    return NextResponse.json(
      { error: { code: 'forbidden', message: 'Нет прав на чтение заявок.' } },
      { status: 403 },
    )
  }

  // payload.find c pagination=false на small dataset (50-150 rows) — простейший
  // путь. На росте >1000 — мигрировать на raw SQL DISTINCT через db.execute.
  const result = await payload.find({
    collection: 'leads',
    where: { utmSource: { exists: true } },
    limit: 1000,
    depth: 0,
    pagination: false,
  })

  const tally = new Map<string, number>()
  for (const doc of result.docs) {
    const v = (doc as { utmSource?: string | null }).utmSource
    if (typeof v === 'string' && v.length > 0) {
      tally.set(v, (tally.get(v) ?? 0) + 1)
    }
  }

  const sources = Array.from(tally.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([value, count]) => ({ value, count }))

  return NextResponse.json(
    { data: { sources } },
    {
      status: 200,
      headers: { 'Cache-Control': 'private, max-age=300, stale-while-revalidate=600' },
    },
  )
}
