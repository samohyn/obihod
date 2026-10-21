import { NextResponse, type NextRequest } from 'next/server'
import { createHmac } from 'node:crypto'
import { headers } from 'next/headers'

import { payloadClient } from '@/lib/payload'
import { isAdminUser } from '@/lib/auth/access'
import { computePreviewUrl, isPreviewableCollection } from '@/lib/admin/preview-routes'

/**
 * GET /api/preview-sign?collection=<slug>&id=<id>
 *
 * Для панели «Предпросмотр» в админке (components/admin/PagePreviewPanel):
 * - `url` — подписанная ссылка на /api/preview (включает предпросмотр черновика), живёт 5 минут —
 *   панель берёт свежую на каждое нажатие, секрет в браузер не попадает;
 * - `publicUrl` — адрес документа на сайте (для «Открыть на сайте»).
 *
 * Только админ с пройденной 2FA — та же проверка, что у прав на коллекции.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.PAYLOAD_PREVIEW_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'Preview disabled: PAYLOAD_PREVIEW_SECRET not configured.' },
      { status: 500 },
    )
  }

  const payload = await payloadClient()
  const reqHeaders = await headers()
  const { user } = await payload.auth({ headers: reqHeaders })
  if (!isAdminUser(user, reqHeaders)) {
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

  let publicUrl: string | null = null
  try {
    const doc = await payload.findByID({ collection, id, draft: true, depth: 0 })
    publicUrl = await computePreviewUrl(collection, doc, payload)
  } catch {
    return NextResponse.json({ error: 'Документ не найден' }, { status: 404 })
  }

  const exp = Math.floor(Date.now() / 1000) + 5 * 60
  const token = createHmac('sha256', secret).update(`${id}:${collection}:${exp}`).digest('hex')

  const url = new URL('/api/preview/', req.nextUrl.origin)
  url.searchParams.set('collection', collection)
  url.searchParams.set('id', id)
  url.searchParams.set('exp', String(exp))
  url.searchParams.set('token', token)

  return NextResponse.json(
    { url: url.pathname + url.search, publicUrl, expiresAt: new Date(exp * 1000).toISOString() },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
