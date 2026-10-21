import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { trail } from '@/lib/breadcrumbs'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('kak-my-rabotaem')
  return page ? buildBlocksPageMetadata(page, '/kak-my-rabotaem/') : {}
}

/** «Как мы работаем» — документ «Страницы» kak-my-rabotaem; нет опубликованного — 404. */
export default async function HowWeWorkPage() {
  const page = await getPage('kak-my-rabotaem')
  if (!page) notFound()
  return <PageBlocksView page={page} crumbs={trail('kakMyRabotaem')} />
}
