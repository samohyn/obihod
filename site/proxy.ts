import { NextResponse, type NextRequest } from 'next/server'

/**
 * Proxy Обихода (Next.js 16+ переименовал `middleware` в `proxy`):
 * 1. http → https (на проде; локально игнорируем)
 * 2. www → non-www
 * 3. Trailing slash на всех маршрутах кроме /api/, /admin/, и файлов с расширениями
 * 4. PANEL-AUTH-2FA (sa-panel.md AC-4): /admin/* gated по второй ступени —
 *    если есть payload-token cookie И НЕТ obihod_2fa_passed cookie → redirect
 *    на /admin/login/2fa (страница сама решает: totpEnabled=false → set passed
 *    cookie + redirect /admin; иначе рендерит OTP/recovery форму).
 * 5. EPIC-SHOP-REMOVAL W5 — pre-emptive 410 Gone для `/shop` и `/shop/*`.
 *    Магазин саженцев выведен из проекта (ADR-0020). URL никогда не публиковались
 *    в sitemap, но Я.Вебмастер мог просканировать их по внешним сигналам.
 *    410 Gone signal-ит ботам «навсегда удалено», в отличие от 404 (transient).
 * 6. EPIC-SERVICE-PAGES-REDESIGN D5 — A/B pilot cookie split.
 *    На pilot-pillar `/vyvoz-musora/` (T2) присваиваем посетителю cookie
 *    `obikhod_ab_var=v1|v2` (50/50 random). Cookie persistent (1 year),
 *    SameSite=Lax, БЕЗ HttpOnly — нужен JS-доступ для Я.Метрика goal +
 *    RumProvider tag. Pilot scope ТОЛЬКО `/vyvoz-musora/` и его суб-URL —
 *    остальные pages не трогаем (default sustained rendering).
 *
 * Legacy redirects из коллекции `redirects` Payload — реализуем позже
 * (нужен in-memory snapshot, обновляемый по ISR).
 */

// ─── EPIC-SERVICE-PAGES-REDESIGN D5: A/B pilot cookie split ─────────────────
const AB_COOKIE = 'obikhod_ab_var'
const AB_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year
const PILOT_PATH = '/vyvoz-musora'

function isPilotPath(pathname: string): boolean {
  // Pilot scope: /vyvoz-musora/ + любые суб-маршруты (sub-services, districts).
  return (
    pathname === PILOT_PATH ||
    pathname === `${PILOT_PATH}/` ||
    pathname.startsWith(`${PILOT_PATH}/`)
  )
}

function isValidVariant(value: string | undefined): value is 'v1' | 'v2' {
  return value === 'v1' || value === 'v2'
}

const ADMIN_PASS_THROUGH = [
  '/admin/login',
  '/admin/forgot',
  '/admin/reset',
  '/admin/create-first-user',
  '/admin/unauthorized',
]

const ADMIN_API_PASS_THROUGH = [
  // 2FA endpoints
  '/api/admin/auth/2fa-login',
  '/api/admin/auth/2fa-setup',
  '/api/admin/auth/2fa-verify',
  '/api/admin/auth/2fa-disable',
  '/api/admin/auth/2fa-regenerate-codes',
  '/api/admin/auth/2fa-passthrough',
  // Native Payload auth endpoints
  '/api/users/login',
  '/api/users/logout',
  '/api/users/forgot-password',
  '/api/users/reset-password',
  '/api/users/me',
  '/api/users/refresh-token',
]

function isAdminPassThrough(pathname: string): boolean {
  for (const prefix of ADMIN_PASS_THROUGH) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return true
  }
  for (const prefix of ADMIN_API_PASS_THROUGH) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return true
  }
  return false
}

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone()
  const host = req.headers.get('host') ?? ''
  const proto = req.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '')

  // 1. http → https (только если за прокси)
  if (proto === 'http' && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')) {
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }

  // 2. www → non-www
  if (host.startsWith('www.')) {
    url.host = host.replace(/^www\./, '')
    return NextResponse.redirect(url, 301)
  }

  // 5. EPIC-SHOP-REMOVAL W5: 410 Gone для /shop и /shop/* (ADR-0020).
  // Pre-emptive для случая, если Я.Вебмастер просканировал URL извне.
  if (req.nextUrl.pathname === '/shop' || req.nextUrl.pathname.startsWith('/shop/')) {
    return new NextResponse(null, {
      status: 410,
      headers: { 'Cache-Control': 'public, max-age=86400' },
    })
  }

  // 4. PANEL-AUTH-2FA gate.
  const { pathname } = req.nextUrl
  const isAdminScope = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
  if (isAdminScope && !isAdminPassThrough(pathname)) {
    const payloadToken = req.cookies.get('payload-token')?.value
    if (payloadToken) {
      const passed = req.cookies.get('obihod_2fa_passed')?.value
      if (!passed) {
        const target = req.nextUrl.clone()
        target.pathname = '/admin/login/2fa'
        target.search = ''
        return NextResponse.redirect(target)
      }
    } else if (req.cookies.get('obihod_2fa_passed')?.value) {
      // Нет payload-token (logout/expire), но есть stale 2fa-passed → чистим.
      // Иначе следующий login пропустит вторую ступень с старой cookie.
      const response = NextResponse.next()
      response.cookies.set({
        name: 'obihod_2fa_passed',
        value: '',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
      })
      return response
    }
  }

  // 6. EPIC-SERVICE-PAGES-REDESIGN D5 — A/B pilot cookie split.
  // На pilot scope (`/vyvoz-musora/*`) — set obikhod_ab_var cookie если её нет.
  // Pass-through уже existing cookie (sticky per user). Скип всех других путей.
  if (isPilotPath(pathname)) {
    const existing = req.cookies.get(AB_COOKIE)?.value
    if (!isValidVariant(existing)) {
      const variant: 'v1' | 'v2' = Math.random() < 0.5 ? 'v1' : 'v2'
      const response = NextResponse.next({
        // Pass variant в request headers — сервер-сайд код может прочитать
        // через `headers()` без повторного парсинга cookies (если нужно).
        request: {
          headers: new Headers(req.headers),
        },
      })
      response.headers.set('x-ab-variant', variant)
      response.cookies.set({
        name: AB_COOKIE,
        value: variant,
        maxAge: AB_COOKIE_MAX_AGE,
        sameSite: 'lax',
        path: '/',
        // httpOnly: false — нужен JS-доступ для Я.Метрика reachGoal + RUM tag.
        secure: process.env.NODE_ENV === 'production',
      })
      return response
    }
    // Cookie уже set — pass-through с x-ab-variant header для server reads.
    const response = NextResponse.next({
      request: {
        headers: new Headers(req.headers),
      },
    })
    response.headers.set('x-ab-variant', existing)
    return response
  }

  // Trailing slash управляется Next.js через next.config.ts (`trailingSlash: true`)
  // — здесь не дублируем, чтобы не было редирект-цикла.

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'],
}
