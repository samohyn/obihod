import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { trail } from '@/lib/breadcrumbs'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata, NOT_FOUND_METADATA } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('otzyvy')
  return page ? buildBlocksPageMetadata(page, '/otzyvy/') : NOT_FOUND_METADATA
}

/** «Отзывы» — документ «Страницы» otzyvy; нет опубликованного — 404. */
export default async function OtzyvyPage() {
  const page = await getPage('otzyvy')
  if (!page) notFound()
  return <PageBlocksView page={page} crumbs={trail('otzyvy')} />
}
