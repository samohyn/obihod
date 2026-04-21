import { NextResponse } from 'next/server'
import { payloadClient } from '@/lib/payload'

/**
 * Liveness + readiness check для monitoring / uptime robot / deploy smoke.
 *
 * - Быстрый (no DB) GET → `{ status: 'ok', uptime }`
 * - GET ?deep=1 — пингует Payload (БД): `{ status: 'ok', db: 'ok' }`
 *
 * Возвращает 200 если всё живо, 503 при проблемах с БД (deep).
 * Без кэша: `export const dynamic = 'force-dynamic'`, revalidate=0.
 */
export const dynamic = 'force-dynamic'
export const revalidate = 0

const startedAt = Date.now()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const deep = searchParams.get('deep') === '1'

  const base = {
    status: 'ok' as const,
    uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
    ts: new Date().toISOString(),
  }

  if (!deep) return NextResponse.json(base)

  try {
    const payload = await payloadClient()
    // min-cost ping — count services (коллекция гарантированно существует после warmup)
    await payload.count({ collection: 'services' })
    return NextResponse.json({ ...base, db: 'ok' })
  } catch (err) {
    return NextResponse.json(
      {
        ...base,
        status: 'degraded',
        db: 'error',
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 503 },
    )
  }
}
