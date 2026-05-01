import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'

import { payloadClient } from '@/lib/payload'
import { LEAD_STATUSES, type LeadStatus } from '@/lib/leads/status'

/**
 * GET /api/admin/leads/count?status=new[&status=contacted...]
 *
 * Counter заявок для:
 *   - Sidebar Leads badge (W3 · PAN-6 part 3) — single status mode (back-compat).
 *   - LeadsQuickFilters chips (PANEL-LEADS-INBOX § B.2) — multi-status mode.
 *
 * Single-status response: { data: { count: number } }
 * Multi-status response:  { data: { counts: { <status>: number, ... }, total: number } }
 *
 * Активный inbox (archived_at IS NULL) — counters считаются ТОЛЬКО для не-архивных
 * заявок, чтобы цифра в badge/chip соответствовала тому что оператор увидит в list.
 *
 * 401 без auth, 403 для не admin/manager.
 * Caching: Cache-Control private max-age=15 (быстрая инвалидция при PATCH).
 */

const VALID_STATUSES = new Set<string>(LEAD_STATUSES)

export async function GET(request: Request) {
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

  const url = new URL(request.url)
  const statusParams = url.searchParams.getAll('status').filter((s) => VALID_STATUSES.has(s))

  // Активный inbox: archivedAt IS NULL (skip soft-deleted leads).
  const baseWhere = { archivedAt: { exists: false } } as const

  // Single-status mode (back-compat для sidebar badge).
  if (statusParams.length <= 1) {
    const status = statusParams[0] ?? 'new'
    if (!VALID_STATUSES.has(status)) {
      return NextResponse.json(
        { error: { code: 'bad_request', message: 'Unknown status' } },
        { status: 400 },
      )
    }
    const result = await payload.count({
      collection: 'leads',
      where: { and: [baseWhere, { status: { equals: status } }] },
    })
    return NextResponse.json(
      { data: { count: result.totalDocs } },
      {
        status: 200,
        headers: { 'Cache-Control': 'private, max-age=15, stale-while-revalidate=30' },
      },
    )
  }

  // Multi-status mode (PANEL-LEADS-INBOX § B.2).
  // Параллельные count() — на 7 статусов это <50ms total в БД.
  const counts: Partial<Record<LeadStatus, number>> = {}
  await Promise.all(
    statusParams.map(async (s) => {
      const r = await payload.count({
        collection: 'leads',
        where: { and: [baseWhere, { status: { equals: s } }] },
      })
      counts[s as LeadStatus] = r.totalDocs
    }),
  )
  const total = await payload.count({ collection: 'leads', where: baseWhere })

  return NextResponse.json(
    { data: { counts, total: total.totalDocs } },
    {
      status: 200,
      headers: { 'Cache-Control': 'private, max-age=15, stale-while-revalidate=30' },
    },
  )
}
