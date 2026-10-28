/**
 * `/<направление>/<адрес>/` — подуслуга (документ «Подуслуги», блоки v3) или «услуга в районе»
 * (запись «Услуги × районы» + хаб направления из «Страниц», lib/geo-pages.ts). Адреса подуслуг
 * и районов не пересекаются (ADR-0019). Нет документа — 404.
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import {
  getPage,
  getSubServicePage,
  getSubServicePageParams,
  heroPromise,
  withPromise,
} from '@/lib/pages'
import {
  buildServiceDistrictBlocks,
  type DistrictLike,
  type ServiceDistrictLike,
} from '@/lib/geo-pages'
import { canonicalFor } from '@/lib/seo/canonical'
import { ogCard, OG_SITE_NAME } from '@/lib/seo/og'
import {
  getAllServiceDistrictParams,
  getServiceBySlug,
  getServiceDistrictBundle,
} from '@/lib/seo/queries'
import { buildServiceDistrictMetadata } from '@/lib/seo/metadata'

import { SubServiceBlocksView } from './SubServiceBlocksView'
import { ServiceDistrictBlocksView } from './ServiceDistrictBlocksView'
import { getCompany } from '@/lib/company'
import { getPageTemplates } from '@/lib/page-templates-server'
import { fillTemplate } from '@/lib/page-templates'
import { truncateMeta } from '@/lib/seo/text'

export const revalidate = 43200
export const dynamicParams = true

export async function generateStaticParams() {
  const [subs, sds] = await Promise.all([getSubServicePageParams(), getAllServiceDistrictParams()])
  return [...subs, ...sds.map((s) => ({ service: s.service, slug: s.slug }))]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; slug: string }>
}): Promise<Metadata> {
  const { service: serviceSlug, slug } = await params

  // 0. Подуслуга из блоков
  const blocksPage = await getSubServicePage(serviceSlug, slug)
  if (blocksPage) {
    const url = `/${serviceSlug}/${slug}/`
    const title = blocksPage.metaTitle ?? `${blocksPage.title} — Обиход`
    return {
      title: { absolute: title },
      description: blocksPage.metaDescription ?? undefined,
      alternates: { canonical: canonicalFor(url) },
      openGraph: {
        type: 'website',
        locale: 'ru_RU',
        url,
        siteName: OG_SITE_NAME,
        title,
        description: blocksPage.metaDescription ?? undefined,
        images: blocksPage.ogImage ? [blocksPage.ogImage.url] : [ogCard(blocksPage.title)],
      },
      robots: { index: true, follow: true },
    }
  }

  // Услуга в районе
  const sdBundle = await getServiceDistrictBundle(serviceSlug, slug)
  if (sdBundle) {
    const legacy = buildServiceDistrictMetadata({
      service: sdBundle.service as never,
      district: sdBundle.district as never,
      sd: sdBundle.sd as never,
    })
    // Заголовок и описание — по шаблону из хаба; robots и canonical — из записи
    // (индексацию гео-страниц решает владелец)
    const pillar = await getPage(serviceSlug)
    if (!pillar) return {}
    const templates = await getPageTemplates()
    const { blocks } = buildServiceDistrictBlocks({
      pillar,
      district: sdBundle.district as unknown as DistrictLike,
      sd: sdBundle.sd as unknown as ServiceDistrictLike,
      otherServices: [],
      localPages: new Set(),
      source: '',
      company: await getCompany(),
      templates,
    })
    const hero = blocks.find((b) => b.blockType === 'hero-slider')
    const slide = hero && hero.blockType === 'hero-slider' ? hero.slides[0] : null
    // Только шаблон: в старых записях «Услуги × районы» поля seoTitle / seoDescription — прежние
    // заготовки под другую услугу и старый оффер («Вырубка ёлок…» на «Спиле в Раменском»,
    // «выезд послезавтра»), их выводить нельзя (26.10.2026). Описание — по слову, не посреди слова.
    const title = fillTemplate(templates.geoMetaTitle, { заголовок: slide?.title ?? pillar.title })
    const description = truncateMeta(slide?.lead ?? '', 158)
    return {
      ...legacy,
      title: { absolute: title },
      description,
      openGraph: { ...legacy.openGraph, title, description },
    }
  }

  return {}
}

export default async function ServiceSlugPage({
  params,
}: {
  params: Promise<{ service: string; slug: string }>
}) {
  const { service: serviceSlug, slug } = await params

  const blocksPage = await getSubServicePage(serviceSlug, slug)
  if (blocksPage) {
    const [service, pillar] = await Promise.all([
      getServiceBySlug(serviceSlug),
      getPage(serviceSlug),
    ])
    if (!service) notFound()
    return (
      <SubServiceBlocksView
        service={service as never}
        slug={slug}
        page={withPromise(blocksPage, heroPromise(pillar))}
      />
    )
  }

  const sdBundle = await getServiceDistrictBundle(serviceSlug, slug)
  const pillar = sdBundle ? await getPage(serviceSlug) : null
  if (!sdBundle || !pillar) notFound()
  return (
    <ServiceDistrictBlocksView
      service={sdBundle.service as never}
      district={sdBundle.district as never}
      sd={sdBundle.sd as never}
      pillar={pillar}
    />
  )
}
