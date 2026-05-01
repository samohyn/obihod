import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { payloadClient } from '@/lib/payload'
import { decryptSecret, normalizeCode, verifyCode, verifyTotp } from '@/lib/auth/totp'

/**
 * POST /api/admin/auth/2fa-disable
 *
 * Body: { password: string, otpOrRecovery: string }
 *
 * Spec: PANEL-AUTH-2FA AC-5.
 *
 * Требует И password (re-auth) И one current OTP / recovery code. На success:
 *   - totpEnabled=false
 *   - totpSecretEnc=null
 *   - recoveryCodes=[]
 *
 * SECURITY: password проверяется через payload.login (тот же flow что
 * /api/users/login). Если password OK но OTP/recovery невалиден — 400, чтобы
 * не дать оракулу «password правильный, нужен только код».
 */
export async function POST(request: Request) {
  try {
    const payload = await payloadClient()
    const headersList = await nextHeaders()
    const auth = await payload.auth({ headers: headersList })

    if (!auth.user) {
      return NextResponse.json(
        { error: { code: 'unauthorized', message: 'Требуется вход в админку.' } },
        { status: 401 },
      )
    }

    const user = auth.user as { id: string | number; email: string; totpEnabled?: boolean }

    if (!user.totpEnabled) {
      return NextResponse.json(
        { error: { code: 'not_enabled', message: '2FA уже отключена.' } },
        { status: 409 },
      )
    }

    const body = (await request.json().catch(() => null)) as {
      password?: unknown
      otpOrRecovery?: unknown
    } | null

    const password = body && typeof body.password === 'string' ? body.password : ''
    const otpOrRecovery = body && typeof body.otpOrRecovery === 'string' ? body.otpOrRecovery : ''

    if (!password || !otpOrRecovery) {
      return NextResponse.json(
        {
          error: {
            code: 'bad_request',
            message: 'Введи пароль и код приложения или код восстановления.',
          },
        },
        { status: 400 },
      )
    }

    // Re-verify пароль через native Payload login.
    try {
      await payload.login({
        collection: 'users',
        data: { email: user.email, password },
      })
    } catch {
      return NextResponse.json(
        { error: { code: 'wrong_password', message: 'Неверный пароль.' } },
        { status: 400 },
      )
    }

    // Загружаем full user record чтобы прочесть totpSecretEnc и recoveryCodes
    // (overrideAccess игнорирует field-level access read=false).
    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      overrideAccess: true,
      depth: 0,
    })

    const enc = (fullUser as { totpSecretEnc?: string | null }).totpSecretEnc
    const codes = (
      fullUser as { recoveryCodes?: Array<{ hash: string; consumedAt?: Date | null }> }
    ).recoveryCodes
    let valid = false
    let consumedRecoveryIndex = -1

    if (enc) {
      try {
        const secret = decryptSecret(enc)
        if (verifyTotp(otpOrRecovery, secret)) {
          valid = true
        }
      } catch {
        // decrypt fail — treat as invalid (key rotated?)
      }
    }

    if (!valid && Array.isArray(codes)) {
      const normalized = normalizeCode(otpOrRecovery)
      for (let i = 0; i < codes.length; i++) {
        const c = codes[i]
        if (c.consumedAt) continue
        if (await verifyCode(normalized, c.hash)) {
          valid = true
          consumedRecoveryIndex = i
          break
        }
      }
    }

    if (!valid) {
      return NextResponse.json(
        { error: { code: 'invalid_otp', message: 'Неверный код или код восстановления.' } },
        { status: 400 },
      )
    }

    // Полностью сбрасываем 2FA. consumedRecoveryIndex не нужен — мы стираем массив.
    void consumedRecoveryIndex
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        totpEnabled: false,
        totpSecretEnc: null,
        recoveryCodes: [],
      },
      overrideAccess: true,
    })

    return NextResponse.json({ data: { ok: true } }, { status: 200 })
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'internal_error',
          message: 'Не удалось отключить 2FA. Попробуй ещё раз.',
        },
      },
      { status: 500 },
    )
  }
}
