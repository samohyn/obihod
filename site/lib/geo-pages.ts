import { ICON_NAMES } from '@/components/blocks/v3/iconNames'
import type { IconName } from '@/components/blocks/v3/shared'
import type {
  DistrictLinkItem,
  BlockImage,
  DocumentItem,
  FaqV3Block,
  ServiceTile,
  V3BlockWithTone,
} from '@/components/blocks/v3/types'
import { retone } from '@/lib/blocks/v3/retone'
import type { PageData } from '@/lib/pages'
import type { Company } from '@/lib/offer'
import { fillTemplate, type PageTemplates } from '@/lib/page-templates'

/**
 * Гео-страницы (план 09, этап 3) собираются из готовых документов, а не хранят свою копию:
 * «услуга в районе» = хаб направления (цены, подуслуги, калькулятор, вопросы) + факты района
 * (удалённость, микрорайоны) + местные поля записи «Услуга × район»; «район» = направления из
 * раздела «Услуги» со ссылками на местные страницы + факты района. Правка хаба или района в админке
 * сразу видна на всех его гео-страницах.
 */

export type DistrictLike = {
  slug: string
  nameNominative: string
  namePrepositional: string
  distanceFromMkad?: number | null
  landmarks?: { name?: string | null; type?: string | null }[] | null
}

export type ServiceDistrictLike = {
  seoH1?: string | null
  leadParagraph?: unknown
  localFaq?: { question: string; answer: unknown }[] | null
  localLandmarks?: { landmarkName?: string | null }[] | null
  localPriceNote?: string | null
  localInfo?:
    | {
        icon?: string | null
        title?: string | null
        text?: string | null
        metaLabel?: string | null
        metaValue?: string | null
      }[]
    | null
}

/** Текст из Lexical: абзацы через пробел. */
export function richToText(value: unknown): string {
  if (typeof value === 'string') return value
  const root = (value as { root?: { children?: unknown[] } } | null)?.root
  if (!root?.children) return ''
  const walk = (nodes: unknown[]): string =>
    nodes
      .map((n) => {
        const node = n as { text?: string; children?: unknown[] }
        if (typeof node.text === 'string') return node.text
        return node.children ? walk(node.children) : ''
      })
      .join('')
  return root.children
    .map((p) => walk([p]))
    .filter(Boolean)
    .join(' ')
    .trim()
}

const pick = <T extends V3BlockWithTone['blockType']>(
  blocks: V3BlockWithTone[],
  type: T,
): Extract<V3BlockWithTone, { blockType: T }> | undefined =>
  blocks.find((b) => b.blockType === type) as Extract<V3BlockWithTone, { blockType: T }> | undefined

const places = (district: DistrictLike, sd?: ServiceDistrictLike): string[] => {
  const local = (sd?.localLandmarks ?? []).map((l) => l.landmarkName ?? '').filter(Boolean)
  const general = (district.landmarks ?? []).map((l) => l.name ?? '').filter(Boolean)
  return [...new Set([...local, ...general])].slice(0, 6)
}

/** Подстановки района для «Шаблонов страниц»: {в районе}, {район}, {км}. */
function placeVars(district: DistrictLike, extra: Record<string, string> = {}) {
  return {
    'в районе': district.namePrepositional,
    район: district.nameNominative,
    км: district.distanceFromMkad ?? '…',
    ...extra,
  }
}

/**
 * Факты района: удалённость, бесплатный выезд оценщика, аварийная зона — цифры из «Компания и
 * контакты», тексты из «Шаблоны страниц» → «Факты и заявка».
 */
