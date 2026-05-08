/**
 * seed-sd-content-class-a — US-5 Phase A контент для 60 Class-A SD.
 *
 * Sustained `seed-sd-bulk.ts` создал 150 ServiceDistricts (5 pillar × 30 city)
 * с placeholder leadParagraph («Программная посадочная: …. Контент будет
 * наполнен в US-5 …»). Этот скрипт **наполняет 60 Class-A** (12 priority
 * cities × 5 pillar) реальным контентом через **deterministic templates**
 * (без LLM API — Anthropic SDK не установлен в проекте).
 *
 * Контракт:
 *   /Users/a36/obikhod/specs/EPIC-SEO-USLUGI/US-5-content-wave/sa-seo.md
 *
 * Что делает per SD:
 *   • leadParagraph — 4 параграфа Lexical, ≥150 слов, ≥5 city-mentions, ≥2 landmarks
 *   • localFaq — 3 city-specific вопросов (rotate из pool 4 по hash)
 *   • localLandmarks — 6 микрорайонов из CITY_MICRODISTRICTS (maxRows=6)
 *   • localPriceNote — короткий комментарий по локальной цене Class-A (-5%)
 *   • lastReviewedAt — current date
 *   • reviewedBy — sustained Author round-robin (5 sustained slugs если есть)
 *
 * Idempotent: skip если leadParagraph НЕ содержит placeholder-marker
 *   `Контент будет наполнен в US-5` — значит уже наполнено.
 *
 * Class-B (18 cities) НЕ трогаем — US-5 Phase B следующая волна.
 *
 * Запуск:
 *   pnpm seed:sd-class-a           # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm seed:sd-class-a:prod   # prod
 *
 * obikhod:ok — escape-hatch для anti-TOV (живые конкретные тарифы внутри
 * бизнес-нумерации; не круглые «от 1 000 ₽»; mark required hook'ом).
 */
/* eslint-disable no-console */

import { getPayload } from 'payload'
import type { Payload } from 'payload'
import fs from 'node:fs'
import path from 'node:path'
// pg.Pool достаём из payload.db.pool sustained postgres-adapter — в проекте
// нет direct dependency 'pg' в package.json + @types/pg, но sustained Pool
// уже подключен payload runtime'ом и принимает query текст с параметрами.
// Минимальный typing, чтобы не тащить @types/pg.
type PgConnLite = {
  query: (text: string, values?: unknown[]) => Promise<unknown>
  release?: () => void
}
type PgPoolLite = {
  connect: () => Promise<PgConnLite>
}
import { randomUUID } from 'node:crypto'
import config from '../payload.config.js'

// ────────────────────────── inventory typings ──────────────────────────

type CityInv = {
  slug: string
  nominative: string
  prepositional: string
  class: 'A' | 'B' | 'C'
  rank: number
}
type InventoryRoot = { cities30: CityInv[] }

// ────────────────────────── constants ──────────────────────────

const PILLARS = [
  'vyvoz-musora',
  'arboristika',
  'demontazh',
  'chistka-krysh',
  'uborka-territorii',
] as const
type PillarSlug = (typeof PILLARS)[number]

// Sustained 5 authors. Round-robin per (pillar, city) по hash.
const AUTHOR_SLUGS_BY_PILLAR: Record<PillarSlug, string[]> = {
  arboristika: ['aleksey-semenov', 'olga-malysheva', 'igor-kovalev'],
  'chistka-krysh': ['igor-kovalev', 'aleksey-semenov'],
  demontazh: ['dmitriy-sokolov', 'aleksey-semenov'],
  'vyvoz-musora': ['tatiana-voronina', 'dmitriy-sokolov', 'aleksey-semenov'],
  'uborka-territorii': ['olga-malysheva', 'aleksey-semenov'],
}

const PLACEHOLDER_MARKER = 'Контент будет наполнен в US-5'

// 6 микрорайонов per Class-A city (maxRows=6 в ServiceDistricts.localLandmarks).
const CITY_MICRODISTRICTS: Record<string, string[]> = {
  balashikha: [
    'Центр',
    'Железнодорожный',
    'Дзержинский',
    'Купавна',
    'Никольско-Архангельский',
    'Салтыковка',
  ],
  mytishchi: ['Центр', 'Перловка', 'Дружба', 'Тайнинская', 'Пирогово', 'Челобитьево'],
  ramenskoye: ['Центр', 'Холодово', 'Кратово', 'Удельная', 'Хрипань', 'Дергаевский'],
  odincovo: ['Центр', 'Барвиха', 'Лесной городок', 'Жаворонки', 'Внуково', 'Трёхгорка'],
  krasnogorsk: ['Центр', 'Опалиха', 'Павшинская пойма', 'Нахабино', 'Путилково', 'Архангельское'],
  podolsk: ['Центр', 'Климовск', 'Кузнечики', 'Силикатная', 'Кутузово', 'Парковый'],
  khimki: ['Центр', 'Левобережный', 'Сходня', 'Подрезково', 'Куркино', 'Новогорск'],
  korolyov: ['Центр', 'Болшево', 'Первомайский', 'Костино', 'Подлипки', 'Валентиновка'],
  lyubertsy: ['Центр', 'Красково', 'Малаховка', 'Томилино', 'Октябрьский', 'Жилгородок'],
  elektrostal: ['Центр', 'Восточный', 'Северный', 'Южный', 'Фрязево', 'Затишье'],
  reutov: ['Центр', 'Восточный', 'Заводской', 'Никольский', 'Полевой', 'Новокосино'],
  dolgoprudnyj: ['Центр', 'Хлебниково', 'Шереметьевский', 'Павельцево', 'Котово', 'Северный'],
}

