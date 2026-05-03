/**
 * Programmatic SD Batch Generator (US-2 Stage 2 W10).
 *
 * Генерирует ~100 JSON-fixtures для programmatic-sd URL'ов
 * `/<pillar>/<sub>/<district>/` (96) + `/arenda-tehniki/avtovyshka/<district>/` (4).
 *
 * Архитектура: 50% shared base (берётся из sub-service stage2-w8) +
 * 50% district-specific (h1, hero eyebrow, tldr, district-block в text-content,
 * mini-case, ≥2 localFaq, lead-form prefill, neighbor-districts, LocalBusiness schema).
 *
 * Anti Scaled-Content-Abuse:
 *   - hero.h1 unique per district
 *   - tldr unique per district (template + landmarks)
 *   - mini-case unique per district (placeholder с landmark из района)
 *   - ≥2 localFaq unique per district (template Q × district variables)
 *   - district-block в text-content unique per district (~150-200 unique слов)
 *   - в сумме ~30-40% контента unique per SD
 *
 * Publish-gate compliance на каждом SD:
 *   - 1 hero
 *   - 1 text-content ≥300 слов (shared + district)
 *   - 1 contact (lead-form)
 *   - mini-case
 *   - ≥2 localFaq
 *
 * TOV-checker compliance: использует только apruv'нутые формулировки из
 * shared base + safe template variables (без анти-паттернов §13/§14).
 *
 * Использование:
 *   pnpm tsx scripts/generate-sd-batch.ts
 *   → создаёт content/stage2-w10-sd-batch/<pillar>-<sub>-<district>.json
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const SITE_ROOT = resolve(SCRIPT_DIR, '..')
const STAGE2_W8_DIR = resolve(SITE_ROOT, 'content/stage2-w8')
const OUTPUT_DIR = resolve(SITE_ROOT, 'content/stage2-w10-sd-batch')

// ─────────────────────── Districts ───────────────────────

interface District {
  slug: string
  nameNominative: string
  namePrepositional: string // «в Одинцово»
  nameDative: string // «по Одинцово»
  nameGenitive: string // «из Одинцово» (с предлогом «из»)
  nameGenitiveBare: string // «Одинцово» / «Красногорска» — для «до центра <X>»
  nameLocative: string // «в Одинцово» (used in H1 title)
  shortAdj: string // «Одинцовскому» — для «...округу одной бригадой» (dative)
  okrugFormal: string // «Одинцовский ГО» (nominative — для названий)
  okrugFormalDative: string // «Одинцовскому ГО» — для «по всему ...»
  selfReferenceNominative: string // «сам Одинцово» / «сами Мытищи» — pluralia tantum-aware
  coverageRadius: number // км
  distanceFromMkad: number // км
  highway: string // основной коридор
  centerGeo: [number, number]
  landmarks: string[] // 3 примера, тип не различаем для cw
  sampleStreet: string // улица для mini-case (вымышленная, обобщённая) — fallback на mkr
  nearestPolygon: string // «Можайский район» / «Мытищинский район»
  polygonTimeMin: number // минут до полигона
  timeFromPolygon: string // «послезавтра до 12:00» / «за 24 часа»
  neighborDistricts: { slug: string; title: string }[]
  courtsJurisdiction: string
}

const DISTRICTS: District[] = [
  {
    slug: 'odincovo',
    nameNominative: 'Одинцово',
    namePrepositional: 'в Одинцово',
    nameDative: 'по Одинцово',
    nameGenitive: 'из Одинцово',
    nameGenitiveBare: 'Одинцово',
    nameLocative: 'в Одинцово',
    shortAdj: 'Одинцовскому',
    okrugFormal: 'Одинцовский ГО',
    okrugFormalDative: 'Одинцовскому ГО',
    selfReferenceNominative: 'сам Одинцово',
    coverageRadius: 20,
    distanceFromMkad: 24,
    highway: 'Минскому шоссе',
    centerGeo: [37.2754, 55.6782],
    landmarks: ['Новая Трёхгорка', 'Барвиха Hills', 'Лесной городок'],
    sampleStreet: 'Можайское шоссе',
    nearestPolygon: 'Можайском районе',
    polygonTimeMin: 35,
    timeFromPolygon: 'послезавтра до 12:00',
    neighborDistricts: [
      { slug: 'krasnogorsk', title: 'Красногорск' },
      { slug: 'mytishchi', title: 'Мытищи' },
      { slug: 'khimki', title: 'Химки' },
    ],
    courtsJurisdiction: 'Администрация Одинцовского ГО',
  },
  {
    slug: 'krasnogorsk',
    nameNominative: 'Красногорск',
    namePrepositional: 'в Красногорске',
    nameDative: 'по Красногорску',
    nameGenitive: 'из Красногорска',
    nameGenitiveBare: 'Красногорска',
    nameLocative: 'в Красногорске',
    shortAdj: 'Красногорскому',
    okrugFormal: 'Красногорский ГО',
    okrugFormalDative: 'Красногорскому ГО',
    selfReferenceNominative: 'сам Красногорск',
    coverageRadius: 20,
    distanceFromMkad: 22,
    highway: 'Волоколамскому шоссе',
    centerGeo: [37.33, 55.8219],
    landmarks: ['Павшинская Пойма', 'Изумрудные Холмы', 'Резиденция Рублёво'],
    sampleStreet: 'Волоколамское шоссе',
    nearestPolygon: 'Красногорском районе',
    polygonTimeMin: 25,
    timeFromPolygon: 'послезавтра до 12:00',
    neighborDistricts: [
      { slug: 'odincovo', title: 'Одинцово' },
      { slug: 'khimki', title: 'Химки' },
      { slug: 'mytishchi', title: 'Мытищи' },
    ],
    courtsJurisdiction: 'Администрация Красногорского ГО',
  },
  {
    slug: 'mytishchi',
    nameNominative: 'Мытищи',
    namePrepositional: 'в Мытищах',
    nameDative: 'по Мытищам',
    nameGenitive: 'из Мытищ',
    nameGenitiveBare: 'Мытищ',
    nameLocative: 'в Мытищах',
    shortAdj: 'Мытищинскому',
    okrugFormal: 'Мытищинский ГО',
    okrugFormalDative: 'Мытищинскому ГО',
    selfReferenceNominative: 'сами Мытищи',
    coverageRadius: 20,
    distanceFromMkad: 17,
    highway: 'Ярославскому шоссе',
    centerGeo: [37.7336, 55.911],
    landmarks: ['Перловский', 'Пироговский', 'Сорочаны'],
    sampleStreet: 'Ярославское шоссе',
    nearestPolygon: 'Пушкинском районе',
    polygonTimeMin: 30,
    timeFromPolygon: 'послезавтра до 12:00',
    neighborDistricts: [
      { slug: 'pushkino', title: 'Пушкино' },
      { slug: 'khimki', title: 'Химки' },
      { slug: 'krasnogorsk', title: 'Красногорск' },
    ],
    courtsJurisdiction: 'Администрация Мытищинского ГО',
  },
  {
    slug: 'ramenskoye',
    nameNominative: 'Раменское',
    namePrepositional: 'в Раменском',
    nameDative: 'по Раменскому',
    nameGenitive: 'из Раменского',
    nameGenitiveBare: 'Раменского',
    nameLocative: 'в Раменском',
    shortAdj: 'Раменскому',
    okrugFormal: 'Раменский ГО',
    okrugFormalDative: 'Раменскому ГО',
    selfReferenceNominative: 'само Раменское',
    coverageRadius: 20,
    distanceFromMkad: 35,
    highway: 'Новорязанскому шоссе',
    centerGeo: [38.2333, 55.5667],
    landmarks: ['Гостица', 'Холодово', 'Дергаево'],
    sampleStreet: 'Новорязанское шоссе',
    nearestPolygon: 'Воскресенском районе',
    polygonTimeMin: 40,
    timeFromPolygon: 'послезавтра до 12:00',
    neighborDistricts: [
      { slug: 'pushkino', title: 'Пушкино' },
      { slug: 'mytishchi', title: 'Мытищи' },
      { slug: 'odincovo', title: 'Одинцово' },
    ],
    courtsJurisdiction: 'Администрация Раменского ГО',
  },
]

// ─────────────────────── Sub-services selection ───────────────────────

/** Top-24 sub из 33: те, у кого wsfreq ≥ 80 ИЛИ они программно нужны для покрытия pillar. */
const SELECTED_SUB_FILES: { file: string; pillar: string }[] = [
  // vyvoz-musora — 7 sub (kontejner, vyvoz-stroymusora, staraya-mebel, krupnogabarit,
  //                       gazel, vyvoz-sadovogo-musora, vyvoz-porubochnyh)
  { file: '01-kontejner.json', pillar: 'vyvoz-musora' },
  { file: '02-vyvoz-stroymusora.json', pillar: 'vyvoz-musora' },
  { file: '03-staraya-mebel.json', pillar: 'vyvoz-musora' },
  { file: '04-krupnogabarit.json', pillar: 'vyvoz-musora' },
  { file: '05-gazel.json', pillar: 'vyvoz-musora' },
  { file: '06-vyvoz-sadovogo-musora.json', pillar: 'vyvoz-musora' },
  { file: '08-vyvoz-porubochnyh.json', pillar: 'vyvoz-musora' },
  // arboristika — 9 sub (spil, kronirovanie, udalenie-pnya, avariynyy-spil,
  //                      sanitarnaya-obrezka, raschistka, valka, izmelchenie, vyrubka-elok)
  { file: '10-spil-derevev.json', pillar: 'arboristika' },
  { file: '11-kronirovanie.json', pillar: 'arboristika' },
  { file: '12-udalenie-pnya.json', pillar: 'arboristika' },
  { file: '13-avariynyy-spil.json', pillar: 'arboristika' },
  { file: '14-sanitarnaya-obrezka.json', pillar: 'arboristika' },
  { file: '15-raschistka-uchastka.json', pillar: 'arboristika' },
  { file: '18-valka-derevev.json', pillar: 'arboristika' },
  { file: '19-izmelchenie-vetok.json', pillar: 'arboristika' },
  { file: '21-vyrubka-elok.json', pillar: 'arboristika' },
  // chistka-krysh — 3 sub (chastnyy-dom, mkd, sbivanie-sosulek)
  { file: '22-chistka-krysh-chastnyy-dom.json', pillar: 'chistka-krysh' },
  { file: '23-chistka-krysh-mkd.json', pillar: 'chistka-krysh' },
  { file: '24-sbivanie-sosulek.json', pillar: 'chistka-krysh' },
  // demontazh — 5 sub (dachi, bani, saraya, snos-doma, snos-garazha)
  { file: '28-demontazh-dachi.json', pillar: 'demontazh' },
  { file: '29-demontazh-bani.json', pillar: 'demontazh' },
  { file: '30-demontazh-saraya.json', pillar: 'demontazh' },
  { file: '31-snos-doma.json', pillar: 'demontazh' },
  { file: '32-snos-garazha.json', pillar: 'demontazh' },
]
// Total: 7 + 9 + 3 + 5 = 24 sub-services

