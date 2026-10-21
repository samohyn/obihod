import { draftMode } from 'next/headers'
import { cache } from 'react'

import type {
  BlockImage,
  HeroSliderBlock,
  PriceTabsBlock,
  V3BlockWithTone,
} from '@/components/blocks/v3/types'
import { fromPayloadBlocks, mediaPath, toImage } from '@/lib/blocks/v3/fromPayload'
import { richToText } from '@/lib/geo-pages'
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
export const getPage = cache(
  async (slug: string): Promise<PageData | null> =>
    loadBlocksDoc('pages', { slug: { equals: slug } }),
)

/**
 * Подуслуга из коллекции «Подуслуги» по адресу /направление/подуслуга/ — те же правила, что у getPage.
 * null — документа нет или он не опубликован: страница показывает прежнюю версию.
 */
export const getSubServicePage = cache(
  async (serviceSlug: string, slug: string): Promise<PageData | null> => {
    try {
      const payload = await payloadClient()
      const service = await payload.find({
        collection: 'services',
        where: { slug: { equals: serviceSlug } },
        limit: 1,
        depth: 0,
      })
      const serviceId = service.docs[0]?.id
      if (!serviceId) return null
      return await loadBlocksDoc('sub-services', {
        and: [{ slug: { equals: slug } }, { service: { equals: serviceId } }],
      })
    } catch {
      return null
    }
  },
)

async function loadBlocksDoc(
  collection: 'pages' | 'sub-services',
  where: Record<string, unknown>,
): Promise<PageData | null> {
  let draft = false
  try {
    draft = (await draftMode()).isEnabled
  } catch {
    // вне запроса (сборка) — только опубликованное
  }
  try {
    const payload = await payloadClient()
    const res = await payload.find({
      collection,
      where: where as never,
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
}

/**
 * Цены направления для /uslugi/tseny/<направление>/: блок «Цены» каждой опубликованной подуслуги —
 * заголовок = название подуслуги, ссылка — на неё. Правите цену в подуслуге — меняется и здесь.
 */
export const getPillarPriceBlocks = cache(
  async (serviceSlug: string): Promise<V3BlockWithTone[]> => {
    try {
      const payload = await payloadClient()
      const service = await payload.find({
        collection: 'services',
        where: { slug: { equals: serviceSlug } },
        limit: 1,
        depth: 0,
      })
      const serviceId = service.docs[0]?.id
      if (!serviceId) return []
      const res = await payload.find({
        collection: 'sub-services',
        where: { and: [{ service: { equals: serviceId } }, { _status: { equals: 'published' } }] },
        sort: 'createdAt',
        limit: 50,
        depth: 1,
      })
      const out: V3BlockWithTone[] = []
      for (const doc of res.docs as unknown as Record<string, unknown>[]) {
        const blocks = await fromPayloadBlocks(doc.layout, payload)
        const prices = blocks.find((b) => b.blockType === 'price-tabs') as
          | PriceTabsBlock
          | undefined
        if (!prices || !prices.tabs?.length) continue
        out.push({
          ...prices,
          anchor: String(doc.slug),
          eyebrow: 'Цены',
          title: String(doc.title),
          link: { label: 'Подробнее об услуге', href: `/${serviceSlug}/${doc.slug}/` },
        } as V3BlockWithTone)
      }
      return out
    } catch {
      return []
    }
  },
)

/**
 * Сводный прайс направления для /uslugi/tseny/: блок «Цены» опубликованного хаба (документ «Страницы»
 * с адресом направления), ссылка — на подробный прайс направления.
 */
export const getPillarSummaryBlock = cache(
  async (serviceSlug: string, title: string): Promise<V3BlockWithTone | null> => {
    const page = await getPage(serviceSlug)
    const prices = page?.blocks.find((b) => b.blockType === 'price-tabs') as
      | PriceTabsBlock
      | undefined
    if (!prices || !prices.tabs?.length) return null
    return {
      ...prices,
      anchor: serviceSlug,
      eyebrow: 'Цены',
      title,
      link: { label: 'Подробный прайс', href: `/uslugi/tseny/${serviceSlug}/` },
    } as V3BlockWithTone
  },
)

/**
 * Кейсы списком (/kejsy/, /b2b/kejsy/) из коллекции «Кейсы»: картинка — фото «после», иначе первый экран
 * хаба направления. `match` — отбор по названию (кейсы для организаций).
 */
export const getCasesListBlock = cache(async (match?: RegExp): Promise<V3BlockWithTone | null> => {
  try {
    const payload = await payloadClient()
    const res = await payload.find({
      collection: 'cases',
      limit: 100,
      sort: '-dateCompleted',
      depth: 2,
    })
    const docs = (res.docs as unknown as Record<string, unknown>[]).filter(
      (c) => c.slug && (!match || match.test(String(c.title))),
    )
    if (docs.length === 0) return null
    const items = await Promise.all(
      docs.map(async (c) => {
        const service = c.service as { slug?: string; title?: string } | null
        const district = c.district as { nameNominative?: string } | null
        const text = richToText(c.description)
        let image: BlockImage | null = toImage(
          (c.photosAfter as { image?: unknown }[] | undefined)?.[0]?.image,
        )
        if (!image && service?.slug) {
          const pillar = await getPage(service.slug)
          const hero = pillar?.blocks.find((b) => b.blockType === 'hero-slider') as
            | HeroSliderBlock
            | undefined
          image = hero?.slides?.[0]?.image ?? null
        }
        return {
          kicker: [service?.title, district?.nameNominative].filter(Boolean).join(' · '),
          title: String(c.title),
          text: text.length > 150 ? `${text.slice(0, 147).trimEnd()}…` : text,
          href: `/kejsy/${c.slug}/`,
          image: image as BlockImage,
        }
      }),
    )
    return { blockType: 'articles', anchor: 'kejsy', eyebrow: 'Объекты', title: 'Кейсы', items }
  } catch {
    return null
  }
})
