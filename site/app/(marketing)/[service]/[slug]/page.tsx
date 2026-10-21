/**
 * Slug-resolver `/<service>/<slug>/` (US-4 EPIC-SEO-USLUGI).
 *
 * Динамика: second-segment может быть либо sub-service slug (T3), либо
 * city slug (T4 SD). По ADR-0019 namespace disjoint между sub-services и
 * districts — гарантировано, что при равном `slug` совпадение возможно
 * только в одном из контекстов.
 *
 * Fallback chain:
 *   0. опубликованная подуслуга из коллекции «Подуслуги» → блоки v3 (этап 3 плана 09)
 *   1. sub-service найден → T3 SubServiceView
 *   2. service-district (без sub_service_slug) найден → T4 ServiceDistrictView
 *   3. notFound() → 404
 *
 * generateStaticParams возвращает union: subParams + sdParams (без overlap
 * по ADR-0019).
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getPage, getSubServicePage } from '@/lib/pages'
import {
  buildServiceDistrictBlocks,
  type DistrictLike,
  type ServiceDistrictLike,
} from '@/lib/geo-pages'
import { canonicalFor } from '@/lib/seo/canonical'
import {
  getAllServiceDistrictParams,
  getAllSubServiceParams,
  getServiceBySlug,
  getServiceDistrictBundle,
  getSubServiceBySlug,
} from '@/lib/seo/queries'
import { buildServiceDistrictMetadata } from '@/lib/seo/metadata'

import ServiceDistrictView from './ServiceDistrictView'
import { SubServiceBlocksView } from './SubServiceBlocksView'
import { ServiceDistrictBlocksView } from './ServiceDistrictBlocksView'
import { SubServiceView } from './SubServiceView'

export const revalidate = 43200
export const dynamicParams = true

export async function generateStaticParams() {
  const [subs, sds] = await Promise.all([getAllSubServiceParams(), getAllServiceDistrictParams()])
  return [
    ...subs.map((s) => ({ service: s.service, slug: s.sub })),
    ...sds.map((s) => ({ service: s.service, slug: s.slug })),
  ]
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
        title,
        description: blocksPage.metaDescription ?? undefined,
        images: blocksPage.ogImage ? [blocksPage.ogImage.url] : undefined,
      },
      robots: { index: true, follow: true },
    }
  }

  // 1. Sub-service (T3)
  const subResult = await getSubServiceBySlug(serviceSlug, slug)
  if (subResult) {
    const { service, sub } = subResult as unknown as {
      service: { slug: string; metaDescription?: string }
      sub: {
        slug: string
        title: string
        h1: string
        intro?: string | null
        body?: unknown
        metaTitle?: string | null
        metaDescription?: string | null
      }
    }
    if (!sub.intro && !sub.body) return { title: 'Не найдено — Обиход' }
    return {
      title: { absolute: sub.metaTitle ?? sub.h1 },
      description: sub.metaDescription ?? sub.intro ?? service.metaDescription,
      alternates: { canonical: canonicalFor(`/${service.slug}/${sub.slug}/`) },
      openGraph: {
        type: 'article',
        locale: 'ru_RU',
        url: `/${service.slug}/${sub.slug}/`,
        title: sub.h1,
        description: sub.intro ?? sub.metaDescription ?? undefined,
      },
      robots: { index: true, follow: true },
    }
  }

  // 2. Service-district (T4)
  const sdBundle = await getServiceDistrictBundle(serviceSlug, slug)
  if (sdBundle) {
    const legacy = buildServiceDistrictMetadata({
      service: sdBundle.service as never,
      district: sdBundle.district as never,
      sd: sdBundle.sd as never,
    })
    // 2a. Из хаба направления — заголовок и описание по шаблону; robots и canonical — прежние
    // (индексацию гео-страниц решает владелец)
    const pillar = await getPage(serviceSlug)
    if (!pillar) return legacy
    const { blocks } = buildServiceDistrictBlocks({
      pillar,
      district: sdBundle.district as unknown as DistrictLike,
      sd: sdBundle.sd as unknown as ServiceDistrictLike,
      otherServices: [],
      source: '',
    })
    const hero = blocks.find((b) => b.blockType === 'hero-slider')
    const slide = hero && hero.blockType === 'hero-slider' ? hero.slides[0] : null
    const title = `${slide?.title ?? pillar.title} — Обиход`
    const description = (slide?.lead ?? '').slice(0, 158)
    return {
      ...legacy,
      title: { absolute: title },
      description,
      openGraph: { ...legacy.openGraph, title, description },
    }
  }

  return { title: 'Не найдено — Обиход' }
}

export default async function ServiceSlugPage({
  params,
}: {
  params: Promise<{ service: string; slug: string }>
}) {
  const { service: serviceSlug, slug } = await params

  // 0. Подуслуга из блоков — пока не опубликована, ниже прежняя версия
  const blocksPage = await getSubServicePage(serviceSlug, slug)
  if (blocksPage) {
    const service = await getServiceBySlug(serviceSlug)
    if (!service) notFound()
    return <SubServiceBlocksView service={service as never} slug={slug} page={blocksPage} />
  }

  // 1. T3 sub
  const subResult = await getSubServiceBySlug(serviceSlug, slug)
  if (subResult) {
    const service = await getServiceBySlug(serviceSlug)
    if (!service) notFound()
    const { sub } = subResult as { service: unknown; sub: { intro?: unknown; body?: unknown } }
    if (!sub.intro && !sub.body) notFound()
    return <SubServiceView service={service as never} sub={sub as never} />
  }

  // 2. T4 SD
  const sdBundle = await getServiceDistrictBundle(serviceSlug, slug)
  if (sdBundle) {
    // 2a. Из хаба направления, пока он опубликован
    const pillar = await getPage(serviceSlug)
    if (pillar) {
      return (
        <ServiceDistrictBlocksView
          service={sdBundle.service as never}
          district={sdBundle.district as never}
          sd={sdBundle.sd as never}
          pillar={pillar}
        />
      )
    }
    return (
      <ServiceDistrictView
        service={sdBundle.service as never}
        district={sdBundle.district as never}
        sd={sdBundle.sd as never}
      />
    )
  }

  notFound()
}