// ─────────────────────── Pillar titles & icons (для cross-sell) ───────────────────────

const PILLAR_TITLES: Record<string, string> = {
  'vyvoz-musora': 'Вывоз мусора',
  arboristika: 'Арбористика',
  'chistka-krysh': 'Чистка крыш',
  demontazh: 'Демонтаж',
}

// ─────────────────────── Types ───────────────────────

interface SubService {
  url: string
  slug: string
  parentSlug: string
  h1: string
  metaTitle: string
  metaDescription: string
  blocks: SubBlock[]
  _meta?: { wsfreq_target?: number; cluster?: string }
}

interface SubBlock {
  blockType: string
  [key: string]: unknown
}

// ─────────────────────── Helpers ───────────────────────

function loadSub(file: string): SubService {
  const raw = readFileSync(join(STAGE2_W8_DIR, file), 'utf-8')
  return JSON.parse(raw) as SubService
}

/** Извлекает короткое название sub без цены (первая часть до « —») и убирает гео-обвязку «в Москве и МО». */
function shortSubTitle(sub: SubService): string {
  const m = sub.h1.match(/^(.+?)\s+—/)
  let title = m ? m[1].trim() : sub.h1
  // Убираем гео-хвост «в Москве и МО» / «в москве и мо» / «по Москве и МО» — иначе при склейке
  // с district получается «Спил деревьев в Москве и МО в Красногорске».
  title = title
    .replace(/\s+(в|по)\s+Москв[еа-я]+\s+и\s+МО\s*$/iu, '')
    .replace(/\s+(в|по)\s+Москв[еа-я]+\s*$/iu, '')
    .trim()
  return title
}

