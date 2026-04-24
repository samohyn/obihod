import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { existsSync } from 'node:fs'
import path from 'node:path'

/**
 * POST /api/seed — supported workaround для seed на prod.
 *
 * Источник истины — `scripts/seed.ts` (CLI, ADR-0001). HTTP-эндпоинт оставлен
 * как fallback пока CLI запуск через `pnpm seed:prod` не стабилизирован
 * (payload@3.83 + tsx + @next/env CJS/ESM interop, отдельный backlog).
 *
 * Безопасность:
 *  - Защищён `x-revalidate-secret` (тот же секрет, что для revalidate).
 *  - Идемпотентен: пропускает существующие записи по slug / unique-индексу
 *    (service, district). Безопасно повторно запускать.
 *  - Ручные правки оператора через /admin не затираются.
 *
 * Контракт seed (зеркало `scripts/seed.ts`, sa.md §5):
 *  1. SeoSettings (global) — credentials, localBusiness, organization.name
 *  2. SiteChrome  (global) — header/footer/contacts/requisites
 *  3. 4 Services  — арбористика, чистка крыш, вывоз мусора, демонтаж
 *  4. 7 Districts — Одинцово, Красногорск, Мытищи, Химки, Истра, Пушкино, Раменское
 *  5. Persons     — Алексей Семёнов
 *  6. 28 ServiceDistricts — 4×7, draft + noindex
 *  7. Mock Case   — «Сняли пень в Гостице» с фото из site/content/seed/cases/
 *                   Если файлы отсутствуют (placeholder-ы не задеплоены) —
 *                   Case пропускается, SD «арбо × Раменское» остаётся draft.
 *  8. Upgrade SD «арбо × Раменское» → published (только если Case создан)
 */

const lexicalParagraph = (text: string) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        textFormat: 0,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text,
            version: 1,
          },
        ],
      },
    ],
  },
})

type Stats = { created: number; skipped: number; updated: number; errors: number }
type CollectionStats = Record<string, Stats>

