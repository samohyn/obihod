import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { trail } from '@/lib/breadcrumbs'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('garantii')
  return page ? buildBlocksPageMetadata(page, '/garantii/') : {}
}

/** «Гарантии» — документ «Страницы» garantii; нет опубликованного — 404. */
export default async function GuaranteesPage() {
  const page = await getPage('garantii')
  if (!page) notFound()
  return <PageBlocksView page={page} crumbs={trail('garantii')} />
}
