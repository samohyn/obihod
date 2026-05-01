/**
 * Recovery codes — генерация, хеширование (bcrypt cost 10), верификация.
 *
 * Spec: PANEL-AUTH-2FA AC-3, AC-7. Format `XXXX-XXXX-XXXX` base32 (60 bit
 * entropy). Hash хранится в БД, plaintext показывается user-у только один раз
 * при setup или regenerate.
 *
 * SECURITY: НЕ логировать plaintext коды. `verifyCode` использует bcrypt.compare
 * которая constant-time — safe от timing-side-channel.
 */
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'

const CODE_COUNT = 10
const CODE_GROUP_LEN = 4
const CODE_GROUPS = 3
const BCRYPT_COST = 10
// Crockford-friendly base32 без I, L, O, U чтобы не путать с 1, 0.
const ALPHABET = 'ABCDEFGHJKMNPQRSTVWXYZ23456789' // 30 символов, ~4.9 bit/char
// 12 chars × ~4.9 bit ≈ 58.5 bit entropy — соответствует spec «60 bit».

/**
 * Генерирует 10 recovery codes формата `XXXX-XXXX-XXXX`.
 * Использует crypto.randomBytes для энтропии.
 */
export function generateRecoveryCodes(): string[] {
  const codes: string[] = []
  for (let i = 0; i < CODE_COUNT; i++) {
    codes.push(generateCode())
  }
  return codes
}

function generateCode(): string {
  const groups: string[] = []
  for (let g = 0; g < CODE_GROUPS; g++) {
    let group = ''
    const bytes = crypto.randomBytes(CODE_GROUP_LEN)
    for (let i = 0; i < CODE_GROUP_LEN; i++) {
      group += ALPHABET[bytes[i] % ALPHABET.length]
    }
    groups.push(group)
  }
  return groups.join('-')
}

/** Хеширует один code через bcrypt cost 10. */
export async function hashCode(code: string): Promise<string> {
  return bcrypt.hash(code, BCRYPT_COST)
}

/** Хеширует массив codes параллельно. */
export async function hashCodes(codes: string[]): Promise<string[]> {
  return Promise.all(codes.map(hashCode))
}

/**
 * Constant-time проверка plaintext code против bcrypt hash.
 * Возвращает false при ошибке/невалидном hash — не пробрасывает Error.
 */
export async function verifyCode(plain: string, hash: string): Promise<boolean> {
  if (!plain || !hash) return false
  try {
    return await bcrypt.compare(plain, hash)
  } catch {
    return false
  }
}

/**
 * Нормализует input от user-а для матча: trim, uppercase, удаляет пробелы.
 * Code хранится с дашами `XXXX-XXXX-XXXX`. User может ввести с пробелами или
 * без дашей — нормализуем обратно к каноничному виду.
 */
export function normalizeCode(raw: string): string {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (cleaned.length !== CODE_GROUP_LEN * CODE_GROUPS) return raw.trim().toUpperCase()
  const groups: string[] = []
  for (let g = 0; g < CODE_GROUPS; g++) {
    groups.push(cleaned.slice(g * CODE_GROUP_LEN, (g + 1) * CODE_GROUP_LEN))
  }
  return groups.join('-')
}
