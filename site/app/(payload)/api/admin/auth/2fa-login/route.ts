import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { payloadClient } from '@/lib/payload'
import { decryptSecret, normalizeCode, verifyCode, verifyTotp } from '@/lib/auth/totp'
import { setSecondFactorPassed } from '@/lib/auth/totp/secondFactorCookie'

/**
 * POST /api/admin/auth/2fa-login
 *
 * Body: { otp?: string, recoveryCode?: string }
 *
 * Spec: PANEL-AUTH-2FA AC-4.
 *
 * Принимается ПОСЛЕ native /api/users/login. Юзер уже в session, но
 * middleware видит totpEnabled=true и редиректит на /admin/login/2fa
 * (см. middleware.ts). Этот endpoint снимает блок установкой
 * obihod_2fa_passed cookie.
 *
 * Принимает либо OTP (6 digits) либо recovery code. Recovery code — single-use
 * (проставляется consumed_at).
 *
 * SECURITY: rate-limit рекомендуется на уровне reverse-proxy / WAF; этот endpoint
 * сам не реализует rate-limit (см. risks §In-memory setup-session — Redis
 * follow-up). Recovery code consume — атомарно через payload.update.
 */
export async function POST(request: Request) {
  try {
    const payload = await payloadClient()
    const headersList = await nextHeaders()
    const auth = await payload.auth({ headers: headersList })

    if (!auth.user) {
      return NextResponse.json(
        {
          error: {
            code: 'unauthorized',
            message: 'Сначала войди по email и паролю.',
          },
        },
        { status: 401 },
      )
    }

    const user = auth.user as { id: string | number; totpEnabled?: boolean }

    if (!user.totpEnabled) {
      // У user нет 2FA — не должны вообще попадать сюда. Защита от прямого hit.
      return NextResponse.json(
        { error: { code: 'not_required', message: '2FA не требуется.' } },
        { status: 400 },
      )
    }

    const body = (await request.json().catch(() => null)) as {
      otp?: unknown
      recoveryCode?: unknown
    } | null

    const otp = body && typeof body.otp === 'string' ? body.otp.trim() : ''
    const recoveryCode = body && typeof body.recoveryCode === 'string' ? body.recoveryCode : ''

    if (!otp && !recoveryCode) {
      return NextResponse.json(
        {
          error: {
            code: 'bad_request',
            message: 'Введи код приложения или код восстановления.',
          },
        },
        { status: 400 },
      )
    }

    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      overrideAccess: true,
      depth: 0,
    })

    const enc = (fullUser as { totpSecretEnc?: string | null }).totpSecretEnc
    const codes = (
      fullUser as { recoveryCodes?: Array<{ id?: string; hash: string; consumedAt?: Date | null }> }
    ).recoveryCodes

    let valid = false
    let usedRecoveryIdx = -1

    if (otp && enc) {
      try {
        const secret = decryptSecret(enc)
        if (verifyTotp(otp, secret)) valid = true
      } catch {
        // decrypt fail — treat invalid
      }
    }

    if (!valid && recoveryCode && Array.isArray(codes)) {
      const normalized = normalizeCode(recoveryCode)
      for (let i = 0; i < codes.length; i++) {
        const c = codes[i]
        if (c.consumedAt) continue
        if (await verifyCode(normalized, c.hash)) {
          valid = true
          usedRecoveryIdx = i
          break
        }
      }
    }

    if (!valid) {
      return NextResponse.json(
        { error: { code: 'invalid_otp', message: 'Неверный код. Проверь и попробуй ещё раз.' } },
        { status: 401 },
      )
    }

    // Если использовали recovery — отмечаем consumed_at
    if (usedRecoveryIdx >= 0 && Array.isArray(codes)) {
      const updated = codes.map((c, i) =>
        i === usedRecoveryIdx ? { ...c, consumedAt: new Date().toISOString() } : c,
      )
      await payload.update({
        collection: 'users',
        id: user.id,
        data: { recoveryCodes: updated },
        overrideAccess: true,
      })
    }

    const remaining = Array.isArray(codes) ? codes.filter((c) => !c.consumedAt).length : 0
    // После consume — на 1 меньше если использовали recovery
    const finalRemaining = usedRecoveryIdx >= 0 ? Math.max(0, remaining - 1) : remaining

    const response = NextResponse.json(
      {
        data: {
          ok: true,
          usedRecoveryCode: usedRecoveryIdx >= 0,
          recoveryCodesRemaining: finalRemaining,
        },
      },
      { status: 200 },
    )
    setSecondFactorPassed(response, user.id)
    return response
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'internal_error',
          message: 'Не удалось проверить код. Попробуй ещё раз.',
        },
      },
      { status: 500 },
    )
  }
}
