import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { trail } from '@/lib/breadcrumbs'
import { getContacts } from '@/lib/chrome'
import { buildDistrictBlocks, localizeTiles, type DistrictLike } from '@/lib/geo-pages'
import { nearbyDistricts } from '@/lib/geo-links'
import type { PageData } from '@/lib/pages'
import { faqPageSchema } from '@/lib/seo/jsonld'
import { getAllServiceDistrictParams } from '@/lib/seo/queries'
import { getCompany } from '@/lib/company'
import { getPageTemplates } from '@/lib/page-templates-server'

/** Район (/raiony/ramenskoye/) из раздела «Услуги» и данных района — этап 3 плана 09. */
export async function DistrictBlocksView({
  district,
  uslugi,
}: {
  district: DistrictLike
  uslugi: PageData
}) {
  const [contacts, params, company, templates] = await Promise.all([
    getContacts(),
    getAllServiceDistrictParams(),
    getCompany(),
    getPageTemplates(),
  ])
  const local = new Set(params.map((p) => `${p.service}/${p.slug}`))
  const nearby = await nearbyDistricts(district.slug, null)
  const { blocks } = buildDistrictBlocks({
    nearby,
    uslugi,
    district,
    services: localizeTiles(uslugi, district.slug, local),
    company,
    templates,
  })
  const crumbs = trail('raiony', {
    name: district.nameNominative,
    href: `/raiony/${district.slug}/`,
  })
  const faqs = blocks.flatMap((b) => (b.blockType === 'faq-v3' ? b.items : []))
  return (
    <>
      {/* Organization и LocalBusiness — в макете сайта, второй LocalBusiness на район не нужен (этап 7) */}
      {faqs.length > 0 && <JsonLd schema={[faqPageSchema(faqs)]} />}
      <Breadcrumbs items={crumbs} />
      <V3BlockRenderer blocks={blocks} phoneDisplay={contacts.phoneDisplay} />
    </>
  )
}
