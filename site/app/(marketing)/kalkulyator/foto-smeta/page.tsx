import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { trail } from '@/lib/breadcrumbs'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('kalkulyator/foto-smeta')
  return page ? buildBlocksPageMetadata(page, '/kalkulyator/foto-smeta/') : {}
}

/** «Смета по фото» — документ «Страницы» kalkulyator/foto-smeta; нет опубликованного — 404. */
export default async function FotoSmetaPage() {
  const page = await getPage('kalkulyator/foto-smeta')
  if (!page) notFound()
  return <PageBlocksView page={page} crumbs={trail('fotoSmeta')} />
}
