/**
 * Programmatic SD Batch Generator (US-3 Stage 3 W12-W13 Wave 1 Run 2).
 *
 * Генерирует 60 JSON-fixtures для sub-level SD URL'ов
 * `/<pillar>/<sub>/<district>/` × 4 priority-B districts × 15 sub per district.
 *
 * Архитектура: 50% shared base (template constants per pillar) + 50% district-
 * specific (h1, hero, tldr, district-block в text-content, ≥2 localFaq, mini-case
 * placeholder с landmark, lead-form, neighbor-districts, LocalBusiness schema).
 *
 * Output dir: site/content/stage3-w13-sd/
 *
 * Sub-services shortlist sustained от seosite/03-clusters/priority-b-districts.md §7.2.
 * Sub-service slugs матчат реальные `services.subServices[].slug` в Payload
 * (verified against DB 2026-05-02).
 *
 * Anti Scaled-Content-Abuse:
 *   - hero.h1 unique per (sub × district)
 *   - tldr unique через highway / landmark / okrug variables
 *   - district-block в text-content unique (~200 unique слов)
 *   - mini-case placeholder с landmark из района
 *   - ≥2 localFaq unique (template Q × district vars)
 *   - в сумме ~30-40% контента unique per SD
 *
 * Publish-gate: publishStatus="draft" + noindexUntilCase=true (mini-case bind в
 * Wave 1 Run 3). Каждое SD имеет:
 *   - 1 hero
 *   - 1 text-content ≥300 слов (district-block + shared base)
 *   - 1 lead-form
 *   - mini-case placeholder
 *   - ≥2 localFaq
 *
 * Honest data: НЕ выдумываем ICAO / Минтранс / СРО номера. «Лицензия СРО
 * №<TODO operator>» placeholder.
 *
 * Использование:
 *   pnpm tsx --require=./scripts/_payload-cjs-shim.cjs scripts/generate-sd-batch-stage3.ts
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const SITE_ROOT = resolve(SCRIPT_DIR, '..')
const OUTPUT_DIR = resolve(SITE_ROOT, 'content/stage3-w13-sd')

// ─────────────────────── Districts (priority-B) ───────────────────────

interface District {
  slug: string
  nameNominative: string
  namePrepositional: string
  nameDative: string
  nameGenitive: string
  nameGenitiveBare: string
  nameLocative: string
  shortAdj: string
  okrugFormal: string
  okrugFormalDative: string
  selfReferenceNominative: string
  population: string
  coverageRadius: number
  distanceFromMkad: number
  highway: string
  highwayShort: string
  centerGeo: [number, number]
  landmarks: string[]
  contextualLandmark: string
  nearestPolygon: string
  polygonTimeMin: number
  timeFromPolygon: string
  neighborDistricts: { slug: string; title: string }[]
  pillarAngles: Record<string, string>
}

const DISTRICTS: District[] = [
  {
    slug: 'khimki',
    nameNominative: 'Химки',
    namePrepositional: 'в Химках',
    nameDative: 'по Химкам',
    nameGenitive: 'из Химок',
    nameGenitiveBare: 'Химок',
    nameLocative: 'в Химках',
    shortAdj: 'Химкинскому',
    okrugFormal: 'Химкинский ГО',
    okrugFormalDative: 'Химкинскому ГО',
    selfReferenceNominative: 'сами Химки',
    population: '257 тыс. жителей',
    coverageRadius: 18,
    distanceFromMkad: 26,
    highway: 'А-107 и Ленинградскому шоссе',
    highwayShort: 'А-107',
    centerGeo: [37.4452, 55.8893],
    landmarks: ['Сходня', 'Левобережный', 'Старые Химки', 'Подрезково', 'Планерная', 'КП Куркино'],
    contextualLandmark: 'грузовой терминал Шереметьево',
    nearestPolygon: 'Солнечногорском районе',
    polygonTimeMin: 35,
    timeFromPolygon: 'послезавтра до 12:00',
    neighborDistricts: [
      { slug: 'krasnogorsk', title: 'Красногорск' },
      { slug: 'mytishchi', title: 'Мытищи' },
      { slug: 'odincovo', title: 'Одинцово' },
    ],
    pillarAngles: {
      'vyvoz-musora': 'Шереметьево-cargo B2B-режим: контейнеры 27 м³, SLA 4 часа, договор на сезон',
      arboristika:
        'ЖК-территории и приаэродромная зона: спил с автовышки 22 м, кронирование под FOD-prevention',
      'chistka-krysh': 'ЖК-новостройки и cargo-кровли Шереметьево: договор на сезон с SLA',
      demontazh: 'Авиа-склады и промзоны: демонтаж промышленный, снос складских конструкций',
    },
  },
  {
    slug: 'pushkino',
    nameNominative: 'Пушкино',
    namePrepositional: 'в Пушкино',
    nameDative: 'по Пушкино',
    nameGenitive: 'из Пушкино',
    nameGenitiveBare: 'Пушкино',
    nameLocative: 'в Пушкино',
    shortAdj: 'Пушкинскому',
    okrugFormal: 'Пушкинский ГО',
    okrugFormalDative: 'Пушкинскому ГО',
    selfReferenceNominative: 'само Пушкино',
    population: '105 тыс. жителей',
    coverageRadius: 22,
    distanceFromMkad: 30,
    highway: 'Ярославскому шоссе',
    highwayShort: 'Ярославка',
    centerGeo: [37.8472, 56.0094],
    landmarks: ['Звягино', 'Новая Деревня', 'Клязьма', 'Тарасовка', 'СНТ Лесные Поляны'],
    contextualLandmark: 'СНТ и лесные участки',
    nearestPolygon: 'Сергиево-Посадском районе',
    polygonTimeMin: 45,
    timeFromPolygon: 'послезавтра до 12:00',
    neighborDistricts: [
      { slug: 'mytishchi', title: 'Мытищи' },
      { slug: 'khimki', title: 'Химки' },
      { slug: 'ramenskoye', title: 'Раменское' },
    ],
    pillarAngles: {
      'vyvoz-musora': 'СНТ-сезонный (May-Oct): садовый мусор, контейнеры под расчистку участка',
      arboristika:
        'Лесная зона + СНТ: спил высоких сосен, расчистка под застройку коттеджа 6-30 соток',
      'chistka-krysh': 'Дачные коттеджи и двускатные кровли: сбивание сосулек, очистка от снега',
      demontazh: 'СНТ старые срубы 1960-80-х: демонтаж дачи, бани, сарая под новую застройку',
    },
  },
  {
    slug: 'istra',
    nameNominative: 'Истра',
    namePrepositional: 'в Истре',
    nameDative: 'по Истре',
    nameGenitive: 'из Истры',
    nameGenitiveBare: 'Истры',
    nameLocative: 'в Истре',
    shortAdj: 'Истринскому',
    okrugFormal: 'Истринский ГО',
    okrugFormalDative: 'Истринскому ГО',
    selfReferenceNominative: 'сама Истра',
    population: '35 тыс. жителей + 200 тыс. дачников летом',
    coverageRadius: 25,
    distanceFromMkad: 50,
    highway: 'Новорижскому шоссе',
    highwayShort: 'Новорижка',
    centerGeo: [36.8584, 55.9148],
    landmarks: [
      'Истринское водохранилище',
      'Дедовск',
      'Снегири',
      'Букарёво',
      'КП Резиденция Рублёво-Истра',
    ],
    contextualLandmark: 'Истринское водохранилище и дачные посёлки',
    nearestPolygon: 'Волоколамском районе',
    polygonTimeMin: 55,
    timeFromPolygon: 'через 2 рабочих дня до 12:00',
    neighborDistricts: [
      { slug: 'krasnogorsk', title: 'Красногорск' },
      { slug: 'khimki', title: 'Химки' },
      { slug: 'odincovo', title: 'Одинцово' },
    ],
    pillarAngles: {
      'vyvoz-musora':
        'Большие дачные участки 30-100 соток: контейнеры под расчистку, садовый мусор',
      arboristika: 'Лес у водохранилища: спил высоких деревьев, расчистка участка под застройку',
      'chistka-krysh': 'ВД-зона: ливневые наводнения требуют чистки кровли и водостоков',
      demontazh: 'Старые дачи 1960-80-х под снос: демонтаж дачи, бани, замена забора',
    },
  },
  {
    slug: 'zhukovsky',
    nameNominative: 'Жуковский',
    namePrepositional: 'в Жуковском',
    nameDative: 'по Жуковскому',
    nameGenitive: 'из Жуковского',
    nameGenitiveBare: 'Жуковского',
    nameLocative: 'в Жуковском',
    shortAdj: 'Жуковскому',
    okrugFormal: 'Жуковский ГО',
    okrugFormalDative: 'Жуковскому ГО',
    selfReferenceNominative: 'сам Жуковский',
    population: '105 тыс. жителей',
    coverageRadius: 18,
    distanceFromMkad: 36,
    highway: 'Володарскому шоссе',
    highwayShort: 'Володарка',
    centerGeo: [38.1196, 55.6004],
    landmarks: ['ЛИИ им. Громова', 'аэродром Раменское', 'ЦАГИ', 'мкр. Стрелка', 'мкр. Колонец'],
    contextualLandmark: 'ЛИИ им. Громова и аэродром Раменское',
    nearestPolygon: 'Раменском районе',
    polygonTimeMin: 30,
    timeFromPolygon: 'послезавтра до 12:00',
    neighborDistricts: [
      { slug: 'ramenskoye', title: 'Раменское' },
      { slug: 'mytishchi', title: 'Мытищи' },
      { slug: 'pushkino', title: 'Пушкино' },
    ],
    pillarAngles: {
      'vyvoz-musora': 'Авиапром и ЛИИ: контейнеры под промышленные объёмы, B2B договор',
      arboristika:
        'Приаэродромная зона: кронирование под нормы безопасности полётов, спил деревьев',
      'chistka-krysh': 'Промобъекты ЛИИ и ЦАГИ + жилой сектор: договор на сезон, чистка МКД',
      demontazh: 'Снос частного сектора у периметра ЛИИ и ЦАГИ: дачи, заборы, крупный демонтаж',
    },
  },
]

// ─────────────────────── Sub-services per district shortlist ───────────────────────
// Sustained от seosite/03-clusters/priority-b-districts.md §7.2.
// ВСЕ slug verified против `services.subServices[].slug` в Payload (2026-05-02).
// Маппинги (shortlist key → real Payload slug):
//   sadovyj → vyvoz-sadovogo-musora
//   vyvoz-hlama → dlya-uk-tszh (B2B fallback)
//   kommercheskij → dlya-uk-tszh (B2B fallback)
//   mkd → chistka-krysh-mkd
//   chastnyj-dom → chistka-krysh-chastnyy-dom
//   livnevki → uborka-territorii-zima (closest fit)
//   promobyekty → dogovor-na-sezon (B2B SLA fit)
//   dachi → demontazh-dachi
//   bani → demontazh-bani
//   promyshlennyj → snos-doma (closest fit для priority-B Wave 1)

interface SubServiceRef {
  slug: string // real services.subServices[].slug
  pillar: 'vyvoz-musora' | 'arboristika' | 'chistka-krysh' | 'demontazh'
  shortTitle: string // для H1 / breadcrumb
  shortTitleLow: string // для меты и body
}

const SUB_REGISTRY: Record<string, Omit<SubServiceRef, 'slug'> & { slug: string }> = {
  // vyvoz-musora
  kontejner: {
    slug: 'kontejner',
    pillar: 'vyvoz-musora',
    shortTitle: 'Контейнер 8/20/27 м³',
    shortTitleLow: 'аренда контейнера',
  },
  'vyvoz-stroymusora': {
    slug: 'vyvoz-stroymusora',
    pillar: 'vyvoz-musora',
    shortTitle: 'Вывоз стройотходов',
    shortTitleLow: 'вывоз стройотходов',
  },
  'staraya-mebel': {
    slug: 'staraya-mebel',
    pillar: 'vyvoz-musora',
    shortTitle: 'Вывоз старой мебели',
    shortTitleLow: 'вывоз старой мебели',
  },
  krupnogabarit: {
    slug: 'krupnogabarit',
    pillar: 'vyvoz-musora',
    shortTitle: 'Вывоз крупногабарита',
    shortTitleLow: 'вывоз КГМ',
  },
  gazel: {
    slug: 'gazel',
    pillar: 'vyvoz-musora',
    shortTitle: 'Вывоз мусора Газелью',
    shortTitleLow: 'вывоз мусора газелью',
  },
  'vyvoz-sadovogo-musora': {
    slug: 'vyvoz-sadovogo-musora',
    pillar: 'vyvoz-musora',
    shortTitle: 'Вывоз садового мусора',
    shortTitleLow: 'вывоз садового мусора',
  },
  'dlya-uk-tszh': {
    slug: 'dlya-uk-tszh',
    pillar: 'vyvoz-musora',
    shortTitle: 'Вывоз для УК и ТСЖ',
    shortTitleLow: 'вывоз мусора для УК и ТСЖ',
  },
  // arboristika
  'spil-derevev': {
    slug: 'spil-derevev',
    pillar: 'arboristika',
    shortTitle: 'Спил деревьев',
    shortTitleLow: 'спил деревьев',
  },
  'udalenie-pnya': {
    slug: 'udalenie-pnya',
    pillar: 'arboristika',
    shortTitle: 'Удаление пня',
    shortTitleLow: 'удаление пня',
  },
  'sanitarnaya-obrezka': {
    slug: 'sanitarnaya-obrezka',
    pillar: 'arboristika',
    shortTitle: 'Санитарная обрезка',
    shortTitleLow: 'санитарная обрезка',
  },
  kronirovanie: {
    slug: 'kronirovanie',
    pillar: 'arboristika',
    shortTitle: 'Кронирование',
    shortTitleLow: 'кронирование',
  },
  'raschistka-uchastka': {
    slug: 'raschistka-uchastka',
    pillar: 'arboristika',
    shortTitle: 'Расчистка участка',
    shortTitleLow: 'расчистка участка',
  },
  // chistka-krysh
  'ot-snega': {
    slug: 'ot-snega',
    pillar: 'chistka-krysh',
    shortTitle: 'Чистка крыш от снега',
    shortTitleLow: 'чистка крыш от снега',
  },
  'chistka-krysh-mkd': {
    slug: 'chistka-krysh-mkd',
    pillar: 'chistka-krysh',
    shortTitle: 'Чистка крыш МКД',
    shortTitleLow: 'чистка крыш МКД',
  },
  'sbivanie-sosulek': {
    slug: 'sbivanie-sosulek',
    pillar: 'chistka-krysh',
    shortTitle: 'Сбивание сосулек',
    shortTitleLow: 'сбивание сосулек',
  },
  'dogovor-na-sezon': {
    slug: 'dogovor-na-sezon',
    pillar: 'chistka-krysh',
    shortTitle: 'Договор на сезон чистки',
    shortTitleLow: 'договор на сезон чистки кровель',
  },
  'chistka-krysh-chastnyy-dom': {
    slug: 'chistka-krysh-chastnyy-dom',
    pillar: 'chistka-krysh',
    shortTitle: 'Чистка кровли частного дома',
    shortTitleLow: 'чистка кровли частного дома',
  },
  'uborka-territorii-zima': {
    slug: 'uborka-territorii-zima',
    pillar: 'chistka-krysh',
    shortTitle: 'Уборка территории зимой',
    shortTitleLow: 'уборка территории зимой',
  },
  // demontazh
  'demontazh-dachi': {
    slug: 'demontazh-dachi',
    pillar: 'demontazh',
    shortTitle: 'Демонтаж дачи',
    shortTitleLow: 'демонтаж дачи',
  },
  'demontazh-bani': {
    slug: 'demontazh-bani',
    pillar: 'demontazh',
    shortTitle: 'Демонтаж бани',
    shortTitleLow: 'демонтаж бани',
  },
  'snos-zabora': {
    slug: 'snos-zabora',
    pillar: 'demontazh',
    shortTitle: 'Снос забора',
    shortTitleLow: 'снос забора',
  },
  'snos-doma': {
    slug: 'snos-doma',
    pillar: 'demontazh',
    shortTitle: 'Снос дома',
    shortTitleLow: 'снос дома',
  },
}

const SHORTLIST: Record<string, string[]> = {
  // 15 sub × 4 districts = 60 SD
  khimki: [
    'kontejner',
    'vyvoz-stroymusora',
    'staraya-mebel',
    'krupnogabarit',
    'gazel',
    'vyvoz-sadovogo-musora',
    'dlya-uk-tszh',
    'spil-derevev',
    'udalenie-pnya',
    'sanitarnaya-obrezka',
    'kronirovanie',
    'ot-snega',
    'chistka-krysh-mkd',
    'sbivanie-sosulek',
    'dogovor-na-sezon',
  ],
  pushkino: [
    'vyvoz-sadovogo-musora',
    'vyvoz-stroymusora',
    'kontejner',
    'krupnogabarit',
    'spil-derevev',
    'udalenie-pnya',
    'raschistka-uchastka',
    'kronirovanie',
    'sanitarnaya-obrezka',
    'ot-snega',
    'sbivanie-sosulek',
    'chistka-krysh-chastnyy-dom',
    'demontazh-dachi',
    'demontazh-bani',
    'snos-zabora',
  ],
  istra: [
    'vyvoz-sadovogo-musora',
    'kontejner',
    'vyvoz-stroymusora',
    'spil-derevev',
    'raschistka-uchastka',
    'udalenie-pnya',
    'kronirovanie',
    'ot-snega',
    'sbivanie-sosulek',
    'uborka-territorii-zima',
    'demontazh-dachi',
    'demontazh-bani',
    'snos-zabora',
    'sanitarnaya-obrezka',
    'krupnogabarit',
  ],
  zhukovsky: [
    'vyvoz-stroymusora',
    'kontejner',
    'krupnogabarit',
    'spil-derevev',
    'kronirovanie',
    'udalenie-pnya',
    'dogovor-na-sezon',
    'chistka-krysh-mkd',
    'ot-snega',
    'sbivanie-sosulek',
    'snos-doma',
    'snos-zabora',
    'demontazh-dachi',
    'vyvoz-sadovogo-musora',
    'sanitarnaya-obrezka',
  ],
}

const PILLAR_TITLES: Record<string, string> = {
  'vyvoz-musora': 'Вывоз мусора',
  arboristika: 'Арбористика',
  'chistka-krysh': 'Чистка крыш',
  demontazh: 'Демонтаж',
}

const PILLAR_SHARED_BASE: Record<string, string> = {
  'vyvoz-musora':
    'Цены — за объект, не за тонну. Газель 5 м³ — 4 800 ₽ за один заезд, контейнер 8 м³ — 14 800 ₽, ' +
    '20 м³ — 18 500 ₽, 27 м³ — 23 500 ₽ (подача, сутки на участке, забор, полигон). Продление контейнера ' +
    'на участке — 1 200 ₽ за следующие сутки, ставка единая для всех объёмов.\n\n' +
    'Грузим строительный мусор IV класса (бой кирпича, стяжка, гипсокартон, древесные остатки, окна, ' +
    'двери, упаковка после ремонта), КГМ (старые двери, окна, сантехника, мебель), бытовой мусор, ' +
    'спил деревьев и порубочные остатки.\n\n' +
    'Не грузим: медицинские отходы (классы Б и В по СанПиН), радиоактивные материалы, баллоны под давлением, ' +
    'ртутные лампы, просроченные пестициды и агрохимию, асбестовый шифер (на него отдельная смета по согласованию).\n\n' +
    'По 89-ФЗ за неправильную утилизацию для юрлица штраф 100–250 тыс. ₽. Если в контейнер попало «не наше» — ' +
    'не вывозим без пересмотра сметы. Бригадир по приёмке открывает контейнер, делает фото, при обнаружении ' +
    'спецотходов звонит и согласует замену.',
  arboristika:
    'Цены — за дерево или за участок, фиксируются до начала работ. Спил среднего дерева до 12 м — от 4 800 ₽, ' +
    'аварийный спил у дома — от 12 400 ₽, кронирование высокого дерева с автовышки — от 6 800 ₽ за час техники. ' +
    'Удаление пня корчевателем — от 2 800 ₽ за пень диаметром до 30 см, фрезеровкой до уровня грунта — от 1 800 ₽.\n\n' +
    'Что входит в работу: подъезд бригады, спил с верхушки или с земли (по ситуации), распил на габариты под вывоз, ' +
    'погрузка в Газель или Камаз, вывоз порубочных остатков на лицензированный полигон с актом.\n\n' +
    'Бригадиры с допуском на работу на высоте (СОП-С) и обвязкой ГОСТ Р 12.4.184. Страховка ГО 10 млн ₽ — на случай ' +
    'повреждения соседних построек, кровли, забора, ЛЭП. По крупным посёлкам сначала согласуем порубочный билет с ' +
    'администрацией ГО, чтобы не получить штраф 5–10 тыс. ₽ за самовольный спил.\n\n' +
    'Если участок зарос и нужно одновременно спилить деревья, выкорчевать пни и вывезти спил — закрываем одной ' +
    'бригадой и одной сметой, без передачи между подрядчиками.',
  'chistka-krysh':
    'Цены — за объект (МКД-кровля), за погонный метр (свес от сосулек) или за смену бригады промышленных альпинистов. ' +
    'Чистка кровли частного дома 100–200 м² от снега — от 8 500 ₽ за объект, сбивание сосулек со свеса — от 280 ₽ за ' +
    'погонный метр, аварийный выезд по обращению ЖИ или жалобе — от 18 400 ₽ за объект.\n\n' +
    'Что входит: подъезд бригады, расчистка кровли от снега лопатами с резиновым лезвием (без повреждения кровельного ' +
    'покрытия), сбивание сосулек со свесов, обработка наледи на водостоках, уборка снега с придомовой территории, ' +
    'вывоз снега при необходимости (отдельная позиция в смете).\n\n' +
    'Бригадиры с допуском Минтруда №782н на работу на высоте, обвязкой и страховкой. По крутой кровле работают ' +
    'промышленные альпинисты с парными точками страховки. Не используем трактор и грейдер на кровле — вес и удар ' +
    'повреждают финиш.\n\n' +
    'По договору на сезон с УК и ТСЖ берём аварийный режим: бригада за 1–2 часа после звонка диспетчера 24/7, ' +
    'ноябрь–март. Ответственность подрядчика по штрафам ГЖИ и ОАТИ — наша, без перевыставления заказчику.',
  demontazh:
    'Цены — за объект, фиксируются до начала работ. Демонтаж дачи 60–100 м² — от 65 000 ₽ под ключ ' +
    '(сам снос, разбор материала, погрузка, вывоз на полигон, акт). Демонтаж бани — от 38 000 ₽, ' +
    'снос забора 30–50 м.п. — от 18 400 ₽. Снос капитального дома с фундаментом — от 145 000 ₽ за объект ' +
    'с актом утилизации и протоколом.\n\n' +
    'Что входит: согласование схемы работ с собственником, подача техники (минитрактор, манипулятор или экскаватор ' +
    'по ситуации), демонтаж по очерёдности (кровля → стены → фундамент), сортировка под вывоз ' +
    '(металл, древесина, кирпич, стройотходы), вывоз на лицензированный полигон, акт-приёмки.\n\n' +
    'Бригадиры с допуском на работу с грузоподъёмной техникой (СО-3) и страховкой ГО 10 млн ₽. ' +
    'По объектам у соседних построек или у ЛЭП работаем альпинистами с обвязкой и парной страховкой — ' +
    'без техники там, где она не безопасна.\n\n' +
    'Если на участке после демонтажа остаются спилы деревьев или нужно расчистить площадку под новую стройку — ' +
    'закрываем одной бригадой через арбористику и вывоз мусора, в одну смету и один акт.',
}

// ─────────────────────── Types ───────────────────────

interface CwBlock {
  blockType: string
  [key: string]: unknown
}

interface FaqItem {
  question: string
  answer: string
  isLocal?: boolean
}

interface FixtureLeadParagraph {
  root: {
    type: 'root'
    direction: 'ltr'
    format: ''
    indent: 0
    version: 1
    children: Array<{
      type: 'paragraph'
      direction: 'ltr'
      format: ''
      indent: 0
      version: 1
      textFormat?: 0
      children: Array<{
        type: 'text'
        detail: 0
        format: 0
        mode: 'normal'
        style: ''
        text: string
        version: 1
      }>
    }>
  }
}

interface SDFixture {
  type: 'service-district'
  service: string
  district: string
  subServiceSlug: string
  publishStatus: 'draft' | 'review' | 'published'
  noindexUntilCase: boolean
  computedTitle: string
  leadParagraph: FixtureLeadParagraph
  blocks: CwBlock[]
  miniCase: null
  localFaq: Array<{ question: string; answer: FixtureLeadParagraph }>
  localLandmarks: Array<{ landmarkName: string }>
  localPriceNote: string
  seo: { metaTitle: string; metaDescription: string }
  _meta: Record<string, unknown>
}

// ─────────────────────── Helpers ───────────────────────

function lexicalParagraph(text: string): FixtureLeadParagraph {
  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          textFormat: 0,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length
}

// ─────────────────────── Block builders ───────────────────────

function buildBreadcrumbs(sub: SubServiceRef, district: District): CwBlock {
  return {
    blockType: 'breadcrumbs',
    items: [
      { label: 'Главная', href: '/' },
      { label: PILLAR_TITLES[sub.pillar], href: `/${sub.pillar}/` },
      { label: sub.shortTitle, href: `/${sub.pillar}/${sub.slug}/` },
      {
        label: district.nameNominative,
        href: `/${sub.pillar}/${sub.slug}/${district.slug}/`,
      },
    ],
  }
}

function buildHero(sub: SubServiceRef, district: District): CwBlock {
  const h1 = `${sub.shortTitle} ${district.nameLocative}`
  const angle = district.pillarAngles[sub.pillar]
  const subUsp =
    `Бригада Обихода работает по ${district.shortAdj} округу — ${district.distanceFromMkad} км от МКАД ` +
    `по ${district.highway}. ${angle}. Выезд ${district.timeFromPolygon}.`

  return {
    blockType: 'hero',
    eyebrow: `${PILLAR_TITLES[sub.pillar]} · ${sub.shortTitle} · ${district.nameNominative}`,
    h1,
    subUsp,
    ctaPrimary: {
      label: 'Получить смету по фото',
      href: `/foto-smeta/?service=${sub.pillar}&sub=${sub.slug}&district=${district.slug}`,
    },
    ctaSecondary: { label: 'Позвонить', href: 'tel:+74951234567' },
    trustRow: [
      `${district.distanceFromMkad} км от МКАД`,
      'фикс-цена за объект',
      'полигон в смете',
      'акт-приёмки',
    ],
    image: {
      src: `/uploads/stage3/sd-${sub.pillar}-${sub.slug}-${district.slug}-hero.jpg`,
      alt: `${district.nameNominative} — район выезда бригады Обихода, ${sub.shortTitleLow}`,
      width: 720,
      height: 540,
    },
  }
}

function buildTldr(sub: SubServiceRef, district: District): CwBlock {
  const angle = district.pillarAngles[sub.pillar]
  const body =
    `Делаем ${sub.shortTitleLow} ${district.namePrepositional} и по всему ${district.okrugFormalDative}. ` +
    `${district.distanceFromMkad} км от МКАД по ${district.highway}, выезд ${district.timeFromPolygon}. ` +
    `Работаем с микрорайонами ${district.landmarks.slice(0, 3).join(', ')}. ` +
    `Особенность ${district.nameGenitive}: ${angle.toLowerCase()}. ` +
    `Полигон утилизации — в ${district.nearestPolygon}, плечо ${district.polygonTimeMin} минут. ` +
    `Цена и состав работ фиксируются до подписания договора, акт-приёмки на руки в день выезда.`

  return {
    blockType: 'tldr',
    eyebrow: 'Если коротко',
    body,
  }
}

function buildTextContent(sub: SubServiceRef, district: District): CwBlock {
  const angle = district.pillarAngles[sub.pillar]
  const districtBlock =
    `## ${sub.shortTitle} ${district.namePrepositional} — куда выезжаем\n\n` +
    `Бригада Обихода обслуживает ${district.okrugFormal} (${district.population}) — это ${district.selfReferenceNominative} ` +
    `и микрорайоны ${district.landmarks.join(', ')}, СНТ и коттеджные посёлки в радиусе ` +
    `${district.coverageRadius} километров от центра. От МКАД до центра ${district.nameGenitiveBare} ` +
    `по ${district.highway} — ${district.distanceFromMkad} километров, типовое плечо одной Газели ` +
    `или Камаза. По удалённым адресам округа считаем выезд отдельной строкой 8 000 ₽ за плечо, ` +
    `без скрытой надбавки в смете.\n\n` +
    `Особенность ${district.nameGenitive} для ${PILLAR_TITLES[sub.pillar].toLowerCase()}: ${angle}. ` +
    `Под этот контекст держим бригады со специализацией под ${district.contextualLandmark}. ` +
    `Лицензия СРО №<TODO operator>, страховка ГО 10 млн ₽, акт-приёмки на каждом выезде.\n\n` +
    `## Полигон и плечо вывоза ${district.nameGenitive}\n\n` +
    `Из ${district.nameGenitiveBare} возим бытовой и строительный мусор IV класса опасности на лицензированный ` +
    `полигон в ${district.nearestPolygon} — плечо ${district.polygonTimeMin} минут от центра ` +
    `${district.nameGenitiveBare}. Полигон работает по лицензии Росприроднадзора, адрес и номер карты ` +
    `фиксируется в акте-приёмки на руки в день выезда. Электронную копию акта присылаем в Telegram, ` +
    `MAX или WhatsApp в течение часа после выгрузки.\n\n` +
    `Для собственников частных домов и дачных участков в ${district.shortAdj} округе акт-приёмки ` +
    `нужен для отчётности перед правлением посёлка — у части посёлков это обязательное требование при ` +
    `вывозе крупных объёмов или массовых работах. По договору с УК и ТСЖ ${district.shortAdj} округа ` +
    `берём аварийный режим: бригада на объекте за 1–2 часа 24/7 в зоне 30 минут от обслуживаемых ` +
    `адресов.\n\n## ${sub.shortTitle} — общие правила и цены\n\n${PILLAR_SHARED_BASE[sub.pillar]}\n\n` +
    `## 4-в-1: одна бригада, одна смета\n\n` +
    `Если параллельно с услугой «${sub.shortTitleLow}» нужна другая работа из нашего профиля — ` +
    `арбористика, чистка крыш, вывоз мусора или демонтаж — закрываем одной бригадой через смежные ` +
    `направления ${district.namePrepositional}. Один договор, один счёт, один акт. ` +
    `Это и есть наш формат «4-в-1».`

  return {
    blockType: 'text-content',
    h2: `${sub.shortTitle} ${district.namePrepositional}`,
    tocLabel: 'Содержание',
    tocItems: [
      { id: 'kuda-vyezzhaem', label: `Куда выезжаем по ${district.shortAdj} округу` },
      { id: 'polygon', label: `Полигон и плечо вывоза ${district.nameGenitive}` },
      { id: 'pravila', label: `${sub.shortTitle} — общие правила и цены` },
      { id: '4v1', label: '4-в-1: одна бригада, одна смета' },
    ],
    body: districtBlock,
  }
}

function buildLeadForm(sub: SubServiceRef, district: District): CwBlock {
  return {
    blockType: 'lead-form',
    h2: `Заявка на «${sub.shortTitleLow}» ${district.nameGenitive}`,
    serviceHint: sub.shortTitle,
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
      {
        name: 'objects',
        label: 'Описание объекта',
        type: 'textarea',
        required: false,
        placeholder: `Что нужно сделать (${sub.shortTitleLow}), объём, фото пришлём в Telegram`,
      },
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
      service: sub.pillar,
      sub: sub.slug,
      district: district.slug,
    },
  }
}

function buildMiniCase(sub: SubServiceRef, district: District): CwBlock {
  const landmark = district.landmarks[0]
  return {
    blockType: 'mini-case',
    h2: `Свежие объекты ${district.namePrepositional}`,
    items: [
      {
        imageUrl: `/uploads/stage3/sd-mini-case-${sub.pillar}-${sub.slug}-${district.slug}.jpg`,
        imageAlt: `Объект бригады Обихода — ${sub.shortTitleLow}, ${district.nameNominative}, ${landmark}`,
        title: `${sub.shortTitle} — ${landmark}, ${district.nameNominative}`,
        facts: [
          { label: 'Срок', value: '1 рабочий день' },
          { label: 'Бригада', value: '2–3 человека' },
          { label: 'Объём', value: 'по объекту, фикс-цена' },
          { label: 'Акт', value: 'на руки в день выезда' },
        ],
        labelTag: 'обобщённый объект (плейсхолдер)',
        href: `/${sub.pillar}/${sub.slug}/`,
      },
    ],
    _todo: 'Wave 1 Run 3: cms подменит на реальный кейс из 6-cases pack по району.',
  }
}

function buildFaq(sub: SubServiceRef, district: District): CwBlock {
  const localFaq: FaqItem[] = [
    {
      question: `Как быстро бригада приезжает ${district.namePrepositional} на «${sub.shortTitleLow}»?`,
      answer:
        `По типовой заявке — выезд ${district.timeFromPolygon} по согласованному окну времени. ` +
        `Аварийная (24/7) — за 1–2 часа по тарифу 18 400 ₽ за объект до 5 м³. От МКАД до центра ` +
        `${district.nameGenitiveBare} ${district.distanceFromMkad} км по ${district.highway}. ` +
        `Бригадир созванивается за 30 минут до приезда.`,
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
      question: `Сколько стоит «${sub.shortTitleLow}» ${district.namePrepositional}?`,
      answer:
        `Цены фикс-стартовые до подписания договора и не меняются на месте без согласования. ` +
        `Базовый прайс на работы: см. блок «${sub.shortTitle} — общие правила и цены» выше. ` +
        `Если объект в удалённой части округа (${district.contextualLandmark}, дальше ` +
        `${district.coverageRadius} км от центра) — добавляем плечо 8 000 ₽ отдельной строкой. ` +
        `Электронная смета приходит в Telegram, MAX или WhatsApp за 10 минут после фото.`,
      isLocal: true,
    },
  ]

  return {
    blockType: 'faq',
    h2: `Частые вопросы про «${sub.shortTitleLow}» ${district.namePrepositional}`,
    generateFaqPageSchema: true,
    items: localFaq,
  }
}

function buildCtaBanner(sub: SubServiceRef, district: District): CwBlock {
  return {
    blockType: 'cta-banner',
    variant: 'dark',
    h2: `${sub.shortTitle} ${district.namePrepositional} — заявка за 10 минут`,
    body:
      `Пришлите фото объекта в Telegram, MAX или WhatsApp — посчитаем смету по факту. ` +
      `Если параллельно нужна другая работа (арбористика, вывоз, демонтаж, чистка крыш) — ` +
      `закрываем одной бригадой по формату «4-в-1».`,
    ctaPrimary: {
      label: 'Прислать фото в Telegram',
      href: 'https://t.me/obihod_dispatcher',
    },
    ctaSecondary: {
      label: 'Получить смету по фото',
      href: `/foto-smeta/?service=${sub.pillar}&sub=${sub.slug}&district=${district.slug}`,
    },
  }
}

function buildNeighborDistricts(sub: SubServiceRef, district: District): CwBlock {
  return {
    blockType: 'neighbor-districts',
    h2: 'Если вам в соседний район',
    items: district.neighborDistricts.map((n) => ({
      iconId: `district-${n.slug}`,
      title: n.title,
      href: `/${sub.pillar}/${sub.slug}/${n.slug}/`,
    })),
  }
}

function buildRelatedServices(sub: SubServiceRef, district: District): CwBlock {
  const others = (Object.keys(PILLAR_TITLES) as Array<keyof typeof PILLAR_TITLES>).filter(
    (p) => p !== sub.pillar,
  )
  const items = others.map((p) => ({
    iconId: p,
    title: `${PILLAR_TITLES[p]} ${district.namePrepositional}`,
    description: district.pillarAngles[p],
    href: `/${p}/${district.slug}/`,
  }))
  return {
    blockType: 'related-services',
    h2: `Соседние услуги ${district.namePrepositional}`,
    items,
  }
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

function checkPublishGate(blocks: CwBlock[]): PublishGateCheck {
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

// ─────────────────────── Composer ───────────────────────

function composeSDFixture(sub: SubServiceRef, district: District): SDFixture {
  const breadcrumbs = buildBreadcrumbs(sub, district)
  const hero = buildHero(sub, district)
  const tldr = buildTldr(sub, district)
  const text = buildTextContent(sub, district)
  const miniCase = buildMiniCase(sub, district)
  const leadForm = buildLeadForm(sub, district)
  const faq = buildFaq(sub, district)
  const cta = buildCtaBanner(sub, district)
  const neighbors = buildNeighborDistricts(sub, district)
  const related = buildRelatedServices(sub, district)

  const blocks: CwBlock[] = [
    breadcrumbs,
    hero,
    tldr,
    text,
    leadForm,
    miniCase,
    faq,
    cta,
    neighbors,
    related,
  ]

  const gate = checkPublishGate(blocks)
  if (
    !gate.hasOneHero ||
    !gate.hasTextContent300 ||
    !gate.hasContact ||
    !gate.hasMiniCase ||
    !gate.hasTwoLocalFaq
  ) {
    throw new Error(
      `[gen-sd-stage3] publish-gate FAIL для ${sub.pillar}/${sub.slug}/${district.slug}: ${JSON.stringify(gate)}`,
    )
  }

  // Lead paragraph
  const leadText =
    `Делаем ${sub.shortTitleLow} ${district.namePrepositional} и по всему ${district.okrugFormalDative}. ` +
    `${district.distanceFromMkad} км от МКАД по ${district.highway}, выезд ${district.timeFromPolygon}. ` +
    `${district.pillarAngles[sub.pillar]}. Полигон в смете, акт-приёмки на руки.`

  // localFaq Lexical
  const faqItems = (faq as unknown as { items?: FaqItem[] }).items ?? []
  const localFaqLexical = faqItems
    .filter((i) => i.isLocal === true)
    .map((q) => ({
      question: q.question,
      answer: lexicalParagraph(q.answer),
    }))

  // SEO meta
  const metaTitle = `${sub.shortTitle} ${district.namePrepositional} — Обиход`
  const metaDescription =
    `${sub.shortTitle} ${district.namePrepositional} и по всему ${district.okrugFormalDative}. ` +
    `Фикс-цена за объект, выезд ${district.timeFromPolygon}, полигон в ${district.nearestPolygon}.`

  return {
    type: 'service-district',
    service: sub.pillar,
    district: district.slug,
    subServiceSlug: sub.slug,
    publishStatus: 'draft',
    noindexUntilCase: true,
    computedTitle: `${sub.shortTitle} ${district.namePrepositional}`,
    leadParagraph: lexicalParagraph(leadText),
    blocks,
    miniCase: null,
    localFaq: localFaqLexical,
    localLandmarks: district.landmarks.map((name) => ({ landmarkName: name })),
    localPriceNote:
      `${district.nameLocative} цена та же, что по МО — фикс-сумма за объект, без надбавки за район. ` +
      `По удалённым адресам в радиусе свыше ${district.coverageRadius} км — выезд 8 000 ₽ отдельной строкой.`,
    seo: {
      metaTitle: metaTitle.slice(0, 65),
      metaDescription: metaDescription.slice(0, 160),
    },
    _meta: {
      stage: 'stage3-w13-sd',
      run: 'Wave 1 Run 2 (60 sub SD priority-B)',
      generator: 'site/scripts/generate-sd-batch-stage3.ts',
      shortlist_source: 'seosite/03-clusters/priority-b-districts.md §7.2',
      tov_check: `pnpm tov:check site/content/stage3-w13-sd/${sub.pillar}-${sub.slug}-${district.slug}.json`,
      anti_scaled_content_abuse:
        'h1 + tldr + district-block (text-content) + mini-case + 3 localFaq → 30-40% unique per SD',
      publish_gate: {
        hero: gate.hasOneHero,
        text_300: gate.hasTextContent300,
        text_words: gate.textWordCount,
        contact: gate.hasContact,
        mini_case: gate.hasMiniCase,
        local_faq_2plus: gate.hasTwoLocalFaq,
      },
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
  const breakdownPerDistrict: Record<string, number> = {}

  for (const district of DISTRICTS) {
    const subSlugs = SHORTLIST[district.slug] ?? []
    breakdownPerDistrict[district.slug] = 0

    for (const subKey of subSlugs) {
      const sub = SUB_REGISTRY[subKey]
      if (!sub) {
        errors.push({
          url: `${district.slug}/${subKey}`,
          error: `unknown sub-service registry key "${subKey}"`,
        })
        continue
      }
      try {
        const fixture = composeSDFixture(sub, district)
        const fname = safeFileName([sub.pillar, sub.slug, district.slug])
        writeFileSync(join(OUTPUT_DIR, fname), JSON.stringify(fixture, null, 2) + '\n', 'utf-8')
        const text = fixture.blocks.find((b) => b.blockType === 'text-content') as
          | { body?: string }
          | undefined
        generated.push({
          url: `/${sub.pillar}/${sub.slug}/${district.slug}/`,
          file: fname,
          words: wordCount(text?.body ?? ''),
        })
        breakdownPerDistrict[district.slug]! += 1
      } catch (e) {
        errors.push({
          url: `${sub.pillar}/${sub.slug}/${district.slug}`,
          error: (e as Error).message,
        })
      }
    }
  }

  console.log(`\n[gen-sd-stage3] ✓ generated ${generated.length} SD-fixtures in ${OUTPUT_DIR}`)
  for (const d of DISTRICTS) {
    console.log(`  • ${d.nameNominative} (${d.slug}): ${breakdownPerDistrict[d.slug]}/15`)
  }

  if (errors.length > 0) {
    console.error(`\n[gen-sd-stage3] ✗ ${errors.length} errors:`)
    for (const e of errors) console.error(`  - ${e.url}: ${e.error}`)
    process.exit(1)
  }

  const wordsSorted = generated.map((g) => g.words).sort((a, b) => a - b)
  const min = wordsSorted[0]
  const max = wordsSorted[wordsSorted.length - 1]
  const median = wordsSorted[Math.floor(wordsSorted.length / 2)]
  console.log(`  • text-content body: min=${min} median=${median} max=${max} слов`)

  const manifest = {
    generated_at: new Date().toISOString(),
    total: generated.length,
    breakdown_per_district: breakdownPerDistrict,
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
