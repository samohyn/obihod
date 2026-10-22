import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { crumbsToSchema, trail } from '@/lib/breadcrumbs'
import { getContacts, getSiteChrome } from '@/lib/chrome'
import type { PageData } from '@/lib/pages'
import { buildJsonLdForTemplate } from '@/lib/seo/composer'
import type { Service } from '@/lib/seo/jsonld'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

/** «от 700 ₽» → 700: цена «от» для разметки Service берётся из плашки первого экрана. */
export function priceFromBadge(blocks: PageData['blocks']): number | null {
  const hero = blocks.find((b) => b.blockType === 'hero-slider')
  const value = hero && hero.blockType === 'hero-slider' ? hero.badge?.value : null
  const digits = value?.replace(/[^\d]/g, '')
  return digits ? Number(digits) : null
}

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
  const [chrome, contacts] = await Promise.all([getSiteChrome(), getContacts()])
  const faqs = page.blocks.flatMap((b) =>
    b.blockType === 'faq-v3' && b.enabled !== false ? b.items : [],
  )
  const priceFrom = priceFromBadge(page.blocks) ?? service.priceFrom
  const schema = buildJsonLdForTemplate('T3_SUB', {
    chrome,
    skipChrome: true,
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
      <V3BlockRenderer blocks={page.blocks} phoneDisplay={contacts.phoneDisplay} />
    </>
  )
}
