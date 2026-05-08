/**
 * Metadata factories для Обихода.
 * Соответствует contex/05_site_structure.md, Часть 2 §2.3.
 */
import type { Metadata } from 'next'

import type { District, Service } from './jsonld'
import { truncateMeta } from './text'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const metadataBase = new URL(SITE_URL)

export function buildHomeMetadata(): Metadata {
  return {
    metadataBase,
    title: {
      default: 'Обиход — порядок под ключ. Арбо, снег, мусор, демонтаж по Москве и МО',
      template: '%s | Обиход',
    },
    description:
      'Спил деревьев, чистка крыш от снега, вывоз мусора, демонтаж — комплексный подрядчик 4-в-1 для Москвы и МО. Фикс-цена за объект, смета по фото за 10 минут в Telegram, MAX, WhatsApp.',
    alternates: { canonical: '/', languages: { 'ru-RU': '/' } },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: '/',
      siteName: 'Обиход',
    },
    twitter: { card: 'summary_large_image' },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  }
}

export function buildPillarMetadata(
  s: Service,
  metaTitle: string,
  metaDescription: string,
): Metadata {
  return {
    metadataBase,
    title: { absolute: metaTitle },
    description: metaDescription,
    alternates: {
      canonical: `/${s.slug}/`,
      languages: { 'ru-RU': `/${s.slug}/` },
    },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: `/${s.slug}/`,
      siteName: 'Обиход',
      title: metaTitle,
      description: metaDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  }
}

export function buildProgrammaticMetadata(args: {
  service: Service
  district: District
  localPriceAdjustment?: number
  localPriceNote?: string
  hasMiniCase: boolean
  publishStatus: string
  noindexUntilCase: boolean
}): Metadata {
  const { service: s, district: d, localPriceAdjustment = 0, localPriceNote } = args
  const adjustedPriceFrom = Math.round(s.priceFrom * (1 + localPriceAdjustment / 100))
  const indexable = args.publishStatus === 'published' && args.hasMiniCase && !args.noindexUntilCase

  const title = `${s.h1} ${d.namePrepositional} — цена от ${adjustedPriceFrom.toLocaleString('ru-RU')} ₽ | Обиход`
  const description = localPriceNote
    ? `${truncateMeta(localPriceNote, 110)} Смета за 10 минут в TG/MAX/WhatsApp.`
    : `${s.h1} ${d.namePrepositional}. Фикс-цена за объект, смета по фото за 10 минут. Обиход.`

  return {
    metadataBase,
    title: { absolute: title },
    description,
    alternates: { canonical: `/${s.slug}/${d.slug}/` },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: `/${s.slug}/${d.slug}/`,
      siteName: 'Обиход',
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
  }
}

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
  } | null
}): Metadata {
  const { service: s, district: d, sd } = args
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
      siteName: 'Обиход',
      title,
      description: truncateMeta(description, 200),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: truncateMeta(description, 158),
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  }
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
      siteName: 'Обиход',
      title,
      description,
    },
    robots: { index: true, follow: true },
  }
}
