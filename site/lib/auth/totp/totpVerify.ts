/**
 * TOTP verify wrapper над otplib.authenticator.
 *
 * Spec: PANEL-AUTH-2FA AC-2, AC-3. RFC 6238, sha1 / 30s step / 6 digits
 * (Google Authenticator default), window ±1 step (±30 сек tolerance).
 *
 * SECURITY: НЕ логировать ни secret ни token.
 */
import { authenticator } from 'otplib'

// Глобальная конфигурация модуля. window=1 → допускаются текущая ±1 30-сек
// ступень = ±30 сек tolerance (баланс UX vs replay-risk).
//
// HashAlgorithms enum не re-export'ится из otplib v12 preset-default; используем
// string literal cast — otplib accepts 'sha1' лит. внутренне. Если когда-то
// поменять хеш — меняем строку (other valid: 'sha256', 'sha512').
authenticator.options = {
  algorithm: 'sha1' as never, // HashAlgorithms.SHA1
  digits: 6,
  step: 30,
  window: 1,
}

const ISSUER = 'Обиход'

/** Generate cryptographically secure base32 secret (160 bit). */
export function generateSecret(): string {
  return authenticator.generateSecret(20) // 20 bytes → 32-char base32, 160 bit entropy
}

/**
 * otpauth:// URI для QR кода. Совместимо с Google Authenticator, 1Password,
 * Authy, Yandex Key.
 */
export function buildOtpAuthUri(email: string, secret: string): string {
  return authenticator.keyuri(email, ISSUER, secret)
}

/**
 * Форматирует base32 secret в группы по 4 для manual entry: ABCD EFGH IJKL MNOP.
 */
export function formatManualSecret(secret: string): string {
  const groups: string[] = []
  for (let i = 0; i < secret.length; i += 4) {
    groups.push(secret.slice(i, i + 4))
  }
  return groups.join(' ')
}

/**
 * Проверяет 6-digit token против secret. Window=1 (±30 сек).
 * Возвращает false при любой ошибке/невалидном input — не throws.
 */
export function verifyTotp(token: string, secret: string): boolean {
  if (!token || !secret) return false
  // otplib принимает только строго 6 digits после нашей предварительной валидации
  const cleaned = token.replace(/\s+/g, '')
  if (!/^\d{6}$/.test(cleaned)) return false
  try {
    return authenticator.check(cleaned, secret)
  } catch {
    return false
  }
}
