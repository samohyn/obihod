import { draftMode } from 'next/headers'
import { cache } from 'react'

import type { V3BlockWithTone } from '@/components/blocks/v3/types'
import { fromPayloadBlocks, mediaPath } from '@/lib/blocks/v3/fromPayload'
import { payloadClient } from '@/lib/payload'

export type PageData = {
  title: string
  metaTitle: string | null
  metaDescription: string | null
  ogImage: { url: string; alt: string } | null
  blocks: V3BlockWithTone[]
}

/**
 * Страница из коллекции «Страницы» по адресу. Публичный сайт видит только опубликованную
 * версию; в режиме предпросмотра (draftMode) — последний черновик.
 * null — страницы нет / она не опубликована / БД недоступна: вызывающий показывает запасной вариант.
 */
export const getPage = cache(async (slug: string): Promise<PageData | null> => {
  let draft = false
  try {
    draft = (await draftMode()).isEnabled
  } catch {
    // вне запроса (сборка) — только опубликованное
  }
  try {
    const payload = await payloadClient()
    const res = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      draft,
      limit: 1,
      depth: 2,
      overrideAccess: draft,
    })
    const doc = res.docs[0] as unknown as Record<string, unknown> | undefined
    if (!doc) return null
    if (!draft && doc._status !== 'published') return null
    const blocks = await fromPayloadBlocks(doc.layout, payload)
    if (blocks.length === 0) return null
    const og = doc.ogImage as { url?: string; alt?: string } | null | undefined
    return {
      title: String(doc.title ?? ''),
      metaTitle: (doc.metaTitle as string) || null,
      metaDescription: (doc.metaDescription as string) || null,
      ogImage: og?.url ? { url: mediaPath(og.url), alt: og.alt ?? '' } : null,
      blocks,
    }
  } catch {
    return null
  }
})
