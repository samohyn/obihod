import { cache } from 'react'

import { payloadClient } from '@/lib/payload'

/**
 * Homepage global getter — Phase 2 wiring (ADR-0017).
 *
 * Graceful degradation:
 * - Если global ещё не seed'нут (Phase 2 deploy ДО popanel/sa-panel-миграции) —
 *   возвращает null. Каждая section-компонента имеет hardcoded Phase 1 fallback.
 * - Если БД unreachable, миграция не применена — тоже null без crash.
 *
 * `react.cache` гарантирует один запрос на цикл рендера, даже если
 * несколько секций (Hero, FAQ, Reviews, Documents, Gallery) одновременно
 * читают global.
 */
export type HomepageGlobal = {
  hero?: {
    eyebrow?: string
    titleMain?: string
    titleAccent?: string
    subhead?: string
    lead?: string
    photo?: { url?: string; alt?: string } | string | number | null
    trustBullets?: Array<{ value: string; label: string }>
  }
  steps?: Array<{ title: string; sla: string; description: string }>
  pricingRows?: Array<{
    name: string
    desc: string
    priceFrom: number
    unit: string
    link: string
  }>
  photoSmeta?: {
    exampleId?: string
    exampleImage?: { url?: string; alt?: string } | string | number | null
    exampleCaption?: string
    exampleRecognized?: string
    exampleRangeMin?: number
    exampleRangeMax?: number
  }
  reviewSources?: Array<{ name: string; rating: number; reviewCount: number; isNps?: boolean }>
  reviews?: Array<{ author: string; meta: string; text: string }>
  documents?: Array<{
    title: string
    meta: string
    photo?: { url?: string; alt?: string } | string | number | null
  }>
  faq?: Array<{ question: string; answer: string }>
  gallery?: Array<{
    photo?: { url?: string; alt?: string } | string | number | null
    caption: string
    alt: string
  }>
} | null

export const getHomepage = cache(async (): Promise<HomepageGlobal> => {
  try {
    const payload = await payloadClient()
    const global = (await payload.findGlobal({
      slug: 'homepage',
    })) as unknown as HomepageGlobal
    return global
  } catch {
    // Phase 2 graceful: миграция ещё не применена / global не seed'нут / БД недоступна.
    // Каждая section имеет hardcoded Phase 1 fallback.
    return null
  }
})
