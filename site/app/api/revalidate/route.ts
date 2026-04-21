import { NextResponse, type NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

/**
 * Webhook-эндпоинт для Payload `afterChange` hooks.
 * Защищён через `x-revalidate-secret` header (см. .env REVALIDATE_SECRET).
 *
 * Пример использования:
 *   await fetch(`${SITE_URL}/api/revalidate?tag=service-arboristika`, {
 *     headers: { 'x-revalidate-secret': process.env.REVALIDATE_SECRET! }
 *   })
 */
export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tag = req.nextUrl.searchParams.get('tag')
  if (!tag) {
    return NextResponse.json({ error: 'tag query is required' }, { status: 400 })
  }

  try {
    // Next 16: второй аргумент обязателен. 'max' = stale-while-revalidate,
    // рекомендуемое значение для контентных инвалидаций из Payload hooks.
    revalidateTag(tag, 'max')
    return NextResponse.json({ ok: true, tag, revalidatedAt: new Date().toISOString() })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
