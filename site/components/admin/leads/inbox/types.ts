import type { ContactResult, LeadStatus } from '@/lib/leads/status'

/**
 * Панель заявок (план 09, этап 5.2) — данные, которые сервер передаёт экрану очереди.
 * Без функций и классов: их можно отдать клиентскому компоненту.
 */

export type InboxTab = 'urgent' | 'new' | 'work' | 'all'

export const INBOX_TABS: { id: InboxTab; label: string; hint: string }[] = [
  { id: 'urgent', label: 'Срочно', hint: 'Просрочено или осталось меньше 3 минут' },
  { id: 'new', label: 'Новые', hint: 'Ещё не звонили' },
  { id: 'work', label: 'В работе', hint: 'На связи, смета, бригада' },
  { id: 'all', label: 'Все', hint: 'Все заявки, кроме архива' },
]

export const isInboxTab = (v: unknown): v is InboxTab =>
  typeof v === 'string' && INBOX_TABS.some((t) => t.id === v)

/** Значение фильтра «Источник» для заявок без UTM-метки. */
export const NO_SOURCE = 'none'

export interface InboxLeadRow {
  id: number
  phone: string
  name: string | null
  status: LeadStatus
  serviceTitle: string | null
  districtTitle: string | null
  photoCount: number
  createdAt: string
  replyDueAt: string | null
  firstContactAt: string | null
  closedAt: string | null
  contactResult: ContactResult | null
  nextActionAt: string | null
}

export interface InboxPhoto {
  id: number
  url: string
  thumbUrl: string
}

export interface InboxLead extends InboxLeadRow {
  email: string | null
  message: string | null
  address: string | null
  sourcePage: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  managerComment: string | null
  consentAt: string | null
  consentVersion: string | null
  photosDeletedAt: string | null
  photos: InboxPhoto[]
}

export interface InboxOption {
  value: string
  label: string
}

export interface InboxFilters {
  q: string
  service: string
  district: string
  source: string
}

export interface InboxData {
  tab: InboxTab
  counts: Record<InboxTab, number>
  rows: InboxLeadRow[]
  /** Сколько заявок во вкладке всего — список показывает не больше QUEUE_LIMIT. */
  total: number
  selected: InboxLead | null
  filters: InboxFilters
  options: { services: InboxOption[]; districts: InboxOption[]; sources: InboxOption[] }
  /** Время сервера при сборке экрана — с него начинает идти таймер в браузере. */
  serverNow: number
}

export const QUEUE_LIMIT = 100
