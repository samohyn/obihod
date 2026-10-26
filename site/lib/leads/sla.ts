import { DEFAULT_COMPANY, type Company } from '@/lib/offer'

import { isClosedStatus } from './status'

/**
 * Срок первого ответа на заявку и состояние таймера «ответить до» (план 09, этап 5.1).
 * Чистые функции: без базы и без часов браузера — время передаётся аргументом.
 *
 * Правило то же, что у обещания в форме (lib/leads/callbackDeadline.ts): заявка в рабочие часы
 * по Москве — плюс срок перезвона; раньше открытия, ночью и в последние минуты перед закрытием —
 * утреннее время. Переключатель «по часам работы» в «Компания и контакты» выключает перенос.
 */

export type SlaRule = Pick<
  Company,
  'opens' | 'closes' | 'callbackMinutes' | 'nightCallbackTime' | 'replyByWorkingHours'
>

/** Последние минуты перед сроком — «Скоро». */
export const SOON_MS = 3 * 60_000

const MINUTE = 60_000
const DAY = 24 * 60 * MINUTE
// Москва — UTC+3 круглый год, без перевода часов.
const MSK_OFFSET = 3 * 60 * MINUTE

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Правило из документа «Компания и контакты»; пустое — значения по умолчанию. */
export function slaRuleFrom(
  doc: Partial<Record<keyof SlaRule, unknown>> | null | undefined,
): SlaRule {
  const pick = <K extends keyof SlaRule>(key: K): SlaRule[K] => {
    const v = doc?.[key]
    return (v === null || v === undefined || v === '' ? DEFAULT_COMPANY[key] : v) as SlaRule[K]
  }
  return {
    opens: pick('opens'),
    closes: pick('closes'),
    callbackMinutes: Number(pick('callbackMinutes')),
    nightCallbackTime: pick('nightCallbackTime'),
    replyByWorkingHours: pick('replyByWorkingHours'),
  }
}

/** Когда нужно ответить на заявку, созданную в `created`. */
export function replyDueAt(created: Date, rule: SlaRule = DEFAULT_COMPANY): Date {
  const t = created.getTime()
  const plain = new Date(t + rule.callbackMinutes * MINUTE)
  if (!rule.replyByWorkingHours) return plain

  const local = t + MSK_OFFSET
  const dayStart = Math.floor(local / DAY) * DAY - MSK_OFFSET
  const minuteOfDay = Math.floor((local % DAY) / MINUTE)
  const opens = toMinutes(rule.opens)
  const lastIntake = toMinutes(rule.closes) - rule.callbackMinutes
  if (minuteOfDay >= opens && minuteOfDay < lastIntake) return plain

  const morning =
    dayStart + (minuteOfDay < opens ? 0 : DAY) + toMinutes(rule.nightCallbackTime) * MINUTE
  return new Date(Math.max(morning, plain.getTime()))
}

export type SlaKind = 'none' | 'ok' | 'soon' | 'overdue'

export interface LeadSlaFields {
  status?: string | null
  replyDueAt?: string | Date | null
  firstContactAt?: string | Date | null
  closedAt?: string | Date | null
}

export interface SlaState {
  kind: SlaKind
  dueAt: Date | null
  /** До срока, мс; у просроченной — отрицательное. */
  remainingMs: number
}

const asDate = (v: string | Date | null | undefined) => (v ? new Date(v) : null)

/**
 * Таймер останавливает только итог первого звонка (`firstContactAt`) или закрытие заявки —
 * открытие карточки, смена статуса «в работе» и напоминание срок не сбрасывают.
 */
export function slaState(lead: LeadSlaFields, now: Date): SlaState {
  const dueAt = asDate(lead.replyDueAt)
  if (!dueAt || lead.firstContactAt || lead.closedAt || isClosedStatus(lead.status)) {
    return { kind: 'none', dueAt, remainingMs: 0 }
  }
  const remainingMs = dueAt.getTime() - now.getTime()
  const kind: SlaKind = remainingMs < 0 ? 'overdue' : remainingMs <= SOON_MS ? 'soon' : 'ok'
  return { kind, dueAt, remainingMs }
}

/** «7:45», «1 ч 05 мин», «2 дн 3 ч» — сколько осталось или на сколько просрочено. */
export function formatDuration(ms: number): string {
  const totalSec = Math.floor(Math.abs(ms) / 1000)
  const min = Math.floor(totalSec / 60)
  if (min < 60) return `${min}:${String(totalSec % 60).padStart(2, '0')}`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} ч ${String(min % 60).padStart(2, '0')} мин`
  return `${Math.floor(h / 24)} дн ${h % 24} ч`
}

/** «14:32» по Москве. */
export function formatClockMsk(d: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(d)
}

/** Подпись таймера: текст рядом со значком, не только цвет. */
export function slaLabel(state: SlaState): string {
  if (state.kind === 'none' || !state.dueAt) return ''
  if (state.kind === 'overdue') return `Просрочено на ${formatDuration(state.remainingMs)}`
  if (state.kind === 'soon') return `Скоро: осталось ${formatDuration(state.remainingMs)}`
  return `Ответить до ${formatClockMsk(state.dueAt)}`
}

/**
 * Очередь: заявки с идущим сроком — по ближайшему сроку (просроченные выше всех, сильнее
 * просроченные первыми), за ними остальные — новые сверху.
 */
export function compareQueue<T extends LeadSlaFields & { createdAt?: string | Date | null }>(
  now: Date,
): (a: T, b: T) => number {
  return (a, b) => {
    const sa = slaState(a, now)
    const sb = slaState(b, now)
    const ta = sa.kind === 'none' ? null : sa.dueAt!.getTime()
    const tb = sb.kind === 'none' ? null : sb.dueAt!.getTime()
    if (ta !== null && tb !== null) return ta - tb
    if (ta !== null) return -1
    if (tb !== null) return 1
    return (asDate(b.createdAt)?.getTime() ?? 0) - (asDate(a.createdAt)?.getTime() ?? 0)
  }
}

export interface ReplyStats {
  /** Заявок со сроком, по которым уже известен итог: ответили или срок вышел. */
  total: number
  inTime: number
  late: number
}

/**
 * Доля заявок, отвеченных в срок (план 09, этап 5.5), — за период по дате заявки.
 * В срок — итог первого звонка (или закрытие без звонка) не позже срока. Не в срок — позже или
 * срок вышел, а итога нет. Заявки с ещё идущим сроком и «Спам» не считаются.
 */
export function replyStats(
  leads: (LeadSlaFields & { createdAt?: string | Date | null })[],
  from: Date,
  now: Date,
): ReplyStats {
  let inTime = 0
  let late = 0
  for (const l of leads) {
    const due = asDate(l.replyDueAt)
    const created = asDate(l.createdAt)
    if (!due || !created || created < from || l.status === 'spam') continue
    const answered = asDate(l.firstContactAt) ?? asDate(l.closedAt)
    if (answered) {
      if (answered <= due) inTime += 1
      else late += 1
    } else if (due < now) {
      late += 1
    }
  }
  return { total: inTime + late, inTime, late }
}
