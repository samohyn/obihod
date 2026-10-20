/**
 * Время, до которого перезвоним (оффер, contex/10_offer.md §2–3): заявка с 8:00 до 21:50 по Москве —
 * плюс 10 минут; позже и ночью — «8:15» следующего утра. Показывается после отправки формы.
 */
export function callbackDeadline(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  const total = hour * 60 + minute
  if (total < 8 * 60 || total >= 22 * 60 - 10) return '8:15'
  const due = total + 10
  return `${String(Math.floor(due / 60)).padStart(2, '0')}:${String(due % 60).padStart(2, '0')}`
}