function districtFacts(
  company: Company,
  t: PageTemplates,
  district: DistrictLike,
  title: string,
  text: string,
  extra: string[] = [],
): V3BlockWithTone {
  const km = district.distanceFromMkad ?? null
  const near = places(district)
  return {
    blockType: 'about-stats',
    eyebrow: 'Район',
    title,
    text,
    checklist: [
      ...(near.length ? [fillTemplate(t.factsAround, { ориентиры: near.join(', ') })] : []),
      km !== null && km <= company.freeVisitRadiusKm ? t.factsFreeVisit : t.factsFreeVisitFar,
      km !== null && km <= company.emergencyRadiusKm ? t.factsEmergency : t.factsEmergencyFar,
      t.factsWindow,
      ...extra,
    ],
    stats: [
      { value: km !== null ? `${km} км` : '—', label: 'от МКАД' },
      { value: `${company.photoEstimateMinutes} мин`, label: 'смета по фото' },
      { value: `${company.callbackMinutes} мин`, label: 'перезвоним после заявки' },
      { value: '0 ₽', label: 'выезд оценщика' },
    ],
  }
}

const form = (
  t: PageTemplates,
  title: string,
  source: string,
  background?: BlockImage | null,
): V3BlockWithTone => ({
  blockType: 'final-form',
  anchor: 'zayavka',
  eyebrow: t.formEyebrow,
  title,
  background: background ?? {
    url: '/dev-blocks/yard-after.webp',
    alt: 'Чистый участок после работ',
    focus: null,
    illustration: true,
  },
  channels: [],
  formTitle: 'Заявка',
  source,
})

type PlaceVars = ReturnType<typeof placeVars>

export type GeoDistrict = {
  slug: string
  nameNominative: string
  distanceFromMkad?: number | null
  /** [долгота, широта] центра */
  centerGeo?: unknown
}

const lonLat = (v: unknown): [number, number] | null =>
  Array.isArray(v) && v.length === 2 && v.every((x) => typeof x === 'number')
    ? (v as [number, number])
    : null

