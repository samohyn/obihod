import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { trail } from '@/lib/breadcrumbs'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata, NOT_FOUND_METADATA } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('sro-licenzii')
  return page ? buildBlocksPageMetadata(page, '/sro-licenzii/') : NOT_FOUND_METADATA
}

/** «СРО и лицензии» — документ «Страницы» sro-licenzii; нет опубликованного — 404. */
export default async function SroLicenziiPage() {
  const page = await getPage('sro-licenzii')
  if (!page) notFound()
  return <PageBlocksView page={page} crumbs={trail('sroLicenzii')} />
}
