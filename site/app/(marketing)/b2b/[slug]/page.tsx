import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { trail } from '@/lib/breadcrumbs'
import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { retone } from '@/lib/blocks/v3/retone'
import { getCasesListBlock, getPage, getPageSlugsUnder } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getPageSlugsUnder('b2b')
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(`b2b/${slug}`)
  return page ? buildBlocksPageMetadata(page, `/b2b/${slug}/`) : {}
}

/** Страница для бизнеса — документ «Страницы» b2b/<адрес>; нет опубликованного — 404. */
export default async function B2BPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPage(`b2b/${slug}`)
  if (!page) notFound()
  const crumbs = trail('b2b', { name: page.title, href: `/b2b/${slug}/` })
  if (slug !== 'kejsy') return <PageBlocksView page={page} crumbs={crumbs} />
  // Кейсы для бизнеса — список объектов организаций под первым экраном
  const list = await getCasesListBlock(/УК|МКД|ТСЖ|застройщ|склад|ангар|контракт|КП /i)
  const [hero, ...rest] = page.blocks
  return (
    <PageBlocksView
      page={{ ...page, blocks: retone([hero, ...(list ? [list] : []), ...rest]) }}
      crumbs={crumbs}
    />
  )
}
