/**
 * Маппинг коллекция → публичный URL для preview.
 *
 * Sa-spec §6.3.
 */

import type { Payload } from 'payload'

export interface PreviewableDoc {
  id?: string | number
  slug?: string
  service?: string | { slug?: string }
  district?: string | { slug?: string }
  [key: string]: unknown
}

/**
 * Считает публичный URL документа для preview-редиректа.
 *
 * Возвращает null если URL не определён (коллекция не имеет публичного представления).
 */
export async function computePreviewUrl(
  collection: string,
  doc: PreviewableDoc,
  payload?: Payload,
): Promise<string | null> {
  switch (collection) {
    case 'services':
      // Реальный публичный route: app/(marketing)/[service]/page.tsx → `/<slug>/`.
      // Префикс `/uslugi/` устарел (до OBI-16). PANEL-DRAFT-PREVIEW-ROUTE.
      return doc.slug ? `/${doc.slug}/` : null

    case 'service-districts': {
      // Реальный route: app/(marketing)/[service]/[district]/page.tsx → `/<service>/<district>/`.
      // Может быть relation в виде ID или populated object.
      const serviceSlug = await resolveSlug(doc.service, 'services', payload)
      const districtSlug = await resolveSlug(doc.district, 'districts', payload)
      if (!serviceSlug || !districtSlug) return null
      return `/${serviceSlug}/${districtSlug}/`
    }

    case 'cases':
      return doc.slug ? `/kejsy/${doc.slug}` : null

    case 'blog':
      return doc.slug ? `/blog/${doc.slug}` : null

    case 'b2b-pages':
      return doc.slug ? `/b2b/${doc.slug}` : null

    default:
      return null
  }
}

async function resolveSlug(
  rel: unknown,
  collection: 'services' | 'districts',
  payload?: Payload,
): Promise<string | null> {
  if (!rel) return null
  if (typeof rel === 'object' && rel !== null && 'slug' in rel) {
    const slug = (rel as { slug?: unknown }).slug
    if (typeof slug === 'string') return slug
  }
  if (!payload) return null
  if (typeof rel === 'string' || typeof rel === 'number') {
    try {
      const found = await payload.findByID({ collection, id: rel })
      return typeof found?.slug === 'string' ? found.slug : null
    } catch {
      return null
    }
  }
  return null
}

/**
 * Список коллекций, для которых доступен preview-редирект.
 */
export const previewableCollections = [
  'services',
  'service-districts',
  'cases',
  'blog',
  'b2b-pages',
] as const

export type PreviewableCollection = (typeof previewableCollections)[number]

export function isPreviewableCollection(slug: string): slug is PreviewableCollection {
  return (previewableCollections as readonly string[]).includes(slug)
}
