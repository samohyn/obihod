import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { trail } from '@/lib/breadcrumbs'
import { getAllDistricts } from '@/lib/seo/queries'
import { DistrictGrid } from '@/components/blocks/v3/DistrictGrid'
import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { retone } from '@/lib/blocks/v3/retone'
import { getContacts } from '@/lib/chrome'
import { faqPageSchema } from '@/lib/seo/jsonld'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { getPage } from '@/lib/pages'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('raiony')
  return page ? buildBlocksPageMetadata(page, '/raiony/') : {}
}

/** Районы — документ «Страницы» raiony, список районов — под первым экраном; нет документа — 404. */
export default async function DistrictsHub() {
  const [page, districts, contacts] = await Promise.all([
    getPage('raiony'),
    getAllDistricts(),
    getContacts(),
  ])
  if (!page) notFound()
  const [hero, ...rest] = page.blocks
  const items = (
    districts as unknown as { slug: string; nameNominative: string; distanceFromMkad?: number }[]
  )
    .map((d) => ({ slug: d.slug, name: d.nameNominative, km: d.distanceFromMkad ?? null }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  const faqs = rest.flatMap((b) => (b.blockType === 'faq-v3' ? b.items : []))
  return (
    <>
      {faqs.length > 0 && <JsonLd schema={faqPageSchema(faqs)} />}
      <Breadcrumbs items={trail('raiony')} />
      <V3BlockRenderer blocks={[hero]} phoneDisplay={contacts.phoneDisplay} />
      <DistrictGrid eyebrow="Районы" title="Выберите свой район" items={items} tone="alt" />
      <V3BlockRenderer blocks={retone(rest)} phoneDisplay={contacts.phoneDisplay} />
    </>
  )
}
