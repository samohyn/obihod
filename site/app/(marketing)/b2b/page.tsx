import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { trail } from '@/lib/breadcrumbs'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('b2b')
  return page ? buildBlocksPageMetadata(page, '/b2b/') : {}
}

/** Раздел «Для бизнеса» — документ «Страницы» b2b; нет опубликованного — 404. */
export default async function B2BIndex() {
  const page = await getPage('b2b')
  if (!page) notFound()
  return <PageBlocksView page={page} crumbs={trail('b2b')} />
}