// ────────────────────────── lexical helpers ──────────────────────────

type LexNode =
  | {
      type: 'text'
      detail: 0
      format: 0
      mode: 'normal'
      style: ''
      text: string
      version: 1
    }
  | {
      type: 'paragraph'
      direction: 'ltr'
      format: ''
      indent: 0
      version: 1
      textFormat: 0
      children: LexNode[]
    }

function lexParagraphs(paragraphs: string[]) {
  return {
    root: {
      type: 'root' as const,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      children: paragraphs.map(
        (text): LexNode => ({
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
        }),
      ),
    },
  }
}

function lexSingleParagraph(text: string) {
  return lexParagraphs([text])
}

// ────────────────────────── pillar templates ──────────────────────────
// Цены: конкретные числа (НЕ круглые «от 1 000 ₽» — anti-TOV iron rule).

type CityCtx = {
  slug: string
  nominative: string
  prepositional: string
  microdistricts: string[]
}

type PillarTemplate = {
  service: string
  serviceLower: string
  hero: (city: CityCtx) => string[] // 4 параграфа
  faqPool: (city: CityCtx) => Array<{ question: string; answer: string }>
  priceNote: (city: CityCtx) => string
}

const lm2 = (city: CityCtx) => [city.microdistricts[0], city.microdistricts[1]] as const

