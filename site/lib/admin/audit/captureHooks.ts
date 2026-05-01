import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { getAuditLogAdapter } from './HybridAuditLogAdapter'
import type { AuditAction } from './types'

/**
 * PANEL-AUDIT-LOG — capture hooks для PII / non-versioned коллекций.
 *
 * Используются в Leads, Users, Media, Redirects (Payload коллекции БЕЗ
 * versions: true).
 *
 * Side-effect-only хуки: write в audit_log не должны блокировать save
 * операцию. Любая ошибка capture логируется в console и проглатывается
 * (audit log — secondary concern по сравнению с document save).
 */

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
  return async ({ doc, previousDoc, operation, req }) => {
    try {
      const action: AuditAction = operation === 'create' ? 'create' : 'update'
      await getAuditLogAdapter().capture({
        collection: collectionSlug,
        docId: doc?.id != null ? String(doc.id) : null,
        docTitle: extractTitle ? extractTitle(doc as Record<string, unknown>) : null,
        userId: userIdFrom(req),
        action,
        before: operation === 'update' ? (previousDoc as Record<string, unknown>) : null,
        after: doc as Record<string, unknown>,
        ip: ipFrom(req),
        userAgent: userAgentFrom(req),
      })
    } catch (err) {
      // Audit log capture не должен блокировать save → swallow + log.
      console.error(`[audit] capture afterChange failed for ${collectionSlug}`, err)
    }
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
  return async ({ doc, req }) => {
    try {
      await getAuditLogAdapter().capture({
        collection: collectionSlug,
        docId: doc?.id != null ? String(doc.id) : null,
        docTitle: extractTitle ? extractTitle(doc as Record<string, unknown>) : null,
        userId: userIdFrom(req),
        action: 'delete',
        before: doc as Record<string, unknown>,
        after: null,
        ip: ipFrom(req),
        userAgent: userAgentFrom(req),
      })
    } catch (err) {
      console.error(`[audit] capture afterDelete failed for ${collectionSlug}`, err)
    }
    return doc
  }
}

/**
 * Capture успешного login. Используется в Users.hooks.afterLogin.
 */
export async function captureLogin(userId: number, userEmail: string, req: unknown): Promise<void> {
  try {
    await getAuditLogAdapter().capture({
      collection: '__auth',
      docId: String(userId),
      docTitle: userEmail,
      userId,
      action: 'login',
      ip: ipFrom(req),
      userAgent: userAgentFrom(req),
    })
  } catch (err) {
    console.error('[audit] capture login failed', err)
  }
}

/**
 * Capture logout. Используется в Users.hooks.afterLogout.
 */
export async function captureLogout(userId: number, req: unknown): Promise<void> {
  try {
    await getAuditLogAdapter().capture({
      collection: '__auth',
      docId: String(userId),
      userId,
      action: 'logout',
      ip: ipFrom(req),
      userAgent: userAgentFrom(req),
    })
  } catch (err) {
    console.error('[audit] capture logout failed', err)
  }
}

/**
 * Capture RBAC-change (изменение role в Users). Вызывается из Users
 * afterChange hook когда detected role transition.
 */
export async function captureRbacChange(
  userId: number,
  fromRole: string | null,
  toRole: string,
  actorId: number | null,
  req: unknown,
): Promise<void> {
  try {
    await getAuditLogAdapter().capture({
      collection: '__auth',
      docId: String(userId),
      userId: actorId,
      action: 'rbac_change',
      ip: ipFrom(req),
      userAgent: userAgentFrom(req),
      metadata: { from_role: fromRole, to_role: toRole, target_user_id: userId },
    })
  } catch (err) {
    console.error('[audit] capture rbac_change failed', err)
  }
}