/** Берёт тарифы/factы из shared sub-блоков без модификации. */
function pickSubBlock(sub: SubService, blockType: string): SubBlock | undefined {
  return sub.blocks.find((b) => b.blockType === blockType)
}

/** Считает слова в строке (rough — для лога). */
function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length
}

// ─────────────────────── Block builders ───────────────────────

function buildBreadcrumbs(sub: SubService, district: District): SubBlock {
  const subTitleShort = shortSubTitle(sub)
  return {
    blockType: 'breadcrumbs',
    items: [
      { label: 'Главная', href: '/' },
      { label: PILLAR_TITLES[sub.parentSlug], href: `/${sub.parentSlug}/` },
      { label: subTitleShort, href: `/${sub.parentSlug}/${sub.slug}/` },
      {
        label: district.nameNominative,
        href: `/${sub.parentSlug}/${sub.slug}/${district.slug}/`,
      },
    ],
  }
}

function buildHero(sub: SubService, district: District): SubBlock {
  const subTitleShort = shortSubTitle(sub)
  // h1 unique: «<sub-title> в <district-locative>»
  const h1 = `${subTitleShort} ${district.nameLocative}`

  // Берём sub-USP из sub-service hero и добавляем district context
  const subHero = pickSubBlock(sub, 'hero')
  const subSubUsp = (subHero?.subUsp as string) ?? ''
  // Заменяем «по Москве и МО» → район-привязка
  const localized = subSubUsp.replace(
    /(по\s+Москв[еа-я]+\s+и\s+МО|в\s+Москв[еа-я]+\s+и\s+МО|по\s+Москв[еа-я]+|в\s+Москв[еа-я]+)/giu,
    `по ${district.shortAdj} округу`,
  )

  return {
    blockType: 'hero',
    eyebrow: `${PILLAR_TITLES[sub.parentSlug]} · ${subTitleShort} · ${district.nameNominative}`,
    h1,
    subUsp: localized || `Бригада Обихода работает по ${district.shortAdj} округу.`,
    ctaPrimary: {
      label: 'Получить смету по фото',
      href: `/foto-smeta/?service=${sub.parentSlug}&sub=${sub.slug}&district=${district.slug}`,
    },
    ctaSecondary: { label: 'Позвонить', href: 'tel:+74951234567' },
    trustRow: [
      `${district.distanceFromMkad} км от МКАД`,
      'район-привязка',
      'акт-приёмки',
      '24 ч выезд',
    ],
    image: {
      src: `TBD-fal.ai-sd-${sub.parentSlug}-${sub.slug}-${district.slug}-hero.png`,
      alt: `${district.nameNominative} — район выезда бригады Обихода, ${subTitleShort.toLowerCase()}`,
      width: 720,
      height: 540,
    },
  }
}

