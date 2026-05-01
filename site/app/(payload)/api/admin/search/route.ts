import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'

import { payloadClient } from '@/lib/payload'
import {
  buildUnionQuery,
  groupRows,
  type SearchRowRaw,
} from '@/lib/admin/global-search/buildUnionQuery'
import { SEARCH_COLLECTIONS } from '@/lib/admin/global-search/config'

/**
 * GET /api/admin/search?q=<str>
 *
 * Top-bar global search по 7 коллекциям + Districts (PANEL-GLOBAL-SEARCH).
 *
 * Strategy: Single SQL UNION ALL через pg_trgm + post-filter access control
 * через payload.find({ overrideAccess: false }) per hit.
 *
 * См. ADR-0013 §Решение для обоснования.
 *
 * Auth: admin/manager only. 401 без auth, 403 для других ролей.
 * Min query: 2 chars. Empty result для query.length < 2.
 *
 * Response 200:
 *   {
 *     data: {
 *       groups: [{ collection, label, hits: [{ id, title, subtitle, url, rank }] }],
 *       total,
 *       took_ms
 *     }
 *   }
 *
 * Performance budget (ADR §AC4): p95 ≤ 500ms на dev (10k Leads), UX target
 * ≤ 300ms на проде. Statement timeout 500ms — guard от worst-case.
 */

const MAX_QUERY_LENGTH = 100

export async function GET(request: Request) {
  const startTs = performance.now()
  const payload = await payloadClient()

  // ── 1. Auth guard
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
      { error: { code: 'forbidden', message: 'Нет прав на поиск.' } },
      { status: 403 },
    )
  }

  // ── 2. Query validation
  const url = new URL(request.url)
  const rawQ = url.searchParams.get('q') ?? ''
  const q = rawQ.trim().slice(0, MAX_QUERY_LENGTH)

  if (q.length < 2) {
    return NextResponse.json(
      { data: { groups: [], total: 0, took_ms: 0 } },
      { status: 200, headers: { 'Cache-Control': 'private, no-store' } },
    )
  }

  // ── 3. Execute SQL UNION ALL through pool with statement_timeout guard
  // Structural typing — pg типы не установлены отдельно, payload.db.pool
  // — это node-postgres Pool, см. @payloadcms/db-postgres types (line 81).
  interface PgClient {
    query: <T>(text: string, params?: unknown[]) => Promise<{ rows: T[] }>
    release: () => void
  }
  interface PgPool {
    connect: () => Promise<PgClient>
  }
  const pool = (payload.db as unknown as { pool: PgPool }).pool
  let rawRows: SearchRowRaw[]

  const client = await pool.connect()
  try {
    // Per-session statement_timeout — гарантия что worst-case query не зависнет
    // (ADR §Mitigation). Reset = 0 (default) перед release client back в pool.
    await client.query(`SET LOCAL statement_timeout = '500ms'`)
    // pg_trgm similarity_threshold по умолчанию 0.3; уменьшаем до 0.2 для
    // лучшего recall на коротких queries («ив» → «Иванов»).
    await client.query(`SELECT set_limit(0.2)`)

    const sqlText = buildUnionQuery()
    const result = await client.query<SearchRowRaw>(sqlText, [q])
    rawRows = result.rows
  } catch (err) {
    // Sentry capture: будущий @sentry/nextjs init подхватит автоматически
    // через unhandled error path; сейчас просто log + 503.
    // eslint-disable-next-line no-console
    console.error('[admin/search] query failed', err)
    return NextResponse.json(
      { error: { code: 'service_unavailable', message: 'Поиск временно недоступен.' } },
      { status: 503 },
    )
  } finally {
    client.release()
  }

  // ── 4. Post-filter access control (RBAC обязательно — ADR §Решение #5)
  // Для каждого hit вызываем payload.find({ overrideAccess: false }) с user из
  // request — Payload вернёт null если access не позволяет. Параллельно через
  // Promise.all чтобы не сериализовать round-trips.
  const validatedRows = await Promise.all(
    rawRows.map(async (row) => {
      const collectionSlug = SEARCH_COLLECTIONS.find(
        (c) => c.collectionSlug === row.collection_slug,
      )?.collectionSlug
      if (!collectionSlug) return null
      try {
        const found = await payload.find({
          collection: collectionSlug,
          where: { id: { equals: row.id } },
          overrideAccess: false,
          user: auth.user,
          depth: 0,
          limit: 1,
          pagination: false,
        })
        return found.docs.length > 0 ? row : null
      } catch {
        // Access denied / coll not accessible — skip silently.
        return null
      }
    }),
  )

  const accessibleRows = validatedRows.filter((r): r is SearchRowRaw => r !== null)
  const groups = groupRows(accessibleRows)
  const total = accessibleRows.length
  const took_ms = Math.round(performance.now() - startTs)

  return NextResponse.json(
    { data: { groups, total, took_ms } },
    {
      status: 200,
      headers: {
        'Cache-Control': 'private, no-store',
        'Server-Timing': `search;dur=${took_ms}`,
      },
    },
  )
}
