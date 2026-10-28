import { cache } from 'react'
import type { Where } from 'payload'

import { payloadClient } from '@/lib/payload'
import { isDraftPreview } from '@/lib/preview'
import { getCompany } from '@/lib/company'

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
    // Черновик района на сайте не виден; в предпросмотре — последняя версия
    const draft = await isDraftPreview()
    const r = await payload.find({
      collection: 'districts',
      where: draft
        ? { slug: { equals: slug } }
        : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      draft,
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
      where: { _status: { equals: 'published' } },
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

/**
 * Запись «Услуга × район» для страницы сайта. Черновик, который ещё не публиковали, сайт показывает
 * (с noindex) в последней правке из админки: Payload пишет правки черновика только в «Версии», а
 * основная строка остаётся такой, какой запись создали.
 */
async function findServiceDistrict(where: Where) {
  const payload = await payloadClient()
  const draft = await isDraftPreview()
  const r = await payload.find({
    collection: 'service-districts',
    where,
    draft,
    limit: 1,
    depth: 3,
  })
  const doc = r.docs[0]
  if (!doc || draft || doc._status !== 'draft') return doc ?? null
  const latest = await payload.find({
    collection: 'service-districts',
    where: { id: { equals: doc.id } },
    draft: true,
    limit: 1,
    depth: 3,
  })
  return latest.docs[0] ?? doc
}

export const getServiceDistrict = cache(async (serviceSlug: string, districtSlug: string) => {
  try {
    return await findServiceDistrict({
      and: [
        { 'service.slug': { equals: serviceSlug } },
        { 'district.slug': { equals: districtSlug } },
        // T4 pillar-level only: exclude sub-service triples (T3).
        // Without this, sub-level SDs (subServiceSlug != null) shadow pillar SDs
        // when both exist for the same service × district pair.
        { subServiceSlug: { exists: false } },
      ],
    })
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
 * «Подуслуга в районе» — /<направление>/<подуслуга>/<район>/: запись «Услуга × район» с этой
 * подуслугой и её направление и район. null — записи нет.
 */
export const getSubServiceDistrictBundle = cache(
  async (
    serviceSlug: string,
    subSlug: string,
    districtSlug: string,
  ): Promise<{
    service: Record<string, unknown>
    district: Record<string, unknown>
    sd: Record<string, unknown>
  } | null> => {
    const sd = (await findServiceDistrict({
      and: [
        { 'service.slug': { equals: serviceSlug } },
        { 'district.slug': { equals: districtSlug } },
        { subServiceSlug: { equals: subSlug } },
      ],
    })) as unknown as Record<string, unknown> | null
    const service = sd?.service
    const district = sd?.district
    if (!sd || typeof service !== 'object' || !service) return null
    if (typeof district !== 'object' || !district) return null
    return {
      service: service as Record<string, unknown>,
      district: district as Record<string, unknown>,
      sd,
    }
  },
)

type IndexableServiceDistrict = {
  service: string
  district: string
  sub: string | null
  updatedAt: string | null
}

/**
 * Индексируемые записи «Услуга × район» — тот же предикат, что robots у страницы
 * (isServiceDistrictIndexable: published и noindexUntilCase снят).
 */
const getIndexableServiceDistricts = cache(async (): Promise<IndexableServiceDistrict[]> => {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'service-districts',
      where: {
        and: [
          { publishStatus: { equals: 'published' } },
          { noindexUntilCase: { not_equals: true } },
        ],
      },
      limit: 1000,
      pagination: false,
      depth: 1,
    })
    const out: IndexableServiceDistrict[] = []
    for (const sd of r.docs) {
      const sdRaw = sd as unknown as {
        service?: { slug?: string } | string | null
        district?: { slug?: string } | string | null
        subServiceSlug?: string | null
        updatedAt?: string | null
      }
      const service =
        typeof sdRaw.service === 'object' && sdRaw.service !== null
          ? (sdRaw.service.slug ?? '')
          : ''
      const district =
        typeof sdRaw.district === 'object' && sdRaw.district !== null
          ? (sdRaw.district.slug ?? '')
          : ''
      if (service && district)
        out.push({
          service,
          district,
          sub: sdRaw.subServiceSlug || null,
          updatedAt: sdRaw.updatedAt ?? null,
        })
    }
    return out
  } catch (e) {
    console.error('[queries.getIndexableServiceDistricts] failed:', e)
    return []
  }
})

/**
 * «Услуга в районе» (направление × район, без подуслуги) для generateStaticParams и sitemap.
 * Возвращает {service, slug} (slug = districtSlug в URL pattern [service]/[slug]/).
 */
export const getAllServiceDistrictParams = cache(
  async (): Promise<Array<{ service: string; slug: string }>> =>
    (await getIndexableServiceDistricts())
      .filter((p) => !p.sub)
      .map((p) => ({ service: p.service, slug: p.district })),
)

export type SubServiceDistrictParam = { service: string; sub: string; district: string }

/**
 * «Подуслуга в районе» для generateStaticParams и sitemap: индексируемая запись с подуслугой,
 * у которой опубликована сама подуслуга (иначе страница — 404).
 */
export const getAllSubServiceDistrictParams = cache(
  async (): Promise<SubServiceDistrictParam[]> => {
    const [sds, subs] = await Promise.all([
      getIndexableServiceDistricts(),
      getAllSubServiceParams(),
    ])
    const published = new Set(subs.map((s) => `${s.service}/${s.sub}`))
    return sds.flatMap((p) =>
      p.sub && published.has(`${p.service}/${p.sub}`)
        ? [{ service: p.service, sub: p.sub, district: p.district }]
        : [],
    )
  },
)

/**
 * Гео-страницы для sitemap: адрес без слэшей, адрес родителя (направление или подуслуга — большая
 * часть текста гео-страницы из него) и дата изменения записи. Тот же отбор, что у страниц выше.
 */
export const getGeoSitemapEntries = cache(
  async (): Promise<Array<{ path: string; parent: string; updatedAt: string | null }>> => {
    const [sds, subs] = await Promise.all([
      getIndexableServiceDistricts(),
      getAllSubServiceParams(),
    ])
    const published = new Set(subs.map((s) => `${s.service}/${s.sub}`))
    return sds.flatMap((p) => {
      if (!p.sub)
        return [{ path: `${p.service}/${p.district}`, parent: p.service, updatedAt: p.updatedAt }]
      const parent = `${p.service}/${p.sub}`
      return published.has(parent)
        ? [{ path: `${parent}/${p.district}`, parent, updatedAt: p.updatedAt }]
        : []
    })
  },
)

/** Адреса местных страниц для ссылок: «направление/район» и «направление/подуслуга/район». */
export const getLocalGeoPages = cache(async (): Promise<Set<string>> => {
  const [sds, subs] = await Promise.all([
    getAllServiceDistrictParams(),
    getAllSubServiceDistrictParams(),
  ])
  return new Set([
    ...sds.map((p) => `${p.service}/${p.slug}`),
    ...subs.map((p) => `${p.service}/${p.sub}/${p.district}`),
  ])
})

export const getSeoSettings = cache(async () => {
  try {
    const payload = await payloadClient()
    const [seo, company] = await Promise.all([
      payload.findGlobal({ slug: 'seo-settings' }),
      getCompany(),
    ])
    // Часы работы — из «Компания и контакты» (план 09, этап 4.3), а не из SEO-настроек.
    return {
      ...seo,
      localBusiness: {
        ...seo.localBusiness,
        openingHours: { opens: company.opens, closes: company.closes },
      },
    }
  } catch (e) {
    console.error('[queries.getSeoSettings] failed:', e)
    return null
  }
})

// ───────── Sub-services (US-6 wave 2B — /<service>/<sub>/) ─────────

export type SubServiceParam = { service: string; sub: string }

/**
 * Опубликованные «Подуслуги» — адреса /<направление>/<подуслуга>/ для sitemap и карты сайта.
 * Сортировка — по порядку создания (как в разделе направления).
 */
export const getAllSubServiceParams = cache(async (): Promise<SubServiceParam[]> => {
  const docs = await getPublishedSubServices()
  return docs.map((d) => ({ service: d.service, sub: d.slug }))
})

export type PublishedSubService = {
  service: string
  slug: string
  title: string
  metaDescription: string | null
  updatedAt: string | null
}

/** Опубликованные «Подуслуги» с направлением — для карты сайта и llms-full.txt. */
export const getPublishedSubServices = cache(async (): Promise<PublishedSubService[]> => {
  const payload = await payloadClient()
  const r = await payload.find({
    collection: 'sub-services',
    where: { _status: { equals: 'published' } },
    limit: 500,
    pagination: false,
    depth: 1,
    sort: 'createdAt',
    select: { slug: true, title: true, metaDescription: true, service: true, updatedAt: true },
  })
  return (
    r.docs as unknown as {
      slug?: string
      title?: string
      metaDescription?: string | null
      service?: { slug?: string } | null
      updatedAt?: string | null
    }[]
  )
    .filter((d) => d.slug && d.title && d.service?.slug)
    .map((d) => ({
      service: String(d.service!.slug),
      slug: String(d.slug),
      title: String(d.title),
      metaDescription: d.metaDescription ?? null,
      updatedAt: d.updatedAt ?? null,
    }))
})

// ───────── Mega-pricing (US-4 EPIC-SEO-COMPETE-3) ─────────

export type PricingPillar = { slug: string; title: string }

/** Опубликованные направления (адрес и название) — для прайсов /uslugi/tseny/. */
export const getAllPillarsForPricing = cache(async (): Promise<PricingPillar[]> => {
  const payload = await payloadClient()
  const r = await payload.find({
    collection: 'services',
    where: { _status: { equals: 'published' } },
    limit: 100,
    pagination: false,
    depth: 0,
    select: { slug: true, title: true },
  })
  return (r.docs as unknown as PricingPillar[]).filter((s) => s.slug && s.title)
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
    const draft = await isDraftPreview()
    const r = await payload.find({
      collection: 'authors',
      where: draft
        ? { slug: { equals: slug } }
        : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      draft,
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
    const draft = await isDraftPreview()
    const r = await payload.find({
      collection: 'blog',
      where: draft
        ? { slug: { equals: slug } }
        : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      draft,
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

// ───────── Страницы для бизнеса (/b2b/…) ─────────

/**
 * Опубликованные «Страницы» раздела /b2b/: slug — часть адреса после «b2b/» (как было у коллекции
 * «B2B-страницы»), title и h1 — название документа. Для llms.txt и llms-full.txt.
 */
export const getPublishedB2BPages = cache(async () => {
  const payload = await payloadClient()
  const r = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { like: 'b2b/' } }, { _status: { equals: 'published' } }] },
    limit: 100,
    pagination: false,
    depth: 0,
    sort: 'slug',
    select: { slug: true, title: true, metaDescription: true, updatedAt: true },
  })
  return (
    r.docs as unknown as {
      slug?: string
      title?: string
      metaDescription?: string
      updatedAt?: string
    }[]
  )
    .filter((d) => d.slug?.startsWith('b2b/'))
    .map((d) => ({
      slug: d.slug!.slice('b2b/'.length),
      title: d.title,
      h1: d.title,
      metaDescription: d.metaDescription ?? undefined,
      updatedAt: d.updatedAt,
    }))
})
