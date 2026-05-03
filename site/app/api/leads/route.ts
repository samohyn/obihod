/**
 * site/app/api/leads/route.ts
 *
 * US-8 hot-fix (PAN-9 sustained): public POST adapter для LeadForm.
 *
 * Принимает flat payload от клиентской формы (slug-based service/district),
 * резолвит slug → ID через Payload Local API и создаёт запись в коллекции
 * `leads`. Telegram-уведомление оператору отрабатывает в afterChange hook
 * Leads.ts (fire-and-forget pattern, sustained 2026-05-01 incident).
 *
 * Защита от спама:
 *   1) Honeypot field (`email_url`) — invisible-input для ботов; если заполнен —
 *      silent 200 (без сохранения, без 4xx — чтобы боты не калибровали детектор).
 *   2) Rate limit 5 req/min per IP (in-memory map; sufficient для MVP до US-13).
 *
 * Контракт:
 *   POST /api/leads
 *   body: {
 *     phone:    string (required),
 *     name?:    string,
 *     service?: string (slug),
 *     district?: string|null (slug),
 *     source?:  string,
 *     sourcePage?: string,
 *     utmSource?: string, utmMedium?: string, utmCampaign?: string,
 *     email_url?: string  // honeypot
 *   }
 *   200: { ok: true } — honeypot triggered (silent reject)
 *   201: { ok: true, id: string|number } — lead создан
 *   400: { error: 'validation_error', details: [...] } — phone отсутствует
 *   429: { error: 'rate_limit_exceeded' }
 *   500: { error: 'server_error' }
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { payloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ─── Rate limit (in-memory, IP-based) ─────────────────────────────────────────
// 5 req / 60s per IP. MVP-достаточно: prod лиды ~20-50/день, спам — единичные.
// Memory-only: при рестарте окна ресетятся. Для US-13 (amoCRM) — заменить на Redis.
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60_000
const rateLimitMap = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const recent = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, recent)
    return false
  }
  recent.push(now)
  rateLimitMap.set(ip, recent)
  return true
}

function getIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

// ─── Slug resolver ────────────────────────────────────────────────────────────
async function resolveSlug(
  payload: Awaited<ReturnType<typeof payloadClient>>,
  collection: 'services' | 'districts',
  slug: string | null | undefined,
): Promise<string | number | null> {
  if (!slug || typeof slug !== 'string') return null
  const trimmed = slug.trim()
  if (!trimmed) return null
  try {
    const res = await payload.find({
      collection,
      where: { slug: { equals: trimmed } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const first = res.docs?.[0] as { id?: string | number } | undefined
    return first?.id ?? null
  } catch {
    return null
  }
}

// ─── Payload schema ───────────────────────────────────────────────────────────
interface LeadPayload {
  phone?: unknown
  name?: unknown
  email?: unknown
  service?: unknown
  district?: unknown
  source?: unknown
  sourcePage?: unknown
  utmSource?: unknown
  utmMedium?: unknown
  utmCampaign?: unknown
  email_url?: unknown // honeypot
}

function asStringOrUndef(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined
  const t = v.trim()
  return t || undefined
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Parse JSON
  let body: LeadPayload
  try {
    body = (await req.json()) as LeadPayload
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  // 2. Honeypot — silent 200 (бот не должен видеть 4xx)
  if (typeof body.email_url === 'string' && body.email_url.trim() !== '') {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  // 3. Rate limit
  const ip = getIp(req)
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'rate_limit_exceeded' }, { status: 429 })
  }

  // 4. Validate phone (минимум — без него не перезвоним)
  const phone = asStringOrUndef(body.phone)
  if (!phone) {
    return NextResponse.json(
      {
        error: 'validation_error',
        details: [{ field: 'phone', message: 'Телефон обязателен' }],
      },
      { status: 400 },
    )
  }

  // 5. Resolve service/district slugs → IDs (best-effort, null OK)
  let serviceId: string | number | null = null
  let districtId: string | number | null = null
  try {
    const payload = await payloadClient()
    serviceId = await resolveSlug(payload, 'services', asStringOrUndef(body.service))
    districtId = await resolveSlug(payload, 'districts', asStringOrUndef(body.district))

    // 6. Create lead через Local API (overrideAccess не нужен — access.create:()=>true)
    const data: Record<string, unknown> = {
      phone,
      status: 'new',
    }
    const name = asStringOrUndef(body.name)
    if (name) data.name = name
    const email = asStringOrUndef(body.email)
    if (email) data.email = email
    if (serviceId) data.service = serviceId
    if (districtId) data.district = districtId
    const sourcePage = asStringOrUndef(body.sourcePage) ?? asStringOrUndef(body.source)
    if (sourcePage) data.sourcePage = sourcePage
    const utmSource = asStringOrUndef(body.utmSource)
    if (utmSource) data.utmSource = utmSource
    const utmMedium = asStringOrUndef(body.utmMedium)
    if (utmMedium) data.utmMedium = utmMedium
    const utmCampaign = asStringOrUndef(body.utmCampaign)
    if (utmCampaign) data.utmCampaign = utmCampaign

    const created = await payload.create({
      collection: 'leads',
      data: data as never,
    })

    return NextResponse.json(
      { ok: true, id: (created as { id: string | number }).id },
      { status: 201 },
    )
  } catch (err) {
    // Не утекаем internal details — log на сервер, generic ответ клиенту.
    console.error('[api/leads] create failed:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
