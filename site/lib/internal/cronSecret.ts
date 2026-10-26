import { timingSafeEqual } from 'node:crypto'

/**
 * Служебные адреса для таймеров systemd на сервере (deploy/leads/): секрет — заголовок
 * `x-obikhod-cron`, значение — LEADS_CRON_SECRET из окружения сайта. Нет секрета — адрес закрыт.
 */
export function isCronRequest(req: Request): boolean {
  const expected = process.env.LEADS_CRON_SECRET
  const got = req.headers.get('x-obikhod-cron')
  if (!expected || expected.length < 32 || !got) return false
  const a = Buffer.from(got)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}
