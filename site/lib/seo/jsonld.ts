/**
 * JSON-LD generators для Обихода.
 * Соответствует contex/05_site_structure.md, Часть 2 §2.4.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'
const ORG_ID = `${SITE_URL}/#org`
const SITE_ID = `${SITE_URL}/#site`
const LB_ID = `${SITE_URL}/#lb`

const MOSCOW_LAT = 55.7558
const MOSCOW_LON = 37.6173

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

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'ООО «Обиход»',
    legalName: 'Общество с ограниченной ответственностью «Обиход»',
    taxID: '7847729123',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RU',
      addressRegion: 'Санкт-Петербург',
      addressLocality: 'Санкт-Петербург',
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Москва' },
      { '@type': 'AdministrativeArea', name: 'Московская область' },
    ],
    sameAs: [],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory:
          'Лицензия Росприроднадзора на транспортирование отходов IV класса',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'СРО строителей',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Допуски Минтруда №782н',
      },
    ],
  }
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

export function localBusinessSchema(district?: District) {
  const id = district ? `${SITE_URL}/raiony/${district.slug}/#lb` : LB_ID
  const name = district ? `Обиход — ${district.nameNominative}` : 'Обиход'

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
        geoRadius: '150000',
      }

  return {
    '@type': 'HomeAndConstructionBusiness',
    '@id': id,
    name,
    parentOrganization: { '@id': ORG_ID },
    image: `${SITE_URL}/og.jpg`,
    telephone: '+7 (000) 000-00-00',
    priceRange: '₽₽',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        opens: '08:00',
        closes: '21:00',
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