function buildTldr(sub: SubService, district: District): SubBlock {
  const subTitleShort = shortSubTitle(sub).toLowerCase()
  // Шаблон unique per district через highway + landmarks + okrug
  const body =
    `Делаем ${subTitleShort.toLowerCase()} ${district.namePrepositional} и по всему ${district.okrugFormalDative}. ` +
    `${district.distanceFromMkad} км от МКАД ${
      district.highway === 'Минскому шоссе' ? 'по' : 'по'
    } ${district.highway}, выезд ${district.timeFromPolygon}. ` +
    `Работаем с микрорайонами ${district.landmarks.slice(0, 3).join(', ')}. ` +
    `Полигон утилизации — в ${district.nearestPolygon}, плечо ${district.polygonTimeMin} минут. ` +
    `Цена и состав работ фиксируются до подписания договора, акт-приёмки на руки в день выезда.`

  return {
    blockType: 'tldr',
    eyebrow: 'Если коротко',
    body,
  }
}

function buildTextContent(sub: SubService, district: District): SubBlock {
  const subTitleShort = shortSubTitle(sub)
  const subTitleLow = subTitleShort.toLowerCase()
  const subTextBlock = pickSubBlock(sub, 'text-content')
  const subBody = (subTextBlock?.body as string) ?? ''

  // ─ Уникальный district-block (~200 слов) — идёт первым ─
  const districtBlock =
    `## ${subTitleShort} ${district.namePrepositional} — куда выезжаем\n\n` +
    `Бригада Обихода обслуживает ${district.okrugFormal} — это ${district.selfReferenceNominative} ` +
    `и микрорайоны ${district.landmarks.join(', ')}, СНТ и коттеджные посёлки в радиусе ` +
    `${district.coverageRadius} километров от центра. От МКАД до центра ${district.nameGenitiveBare} ` +
    `по ${district.highway} — ${district.distanceFromMkad} километров, типовое плечо одной Газели ` +
    `или Камаза. По удалённым адресам округа считаем выезд отдельной строкой 8 000 ₽ за плечо.\n\n` +
    `Типичные адреса по ${district.shortAdj} округу — частные дома и дачные участки в коттеджных ` +
    `посёлках, квартиры в самом ${district.nameNominative} после ремонта, объекты УК и ТСЖ ` +
    `на придомовой территории МКД. С местными правилами СНТ ${district.shortAdj} округа знакомы — ` +
    `у части посёлков есть требование о вывозе строительного мусора в течение 5 рабочих дней ` +
    `с момента демонтажа, мы укладываемся в окно.\n\n` +
    `## Полигон и плечо вывоза ${district.nameGenitive}\n\n` +
    `${district.nameGenitive} возим бытовой мусор IV класса опасности на лицензированный полигон ` +
    `в ${district.nearestPolygon} — плечо ${district.polygonTimeMin} минут от центра ` +
    `${district.nameGenitiveBare}. Полигон работает по лицензии Росприроднадзора, адрес и номер карты ` +
    `фиксируется в акте-приёмки на руки в день выезда. Электронную копию акта присылаем в Telegram ` +
    `или MAX в течение часа после выезда.\n\n` +
    `Для собственников частных домов в коттеджных посёлках ${district.shortAdj} округа акт-приёмки ` +
    `нужен для отчётности перед правлением — у части посёлков это обязательное требование при ` +
    `вывозе крупных объёмов или массовых работах. По договору с УК и ТСЖ ${district.shortAdj} округа ` +
    `берём аварийный режим: бригада на объекте за 1–2 часа 24/7 в зоне 30 минут от обслуживаемых ` +
    `адресов.\n\n`

  // ─ Shared base — текст из sub-service text-content (берём как есть) ─
  // sub.body уже содержит ~1000-1500 слов apruv'нутого контента — это «50% shared»
  const sharedHeading = `## Что входит в ${subTitleLow} — общие правила\n\n`

  const fullBody = districtBlock + sharedHeading + subBody

  // TOC: первые 4 H2 из combined body
  const tocItems = [
    {
      id: 'kuda-vyezzhaem',
      label: `Куда выезжаем по ${district.shortAdj} округу`,
    },
    {
      id: 'polygon',
      label: `Полигон и плечо вывоза ${district.nameGenitive}`,
    },
    {
      id: 'chto-vhodit',
      label: 'Что входит — общие правила',
    },
    {
      id: 'tsena',
      label: 'Цена и фикс-тариф',
    },
  ]

  return {
    blockType: 'text-content',
    h2: `${subTitleShort} ${district.namePrepositional}`,
    tocLabel: 'Содержание',
    tocItems,
    body: fullBody,
  }
}