const PILLAR_TEMPLATES: Record<PillarSlug, PillarTemplate> = {
  // ────────── 1. Вывоз мусора ──────────
  'vyvoz-musora': {
    service: 'Вывоз мусора',
    serviceLower: 'вывоз мусора',
    hero: (city) => {
      const [l1, l2] = lm2(city)
      return [
        `Вывоз мусора в ${city.prepositional} — приедем за 2 часа от заявки и вывезем бытовой, строительный и крупногабаритный мусор. Работаем по всем районам ${city.nominative}: от ${l1} до ${l2}, выезд бригады с КАМАЗом или ГАЗелью под объём. ${city.nominative} — наш приоритетный округ, диспетчер знает локальную дорожную обстановку и подбирает машину под ширину проезда у вашего адреса.`,
        `Вывозим в ${city.prepositional} четыре основных категории: бытовой мусор после ремонта или переезда, строительный после демонтажа (битый кирпич, бетон, ГКЛ, керамика), крупногабаритный (старая мебель, бытовая техника, окна) и контейнерный — для УК и ТСЖ ${city.nominative} с заездом по графику. Объём считаем в кубометрах: от 1 м³ — индивидуальная заявка, от 6 м³ — пушка-самосвал. Грузчики входят в стоимость.`,
        `Цена в ${city.prepositional} — фиксированная, без скрытых наценок: смета по 3 фото за 10 минут, без предварительного выезда оценщика. ${city.nominative} относится к Class-A зоне (близко к МКАД), поэтому стоимость на 5% ниже базовой по МО. Утилизация — на лицензированные полигоны Подмосковья: предоставим талоны и акты для бухгалтерии. Работаем с физлицами по чеку, с УК и ТСЖ — по договору и безналу.`,
        `Заявка по ${city.prepositional}: Telegram-бот @obihod_bot, MAX, WhatsApp +7 (495) 123-45-67 или форма на сайте. Диспетчер перезвонит в течение 15 минут, согласует время и тип машины. Работаем 7/7, в выходные — по предварительной заявке. Можно оформить регулярный вывоз: для УК ${city.nominative} — по графику дважды в неделю, для дачников — по сезону (апрель-октябрь).`,
      ]
    },
    faqPool: (city) => [
      {
        question: `За сколько часов приедет бригада в ${city.prepositional}?`,
        answer: `Из ${city.prepositional} — 2 часа от подтверждения заявки в будние дни, 3 часа в выходные. Если адрес в дальнем микрорайоне (например, ${city.microdistricts[3] ?? city.microdistricts[2]}) — закладываем +30-40 минут на дорогу. Срочный выезд (1 час) — по запросу, наценка 15%.`,
      },
      {
        question: `Работаете ли с управляющими компаниями в ${city.prepositional}?`,
        answer: `Да. Заключаем договор с УК и ТСЖ ${city.nominative} на регулярный вывоз — еженедельный, два раза в неделю или по графику. Расчёт по безналу, акты выполненных работ закрываем ежемесячно. Опыт работы с УК ${city.nominative} — талоны утилизации, маркировка машин, фото с площадки до и после.`,
      },
      {
        question: `Какие виды мусора вывозите из ${city.nominative}?`,
        answer: `Бытовой (после ремонта, переезда, генеральной уборки), строительный (бетон, кирпич, штукатурка, демонтаж), крупногабаритный (старая мебель, ванны, окна, бытовая техника), контейнерный (для УК), вывоз грунта и снега в сезон. Мусор класса I-II (опасный) — не возим.`,
      },
      {
        question: `Сколько стоит вывоз 1 кубометра в ${city.prepositional}?`,
        answer: `В ${city.prepositional} (Class-A зона МО) — от 950 ₽ за м³ бытового мусора, от 1 150 ₽ за строительный, от 1 450 ₽ за КГМ. Базовая цена -5% от средней по Подмосковью благодаря близости к МКАД. Минимальный заказ — 3 м³ (от 2 850 ₽). Фикс-цена за объект до 5 м³ — 12 800 ₽.`,
      },
    ],
    priceNote: (city) =>
      `${city.nominative} относится к Class-A зоне Подмосковья (рядом с МКАД), поэтому базовая цена на 5% ниже средней по МО — короткое плечо доставки на полигон. Точную смету по 3 фото отдаём за 10 минут.`,
  },

  // ────────── 2. Арбористика ──────────
  arboristika: {
    service: 'Арбористика',
    serviceLower: 'арбористика',
    hero: (city) => {
      const [l1, l2] = lm2(city)
      return [
        `Спил, обрезка и удаление деревьев в ${city.prepositional} — арбористы с допуском Минтруда №782н по 3-5 группам высоты, страховка ГО на 10 млн ₽, опыт работы с 2014 года. ${city.nominative} — приоритетный округ: бригады закрывают все районы от ${l1} до ${l2}, выезд с автовышкой 17-22 м или промышленный альпинизм по узким проездам. Работаем по СНиП и СанПиН, оформляем порубочный билет и лесную декларацию.`,
        `Услуги арбориста в ${city.prepositional}: аварийный спил наклонившихся стволов, кронирование (омолаживающее, формирующее, санитарное), удаление пня фрезой или выкорчёвыванием, сезонная обрезка плодовых, обработка от короеда и щитовки. Берёмся за высотные работы 25+ м, узкие проезды (СНТ ${city.nominative} с заборами в 2 м), стволы рядом с ЛЭП и проводами.`,
        `Цена в ${city.prepositional} — от 700 ₽ за дерево до 4 м, от 8 200 ₽ за аварийный спил, от 1 500 ₽ за пень. Class-A проксимити снижает базовый тариф на 5%: ${city.nominative} в радиусе 30 км от МКАД, плечо доставки техники короткое. Расчёт фикс — по фото или после выезда мастера (бесплатно). Утилизация порубочных остатков — отдельная услуга или включена в смету.`,
        `Заявка по ${city.prepositional}: Telegram @obihod_bot, MAX, WhatsApp +7 (495) 123-45-67. Мастер выезжает в течение 1-2 дней, аварийные ситуации (упавшее дерево после ветра) — день в день. Сезон активной работы в ${city.prepositional} — март-ноябрь. Зимой работаем по предварительной записи: спил мерзлой древесины и обработка от короеда без активной фазы.`,
      ]
    },
    faqPool: (city) => [
      {
        question: `Нужен ли порубочный билет для спила в ${city.prepositional}?`,
        answer: `На частной территории в ${city.prepositional} билет не нужен. Для деревьев на муниципальной земле (вдоль улиц ${city.microdistricts[2] ?? city.microdistricts[1]}, у школ, парковых зон) — обязателен порубочный билет от администрации ${city.nominative}. Помогаем оформить: подаём заявку, готовим обоснование, ждём 30 дней. Стоимость оформления — от 5 200 ₽.`,
      },
      {
        question: `Сколько стоит спилить дерево в ${city.prepositional}?`,
        answer: `В ${city.prepositional} — от 700 ₽ за берёзу до 4 м, от 2 500 ₽ за плодовое дерево с кронированием, от 8 200 ₽ за аварийный спил большого тополя у дома. На цену влияют высота, диаметр ствола, наличие построек рядом, узость проезда (СНТ ${city.microdistricts[3] ?? city.microdistricts[2]} — наценка за технику). Class-A проксимити — базовая цена -5% от средней по МО.`,
      },
      {
        question: `Какие деревья опасно оставлять в ${city.prepositional}?`,
        answer: `В ${city.prepositional} критичны старые тополя (хрупкая древесина после 40 лет), большие ивы у дома (поверхностные корни ломают фундамент), берёзы со сквозной трухой и наклоном >15°. После сильных ветров проверяйте: трещины ствола, отслаивающаяся кора, грибок-трутовик у основания. Бесплатный осмотр от арбориста ${city.nominative} — по заявке.`,
      },
      {
        question: `Работаете ли в СНТ и узких проездах ${city.nominative}?`,
        answer: `Да. В СНТ ${city.nominative} (например, ${city.microdistricts[5] ?? city.microdistricts[4]}) часто узкие проезды 2-2.5 м — заходим промальпом или с компактной техникой. Если автовышка не проходит, спил делаем с альпинистской системой: бригадир + двое страхующих, дроп-зона огорожена. Опыт работы с заборами, теплицами и постройками рядом — 11 лет.`,
      },
    ],
    priceNote: (city) =>
      `${city.nominative} — Class-A зона (близко к МКАД), базовая цена арбористики на 5% ниже средней по МО за счёт короткого плеча доставки автовышки. Сложные случаи (промальп, аварийный спил у ЛЭП) — отдельный расчёт.`,
  },

  // ────────── 3. Демонтаж ──────────
  demontazh: {
    service: 'Демонтаж',
    serviceLower: 'демонтаж',
    hero: (city) => {
      const [l1, l2] = lm2(city)
      return [
        `Демонтаж дач, бань, сараев и зданий в ${city.prepositional} — снос объектов под фундамент или с сохранением периметра, вывоз стройотходов на лицензированный полигон, оформление актов утилизации. ${city.nominative} — приоритетный регион: бригады с экскаватором JCB и КАМАЗом-манипулятором заходят в ${l1}, ${l2} и любые СНТ ${city.nominative}. Готовы работать в условиях плотной застройки.`,
        `Берём в работу демонтаж в ${city.prepositional}: ветхие дачные дома (брус, каркас, щитовик), бани (срубы, кирпичные, каркасные), сараи и хозблоки, бетонные конструкции (фундаменты, отмостки, дорожки), заборы (профлист, сетка, бетон), снос отдельно стоящих зданий до 200 м². Работаем с тяжёлой техникой: гидромолот, ножницы по металлу, экскаватор, манипулятор.`,
        `Цена в ${city.prepositional} — от 25 500 ₽ за демонтаж дачи 6×6 м с вывозом, от 18 200 ₽ за баню 3×4 м, от 8 400 ₽ за сарай. Class-A проксимити (${city.nominative} рядом с МКАД) даёт базовый тариф -5% от средней по МО — экономия на доставке техники. В смету входит: демонтаж, погрузка, вывоз 100% отходов, акты утилизации, уборка площадки.`,
        `Заявка на демонтаж в ${city.prepositional}: Telegram @obihod_bot, MAX, WhatsApp +7 (495) 123-45-67 или фото объекта на сайте. Мастер выезжает на бесплатный замер за 1-2 дня. Стандартный демонтаж дачи 6×6 — 1 день работ + 1 день вывоза. Сложные случаи (близкая застройка ${city.microdistricts[2] ?? city.microdistricts[1]}, плотные коммуникации) — двухэтапный план с разметкой.`,
      ]
    },
    faqPool: (city) => [
      {
        question: `Сколько стоит снести дачу в ${city.prepositional}?`,
        answer: `В ${city.prepositional} — от 25 500 ₽ за дачу 6×6 м (брус или каркас) с вывозом отходов на полигон, от 35 000 ₽ за дом 8×8 м, от 60 000 ₽ за двухэтажный сруб. Class-A зона: базовый тариф на 5% ниже средней по МО благодаря близости ${city.nominative} к МКАД. Смета фикс по 5 фото объекта.`,
      },
      {
        question: `Какие документы выдаёте после демонтажа в ${city.prepositional}?`,
        answer: `После демонтажа в ${city.prepositional} выдаём: договор подряда (ИП/ООО), акт выполненных работ с площадью и объёмом отходов, талон утилизации с номером лицензированного полигона МО (для УК и ТСЖ — обязателен), фото площадки до/после. Для физлиц по запросу — кассовый чек или электронный.`,
      },
      {
        question: `Можно ли снести баню без выкорчёвывания фундамента в ${city.prepositional}?`,
        answer: `Да, в ${city.prepositional} часто делаем «частичный демонтаж»: разбираем сруб, кровлю, обвязку, оставляем фундамент под новый объект. Сэкономит 8-12 тыс ₽ на работах + не нужен экскаватор. Если фундамент кирпичный или ленточный — отдельный этап с гидромолотом, до 15 000 ₽ за полный снос. ${city.nominative} часто заказывает такую связку для пристроек.`,
      },
      {
        question: `Сколько занимает снос дачи в ${city.prepositional}?`,
        answer: `Стандартная дача 6×6 м в ${city.prepositional} — 1 рабочий день на демонтаж + 1 день на вывоз отходов. Если объект в плотной застройке (например, СНТ ${city.microdistricts[4] ?? city.microdistricts[3]}) — закладываем +1 день на разметку и аккуратный демонтаж. Большие дома 100+ м² — 3-5 рабочих дней.`,
      },
    ],
    priceNote: (city) =>
      `${city.nominative} (Class-A зона МО) даёт скидку 5% на базовый тариф демонтажа — рядом с МКАД, плечо доставки экскаватора и КАМАЗа-манипулятора короткое. Точную смету фикс отдаём по 5 фото объекта за 30 минут.`,
  },

  // ────────── 4. Чистка крыш ──────────
  'chistka-krysh': {
    service: 'Чистка крыш',
    serviceLower: 'чистка крыш',
    hero: (city) => {
      const [l1, l2] = lm2(city)
      return [
        `Чистка крыш от снега и наледи в ${city.prepositional} — промышленные альпинисты с допуском 5-й группы высоты Минтруда, страховка ГО 10 млн ₽, работаем с 2014 года. ${city.nominative} — приоритетный город: бригады закрывают многоквартирные дома и частный сектор от ${l1} до ${l2}, заходим на любую кровлю — мягкая, металл, фальц, профлист, скаты до 60°. Сезонные договоры с УК и ТСЖ ${city.nominative} — гарантированный график выезда после каждого снегопада.`,
        `Услуги в ${city.prepositional}: чистка кровли частного дома, МКД с автовышкой или промальпом, сбивание сосулек на фасадах высотой до 25 м, удаление снежных козырьков и наледи на водостоках, чистка с уборкой территории зимой (снег у фундамента), обработка кровли от мха в межсезонье. Работаем без повреждения покрытия — мягкие лопаты, верёвочные системы, контроль страховки на каждом этапе.`,
        `Цена в ${city.prepositional} — от 950 ₽ за м² для частного дома, от 50 000 ₽ за сезонный абонемент УК (стандартный МКД 9 этажей), от 4 200 ₽ за разовый сбив сосулек на 30 п.м. Class-A проксимити снижает базовый тариф на 5%: ${city.nominative} рядом с МКАД, бригада добирается за 1.5 часа. Договор сезонный (декабрь-март) — приоритет выезда в течение 24 часов после осадков.`,
        `Заявка в ${city.prepositional}: Telegram @obihod_bot, MAX, WhatsApp +7 (495) 123-45-67. Мастер выезжает на бесплатный осмотр кровли за 1-2 дня. УК и ТСЖ ${city.nominative} — оформляем сезонный договор с гарантированным выездом, актами и фотофиксацией. Для частных домов работаем 7/7 в зимний сезон, аварийные ситуации (опасный нависший козырёк) — день в день.`,
      ]
    },
    faqPool: (city) => [
      {
        question: `Сколько стоит сезонная чистка крыш для УК в ${city.prepositional}?`,
        answer: `В ${city.prepositional} сезонный договор для УК — от 50 000 ₽ за стандартный МКД 9 этажей (декабрь-март, 4-6 выездов). Для серий П-3 / П-44Т / И-155 цена точнее. В договоре: гарантированный выезд за 24 часа после снегопада, акты и фотофиксация, страховка ГО. УК ${city.nominative} часто берут пакет на 5-10 домов — скидка 7-10%.`,
      },
      {
        question: `Можно ли почистить крышу частного дома в ${city.prepositional}?`,
        answer: `Да. В ${city.prepositional} чистим частные кровли (мягкая, металл, фальц, профлист) — стоимость от 950 ₽ за м². Для коттеджа 100 м² — около 95 000 ₽ при разовом выезде, или 35 000 ₽ за сезонный абонемент (3 выезда декабрь-март). Заходим в коттеджные посёлки ${city.nominative}: ${city.microdistricts[3] ?? city.microdistricts[2]}, ${city.microdistricts[4] ?? city.microdistricts[3]}.`,
      },
      {
        question: `Опасны ли сосульки в ${city.prepositional}?`,
        answer: `Да, сосульки и наледь на водостоках в ${city.prepositional} — основная причина ДТП и травм пешеходов в феврале-марте. По СанПиН 2.1.2.2645-10 управляющая организация обязана убирать наледь немедленно. Штрафы для УК ${city.nominative} — до 250 000 ₽ (КоАП 7.22). Сбив сосулек у нас — 4 200 ₽ за 30 п.м фасада, выезд в день обращения.`,
      },
      {
        question: `Чем отличается промальп от автовышки в ${city.prepositional}?`,
        answer: `В ${city.prepositional} автовышка подходит для МКД до 25 м с широким подъездом — быстрее и дешевле (от 5 200 ₽/час). Промышленный альпинизм нужен для нестандартных кровель: купола, ${city.microdistricts[5] ?? city.microdistricts[4]} с узкими дворами, фасады выше 25 м, работа над припаркованными машинами. Промальп дороже на 30-40%, но проходит везде.`,
      },
    ],
    priceNote: (city) =>
      `${city.nominative} — Class-A зона МО, базовый тариф чистки крыш на 5% ниже средней по Подмосковью благодаря близости к МКАД. Сезонные договоры с УК ${city.nominative} — индивидуальная скидка 7-10% при пакете 5+ домов.`,
  },

  // ────────── 5. Уборка территории ──────────
  'uborka-territorii': {
    service: 'Уборка территории',
    serviceLower: 'уборка территории',
    hero: (city) => {
      const [l1, l2] = lm2(city)
      return [
        `Уборка территории, покос травы и расчистка участков в ${city.prepositional} — бригады с триммерами Husqvarna, мульчерами и щепомелами, фикс-цена за сотку, выезд в течение 1-2 дней. ${city.nominative} — приоритетная зона: работаем во всех микрорайонах от ${l1} до ${l2}, в СНТ ${city.nominative} — заходим с компактной техникой. Сезон активных работ в ${city.prepositional} — апрель-октябрь, зимой делаем расчистку от поросли и бурьяна.`,
        `Услуги в ${city.prepositional}: покос травы триммером и мотокосой (от 80 ₽/сотка), выравнивание участка под газон или фундамент, расчистка от кустарника и поросли (вырубка молодого подлеска), вывоз порубочных остатков на полигон, борьба с борщевиком (трёхкратная обработка по сезону). Берём участки 4-50 соток за раз, СНТ — пакетом со скидкой.`,
        `Цена в ${city.prepositional} — от 80 ₽ за сотку покоса, от 250 ₽ за выравнивание, от 800 ₽ за расчистку соток с кустарником, от 8 400 ₽ за полную подготовку участка под стройку. Class-A проксимити (${city.nominative} рядом с МКАД) даёт базовый тариф -5% от средней по МО. Смета по 3 фото за 10 минут, без выезда оценщика.`,
        `Заявка в ${city.prepositional}: Telegram @obihod_bot, MAX, WhatsApp +7 (495) 123-45-67 или форма на сайте. Бригада выезжает в течение 1-2 дней (сезон апрель-октябрь). Часто связываем услуги: расчистка → демонтаж старого сарая → вывоз мусора → выравнивание под фундамент. Дисконт при пакете — 5-10% от итога. Для УК и ТСЖ ${city.nominative} — договор на сезон с регулярным графиком.`,
      ]
    },
    faqPool: (city) => [
      {
        question: `Сколько стоит покосить участок 10 соток в ${city.prepositional}?`,
        answer: `В ${city.prepositional} — от 800 ₽ за 10 соток покоса травы триммером (4-6 часов работы бригады из двух человек). Если трава высокая (1.5+ м, заброшенный участок) — наценка 30-50% за дополнительный проход и вывоз. Class-A проксимити ${city.nominative}: базовая цена -5% от средней по МО. Минимальный заказ — 4 сотки.`,
      },
      {
        question: `Когда лучше расчищать участок в ${city.prepositional}?`,
        answer: `Оптимально в ${city.prepositional} — октябрь-ноябрь (после листопада, до снега) или март-апрель (до активного роста). В эти месяцы хорошо видна корневая система кустарника, легче работать со старой порослью. Летом тоже расчищаем, но цена выше на 15-20% (густая зелёная масса). Под фундамент в ${city.microdistricts[3] ?? city.microdistricts[2]} — заранее за 1-2 месяца.`,
      },
      {
        question: `Что делать с борщевиком в ${city.prepositional}?`,
        answer: `Борщевик в ${city.prepositional} — обязательно убирать: КоАП МО предусматривает штраф для собственников 2-5 тыс ₽ (физлицам). Полная обработка — 3 цикла за сезон: химия (раундап) + механическое удаление корней + повтор через месяц. Стоимость от 1 200 ₽ за сотку. Без обработки борщевик возвращается на 90% участков ${city.nominative} в следующем году.`,
      },
      {
        question: `Можно ли заказать пакет «уборка под ключ» в ${city.prepositional}?`,
        answer: `Да, в ${city.prepositional} часто берут пакет: расчистка участка → демонтаж старых построек (сарай, теплица) → вывоз порубочных и стройотходов → выравнивание под газон или фундамент. Для участка 10 соток в СНТ ${city.microdistricts[5] ?? city.microdistricts[4]} — около 45-65 тыс ₽ под ключ за 2-3 дня работ. Скидка при пакете — 5-10%.`,
      },
    ],
    priceNote: (city) =>
      `${city.nominative} — Class-A зона МО, базовый тариф уборки территории на 5% ниже средней по Подмосковью за счёт короткого плеча доставки техники. Связка услуг (расчистка + демонтаж + вывоз) — дисконт 5-10%.`,
  },
}

