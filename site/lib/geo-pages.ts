import type {
  BlockImage,
  FaqV3Block,
  ServiceTile,
  V3BlockWithTone,
} from '@/components/blocks/v3/types'
import { retone } from '@/lib/blocks/v3/retone'
import type { PageData } from '@/lib/pages'
import { hours, minutes, type Company } from '@/lib/offer'

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

/** Факты района: удалённость, бесплатный выезд оценщика, аварийная зона — цифры из «Компания и контакты». */
function districtFacts(
  company: Company,
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
      ...(near.length ? [`Работаем по всему округу: ${near.join(', ')}`] : []),
      km !== null && km <= company.freeVisitRadiusKm
        ? 'Выезд оценщика бесплатно — сегодня или завтра'
        : 'Выезд оценщика — по согласованию',
      km !== null && km <= company.emergencyRadiusKm
        ? `Аварийная бригада — за ${hours(company.emergencyHours)}`
        : 'Аварийный выезд — по согласованию, время назовём при звонке',
      `Окно приезда ${hours(company.arrivalWindowHours)}` +
        (company.lateArrivalDiscountPercent
          ? `, опоздали — скидка ${company.lateArrivalDiscountPercent}%`
          : ''),
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
  company: Company,
  title: string,
  source: string,
  background?: BlockImage | null,
): V3BlockWithTone => ({
  blockType: 'final-form',
  anchor: 'zayavka',
  eyebrow: `Заявка · ответ за ${minutes(company.callbackMinutes)}`,
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

/** «Услуга в районе» — /arboristika/ramenskoye/. */
export function buildServiceDistrictBlocks(args: {
  pillar: PageData
  district: DistrictLike
  sd: ServiceDistrictLike
  otherServices: ServiceTile[]
  source: string
  company: Company
}): { title: string; blocks: V3BlockWithTone[] } {
  const { pillar, district, sd, company } = args
  const hero = pick(pillar.blocks, 'hero-slider')
  const slide = hero?.slides?.[0]
  const priceKicker = (slide?.kicker ?? '').split(' · ')[0]
  const title = sd.seoH1?.trim() || `${pillar.title} ${district.namePrepositional}`
  const lead =
    richToText(sd.leadParagraph) ||
    `${slide?.lead ?? ''} Работаем ${district.namePrepositional} и по всему округу.`.trim()

  const blocks: V3BlockWithTone[] = []
  // За аварийной зоной аварийную бригаду не обещаем (оффер, п. 5) — убираем это из плашки
  const far = (district.distanceFromMkad ?? 0) > company.emergencyRadiusKm
  const badge =
    hero?.badge && far && /аварийн/i.test(hero.badge.note ?? '')
      ? { ...hero.badge, note: `Смета по фото — за ${minutes(company.photoEstimateMinutes)}` }
      : hero?.badge
  if (hero && slide) {
    blocks.push({
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
    })
  }
  const tiles = pick(pillar.blocks, 'services-tiles')
  if (tiles) blocks.push({ ...tiles, title: `${tiles.title} ${district.namePrepositional}` })
  const prices = pick(pillar.blocks, 'price-tabs')
  if (prices) {
    const note = sd.localPriceNote?.trim()
    blocks.push({
      ...prices,
      title: `Цены ${district.namePrepositional}`,
      tabs: note
        ? prices.tabs.map((t, i) => (i === 0 ? { ...t, notes: [...(t.notes ?? []), note] } : t))
        : prices.tabs,
    })
  }
  const calc = pick(pillar.blocks, 'calculator-v3')
  if (calc) blocks.push(calc)
  blocks.push(
    districtFacts(
      company,
      district,
      `Работаем ${district.namePrepositional}`,
      `${district.nameNominative} — ${district.distanceFromMkad ?? '…'} км от МКАД. Бригада приезжает в согласованное окно, смету присылаем по фото до выезда.`,
    ),
  )
  for (const type of ['projects', 'steps', 'guarantees', 'reviews-v3'] as const) {
    const b = pick(pillar.blocks, type)
    if (b) blocks.push(b)
  }
  const faq = pick(pillar.blocks, 'faq-v3')
  const localFaq: FaqV3Block['items'] = (sd.localFaq ?? [])
    .map((q) => ({ question: q.question, answer: richToText(q.answer) }))
    .filter((q) => q.question && q.answer)
  if (faq || localFaq.length) {
    blocks.push({
      blockType: 'faq-v3',
      eyebrow: 'Вопросы',
      title: `Частые вопросы ${district.namePrepositional}`,
      items: [...localFaq, ...(faq?.items ?? [])].slice(0, 8),
    })
  }
  if (args.otherServices.length) {
    blocks.push({
      blockType: 'services-tiles',
      eyebrow: 'Ещё в районе',
      title: `Что ещё делаем ${district.namePrepositional}`,
      link: { label: `Всё ${district.namePrepositional}`, href: `/raiony/${district.slug}/` },
      items: args.otherServices,
    })
  }
  const pillarForm = pick(pillar.blocks, 'final-form')
  blocks.push(
    form(
      company,
      `Оставьте заявку ${district.namePrepositional} — перезвоним за ${minutes(company.callbackMinutes)}`,
      args.source,
      pillarForm?.background,
    ),
  )
  return { title, blocks: retone(blocks) }
}

/** Район — /raiony/ramenskoye/: все направления со ссылками на местные страницы. */
export function buildDistrictBlocks(args: {
  uslugi: PageData
  district: DistrictLike
  services: ServiceTile[]
  company: Company
}): { title: string; blocks: V3BlockWithTone[] } {
  const { uslugi, district, company } = args
  const hero = pick(uslugi.blocks, 'hero-slider')
  const slide = hero?.slides?.[0]
  const title = `Обиход ${district.namePrepositional}`
  const blocks: V3BlockWithTone[] = []
  if (hero && slide) {
    blocks.push({
      ...hero,
      slides: [
        {
          ...slide,
          kicker:
            `${district.distanceFromMkad ?? ''} км от МКАД · ${district.nameNominative}`.replace(
              /^ км от МКАД · /,
              '',
            ),
          title,
          lead: `Деревья, мусор, крыши и снег, демонтаж и благоустройство ${district.namePrepositional} и по всему округу — одна бригада и одна смета. Уборка и вывоз отходов наших работ — в цене.`,
        },
      ],
    })
  }
  blocks.push({
    blockType: 'services-tiles',
    anchor: 'uslugi',
    eyebrow: 'Услуги',
    title: `Что делаем ${district.namePrepositional}`,
    link: { label: 'Все цены', href: '/uslugi/tseny/' },
    items: args.services,
  })
  blocks.push(
    districtFacts(
      company,
      district,
      `Как работаем ${district.namePrepositional}`,
      `${district.nameNominative} — ${district.distanceFromMkad ?? '…'} км от МКАД. Смету присылаем по фото до выезда, бригада приезжает в согласованное окно.`,
    ),
  )
  for (const type of ['steps', 'photo-cta', 'reviews-v3'] as const) {
    const b = pick(uslugi.blocks, type)
    if (b) blocks.push(b)
  }
  const faq = pick(uslugi.blocks, 'faq-v3')
  if (faq) blocks.push({ ...faq, title: `Частые вопросы ${district.namePrepositional}` })
  blocks.push(
    form(
      company,
      `Оставьте заявку ${district.namePrepositional} — перезвоним за ${minutes(company.callbackMinutes)}`,
      `raion-${district.slug}`,
    ),
  )
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
    .map((t) => {
      const pillar = t.href.replace(/^\/|\/$/g, '')
      return localPages.has(`${pillar}/${districtSlug}`)
        ? { ...t, href: `/${pillar}/${districtSlug}/` }
        : t
    })
    .filter((t) => !exclude || !t.href.startsWith(`/${exclude}/`))
}
