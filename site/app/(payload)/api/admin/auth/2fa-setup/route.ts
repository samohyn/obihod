import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import QRCode from 'qrcode'
import { payloadClient } from '@/lib/payload'
import {
  buildOtpAuthUri,
  createSetupSession,
  formatManualSecret,
  generateSecret,
} from '@/lib/auth/totp'

/**
 * POST /api/admin/auth/2fa-setup
 *
 * Spec: PANEL-AUTH-2FA AC-2.
 *
 * Генерирует TOTP secret + QR PNG (data URL) + temp setup session token
 * (10 min TTL, in-memory). Secret НЕ пишется в БД — только при verify.
 *
 * Auth: session required (любой logged-in user может сетапить себе 2FA).
 * Если у user уже totpEnabled=true → 409 Conflict (нужно сначала disable).
 *
 * SECURITY: secret и tempSecretToken никогда не логируются. tempSecretToken
 * single-use (consume в verify endpoint).
 */
export async function POST() {
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

    if (user.totpEnabled) {
      return NextResponse.json(
        {
          error: {
            code: 'already_enabled',
            message: '2FA уже включена. Сначала отключи её в профиле.',
          },
        },
        { status: 409 },
      )
    }

    const secret = generateSecret()
    const otpauthUri = buildOtpAuthUri(user.email, secret)
    const qrPng = await QRCode.toDataURL(otpauthUri, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 240,
    })
    const tempSecretToken = createSetupSession(user.id, secret)

    return NextResponse.json(
      {
        data: {
          qrPng,
          manualSecret: formatManualSecret(secret),
          tempSecretToken,
        },
      },
      { status: 200 },
    )
  } catch {
    // Не пробрасываем error.message — может содержать stack/secret artefacts.
    return NextResponse.json(
      {
        error: { code: 'internal_error', message: 'Не удалось подготовить 2FA. Попробуй ещё раз.' },
      },
      { status: 500 },
    )
  }
}
