import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { crumbsToSchema, trail } from '@/lib/breadcrumbs'
import { getContacts, getSiteChrome } from '@/lib/chrome'
import type { DistrictLike, ServiceDistrictLike } from '@/lib/geo-pages'
import { buildSubServiceDistrictBlocks } from '@/lib/geo-pages'
import type { PageData } from '@/lib/pages'
import { buildJsonLdForTemplate } from '@/lib/seo/composer'
import type { District, Service } from '@/lib/seo/jsonld'
import { getLocalGeoPages } from '@/lib/seo/queries'
import { getCompany } from '@/lib/company'
import { getPageTemplates } from '@/lib/page-templates-server'

import { priceFromBadge } from '../SubServiceBlocksView'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

/**
 * «Подуслуга в районе» (/arboristika/spil-derevev/istra/) из подуслуги и района — как «услуга
 * в районе», только основа — документ «Подуслуги». Разметка T4: Service подуслуги в районе, FAQ,
 * BreadcrumbList.
 */
export async function SubServiceDistrictBlocksView({
  service,
  district,
  sd,
  subSlug,
  sub,
}: {
  service: Service & { slug: string; title: string }
  district: DistrictLike & District
  sd: ServiceDistrictLike
  subSlug: string
  sub: PageData
}) {
  const [chrome, contacts, localPages, company, templates] = await Promise.all([
    getSiteChrome(),
    getContacts(),
    getLocalGeoPages(),
    getCompany(),
    getPageTemplates(),
  ])
  const url = `/${service.slug}/${subSlug}/${district.slug}/`
  const { blocks } = buildSubServiceDistrictBlocks({
    sub,
    district,
    sd,
    localPages,
    source: `${service.slug}-${subSlug}-${district.slug}`,
    company,
    templates,
  })
  const breadcrumbs = trail(
    'uslugi',
    { name: service.title, href: `/${service.slug}/` },
    { name: sub.title, href: `/${service.slug}/${subSlug}/` },
    { name: district.nameNominative, href: url },
  )
  const faqs = blocks.flatMap((b) => (b.blockType === 'faq-v3' ? b.items : []))
  const priceFrom = priceFromBadge(sub.blocks) ?? service.priceFrom
  const schema = buildJsonLdForTemplate('T4_SD', {
    chrome,
    skipChrome: true,
    service,
    sub: {
      ...service,
      slug: subSlug,
      title: sub.title,
      h1: sub.title,
      priceFrom,
      priceTo: priceFrom,
    },
    district,
    faqs,
    breadcrumbs: crumbsToSchema(breadcrumbs, SITE_URL),
  })
  return (
    <>
      <JsonLd schema={schema} />
      <Breadcrumbs items={breadcrumbs} schema={false} />
      <V3BlockRenderer blocks={blocks} phoneDisplay={contacts.phoneDisplay} />
    </>
  )
}
