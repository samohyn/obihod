import { NextResponse, type NextRequest } from 'next/server'
import { createHmac } from 'node:crypto'
import { headers } from 'next/headers'

import { payloadClient } from '@/lib/payload'
import { isPreviewableCollection } from '@/lib/admin/preview-routes'

/**
 * GET /api/preview-sign?collection=<slug>&id=<id>
 *
 * Возвращает подписанную preview-ссылку. Доступен только аутентифицированному
 * Payload admin-юзеру (cookie payload-token). Используется кнопкой «Посмотреть
 * черновик» в админке — секрет не утекает в client bundle.
 *
 * TTL токена — 30 минут.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.PAYLOAD_PREVIEW_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'Preview disabled: PAYLOAD_PREVIEW_SECRET not configured.' },
      { status: 500 },
    )
  }

  // Проверяем auth через Payload Local API. Если запрос пришёл из admin —
  // cookie уже установлена и payload.auth() вернёт user.
  const payload = await payloadClient()
  const reqHeaders = await headers()
  const authResult = await payload.auth({ headers: reqHeaders })
  if (!authResult.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const collection = searchParams.get('collection') ?? ''
  const id = searchParams.get('id') ?? ''

  if (!collection || !id) {
    return NextResponse.json({ error: 'collection, id query params required' }, { status: 400 })
  }

  if (!isPreviewableCollection(collection)) {
    return NextResponse.json(
      { error: `Collection "${collection}" is not previewable.` },
      { status: 400 },
    )
  }

  const exp = Math.floor(Date.now() / 1000) + 30 * 60 // 30 мин
  const token = createHmac('sha256', secret).update(`${id}:${collection}:${exp}`).digest('hex')

  const url = new URL('/api/preview', req.nextUrl.origin)
  url.searchParams.set('collection', collection)
  url.searchParams.set('id', id)
  url.searchParams.set('exp', String(exp))
  url.searchParams.set('token', token)

  return NextResponse.json({
    url: url.pathname + url.search,
    expiresAt: new Date(exp * 1000).toISOString(),
  })
}
