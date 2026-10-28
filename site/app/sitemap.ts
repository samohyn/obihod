import type { MetadataRoute } from 'next'

import { payloadClient } from '@/lib/payload'
import {
  getGeoSitemapEntries,
  getPublishedB2BPages,
  getPublishedSubServices,
  type PublishedSubService,
} from '@/lib/seo/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 3600
// Sitemap зависит от runtime БД — не пытаемся её пре-генерировать на build.
// dynamic = 'force-dynamic' гарантирует исполнение на каждом запросе после
// окончания revalidate-окна (и игнорирует пустую БД во время build).
export const dynamic = 'force-dynamic'

type Entry = MetadataRoute.Sitemap[number]

/**
 * Priority pillar-страниц по wsfreq Wave 2 US-4 (sitemap-tree v0.4 ADR-uМ-14)
 * + EPIC-SEO-COMPETE-3 ADR-0018 (новый pillar uborka-territorii).
 *
 * Чем выше wsfreq → тем выше priority в sitemap → тем приоритетнее crawl.
 *
 * Источник: seosite/03-clusters/_summary.json + US-1 TF-IDF cluster baseline
 *   vyvoz-musora       161 781 → 1.0   (главный денежный, 74% всего wsfreq)
 *   arboristika         27 589 → 0.9
 *   uborka-territorii  ~22 000 → 0.85  (US-1 cluster wsk: C12+C43+C15+C6 ≈ 1979 + extrapolation)
 *   chistka-krysh          888 → 0.7
 *   demontazh              225 → 0.6
 *
 * Pillar-страницы вне 5 услуг (USP, conversion):
 *   foto-smeta, raschet-stoimosti → 0.8 (low-volume но high-intent)
 */
