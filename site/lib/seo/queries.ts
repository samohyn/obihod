import { cache } from 'react'

import { payloadClient } from '@/lib/payload'

/**
 * Server-side query helpers для Payload коллекций.
 *
 * Стратегия (после OBI-16, см. PR #27 sitemap fix):
 *  - НЕ используем `unstable_cache` (в Next 16 deprecated и падает в null/[]
 *    при build, когда payloadClient инициализируется внутри cached scope).
 *  - Используем `react.cache` для per-request memoization — одна и та же
 *    функция с теми же аргументами вызывается ОДИН раз на цикл RSC-рендера
 *    (e.g. одновременно из generateMetadata и default Page).
 *  - Cross-request кеш и ISR обеспечиваются через
 *    `export const revalidate = N` на каждом роуте.
 *  - On-demand инвалидация делается через `revalidateTag(...)` /
 *    `revalidatePath(...)` в afterChange-хуках Payload (см.
 *    `collections/Services.ts`, `collections/ServiceDistricts.ts`,
 *    `collections/Districts.ts`, `globals/SiteChrome.ts`).
 *
 * Контракт Next 16: `revalidateTag` всё ещё инвалидирует Data Cache
 * (включая ISR-сегменты) — теги указываются на самом роуте через
 * `export const revalidate` + теги. Если требуется явная пометка тегом
 * — это делается на route segment, а не на этих helper-функциях.
 *
 * `cache()` важен: Header + Footer + Page часто запрашивают один и тот же
 * SiteChrome / Service в одном RSC-рендере, и `cache()` гарантирует
 * один SQL-запрос вместо трёх.
 */

export const getServiceBySlug = cache(async (slug: string) => {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'services',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    })
    return r.docs[0] ?? null
  } catch (e) {
    console.error('[queries.getServiceBySlug] failed:', e)
    return null
  }
})

export const getAllServiceSlugs = cache(async (): Promise<string[]> => {
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
    console.error('[queries.getAllServiceSlugs] failed:', e)
    return []
  }
})

export const getDistrictBySlug = cache(async (slug: string) => {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'districts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return r.docs[0] ?? null
  } catch (e) {
    console.error('[queries.getDistrictBySlug] failed:', e)
    return null
  }
})

export const getAllDistricts = cache(async () => {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'districts',
      limit: 100,
      pagination: false,
      depth: 1,
      sort: 'priority',
    })
    return r.docs
  } catch (e) {
    console.error('[queries.getAllDistricts] failed:', e)
    return []
  }
})

export const getServiceDistrict = cache(async (serviceSlug: string, districtSlug: string) => {
  try {
    const payload = await payloadClient()
    const sd = await payload.find({
      collection: 'service-districts',
      where: {
        and: [
          { 'service.slug': { equals: serviceSlug } },
          { 'district.slug': { equals: districtSlug } },
          // T4 pillar-level only: exclude sub-service triples (T3).
          // Without this, sub-level SDs (subServiceSlug != null) shadow pillar SDs
          // when both exist for the same service × district pair.
          { subServiceSlug: { exists: false } },
        ],
      },
      limit: 1,
      depth: 3,
    })
    return sd.docs[0] ?? null
  } catch (e) {
    console.error('[queries.getServiceDistrict] failed:', e)
    return null
  }
})

/**
 * US-4 EPIC-SEO-USLUGI: bundled lookup для slug-resolver.
 * Возвращает service + district + sd в одной структуре, либо null если
 * любой из трёх не найден. sd попадает в bundle только если sub_service_slug
 * пустой (это T4 SD, не sub-level триплет US-3 wave 0.1).
 */
