import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { trail } from '@/lib/breadcrumbs'
import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { retone } from '@/lib/blocks/v3/retone'
import { getContacts } from '@/lib/chrome'
import { getCasesListBlock, getPage } from '@/lib/pages'
import { buildBlocksPageMetadata, NOT_FOUND_METADATA } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('kejsy')
  return page ? buildBlocksPageMetadata(page, '/kejsy/') : NOT_FOUND_METADATA
}

/** Кейсы — документ «Страницы» kejsy, кейсы из коллекции «Кейсы» — под первым экраном; нет документа — 404. */
export default async function CasesIndex() {
  const [page, list, contacts] = await Promise.all([
    getPage('kejsy'),
    getCasesListBlock(),
    getContacts(),
  ])
  if (!page) notFound()
  const [hero, ...rest] = page.blocks
  return (
    <>
      <Breadcrumbs items={trail('kejsy')} />
      <V3BlockRenderer
        blocks={retone([hero, ...(list ? [{ ...list, title: 'Все кейсы' }] : []), ...rest])}
        phoneDisplay={contacts.phoneDisplay}
      />
    </>
  )
}
