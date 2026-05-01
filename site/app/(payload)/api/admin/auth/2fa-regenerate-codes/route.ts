import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { payloadClient } from '@/lib/payload'
import { decryptSecret, generateRecoveryCodes, hashCodes, verifyTotp } from '@/lib/auth/totp'

/**
 * POST /api/admin/auth/2fa-regenerate-codes
 *
 * Body: { otp: string }
 *
 * Spec: PANEL-AUTH-2FA AC-5. Требует current OTP. Генерирует новые 10 codes,
 * заменяет hashes в Users, возвращает plaintext один раз. Старые codes
 * invalidated.
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

    if (!user.totpEnabled) {
      return NextResponse.json(
        { error: { code: 'not_enabled', message: 'Сначала включи 2FA в профиле.' } },
        { status: 409 },
      )
    }

    const body = (await request.json().catch(() => null)) as { otp?: unknown } | null
    const otp = body && typeof body.otp === 'string' ? body.otp : ''

    if (!otp) {
      return NextResponse.json(
        { error: { code: 'bad_request', message: 'Введи код из приложения.' } },
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
    if (!enc) {
      return NextResponse.json(
        { error: { code: 'invalid_state', message: '2FA не настроена.' } },
        { status: 409 },
      )
    }

    let secret: string
    try {
      secret = decryptSecret(enc)
    } catch {
      return NextResponse.json(
        {
          error: {
            code: 'invalid_state',
            message: '2FA secret не расшифровать. Обратись к оператору.',
          },
        },
        { status: 500 },
      )
    }

    if (!verifyTotp(otp, secret)) {
      return NextResponse.json(
        { error: { code: 'invalid_otp', message: 'Неверный код приложения.' } },
        { status: 400 },
      )
    }

    const plainCodes = generateRecoveryCodes()
    const hashes = await hashCodes(plainCodes)

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        recoveryCodes: hashes.map((hash) => ({ hash, consumedAt: null })),
      },
      overrideAccess: true,
    })

    return NextResponse.json({ data: { recoveryCodes: plainCodes } }, { status: 200 })
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'internal_error',
          message: 'Не удалось перегенерировать коды. Попробуй ещё раз.',
        },
      },
      { status: 500 },
    )
  }
}
