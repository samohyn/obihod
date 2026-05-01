/**
 * AES-256-GCM шифрование TOTP secret для хранения в БД.
 *
 * Spec: PANEL-AUTH-2FA AC-7. Ключ — `TOTP_ENCRYPTION_KEY` env (32 bytes base64).
 * Format: base64(iv[12] || authTag[16] || ciphertext) — self-contained per record.
 *
 * SECURITY: НЕ логировать ни plaintext ни ciphertext ни ключ. Любая утечка
 * stack trace должна быть обработана в caller — не пропагировать `error.message`
 * клиенту.
 */
import crypto from 'node:crypto'

const ALG = 'aes-256-gcm'
const IV_LEN = 12
const TAG_LEN = 16
const KEY_LEN = 32

let cachedKey: Buffer | null = null

/**
 * Загружает ключ из env. Кешируется в памяти процесса.
 * Бросает Error если ключ отсутствует, не base64 или не 32 байта.
 */
function getKey(): Buffer {
  if (cachedKey) return cachedKey
  const raw = process.env.TOTP_ENCRYPTION_KEY
  if (!raw) throw new Error('TOTP_ENCRYPTION_KEY missing in environment')
  let buf: Buffer
  try {
    buf = Buffer.from(raw, 'base64')
  } catch {
    throw new Error('TOTP_ENCRYPTION_KEY is not valid base64')
  }
  if (buf.length !== KEY_LEN) {
    throw new Error(`TOTP_ENCRYPTION_KEY must be ${KEY_LEN} bytes after base64 decode`)
  }
  cachedKey = buf
  return buf
}

/** Только для unit-тестов — сбрасывает кеш ключа. */
export function _resetKeyCache(): void {
  cachedKey = null
}

/**
 * Шифрует TOTP secret. Возвращает base64 string.
 * @throws если TOTP_ENCRYPTION_KEY отсутствует/некорректен.
 */
export function encryptSecret(plaintext: string): string {
  if (typeof plaintext !== 'string' || plaintext.length === 0) {
    throw new Error('encryptSecret: plaintext must be non-empty string')
  }
  const key = getKey()
  const iv = crypto.randomBytes(IV_LEN)
  const cipher = crypto.createCipheriv(ALG, key, iv)
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, enc]).toString('base64')
}

/**
 * Расшифровывает blob ← encryptSecret(). Returns plaintext.
 * @throws если ключ неверный, blob truncated или auth tag mismatch.
 */
export function decryptSecret(blob: string): string {
  if (typeof blob !== 'string' || blob.length === 0) {
    throw new Error('decryptSecret: blob must be non-empty string')
  }
  const key = getKey()
  const buf = Buffer.from(blob, 'base64')
  if (buf.length < IV_LEN + TAG_LEN + 1) {
    throw new Error('decryptSecret: blob is truncated')
  }
  const iv = buf.subarray(0, IV_LEN)
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN)
  const enc = buf.subarray(IV_LEN + TAG_LEN)
  const decipher = crypto.createDecipheriv(ALG, key, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8')
}
