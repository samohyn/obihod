import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

import { pushToIndexNow } from '@/lib/seo/indexnow'

/**
 * Webhook-эндпоинт для Payload `afterChange` hooks и ручного force-revalidate.
 * Защищён через `x-revalidate-secret` header (см. .env REVALIDATE_SECRET).
 *
 * Пример:
 *   fetch(`${SITE_URL}/api/revalidate/?tag=services&url=/arboristika/&url=/arboristika/ramenskoye/`, {
 *     headers: { 'x-revalidate-secret': process.env.REVALIDATE_SECRET! }
 *   })
 *
 * tag — обязателен, инвалидирует unstable_cache.
 * url — 0..N раз: каждый url ИНВАЛИДИРУЕТ prerendered ISR-страницу
 *   через revalidatePath (нужен для pillar-страниц с `export const revalidate=...`)
 *   + пушится в IndexNow (Яндекс).
 *
 * Контекст OBI-16: revalidateTag не сбрасывает prerendered ISR — нужен
 * revalidatePath. Без него после данных в БД pillar-страницы держат
 * stale 404-prerender до истечения TTL (86400 сек).
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

  const urls = req.nextUrl.searchParams.getAll('url')
  const errors: string[] = []

  try {
    // Next 16: второй аргумент обязателен. 'max' = stale-while-revalidate.
    revalidateTag(tag, 'max')
  } catch (e) {
    errors.push(`revalidateTag(${tag}): ${e instanceof Error ? e.message : 'unknown'}`)
  }

  // Принудительная инвалидация prerendered ISR для каждого пути.
  // Best-effort: даже если один путь упал — продолжаем для остальных.
  for (const url of urls) {
    try {
      revalidatePath(url, 'page')
    } catch (e) {
      errors.push(`revalidatePath(${url}): ${e instanceof Error ? e.message : 'unknown'}`)
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, tag, errors }, { status: 500 })
  }

  const indexNow = urls.length > 0 ? await pushToIndexNow(urls) : null

  return NextResponse.json({
    ok: true,
    tag,
    paths: urls,
    revalidatedAt: new Date().toISOString(),
    indexNow,
  })
}
