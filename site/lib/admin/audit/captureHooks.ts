import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { getAuditLogAdapter } from './HybridAuditLogAdapter'
import type { AuditAction, AuditCaptureEvent } from './types'

/**
 * PANEL-AUDIT-LOG — capture hooks для PII / non-versioned коллекций.
 *
 * Используются в Leads, Users, Media, Redirects (Payload коллекции БЕЗ
 * versions: true).
 *
 * Side-effect-only хуки: write в audit_log не должны блокировать save
 * операцию. Любая ошибка capture логируется в console и проглатывается
 * (audit log — secondary concern по сравнению с document save).
 *
 * INCIDENT 2026-05-01 (PR #133 CI hang): try-catch ловит throws, но НЕ infinite
 * await. Когда capture() висит на pg pool starvation внутри транзакции
 * `/api/users/first-register`, await pending forever и save endpoint висит
 * ровно столько, пока GHA не убьёт job (60min). Fix: timeout-race +
 * fire-and-forget. Audit miss приемлемо, hang seed admin — нет.
 */

const CAPTURE_TIMEOUT_MS = 5_000

/**
 * Race capture vs timeout. Если adapter висит >5s (pool starvation, deadlock
 * на FK lock, etc) — log warning и пропускаем. Save оригинального документа
 * НЕ блокируется.
 *
 * Async fire-and-forget каркас: hook возвращает doc немедленно, capture
 * крутится в фоне. Это отвязывает Payload save transaction от audit_log INSERT,
 * который иногда конкурирует с той же транзакцией за pg connection.
 */
function fireAndForgetCapture(event: AuditCaptureEvent, label: string): void {
  const adapter = getAuditLogAdapter()
  const timeoutPromise = new Promise<'__timeout'>((resolve) => {
    setTimeout(() => resolve('__timeout'), CAPTURE_TIMEOUT_MS)
  })
  Promise.race([adapter.capture(event).then(() => '__ok' as const), timeoutPromise])
    .then((result) => {
      if (result === '__timeout') {
        console.warn(
          `[audit] capture ${label} timed out after ${CAPTURE_TIMEOUT_MS}ms (collection=${event.collection}, action=${event.action}) — entry skipped`,
        )
      }
    })
    .catch((err) => {
      console.error(`[audit] capture ${label} failed`, err)
    })
}

interface MaybeUser {
  id?: number | string | null
  email?: string | null
}

function userIdFrom(req: unknown): number | null {
  const user = (req as { user?: MaybeUser } | null)?.user
  if (!user) return null
  const id = user.id
  if (typeof id === 'number') return id
  if (typeof id === 'string') {
    const parsed = parseInt(id, 10)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function ipFrom(req: unknown): string | null {
  const headers = (req as { headers?: Headers } | null)?.headers
  if (!headers) return null
  const xff = headers.get?.('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return null
}

function userAgentFrom(req: unknown): string | null {
  const headers = (req as { headers?: Headers } | null)?.headers
  return headers?.get?.('user-agent') ?? null
}

/**
 * Создаёт afterChange hook, который пишет audit_log entry на каждое
 * create / update PII-коллекции.
 *
 * `collectionSlug` — slug строкой ('leads', 'users', etc).
 * `extractTitle` — опциональная функция извлечения title из doc для display.
 */
export function buildAfterChangeAuditHook(
  collectionSlug: string,
  extractTitle?: (doc: Record<string, unknown>) => string | null,
): CollectionAfterChangeHook {
  return ({ doc, previousDoc, operation, req }) => {
    const action: AuditAction = operation === 'create' ? 'create' : 'update'
    fireAndForgetCapture(
      {
        collection: collectionSlug,
        docId: doc?.id != null ? String(doc.id) : null,
        docTitle: extractTitle ? extractTitle(doc as Record<string, unknown>) : null,
        userId: userIdFrom(req),
        action,
        before: operation === 'update' ? (previousDoc as Record<string, unknown>) : null,
        after: doc as Record<string, unknown>,
        ip: ipFrom(req),
        userAgent: userAgentFrom(req),
      },
      `afterChange/${collectionSlug}`,
    )
    return doc
  }
}

/**
 * Создаёт afterDelete hook, пишет audit_log entry на удаление документа.
 */
export function buildAfterDeleteAuditHook(
  collectionSlug: string,
  extractTitle?: (doc: Record<string, unknown>) => string | null,
): CollectionAfterDeleteHook {
  return ({ doc, req }) => {
    fireAndForgetCapture(
      {
        collection: collectionSlug,
        docId: doc?.id != null ? String(doc.id) : null,
        docTitle: extractTitle ? extractTitle(doc as Record<string, unknown>) : null,
        userId: userIdFrom(req),
        action: 'delete',
        before: doc as Record<string, unknown>,
        after: null,
        ip: ipFrom(req),
        userAgent: userAgentFrom(req),
      },
      `afterDelete/${collectionSlug}`,
    )
    return doc
  }
}

/**
 * Capture успешного login. Используется в Users.hooks.afterLogin.
 * Fire-and-forget — login response не должен ждать audit INSERT.
 */
export function captureLogin(userId: number, userEmail: string, req: unknown): void {
  fireAndForgetCapture(
    {
      collection: '__auth',
      docId: String(userId),
      docTitle: userEmail,
      userId,
      action: 'login',
      ip: ipFrom(req),
      userAgent: userAgentFrom(req),
    },
    'login',
  )
}

/**
 * Capture logout. Используется в Users.hooks.afterLogout.
 */
export function captureLogout(userId: number, req: unknown): void {
  fireAndForgetCapture(
    {
      collection: '__auth',
      docId: String(userId),
      userId,
      action: 'logout',
      ip: ipFrom(req),
      userAgent: userAgentFrom(req),
    },
    'logout',
  )
}

/**
 * Capture RBAC-change (изменение role в Users). Вызывается из Users
 * afterChange hook когда detected role transition.
 */
export function captureRbacChange(
  userId: number,
  fromRole: string | null,
  toRole: string,
  actorId: number | null,
  req: unknown,
): void {
  fireAndForgetCapture(
    {
      collection: '__auth',
      docId: String(userId),
      userId: actorId,
      action: 'rbac_change',
      ip: ipFrom(req),
      userAgent: userAgentFrom(req),
      metadata: { from_role: fromRole, to_role: toRole, target_user_id: userId },
    },
    'rbac_change',
  )
}