function buildMiniCase(sub: SubService, district: District): SubBlock {
  const subTitleShort = shortSubTitle(sub)
  const subTitleLow = subTitleShort.toLowerCase()
  // Достаём базовые facts из sub mini-case если есть
  const subMc = pickSubBlock(sub, 'mini-case') as
    | { items?: { facts?: { label: string; value: string }[] }[] }
    | undefined
  const baseFacts = subMc?.items?.[0]?.facts ?? [
    { label: 'Срок', value: '1 день' },
    { label: 'Бригада', value: '2 чел.' },
    { label: 'Объём', value: 'по объекту' },
  ]
  // Ставим district-specific objект (mkr) в title и imageAlt
  const landmark = district.landmarks[0]

  return {
    blockType: 'mini-case',
    h2: `Свежие объекты ${district.namePrepositional}`,
    items: [
      {
        imageUrl: `TBD-fal.ai-sd-mini-case-${sub.parentSlug}-${sub.slug}-${district.slug}.png`,
        imageAlt: `Объект бригады Обихода — ${subTitleLow}, ${district.nameNominative}, микрорайон ${landmark}`,
        title: `${subTitleShort} в микрорайоне ${landmark}`,
        facts: baseFacts,
        labelTag: 'обобщённый объект',
        href: `/${sub.parentSlug}/${sub.slug}/`,
      },
    ],
    _todo: 'До W11 cms подменит на реальный кейс из Cases pack по району.',
  }
}

function buildFaq(sub: SubService, district: District): SubBlock {
  const subTitleShort = shortSubTitle(sub)
  const subTitleLow = subTitleShort.toLowerCase()
  const subFaq = pickSubBlock(sub, 'faq') as { items?: FaqItem[] } | undefined
  const sharedItems: FaqItem[] = (subFaq?.items ?? []).slice(0, 2)

  // 2+ localFaq — uniquely templated per district
  const localFaq: FaqItem[] = [
    {
      question: `Как быстро бригада приезжает ${district.namePrepositional}?`,
      answer:
        `По типовой заявке — выезд ${district.timeFromPolygon} по согласованному окну времени. ` +
        `Аварийная (24/7) — за 1–2 часа по тарифу 18 400 ₽ за объект до 5 м³. От обслуживающей ` +
        `точки до центра ${district.nameGenitiveBare} ${district.distanceFromMkad} км ` +
        `по ${district.highway}. Бригадир созванивается за 30 минут до приезда.`,
      isLocal: true,
    },
    {
      question: `Работаете в микрорайоне ${district.landmarks[0]}?`,
      answer:
        `Да, по всему ${district.shortAdj} округу — ${district.landmarks.join(', ')}, ` +
        `СНТ и коттеджные посёлки в радиусе ${district.coverageRadius} километров от центра. ` +
        `По крупным посёлкам у нас в системе номера машин и ФИО бригадира — пропуск автоматический ` +
        `по согласованному списку. По правилам ряда посёлков нужна выписка из решения собрания ` +
        `или подпись управляющего — оформляем через УК.`,
      isLocal: true,
    },
    {
      question: `На какой полигон увозите ${subTitleLow} ${district.nameGenitive}?`,
      answer:
        `На лицензированный полигон в ${district.nearestPolygon} — плечо ${district.polygonTimeMin} ` +
        `минут от центра ${district.nameGenitiveBare}. Адрес и номер карты фиксируется в акте-приёмки ` +
        `на руки. Электронную копию акта присылаем в Telegram или MAX в течение часа после выезда.`,
      isLocal: true,
    },
  ]

  return {
    blockType: 'faq',
    h2: `Частые вопросы по ${subTitleLow} ${district.namePrepositional}`,
    generateFaqPageSchema: true,
    items: [...localFaq, ...sharedItems],
  }
}

interface FaqItem {
  question: string
  answer: string
  isLocal?: boolean
}

function buildLeadForm(sub: SubService, district: District): SubBlock {
  const subTitleShort = shortSubTitle(sub)
  return {
    blockType: 'lead-form',
    h2: `Заявка ${district.nameGenitive}`,
    serviceHint: subTitleShort,
    districtHint: district.nameNominative,
    fields: [
      { name: 'phone', label: 'Телефон', type: 'tel', required: true, inputmode: 'numeric' },
      { name: 'name', label: 'Имя', type: 'text', required: false },
      {
        name: 'address',
        label: 'Адрес или микрорайон',
        type: 'text',
        required: false,
        placeholder: `Например: ${district.landmarks.slice(0, 2).join(', ')}`,
      },
      { name: 'objects', label: 'Описание объекта', type: 'textarea', required: false },
      {
        name: 'photos',
        label: 'Фото объекта',
        type: 'file',
        multiple: true,
        accept: 'image/*',
      },
    ],
    consentText: 'Согласен на обработку персональных данных по 152-ФЗ.',
    consentHref: '/policy/',
    ctaLabel: 'Получить смету',
    helper: 'Перезвоним в 8:00–22:00 МСК · смета за 10 минут.',
    hiddenFields: {
      service: sub.parentSlug,
      sub: sub.slug,
      district: district.slug,
    },
  }
}

