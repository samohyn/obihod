import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { trail } from '@/lib/breadcrumbs'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata, NOT_FOUND_METADATA } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('politika-konfidentsialnosti')
  return page ? buildBlocksPageMetadata(page, '/politika-konfidentsialnosti/') : NOT_FOUND_METADATA
}

/** Политика обработки персональных данных (ст. 18.1 152-ФЗ) — документ «Страницы» politika-konfidentsialnosti; нет опубликованного — 404. */
export default async function PrivacyPolicyPage() {
  const page = await getPage('politika-konfidentsialnosti')
  if (!page) notFound()
  return <PageBlocksView page={page} crumbs={trail('politika')} />
}
