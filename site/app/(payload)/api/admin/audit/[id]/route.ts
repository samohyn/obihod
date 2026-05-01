import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'

import { payloadClient } from '@/lib/payload'
import { getAuditLogAdapter } from '@/lib/admin/audit'

/**
 * GET /api/admin/audit/[id]
 *
 * Возвращает single audit entry + diff (before/after с PII masking).
 * id формат: UUID для audit_log entry, или `<collection>:<version_id>` для
 * Payload version snapshot.
 *
 * Auth: admin only.
 */

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
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
  if (role !== 'admin') {
    return NextResponse.json(
      { error: { code: 'forbidden', message: 'История доступна только admin-роли.' } },
      { status: 403 },
    )
  }

  try {
    const adapter = getAuditLogAdapter()
    const [entry, diff] = await Promise.all([adapter.get(id), adapter.diff(id)])
    if (!entry) {
      return NextResponse.json(
        { error: { code: 'not_found', message: 'Запись не найдена.' } },
        { status: 404 },
      )
    }
    return NextResponse.json(
      { data: { entry, diff } },
      { status: 200, headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[admin/audit/[id]] failed', err)
    return NextResponse.json(
      { error: { code: 'service_unavailable', message: 'История временно недоступна.' } },
      { status: 503 },
    )
  }
}