function buildCtaBanner4v1(sub: SubService, district: District): SubBlock {
  return {
    blockType: 'cta-banner',
    variant: 'light',
    h2: `4 услуги в ${district.shortAdj} округе одной бригадой`,
    body:
      `Если параллельно нужна арбористика, чистка крыш, вывоз мусора или демонтаж — ` +
      `считаем одну смету и закрываем одной бригадой. Один договор, один счёт, один акт.`,
    ctaPrimary: {
      label: 'Смета по фото',
      href: `/foto-smeta/?district=${district.slug}`,
    },
    ctaSecondary: {
      label: `Подробно про ${district.nameNominative}`,
      href: `/raiony/${district.slug}/`,
    },
  }
}

function buildNeighborDistricts(sub: SubService, district: District): SubBlock {
  return {
    blockType: 'neighbor-districts',
    h2: 'Если вам в соседний район',
    items: district.neighborDistricts.map((n) => ({
      iconId: `district-${n.slug}`,
      title: n.title,
      href: `/${sub.parentSlug}/${sub.slug}/${n.slug}/`,
    })),
  }
}

function buildSchemaLocalBusiness(sub: SubService, district: District): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Обиход — ${shortSubTitle(sub)} ${district.namePrepositional}`,
    url: `https://obikhod.ru/${sub.parentSlug}/${sub.slug}/${district.slug}/`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: district.nameNominative,
      addressRegion: 'Московская область',
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      longitude: district.centerGeo[0],
      latitude: district.centerGeo[1],
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        longitude: district.centerGeo[0],
        latitude: district.centerGeo[1],
      },
      geoRadius: district.coverageRadius * 1000, // metres
    },
    telephone: '+74951234567',
  }
}

// ─────────────────────── Avtovyshka special ───────────────────────

const AVTOVYSHKA_BASE: SubService = {
  url: '/arenda-tehniki/avtovyshka/',
  slug: 'avtovyshka',
  parentSlug: 'arenda-tehniki',
  h1: 'Аренда автовышки 17–22 м — 6 800 ₽ за смену, выезд послезавтра',
  metaTitle: 'Аренда автовышки 17–22 м — 6 800 ₽/смена, Москва и МО',
  metaDescription:
    'Аренда автовышки 17 м, 22 м с водителем. 6 800 ₽ за смену 4 часа, 12 400 ₽ за полный день. Спил, обрезка, монтаж — допуски Минтруда №782н, страховка ГО 10 млн ₽.',
  blocks: [
    {
      blockType: 'hero',
      eyebrow: 'Аренда техники → Автовышка',
      h1: 'Аренда автовышки 17–22 м — 6 800 ₽ за смену, выезд послезавтра',
      subUsp:
        'Автовышка с водителем по Москве и МО. Спил с верхушки, обрезка кроны, монтаж. Допуски и страховка — наши.',
    } as unknown as SubBlock,
    {
      blockType: 'text-content',
      body:
        '## Что входит в смену\n\n' +
        'Автовышка 17 или 22 метра с водителем категории D и допуском Минтруда №782н, ' +
        'страховка ГО 10 млн ₽, топливо. Смена 4 часа — 6 800 ₽, полный день (8 часов) — 12 400 ₽. ' +
        'Если работа не наша (электрики, монтаж рекламы) — оператор вышки на координацию, ' +
        'свои альпинисты или арбористы — собственника или подрядчика на стороне.\n\n' +
        '## Где работаем — типовые задачи\n\n' +
        'Спил с верхушки на участке без проезда для бригады, обрезка кроны над линией электропередач, ' +
        'монтаж антенн и кондиционеров на МКД, обслуживание фасадов до 22 метров высоты. ' +
        'По сложному рельефу или мягкому грунту — выписываем «не подойдёт» в смете до выезда, ' +
        'не на месте.\n\n' +
        '## Кто водит и что в страховке\n\n' +
        'Водители с допуском Минтруда №782н и не менее 3 лет стажа на технике 17–22 м. ' +
        'Страховка ГО 10 млн ₽ — на случай повреждения имущества третьих лиц при работе с вышки. ' +
        'СОП и инструктаж бригады — до приезда на объект, журнал в кабине вышки.\n\n' +
        '## Цена и оплата\n\n' +
        'Смена 4 часа — 6 800 ₽, полный день — 12 400 ₽. Если смена не закрыта по факту — продление ' +
        'считается каждый следующий час по 1 800 ₽. Топливо в цене. По безналу с НДС для УК, ТСЖ, ' +
        'ИП и юрлиц — счёт-договор, оплата с отсрочкой 5–14 банковских дней.\n\n' +
        '## Доступ и проезд\n\n' +
        'Для автовышки 17 м нужен проезд шириной от 3 метров и площадка размером 5×3 м. ' +
        'Для 22-метровой — от 3,5 м, площадка 6×3,5 м. По грунтовке после дождя не работаем — ' +
        'вес автовышки 12 тонн, после съёма останутся колеи.',
    } as unknown as SubBlock,
    {
      blockType: 'mini-case',
      items: [
        {
          facts: [
            { label: 'Срок', value: '1 смена' },
            { label: 'Техника', value: 'Автовышка 22 м' },
            { label: 'Объём', value: 'спил 3 деревьев' },
            { label: 'Цена', value: '12 400 ₽' },
          ],
        },
      ],
    } as unknown as SubBlock,
    {
      blockType: 'faq',
      items: [
        {
          question: 'Какая высота вышки нужна для дерева 18 метров?',
          answer:
            'Для спила с верхушки дерева 18 метров достаточно автовышки 22 м — бригадир работает ' +
            'на 2-метровом запасе. Для 12–14 м — вышка 17 м.',
        },
        {
          question: 'Можно ли арендовать без водителя?',
          answer:
            'Нет, только с нашим водителем — это требование страховки и СОП. Допуски Минтруда №782н ' +
            'не передаются на сторону.',
        },
      ],
    } as unknown as SubBlock,
  ],
  _meta: { wsfreq_target: 2384, cluster: 'аренда автовышки' },
}