export const getServiceDistrictBundle = cache(
  async (
    serviceSlug: string,
    districtSlug: string,
  ): Promise<{
    service: Record<string, unknown>
    district: Record<string, unknown>
    sd: Record<string, unknown>
  } | null> => {
    const sd = await getServiceDistrict(serviceSlug, districtSlug)
    if (!sd) return null
    const sdRaw = sd as unknown as {
      service?: unknown
      district?: unknown
      subServiceSlug?: string | null
    }
    // T4 = pillar × city без sub-уровня. Если subServiceSlug заполнен — это
    // sub-level триплет (US-3 wave 0.1), он рендерится через другой роут.
    if (sdRaw.subServiceSlug) return null
    const service =
      typeof sdRaw.service === 'object' && sdRaw.service !== null
        ? (sdRaw.service as Record<string, unknown>)
        : null
    const district =
      typeof sdRaw.district === 'object' && sdRaw.district !== null
        ? (sdRaw.district as Record<string, unknown>)
        : null
    if (!service || !district) return null
    return { service, district, sd: sd as unknown as Record<string, unknown> }
  },
)

/**
 * US-4 EPIC-SEO-USLUGI: все пары (service, district) для T4 generateStaticParams.
 * Только опубликованные SD без sub_service_slug — pillar × city, не triple.
 * Возвращает {service, slug} (slug = districtSlug в URL pattern [service]/[slug]/).
 */
export const getAllServiceDistrictParams = cache(
  async (): Promise<Array<{ service: string; slug: string }>> => {
    try {
      const payload = await payloadClient()
      const r = await payload.find({
        collection: 'service-districts',
        where: { publishStatus: { equals: 'published' } },
        limit: 1000,
        pagination: false,
        depth: 1,
      })
      const out: Array<{ service: string; slug: string }> = []
      for (const sd of r.docs) {
        const sdRaw = sd as unknown as {
          service?: { slug?: string } | string | null
          district?: { slug?: string } | string | null
          subServiceSlug?: string | null
        }
        if (sdRaw.subServiceSlug) continue // только pillar × city — T4
        const service =
          typeof sdRaw.service === 'object' && sdRaw.service !== null
            ? (sdRaw.service.slug ?? '')
            : ''
        const slug =
          typeof sdRaw.district === 'object' && sdRaw.district !== null
            ? (sdRaw.district.slug ?? '')
            : ''
        if (service && slug) out.push({ service, slug })
      }
      return out
    } catch (e) {
      console.error('[queries.getAllServiceDistrictParams] failed:', e)
      return []
    }
  },
)

/**
 * US-4 EPIC-SEO-USLUGI: все опубликованные Districts для city-list block
 * на T2 pillar pages. Возвращает sorted by priority (A first, then B, C).
 */
export const getAllDistrictsForCityList = cache(
  async (): Promise<
    Array<{
      slug: string
      nameNominative: string
      namePrepositional: string
      priority?: string
      distanceFromMkad?: number
    }>
  > => {
    try {
      const payload = await payloadClient()
      const r = await payload.find({
        collection: 'districts',
        limit: 100,
        pagination: false,
        depth: 0,
      })
      const docs = r.docs.map((d) => {
        const x = d as unknown as {
          slug?: string
          nameNominative?: string
          namePrepositional?: string
          priority?: string
          distanceFromMkad?: number
        }
        return {
          slug: x.slug ?? '',
          nameNominative: x.nameNominative ?? '',
          namePrepositional: x.namePrepositional ?? '',
          priority: x.priority,
          distanceFromMkad: x.distanceFromMkad,
        }
      })
      const order = { A: 0, B: 1, C: 2 } as const
      docs.sort((a, b) => {
        const pa = (order[a.priority as 'A' | 'B' | 'C'] ?? 1) as number
        const pb = (order[b.priority as 'A' | 'B' | 'C'] ?? 1) as number
        if (pa !== pb) return pa - pb
        return (a.distanceFromMkad ?? 999) - (b.distanceFromMkad ?? 999)
      })
      return docs.filter((d) => d.slug)
    } catch (e) {
      console.error('[queries.getAllDistrictsForCityList] failed:', e)
      return []
    }
  },
)

