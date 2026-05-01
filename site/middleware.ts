import { NextResponse, type NextRequest } from 'next/server'

/**
 * Edge middleware — gating /admin/* по второму фактору 2FA.
 *
 * Spec: PANEL-AUTH-2FA AC-4.
 *
 * Логика:
 * 1. Пропускаем allowlist путей (login, login/2fa, 2FA endpoints, статика).
 * 2. Если запрос на /admin/* с payload-token cookie И БЕЗ obihod_2fa_passed —
 *    редирект на /admin/login/2fa. Страница /admin/login/2fa сама решит:
 *      - totpEnabled=false → set passed cookie + redirect на /admin
 *      - totpEnabled=true  → отрисует форму OTP / recovery
 *
 * Edge runtime не имеет доступа к Payload session — поэтому проверка
 * выполняется только по факту наличия cookies. Payload session проверяется
 * на странице /admin/login/2fa (Node.js runtime).
 *
 * SECURITY: 2FA cookie HMAC-bound к userId через PAYLOAD_SECRET (см.
 * site/lib/auth/totp/secondFactorCookie.ts). Если злоумышленник украдёт
 * только её без payload-token JWT — бесполезна.
 */

const PASS_THROUGH = [
  '/admin/login',
  '/admin/forgot',
  '/admin/reset',
  '/admin/create-first-user',
  '/admin/unauthorized',
  // 2FA endpoints — без них login flow невозможен
  '/api/admin/auth/2fa-login',
  '/api/admin/auth/2fa-setup',
  '/api/admin/auth/2fa-verify',
  '/api/admin/auth/2fa-disable',
  '/api/admin/auth/2fa-regenerate-codes',
  // Native Payload auth endpoints должны работать сразу
  '/api/users/login',
  '/api/users/logout',
  '/api/users/forgot-password',
  '/api/users/reset-password',
  '/api/users/me',
  '/api/users/refresh-token',
]

function isPassThrough(pathname: string): boolean {
  for (const prefix of PASS_THROUGH) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return true
  }
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPassThrough(pathname)) {
    return NextResponse.next()
  }

  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
  if (!isAdminPath) {
    return NextResponse.next()
  }

  const payloadToken = request.cookies.get('payload-token')?.value
  if (!payloadToken) {
    // Не залогинен — Payload сам отредиректит на /admin/login.
    return NextResponse.next()
  }

  const passed = request.cookies.get('obihod_2fa_passed')?.value
  if (passed) {
    return NextResponse.next()
  }

  // Залогинен в Payload (есть payload-token), но 2FA не пройдена → /admin/login/2fa
  const url = request.nextUrl.clone()
  url.pathname = '/admin/login/2fa'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    /*
     * Matcher всех /admin/* и /api/admin/* кроме статики Next.js.
     * (?!_next/static|_next/image|favicon).*
     */
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
