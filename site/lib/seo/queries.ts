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
      return r.docs.map((d) => ({
        slug: (d as { slug: string }).slug,
        updatedAt: (d as { updatedAt?: string }).updatedAt,
      }))
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
