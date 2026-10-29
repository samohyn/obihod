import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { trail } from '@/lib/breadcrumbs'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata, NOT_FOUND_METADATA } from '@/lib/seo/metadata'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('uslugi')
  return page ? buildBlocksPageMetadata(page, '/uslugi/') : NOT_FOUND_METADATA
}

/** Раздел «Услуги» — документ «Страницы» uslugi; нет опубликованного — 404. */
export default async function UslugiHubPage() {
  const page = await getPage('uslugi')
  if (!page) notFound()
  return <PageBlocksView page={page} crumbs={trail('uslugi')} />
}
