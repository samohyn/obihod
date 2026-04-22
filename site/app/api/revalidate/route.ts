import { NextResponse, type NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

import { pushToIndexNow } from '@/lib/seo/indexnow'

/**
 * Webhook-эндпоинт для Payload `afterChange` hooks.
 * Защищён через `x-revalidate-secret` header (см. .env REVALIDATE_SECRET).
 *
 * Пример:
 *   fetch(`${SITE_URL}/api/revalidate?tag=services&url=/arboristika/&url=/arboristika/ramenskoye/`, {
 *     headers: { 'x-revalidate-secret': process.env.REVALIDATE_SECRET! }
 *   })
 *
 * tag — обязателен, инвалидирует unstable_cache.
 * url — 0..N раз, при наличии пушит в IndexNow (Яндекс принимает).
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
    // Next 16: второй аргумент обязателен. 'max' = stale-while-revalidate.
    revalidateTag(tag, 'max')
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  const urls = req.nextUrl.searchParams.getAll('url')
  const indexNow = urls.length > 0 ? await pushToIndexNow(urls) : null

  return NextResponse.json({
    ok: true,
    tag,
    revalidatedAt: new Date().toISOString(),
    indexNow,
  })
}
