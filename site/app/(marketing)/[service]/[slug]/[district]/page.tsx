/**
 * `/<направление>/<подуслуга>/<район>/` — «подуслуга в районе»: запись «Услуги × районы» с этой
 * подуслугой + документ «Подуслуги» (lib/geo-pages.ts). Нет записи или опубликованной подуслуги — 404.
 * Индексация — как у «услуги в районе»: решает запись (статус и «noindex до кейса»).
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getPage, getSubServicePage, heroPromise, withPromise } from '@/lib/pages'
import {
  buildSubServiceDistrictBlocks,
  type DistrictLike,
  type ServiceDistrictLike,
} from '@/lib/geo-pages'
import { canonicalFor } from '@/lib/seo/canonical'
import { ogCard } from '@/lib/seo/og'
import { getAllSubServiceDistrictParams, getSubServiceDistrictBundle } from '@/lib/seo/queries'
import { isServiceDistrictIndexable, metadataBase } from '@/lib/seo/metadata'
import { truncateMeta } from '@/lib/seo/text'
import { getCompany } from '@/lib/company'
import { getPageTemplates } from '@/lib/page-templates-server'
import { fillTemplate } from '@/lib/page-templates'

import { SubServiceDistrictBlocksView } from './SubServiceDistrictBlocksView'

export const revalidate = 43200
export const dynamicParams = true

type Params = Promise<{ service: string; slug: string; district: string }>

export async function generateStaticParams() {
  const params = await getAllSubServiceDistrictParams()
  return params.map((p) => ({ service: p.service, slug: p.sub, district: p.district }))
}

async function load(params: Params) {
  const { service: serviceSlug, slug, district: districtSlug } = await params
  const [bundle, sub, pillar] = await Promise.all([
    getSubServiceDistrictBundle(serviceSlug, slug, districtSlug),
    getSubServicePage(serviceSlug, slug),
    getPage(serviceSlug),
  ])
  return bundle && sub ? { ...bundle, sub: withPromise(sub, heroPromise(pillar)), slug } : null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const page = await load(params)
  if (!page) return {}
  const district = page.district as unknown as DistrictLike
  const sd = page.sd as unknown as ServiceDistrictLike & {
    seoDescription?: string | null
    publishStatus?: string | null
    noindexUntilCase?: boolean | null
  }
  const templates = await getPageTemplates()
  // Заголовок и описание — как на странице (H1 и лид); robots — из записи
  const { blocks } = buildSubServiceDistrictBlocks({
    sub: page.sub,
    district,
    sd,
    localPages: new Set(),
    source: '',
    company: await getCompany(),
    templates,
  })
  const hero = blocks.find((b) => b.blockType === 'hero-slider')
  const slide = hero && hero.blockType === 'hero-slider' ? hero.slides[0] : null
  const title = fillTemplate(templates.geoMetaTitle, { заголовок: slide?.title ?? page.sub.title })
  // своё описание записи (первое предложение лида) — иначе лид, обрезанный по слову
  const description = sd.seoDescription?.trim() || truncateMeta(slide?.lead ?? '', 158)
  const url = `/${(page.service as { slug: string }).slug}/${page.slug}/${district.slug}/`
  return {
    metadataBase,
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalFor(url) },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url,
      siteName: 'Обиход',
      title,
      description,
      images: page.sub.ogImage ? [page.sub.ogImage.url] : [ogCard(title)],
    },
    robots: isServiceDistrictIndexable(sd)
      ? { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' }
      : { index: false, follow: true },
  }
}

export default async function SubServiceDistrictPage({ params }: { params: Params }) {
  const page = await load(params)
  if (!page) notFound()
  return (
    <SubServiceDistrictBlocksView
      service={page.service as never}
      district={page.district as never}
      sd={page.sd as never}
      subSlug={page.slug}
      sub={page.sub}
    />
  )
}