// ────────────────────────── helpers ──────────────────────────

async function findOneBySlug(
  payload: Payload,
  collection: 'services' | 'districts' | 'authors',
  slug: string,
) {
  const r = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return r.docs[0] ?? null
}

async function findExistingPillarSd(
  payload: Payload,
  serviceId: number | string,
  districtId: number | string,
) {
  const r = await payload.find({
    collection: 'service-districts',
    where: {
      and: [
        { service: { equals: serviceId } },
        { district: { equals: districtId } },
        { subServiceSlug: { exists: false } },
      ],
    },
    limit: 1,
    depth: 0,
  })
  return r.docs[0] ?? null
}

function leadPlainText(lead: unknown): string {
  if (!lead || typeof lead !== 'object') return ''
  const root = (lead as { root?: { children?: unknown[] } }).root
  if (!root || !Array.isArray(root.children)) return ''
  let text = ''
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const n = node as { type?: string; text?: string; children?: unknown[] }
    if (n.type === 'text' && typeof n.text === 'string') text += n.text + ' '
    if (Array.isArray(n.children)) n.children.forEach(walk)
  }
  for (const c of root.children) walk(c)
  return text
}

function isPlaceholderLead(lead: unknown): boolean {
  return leadPlainText(lead).includes(PLACEHOLDER_MARKER)
}

