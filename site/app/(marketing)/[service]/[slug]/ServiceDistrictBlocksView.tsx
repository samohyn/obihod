import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { crumbsToSchema, trail } from '@/lib/breadcrumbs'
import { getContacts } from '@/lib/chrome'
import type { DistrictLike, ServiceDistrictLike } from '@/lib/geo-pages'
import { buildServiceDistrictBlocks, localizeTiles } from '@/lib/geo-pages'
import { getPage, type PageData } from '@/lib/pages'
import { buildJsonLdForTemplate } from '@/lib/seo/composer'
import type { District, Service } from '@/lib/seo/jsonld'
import { getLocalGeoPages } from '@/lib/seo/queries'
import { getCompany } from '@/lib/company'
import { getPageTemplates } from '@/lib/page-templates-server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

/**
 * «Услуга в районе» (/arboristika/ramenskoye/) из хаба направления и района — этап 3 плана 09.
 * Разметка T4: Service, FAQ, BreadcrumbList.
 */
export async function ServiceDistrictBlocksView({
  service,
  district,
  sd,
  pillar,
}: {
  service: Service & { slug: string; title: string }
  district: DistrictLike & District
  sd: ServiceDistrictLike
  pillar: PageData
}) {
  const [contacts, uslugi, local, company, templates] = await Promise.all([
    getContacts(),
    getPage('uslugi'),
    getLocalGeoPages(),
    getCompany(),
    getPageTemplates(),
  ])
  const { blocks } = buildServiceDistrictBlocks({
    pillar,
    district,
    sd,
    otherServices: localizeTiles(uslugi, district.slug, local, service.slug),
    localPages: local,
    source: `${service.slug}-${district.slug}`,
    company,
    templates,
  })
  const breadcrumbs = trail(
    'uslugi',
    { name: pillar.title || service.title, href: `/${service.slug}/` },
    { name: district.nameNominative, href: `/${service.slug}/${district.slug}/` },
  )
  const faqs = blocks.flatMap((b) => (b.blockType === 'faq-v3' ? b.items : []))
  const schema = buildJsonLdForTemplate('T4_SD', {
    service,
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
