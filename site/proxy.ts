import { NextResponse, type NextRequest } from 'next/server'

/**
 * Proxy Обихода (Next.js 16+ переименовал `middleware` в `proxy`):
 * 1. http → https (на проде; локально игнорируем)
 * 2. www → non-www
 * 3. Trailing slash на всех маршрутах кроме /api/, /admin/, и файлов с расширениями
 *
 * Legacy redirects из коллекции `redirects` Payload — реализуем позже
 * (нужен in-memory snapshot, обновляемый по ISR).
 */
export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone()
  const host = req.headers.get('host') ?? ''
  const proto = req.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '')

  // 1. http → https (только если за прокси)
  if (proto === 'http' && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')) {
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }

  // 2. www → non-www
  if (host.startsWith('www.')) {
    url.host = host.replace(/^www\./, '')
    return NextResponse.redirect(url, 301)
  }

  // Trailing slash управляется Next.js через next.config.ts (`trailingSlash: true`)
  // — здесь не дублируем, чтобы не было редирект-цикла.

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'],
}
