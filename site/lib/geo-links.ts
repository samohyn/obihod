import type { V3BlockWithTone } from '@/components/blocks/v3/types'
import { relatedArticlesBlock } from '@/lib/blocks/v3/fromPayload'
import {
  districtItems,
  districtLinksBlock,
  nearestDistricts,
  type GeoDistrict,
} from '@/lib/geo-pages'
import { payloadClient } from '@/lib/payload'
import { getAllDistricts, getLocalGeoPages } from '@/lib/seo/queries'

/**
 * Перелинковка страниц услуг (план 09, этап 7, пробел 5 из contex/11_page_templates.md):
 * направление и подуслуга → «услуга в районе», гео и район → соседние районы, услуги → блог.
 * Ведём только на индексируемые страницы: «услуга в районе» — из getLocalGeoPages.
 */

const districts = async () => (await getAllDistricts()) as unknown as GeoDistrict[]

/** «Где работаем»: районы, где у направления есть своя страница. */
export async function serviceGeoBlock(serviceSlug: string): Promise<V3BlockWithTone | null> {
  const [all, local] = await Promise.all([districts(), getLocalGeoPages()])
  const here = all.filter((d) => local.has(`${serviceSlug}/${d.slug}`))
  return districtLinksBlock(
    'Работаем в районах',
    'Районы',
    districtItems(here, serviceSlug, local),
    'rajony',
  )
}

/** «Статьи по теме» — если на странице нет своего блока статей. */
export async function serviceArticlesBlock(
  serviceId: number | string | undefined,
  blocks: V3BlockWithTone[],
): Promise<V3BlockWithTone | null> {
  if (serviceId === undefined || blocks.some((b) => b.blockType === 'articles')) return null
  return relatedArticlesBlock(await payloadClient(), serviceId).catch(() => null)
}

/** Соседние районы: ссылки на эту же услугу там, где она есть, иначе — на страницу района. */
export async function nearbyDistricts(districtSlug: string, serviceSlug: string | null) {
  const [all, local] = await Promise.all([districts(), getLocalGeoPages()])
  return districtItems(nearestDistricts(all, districtSlug, 4), serviceSlug, local)
}
