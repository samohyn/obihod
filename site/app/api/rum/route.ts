/**
 * site/app/api/rum/route.ts
 *
 * RUM (Real User Monitoring) ingest endpoint — OVT-3 / EPIC-LIWOOD-OVERTAKE.
 *
 * Принимает Core Web Vitals beacon от клиента (`navigator.sendBeacon` →
 * `RumProvider` через `useReportWebVitals`) и сохраняет сэмпл в коллекции
 * `rum-metrics` через Payload Local API.
 *
 * Цель — confirm/downgrade B2 verdict «CWV likely-LEAD pending PSI» через
 * мониторинг mobile p75 LCP / CLS / INP с реальных устройств.
 *
 * Контракт:
 *   POST /api/rum
 *   Content-Type: application/json (beacon шлёт `text/plain` blob — fallback
 *     на `req.text()` парсинг).
 *   body: {
 *     name: 'LCP'|'CLS'|'INP'|'FID'|'TTFB'|'FCP',
 *     value: number,                    // ms; CLS ×1000 для unit-консистентности
 *     rating: 'good'|'needs-improvement'|'poor',
 *     pageUrl: string,                  // pathname без query
 *     userAgent?: string,               // truncated к 256 символам
 *     viewportWidth?: number,
 *     navigationType?: string,
 *   }
 *   204: silent success (beacon не читает body)
 *   400: { error: 'validation_error' }
 *   429: { error: 'rate_limit_exceeded' }
 *   500: { error: 'server_error' }
 *
 * PII safety: НЕ сохраняем IP, cookies, query-string, headers.
 * Rate limit — 10 req/sec per IP (in-memory, sufficient до production scale).
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { payloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ─── Rate limit (10 req/sec per IP, in-memory) ───────────────────────────────
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 1_000
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

// ─── Validation (native, без Zod — sustained constraint) ─────────────────────
const VALID_NAMES = new Set(['LCP', 'CLS', 'INP', 'FID', 'TTFB', 'FCP'])
const VALID_RATINGS = new Set(['good', 'needs-improvement', 'poor'])
const VALID_NAV_TYPES = new Set([
  'navigate',
  'reload',
  'back-forward',
  'back-forward-cache',
  'prerender',
])
// EPIC-SERVICE-PAGES-REDESIGN D5 — A/B pilot variant tag.
const VALID_AB_VARIANTS = new Set(['v1', 'v2'])

interface ValidatedSample {
  name: 'LCP' | 'CLS' | 'INP' | 'FID' | 'TTFB' | 'FCP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  pageUrl: string
  userAgent?: string
  viewportWidth?: number
  navigationType?: 'navigate' | 'reload' | 'back-forward' | 'back-forward-cache' | 'prerender'
  abVariant?: 'v1' | 'v2'
}

function validate(raw: unknown): ValidatedSample | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>

  if (typeof o.name !== 'string' || !VALID_NAMES.has(o.name)) return null
  if (typeof o.value !== 'number' || !Number.isFinite(o.value) || o.value < 0) return null
  if (typeof o.rating !== 'string' || !VALID_RATINGS.has(o.rating)) return null
  if (typeof o.pageUrl !== 'string' || o.pageUrl.length === 0 || o.pageUrl.length > 512) {
    return null
  }

  const out: ValidatedSample = {
    name: o.name as ValidatedSample['name'],
    value: o.value,
    rating: o.rating as ValidatedSample['rating'],
    pageUrl: o.pageUrl.split('?')[0].slice(0, 512),
  }

  if (typeof o.userAgent === 'string' && o.userAgent.length > 0) {
    out.userAgent = o.userAgent.slice(0, 256)
  }
  if (typeof o.viewportWidth === 'number' && Number.isFinite(o.viewportWidth)) {
    out.viewportWidth = Math.max(0, Math.floor(o.viewportWidth))
  }
  if (typeof o.navigationType === 'string' && VALID_NAV_TYPES.has(o.navigationType)) {
    out.navigationType = o.navigationType as ValidatedSample['navigationType']
  }
  if (typeof o.abVariant === 'string' && VALID_AB_VARIANTS.has(o.abVariant)) {
    out.abVariant = o.abVariant as ValidatedSample['abVariant']
  }

  return out
}

// ─── POST handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Rate limit (быстро, до парсинга body)
  const ip = getIp(req)
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'rate_limit_exceeded' }, { status: 429 })
  }

  // 2. Parse JSON. `navigator.sendBeacon` шлёт Blob с MIME application/json
  // (если правильно установить тип) или text/plain — пробуем оба.
  let raw: unknown
  try {
    const text = await req.text()
    if (!text) return NextResponse.json({ error: 'empty_body' }, { status: 400 })
    raw = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  // 3. Validate
  const sample = validate(raw)
  if (!sample) {
    return NextResponse.json({ error: 'validation_error' }, { status: 400 })
  }

  // 4. Persist через Payload Local API (overrideAccess не нужен — create:()=>true)
  try {
    const payload = await payloadClient()
    await payload.create({
      collection: 'rum-metrics',
      data: sample as never,
    })
    // Beacon не читает body — 204 No Content корректно и экономит трафик.
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    // Не утекаем internal details — log на сервер, generic ответ клиенту.
    console.error('[api/rum] create failed:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