export const getPublishedServiceDistricts = cache(async () => {
  try {
    const payload = await payloadClient()
    const sd = await payload.find({
      collection: 'service-districts',
      where: { publishStatus: { equals: 'published' } },
      limit: 1000,
      pagination: false,
      depth: 1,
    })
    return sd.docs
  } catch (e) {
    console.error('[queries.getPublishedServiceDistricts] failed:', e)
    return []
  }
})

/**
 * Triple lookup для US-3 Wave 0.1 nested route `/<service>/<sub>/<district>/`.
 * Filter: service.slug + district.slug + subServiceSlug (text). Возвращает
 * single SD или null.
 */
export const getServiceSubDistrict = cache(
  async (serviceSlug: string, subSlug: string, districtSlug: string) => {
    try {
      const payload = await payloadClient()
      const sd = await payload.find({
        collection: 'service-districts',
        where: {
          and: [
            { 'service.slug': { equals: serviceSlug } },
            { 'district.slug': { equals: districtSlug } },
            { subServiceSlug: { equals: subSlug } },
          ],
        },
        limit: 1,
        depth: 3,
      })
      return sd.docs[0] ?? null
    } catch (e) {
      console.error('[queries.getServiceSubDistrict] failed:', e)
      return null
    }
  },
)

/**
 * Triple для generateStaticParams — все SD с заполненным subServiceSlug
 * и publishStatus=published, noindexUntilCase!=true.
 */
export const getAllSubLevelSdParams = cache(
  async (): Promise<Array<{ service: string; sub: string; district: string }>> => {
    try {
      const payload = await payloadClient()
      const r = await payload.find({
        collection: 'service-districts',
        where: {
          and: [{ publishStatus: { equals: 'published' } }, { subServiceSlug: { exists: true } }],
        },
        limit: 1000,
        pagination: false,
        depth: 1,
      })
      const out: Array<{ service: string; sub: string; district: string }> = []
      for (const sd of r.docs) {
        const sdRaw = sd as unknown as {
          service?: { slug?: string } | string | null
          district?: { slug?: string } | string | null
          subServiceSlug?: string | null
        }
        const service =
          typeof sdRaw.service === 'object' && sdRaw.service !== null
            ? (sdRaw.service.slug ?? '')
            : ''
        const district =
          typeof sdRaw.district === 'object' && sdRaw.district !== null
            ? (sdRaw.district.slug ?? '')
            : ''
        const sub = sdRaw.subServiceSlug ?? ''
        if (service && sub && district) out.push({ service, sub, district })
      }
      return out
    } catch (e) {
      console.error('[queries.getAllSubLevelSdParams] failed:', e)
      return []
    }
  },
)

export const getSeoSettings = cache(async () => {
  try {
    const payload = await payloadClient()
    return await payload.findGlobal({ slug: 'seo-settings' })
  } catch (e) {
    console.error('[queries.getSeoSettings] failed:', e)
    return null
  }
})

export const getAllCaseSlugs = cache(
  async (): Promise<Array<{ slug: string; updatedAt?: string }>> => {
    try {
      const payload = await payloadClient()
      const r = await payload.find({
        collection: 'cases',
        limit: 1000,
        pagination: false,
        select: { slug: true, updatedAt: true },
      })
      return r.docs.map((d) => ({
        slug: (d as { slug: string }).slug,
        updatedAt: (d as { updatedAt?: string }).updatedAt,
      }))
    } catch (e) {
      console.error('[queries.getAllCaseSlugs] failed:', e)
      return []
    }
  },
)

// ───────── Sub-services (US-6 wave 2B — /<service>/<sub>/) ─────────

export type SubServiceParam = { service: string; sub: string }

/**
 * Все опубликованные sub-services из всех Services. Используется для
 * generateStaticParams `[service]/[district]/page.tsx` и для расширения
 * sitemap.ts. Возвращает только subs с заполненным intro/body — пустые
 * заглушки не индексируются.
 */
