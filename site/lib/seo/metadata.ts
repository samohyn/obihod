/**
 * Metadata factories для Обихода.
 * Соответствует contex/05_site_structure.md, Часть 2 §2.3.
 */
import type { Metadata } from 'next'

import type { PageData } from '@/lib/pages'

import { canonicalFor } from './canonical'
import { ogCard, OG_SITE_NAME } from './og'
import type { District } from './jsonld'
import { truncateMeta } from './text'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const metadataBase = new URL(SITE_URL)

/**
 * US-4 EPIC-SEO-USLUGI: T4 service-district metadata.
 * Используется slug-resolver page.tsx когда second-level slug совпадает
 * с city.slug (а не с sub.slug).
 */
export function buildServiceDistrictMetadata(args: {
  service: {
    slug: string
    title: string
    h1?: string | null
    priceFrom: number
    metaDescription?: string | null
  }
  district: {
    slug: string
    nameNominative: string
    namePrepositional: string
    localPriceAdjustment?: number | null
  }
  sd: {
    seoTitle?: string | null
    seoDescription?: string | null
    publishStatus?: string | null
    noindexUntilCase?: boolean | null
  } | null
}): Metadata {
  const { service: s, district: d, sd } = args
  const indexable = isServiceDistrictIndexable(sd)
  const adj = d.localPriceAdjustment ?? 0
  const adjustedPriceFrom = Math.round(s.priceFrom * (1 + adj / 100))
  const responseTime = '2 часа'
  const title =
    sd?.seoTitle?.trim() ||
    `${s.title} ${d.namePrepositional} — от ${adjustedPriceFrom.toLocaleString('ru-RU')} ₽ | Обиход`
  const description =
    sd?.seoDescription?.trim() ||
    `${s.title} ${d.namePrepositional} от ${adjustedPriceFrom.toLocaleString('ru-RU')} ₽. Выезд за ${responseTime}, фикс-цена за объект, 25+ микрорайонов района. Договор + талоны ТКО, документы для УК и ТСЖ.`

  return {
    metadataBase,
    title: { absolute: title },
    description: truncateMeta(description, 158),
    alternates: { canonical: `/${s.slug}/${d.slug}/` },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: `/${s.slug}/${d.slug}/`,
      siteName: OG_SITE_NAME,
      title,
      description: truncateMeta(description, 200),
      images: [ogCard(`${s.title} ${d.namePrepositional}`)],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: truncateMeta(description, 158),
    },
    robots: indexable
      ? { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' }
      : { index: false, follow: true },
  }
}

/**
 * Гео-страница «услуга × город» индексируется, только если опубликована и снят флаг
 * «noindex до кейса» (план 09, этап 6: без местной конкретики — noindex и вне sitemap).
 * Тот же предикат использует sitemap (getAllServiceDistrictParams).
 */
export function isServiceDistrictIndexable(
  sd: { publishStatus?: string | null; noindexUntilCase?: boolean | null } | null,
): boolean {
  return sd?.publishStatus === 'published' && sd.noindexUntilCase !== true
}

export function buildDistrictHubMetadata(d: District): Metadata {
  const title = `Обиход ${d.namePrepositional} — арбо, снег, мусор, демонтаж`
  const description = `Все услуги Обихода ${d.namePrepositional}: спил деревьев, чистка крыш, вывоз мусора, демонтаж. Фикс-цена, смета за 10 минут.`
  return {
    metadataBase,
    title: { absolute: title },
    description,
    alternates: { canonical: `/raiony/${d.slug}/` },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: `/raiony/${d.slug}/`,
      siteName: OG_SITE_NAME,
      title,
      description,
      images: [ogCard(`Обиход ${d.namePrepositional}`, 'Все услуги в районе')],
    },
    robots: { index: true, follow: true },
  }
}

/** Страница из блоков («Страницы», «Подуслуги»): title/description из вкладки SEO документа. */
export function buildBlocksPageMetadata(page: PageData, url: string): Metadata {
  const title = page.metaTitle ?? `${page.title} — Обиход`
  const description = page.metaDescription ?? undefined
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalFor(url) },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url,
      siteName: OG_SITE_NAME,
      title,
      description,
      images: page.ogImage ? [page.ogImage.url] : [ogCard(page.title)],
    },
    robots: { index: true, follow: true },
  }
}
