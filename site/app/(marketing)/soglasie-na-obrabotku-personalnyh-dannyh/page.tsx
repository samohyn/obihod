import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { trail } from '@/lib/breadcrumbs'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata, NOT_FOUND_METADATA } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('soglasie-na-obrabotku-personalnyh-dannyh')
  return page
    ? buildBlocksPageMetadata(page, '/soglasie-na-obrabotku-personalnyh-dannyh/')
    : NOT_FOUND_METADATA
}

/** Согласие на обработку персональных данных — отдельный документ (ч. 1 ст. 9 152-ФЗ в ред. 156-ФЗ) — документ «Страницы» soglasie-na-obrabotku-personalnyh-dannyh; нет опубликованного — 404. */
export default async function ConsentPage() {
  const page = await getPage('soglasie-na-obrabotku-personalnyh-dannyh')
  if (!page) notFound()
  return <PageBlocksView page={page} crumbs={trail('soglasie')} />
}
