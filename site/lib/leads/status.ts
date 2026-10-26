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
 * Канон brand-guide §32 «Статусы заявки» (#lead-status, 7 опций).
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

/** Смысл статуса — подсказка в панели заявок (план 09, этап 5.2). */
export const LEAD_STATUS_HINTS: Record<LeadStatus, string> = {
  new: 'Заявка пришла, ещё не звонили',
  contacted: 'Связались, уточняем задачу',
  smeta: 'Считаем или согласуем смету',
  brigade: 'Бригада назначена или на объекте',
  done: 'Работы выполнены, заявка закрыта',
  cancelled: 'Клиент отказался — заявка закрыта',
  spam: 'Не заявка: реклама, ошибка, тест',
}

/**
 * Опции для Payload `select` field. Импортируется в Leads.ts.
 * Stable order = brand-guide §32 (#lead-status).
 */
export const LEAD_STATUS_OPTIONS = LEAD_STATUSES.map((value) => ({
  label: LEAD_STATUS_LABELS[value],
  value,
}))

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === 'string' && (LEAD_STATUSES as readonly string[]).includes(value)
}

/** Итог первого звонка — только он останавливает таймер «ответить до» (план 09, этап 5.1). */
export const CONTACT_RESULT_OPTIONS = [
  { label: 'Связались', value: 'reached' },
  { label: 'Не ответил', value: 'no_answer' },
] as const

export type ContactResult = (typeof CONTACT_RESULT_OPTIONS)[number]['value']

/** Заявка закрыта: срока ответа у неё нет, в очереди «Новые» и «В работе» её нет. */
export const CLOSED_STATUSES: readonly LeadStatus[] = ['done', 'cancelled', 'spam']

export function isClosedStatus(value: unknown): boolean {
  return isLeadStatus(value) && CLOSED_STATUSES.includes(value)
}
