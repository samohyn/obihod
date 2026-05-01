/**
 * In-memory store для temp TOTP setup secrets (10-min TTL).
 *
 * Spec: PANEL-AUTH-2FA архитектура §2. После /2fa-setup secret временно живёт
 * в памяти, не в БД — иначе риск «недо-setup записал secret и пользователь не
 * подтвердил» → lockout.
 *
 * Scale-out follow-up: при переходе на 2+ node — переносим в Redis. На MVP
 * (один Beget VPS node) in-memory достаточно.
 *
 * SECURITY: token — 16 bytes base64url, secret — base32 TOTP. После использования
 * (verify success) запись удаляется. После TTL — auto-purge при следующей
 * операции.
 */
import crypto from 'node:crypto'

const TTL_MS = 10 * 60 * 1000 // 10 минут

interface Entry {
  secret: string
  userId: string | number
  expiresAt: number
}

const store = new Map<string, Entry>()

/** Создаёт новую setup session, возвращает opaque token. */
export function createSetupSession(userId: string | number, secret: string): string {
  purgeExpired()
  const token = crypto.randomBytes(16).toString('base64url')
  store.set(token, { secret, userId, expiresAt: Date.now() + TTL_MS })
  return token
}

/**
 * Извлекает session по token + userId. Возвращает secret или null если
 * session не найдена / expired / userId mismatch.
 *
 * `consume=true` (default) — удаляет запись (single-use, защита от race).
 */
export function getSetupSession(
  token: string,
  userId: string | number,
  consume = true,
): string | null {
  purgeExpired()
  const entry = store.get(token)
  if (!entry) return null
  if (entry.expiresAt < Date.now()) {
    store.delete(token)
    return null
  }
  // Защита от cross-user — token, выпущенный для user A, не должен пройти
  // verify для user B даже если кто-то перехватил cookie.
  if (String(entry.userId) !== String(userId)) return null
  if (consume) store.delete(token)
  return entry.secret
}

/** Удаляет все expired записи. Вызывается на каждой операции. */
function purgeExpired(): void {
  const now = Date.now()
  for (const [token, entry] of store) {
    if (entry.expiresAt < now) store.delete(token)
  }
}

/** Только для unit-тестов — очищает store. */
export function _resetSetupSessions(): void {
  store.clear()
}

/** Только для unit-тестов — текущий размер store. */
export function _setupSessionCount(): number {
  return store.size
}
