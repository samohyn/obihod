import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { payloadClient } from '@/lib/payload'
import { setSecondFactorPassed } from '@/lib/auth/totp/secondFactorCookie'

/**
 * GET /api/admin/auth/2fa-passthrough
 *
 * Spec: PANEL-AUTH-2FA AC-4 + AC-6 backwards compat.
 *
 * Используется для пользователей БЕЗ 2FA (totpEnabled=false): после первого
 * логина proxy редиректит на /admin/login/2fa, страница вызывает этот
 * endpoint (Route Handler — единственное место где можно set cookie в Next.js
 * 16) который выставляет obihod_2fa_passed cookie и редиректит на /admin.
 *
 * Auth: требуется session (есть payload-token). Если нет — 401.
 * Если у user totpEnabled=true → 403 (ему нужен «нормальный» 2fa-login flow).
 */
export async function GET(request: Request) {
  const payload = await payloadClient()
  const headersList = await nextHeaders()
  const auth = await payload.auth({ headers: headersList })

  if (!auth.user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const user = auth.user as { id: string | number; totpEnabled?: boolean }

  if (user.totpEnabled) {
    return NextResponse.json(
      { error: { code: 'second_factor_required', message: 'Сначала введи код 2FA.' } },
      { status: 403 },
    )
  }

  const response = NextResponse.redirect(new URL('/admin', request.url))
  setSecondFactorPassed(response, user.id)
  return response
}
