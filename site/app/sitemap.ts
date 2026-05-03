import type { MetadataRoute } from 'next'

import { payloadClient } from '@/lib/payload'
import { getAllSubLevelSdParams, getAllSubServiceParams } from '@/lib/seo/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 3600
// Sitemap зависит от runtime БД — не пытаемся её пре-генерировать на build.
// dynamic = 'force-dynamic' гарантирует исполнение на каждом запросе после
// окончания revalidate-окна (и игнорирует пустую БД во время build).
export const dynamic = 'force-dynamic'

type Entry = MetadataRoute.Sitemap[number]

/**
 * Priority pillar-страниц по wsfreq Wave 2 US-4 (sitemap-tree v0.4 ADR-uМ-14).
 * Чем выше wsfreq → тем выше priority в sitemap → тем приоритетнее crawl.
 *
 * Источник: seosite/03-clusters/_summary.json
 *   vyvoz-musora 161 781 → 1.0   (главный денежный, 74% всего wsfreq)
 *   arboristika   27 589 → 0.9
 *   chistka-krysh    888 → 0.7
 *   demontazh        225 → 0.6
 *
 * Pillar-страницы вне 4 услуг (USP, conversion):
 *   foto-smeta, raschet-stoimosti → 0.8 (low-volume но high-intent)
 */
const PILLAR_PRIORITY: Record<string, number> = {
  'vyvoz-musora': 1.0,
  arboristika: 0.9,
  'chistka-krysh': 0.7,
  // ochistka-krysh — legacy slug, в БД уже мигрирован на chistka-krysh
  // (US-5 REQ-5.3, ADR-uМ-13). Оставлен для безопасности на случай rollback.
  'ochistka-krysh': 0.7,
  demontazh: 0.6,
  'foto-smeta': 0.8,
  'raschet-stoimosti': 0.8,
}
const DEFAULT_SERVICE_PRIORITY = 0.7

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
    // US-6 wave 2A: разблокированные list-страницы трёх коллекций.
    { url: `${SITE_URL}/blog/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/b2b/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/avtory/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // Trust-страницы wave 1.
    {
      url: `${SITE_URL}/o-kompanii/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    { url: `${SITE_URL}/garantii/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    {
      url: `${SITE_URL}/kak-my-rabotaem/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Прямой Payload-вызов (без unstable_cache wrapper) — чтобы избежать
  // проблем с serialization payloadClient внутри cached scope.
  // Кеширование sitemap делает сам Next 16 через revalidate=3600.
  const [
    services,
    districts,
    serviceDistricts,
    cases,
    blogPosts,
    b2bPages,
    authors,
    subServices,
    subLevelSds,
  ] = await Promise.all([
    fetchServices(),
    fetchDistricts(),
    fetchPublishedServiceDistricts(),
    fetchCases(),
    fetchPublishedBlog(),
    fetchPublishedB2B(),
    fetchPublishedAuthors(),
    // US-6 wave 2B: sub-services с заполненным контентом (intro/body)
    getAllSubServiceParams().catch(() => [] as Array<{ service: string; sub: string }>),
    // US-3 Wave 0.1: 4-уровневые SD URLs `/<service>/<sub>/<district>/`
    getAllSubLevelSdParams().catch(
      () => [] as Array<{ service: string; sub: string; district: string }>,
    ),
  ])

  const serviceEntries: Entry[] = services.map((slug) => ({
    url: `${SITE_URL}/${slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: PILLAR_PRIORITY[slug] ?? DEFAULT_SERVICE_PRIORITY,
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

  const blogEntries: Entry[] = blogPosts
    .filter((p): p is SlugDoc & { slug: string } => typeof p.slug === 'string')
    .map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}/`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

  const b2bEntries: Entry[] = b2bPages
    .filter((p): p is SlugDoc & { slug: string } => typeof p.slug === 'string')
    .map((p) => ({
      url: `${SITE_URL}/b2b/${p.slug}/`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  const authorEntries: Entry[] = authors
    .filter((a): a is SlugDoc & { slug: string } => typeof a.slug === 'string')
    .map((a) => ({
      url: `${SITE_URL}/avtory/${a.slug}/`,
      lastModified: a.updatedAt ? new Date(a.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.4,
    }))

  // US-6 wave 2B: sub-service URLs `/<service>/<sub>/`. priority 0.85 —
  // выше programmatic district (0.7), ниже pillar (0.9-1.0). Это
  // высокочастотный длинный хвост без географического риска
  // duplicate-content.
  const subServiceEntries: Entry[] = subServices.map((s) => ({
    url: `${SITE_URL}/${s.service}/${s.sub}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // US-3 Wave 0.1: 4-уровневые SD URLs `/<service>/<sub>/<district>/`.
  // Priority 0.75 — выше programmatic district (0.7), ниже sub-service (0.85),
  // потому что комбинированный длинный хвост с гео-фокусом уже несёт
  // конкретный transactional intent.
  const subLevelSdEntries: Entry[] = subLevelSds.map((s) => ({
    url: `${SITE_URL}/${s.service}/${s.sub}/${s.district}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  return [
    ...staticEntries,
    ...serviceEntries,
    ...districtEntries,
    ...programmaticEntries,
    ...caseEntries,
    ...blogEntries,
    ...b2bEntries,
    ...authorEntries,
    ...subServiceEntries,
    ...subLevelSdEntries,
  ]
}

async function fetchServices(): Promise<string[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'services',
      // Только published — sitemap не должен включать draft слаги
      // (по запросу OBI-16 root cause #2 + nice-to-fix OBI-16).
      where: { _status: { equals: 'published' } },
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

async function fetchPublishedBlog(): Promise<SlugDoc[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'blog',
      where: { _status: { equals: 'published' } },
      limit: 1000,
      pagination: false,
      select: { slug: true, updatedAt: true },
    })
    return r.docs as unknown as SlugDoc[]
  } catch (e) {
    console.error('[sitemap] fetchPublishedBlog failed:', e)
    return []
  }
}

async function fetchPublishedB2B(): Promise<SlugDoc[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'b2b-pages',
      where: { _status: { equals: 'published' } },
      limit: 100,
      pagination: false,
      select: { slug: true, updatedAt: true },
    })
    return r.docs as unknown as SlugDoc[]
  } catch (e) {
    console.error('[sitemap] fetchPublishedB2B failed:', e)
    return []
  }
}

async function fetchPublishedAuthors(): Promise<SlugDoc[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'authors',
      where: { _status: { equals: 'published' } },
      limit: 100,
      pagination: false,
      select: { slug: true, updatedAt: true },
    })
    return r.docs as unknown as SlugDoc[]
  } catch (e) {
    console.error('[sitemap] fetchPublishedAuthors failed:', e)
    return []
  }
}
