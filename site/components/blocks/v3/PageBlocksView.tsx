import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import type { Crumb } from '@/lib/breadcrumbs'
import { getContacts } from '@/lib/chrome'
import type { PageData } from '@/lib/pages'
import { faqPageSchema } from '@/lib/seo/jsonld'

/**
 * Документ «Страницы» на своём адресе: крошки по карте 08 (с BreadcrumbList), блоки библиотеки v3,
 * FAQPage из блока «Вопросы». Для разделов без своей разметки — компании, цены, «Услуги».
 */
export async function PageBlocksView({ page, crumbs }: { page: PageData; crumbs: Crumb[] }) {
  const contacts = await getContacts()
  const faqs = page.blocks.flatMap((b) =>
    b.blockType === 'faq-v3' && b.enabled !== false ? b.items : [],
  )
  return (
    <>
      {faqs.length > 0 && <JsonLd schema={faqPageSchema(faqs)} />}
      <Breadcrumbs items={crumbs} />
      <V3BlockRenderer blocks={page.blocks} phoneDisplay={contacts.phoneDisplay} />
    </>
  )
}
