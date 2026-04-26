/**
 * JSON-LD generators для Обихода.
 * Соответствует contex/05_site_structure.md, Часть 2 §2.4.
 *
 * Контракт с SiteChrome (ADR-0002 §Контракт с seo2):
 *   - Organization.telephone  ← SiteChrome.contacts.phoneE164
 *   - Organization.sameAs     ← SiteChrome.social[].url (фильтр пустых)
 *   - Organization.legalName / taxID / vatID / address.*  ← SiteChrome.requisites.*
 *   - Organization.name       ← SeoSettings.organization.name (fallback "Обиход")
 *   - Organization.hasCredential ← SeoSettings.credentials[]
 *   - LocalBusiness.telephone / address ← SiteChrome.contacts / requisites
 *
 * Функции остаются pure: Payload-чтение делает caller (layout / generateMetadata
 * / page.tsx server component), сюда передаются уже собранные `chrome` и `seo`.
 */

import type { SiteChrome } from '@/lib/chrome'

// ---------- SEO settings subset (зеркалит site/globals/SeoSettings.ts) ----------
// TODO(be3): заменить на `import type { SeoSettings } from '@/payload-types'`,
// когда `pnpm generate:types` начнёт собираться (см. lib/chrome.ts TODO).
export type SeoSettingsCredential = {
  name: string
  issuer?: string | null
  documentUrl?: string | null
}

export type SeoSettingsLike = {
  organization?: { name?: string | null } | null
  localBusiness?: {
    priceRange?: string | null
    geoRadiusKm?: number | null
    openingHours?: { opens?: string | null; closes?: string | null } | null
  } | null
  credentials?: SeoSettingsCredential[] | null
  organizationSchemaOverride?: Record<string, unknown> | null
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'
const ORG_ID = `${SITE_URL}/#org`
const SITE_ID = `${SITE_URL}/#site`
const LB_ID = `${SITE_URL}/#lb`

const MOSCOW_LAT = 55.7558
const MOSCOW_LON = 37.6173

/** Рекурсивно удаляет undefined-значения (но сохраняет пустые строки только если явно переданы). */
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)).filter((v) => v !== undefined) as unknown as T
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const cleaned = stripUndefined(v)
      if (cleaned === undefined) continue
      if (Array.isArray(cleaned) && cleaned.length === 0) continue
      out[k] = cleaned
    }
    return out as T
  }
  return value
}

function nonEmpty(s: string | null | undefined): string | undefined {
  if (typeof s !== 'string') return undefined
  const trimmed = s.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export type District = {
  slug: string
  nameNominative: string
  namePrepositional: string
  centerGeo?: [number, number] | null
  coverageRadius?: number | null
}

export type Service = {
  slug: string
  title: string
  h1: string
  priceFrom: number
  priceTo: number
  priceUnit: string
}

export type ServiceDistrict = {
  service: Service
  district: District
}

export type BlogPost = {
  slug: string
  h1: string
  publishedAt: string
  modifiedAt: string
  heroImageUrl?: string
  author: {
    firstName: string
    lastName: string
    jobTitle?: string
    sameAs?: string[]
  }
}

const PRICE_UNIT_LABELS: Record<string, string> = {
  object: 'за объект',
  tree: 'за дерево',
  m3: 'за м³',
  shift: 'за смену',
  m2: 'за м²',
}

/**
 * Organization schema. Pure function: Payload-чтение делает caller.
 * При `chrome === null` (пустой global на первом prod-запуске до seed)
 * опциональные поля просто не выводятся — это лучше, чем фейковые
 * заглушки вида `+7 (000) 000-00-00` для Яндекса.
 */
export function organizationSchema(
  chrome: SiteChrome | null,
  seo: SeoSettingsLike | null = null,
): Record<string, unknown> {
  const req = chrome?.requisites ?? null
  const contacts = chrome?.contacts ?? null
  const social = chrome?.social ?? []

  const addressRegion = nonEmpty(req?.addressRegion)
  const addressLocality = nonEmpty(req?.addressLocality)
  const streetAddress = nonEmpty(req?.streetAddress)
  const postalCode = nonEmpty(req?.postalCode)
  const hasAnyAddress = addressRegion || addressLocality || streetAddress || postalCode

  const sameAs = social.map((s) => nonEmpty(s?.url)).filter((u): u is string => Boolean(u))

  const credentials: Record<string, unknown>[] = []
  for (const c of seo?.credentials ?? []) {
    const credName = nonEmpty(c?.name)
    if (!credName) continue
    const issuer = nonEmpty(c?.issuer)
    credentials.push(
      stripUndefined({
        '@type': 'EducationalOccupationalCredential',
        name: credName,
        recognizedBy: issuer ? { '@type': 'Organization', name: issuer } : undefined,
      }) as Record<string, unknown>,
    )
  }

  const base: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: nonEmpty(seo?.organization?.name) ?? 'Обиход',
    legalName: nonEmpty(req?.legalName),
    telephone: nonEmpty(contacts?.phoneE164),
    taxID: nonEmpty(req?.taxId),
    vatID: nonEmpty(req?.ogrn),
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    address: hasAnyAddress
      ? {
          '@type': 'PostalAddress',
          addressCountry: 'RU',
          addressRegion,
          addressLocality,
          streetAddress,
          postalCode,
        }
      : undefined,
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Москва' },
      { '@type': 'AdministrativeArea', name: 'Московская область' },
    ],
    sameAs,
    hasCredential: credentials,
  }

  // organizationSchemaOverride из SeoSettings поверх — для редких SEO-кейсов.
  const override = seo?.organizationSchemaOverride
  if (override && typeof override === 'object' && !Array.isArray(override)) {
    return stripUndefined({ ...base, ...(override as Record<string, unknown>) })
  }
  return stripUndefined(base)
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE_URL,
    name: 'Обиход',
    inLanguage: 'ru-RU',
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/poisk?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * LocalBusiness schema. Читает `telephone` из SiteChrome.contacts.phoneE164,
 * `priceRange` / `openingHours` — из SeoSettings.localBusiness.*
 * (с дефолтами `₽₽` / 08:00 / 21:00, если global не заполнен).
 *
 * `district` опциональный: при его наличии строится районный вариант
 * (`/raiony/<slug>/#lb`) с geo-координатами и radius из Districts.
 */
