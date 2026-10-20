import { cache } from 'react'

import { CALCULATOR_SLUGS, shortTitle, trail, type Crumb } from './breadcrumbs'
import { CONSENT_URL, PRIVACY_URL } from './legal'
import { payloadClient } from './payload'
import { getAllServiceDistrictParams, getAllSubServiceParams } from './seo/queries'

/**
 * HTML-карта сайта /karta-sajta/ — разделы карты 08 и все страницы, которые отдаёт sitemap.xml:
 * опубликованные услуги, подуслуги с содержимым, услуги в районах без noindex, районы, кейсы,
 * B2B, статьи, авторы. Подписи разделов — те же, что в крошках (lib/breadcrumbs.ts).
 */

export type SitemapLink = Crumb & { children?: Crumb[] }
export type SitemapSection = { title: string; href?: string; links: SitemapLink[] }

// Порядок направлений — как в карте 08 и меню.
const SERVICE_ORDER = [
  'vyvoz-musora',
  'arboristika',
  'chistka-krysh',
  'uborka-territorii',
  'demontazh',
  'dizain-landshafta',
  'arenda-tehniki',
  'promyshlennyj-alpinizm',
  'porubochnyj-bilet',
]

type ServiceDoc = { slug: string; title: string; subServices?: { slug?: string; title?: string }[] }
type TitledDoc = { slug?: string; title?: string }

const section = (key: Parameters<typeof trail>[0], links: SitemapLink[]): SitemapSection => {
  const s = trail(key).at(-1) as Crumb
  return { title: s.name, href: s.href, links }
}

async function findAll<T>(collection: string, where?: Record<string, unknown>): Promise<T[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: collection as never,
      where: where as never,
      limit: 1000,
      pagination: false,
      depth: 0,
    })
    return r.docs as unknown as T[]
  } catch (e) {
    console.error(`[karta-sajta] ${collection} failed:`, e)
    return []
  }
}

const published = { _status: { equals: 'published' } }
const byOrder = (a: ServiceDoc, b: ServiceDoc) =>
  (SERVICE_ORDER.indexOf(a.slug) + 1 || 99) - (SERVICE_ORDER.indexOf(b.slug) + 1 || 99)
const titled = (docs: TitledDoc[], base: string): Crumb[] =>
  docs
    .filter((d) => d.slug && d.title)
    .map((d) => ({ name: shortTitle(d.title as string), href: `${base}${d.slug}/` }))

export const getSitemapTree = cache(async (): Promise<SitemapSection[]> => {
  const [services, subParams, sdParams, districts, cases, b2b, posts, authors] = await Promise.all([
    findAll<ServiceDoc>('services', published),
    getAllSubServiceParams(),
    getAllServiceDistrictParams(),
    findAll<{ slug?: string; nameNominative?: string }>('districts'),
    findAll<TitledDoc>('cases'),
    findAll<TitledDoc>('b2b-pages', published),
    findAll<TitledDoc>('blog', published),
    findAll<{ slug?: string; fullName?: string; firstName?: string; lastName?: string }>(
      'authors',
      published,
    ),
  ])

  const directions = services.filter((s) => !CALCULATOR_SLUGS.includes(s.slug)).sort(byOrder)
  const calculators = services.filter((s) => CALCULATOR_SLUGS.includes(s.slug))
  const subPages = new Set(subParams.map((p) => `${p.service}/${p.sub}`))
  const districtName = new Map(districts.map((d) => [d.slug, d.nameNominative ?? d.slug]))

  const serviceLinks: SitemapLink[] = directions.map((s) => ({
    name: s.title,
    href: `/${s.slug}/`,
    children: (s.subServices ?? [])
      .filter((sub) => sub.slug && sub.title && subPages.has(`${s.slug}/${sub.slug}`))
      .map((sub) => ({ name: shortTitle(sub.title as string), href: `/${s.slug}/${sub.slug}/` })),
  }))

  const geoLinks: SitemapLink[] = directions
    .map((s) => ({
      name: s.title,
      href: `/${s.slug}/`,
      children: sdParams
        .filter((p) => p.service === s.slug)
        .map((p) => ({ name: districtName.get(p.slug) ?? p.slug, href: `/${s.slug}/${p.slug}/` }))
        .sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    }))
    .filter((l) => l.children.length > 0)

  const sections: SitemapSection[] = [
    section('uslugi', serviceLinks),
    ...(geoLinks.length ? [{ title: 'Услуги в районах', links: geoLinks }] : []),
    section(
      'tseny',
      [...directions, ...calculators].map((s) => ({
        name: s.title,
        href: `/uslugi/tseny/${s.slug}/`,
      })),
    ),
    {
      title: 'Сметы и расчёт',
      links: [
        trail('fotoSmeta').at(-1) as Crumb,
        ...calculators.map((s) => ({ name: s.title, href: `/${s.slug}/` })),
      ],
    },
    section(
      'raiony',
      districts
        .filter((d) => d.slug)
        .map((d) => ({ name: d.nameNominative ?? (d.slug as string), href: `/raiony/${d.slug}/` }))
        .sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    ),
    section('kejsy', titled(cases, '/kejsy/')),
    section('b2b', titled(b2b, '/b2b/')),
    section('oKompanii', [
      ...(
        ['komanda', 'garantii', 'kakMyRabotaem', 'otzyvy', 'parkTehniki', 'sroLicenzii'] as const
      ).map((k) => trail(k).at(-1) as Crumb),
      {
        ...(trail('avtory').at(-1) as Crumb),
        children: authors
          .filter((a) => a.slug)
          .map((a) => ({
            name:
              a.fullName ||
              [a.firstName, a.lastName].filter(Boolean).join(' ') ||
              (a.slug as string),
            href: `/avtory/${a.slug}/`,
          })),
      },
    ]),
    section('blog', titled(posts, '/blog/')),
    {
      title: 'Контакты и документы',
      links: [
        trail('kontakty').at(-1) as Crumb,
        { name: 'Политика конфиденциальности', href: PRIVACY_URL },
        { name: 'Согласие на обработку данных', href: CONSENT_URL },
      ],
    },
  ]
  return sections.filter((s) => s.links.length > 0)
})