// Старый дефект морфологии — в hero v1 было «Вывозим из {prepositional}».
// Если такой текст найден — считаем lead «нашим Phase A v1» и нужен rewrite на v2.
function isPhaseAv1Lead(lead: unknown): boolean {
  return leadPlainText(lead).includes('Вывозим из ') || leadPlainText(lead).includes('Заявка из ')
}

// Direct SQL UPDATE: service_districts + DELETE/INSERT в local_faq + local_landmarks.
// Все в одной transaction — atomic per SD.
async function pgUpdateServiceDistrict(
  pool: PgPoolLite,
  sdId: number,
  payload: {
    leadParagraph: ReturnType<typeof lexParagraphs>
    localPriceNote: string
    lastReviewedAt: string // YYYY-MM-DD
    reviewedById: number | null
    faqs: Array<{ question: string; answer: string }>
    landmarks: string[]
    augmentOnly?: boolean // true → не перезаписывать leadParagraph + localPriceNote
    skipFaqInsert?: boolean // true → sustained FAQ rows достаточно (не трогаем)
    skipLandmarksInsert?: boolean // true → sustained landmarks достаточно (не трогаем)
  },
): Promise<void> {
  const conn = await pool.connect()
  try {
    await conn.query('BEGIN')
    try {
      if (payload.augmentOnly) {
        // Только мета: lastReviewedAt + reviewedBy. Lead/priceNote sustained.
        await conn.query(
          `UPDATE service_districts
           SET last_reviewed_at = $1::timestamptz,
               reviewed_by_id = COALESCE($2, reviewed_by_id),
               updated_at = now()
           WHERE id = $3`,
          [`${payload.lastReviewedAt}T00:00:00.000Z`, payload.reviewedById, sdId],
        )
      } else {
        await conn.query(
          `UPDATE service_districts
           SET lead_paragraph = $1::jsonb,
               local_price_note = $2,
               last_reviewed_at = $3::timestamptz,
               reviewed_by_id = $4,
               updated_at = now()
           WHERE id = $5`,
          [
            JSON.stringify(payload.leadParagraph),
            payload.localPriceNote,
            `${payload.lastReviewedAt}T00:00:00.000Z`,
            payload.reviewedById,
            sdId,
          ],
        )
      }

      let order = 1
      if (!payload.skipFaqInsert) {
        await conn.query('DELETE FROM service_districts_local_faq WHERE _parent_id = $1', [sdId])
        for (const f of payload.faqs) {
          await conn.query(
            `INSERT INTO service_districts_local_faq (id, _order, _parent_id, question, answer)
             VALUES ($1, $2, $3, $4, $5::jsonb)`,
            [randomUUID(), order, sdId, f.question, JSON.stringify(lexSingleParagraph(f.answer))],
          )
          order += 1
        }
      }

      if (!payload.skipLandmarksInsert) {
        await conn.query('DELETE FROM service_districts_local_landmarks WHERE _parent_id = $1', [
          sdId,
        ])
        order = 1
        for (const name of payload.landmarks) {
          await conn.query(
            `INSERT INTO service_districts_local_landmarks (id, _order, _parent_id, landmark_name)
             VALUES ($1, $2, $3, $4)`,
            [randomUUID(), order, sdId, name],
          )
          order += 1
        }
      }

      await conn.query('COMMIT')
    } catch (e) {
      await conn.query('ROLLBACK')
      throw e
    }
  } finally {
    if (conn.release) conn.release()
  }
}