export const getAllSubServiceParams = cache(async (): Promise<SubServiceParam[]> => {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'services',
      where: { _status: { equals: 'published' } },
      limit: 100,
      pagination: false,
      depth: 0,
    })
    const out: SubServiceParam[] = []
    for (const svc of r.docs as unknown as Array<{
      slug?: string
      subServices?: Array<{ slug?: string; intro?: string | null; body?: unknown }>
    }>) {
      const serviceSlug = svc.slug
      if (!serviceSlug) continue
      for (const sub of svc.subServices ?? []) {
        if (!sub.slug) continue
        // Только sub с реальным контентом — пустые-заглушки не публикуем
        if (!sub.intro && !sub.body) continue
        out.push({ service: serviceSlug, sub: sub.slug })
      }
    }
    return out
  } catch (e) {
    console.error('[queries.getAllSubServiceParams] failed:', e)
    return []
  }
})

/**
 * Получить sub-service внутри service по slug.
 * Возвращает null если service не найден или sub нет.
 */
export const getSubServiceBySlug = cache(async (serviceSlug: string, subSlug: string) => {
  try {
    const service = await getServiceBySlug(serviceSlug)
    if (!service) return null
    const subs = (service as { subServices?: Array<{ slug?: string }> }).subServices ?? []
    const sub = subs.find((s) => s.slug === subSlug)
    if (!sub) return null
    return { service, sub }
  } catch (e) {
    console.error('[queries.getSubServiceBySlug] failed:', e)
    return null
  }
})

// ───────── Mega-pricing (US-4 EPIC-SEO-COMPETE-3) ─────────

export type PricingPillar = {
  slug: string
  title: string
  h1: string
  intro?: string | null
  priceFrom?: number | null
  priceTo?: number | null
  priceUnit?: string | null
  faqGlobal?: Array<{ question: string; answer: unknown }> | null
  subServices: Array<{
    slug: string
    title: string
    priceFrom?: number | null
    priceTo?: number | null
    priceUnit?: string | null
    intro?: string | null
  }>
}

/**
 * Получить все 5 pillars + их subServices для mega-pricing хаба
 * `/uslugi/tseny/` (US-4). Sustained подключение к payload через cache().
 *
 * Возвращает только published Services — sustained pattern OBI-16.
 * При отсутствии БД (build runner без VPN) — пустой массив, dynamic
 * route рендерится on-demand на VPS.
 */
export const getAllPillarsForPricing = cache(async (): Promise<PricingPillar[]> => {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'services',
      where: { _status: { equals: 'published' } },
      limit: 100,
      pagination: false,
      depth: 1,
      sort: '-priceTo', // pillars с большими диапазонами выше
    })
    return r.docs.map((doc) => {
      const s = doc as unknown as {
        slug: string
        title: string
        h1?: string
        intro?: string | null
        priceFrom?: number | null
        priceTo?: number | null
        priceUnit?: string | null
        faqGlobal?: Array<{ question: string; answer: unknown }> | null
        subServices?: Array<{
          slug?: string
          title?: string
          priceFrom?: number | null
          priceTo?: number | null
          priceUnit?: string | null
          intro?: string | null
        }> | null
      }
      return {
        slug: s.slug,
        title: s.title,
        h1: s.h1 ?? s.title,
        intro: s.intro ?? null,
        priceFrom: s.priceFrom ?? null,
        priceTo: s.priceTo ?? null,
        priceUnit: s.priceUnit ?? null,
        faqGlobal: s.faqGlobal ?? null,
        subServices: (s.subServices ?? [])
          .filter((sub): sub is { slug: string; title: string } & typeof sub =>
            Boolean(sub.slug && sub.title),
          )
          .map((sub) => ({
            slug: sub.slug!,
            title: sub.title!,
            priceFrom: sub.priceFrom ?? null,
            priceTo: sub.priceTo ?? null,
            priceUnit: sub.priceUnit ?? null,
            intro: sub.intro ?? null,
          })),
      }
    })
  } catch (e) {
    console.error('[queries.getAllPillarsForPricing] failed:', e)
    return []
  }
})

// ───────── Authors (US-6 wave 2A — /avtory/) ─────────