const PILLAR_PRIORITY: Record<string, number> = {
  'vyvoz-musora': 1.0,
  arboristika: 0.9,
  'uborka-territorii': 0.85,
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

/**
 * Sitemap.xml для obikhod.ru. Генерируется на каждый запрос (dynamic),
 * но кешируется Next 16 ISR на 1 час. Инвалидируется тегом 'sitemap'
 * через ServiceDistricts.afterChange (см. revalidateTag('sitemap', 'max')).
 *
 * lastmod — настоящая дата изменения документа (SEO-аудит 28.10.2026: было «сейчас» у ~300 адресов,
 * и при каждой сборке sitemap сообщал роботам, что изменилось всё). Страницы из «Страниц» — по их
 * документу; гео-страница — по более поздней из дат: своя запись или родитель (из него большая часть
 * её текста). Нет документа — без lastmod.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, districts, cases, blogPosts, b2bPages, authors, subServices, geo, pageDates] =
    await Promise.all([
      fetchServices(),
      fetchDistricts(),
      fetchCases(),
      fetchPublishedBlog(),
      fetchPublishedB2B(),
      fetchPublishedAuthors(),
      getPublishedSubServices().catch(() => [] as PublishedSubService[]),
      getGeoSitemapEntries().catch(() => [] as GeoEntry[]),
      fetchPageDates(),
    ])

  /** Дата документа «Страниц» по адресу без слэшей ('' — главная). */
  const pageDate = (path: string) => pageDates.get(path || 'home')
  const subDates = new Map(subServices.map((s) => [`${s.service}/${s.slug}`, toDate(s.updatedAt)]))
  const page = (
    path: string,
    changeFrequency: Entry['changeFrequency'],
    priority: number,
  ): Entry => ({
    url: `${SITE_URL}/${path ? `${path}/` : ''}`,
    lastModified: pageDate(path),
    changeFrequency,
    priority,
  })

  const staticEntries: Entry[] = [
    page('', 'daily', 1.0),
    page('uslugi', 'weekly', 0.9),
    page('raiony', 'weekly', 0.7),
    page('kejsy', 'weekly', 0.7),
    // US-6 wave 2A: разблокированные list-страницы трёх коллекций.
    page('blog', 'weekly', 0.8),
    page('b2b', 'weekly', 0.8),
    page('avtory', 'monthly', 0.5),
    // Trust-страницы wave 1.
    page('o-kompanii', 'monthly', 0.6),
    page('garantii', 'monthly', 0.6),
    page('kak-my-rabotaem', 'monthly', 0.6),
  ]

  // Индексируемые страницы, которых в sitemap не было (аудит 28.10): только если документ опубликован.
  const trustEntries: Entry[] = [
    ['komanda', 0.5],
    ['sro-licenzii', 0.5],
    ['park-tehniki', 0.5],
    ['politika-konfidentsialnosti', 0.2],
    ['soglasie-na-obrabotku-personalnyh-dannyh', 0.2],
  ]
    .filter(([slug]) => pageDate(slug as string))
    .map(([slug, priority]) => page(slug as string, 'yearly', priority as number))
  // Карта сайта собирается кодом, документа у неё нет
  const htmlSitemapEntry: Entry = {
    url: `${SITE_URL}/karta-sajta/`,
    changeFrequency: 'weekly',
    priority: 0.3,
  }

  const serviceEntries: Entry[] = services.map((slug) =>
    page(slug, 'weekly', PILLAR_PRIORITY[slug] ?? DEFAULT_SERVICE_PRIORITY),
  )

  const districtEntries: Entry[] = districts
    .filter((d): d is SlugDoc & { slug: string } => typeof d.slug === 'string')
    .map((d) => ({
      url: `${SITE_URL}/raiony/${d.slug}/`,
      lastModified: d.updatedAt ? new Date(d.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

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

  const subServiceEntries: Entry[] = subServices.map((s) => ({
    url: `${SITE_URL}/${s.service}/${s.slug}/`,
    lastModified: subDates.get(`${s.service}/${s.slug}`),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Услуга в районе (/{service}/{district}/, priority 0.75 — выше /raiony/, ниже направления) и
  // подуслуга в районе (/{service}/{sub}/{district}/, 0.7); правило индексации — у записи.
  const geoEntries: Entry[] = geo.map((g) => ({
    url: `${SITE_URL}/${g.path}/`,
    lastModified: latest(toDate(g.updatedAt), pageDate(g.parent) ?? subDates.get(g.parent)),
    changeFrequency: 'weekly' as const,
    priority: g.path.split('/').length === 2 ? 0.75 : 0.7,
  }))

  // EPIC-SEO-COMPETE-3 US-4 — mega-pricing хаб /uslugi/tseny/ + per-pillar.
  // Priority 0.8 per ADR-0018 (justified pricing-intent против pillar lead-intent).
  const pricingHubEntries: Entry[] = [
    page('uslugi/tseny', 'weekly', 0.8),
    ...services.map((slug) => page(`uslugi/tseny/${slug}`, 'weekly', 0.8)),
  ]

  // EPIC-SEO-COMPETE-3 US-8 — lead-инфраструктура (NAP + USP).
  // Priority 0.6: статичные страницы, не основной трафик-канал, но важны
  // для конверсии (cross-link target из всех pillar/sub/blog/B2B).
  const leadInfraEntries: Entry[] = [
    page('kontakty', 'yearly', 0.6),
    page('kalkulyator/foto-smeta', 'yearly', 0.6),
  ]

  // EPIC-SEO-COMPETE-3 US-9 — отзывы. Priority 0.6 weekly: trust-сигнал.
  const otzyvyEntry: Entry = page('otzyvy', 'weekly', 0.6)

  return [
    ...staticEntries,
    ...serviceEntries,
    ...districtEntries,
    ...caseEntries,
    ...blogEntries,
    ...b2bEntries,
    ...authorEntries,
    ...subServiceEntries,
    ...geoEntries,
    ...pricingHubEntries,
    ...leadInfraEntries,
    otzyvyEntry,
    ...trustEntries,
    htmlSitemapEntry,
  ]
}

type GeoEntry = { path: string; parent: string; updatedAt: string | null }

const toDate = (v: string | Date | null | undefined) => (v ? new Date(v) : undefined)

/** Более поздняя из дат (undefined — пропуск). */
function latest(...dates: (Date | undefined)[]): Date | undefined {
  const ds = dates.filter((d): d is Date => Boolean(d) && !Number.isNaN(d!.getTime()))
  return ds.length ? new Date(Math.max(...ds.map((d) => d.getTime()))) : undefined
}

/** Даты опубликованных документов «Страниц»: адрес (slug) → дата изменения. */
async function fetchPageDates(): Promise<Map<string, Date>> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 1000,
      pagination: false,
      select: { slug: true, updatedAt: true },
    })
    return new Map(
      (r.docs as unknown as SlugDoc[])
        .filter((d) => d.slug && d.updatedAt)
        .map((d) => [String(d.slug), new Date(d.updatedAt!)]),
    )
  } catch (e) {
    console.error('[sitemap] fetchPageDates failed:', e)
    return new Map()
  }
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
      where: { _status: { equals: 'published' } },
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

async function fetchCases(): Promise<SlugDoc[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'cases',
      where: { _status: { equals: 'published' } },
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

/** Страницы для бизнеса — «Страницы» b2b/… (адрес после «b2b/»). */
async function fetchPublishedB2B(): Promise<SlugDoc[]> {
  try {
    return (await getPublishedB2BPages()) as SlugDoc[]
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
