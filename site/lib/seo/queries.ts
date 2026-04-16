import { unstable_cache } from 'next/cache'
import { payloadClient } from '@/lib/payload'

/**
 * Server-side query helpers с unstable_cache + revalidateTag.
 * Теги используются в Payload `afterChange` hooks через /api/revalidate.
 */

export const getServiceBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'services',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    })
    return r.docs[0] ?? null
  },
  ['service-by-slug'],
  { revalidate: 86400, tags: ['services'] },
)

export const getAllServiceSlugs = unstable_cache(
  async () => {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'services',
      limit: 100,
      pagination: false,
      select: { slug: true },
    })
    return r.docs.map((d: any) => d.slug as string)
  },
  ['all-service-slugs'],
  { revalidate: 3600, tags: ['services', 'sitemap'] },
)

export const getDistrictBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'districts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return r.docs[0] ?? null
  },
  ['district-by-slug'],
  { revalidate: 86400, tags: ['districts'] },
)

export const getAllDistricts = unstable_cache(
  async () => {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'districts',
      limit: 100,
      pagination: false,
      depth: 1,
      sort: 'priority',
    })
    return r.docs
  },
  ['all-districts'],
  { revalidate: 3600, tags: ['districts'] },
)

export const getServiceDistrict = unstable_cache(
  async (serviceSlug: string, districtSlug: string) => {
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
  },
  ['service-district'],
  { revalidate: 43200, tags: ['service-districts'] },
)

export const getPublishedServiceDistricts = unstable_cache(
  async () => {
    const payload = await payloadClient()
    const sd = await payload.find({
      collection: 'service-districts',
      where: { publishStatus: { equals: 'published' } },
      limit: 1000,
      pagination: false,
      depth: 1,
    })
    return sd.docs
  },
  ['published-service-districts'],
  { revalidate: 43200, tags: ['service-districts', 'sitemap'] },
)

export const getSeoSettings = unstable_cache(
  async () => {
    const payload = await payloadClient()
    return await payload.findGlobal({ slug: 'seo-settings' })
  },
  ['seo-settings'],
  { revalidate: 86400, tags: ['seo-settings'] },
)