// ─────────────────────── Validation ───────────────────────

interface PublishGateCheck {
  hasOneHero: boolean
  hasTextContent300: boolean
  hasContact: boolean
  hasMiniCase: boolean
  hasTwoLocalFaq: boolean
  textWordCount: number
}

function checkPublishGate(blocks: SubBlock[]): PublishGateCheck {
  const heroCount = blocks.filter((b) => b.blockType === 'hero').length
  const textBlocks = blocks.filter((b) => b.blockType === 'text-content')
  const maxWords = textBlocks.reduce((max, b) => {
    const body = (b.body as string) ?? ''
    return Math.max(max, wordCount(body))
  }, 0)
  const hasContact = blocks.some((b) => b.blockType === 'lead-form' || b.blockType === 'cta-banner')
  const miniCase = blocks.find((b) => b.blockType === 'mini-case')
  const hasMiniCase = miniCase !== undefined
  const faqBlock = blocks.find((b) => b.blockType === 'faq') as { items?: FaqItem[] } | undefined
  const localFaqCount = (faqBlock?.items ?? []).filter((i) => i.isLocal === true).length

  return {
    hasOneHero: heroCount === 1,
    hasTextContent300: maxWords >= 300,
    hasContact,
    hasMiniCase,
    hasTwoLocalFaq: localFaqCount >= 2,
    textWordCount: maxWords,
  }
}

// ─────────────────────── Main composer ───────────────────────

interface SDOutput {
  _meta: Record<string, unknown>
  type: string
  url: string
  slug: string
  parentSlug: string
  districtSlug: string
  districtName: string
  h1: string
  metaTitle: string
  metaDescription: string
  ogImageAlt: string
  heroImageUrl: string
  heroImageAlt: string
  blocks: SubBlock[]
  schema: { localBusiness: Record<string, unknown> }
}

function composeSD(sub: SubService, district: District): SDOutput {
  const subTitleShort = shortSubTitle(sub)
  const subTitleLow = subTitleShort.toLowerCase()
  const url = `${sub.url}${district.slug}/`

  const breadcrumbs = buildBreadcrumbs(sub, district)
  const hero = buildHero(sub, district)
  const tldr = buildTldr(sub, district)
  const text = buildTextContent(sub, district)
  const miniCase = buildMiniCase(sub, district)
  const faq = buildFaq(sub, district)
  const leadForm = buildLeadForm(sub, district)
  const cta4v1 = buildCtaBanner4v1(sub, district)
  const neighbors = buildNeighborDistricts(sub, district)

  const blocks: SubBlock[] = [
    breadcrumbs,
    hero,
    tldr,
    text,
    miniCase,
    leadForm,
    faq,
    cta4v1,
    neighbors,
  ]

  const gate = checkPublishGate(blocks)
  if (
    !gate.hasOneHero ||
    !gate.hasTextContent300 ||
    !gate.hasContact ||
    !gate.hasMiniCase ||
    !gate.hasTwoLocalFaq
  ) {
    throw new Error(`[gen-sd] publish-gate FAIL для ${url}: ${JSON.stringify(gate)}`)
  }

  // metaTitle / metaDescription: district-specific
  const metaTitle = `${subTitleShort} ${district.namePrepositional} — Обиход`
  const metaDescription =
    `Делаем ${subTitleLow} ${district.namePrepositional} и по всему ${district.okrugFormalDative}. ` +
    `${district.distanceFromMkad} км от МКАД, выезд ${district.timeFromPolygon}, ` +
    `полигон в ${district.nearestPolygon}.`

  return {
    _meta: {
      stage: 'stage2-w10-sd-batch',
      run: 'cw Run 5 (programmatic SD batch ~100)',
      wireframe: 'seosite/04-url-map/wireframes/programmatic-sd.md',
      cluster: sub._meta?.cluster ?? `${sub.parentSlug}/${sub.slug} × ${district.slug}`,
      sub_wsfreq: sub._meta?.wsfreq_target,
      generator: 'site/scripts/generate-sd-batch.ts',
      tov_check: `pnpm tov:check site/content/stage2-w10-sd-batch/${sub.parentSlug}-${sub.slug}-${district.slug}.json`,
      ac_match: 'AC-2 (programmatic SD 50/50 shared/specific)',
      anti_scaled_content_abuse:
        'h1 + tldr + district-block (text-content) + mini-case + 2-3 localFaq → 30-40% unique per SD',
      publish_gate: {
        hero: gate.hasOneHero,
        text_300: gate.hasTextContent300,
        text_words: gate.textWordCount,
        contact: gate.hasContact,
        mini_case: gate.hasMiniCase,
        local_faq_2plus: gate.hasTwoLocalFaq,
      },
    },
    type: 'programmatic-sd',
    url,
    slug: district.slug,
    parentSlug: `${sub.parentSlug}/${sub.slug}`,
    districtSlug: district.slug,
    districtName: district.nameNominative,
    h1: (hero as unknown as { h1: string }).h1,
    metaTitle,
    metaDescription,
    ogImageAlt: `${district.nameNominative} — район выезда бригады Обихода, ${subTitleLow}`,
    heroImageUrl: `TBD-fal.ai-sd-${sub.parentSlug}-${sub.slug}-${district.slug}-hero.png`,
    heroImageAlt: `${district.nameNominative} — район выезда бригады Обихода, ${subTitleLow}`,
    blocks,
    schema: {
      localBusiness: buildSchemaLocalBusiness(sub, district),
    },
  }
}

