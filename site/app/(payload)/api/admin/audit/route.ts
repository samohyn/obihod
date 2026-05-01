import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'

import { payloadClient } from '@/lib/payload'
import { getAuditLogAdapter } from '@/lib/admin/audit'
import type { AuditAction } from '@/lib/admin/audit'

/**
 * GET /api/admin/audit?collections=&user=&actions=&from=&to=&q=&cursor=&limit=
 *
 * PANEL-AUDIT-LOG (ADR-0014) — unified timeline endpoint.
 * Aggregates Payload <collection>_v versions + audit_log table via UNION ALL.
 *
 * Auth: admin only (PII-сensitive). 401 без auth, 403 для неадмина.
 *
 * Response 200:
 *   { data: { entries: AuditEntry[], nextCursor: string|null }, took_ms }
 */

const ALLOWED_ACTIONS = new Set<AuditAction>([
  'create',
  'update',
  'delete',
  'publish',
  'unpublish',
  'archive',
  'login',
  'logout',
  'login_failed',
  'bulk_action',
  'rbac_change',
])

export async function GET(request: Request) {
  const startTs = performance.now()
  const payload = await payloadClient()

  // ── 1. Auth guard — admin-only (PII access).
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

  // ── 2. Filter parsing.
  const url = new URL(request.url)
  const params = url.searchParams

  const collectionsRaw = params.get('collections')
  const collections = collectionsRaw ? collectionsRaw.split(',').filter(Boolean) : undefined

  const actionsRaw = params.get('actions')
  const actions = actionsRaw
    ? (actionsRaw
        .split(',')
        .filter((a): a is AuditAction => ALLOWED_ACTIONS.has(a as AuditAction)) as AuditAction[])
    : undefined

  const userIdRaw = params.get('user')
  const userId = userIdRaw ? Number(userIdRaw) : undefined

  const from = params.get('from') ?? undefined
  const to = params.get('to') ?? undefined
  const q = params.get('q') ?? undefined
  const cursor = params.get('cursor') ?? undefined
  const limitRaw = params.get('limit')
  const limit = limitRaw ? Math.min(Math.max(Number(limitRaw), 1), 200) : 50

  const scopedCollection = params.get('scope_collection')
  const scopedDocId = params.get('scope_doc_id')
  const scopedTo =
    scopedCollection && scopedDocId
      ? { collection: scopedCollection, docId: scopedDocId }
      : undefined

  try {
    const adapter = getAuditLogAdapter()
    const result = await adapter.list({
      collections,
      actions,
      userId: userId !== undefined && Number.isFinite(userId) ? userId : undefined,
      from,
      to,
      q,
      cursor,
      limit,
      scopedTo,
    })
    const took_ms = Math.round(performance.now() - startTs)
    return NextResponse.json(
      { data: result, took_ms },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, no-store',
          'Server-Timing': `audit;dur=${took_ms}`,
        },
      },
    )
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[admin/audit] list failed', err)
    return NextResponse.json(
      { error: { code: 'service_unavailable', message: 'История временно недоступна.' } },
      { status: 503 },
    )
  }
}
