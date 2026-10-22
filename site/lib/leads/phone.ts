/**
 * Российский номер → «+7 (900) 123-45-67»; не похож на номер — null.
 * Одно правило для формы в браузере и для /api/leads (lib/leads/schema.ts).
 */
export function normalizePhone(raw: string): string | null {
  let d = raw.replace(/\D/g, '')
  if (d.length === 11 && (d[0] === '7' || d[0] === '8')) d = d.slice(1)
  if (d.length !== 10 || d[0] === '0') return null
  return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8)}`
}