// ─────────────────────── Generate ───────────────────────

function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true })
}

function safeFileName(parts: string[]): string {
  return parts.join('-') + '.json'
}

function main(): void {
  ensureDir(OUTPUT_DIR)

  const generated: { url: string; file: string; words: number }[] = []
  const errors: { url: string; error: string }[] = []

  // 1) Core programmatic: 24 sub × 4 districts = 96 SD
  for (const { file } of SELECTED_SUB_FILES) {
    let sub: SubService
    try {
      sub = loadSub(file)
    } catch (e) {
      errors.push({
        url: file,
        error: `load fail: ${(e as Error).message}`,
      })
      continue
    }
    for (const district of DISTRICTS) {
      try {
        const sd = composeSD(sub, district)
        const fname = safeFileName([sub.parentSlug, sub.slug, district.slug])
        writeFileSync(join(OUTPUT_DIR, fname), JSON.stringify(sd, null, 2) + '\n', 'utf-8')
        const text = sd.blocks.find((b) => b.blockType === 'text-content') as
          | { body?: string }
          | undefined
        generated.push({
          url: sd.url,
          file: fname,
          words: wordCount(text?.body ?? ''),
        })
      } catch (e) {
        errors.push({
          url: `${sub.url}${district.slug}/`,
          error: (e as Error).message,
        })
      }
    }
  }

  // 2) Avtovyshka × 4 priority-A districts (ADR-uМ-18) = 4 SD
  for (const district of DISTRICTS) {
    try {
      const sd = composeSD(AVTOVYSHKA_BASE, district)
      const fname = safeFileName([AVTOVYSHKA_BASE.parentSlug, AVTOVYSHKA_BASE.slug, district.slug])
      writeFileSync(join(OUTPUT_DIR, fname), JSON.stringify(sd, null, 2) + '\n', 'utf-8')
      const text = sd.blocks.find((b) => b.blockType === 'text-content') as
        | { body?: string }
        | undefined
      generated.push({
        url: sd.url,
        file: fname,
        words: wordCount(text?.body ?? ''),
      })
    } catch (e) {
      errors.push({
        url: `${AVTOVYSHKA_BASE.url}${district.slug}/`,
        error: (e as Error).message,
      })
    }
  }

  // ─ Лог итогов ─
  console.log(`\n[gen-sd-batch] ✓ generated ${generated.length} SD-fixtures in ${OUTPUT_DIR}`)
  console.log(
    `  • core programmatic: ${generated.length - DISTRICTS.length} (24 sub × 4 districts)`,
  )
  console.log(`  • avtovyshka × districts: ${DISTRICTS.length} (ADR-uМ-18)`)
  if (errors.length > 0) {
    console.error(`\n[gen-sd-batch] ✗ ${errors.length} errors:`)
    for (const e of errors) console.error(`  - ${e.url}: ${e.error}`)
    process.exit(1)
  }

  // ─ Word-count distribution ─
  const wordsSorted = generated.map((g) => g.words).sort((a, b) => a - b)
  const min = wordsSorted[0]
  const max = wordsSorted[wordsSorted.length - 1]
  const median = wordsSorted[Math.floor(wordsSorted.length / 2)]
  console.log(`  • text-content body: min=${min} median=${median} max=${max} слов`)

  // Manifest
  const manifest = {
    generated_at: new Date().toISOString(),
    total: generated.length,
    sd_fixtures: generated.map((g) => ({ url: g.url, file: g.file, words: g.words })),
  }
  writeFileSync(
    join(OUTPUT_DIR, '_manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf-8',
  )
  console.log(`  • _manifest.json — ${generated.length} entries`)
}

main()

// quiet unused warnings for fs.readdirSync (kept for future glob discovery)
void readdirSync
