import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { payloadClient } from '@/lib/payload'

/**
 * GET /api/admin/leads/count?status=new
 *
 * Counter новых заявок для sidebar badge (Wave 3 · PAN-6 part 3).
 * Spec: specs/US-12-admin-redesign/sa-panel-wave3.md §3.6.
 *
 * Response 200: { data: { count: number } }
 * 401 без auth, 403 для не admin/manager.
 *
 * Caching: Cache-Control max-age=30 (badge polling frequency).
 */

const ALLOWED_STATUSES = ['new', 'in_amocrm', 'estimated', 'converted', 'lost'] as const

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
  const statusParam = url.searchParams.get('status') ?? 'new'
  if (!ALLOWED_STATUSES.includes(statusParam as (typeof ALLOWED_STATUSES)[number])) {
    return NextResponse.json(
      { error: { code: 'bad_request', message: 'Unknown status' } },
      { status: 400 },
    )
  }

  const result = await payload.count({
    collection: 'leads',
    where: { status: { equals: statusParam } },
  })

  return NextResponse.json(
    { data: { count: result.totalDocs } },
    {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
      },
    },
  )
}