export function localBusinessSchema(
  chrome: SiteChrome | null,
  seo: SeoSettingsLike | null = null,
  district?: District,
): Record<string, unknown> {
  const id = district ? `${SITE_URL}/raiony/${district.slug}/#lb` : LB_ID
  const name = district ? `Обиход — ${district.nameNominative}` : 'Обиход'

  const contacts = chrome?.contacts ?? null
  const lb = seo?.localBusiness ?? null
  const geoRadiusKm = lb?.geoRadiusKm ?? 150
  const opens = nonEmpty(lb?.openingHours?.opens) ?? '08:00'
  const closes = nonEmpty(lb?.openingHours?.closes) ?? '21:00'
  const priceRange = nonEmpty(lb?.priceRange) ?? '₽₽'

  const areaServed = district
    ? {
        '@type': 'GeoShape',
        name: district.nameNominative,
        geoRadius: `${(district.coverageRadius ?? 20) * 1000}`,
      }
    : {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: MOSCOW_LAT,
          longitude: MOSCOW_LON,
        },
        geoRadius: `${geoRadiusKm * 1000}`,
      }

  return stripUndefined({
    '@type': 'HomeAndConstructionBusiness',
    '@id': id,
    name,
    parentOrganization: { '@id': ORG_ID },
    image: `${SITE_URL}/og.jpg`,
    telephone: nonEmpty(contacts?.phoneE164),
    priceRange,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        opens,
        closes,
      },
    ],
    areaServed,
    geo:
      district && district.centerGeo
        ? {
            '@type': 'GeoCoordinates',
            latitude: district.centerGeo[1],
            longitude: district.centerGeo[0],
          }
        : undefined,
  })
}

export function serviceSchema(service: Service, district?: District) {
  const id = district
    ? `${SITE_URL}/${service.slug}/${district.slug}/#service`
    : `${SITE_URL}/${service.slug}/#service`

  const areaServed = district
    ? {
        '@type': 'AdministrativeArea',
        name: district.nameNominative,
        geo: district.centerGeo
          ? {
              '@type': 'GeoCoordinates',
              latitude: district.centerGeo[1],
              longitude: district.centerGeo[0],
            }
          : undefined,
      }
    : [
        { '@type': 'AdministrativeArea', name: 'Москва' },
        { '@type': 'AdministrativeArea', name: 'Московская область' },
      ]

  return {
    '@type': 'Service',
    '@id': id,
    serviceType: service.title,
    provider: { '@id': ORG_ID },
    areaServed,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: service.priceFrom,
        maxPrice: service.priceTo,
        priceCurrency: 'RUB',
        unitText: PRICE_UNIT_LABELS[service.priceUnit] ?? service.priceUnit,
      },
    },
  }
}

export function faqPageSchema(qa: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: qa.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

export function breadcrumbListSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

export type Author = {
  slug: string
  firstName: string
  lastName: string
  jobTitle?: string | null
  bio?: string | null
  imageUrl?: string | null
  sameAs?: string[] | null
  knowsAbout?: string[] | null
}

/**
 * Person schema для `/avtory/<slug>/` (US-5 REQ-5.5, ADR-uМ-10).
 *
 * E-E-A-T-сигнал — отдельный URL автора с jobTitle, knowsAbout, sameAs.
 * Используется на странице автора (если/когда коллекция Authors будет
 * добавлена в Payload — сейчас не существует, заготовка под US-6).
 */
export function personSchema(author: Author): Record<string, unknown> {
  return stripUndefined({
    '@type': 'Person',
    '@id': `${SITE_URL}/avtory/${author.slug}/#person`,
    name: `${author.firstName} ${author.lastName}`,
    givenName: author.firstName,
    familyName: author.lastName,
    jobTitle: nonEmpty(author.jobTitle ?? undefined),
    description: nonEmpty(author.bio ?? undefined),
    image: author.imageUrl ?? undefined,
    url: `${SITE_URL}/avtory/${author.slug}/`,
    worksFor: { '@id': ORG_ID },
    sameAs: (author.sameAs ?? []).filter((s): s is string => Boolean(s && s.trim())),
    knowsAbout: (author.knowsAbout ?? []).filter((s): s is string => Boolean(s && s.trim())),
  })
}

export function articleSchema(post: BlogPost) {
  return {
    '@type': 'BlogPosting',
    headline: post.h1,
    image: post.heroImageUrl,
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt,
    author: {
      '@type': 'Person',
      name: `${post.author.firstName} ${post.author.lastName}`,
      jobTitle: post.author.jobTitle,
      sameAs: post.author.sameAs,
    },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
  }
}
