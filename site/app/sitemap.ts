import type { MetadataRoute } from 'next'

import { payloadClient } from '@/lib/payload'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 3600
// Sitemap зависит от runtime БД — не пытаемся её пре-генерировать на build.
// dynamic = 'force-dynamic' гарантирует исполнение на каждом запросе после
// окончания revalidate-окна (и игнорирует пустую БД во время build).
export const dynamic = 'force-dynamic'

type Entry = MetadataRoute.Sitemap[number]

type SlugDoc = { slug?: string; updatedAt?: string | Date }
type SDDoc = {
  service?: { slug?: string } | string | null
  district?: { slug?: string } | string | null
  miniCase?: unknown
  noindexUntilCase?: boolean
  updatedAt?: string | Date
}

/**
 * Sitemap.xml для obikhod.ru. Генерируется на каждый запрос (dynamic),
 * но кешируется Next 16 ISR на 1 час. Инвалидируется тегом 'sitemap'
 * через ServiceDistricts.afterChange (см. revalidateTag('sitemap', 'max')).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: Entry[] = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/raiony/`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/kejsy/`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]

  // Прямой Payload-вызов (без unstable_cache wrapper) — чтобы избежать
  // проблем с serialization payloadClient внутри cached scope.
  // Кеширование sitemap делает сам Next 16 через revalidate=3600.
  const [services, districts, serviceDistricts, cases] = await Promise.all([
    fetchServices(),
    fetchDistricts(),
    fetchPublishedServiceDistricts(),
    fetchCases(),
  ])

  const serviceEntries: Entry[] = services.map((slug) => ({
    url: `${SITE_URL}/${slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const districtEntries: Entry[] = districts
    .filter((d): d is SlugDoc & { slug: string } => typeof d.slug === 'string')
    .map((d) => ({
      url: `${SITE_URL}/raiony/${d.slug}/`,
      lastModified: d.updatedAt ? new Date(d.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

  // Programmatic /<service>/<district>/ URL'ы.
  // Фильтр: publishStatus=published + noindexUntilCase !== true.
  // miniCase НЕ обязателен — индексацию контролирует только
  // noindexUntilCase, который редактор явно снимает в админке.
  // См. OBI-12.
  const programmaticEntries: Entry[] = serviceDistricts.flatMap((sd): Entry[] => {
    const serviceSlug =
      typeof sd.service === 'object' && sd.service !== null ? sd.service.slug : undefined
    const districtSlug =
      typeof sd.district === 'object' && sd.district !== null ? sd.district.slug : undefined
    if (!serviceSlug || !districtSlug) return []
    if (sd.noindexUntilCase) return []
    return [
      {
        url: `${SITE_URL}/${serviceSlug}/${districtSlug}/`,
        lastModified: sd.updatedAt ? new Date(sd.updatedAt) : undefined,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
    ]
  })

  const caseEntries: Entry[] = cases
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

async function fetchServices(): Promise<string[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'services',
      limit: 100,
      pagination: false,
      select: { slug: true },
    })
    return r.docs.map((d) => (d as { slug: string }).slug).filter(Boolean)
  } catch (e) {
    console.error('[sitemap] fetchServices failed:', e)
    return []
  }
}

async function fetchDistricts(): Promise<SlugDoc[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'districts',
      limit: 100,
      pagination: false,
      select: { slug: true, updatedAt: true },
    })
    return r.docs as unknown as SlugDoc[]
  } catch (e) {
    console.error('[sitemap] fetchDistricts failed:', e)
    return []
  }
}

async function fetchPublishedServiceDistricts(): Promise<SDDoc[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'service-districts',
      where: { publishStatus: { equals: 'published' } },
      limit: 1000,
      pagination: false,
      depth: 1,
    })
    return r.docs as unknown as SDDoc[]
  } catch (e) {
    console.error('[sitemap] fetchPublishedServiceDistricts failed:', e)
    return []
  }
}

async function fetchCases(): Promise<SlugDoc[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'cases',
      limit: 1000,
      pagination: false,
      select: { slug: true, updatedAt: true },
    })
    return r.docs as unknown as SlugDoc[]
  } catch (e) {
    console.error('[sitemap] fetchCases failed:', e)
    return []
  }
}
