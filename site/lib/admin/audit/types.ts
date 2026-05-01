/**
 * PANEL-AUDIT-LOG (ADR-0014) — shared types для AuditLogPort + adapters.
 *
 * Используется hex-port интерфейсом (AuditLogPort.ts), Hybrid adapter
 * (HybridAuditLogAdapter.ts), masking (maskPII.ts), capture-хуками в
 * Leads/Users/Media/Redirects, REST endpoint /api/admin/audit и
 * UI views /admin/audit + /admin/audit/[id].
 */

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'publish'
  | 'unpublish'
  | 'archive'
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'bulk_action'
  | 'rbac_change'

export interface AuditEntry {
  /** UUID для audit_log entries; для versions — `<collection>:<version_id>`. */
  id: string
  /** Источник записи: 'audit_log' (PII / security) | 'version' (content snapshot). */
  source: 'audit_log' | 'version'
  /** Slug коллекции либо синтетический slug ('__auth', '__bulk'). */
  collection: string
  /** Document id (string form). null для login/logout/bulk без doc-target. */
  docId: string | null
  /** Display title документа (best-effort, на момент write). null если недоступен. */
  docTitle: string | null
  /** ID юзера, выполнившего action. null для system / unauth events. */
  userId: number | null
  /** email юзера для display. null если user удалён или system action. */
  userEmail: string | null
  action: AuditAction
  /** ISO 8601 timestamp. */
  changedAt: string
  /** Опциональный IP (только audit_log entries). */
  ip?: string | null
  /** Affected ids для bulk-action (entries из audit_log). */
  affectedIds?: string[] | null
  /** Дополнительный контекст (e.g., from_role/to_role для rbac_change). */
  metadata?: Record<string, unknown>
}

export interface AuditFilters {
  /** Slug-ы коллекций — multi-select. Undefined → все. */
  collections?: string[]
  userId?: number | null
  /** Multi-select actions. */
  actions?: AuditAction[]
  /** ISO 8601; default — last 7 days. */
  from?: string
  /** ISO 8601; default — now. */
  to?: string
  /** Free-text по docTitle / userEmail (LIKE %q%). */
  q?: string
  /** Per-document scope: collection+docId. */
  scopedTo?: { collection: string; docId: string }
  /** Cursor pagination — opaque base64 timestamp. */
  cursor?: string | null
  /** Page size, default 50, max 200. */
  limit?: number
}

export interface AuditDiff {
  /** Snapshot объекта ДО изменения (с PII masking applied write-time). */
  before: Record<string, unknown> | null
  /** Snapshot ПОСЛЕ изменения (с PII masking). */
  after: Record<string, unknown> | null
}

export interface AuditCaptureEvent {
  collection: string
  docId: string | null
  docTitle?: string | null
  userId: number | null
  action: AuditAction
  /** Сырой объект до изменения. PII masking применяется внутри capture(). */
  before?: Record<string, unknown> | null
  /** Сырой объект после изменения. */
  after?: Record<string, unknown> | null
  ip?: string | null
  userAgent?: string | null
  affectedIds?: string[] | null
  metadata?: Record<string, unknown>
}

export interface AuditListResult {
  entries: AuditEntry[]
  nextCursor: string | null
}

export interface AuditLogPort {
  list(filters: AuditFilters): Promise<AuditListResult>
  get(id: string): Promise<AuditEntry | null>
  diff(id: string): Promise<AuditDiff>
  capture(event: AuditCaptureEvent): Promise<void>
}
