import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { CALCULATOR_SLUGS, crumbsToSchema, trail } from '@/lib/breadcrumbs'
import { getContacts } from '@/lib/chrome'
import { serviceArticlesBlock, serviceGeoBlock } from '@/lib/geo-links'
import { beforeForm } from '@/lib/geo-pages'
import type { PageData } from '@/lib/pages'
import { buildJsonLdForTemplate } from '@/lib/seo/composer'
import type { Service } from '@/lib/seo/jsonld'
import { priceFromBadge } from '@/lib/seo/price'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

/**
 * Хаб направления из документа «Страницы» с адресом = slug услуги (этап 3 плана 09): крошки по карте 08,
 * блоки библиотеки v3 и разметка T2 — Service, FAQ из блока «Вопросы», BreadcrumbList.
 */
export async function PillarBlocksView({
  service,
  page,
}: {
  service: Service & { slug: string; title: string }
  page: PageData
}) {
  const leaf = { name: page.title || service.title, href: `/${service.slug}/` }
  // Лендинги смет — в карте 08 не услуги, а калькуляторы: крошки сразу от главной.
  const breadcrumbs = CALCULATOR_SLUGS.includes(service.slug)
    ? trail(null, leaf)
    : trail('uslugi', leaf)
  const [contacts, geo, articles] = await Promise.all([
    getContacts(),
    serviceGeoBlock(service.slug),
    serviceArticlesBlock((service as { id?: number }).id, page.blocks),
  ])
  const blocks = beforeForm(page.blocks, [geo, articles])
  const faqs = page.blocks.flatMap((b) =>
    b.blockType === 'faq-v3' && b.enabled !== false ? b.items : [],
  )
  // цена «от» — из первого экрана страницы (её видит посетитель), а не прежнее поле «Услуг»
  const priceFrom = priceFromBadge(page.blocks) ?? service.priceFrom
  const schema = buildJsonLdForTemplate('T2_PILLAR', {
    service: { ...service, h1: page.title || service.title, priceFrom, priceTo: priceFrom },
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
