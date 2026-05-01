/**
 * PANEL-LEADS-INBOX — единый источник правды для status enum.
 *
 * Используется:
 *   - site/collections/Leads.ts (Payload select options)
 *   - site/components/admin/leads/StatusPillCell.tsx
 *   - site/components/admin/leads/RowActionsCell.tsx
 *   - site/components/admin/leads/LeadsQuickFilters.tsx
 *   - site/components/admin/leads/StatusHistoryField.tsx
 *
 * Канон brand-guide §32.4 (7 опций).
 */

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'smeta',
  'brigade',
  'done',
  'cancelled',
  'spam',
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Новая',
  contacted: 'На связи',
  smeta: 'Смета',
  brigade: 'Бригада',
  done: 'Завершена',
  cancelled: 'Отменена',
  spam: 'Спам',
}

/**
 * Опции для Payload `select` field. Импортируется в Leads.ts.
 * Stable order = brand-guide §32.4 timeline.
 */
export const LEAD_STATUS_OPTIONS = LEAD_STATUSES.map((value) => ({
  label: LEAD_STATUS_LABELS[value],
  value,
}))

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === 'string' && (LEAD_STATUSES as readonly string[]).includes(value)
}
