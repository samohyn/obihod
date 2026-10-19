/**
 * IP клиента за nginx — для лимитов и журнала аудита.
 *
 * nginx (sites-available/obikhod.ru) ставит `X-Real-IP $remote_addr` и
 * `X-Forwarded-For $proxy_add_x_forwarded_for` — то есть ДОПИСЫВАЕТ настоящий
 * адрес в конец X-Forwarded-For. Начало X-Forwarded-For присылает сам клиент,
 * поэтому брать первый элемент нельзя: подменой заголовка обходится лимит.
 *
 * Порядок: X-Real-IP → последний элемент X-Forwarded-For → null.
 */
export function clientIp(headers: Pick<Headers, 'get'> | null | undefined): string | null {
  const real = headers?.get('x-real-ip')?.trim()
  if (real) return real
  const last = headers?.get('x-forwarded-for')?.split(',').pop()?.trim()
  return last || null
}
