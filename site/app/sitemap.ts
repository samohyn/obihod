import type { MetadataRoute } from 'next'

import {
  getAllCaseSlugs,
  getAllDistricts,
  getAllServiceSlugs,
  getPublishedServiceDistricts,
} from '@/lib/seo/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 3600

type Entry = MetadataRoute.Sitemap[number]

type SlugDoc = { slug?: string; updatedAt?: string | Date }
type SDDoc = {
  service?: { slug?: string } | string | null
  district?: { slug?: string } | string | null
  miniCase?: unknown
  noindexUntilCase?: boolean
  updatedAt?: string | Date
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: Entry[] = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/raiony/`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/kejsy/`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]

  const [services, districts, serviceDistricts, cases] = await Promise.all([
    safe(getAllServiceSlugs),
    safe(getAllDistricts),
    safe(getPublishedServiceDistricts),
    safe(getAllCaseSlugs),
  ])

  const serviceEntries: Entry[] = (services as unknown as string[]).map((slug) => ({
    url: `${SITE_URL}/${slug}/`,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const districtEntries: Entry[] = (districts as unknown as SlugDoc[])
    .filter((d): d is SlugDoc & { slug: string } => typeof d.slug === 'string')
    .map((d) => ({
      url: `${SITE_URL}/raiony/${d.slug}/`,
      lastModified: d.updatedAt ? new Date(d.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

  const programmaticEntries: Entry[] = (serviceDistricts as unknown as SDDoc[]).flatMap(
    (sd): Entry[] => {
      const serviceSlug =
        typeof sd.service === 'object' && sd.service !== null ? sd.service.slug : undefined
      const districtSlug =
        typeof sd.district === 'object' && sd.district !== null ? sd.district.slug : undefined
      if (!serviceSlug || !districtSlug) return []
      if (!sd.miniCase) return []
      if (sd.noindexUntilCase) return []
      return [
        {
          url: `${SITE_URL}/${serviceSlug}/${districtSlug}/`,
          lastModified: sd.updatedAt ? new Date(sd.updatedAt) : undefined,
          changeFrequency: 'monthly',
          priority: 0.7,
        },
      ]
    },
  )

  const caseEntries: Entry[] = (cases as unknown as SlugDoc[])
    .filter((c): c is SlugDoc & { slug: string } => typeof c.slug === 'string')
    .map((c) => ({
      url: `${SITE_URL}/kejsy/${c.slug}/`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.5,
    }))

  return [
    ...staticEntries,
    ...serviceEntries,
    ...districtEntries,
    ...programmaticEntries,
    ...caseEntries,
  ]
}

async function safe<T>(fn: () => Promise<T>): Promise<T | []> {
  try {
    return await fn()
  } catch {
    // Пустая БД при build или Payload не поднят — отдаём пустой список
    // чтобы sitemap не падал целиком.
    return []
  }
}
