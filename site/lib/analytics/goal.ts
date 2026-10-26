/**
 * Цели Яндекс Метрики (план 09, этап 7): «заявка отправлена», «звонок», «почта», «заявка из
 * калькулятора». Счётчик есть только после согласия посетителя (AnalyticsConsent) — до него
 * вызов ничего не делает. Персональные данные в цели не передаём.
 */
export type GoalName = 'lead_sent' | 'phone_click' | 'email_click' | 'calc_lead'

type YmWindow = Window & { ym?: (...args: unknown[]) => void; __obikhodYm?: number }

export function goal(name: GoalName): void {
  if (typeof window === 'undefined') return
  const w = window as YmWindow
  if (w.ym && w.__obikhodYm) w.ym(w.__obikhodYm, 'reachGoal', name)
}

export const CONSENT_COOKIE = 'obikhod_consent'
export const COOKIE_SETTINGS_EVENT = 'obikhod:cookie-settings'
