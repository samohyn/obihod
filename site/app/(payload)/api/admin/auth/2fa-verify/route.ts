import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { payloadClient } from '@/lib/payload'
import {
  encryptSecret,
  generateRecoveryCodes,
  getSetupSession,
  hashCodes,
  verifyTotp,
} from '@/lib/auth/totp'
import { setSecondFactorPassed } from '@/lib/auth/totp/secondFactorCookie'

/**
 * POST /api/admin/auth/2fa-verify
 *
 * Body: { tempSecretToken: string, otp: string (6 digits) }
 *
 * Spec: PANEL-AUTH-2FA AC-3.
 *
 * Validates 6-digit OTP против secret из setup session. На success:
 *   1. Шифрует secret AES-256-GCM
 *   2. Генерирует 10 recovery codes plaintext
 *   3. Хеширует codes bcrypt cost 10
 *   4. Сохраняет totpEnabled=true + totpSecretEnc + recoveryCodes (hashes only)
 *   5. Возвращает plaintext codes ОДИН раз в response
 *   6. Помечает session passedSecondFactor=true (чтобы middleware пропустил)
 *
 * SECURITY: plaintext codes только в response, нигде не логируются. Setup
 * session consume-on-success — невозможно повторно использовать тот же token.
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

    const user = auth.user as { id: string | number; totpEnabled?: boolean }

    if (user.totpEnabled) {
      return NextResponse.json(
        { error: { code: 'already_enabled', message: '2FA уже включена.' } },
        { status: 409 },
      )
    }

    const body = (await request.json().catch(() => null)) as {
      tempSecretToken?: unknown
      otp?: unknown
    } | null

    const tempSecretToken =
      body && typeof body.tempSecretToken === 'string' ? body.tempSecretToken : ''
    const otp = body && typeof body.otp === 'string' ? body.otp : ''

    if (!tempSecretToken || !otp) {
      return NextResponse.json(
        { error: { code: 'bad_request', message: 'Не хватает tempSecretToken или otp.' } },
        { status: 400 },
      )
    }

    const secret = getSetupSession(tempSecretToken, user.id, true)
    if (!secret) {
      return NextResponse.json(
        {
          error: {
            code: 'expired_setup_session',
            message: 'Сессия настройки истекла. Начни заново.',
          },
        },
        { status: 400 },
      )
    }

    if (!verifyTotp(otp, secret)) {
      return NextResponse.json(
        { error: { code: 'invalid_otp', message: 'Неверный код. Проверь время на телефоне.' } },
        { status: 400 },
      )
    }

    const totpSecretEnc = encryptSecret(secret)
    const plainCodes = generateRecoveryCodes()
    const hashes = await hashCodes(plainCodes)

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        totpEnabled: true,
        totpSecretEnc,
        recoveryCodes: hashes.map((hash) => ({ hash, consumedAt: null })),
      },
      overrideAccess: true,
    })

    const response = NextResponse.json({ data: { recoveryCodes: plainCodes } }, { status: 200 })
    setSecondFactorPassed(response, user.id)
    return response
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'internal_error',
          message: 'Не удалось включить 2FA. Попробуй ещё раз.',
        },
      },
      { status: 500 },
    )
  }
}