/** Расстояние между центрами районов, км (гаверсинус). */
function kmBetween(a: [number, number], b: [number, number]): number {
  const rad = Math.PI / 180
  const dLat = (b[1] - a[1]) * rad
  const dLon = (b[0] - a[0]) * rad
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLon / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

/**
 * Ближайшие районы по координатам центров (план 09, этап 7: «гео → соседние районы»). Без
 * координат у района — пусто: ссылки «рядом» по ошибочным данным хуже, чем никаких.
 */
export function nearestDistricts(all: GeoDistrict[], slug: string, n = 4): GeoDistrict[] {
  const here = lonLat(all.find((d) => d.slug === slug)?.centerGeo)
  if (!here) return []
  return all
    .filter((d) => d.slug !== slug && lonLat(d.centerGeo))
    .map((d) => ({ d, km: kmBetween(here, lonLat(d.centerGeo)!) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, n)
    .map((x) => x.d)
}

/** Карточки районов: ведут на страницу услуги в районе, если она есть, иначе — на страницу района. */
export function districtItems(
  districts: GeoDistrict[],
  serviceSlug: string | null,
  localPages: Set<string>,
): DistrictLinkItem[] {
  return districts.map((d) => ({
    slug: d.slug,
    name: d.nameNominative,
    km: d.distanceFromMkad ?? null,
    href:
      serviceSlug && localPages.has(`${serviceSlug}/${d.slug}`)
        ? `/${serviceSlug}/${d.slug}/`
        : `/raiony/${d.slug}/`,
  }))
}

/** Блок «Районы рядом» / «Где работаем» — карточки-ссылки на районы. */
export function districtLinksBlock(
  title: string,
  eyebrow: string,
  items: DistrictLinkItem[],
  anchor: string,
): V3BlockWithTone | null {
  return items.length ? { blockType: 'district-links', title, eyebrow, items, anchor } : null
}

/**
 * Вставка перед финальной формой (форма — последний блок страницы). Фон вставленных блоков
 * чередуется от блока над ними — остальные блоки страницы (в том числе из админки) не трогаем.
 */
export function beforeForm(
  blocks: V3BlockWithTone[],
  extra: (V3BlockWithTone | null)[],
): V3BlockWithTone[] {
  const add = extra.filter((b): b is V3BlockWithTone => b !== null)
  if (!add.length) return blocks
  const found = blocks.findLastIndex((b) => b.blockType === 'final-form')
  const at = found < 0 ? blocks.length : found
  const above = blocks
    .slice(0, at)
    .findLast((b) => !['hero-slider', 'photo-cta', 'final-form', 'b2b-plan'].includes(b.blockType))
  let alt = above?.tone !== 'alt'
  const toned = add.map((b) => {
    const tone = alt ? 'alt' : 'default'
    alt = !alt
    return { ...b, tone } as V3BlockWithTone
  })
  return [...blocks.slice(0, at), ...toned, ...blocks.slice(at)]
}

/** Ссылка на местную страницу района, если она есть: /arboristika/ → /arboristika/istra/. */
export function localHref(href: string, districtSlug: string, localPages: Set<string>): string {
  const path = href.replace(/^\/|\/$/g, '')
  return localPages.has(`${path}/${districtSlug}`) ? `/${path}/${districtSlug}/` : href
}

/** Первый экран гео-страницы: цена и район в надзаголовке, H1 и лид записи (нет своих — по шаблону). */
function geoHero(
  page: PageData,
  district: DistrictLike,
  sd: ServiceDistrictLike,
  company: Company,
  t: PageTemplates,
  vars: PlaceVars,
): { title: string; hero: V3BlockWithTone | null } {
  const hero = pick(page.blocks, 'hero-slider')
  const slide = hero?.slides?.[0]
  const priceKicker = (slide?.kicker ?? '').split(' · ')[0]
  const title = sd.seoH1?.trim() || fillTemplate(t.geoTitle, vars)
  const lead =
    richToText(sd.leadParagraph) ||
    `${slide?.lead ?? ''} ${fillTemplate(t.geoLeadSuffix, vars)}`.trim()
  if (!hero || !slide) return { title, hero: null }
  // За аварийной зоной аварийную бригаду не обещаем (оффер, п. 5) — убираем это из плашки
  const far = (district.distanceFromMkad ?? 0) > company.emergencyRadiusKm
  const badge =
    hero.badge && far && /аварийн/i.test(hero.badge.note ?? '')
      ? { ...hero.badge, note: t.geoFarBadge }
      : hero.badge
  return {
    title,
    hero: {
      ...hero,
      badge,
      slides: [
        {
          ...slide,
          kicker: [priceKicker, district.nameNominative].filter(Boolean).join(' · '),
          title,
          lead,
        },
      ],
    },
  }
}

/** Карточки «Что важно в районе» из записи: кто отвечает, что проверить, как считаем цену. */
function localInfo(sd: ServiceDistrictLike): DocumentItem[] {
  return (sd.localInfo ?? [])
    .filter((i) => i.title?.trim() && i.text?.trim())
    .map((i) => ({
      icon: (ICON_NAMES as readonly string[]).includes(i.icon ?? '') ? (i.icon as IconName) : 'pin',
      title: i.title!.trim(),
      text: i.text!.trim(),
      metaLabel: i.metaLabel ?? null,
      metaValue: i.metaValue ?? null,
    }))
}

/**
 * Середина гео-страницы: цены с местной заметкой, калькулятор, факты района, кейсы, этапы,
 * гарантии, отзывы и вопросы — местные первыми.
 */
function geoBody(
  page: PageData,
  district: DistrictLike,
  sd: ServiceDistrictLike,
  company: Company,
  t: PageTemplates,
  vars: PlaceVars,
): V3BlockWithTone[] {
  const blocks: V3BlockWithTone[] = []
  const prices = pick(page.blocks, 'price-tabs')
  if (prices) {
    const note = sd.localPriceNote?.trim()
    blocks.push({
      ...prices,
      title: fillTemplate(t.geoPricesTitle, vars),
      tabs: note
        ? prices.tabs.map((tab, i) =>
            i === 0 ? { ...tab, notes: [...(tab.notes ?? []), note] } : tab,
          )
        : prices.tabs,
    })
  }
  const calc = pick(page.blocks, 'calculator-v3')
  if (calc) blocks.push(calc)
  blocks.push(
    districtFacts(
      company,
      t,
      district,
      fillTemplate(t.geoFactsTitle, vars),
      fillTemplate(t.geoFactsText, vars),
    ),
  )
  const info = localInfo(sd)
  if (info.length)
    blocks.push({
      blockType: 'documents',
      eyebrow: 'Перед заказом',
      title: fillTemplate(t.geoInfoTitle, vars),
      items: info,
    })
  for (const type of ['projects', 'steps', 'guarantees', 'reviews-v3'] as const) {
    const b = pick(page.blocks, type)
    if (b) blocks.push(b)
  }
  const faq = pick(page.blocks, 'faq-v3')
  const localFaq: FaqV3Block['items'] = (sd.localFaq ?? [])
    .map((q) => ({ question: q.question, answer: richToText(q.answer) }))
    .filter((q) => q.question && q.answer)
  if (faq || localFaq.length) {
    blocks.push({
      blockType: 'faq-v3',
      eyebrow: 'Вопросы',
      title: fillTemplate(t.geoFaqTitle, vars),
      items: [...localFaq, ...(faq?.items ?? [])].slice(0, 8),
    })
  }
  return blocks
}

/**
 * «Услуга в районе» — /arboristika/ramenskoye/. Плитки подуслуг ведут на их страницы в этом районе,
 * если такие страницы есть (localPages — «направление/район» и «направление/подуслуга/район»).
 */
export function buildServiceDistrictBlocks(args: {
  pillar: PageData
  district: DistrictLike
  sd: ServiceDistrictLike
  otherServices: ServiceTile[]
  localPages: Set<string>
  source: string
  company: Company
  templates: PageTemplates
  /** ближайшие районы — ссылки на эту же услугу там (этап 7) */
  nearby?: DistrictLinkItem[]
}): { title: string; blocks: V3BlockWithTone[] } {
  const { pillar, district, sd, company, templates: t } = args
  const vars = placeVars(district, { направление: pillar.title })
  const { title, hero } = geoHero(pillar, district, sd, company, t, vars)
  const blocks: V3BlockWithTone[] = hero ? [hero] : []
  const tiles = pick(pillar.blocks, 'services-tiles')
  if (tiles)
    blocks.push({
      ...tiles,
      title: `${tiles.title} ${district.namePrepositional}`,
      items: tiles.items.map((item) => ({
        ...item,
        href: localHref(item.href, district.slug, args.localPages),
      })),
    })
  blocks.push(...geoBody(pillar, district, sd, company, t, vars))
  if (args.otherServices.length) {
    blocks.push({
      blockType: 'services-tiles',
      eyebrow: 'Ещё в районе',
      title: fillTemplate(t.geoOtherTitle, vars),
      link: { label: fillTemplate(t.geoOtherLink, vars), href: `/raiony/${district.slug}/` },
      items: args.otherServices,
    })
  }
  const near = districtLinksBlock(
    `${pillar.title} в соседних районах`,
    'Рядом',
    args.nearby ?? [],
    'ryadom',
  )
  if (near) blocks.push(near)
  const pillarForm = pick(pillar.blocks, 'final-form')
  blocks.push(form(t, fillTemplate(t.geoFormTitle, vars), args.source, pillarForm?.background))
  return { title, blocks: retone(blocks) }
}

/**
 * «Подуслуга в районе» — /arboristika/spil-derevev/istra/: та же сборка, но из подуслуги и записи
 * «Услуга × район» с этой подуслугой. Блок подуслуги «что ещё сделаем» — в конце; его ссылки ведут
 * на страницы этого района, где они есть.
 */
export function buildSubServiceDistrictBlocks(args: {
  sub: PageData
  district: DistrictLike
  sd: ServiceDistrictLike
  localPages: Set<string>
  source: string
  company: Company
  templates: PageTemplates
}): { title: string; blocks: V3BlockWithTone[] } {
  const { sub, district, sd, company, templates: t } = args
  const vars = placeVars(district, { направление: sub.title })
  const { title, hero } = geoHero(sub, district, sd, company, t, vars)
  const blocks: V3BlockWithTone[] = hero ? [hero] : []
  blocks.push(...geoBody(sub, district, sd, company, t, vars))
  const tiles = pick(sub.blocks, 'services-tiles')
  if (tiles) {
    const local = (href: string) => localHref(href, district.slug, args.localPages)
    blocks.push({
      ...tiles,
      link: tiles.link ? { ...tiles.link, href: local(tiles.link.href) } : tiles.link,
      items: tiles.items.map((item) => ({ ...item, href: local(item.href) })),
    })
  }
  const subForm = pick(sub.blocks, 'final-form')
  blocks.push(form(t, fillTemplate(t.geoFormTitle, vars), args.source, subForm?.background))
  return { title, blocks: retone(blocks) }
}

/** Район — /raiony/ramenskoye/: все направления со ссылками на местные страницы. */
export function buildDistrictBlocks(args: {
  uslugi: PageData
  district: DistrictLike
  services: ServiceTile[]
  company: Company
  templates: PageTemplates
  /** ближайшие районы (этап 7) */
  nearby?: DistrictLinkItem[]
}): { title: string; blocks: V3BlockWithTone[] } {
  const { uslugi, district, company, templates: t } = args
  const vars = placeVars(district)
  const hero = pick(uslugi.blocks, 'hero-slider')
  const slide = hero?.slides?.[0]
  const title = fillTemplate(t.districtTitle, vars)
  const blocks: V3BlockWithTone[] = []
  if (hero && slide) {
    blocks.push({
      ...hero,
      slides: [
        {
          ...slide,
          // нет удалённости — без «км от МКАД»
          kicker: fillTemplate(t.districtKicker, {
            ...vars,
            км: district.distanceFromMkad ?? '',
          }).replace(/^\s*км от МКАД · /, ''),
          title,
          lead: fillTemplate(t.districtLead, vars),
        },
      ],
    })
  }
  blocks.push({
    blockType: 'services-tiles',
    anchor: 'uslugi',
    eyebrow: 'Услуги',
    title: fillTemplate(t.districtServicesTitle, vars),
    link: { label: 'Все цены', href: '/uslugi/tseny/' },
    items: args.services,
  })
  blocks.push(
    districtFacts(
      company,
      t,
      district,
      fillTemplate(t.districtFactsTitle, vars),
      fillTemplate(t.districtFactsText, vars),
    ),
  )
  for (const type of ['steps', 'photo-cta', 'reviews-v3'] as const) {
    const b = pick(uslugi.blocks, type)
    if (b) blocks.push(b)
  }
  const faq = pick(uslugi.blocks, 'faq-v3')
  if (faq) blocks.push({ ...faq, title: fillTemplate(t.districtFaqTitle, vars) })
  const near = districtLinksBlock('Соседние районы', 'Рядом', args.nearby ?? [], 'ryadom')
  if (near) blocks.push(near)
  blocks.push(form(t, fillTemplate(t.districtFormTitle, vars), `raion-${district.slug}`))
  return { title, blocks: retone(blocks) }
}

/**
 * Направления из раздела «Услуги» со ссылками на местные страницы района: есть опубликованная
 * «услуга в районе» — ведём на неё, нет — на хаб направления.
 */
export function localizeTiles(
  uslugi: PageData | null,
  districtSlug: string,
  localPages: Set<string>,
  exclude?: string,
): ServiceTile[] {
  const tiles = uslugi ? (pick(uslugi.blocks, 'services-tiles')?.items ?? []) : []
  return tiles
    .map((t) => ({ ...t, href: localHref(t.href, districtSlug, localPages) }))
    .filter((t) => !exclude || !t.href.startsWith(`/${exclude}/`))
}
