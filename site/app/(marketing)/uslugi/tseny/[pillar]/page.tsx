import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { retone } from '@/lib/blocks/v3/retone'
import { trail } from '@/lib/breadcrumbs'
import { getPage, getPillarPriceBlocks, getPillarSummaryBlock } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'
import { getAllPillarsForPricing, getServiceBySlug } from '@/lib/seo/queries'

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  const pillars = await getAllPillarsForPricing()
  return pillars.map((p) => ({ pillar: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string }>
}): Promise<Metadata> {
  const { pillar: pillarSlug } = await params
  const page = await getPage(`uslugi/tseny/${pillarSlug}`)
  return page ? buildBlocksPageMetadata(page, `/uslugi/tseny/${pillarSlug}/`) : {}
}

/**
 * Прайс направления: рамка — документ «Страницы» uslugi/tseny/<направление>, под первым экраном —
 * блок «Цены» каждой подуслуги (нет подуслуг с ценами — блок «Цены» хаба). Нет направления или
 * опубликованного документа — 404.
 */
export default async function PillarPricingPage({
  params,
}: {
  params: Promise<{ pillar: string }>
}) {
  const { pillar: pillarSlug } = await params
  const [service, blocksPage] = await Promise.all([
    getServiceBySlug(pillarSlug) as Promise<{ title: string; slug: string } | null>,
    getPage(`uslugi/tseny/${pillarSlug}`),
  ])
  if (!service || !blocksPage) notFound()

  const subPrices = await getPillarPriceBlocks(pillarSlug)
  const summary = subPrices.length ? null : await getPillarSummaryBlock(pillarSlug, service.title)
  const prices = subPrices.length ? subPrices : summary ? [summary] : []
  const [hero, ...rest] = blocksPage.blocks
  return (
    <PageBlocksView
      page={{ ...blocksPage, blocks: retone([hero, ...prices, ...rest]) }}
      crumbs={trail('tseny', { name: service.title, href: `/uslugi/tseny/${service.slug}/` })}
    />
  )
}
