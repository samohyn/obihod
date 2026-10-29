import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { trail } from '@/lib/breadcrumbs'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata, NOT_FOUND_METADATA } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('komanda')
  return page ? buildBlocksPageMetadata(page, '/komanda/') : NOT_FOUND_METADATA
}

/** «Команда» — документ «Страницы» komanda; нет опубликованного — 404. */
export default async function KomandaPage() {
  const page = await getPage('komanda')
  if (!page) notFound()
  return <PageBlocksView page={page} crumbs={trail('komanda')} />
}
