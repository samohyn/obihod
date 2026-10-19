import type { PayloadRequest, Where } from 'payload'

import { SECOND_FACTOR_COOKIE, verifySecondFactorCookie } from '@/lib/auth/totp/secondFactorCookie'

/**
 * Единая проверка прав — план 09, этап 1. Сайтом и панелью управляет один администратор.
 *
 * Админ = пользователь с role='admin'. Если у него включена 2FA, нужна ещё валидная
 * (HMAC) cookie второй ступени: proxy.ts проверяет только её наличие, поэтому без этой
 * проверки пароль + произвольная cookie открывали бы и админку, и REST API.
 */

type UserLike = {
  id?: string | number
  role?: string | null
  totpEnabled?: boolean | null
} | null

type HeadersLike = Pick<Headers, 'get'> | undefined

function readCookie(headers: HeadersLike, name: string): string | undefined {
  const raw = headers?.get('cookie')
  if (!raw) return undefined
  for (const part of raw.split(';')) {
    const eq = part.indexOf('=')
    if (eq > 0 && part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim())
    }
  }
  return undefined
}

export function isAdminUser(user: unknown, headers: HeadersLike): boolean {
  const u = user as UserLike
  if (!u || u.role !== 'admin' || u.id === undefined) return false
  if (!u.totpEnabled) return true
  return verifySecondFactorCookie(readCookie(headers, SECOND_FACTOR_COOKIE), u.id)
}

export const isAdmin = ({ req }: { req: PayloadRequest }): boolean =>
  isAdminUser(req.user, req.headers)

const published: Where = { _status: { equals: 'published' } }

/** Опубликованное — всем (сайт, sitemap, e2e), черновики — только админу. */
export const isAdminOrPublished = ({ req }: { req: PayloadRequest }): boolean | Where =>
  isAdminUser(req.user, req.headers) || published
