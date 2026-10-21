import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { retone } from '@/lib/blocks/v3/retone'
import { trail } from '@/lib/breadcrumbs'
import { getPage, getPillarSummaryBlock } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'
import { getAllPillarsForPricing } from '@/lib/seo/queries'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('uslugi/tseny')
  return page ? buildBlocksPageMetadata(page, '/uslugi/tseny/') : {}
}

/** Порядок разделов в сводном прайсе: направления по карте 08, калькуляторы — без своего прайса. */
const PRICE_ORDER = [
  'arboristika',
  'vyvoz-musora',
  'chistka-krysh',
  'demontazh',
  'uborka-territorii',
  'dizain-landshafta',
  'arenda-tehniki',
  'promyshlennyj-alpinizm',
  'porubochnyj-bilet',
]

/**
 * Сводный прайс: рамка — документ «Страницы» uslugi/tseny, под первым экраном — блок «Цены»
 * каждого хаба направления. Нет опубликованного документа — 404.
 */
export default async function MegaPricingPage() {
  const [blocksPage, pillars] = await Promise.all([
    getPage('uslugi/tseny'),
    getAllPillarsForPricing(),
  ])
  if (!blocksPage) notFound()
  const bySlug = new Map(pillars.map((p) => [p.slug, p.title]))
  const summaries = (
    await Promise.all(
      PRICE_ORDER.filter((slug) => bySlug.has(slug)).map((slug) =>
        getPillarSummaryBlock(slug, bySlug.get(slug) ?? slug),
      ),
    )
  ).filter((b) => b !== null)
  const [hero, ...rest] = blocksPage.blocks
  return (
    <PageBlocksView
      page={{ ...blocksPage, blocks: retone([hero, ...summaries, ...rest]) }}
      crumbs={trail('tseny')}
    />
  )
}
