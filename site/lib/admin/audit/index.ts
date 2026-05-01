/**
 * PANEL-AUDIT-LOG — public API surface для audit module.
 *
 * Экспортирует port-интерфейс, types, masking utilities и singleton-getter
 * для adapter. Hooks в коллекциях и REST endpoint импортируют отсюда.
 */

export type {
  AuditAction,
  AuditCaptureEvent,
  AuditDiff,
  AuditEntry,
  AuditFilters,
  AuditListResult,
  AuditLogPort,
} from './types'
export { maskPII, hasPIIRules, getPIIFields } from './maskPII'
export { HybridAuditLogAdapter, getAuditLogAdapter, isPiiOrSecurity } from './HybridAuditLogAdapter'
