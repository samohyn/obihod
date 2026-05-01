/**
 * HTTP-only cookie `obihod_2fa_passed` для отметки прохождения второй ступени.
 *
 * Spec: PANEL-AUTH-2FA архитектура §2 + §13 PO defaults.
 *
 * Format: HMAC-SHA256(userId + sessionSalt) — bound к текущему процессу через
 * PAYLOAD_SECRET (если кто-то перехватит cookie из другого браузера, она
 * бесполезна без access к Payload session JWT).
 *
 * TTL: 7 дней (соответствует Payload JWT default). Логаут чистит cookie.
 *
 * SECURITY: HTTP-only + Secure (в prod) + SameSite=Strict.
 */
import crypto from 'node:crypto'
import type { NextResponse } from 'next/server'

export const SECOND_FACTOR_COOKIE = 'obihod_2fa_passed'
const TTL_SECONDS = 7 * 24 * 60 * 60

function getSalt(): string {
  const s = process.env.PAYLOAD_SECRET
  if (!s) throw new Error('PAYLOAD_SECRET missing — cannot bind 2FA cookie')
  return s
}

/** Computes opaque token bound to userId + PAYLOAD_SECRET. */
export function computeSecondFactorToken(userId: string | number): string {
  return crypto.createHmac('sha256', getSalt()).update(`2fa:${userId}`).digest('hex')
}

/** Sets the 2FA-passed cookie on a NextResponse. */
export function setSecondFactorPassed(res: NextResponse, userId: string | number): void {
  const token = computeSecondFactorToken(userId)
  res.cookies.set({
    name: SECOND_FACTOR_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TTL_SECONDS,
  })
}

/** Clears the 2FA-passed cookie (used on logout / 2FA disable). */
export function clearSecondFactorPassed(res: NextResponse): void {
  res.cookies.set({
    name: SECOND_FACTOR_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}

/**
 * Verifies cookie value matches userId. Returns true if cookie present and
 * cryptographically bound to userId.
 */
export function verifySecondFactorCookie(
  cookieValue: string | undefined,
  userId: string | number,
): boolean {
  if (!cookieValue) return false
  const expected = computeSecondFactorToken(userId)
  if (cookieValue.length !== expected.length) return false
  // constant-time compare via Node crypto.timingSafeEqual
  try {
    return crypto.timingSafeEqual(Buffer.from(cookieValue), Buffer.from(expected))
  } catch {
    return false
  }
}