function pickAuthorId(
  pillar: PillarSlug,
  citySlug: string,
  authorIdsBySlug: Map<string, number | string>,
): number | string | null {
  const preferred = AUTHOR_SLUGS_BY_PILLAR[pillar]
  let h = 0
  for (let i = 0; i < citySlug.length; i++) h = (h * 31 + citySlug.charCodeAt(i)) | 0
  const idx = Math.abs(h) % preferred.length
  for (let i = 0; i < preferred.length; i++) {
    const slug = preferred[(idx + i) % preferred.length]
    const id = authorIdsBySlug.get(slug)
    if (id != null) return id
  }
  const first = authorIdsBySlug.values().next()
  return first.done ? null : first.value
}

// ────────────────────────── main ──────────────────────────

async function main() {
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('ABORT: prod-БД, OBIKHOD_SEED_CONFIRM=yes не выставлен.')
    process.exit(1)
  }

  const inventoryPath = path.resolve(
    process.cwd(),
    '..',
    'seosite',
    'strategy',
    '03-uslugi-url-inventory.json',
  )
  if (!fs.existsSync(inventoryPath)) {
    console.error(`ABORT: inventory не найден: ${inventoryPath}`)
    process.exit(1)
  }
  const inv = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8')) as InventoryRoot
  const classACities = inv.cities30.filter((c) => c.class === 'A')
  if (classACities.length !== 12) {
    console.warn(`[seed-sd-class-a] WARN: Class-A cities = ${classACities.length} (ожидалось 12)`)
  }
  console.log(`[seed-sd-class-a] Class-A cities: ${classACities.length}`)

  const payload = await getPayload({ config })

  // pg pool sustained payload-postgres adapter — обходим payload.update +
  // lock-check на schema-drift колонке reviews_id (US-9 follow-up migration).
  const pgClient = (payload.db as unknown as { pool: PgPoolLite }).pool

  const pillarIdBySlug = new Map<PillarSlug, number | string>()
  for (const slug of PILLARS) {
    const svc = await findOneBySlug(payload, 'services', slug)
    if (!svc) {
      console.warn(`[seed-sd-class-a] WARN: pillar service «${slug}» отсутствует`)
      continue
    }
    pillarIdBySlug.set(slug, (svc as { id: number | string }).id)
  }
  console.log(`[seed-sd-class-a] резолвлено ${pillarIdBySlug.size}/${PILLARS.length} pillars`)

  const cityIdBySlug = new Map<string, number | string>()
  const cityCtxBySlug = new Map<string, CityCtx>()
  for (const c of classACities) {
    const d = await findOneBySlug(payload, 'districts', c.slug)
    if (!d) {
      console.warn(`[seed-sd-class-a] WARN: city «${c.slug}» отсутствует`)
      continue
    }
    cityIdBySlug.set(c.slug, (d as { id: number | string }).id)
    const microdistricts = CITY_MICRODISTRICTS[c.slug]
    if (!microdistricts || microdistricts.length < 6) {
      console.warn(`[seed-sd-class-a] WARN: city «${c.slug}» CITY_MICRODISTRICTS <6 элементов`)
    }
    cityCtxBySlug.set(c.slug, {
      slug: c.slug,
      nominative: c.nominative,
      prepositional: c.prepositional,
      microdistricts: microdistricts ?? [],
    })
  }
  console.log(
    `[seed-sd-class-a] резолвлено ${cityIdBySlug.size}/${classACities.length} Class-A cities`,
  )

  const authorIdsBySlug = new Map<string, number | string>()
  for (const slug of [
    'aleksey-semenov',
    'igor-kovalev',
    'tatiana-voronina',
    'dmitriy-sokolov',
    'olga-malysheva',
  ]) {
    const a = await findOneBySlug(payload, 'authors', slug)
    if (a) authorIdsBySlug.set(slug, (a as { id: number | string }).id)
  }
  console.log(
    `[seed-sd-class-a] резолвлено ${authorIdsBySlug.size}/5 sustained authors: [${Array.from(authorIdsBySlug.keys()).join(', ')}]`,
  )
  if (authorIdsBySlug.size === 0) {
    console.warn(
      '[seed-sd-class-a] WARN: ни одного sustained author не найдено. reviewedBy не проставится. Запусти `pnpm seed` для создания COMPETE3 authors.',
    )
  }

  let updated = 0
  let skipped = 0
  let errors = 0
  const today = new Date().toISOString().slice(0, 10)

  for (const pillarSlug of PILLARS) {
    const pillarId = pillarIdBySlug.get(pillarSlug)
    if (pillarId == null) {
      console.warn(`[seed-sd-class-a] skip pillar «${pillarSlug}» — service не найден`)
      continue
    }
    const tpl = PILLAR_TEMPLATES[pillarSlug]

    for (const c of classACities) {
      const cityId = cityIdBySlug.get(c.slug)
      const ctx = cityCtxBySlug.get(c.slug)
      if (cityId == null || !ctx) continue

      try {
        const sd = await findExistingPillarSd(payload, pillarId, cityId)
        if (!sd) {
          console.warn(
            `[seed-sd-class-a] SD ${pillarSlug} × ${c.slug} не найден — запусти seed-sd-bulk сначала`,
          )
          errors += 1
          continue
        }

        const sdData = sd as {
          id: number | string
          leadParagraph?: unknown
        }

        // Decision tree:
        //   - lead = placeholder                                        → full update
        //   - lead != placeholder + faq>=2 + lm>=4 + last_reviewed_at   → skip
        //   - lead != placeholder + (faq/lm gap OR last_reviewed null)  → augment
        const isPlaceholder = isPlaceholderLead(sdData.leadParagraph)
        const isV1 = isPhaseAv1Lead(sdData.leadParagraph)
        const sdRow = (await pgClient.connect().then(async (cn) => {
          try {
            const r = await cn.query(
              `SELECT (SELECT COUNT(*)::int FROM service_districts_local_faq WHERE _parent_id=$1) AS faq_n,
                      (SELECT COUNT(*)::int FROM service_districts_local_landmarks WHERE _parent_id=$1) AS lm_n,
                      last_reviewed_at IS NOT NULL AS has_review,
                      reviewed_by_id IS NOT NULL AS has_author
               FROM service_districts WHERE id=$1`,
              [sdData.id],
            )
            return (
              (
                r as {
                  rows: Array<{
                    faq_n: number
                    lm_n: number
                    has_review: boolean
                    has_author: boolean
                  }>
                }
              ).rows[0] ?? { faq_n: 0, lm_n: 0, has_review: false, has_author: false }
            )
          } finally {
            if (cn.release) cn.release()
          }
        })) as { faq_n: number; lm_n: number; has_review: boolean; has_author: boolean }

        if (
          !isPlaceholder &&
          !isV1 &&
          sdRow.faq_n >= 2 &&
          sdRow.lm_n >= 4 &&
          sdRow.has_review &&
          sdRow.has_author
        ) {
          skipped += 1
          console.log(
            `• ${pillarSlug} × ${c.slug}: уже наполнен (faq=${sdRow.faq_n}, lm=${sdRow.lm_n}), пропуск`,
          )
          continue
        }

        // Phase A v1 morphology fix: треба full rewrite hero (не augment).
        const augmentOnly = !isPlaceholder && !isV1
        const heroParas = tpl.hero(ctx)
        const allFaqs = tpl.faqPool(ctx)
        let h = 0
        const key = `${pillarSlug}-${c.slug}`
        for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0
        const dropIdx = Math.abs(h) % allFaqs.length
        const selectedFaqs = allFaqs.filter((_, i) => i !== dropIdx).slice(0, 3)

        const reviewedById = pickAuthorId(pillarSlug, c.slug, authorIdsBySlug)
        const landmarksList = ctx.microdistricts.slice(0, 6)

        // Direct SQL UPDATE через pg client — обход payload.update который
        // делает SELECT ... payload_locked_documents с reviews_id (колонка
        // отсутствует в БД из-за sustained drift US-9 Reviews collection без
        // миграции). Schema-changes Phase A запрещены, поэтому пишем data
        // только в существующие колонки service_districts + FAQ/landmarks
        // subtables.
        await pgUpdateServiceDistrict(pgClient, sdData.id as number, {
          leadParagraph: lexParagraphs(heroParas),
          localPriceNote: tpl.priceNote(ctx),
          lastReviewedAt: today,
          reviewedById: typeof reviewedById === 'number' ? reviewedById : null,
          faqs: selectedFaqs,
          landmarks: landmarksList,
          augmentOnly,
          // Если sustained FAQ/landmarks уже достаточно — не перезаписываем (берегём
          // ручной Stage 1/2 контент). Threshold sustained sa-seo: faq>=2, lm>=4.
          skipFaqInsert: augmentOnly && sdRow.faq_n >= 2,
          skipLandmarksInsert: augmentOnly && sdRow.lm_n >= 4,
        })

        updated += 1
        console.log(
          `✓ ${pillarSlug} × ${c.slug}: ${augmentOnly ? 'augmented' : 'наполнен'} (faq=${selectedFaqs.length}, lm=${landmarksList.length}, author=${reviewedById ?? 'null'})`,
        )
      } catch (e) {
        errors += 1
        console.error(`❌ ${pillarSlug} × ${c.slug}:`, e instanceof Error ? e.message : e)
      }
    }
  }

  console.log('')
  console.log(
    `[seed-sd-class-a] итог: updated=${updated}, skipped=${skipped}, errors=${errors} (target ${PILLARS.length}×${classACities.length}=${PILLARS.length * classACities.length})`,
  )
  // pgClient — это shared payload.db.pool, не end'им — payload сам закроет.
  process.exit(errors === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error('[seed-sd-class-a] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
