import { NextResponse, type NextRequest } from 'next/server'
import { draftMode } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'

import { payloadClient } from '@/lib/payload'
import { computePreviewUrl, isPreviewableCollection } from '@/lib/admin/preview-routes'

/**
 * GET /api/preview?collection=<slug>&id=<id>&token=<hmac>
 *
 * Открывает preview публичной страницы из админки. Token подписан HMAC-SHA256
 * секретом `PAYLOAD_PREVIEW_SECRET` в формате `${id}:${collection}:${exp}`.
 *
 * Sa-spec §6.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.PAYLOAD_PREVIEW_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'Preview disabled: PAYLOAD_PREVIEW_SECRET not configured.' },
      { status: 500 },
    )
  }

  const { searchParams } = req.nextUrl
  const collection = searchParams.get('collection') ?? ''
  const id = searchParams.get('id') ?? ''
  const exp = searchParams.get('exp') ?? ''
  const token = searchParams.get('token') ?? ''

  if (!collection || !id || !exp || !token) {
    return NextResponse.json(
      { error: 'collection, id, exp, token query params required' },
      { status: 400 },
    )
  }

  if (!isPreviewableCollection(collection)) {
    return NextResponse.json(
      { error: `Collection "${collection}" is not previewable.` },
      { status: 400 },
    )
  }

  const expNum = Number(exp)
  if (!Number.isFinite(expNum) || expNum < Date.now() / 1000) {
    return NextResponse.json({ error: 'Token expired.' }, { status: 401 })
  }

  const expected = createHmac('sha256', secret).update(`${id}:${collection}:${exp}`).digest('hex')

  let valid = false
  try {
    const a = Buffer.from(token, 'hex')
    const b = Buffer.from(expected, 'hex')
    valid = a.length === b.length && timingSafeEqual(a, b)
  } catch {
    valid = false
  }
  if (!valid) {
    return NextResponse.json({ error: 'Invalid token.' }, { status: 401 })
  }

  // Загружаем документ для построения публичного URL.
  const payload = await payloadClient()
  let doc
  try {
    doc = await payload.findByID({ collection, id, draft: true, depth: 1 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ error: `Document not found: ${message}` }, { status: 404 })
  }

  const url = await computePreviewUrl(collection, doc, payload)
  if (!url) {
    return NextResponse.json(
      { error: 'Cannot compute preview URL — slug missing.' },
      { status: 422 },
    )
  }

  const draft = await draftMode()
  draft.enable()

  return NextResponse.redirect(new URL(url, req.nextUrl.origin), 307)
}
