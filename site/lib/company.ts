import { cache } from 'react'

import { payloadClient } from '@/lib/payload'
import { DEFAULT_COMPANY, type Company } from '@/lib/offer'

export * from '@/lib/offer'

/**
 * «Компания и контакты» из админки (globals/Company.ts); пустые поля и сбой базы —
 * значения по умолчанию из lib/offer.ts.
 */
export const getCompany = cache(async (): Promise<Company> => {
  try {
    const payload = await payloadClient()
    const doc = (await payload.findGlobal({ slug: 'company', depth: 0 })) as Partial<
      Record<keyof Company, unknown>
    >
    const merged = { ...DEFAULT_COMPANY }
    for (const key of Object.keys(DEFAULT_COMPANY) as (keyof Company)[]) {
      const v = doc?.[key]
      if (v !== null && v !== undefined && v !== '') (merged as Record<string, unknown>)[key] = v
    }
    return merged
  } catch {
    return DEFAULT_COMPANY
  }
})
