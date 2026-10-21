import { DEFAULT_COMPANY, clock, type Company } from '@/lib/offer'

/** Часы, срок перезвона и ночное время — из «Компания и контакты». */
export type CallbackRule = Pick<
  Company,
  'opens' | 'closes' | 'callbackMinutes' | 'nightCallbackTime'
>

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/**
 * Время, до которого перезвоним (оффер, contex/10_offer.md §2–3): заявка в рабочие часы по Москве —
 * плюс срок перезвона (не позже закрытия); раньше открытия, ночью и в последние минуты — ночное
 * время следующего утра. Показывается после отправки формы.
 */
export function callbackDeadline(
  now: Date = new Date(),
  rule: CallbackRule = DEFAULT_COMPANY,
): string {
  const parts = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  const total = hour * 60 + minute
  if (total < toMinutes(rule.opens) || total >= toMinutes(rule.closes) - rule.callbackMinutes)
    return clock(rule.nightCallbackTime)
  const due = total + rule.callbackMinutes
  return `${String(Math.floor(due / 60)).padStart(2, '0')}:${String(due % 60).padStart(2, '0')}`
}
