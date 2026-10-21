import { cache } from 'react'

import { getCompany } from '@/lib/company'
import { fillOfferDeep } from '@/lib/offer'
import { DEFAULT_TEMPLATES, type PageTemplates } from '@/lib/page-templates'
import { payloadClient } from '@/lib/payload'

/**
 * «Шаблоны страниц» из админки; пустые поля и сбой базы — значения по умолчанию.
 * Метки оффера ({перезвон}…) подставлены, подстановки района ({в районе}…) — нет: их ставит
 * страница через fillTemplate.
 */
export const getPageTemplates = cache(async (): Promise<PageTemplates> => {
  const merged = { ...DEFAULT_TEMPLATES }
  try {
    const payload = await payloadClient()
    const doc = (await payload.findGlobal({
      slug: 'page-templates',
      depth: 0,
      context: { rawOffer: true },
    })) as Partial<Record<keyof PageTemplates, unknown>>
    for (const key of Object.keys(merged) as (keyof PageTemplates)[]) {
      const v = doc?.[key]
      if (typeof v === 'string' && v.trim()) merged[key] = v
    }
  } catch {
    // значения по умолчанию
  }
  return fillOfferDeep(merged, await getCompany())
})
