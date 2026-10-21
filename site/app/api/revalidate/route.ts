import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'

import { pushToIndexNow } from '@/lib/seo/indexnow'

/**
 * Сброс кеша всего сайта для процессов вне Next: seed и скрипты данных
 * (`scripts/_site-revalidate.ts`, `pnpm revalidate:site`), ручной workflow «Revalidate».
 * Правки из админки сбрасывают кеш сами — хуки `lib/admin/revalidateSite.ts`.
 *
 * POST, секрет — заголовок `x-revalidate-secret` (REVALIDATE_SECRET).
 * `url` (0..N) — адреса для IndexNow; без INDEXNOW_KEY ничего не отправляется.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath('/', 'layout')

  const urls = req.nextUrl.searchParams.getAll('url')
  const indexNow = urls.length > 0 ? await pushToIndexNow(urls) : null

  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString(), indexNow })
}
