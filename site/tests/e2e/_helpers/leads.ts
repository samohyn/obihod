/**
 * Общие помощники e2e-тестов заявок (план 09, этап 1 — CI-проверки).
 *
 * - uniqueIp(): у /api/leads лимит 5 заявок в минуту с IP. Каждый тест шлёт
 *   свой `x-real-ip`, поэтому тесты не упираются в лимит друг друга.
 *   В CI сервер слушает напрямую, без nginx — заголовок от теста и есть «IP клиента».
 * - adminToken() / getLead(): проверка, что заявка дошла в админку со всеми полями.
 *   Логин — ADMIN_EMAIL / ADMIN_PASSWORD (в CI админ создаётся scripts/seed-admin.ts).
 *   Без этих переменных проверка сохранения пропускается.
 */
import { randomInt } from 'node:crypto'
import type { APIRequestContext } from '@playwright/test'

export function uniqueIp(): string {
  return `10.${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}`
}

export function uniquePhone(): string {
  const n = String(randomInt(0, 10_000_000)).padStart(7, '0')
  return `+7 (900) ${n.slice(0, 3)}-${n.slice(3, 5)}-${n.slice(5)}`
}

let cachedToken: string | null | undefined

export async function adminToken(request: APIRequestContext): Promise<string | null> {
  if (cachedToken !== undefined) return cachedToken
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    cachedToken = null
    return null
  }
  const res = await request.post('/api/users/login/', { data: { email, password } })
  if (!res.ok()) throw new Error(`Вход админа в тестах: HTTP ${res.status()}`)
  cachedToken = ((await res.json()) as { token: string }).token
  return cachedToken
}

export type LeadDoc = Record<string, unknown> & {
  id: number | string
  phone?: string
  name?: string
  sourcePage?: string
  service?: unknown
  message?: string
  photoFiles?: unknown[]
  consentAt?: string
  consentVersion?: string
}

export async function getLead(
  request: APIRequestContext,
  token: string,
  id: number | string,
  depth = 0,
): Promise<LeadDoc> {
  const read = (t: string) =>
    request.get(`/api/leads/${id}/?depth=${depth}`, { headers: { Authorization: `JWT ${t}` } })
  let res = await read(token)
  // Параллельные воркеры логинятся одним админом одновременно, Payload пишет их
  // сессии в одну запись users — одна может потеряться. Тогда входим заново.
  if (res.status() === 401 || res.status() === 403) {
    cachedToken = undefined
    const fresh = await adminToken(request)
    if (fresh) res = await read(fresh)
  }
  if (!res.ok()) throw new Error(`Чтение заявки ${id}: HTTP ${res.status()}`)
  return (await res.json()) as LeadDoc
}
