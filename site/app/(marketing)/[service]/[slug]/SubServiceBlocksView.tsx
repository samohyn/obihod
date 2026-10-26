import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { crumbsToSchema, trail } from '@/lib/breadcrumbs'
import { getContacts } from '@/lib/chrome'
import { serviceArticlesBlock, serviceGeoBlock } from '@/lib/geo-links'
import { beforeForm } from '@/lib/geo-pages'
import type { PageData } from '@/lib/pages'
import { priceFromBadge } from '@/lib/seo/price'
import { buildJsonLdForTemplate } from '@/lib/seo/composer'
import type { Service } from '@/lib/seo/jsonld'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

/**
 * Подуслуга из коллекции «Подуслуги» (этап 3 плана 09, эталон — «Спил деревьев»): крошки по карте 08,
 * блоки библиотеки v3 и разметка T3 — Service, FAQ из блока «Вопросы», BreadcrumbList.
 */
export async function SubServiceBlocksView({
  service,
  slug,
  page,
}: {
  service: Service & { slug: string; title: string; priceFrom: number; priceUnit: string }
  slug: string
  page: PageData
}) {
  const url = `/${service.slug}/${slug}/`
  const breadcrumbs = trail(
    'uslugi',
    { name: service.title, href: `/${service.slug}/` },
    { name: page.title, href: url },
  )
  const [contacts, geo, articles] = await Promise.all([
    getContacts(),
    serviceGeoBlock(service.slug),
    serviceArticlesBlock((service as { id?: number }).id, page.blocks),
  ])
  const blocks = beforeForm(page.blocks, [geo, articles])
  const faqs = page.blocks.flatMap((b) =>
    b.blockType === 'faq-v3' && b.enabled !== false ? b.items : [],
  )
  const priceFrom = priceFromBadge(page.blocks) ?? service.priceFrom
  const schema = buildJsonLdForTemplate('T3_SUB', {
    service,
    sub: {
      slug,
      title: page.title,
      h1: page.title,
      priceFrom,
      priceTo: priceFrom,
      priceUnit: service.priceUnit,
    },
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
