'use client'

/**
 * RumProvider — Real User Monitoring client emitter (OVT-3 / EPIC-LIWOOD-OVERTAKE).
 *
 * Использует Next 16 builtin hook `useReportWebVitals` (sustained, без новой
 * dependency на `web-vitals` package — скрипт уже подгружается Next runtime).
 *
 * Каждый раз когда браузер измерил CWV метрику (LCP / CLS / INP / FID / TTFB /
 * FCP) — формируем PII-safe payload и отправляем через `navigator.sendBeacon`
 * на `/api/rum`. Beacon переживает unload (важно для CLS / INP, которые
 * финализируются при уходе со страницы).
 *
 * PII safety:
 *   - НЕ шлём query-string (может содержать utm_term, email, phone в leak-ах);
 *   - UA truncated к 256 символам;
 *   - НЕ шлём cookies, localStorage, sessionId.
 *
 * Размещение — в `app/(marketing)/layout.tsx` рядом с `<YandexMetrika />`.
 */
import { useReportWebVitals } from 'next/web-vitals'

const ENDPOINT = '/api/rum'

// Клиентская валидация имён метрик — Next может в будущих версиях добавить
// новые типы, нам нужны только sustained 6 W3C-spec метрик.
const KNOWN_NAMES = new Set(['LCP', 'CLS', 'INP', 'FID', 'TTFB', 'FCP'])

interface BeaconPayload {
  name: string
  value: number
  rating: string
  pageUrl: string
  userAgent: string
  viewportWidth: number
  navigationType?: string
}

function send(payload: BeaconPayload): void {
  if (typeof navigator === 'undefined') return

  const body = JSON.stringify(payload)

  // Prefer sendBeacon — survives unload, не блокирует navigation.
  // Blob с явным MIME для server-side req.text() парсинга.
  if (typeof navigator.sendBeacon === 'function') {
    try {
      const blob = new Blob([body], { type: 'application/json' })
      const ok = navigator.sendBeacon(ENDPOINT, blob)
      if (ok) return
    } catch {
      // fallthrough to fetch
    }
  }

  // Fallback: fetch keepalive (Safari < 15 без sendBeacon тоже редко).
  try {
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
  } catch {
    // silent — RUM не должен ломать UX
  }
}

export function RumProvider() {
  useReportWebVitals((metric) => {
    if (!KNOWN_NAMES.has(metric.name)) return

    // CLS — unitless float (0..1+); умножаем на 1000 чтобы хранить как ms-like
    // целое число в одном поле value (упрощает aggregation queries).
    const value = metric.name === 'CLS' ? metric.value * 1000 : metric.value

    // pageUrl без query-string (PII / cardinality control).
    const pageUrl = typeof window !== 'undefined' ? window.location.pathname : '/'

    const payload: BeaconPayload = {
      name: metric.name,
      value: Math.round(value * 100) / 100,
      rating: metric.rating,
      pageUrl,
      userAgent: typeof navigator !== 'undefined' ? (navigator.userAgent ?? '').slice(0, 256) : '',
      viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    }

    if (typeof metric.navigationType === 'string') {
      payload.navigationType = metric.navigationType
    }

    send(payload)
  })

  return null
}