export const getPublishedAuthors = cache(async () => {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'authors',
      where: { _status: { equals: 'published' } },
      limit: 100,
      pagination: false,
      depth: 1,
      sort: 'lastName',
    })
    return r.docs
  } catch (e) {
    console.error('[queries.getPublishedAuthors] failed:', e)
    return []
  }
})

export const getAuthorBySlug = cache(async (slug: string) => {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'authors',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 1,
    })
    return r.docs[0] ?? null
  } catch (e) {
    console.error('[queries.getAuthorBySlug] failed:', e)
    return null
  }
})

export const getAllAuthorSlugs = cache(
  async (): Promise<Array<{ slug: string; updatedAt?: string }>> => {
    try {
      const payload = await payloadClient()
      const r = await payload.find({
        collection: 'authors',
        where: { _status: { equals: 'published' } },
        limit: 1000,
        pagination: false,
        select: { slug: true, updatedAt: true },
      })
      return r.docs.map((d) => ({
        slug: (d as { slug: string }).slug,
        updatedAt: (d as { updatedAt?: string }).updatedAt,
      }))
    } catch (e) {
      console.error('[queries.getAllAuthorSlugs] failed:', e)
      return []
    }
  },
)

// ───────── Blog (US-6 wave 2A — /blog/) ─────────

export const getPublishedBlogPosts = cache(async () => {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'blog',
      where: { _status: { equals: 'published' } },
      limit: 200,
      pagination: false,
      depth: 2,
      sort: '-publishedAt',
    })
    return r.docs
  } catch (e) {
    console.error('[queries.getPublishedBlogPosts] failed:', e)
    return []
  }
})

export const getBlogPostBySlug = cache(async (slug: string) => {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'blog',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 2,
    })
    return r.docs[0] ?? null
  } catch (e) {
    console.error('[queries.getBlogPostBySlug] failed:', e)
    return null
  }
})

export const getAllBlogSlugs = cache(
  async (): Promise<Array<{ slug: string; updatedAt?: string }>> => {
    try {
      const payload = await payloadClient()
      const r = await payload.find({
        collection: 'blog',
        where: { _status: { equals: 'published' } },
        limit: 1000,
        pagination: false,
        select: { slug: true, updatedAt: true },
      })
      const out: Array<{ slug: string; updatedAt?: string }> = []
      for (const d of r.docs) {
        const slug = (d as { slug?: unknown }).slug
        if (typeof slug !== 'string' || slug.length === 0) continue
        out.push({ slug, updatedAt: (d as { updatedAt?: string }).updatedAt })
      }
      return out
    } catch (e) {
      console.error('[queries.getAllBlogSlugs] failed:', e)
      return []
    }
  },
)

// ───────── B2B pages (US-6 wave 2A — /b2b/) ─────────

export const getPublishedB2BPages = cache(async () => {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'b2b-pages',
      where: { _status: { equals: 'published' } },
      limit: 50,
      pagination: false,
      depth: 1,
      sort: 'slug',
    })
    return r.docs
  } catch (e) {
    console.error('[queries.getPublishedB2BPages] failed:', e)
    return []
  }
})

export const getB2BPageBySlug = cache(async (slug: string) => {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'b2b-pages',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 2,
    })
    return r.docs[0] ?? null
  } catch (e) {
    console.error('[queries.getB2BPageBySlug] failed:', e)
    return null
  }
})

export const getAllB2BSlugs = cache(
  async (): Promise<Array<{ slug: string; updatedAt?: string }>> => {
    try {
      const payload = await payloadClient()
      const r = await payload.find({
        collection: 'b2b-pages',
        where: { _status: { equals: 'published' } },
        limit: 1000,
        pagination: false,
        select: { slug: true, updatedAt: true },
      })
      return r.docs.map((d) => ({
        slug: (d as { slug: string }).slug,
        updatedAt: (d as { updatedAt?: string }).updatedAt,
      }))
    } catch (e) {
      console.error('[queries.getAllB2BSlugs] failed:', e)
      return []
    }
  },
)
