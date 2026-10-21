import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { trail } from '@/lib/breadcrumbs'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('park-tehniki')
  return page ? buildBlocksPageMetadata(page, '/park-tehniki/') : {}
}

/** «Парк техники» — документ «Страницы» park-tehniki; нет опубликованного — 404. */
export default async function ParkTehnikiPage() {
  const page = await getPage('park-tehniki')
  if (!page) notFound()
  return <PageBlocksView page={page} crumbs={trail('parkTehniki')} />
}
