import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getAllServiceSlugs, getServiceBySlug } from '@/lib/seo/queries'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata, NOT_FOUND_METADATA } from '@/lib/seo/metadata'

import { PillarBlocksView } from './PillarBlocksView'

export const revalidate = 86400
// Новое направление, добавленное после сборки, рендерится по запросу.
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs()
  return slugs.map((service) => ({ service }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>
}): Promise<Metadata> {
  const { service } = await params
  const page = await getPage(service)
  return page ? buildBlocksPageMetadata(page, `/${service}/`) : NOT_FOUND_METADATA
}

/**
 * Хаб направления — документ «Услуги» + документ «Страницы» с тем же адресом (блоки v3).
 * Нет направления или опубликованного документа — 404.
 */
export default async function PillarPage({ params }: { params: Promise<{ service: string }> }) {
  const { service: serviceSlug } = await params
  const [service, page] = await Promise.all([getServiceBySlug(serviceSlug), getPage(serviceSlug)])
  if (!service || !page) notFound()
  return <PillarBlocksView service={service as never} page={page} />
}