function ensureStats(cs: CollectionStats, name: string): Stats {
  if (!cs[name]) cs[name] = { created: 0, skipped: 0, updated: 0, errors: 0 }
  return cs[name]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function findOneBySlug(payload: any, collection: string, slug: string) {
  const r = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return r.docs[0] ?? null
}

// ───────── Districts (7 пилотных, sa.md §5.5) ─────────

type DistrictSeed = {
  slug: string
  nameNominative: string
  namePrepositional: string
  nameDative: string
  nameGenitive: string
  coverageRadius: number
  distanceFromMkad: number
  centerGeo: [number, number]
  priority: 'A' | 'B' | 'C'
  landmarks: { name: string; type: 'kp' | 'mkr' | 'snt' | 'object' }[]
  courtsJurisdiction: string
}

const DISTRICTS: DistrictSeed[] = [
  {
    slug: 'odincovo',
    nameNominative: 'Одинцово',
    namePrepositional: 'в Одинцово',
    nameDative: 'по Одинцово',
    nameGenitive: 'из Одинцово',
    coverageRadius: 20,
    distanceFromMkad: 24,
    centerGeo: [37.2754, 55.6782],
    priority: 'A',
    landmarks: [
      { name: 'мкр Новая Трёхгорка', type: 'mkr' },
      { name: 'КП Барвиха Hills', type: 'kp' },
      { name: 'СНТ на Минском шоссе', type: 'snt' },
    ],
    courtsJurisdiction: 'Администрация Одинцовского ГО',
  },
  {
    slug: 'krasnogorsk',
    nameNominative: 'Красногорск',
    namePrepositional: 'в Красногорске',
    nameDative: 'по Красногорску',
    nameGenitive: 'из Красногорска',
    coverageRadius: 20,
    distanceFromMkad: 22,
    centerGeo: [37.33, 55.8219],
    priority: 'A',
    landmarks: [
      { name: 'мкр Павшинская Пойма', type: 'mkr' },
      { name: 'КП Резиденция Рублёво', type: 'kp' },
      { name: 'мкр Изумрудные Холмы', type: 'mkr' },
    ],
    courtsJurisdiction: 'Администрация Красногорского ГО',
  },
  {
    slug: 'mytishchi',
    nameNominative: 'Мытищи',
    namePrepositional: 'в Мытищах',
    nameDative: 'по Мытищам',
    nameGenitive: 'из Мытищ',
    coverageRadius: 20,
    distanceFromMkad: 17,
    centerGeo: [37.7336, 55.911],
    priority: 'A',
    landmarks: [
      { name: 'мкр Перловский', type: 'mkr' },
      { name: 'мкр Пироговский', type: 'mkr' },
      { name: 'КП Сорочаны', type: 'kp' },
    ],
    courtsJurisdiction: 'Администрация Мытищинского ГО',
  },
  {
    slug: 'khimki',
    nameNominative: 'Химки',
    namePrepositional: 'в Химках',
    nameDative: 'по Химкам',
    nameGenitive: 'из Химок',
    coverageRadius: 20,
    distanceFromMkad: 12,
    centerGeo: [37.4451, 55.8895],
    priority: 'B',
    landmarks: [
      { name: 'мкр Сходня', type: 'mkr' },
      { name: 'мкр Новогорск', type: 'mkr' },
      { name: 'КП Княжье Озеро', type: 'kp' },
    ],
    courtsJurisdiction: 'Администрация ГО Химки',
  },
  {
    slug: 'istra',
    nameNominative: 'Истра',
    namePrepositional: 'в Истре',
    nameDative: 'по Истре',
    nameGenitive: 'из Истры',
    coverageRadius: 15,
    distanceFromMkad: 40,
    centerGeo: [36.8585, 55.9072],
    priority: 'B',
    landmarks: [
      { name: 'КП Николино', type: 'kp' },
      { name: 'СНТ на Новорижском шоссе', type: 'snt' },
    ],
    courtsJurisdiction: 'Администрация Истринского ГО',
  },
  {
    slug: 'pushkino',
    nameNominative: 'Пушкино',
    namePrepositional: 'в Пушкино',
    nameDative: 'по Пушкино',
    nameGenitive: 'из Пушкино',
    coverageRadius: 20,
    distanceFromMkad: 30,
    centerGeo: [37.8472, 56.0106],
    priority: 'C',
    landmarks: [
      { name: 'мкр Ивантеевка-2', type: 'mkr' },
      { name: 'КП на Ярославском шоссе', type: 'kp' },
      { name: 'СНТ Мамонтовка', type: 'snt' },
    ],
    courtsJurisdiction: 'Администрация Пушкинского ГО',
  },
  {
    slug: 'ramenskoye',
    nameNominative: 'Раменское',
    namePrepositional: 'в Раменском',
    nameDative: 'по Раменскому',
    nameGenitive: 'из Раменского',
    coverageRadius: 20,
    distanceFromMkad: 35,
    centerGeo: [38.2333, 55.5667],
    priority: 'A',
    landmarks: [
      { name: 'мкр Гостица', type: 'mkr' },
      { name: 'мкр Холодово', type: 'mkr' },
      { name: 'мкр Дергаево', type: 'mkr' },
      { name: 'КП на Новорязанском направлении', type: 'kp' },
    ],
    courtsJurisdiction: 'Администрация Раменского ГО',
  },
]

// ───────── Services (4 кластера, sa.md §5.4) ─────────

type ServiceSeed = {
  slug: 'arboristika' | 'ochistka-krysh' | 'vyvoz-musora' | 'demontazh'
  title: string
  h1: string
  metaTitle: string
  metaDescription: string
  intro: string
  priceFrom: number
  priceTo: number
  priceUnit: 'object' | 'tree' | 'm3' | 'shift' | 'm2'
  faqGlobal: { question: string; answer: string }[]
  subServices: { slug: string; title: string; h1: string; priceFrom: number }[]
  leadTemplate: (prep: string) => string
}

const SERVICES: ServiceSeed[] = [
  {
    slug: 'arboristika',
    title: 'Спил и уход за деревьями',
    h1: 'Спил деревьев',
    metaTitle: 'Спил деревьев в Москве и МО — фикс-цена | Обиход',
    metaDescription:
      'Спилим дерево в Москве и МО по фикс-цене за объект. Смета по 3 фото в Telegram за 10 минут. СРО, страховка 10 млн ₽, порубочный билет за наш счёт.',
    intro:
      'Обиход спиливает деревья в Москве и Московской области с фиксированной ценой за объект — от 700 ₽ за дерево Ø до 20 см свободным падением до 45 000 ₽ за аварийный спил Ø 60+ см над постройкой. Смета по 3 фото за 10 минут в Telegram, MAX или WhatsApp. Лицензия Росприроднадзора, СРО, страховка ГО 10 млн ₽, порубочный билет за наш счёт.',
    priceFrom: 700,
    priceTo: 45000,
    priceUnit: 'tree',
    faqGlobal: [
      {
        question: 'Что входит в фикс-цену за объект?',
        answer:
          'Выезд бригады, оценка на месте, спил, распиловка, погрузка и вывоз порубочных остатков, уборка территории, оформление порубочного билета (если требуется). Без скрытых наценок.',
      },
      {
        question: 'Как быстро вы приедете на оценку?',
        answer:
          'На приоритетные районы — в течение дня заявки или утром следующего. Аварийные ситуации (упало дерево на дом, провода) — по принципу 24/7, выезд в течение 1–2 часов.',
      },
      {
        question: 'Кто оформляет порубочный билет?',
        answer:
          'Мы оформляем порубочный билет за собственника в администрации района. Это входит в стоимость, отдельно не доплачивается. Срок оформления — обычно 4–7 рабочих дней.',
      },
    ],
    subServices: [
      { slug: 'spil-dereviev', title: 'Спил деревьев', h1: 'Спил деревьев', priceFrom: 700 },
      { slug: 'kronirovanie', title: 'Кронирование', h1: 'Кронирование деревьев', priceFrom: 3500 },
      { slug: 'udalenie-pnya', title: 'Удаление пня', h1: 'Удаление пня фрезой', priceFrom: 1500 },
      {
        slug: 'avariynyy-spil',
        title: 'Аварийный спил',
        h1: 'Аварийный спил 24/7',
        priceFrom: 8000,
      },
      {
        slug: 'sanitarnaya-obrezka',
        title: 'Санитарная обрезка',
        h1: 'Санитарная обрезка плодовых',
        priceFrom: 2500,
      },
    ],
    leadTemplate: (prep) =>
      `Обиход спиливает деревья ${prep} с фиксированной ценой за объект — от 700 ₽ за дерево Ø до 20 см до 45 000 ₽ за аварийный спил Ø 60+ см над постройкой. Смета по 3 фото за 10 минут в Telegram, MAX или WhatsApp. Порубочный билет оформляем за наш счёт, бригада выезжает 24/7 на аварийные ситуации.`,
  },
  {
    slug: 'ochistka-krysh',
    title: 'Чистка крыш от снега и наледи',
    h1: 'Чистка крыш от снега',
    metaTitle: 'Чистка крыш от снега в Москве и МО — Обиход',
    metaDescription:
      'Чистим крыши от снега и наледи в Москве и МО по фикс-цене за м². 24/7, промальп и автовышка, страховка ГО 10 млн ₽, смета в Telegram за 10 минут.',
    intro:
      'Обиход чистит крыши от снега и наледи в Москве и Московской области с фиксированной ценой за м². Работаем с частными домами, управляющими компаниями, ТСЖ и жилыми комплексами. Промальп и автовышка, страховка ГО 10 млн ₽, допуски Минтруда по высоте. Канал связи — Telegram, MAX, WhatsApp или телефон.',
    priceFrom: 1000,
    priceTo: 1000,
    priceUnit: 'm2',
    faqGlobal: [
      {
        question: 'Что входит в фикс-цену за м²?',
        answer:
          'Выезд бригады, оценка на месте, очистка кровли от снега и наледи, сбивание сосулек по периметру, уборка снега с отмостки. Страхование водостоков и окон от падающего снега — за счёт Обихода.',
      },
      {
        question: 'Берёте ли многоэтажные дома УК и ТСЖ?',
        answer:
          'Да. Работаем по договору с УК, ТСЖ, ЖК и FM-операторами. По договору берём на себя штрафы ГЖИ и ОАТИ за несвоевременную очистку.',
      },
      {
        question: 'Как быстро вы приедете после снегопада?',
        answer:
          'В окнах 24–48 часов после снегопада в приоритетных районах. Для подписанных договоров с УК и ТСЖ — приоритетный выезд с SLA 12 часов.',
      },
    ],
    subServices: [
      {
        slug: 'chistka-krysh-chastnyy-dom',
        title: 'Чистка крыши частного дома',
        h1: 'Чистка крыши частного дома от снега',
        priceFrom: 1000,
      },
      {
        slug: 'chistka-krysh-mkd',
        title: 'Чистка кровли МКД',
        h1: 'Чистка кровли многоквартирного дома',
        priceFrom: 1000,
      },
      {
        slug: 'sbivanie-sosulek',
        title: 'Сбивание сосулек',
        h1: 'Сбивание сосулек с кровли',
        priceFrom: 1000,
      },
    ],
    leadTemplate: (prep) =>
      `Обиход чистит крыши от снега и наледи ${prep} с фиксированной ценой за м². Работаем по частным домам, УК, ТСЖ и жилым комплексам. Промальп и автовышка, страховка водостоков и окон за наш счёт. Смета по фото за 10 минут в Telegram, MAX или WhatsApp.`,
  },
  {
    slug: 'vyvoz-musora',
    title: 'Вывоз мусора',
    h1: 'Вывоз мусора под ключ',
    metaTitle: 'Вывоз мусора в Москве и МО — фикс-цена | Обиход',
    metaDescription:
      'Вывозим мусор в Москве и МО по фикс-цене за м³. Строительный, порубочные остатки, хлам. Погрузка и уборка — входит. Смета в Telegram за 10 минут.',
    intro:
      'Обиход вывозит строительный, садовый и порубочный мусор в Москве и Московской области с фиксированной ценой за м³. Подъезжаем с самосвалом, грузчики на борту, уборка территории входит в цену. Лицензия Росприроднадзора на транспортирование отходов IV класса. Канал связи — Telegram, MAX, WhatsApp, телефон.',
    priceFrom: 1000,
    priceTo: 1000,
    priceUnit: 'm3',
    faqGlobal: [
      {
        question: 'Какой мусор вы принимаете?',
        answer:
          'Строительный (бой кирпича, штукатурка, стекло, оконные блоки), садовый (порубочные остатки, ветки, листва), крупногабаритный (старая мебель, техника), хлам с участка. Опасные отходы (ртуть, аккумуляторы) — через сертифицированного партнёра.',
      },
      {
        question: 'Входит ли погрузка и уборка?',
        answer:
          'Да, в фикс-цену за м³ входят выезд самосвала, грузчики, погрузка, вывоз на полигон и уборка территории после работ. Дополнительных доплат за лопаты и перчатки нет.',
      },
      {
        question: 'Работаете ли с УК, ТСЖ и застройщиками?',
        answer:
          'Да, по договору. Регулярный вывоз, разовые акции (субботники), утилизация после ремонта по объекту. По договору берём штрафы ОАТИ за свой счёт.',
      },
    ],
    subServices: [
      {
        slug: 'vyvoz-stroymusora',
        title: 'Вывоз строительного мусора',
        h1: 'Вывоз строительного мусора',
        priceFrom: 1000,
      },
      {
        slug: 'vyvoz-sadovogo-musora',
        title: 'Вывоз садового мусора',
        h1: 'Вывоз садового мусора и листвы',
        priceFrom: 1000,
      },
      {
        slug: 'uborka-uchastka',
        title: 'Уборка участка',
        h1: 'Уборка участка от хлама',
        priceFrom: 1000,
      },
    ],
    leadTemplate: (prep) =>
      `Обиход вывозит мусор ${prep} с фиксированной ценой за м³. Строительный, садовый, порубочные остатки, хлам с участка — подъезжаем с самосвалом и грузчиками. Уборка территории входит в цену. Смета в Telegram, MAX или WhatsApp за 10 минут.`,
  },
  {
    slug: 'demontazh',
    title: 'Демонтаж построек',
    h1: 'Демонтаж дач и построек',
    metaTitle: 'Демонтаж построек в Москве и МО — Обиход',
    metaDescription:
      'Сносим дачные дома, бани, сараи в Москве и МО по фикс-цене за объект. Вывоз мусора включён, порубочный билет за наш счёт. Смета по фото за 10 мин.',
    intro:
      'Обиход выполняет демонтаж построек в Москве и Московской области с фиксированной ценой за объект. Сносим дачные дома, бани, сараи, хозблоки, расчищаем участок под новое строительство. Вывоз строительного мусора и порубочный билет — за наш счёт. Канал связи — Telegram, MAX, WhatsApp, телефон.',
    priceFrom: 1000,
    priceTo: 1000,
    priceUnit: 'object',
    faqGlobal: [
      {
        question: 'Входит ли вывоз мусора в цену демонтажа?',
        answer:
          'Да, фикс-цена за объект включает демонтаж, погрузку, вывоз строительного и порубочного мусора, расчистку участка. Отдельного счёта за контейнер не будет.',
      },
      {
        question: 'Можно ли сохранить фундамент или часть постройки?',
        answer:
          'Да. Обсуждаем на этапе сметы по фото: селективный демонтаж (сохраняем фундамент / сруб для переноса / стеновые блоки на повторное использование) делаем по тому же тарифу, с пометкой в договоре.',
      },
      {
        question: 'Сколько времени занимает снос дачного дома 6×6?',
        answer:
          'Типовой деревянный дом 6×6 с расчисткой участка — 1–2 рабочих дня с бригадой из 3 человек. Каменные строения с фундаментом — от 3 дней. Точный срок фиксируем в договоре.',
      },
    ],
    subServices: [
      {
        slug: 'demontazh-dachi',
        title: 'Снос дачного дома',
        h1: 'Снос дачного дома под ключ',
        priceFrom: 1000,
      },
      {
        slug: 'demontazh-bani',
        title: 'Снос бани',
        h1: 'Снос бани и хозблока',
        priceFrom: 1000,
      },
      {
        slug: 'demontazh-saraya',
        title: 'Снос сарая',
        h1: 'Снос сарая и расчистка участка',
        priceFrom: 1000,
      },
    ],
    leadTemplate: (prep) =>
      `Обиход выполняет демонтаж построек ${prep} с фиксированной ценой за объект. Сносим дачи, бани, сараи, хозблоки, расчищаем участок под новое строительство. Вывоз мусора и порубочный билет — за наш счёт. Смета по фото в Telegram, MAX или WhatsApp за 10 минут.`,
  },
]

// Особый lead для arboristika × ramenskoye (единственный «богатый» SD)
const RAMENSKOYE_ARBO_LEAD =
  'Обиход спиливает деревья в Раменском и Раменском ГО с фиксированной ценой за объект — от 4 900 ₽ за дерево Ø до 20 см до 45 000 ₽ за аварийный спил Ø 60+ см над постройкой. Смета по 3 фото за 10 минут в Telegram, MAX или WhatsApp. Работаем во всех микрорайонах: Гостица, Холодово, Дергаево, в КП на Новорязанском направлении, в СНТ Раменского ГО.'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const log: string[] = []
  const cs: CollectionStats = {}
  const started = Date.now()

  try {
    const payload = await getPayload({ config })

    // ───────── 1. SeoSettings ─────────
    const seoStats = ensureStats(cs, 'globals/seo-settings')
    try {
      const seo = await payload.findGlobal({ slug: 'seo-settings' })
      const hasCredentials = Array.isArray((seo as { credentials?: unknown[] } | null)?.credentials)
        ? ((seo as { credentials?: unknown[] }).credentials?.length ?? 0) > 0
        : false
      if (!hasCredentials) {
        await payload.updateGlobal({
          slug: 'seo-settings',
          data: {
            organization: { name: 'Обиход' },
            localBusiness: {
              priceRange: '₽₽',
              geoRadiusKm: 150,
              openingHours: { opens: '08:00', closes: '21:00' },
            },
            credentials: [
              {
                name: 'Лицензия Росприроднадзора на транспортирование отходов IV класса',
                issuer: 'Росприроднадзор',
              },
              { name: 'Свидетельство СРО строителей', issuer: 'СРО' },
              { name: 'Страховой полис ГО 10 млн ₽', issuer: 'Страховщик' },
              { name: 'Допуски Минтруда №782н, 3-я группа по высоте', issuer: 'Минтруд' },
            ],
          },
        })
        seoStats.updated += 1
        log.push('✓ SeoSettings: заполнено')
      } else {
        seoStats.skipped += 1
        log.push('• SeoSettings: уже заполнено')
      }
    } catch (e) {
      seoStats.errors += 1
      log.push(`❌ SeoSettings: ${e instanceof Error ? e.message : String(e)}`)
    }

    // ───────── 1b. SiteChrome ─────────
    const chromeStats = ensureStats(cs, 'globals/site-chrome')
    try {
      const chrome = (await payload.findGlobal({ slug: 'site-chrome' })) as {
        contacts?: { phoneE164?: string }
      } | null
      if (!chrome?.contacts?.phoneE164) {
        await payload.updateGlobal({
          slug: 'site-chrome',
          data: {
            header: {
              menu: [
                { kind: 'anchor', label: 'Услуги', anchor: 'services' },
                { kind: 'anchor', label: 'Калькулятор', anchor: 'calc' },
                { kind: 'anchor', label: 'Как это работает', anchor: 'how' },
                { kind: 'anchor', label: 'Кейсы', anchor: 'cases' },
                { kind: 'anchor', label: 'Абонемент', anchor: 'subscription' },
                { kind: 'anchor', label: 'FAQ', anchor: 'faq' },
              ],
              cta: { label: 'Замер бесплатно', kind: 'anchor', anchor: 'calc' },
            },
            footer: {
              slogan:
                'Один подрядчик на весь год: спил, снег, демонтаж, вывоз. Работаем в Московской области, радиус 120 км от МКАД.',
              columns: [
                {
                  title: 'Услуги',
                  items: [
                    { kind: 'anchor', label: 'Спил деревьев', anchor: 'services' },
                    { kind: 'anchor', label: 'Уборка снега', anchor: 'services' },
                    { kind: 'anchor', label: 'Демонтаж и снос', anchor: 'services' },
                    { kind: 'anchor', label: 'Вывоз мусора', anchor: 'services' },
                    { kind: 'anchor', label: 'Абонементы', anchor: 'subscription' },
                  ],
                },
                {
                  title: 'Компания',
                  items: [
                    { kind: 'anchor', label: 'О нас', anchor: 'team' },
                    { kind: 'anchor', label: 'Команда', anchor: 'team' },
                    { kind: 'anchor', label: 'Кейсы', anchor: 'cases' },
                    { kind: 'anchor', label: 'FAQ', anchor: 'faq' },
                    { kind: 'anchor', label: 'Контакты', anchor: 'contact' },
                  ],
                },
              ],
              privacyUrl: '/politika-konfidentsialnosti/',
              ofertaUrl: '/oferta/',
              copyrightPrefix: '© Обиход,',
            },
            contacts: {
              phoneDisplay: '+7 (985) 170-51-11',
              phoneE164: '+79851705111',
            },
            requisites: { taxId: '7847729123' },
            social: [],
          } as never,
        })
        chromeStats.updated += 1
        log.push('✓ SiteChrome: заполнено')
      } else {
        chromeStats.skipped += 1
        log.push('• SiteChrome: уже заполнено')
      }
    } catch (e) {
      chromeStats.errors += 1
      log.push(`❌ SiteChrome: ${e instanceof Error ? e.message : String(e)}`)
    }

    // ───────── 2. Services (4) ─────────
    const serviceStats = ensureStats(cs, 'services')
    const serviceIdBySlug: Record<string, string | number> = {}

    for (const svc of SERVICES) {
      try {
        const existing = await findOneBySlug(payload, 'services', svc.slug)
        if (existing) {
          serviceIdBySlug[svc.slug] = (existing as { id: string | number }).id
          serviceStats.skipped += 1
          log.push(`• Service «${svc.title}»: уже есть`)
          continue
        }
        const created = await payload.create({
          collection: 'services',
          data: {
            slug: svc.slug,
            title: svc.title,
            h1: svc.h1,
            metaTitle: svc.metaTitle,
            metaDescription: svc.metaDescription,
            intro: lexicalParagraph(svc.intro),
            priceFrom: svc.priceFrom,
            priceTo: svc.priceTo,
            priceUnit: svc.priceUnit,
            faqGlobal: svc.faqGlobal.map((f) => ({
              question: f.question,
              answer: lexicalParagraph(f.answer),
            })),
            subServices: svc.subServices,
          } as never,
        })
        serviceIdBySlug[svc.slug] = (created as { id: string | number }).id
        serviceStats.created += 1
        log.push(`✓ Service «${svc.title}»: создан`)
      } catch (e) {
        serviceStats.errors += 1
        log.push(`❌ Service «${svc.title}»: ${e instanceof Error ? e.message : String(e)}`)
      }
    }

    // ───────── 3. Districts (7) ─────────
    const districtStats = ensureStats(cs, 'districts')
    const districtIdBySlug: Record<string, string | number> = {}
    const districtBySlug: Record<string, DistrictSeed> = {}
    for (const d of DISTRICTS) districtBySlug[d.slug] = d

    for (const d of DISTRICTS) {
      try {
        const existing = await findOneBySlug(payload, 'districts', d.slug)
        if (existing) {
          districtIdBySlug[d.slug] = (existing as { id: string | number }).id
          districtStats.skipped += 1
          log.push(`• District «${d.nameNominative}»: уже есть`)
          continue
        }
        const metaTitle = `Обиход ${d.namePrepositional} — арбо, снег, мусор, демонтаж`
        const metaDescription = `Все услуги Обихода ${d.namePrepositional}: спил деревьев, чистка крыш, вывоз мусора, демонтаж. Фикс-цена за объект, смета по фото за 10 минут в Telegram.`
        const created = await payload.create({
          collection: 'districts',
          data: {
            slug: d.slug,
            nameNominative: d.nameNominative,
            namePrepositional: d.namePrepositional,
            nameDative: d.nameDative,
            nameGenitive: d.nameGenitive,
            coverageRadius: d.coverageRadius,
            distanceFromMkad: d.distanceFromMkad,
            centerGeo: d.centerGeo,
            landmarks: d.landmarks,
            courtsJurisdiction: d.courtsJurisdiction,
            priority: d.priority,
            localPriceAdjustment: 0,
            metaTitle,
            metaDescription,
          } as never,
        })
        districtIdBySlug[d.slug] = (created as { id: string | number }).id
        districtStats.created += 1
        log.push(`✓ District «${d.nameNominative}»: создан`)
      } catch (e) {
        districtStats.errors += 1
        log.push(`❌ District «${d.nameNominative}»: ${e instanceof Error ? e.message : String(e)}`)
      }
    }

    // ───────── 4. Persons ─────────
    const personStats = ensureStats(cs, 'persons')
    let aleksey = await findOneBySlug(payload, 'persons', 'aleksey-semenov')
    if (!aleksey) {
      try {
        const worksIn = districtIdBySlug['ramenskoye'] ? [districtIdBySlug['ramenskoye']] : []
        aleksey = await payload.create({
          collection: 'persons',
          data: {
            slug: 'aleksey-semenov',
            firstName: 'Алексей',
            lastName: 'Семёнов',
            jobTitle: 'Бригадир-арборист',
            bio: lexicalParagraph(
              'Алексей закрывает Раменское и Жуковский. 11 лет опыта, допуск 3-й группы по высоте (Минтруд №782н), сертификат European Tree Worker.',
            ),
            knowsAbout: [{ topic: 'арбористика' }, { topic: 'промальп' }],
            sameAs: [{ url: 'https://t.me/aleksey_obihod' }],
            credentials: [
              {
                name: 'Допуск Минтруда №782н, 3-я группа по высоте',
                issuer: 'Минтруд',
                year: 2018,
              },
              { name: 'European Tree Worker (ETW)', issuer: 'EAC', year: 2020 },
            ],
            worksInDistricts: worksIn,
          } as never,
        })
        personStats.created += 1
        log.push('✓ Person «Алексей Семёнов»: создан')
      } catch (e) {
        personStats.errors += 1
        log.push(`❌ Person «Алексей Семёнов»: ${e instanceof Error ? e.message : String(e)}`)
      }
    } else {
      personStats.skipped += 1
      log.push('• Person «Алексей Семёнов»: уже есть')
    }

    // ───────── 5. 28 ServiceDistricts ─────────
    const sdStats = ensureStats(cs, 'service-districts')
    const districtSlugs = [
      'odincovo',
      'krasnogorsk',
      'mytishchi',
      'khimki',
      'istra',
      'pushkino',
      'ramenskoye',
    ]
    let ramenskoyeArboSdId: string | number | null = null

    for (const svc of SERVICES) {
      const serviceId = serviceIdBySlug[svc.slug]
      if (!serviceId) {
        log.push(`⚠ Service ${svc.slug} отсутствует — пропуск SD-пар`)
        continue
      }
      for (const distSlug of districtSlugs) {
        const districtId = districtIdBySlug[distSlug]
        const districtSeed = districtBySlug[distSlug]
        if (!districtId || !districtSeed) {
          log.push(`⚠ District ${distSlug} отсутствует — пропуск ${svc.slug} × ${distSlug}`)
          continue
        }
        try {
          const existing = await payload.find({
            collection: 'service-districts',
            where: {
              and: [{ service: { equals: serviceId } }, { district: { equals: districtId } }],
            },
            limit: 1,
          })
          const isArboRamenskoye = svc.slug === 'arboristika' && distSlug === 'ramenskoye'

          if (existing.docs.length > 0) {
            sdStats.skipped += 1
            if (isArboRamenskoye) {
              ramenskoyeArboSdId = (existing.docs[0] as { id: string | number }).id
            }
            log.push(`• SD «${svc.slug} × ${distSlug}»: уже есть`)
            continue
          }

          if (isArboRamenskoye) {
            const created = await payload.create({
              collection: 'service-districts',
              data: {
                service: serviceId,
                district: districtId,
                leadParagraph: lexicalParagraph(RAMENSKOYE_ARBO_LEAD),
                localFaq: [
                  {
                    question: 'Сколько стоит спил аварийной берёзы в Раменском с автовышкой?',
                    answer: lexicalParagraph(
                      'Аварийный спил Ø 30–50 см над постройкой с автовышкой 24 м — 28 000–48 000 ₽ за объект. Цена включает оценку, спил частями, погрузку и вывоз порубочных остатков. Минимальный заказ в Раменском — 8 000 ₽ (плечо 35 км от МКАД).',
                    ),
                  },
                  {
                    question: 'Нужен ли порубочный билет для садового участка в СНТ Раменского ГО?',
                    answer: lexicalParagraph(
                      'Для частных участков ИЖС в большинстве случаев согласование санитарной обрезки не требуется. Для СНТ и территорий общего пользования билет обязателен — оформляем через администрацию Раменского ГО (Комсомольская площадь, 2) за 4–7 рабочих дней. Входит в стоимость.',
                    ),
                  },
                ],
                localLandmarks: [
                  { landmarkName: 'мкр Гостица' },
                  { landmarkName: 'мкр Холодово' },
                  { landmarkName: 'КП на Новорязанском направлении' },
                ],
                localPriceNote:
                  'Минимальный заказ в Раменском — 8 000 ₽ (плечо 35 км от МКАД). Для аварийных выездов работаем 24/7.',
                publishStatus: 'draft',
                noindexUntilCase: true,
              } as never,
            })
            ramenskoyeArboSdId = (created as { id: string | number }).id
            sdStats.created += 1
            log.push(`✓ SD «${svc.slug} × ${distSlug}»: создан (draft, miniCase позже)`)
            continue
          }

          await payload.create({
            collection: 'service-districts',
            data: {
              service: serviceId,
              district: districtId,
              leadParagraph: lexicalParagraph(svc.leadTemplate(districtSeed.namePrepositional)),
              publishStatus: 'draft',
              noindexUntilCase: true,
            } as never,
          })
          sdStats.created += 1
          log.push(`✓ SD «${svc.slug} × ${distSlug}»: создан (draft)`)
        } catch (e) {
          sdStats.errors += 1
          log.push(
            `❌ SD «${svc.slug} × ${distSlug}»: ${e instanceof Error ? e.message : String(e)}`,
          )
        }
      }
    }

    // ───────── 6. Mock Case + Media (skip если нет файлов) ─────────
    const mediaStats = ensureStats(cs, 'media')
    const caseStats = ensureStats(cs, 'cases')

    let mockCase = await findOneBySlug(payload, 'cases', 'snyali-pen-gostitsa-2026')

    if (!mockCase) {
      // Кандидаты пути для placeholder-фото:
      //  1) site/content/seed/cases/  — где они лежат в репо (CLI seed)
      //  2) /tmp/obikhod-seed-photos/ — историческое расположение (do-агент)
      // На prod-deploy filelist НЕ включает content/, поэтому файлы могут
      // отсутствовать. В этом случае Case пропускается без ошибки —
      // SD «арбо × Раменское» остаётся draft + noindex.
      const candidates: Array<{ before: string; after: string }> = [
        {
          before: path.resolve(process.cwd(), 'content/seed/cases/before.jpg'),
          after: path.resolve(process.cwd(), 'content/seed/cases/after.jpg'),
        },
        {
          before: path.resolve(process.cwd(), 'site/content/seed/cases/before.jpg'),
          after: path.resolve(process.cwd(), 'site/content/seed/cases/after.jpg'),
        },
        {
          before: '/tmp/obikhod-seed-photos/before.jpg',
          after: '/tmp/obikhod-seed-photos/after.jpg',
        },
      ]
      const found = candidates.find((c) => existsSync(c.before) && existsSync(c.after))

      if (!found) {
        caseStats.skipped += 1
        log.push(
          `• Mock Case: placeholder-фото не найдены (cwd=${process.cwd()}, проверены ${candidates
            .map((c) => c.before)
            .join(', ')}) — пропуск`,
        )
      } else {
        try {
          const beforeMedia = await payload.create({
            collection: 'media',
            data: {
              alt: 'Спил аварийного пня в КП Гостица, Раменское — фото до начала работ',
              caption: 'До: пень с разросшейся корневой системой',
            },
            filePath: found.before,
          })
          mediaStats.created += 1
          const afterMedia = await payload.create({
            collection: 'media',
            data: {
              alt: 'Расчищенная площадка после удаления пня в КП Гостица, Раменское',
              caption: 'После: фрезеровка и вывоз остатков',
            },
            filePath: found.after,
          })
          mediaStats.created += 1

          const arboId = serviceIdBySlug['arboristika']
          const ramenskoyeId = districtIdBySlug['ramenskoye']
          const alekseyId = aleksey ? (aleksey as { id: string | number }).id : undefined
          if (!arboId || !ramenskoyeId) {
            throw new Error('arboristika или ramenskoye не найдены для привязки Case')
          }
          mockCase = await payload.create({
            collection: 'cases',
            data: {
              slug: 'snyali-pen-gostitsa-2026',
              title: 'Сняли аварийный пень в КП Гостица',
              h1: 'Удаление аварийного пня в КП Гостица, Раменское',
              service: arboId,
              district: ramenskoyeId,
              dateCompleted: '2026-03-15T00:00:00.000Z',
              brigade: alekseyId ? [alekseyId] : [],
              photosBefore: [
                {
                  image: (beforeMedia as { id: string | number }).id,
                  caption: 'Старый пень с разросшейся корневой системой, диаметр Ø 55 см',
                },
              ],
              photosAfter: [
                {
                  image: (afterMedia as { id: string | number }).id,
                  caption: 'Площадка после фрезеровки, корни удалены, остатки вывезены',
                },
              ],
              description: lexicalParagraph(
                'Март 2026, КП в Гостице (Раменское). Аварийный пень дуба Ø 55 см, корни приподняли асфальтированную дорожку. Команда: бригадир Алексей Семёнов + 1 помощник, цепная пила Stihl MS 462, пневматическая фреза для пня. 6 часов работы. Цена за объект — 38 000 ₽, включая порубочный билет от администрации Раменского ГО (оформили за 4 рабочих дня).',
              ),
              durationHours: 6,
              finalPrice: 38000,
              metaTitle: 'Кейс: пень Ø 55 см в КП Гостица, Раменское — Обиход',
              metaDescription:
                'Реальный кейс Обихода: фрезеровка пня дуба Ø 55 см с разросшимися корнями в КП Гостица, Раменское. 6 часов работы, 38 000 ₽ за объект.',
              ogImage: (beforeMedia as { id: string | number }).id,
            } as never,
          })
          caseStats.created += 1
          log.push('✓ Mock Case «Сняли пень в Гостице»: создан с 2 фото')
        } catch (e) {
          caseStats.errors += 1
          log.push(`❌ Mock Case: ${e instanceof Error ? e.message : String(e)}`)
        }
      }
    } else {
      caseStats.skipped += 1
      log.push('• Mock Case: уже есть')
    }

    // ───────── 7. Upgrade arbo × ramenskoye → published ─────────
    if (mockCase && ramenskoyeArboSdId) {
      try {
        const current = await payload.findByID({
          collection: 'service-districts',
          id: ramenskoyeArboSdId,
        })
        const hasCase = (current as { miniCase?: unknown }).miniCase
        const isPublished = (current as { publishStatus?: string }).publishStatus === 'published'
        if (!hasCase || !isPublished) {
          await payload.update({
            collection: 'service-districts',
            id: ramenskoyeArboSdId,
            data: {
              miniCase: (mockCase as { id: string | number }).id,
              publishStatus: 'published',
              noindexUntilCase: false,
            } as never,
          })
          sdStats.updated += 1
          log.push('✓ SD «arboristika × ramenskoye»: published + miniCase')
        } else {
          sdStats.skipped += 1
          log.push('• SD «arboristika × ramenskoye»: уже published')
        }
      } catch (e) {
        sdStats.errors += 1
        log.push(`❌ SD upgrade: ${e instanceof Error ? e.message : String(e)}`)
      }
    } else if (!mockCase) {
      log.push('• SD upgrade пропущен: mock-Case отсутствует (нет placeholder-фото)')
    }

    // ───────── SUMMARY ─────────
    const duration = ((Date.now() - started) / 1000).toFixed(1)
    const totals = Object.values(cs).reduce(
      (acc, s) => ({
        created: acc.created + s.created,
        skipped: acc.skipped + s.skipped,
        updated: acc.updated + s.updated,
        errors: acc.errors + s.errors,
      }),
      { created: 0, skipped: 0, updated: 0, errors: 0 },
    )
    const status = totals.errors === 0 ? 'ok' : 'partial'

    return NextResponse.json(
      {
        ok: totals.errors === 0,
        status,
        duration: `${duration}s`,
        totals,
        stats: cs,
        log,
      },
      { status: 200 },
    )
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ ok: false, error: message, log }, { status: 500 })
  }
}
