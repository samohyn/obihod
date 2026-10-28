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
 *   - LocalBusiness не выводим: клиентов по юридическому адресу не принимаем (только выезд)
 *
 * Функции остаются pure: Payload-чтение делает caller (layout / generateMetadata
 * / page.tsx server component), сюда передаются уже собранные `chrome` и `seo`.
 */

import type { SiteChrome } from '@/lib/chrome'

import { ogCard } from './og'

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

/** Реквизит или undefined, если в админке ещё стоит заглушка из единиц. */
function realRequisite(s: string | null | undefined): string | undefined {
  const v = nonEmpty(s)
  return v && !/^1+$/.test(v) ? v : undefined
}

/** Фактический адрес компании из SiteChrome.requisites — только для Organization: LocalBusiness с адресом не выводим — клиентов по адресу не принимаем (решение владельца 27.10.2026). */
function postalAddress(req: SiteChrome['requisites'] | null | undefined) {
  const addressRegion = nonEmpty(req?.addressRegion)
  const addressLocality = nonEmpty(req?.addressLocality)
  const streetAddress = nonEmpty(req?.streetAddress)
  const postalCode = nonEmpty(req?.postalCode)
  if (!addressRegion && !addressLocality && !streetAddress && !postalCode) return undefined
  return {
    '@type': 'PostalAddress',
    addressCountry: 'RU',
    addressRegion,
    addressLocality,
    streetAddress,
    postalCode,
  }
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
    email: nonEmpty(contacts?.email),
    // заглушки из единиц (реквизиты не заполнены) не публикуем
    taxID: realRequisite(req?.taxId),
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    address: postalAddress(req),
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
  }
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
    name: service.h1 || service.title,
    serviceType: service.title,
    url: id.replace(/#service$/, ''),
    provider: { '@id': ORG_ID },
    areaServed,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: service.priceFrom,
        // верхняя граница — только если она есть и выше «от»
        maxPrice: service.priceTo > service.priceFrom ? service.priceTo : undefined,
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
    image: post.heroImageUrl ?? ogCard(post.h1, 'Блог').url,
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

/** Кейс — Article от имени компании (план 09, этап 7: пробел 4 из 11_page_templates.md). */
export function caseArticleSchema(c: {
  slug: string
  title: string
  description?: string | null
  image?: string | null
  datePublished?: string | null
  dateModified?: string | null
}): Record<string, unknown> {
  const url = `${SITE_URL}/kejsy/${c.slug}/`
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: c.title,
    description: c.description || undefined,
    image: c.image || ogCard(c.title, 'Кейс').url,
    datePublished: c.datePublished || undefined,
    dateModified: c.dateModified || undefined,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: url,
  }
}

// ─── EPIC-SEO-COMPETE-3 US-3: нейро-SEO schema-helpers ──────────────────────

/**
 * Speakable schema marker — для AI-ботов которые читают вслух
 * первый параграф / TL;DR. Применяется ВНУТРИ другой schema
 * (BlogPosting, FAQPage, Article) как `speakable: speakableSchema(...)`.
 *
 * `cssSelectors` — список CSS-селекторов с озвучиваемым текстом.
 * Recommended pattern для US-5 blog:
 *   speakable: speakableSchema(['[data-llm-citation] [itemprop="answer"]', '.tldr'])
 */
export function speakableSchema(cssSelectors: string[]): Record<string, unknown> {
  return {
    '@type': 'SpeakableSpecification',
    cssSelector: cssSelectors,
  }
}

export type ReviewItem = {
  /** Имя автора */
  authorName: string
  /** Текст отзыва */
  body: string
  /** Рейтинг 1-5 */
  rating: number
  /** ISO date */
  datePublished: string
  /** Опциональная привязка к услуге */
  serviceSlug?: string
  /** Опциональная привязка к городу */
  districtSlug?: string
}

/**
 * Review schema для отдельного отзыва.
 * Используется на `/otzyvy/<slug>/` либо как массив на `/otzyvy/` index (US-9).
 */
export function reviewSchema(item: ReviewItem): Record<string, unknown> {
  return stripUndefined({
    '@type': 'Review',
    itemReviewed: { '@id': ORG_ID },
    author: { '@type': 'Person', name: item.authorName },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: item.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: item.body,
    datePublished: item.datePublished,
  })
}

// ─── EPIC-SEO-USLUGI US-4: T1 hub + T2 service-with-rating ──────────────────

export type ServiceLite = {
  slug: string
  title: string
  priceFrom?: number | null
}

/**
 * ItemList для T1 `/uslugi/` hub — 5 pillars.
 * Position-based ordering, item.url canonical.
 */
export function t1HubItemListSchema(pillars: ServiceLite[]): Record<string, unknown> {
  return {
    '@type': 'ItemList',
    name: 'Услуги Обиход',
    numberOfItems: pillars.length,
    itemListElement: pillars.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: `${SITE_URL}/${p.slug}/`,
    })),
  }
}

/**
 * Service schema с inline AggregateRating — расширение sustained
 * `serviceSchema()` для T2/T4. AggregateRating nested внутрь Service node,
 * не отдельный graph-узел: rich-snippet «Service ★4.9 (247)» в SERP.
 *
 * `rating === undefined` → возвращает обычный `serviceSchema()`. Параметр
 * вводится US-5 reviews — сейчас pillar pages могут пробросить агрегат
 * из global rating, либо оставить undefined.
 */
export function serviceWithRatingSchema(
  service: Service,
  district?: District,
  rating?: { value: number; count: number; bestRating?: number },
): Record<string, unknown> {
  const base = serviceSchema(service, district) as Record<string, unknown>
  if (!rating) return base
  return {
    ...base,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: rating.count,
      bestRating: rating.bestRating ?? 5,
      worstRating: 1,
    },
  }
}
