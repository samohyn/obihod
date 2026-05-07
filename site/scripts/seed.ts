/**
 * Seed-скрипт US-1: 4 Services × 7 пилотных Districts = 28 ServiceDistricts + 1 mock-Case + 1 Author.
 *
 * Запуск (локально):
 *   pnpm seed
 * Запуск (prod, через SSH с shared/.env, см. ADR-0001):
 *   set -a; . ./.env; set +a
 *   OBIKHOD_SEED_CONFIRM=yes OBIKHOD_ENV=production pnpm seed:prod
 *
 * Safety-gate:
 *   - regex по DATABASE_URI на prod-хост (45.153.190.107 / obikhod.ru / db.obikhod.ru)
 *   - либо OBIKHOD_ENV=production
 *   - при срабатывании требуется OBIKHOD_SEED_CONFIRM=yes
 *
 * Идемпотентен — пропускает существующие записи по slug / composite (service, district).
 * Ручные правки `cw` через admin не затираются (AC-1.3.2).
 *
 * Источник контракта: specs/US-1-seed-prod-db/sa.md (approved 2026-04-23)
 */
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../payload.config.js'

type Stats = {
  created: number
  skipped: number
  updated: number
  errors: number
}

type CollectionStats = Record<string, Stats>

// Lexical richText helper (Payload 3 default editor)
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

async function findOneBySlug(
  payload: Payload,
  collection: Parameters<Payload['find']>[0]['collection'],
  slug: string,
) {
  const r = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return r.docs[0] ?? null
}

function ensureStats(cs: CollectionStats, name: string): Stats {
  if (!cs[name]) cs[name] = { created: 0, skipped: 0, updated: 0, errors: 0 }
  return cs[name]
}

// ───────── Справочник 7 пилотных районов (sa.md §5.5) ─────────

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
    // Sustained project memory project_first_districts.md: Раменское +
    // Жуковский — первые programmatic-районы (M1 MVP). Жуковский был
    // missing в base seed → Stage 3 cases (`zhukovskij`) падал на findOne.
    slug: 'zhukovskij',
    nameNominative: 'Жуковский',
    namePrepositional: 'в Жуковском',
    nameDative: 'по Жуковскому',
    nameGenitive: 'из Жуковского',
    coverageRadius: 18,
    distanceFromMkad: 26,
    centerGeo: [38.1149, 55.5996],
    priority: 'B',
    landmarks: [
      { name: 'аэродром ЛИИ Громова', type: 'kp' },
      { name: 'СНТ Авиатор', type: 'snt' },
    ],
    courtsJurisdiction: 'Администрация городского округа Жуковский',
  },
]

// ───────── Кластеры услуг (sa.md §5.4) ─────────

type ServiceSeed = {
  slug: 'arboristika' | 'chistka-krysh' | 'vyvoz-musora' | 'demontazh' | 'uborka-territorii'
  title: string
  h1: string
  metaTitle: string
  metaDescription: string
  intro: string
  priceFrom: number
  priceTo: number
  priceUnit: 'object' | 'tree' | 'm3' | 'shift' | 'm2' | 'sotka'
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
      'Спилим дерево в Москве и МО по фикс-цене за объект. Смета по 3 фото в Telegram за 10 минут. СРО, страховка ГО 10 млн ₽, порубочный билет включён.',
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
      {
        slug: 'kronirovanie',
        title: 'Кронирование',
        h1: 'Кронирование деревьев',
        priceFrom: 3500,
      },
      {
        slug: 'udalenie-pnya',
        title: 'Удаление пня',
        h1: 'Удаление пня фрезой',
        priceFrom: 1500,
      },
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
    slug: 'chistka-krysh',
    title: 'Чистка крыш от снега и наледи',
    h1: 'Чистка крыш от снега',
    metaTitle: 'Чистка крыш от снега в Москве и МО — Обиход',
    metaDescription:
      'Чистим крыши от снега и наледи в Москве и МО по фикс-цене за м². Промальп и автовышка, страховка ГО 10 млн ₽, смета по фото в Telegram за 10 минут.',
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
      // ADR-uМ-13 + sitemap-tree v0.4: 3 новых sub под pillar chistka-krysh.
      {
        slug: 'chistka-krysh-ot-snega',
        title: 'Чистка крыш от снега',
        h1: 'Чистка крыш от снега',
        priceFrom: 1000,
      },
      {
        slug: 'chistka-krysh-uborka-territorii-zima',
        title: 'Зимняя уборка территории',
        h1: 'Зимняя уборка территории и кровли',
        priceFrom: 1000,
      },
      {
        slug: 'chistka-krysh-dogovor-na-sezon',
        title: 'Договор на сезон',
        h1: 'Договор на чистку крыш на сезон (B2B)',
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
      'Вывозим мусор в Москве и МО по фикс-цене за м³. Строительный, порубочные остатки, хлам с участка. Погрузка и уборка включены. Смета в Telegram за 10 минут.',
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
      // US-0 W3 эталон AC-11.1 — sub-service для /vyvoz-musora/staraya-mebel/.
      // priceFrom 12 800 ₽ — фикс-цена за объект до 5 м³ (cw cluster
      // vyvoz-musora.md, freq 4957). cw fixture sub-service.json дополняет
      // полный контент (intro/body/h1/meta) через seed:etalons.
      {
        slug: 'staraya-mebel',
        title: 'Вывоз старой мебели',
        h1: 'Вывоз старой мебели',
        priceFrom: 12800,
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
      'Сносим дачные дома, бани, сараи, хозблоки в Москве и МО по фикс-цене за объект. Вывоз мусора включён, порубочный билет за наш счёт. Смета за 10 минут.',
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
  // EPIC-SEO-COMPETE-3 US-7 (operator approved 2026-05-06): новый 5-й pillar.
  // Закрывает arboristik whitespace 30%+: vyravnivanie / raschistka / pokos травы.
  // Cluster wsk: C12 (913) + C43+C6+C9 (745) + C15 (168) = 1826 целевых ключей.
  {
    slug: 'uborka-territorii',
    title: 'Уборка территории',
    h1: 'Уборка территории',
    metaTitle: 'Уборка территории в Москве и МО — Обиход',
    metaDescription:
      'Покос травы, выравнивание участка, расчистка от деревьев и кустарников, вывоз порубочных остатков. Смета по фото за 10 минут, фикс-цена за сотку, бригада с триммерами и манипулятором.',
    intro:
      'Обиход выполняет уборку территории в Москве и Московской области с фиксированной ценой за сотку — от 80 ₽ за покос травы триммером до 8 000 ₽ за расчистку участка от поросли и пней. Покос травы, выравнивание участка под газон или фундамент, расчистка от старых деревьев и кустарников, вывоз порубочных остатков — закрываем все этапы подготовки участка к стройке или сезону. Смета по 3 фото за 10 минут в Telegram, MAX или WhatsApp.',
    priceFrom: 80,
    priceTo: 8000,
    priceUnit: 'sotka',
    faqGlobal: [
      {
        question: 'Что входит в фикс-цену за сотку?',
        answer:
          'Выезд бригады с инструментом (триммеры, мотокосы, кусторезы, манипулятор для расчистки), сама работа, погрузка и вывоз растительных остатков, итоговая уборка территории. Без скрытых наценок за «запылённость» или «удалённость» в пределах ЦКАД.',
      },
      {
        question: 'Можно ли совместить уборку территории с другими услугами?',
        answer:
          'Да. Часто связка: расчистка участка → демонтаж старого сарая → вывоз мусора → выравнивание под фундамент или газон. Заказываете одним договором, единая смета, общий менеджер. Совмещение даёт дисконт 5–10% от суммы.',
      },
      {
        question: 'Что делаете с порубочными остатками после расчистки?',
        answer:
          'Древесные остатки — измельчаем в щепу на участке (если вам нужно для мульчирования) или вывозим. Травянистая масса после покоса — компостируем на участке либо вывозим. Класс отходов V (зелёные остатки) сами регистрируем в ФККО, отдельной квитанции вам не нужно.',
      },
    ],
    subServices: [
      {
        slug: 'vyravnivanie-uchastka',
        title: 'Выравнивание участка',
        h1: 'Выравнивание участка под газон и фундамент',
        priceFrom: 250,
      },
      {
        slug: 'raschistka-uchastka',
        title: 'Расчистка участка',
        h1: 'Расчистка участка от деревьев и кустарников',
        priceFrom: 800,
      },
      {
        slug: 'pokos-travy',
        title: 'Покос травы',
        h1: 'Покос травы триммером и мотокосой',
        priceFrom: 80,
      },
      {
        slug: 'vyvoz-porubochnyh-ostatkov',
        title: 'Вывоз порубочных остатков',
        h1: 'Вывоз порубочных остатков и веток',
        priceFrom: 1800,
      },
    ],
    leadTemplate: (prep) =>
      `Обиход выполняет уборку территории ${prep} с фиксированной ценой за сотку — от 80 ₽ за покос травы триммером до 8 000 ₽ за расчистку от старой поросли и пней. Покос, выравнивание, расчистка, вывоз растительных остатков — закроем подготовку участка под газон, фундамент или сезон. Смета по 3 фото за 10 минут в Telegram, MAX или WhatsApp.`,
  },
]

// Особый lead + FAQ + landmarks для arboristika × ramenskoye (единственный published-LP)
const RAMENSKOYE_ARBO_LEAD =
  'Обиход спиливает деревья в Раменском и Раменском ГО с фиксированной ценой за объект — от 4 900 ₽ за дерево Ø до 20 см до 45 000 ₽ за аварийный спил Ø 60+ см над постройкой. Смета по 3 фото за 10 минут в Telegram, MAX или WhatsApp. Работаем во всех микрорайонах: Гостица, Холодово, Дергаево, в КП на Новорязанском направлении, в СНТ Раменского ГО.'

async function main() {
  // ───────── Safety-gate (ADR-0001) ─────────
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb) {
    if (process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
      console.error(
        'ABORT: prod-БД обнаружена в DATABASE_URI, ' +
          'но OBIKHOD_SEED_CONFIRM=yes не выставлен. ' +
          'Запуск отменён без изменений в БД.',
      )
      console.error('Чтобы запустить: OBIKHOD_SEED_CONFIRM=yes pnpm seed:prod')
      process.exit(1)
    }
    console.log('⚠ prod-режим: подтверждён через OBIKHOD_SEED_CONFIRM=yes')
  }

  const started = Date.now()
  const cs: CollectionStats = {}

  const payload = await getPayload({ config })

  // ───────── 1. SeoSettings (global) ─────────
  // ADR-0002: organization.telephone/legalName/taxId/ogrn/address*/foundingDate
  // и sameAs[] удалены — всё в SiteChrome. Здесь только SEO-only поля.
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
            {
              name: 'Допуски Минтруда №782н, 3-я группа по высоте',
              issuer: 'Минтруд',
            },
          ],
        },
      })
      seoStats.updated += 1
      console.log('✓ SeoSettings: заполнено')
    } else {
      seoStats.skipped += 1
      console.log('• SeoSettings: уже заполнено, пропуск')
    }
  } catch (e) {
    seoStats.errors += 1
    console.error('❌ SeoSettings:', e instanceof Error ? e.message : e)
  }

  // ───────── 1b. SiteChrome (global) ─────────
  // US-2 / ADR-0002: единый источник правды для шапки, футера, контактов,
  // реквизитов и соцсетей. Seed переносит hardcoded-значения из
  // site/components/marketing/Header.tsx + Footer.tsx в CMS.
  // Идемпотентно: если phoneE164 уже заполнен — skip (оператор мог править
  // через /admin, не затираем).
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
            cta: {
              label: 'Замер бесплатно',
              kind: 'anchor',
              anchor: 'calc',
            },
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
          requisites: {
            // Placeholders — оператор заменит при регистрации юрлица «Обиход».
            // ИНН 10 digits, ОГРН 13 digits — валидные форматы для ООО.
            taxId: '1111111111',
            kpp: '111111111',
            ogrn: '1111111111111',
          },
          social: [],
        } as never,
      })
      chromeStats.updated += 1
      console.log('✓ SiteChrome: заполнено (Header/Footer мигрированы из JSX)')
    } else {
      chromeStats.skipped += 1
      console.log('• SiteChrome: уже заполнено, пропуск')
    }
  } catch (e) {
    chromeStats.errors += 1
    console.error('❌ SiteChrome:', e instanceof Error ? e.message : e)
  }

  // ───────── 2. Services (4 кластера) ─────────
  const serviceStats = ensureStats(cs, 'services')
  const serviceIdBySlug: Record<string, string | number> = {}

  for (const svc of SERVICES) {
    try {
      const existing = await findOneBySlug(payload, 'services', svc.slug)
      if (existing) {
        serviceIdBySlug[svc.slug] = (existing as { id: string | number }).id
        serviceStats.skipped += 1
        console.log(`• Service «${svc.title}»: уже есть`)
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
      console.log(`✓ Service «${svc.title}»: создан`)
    } catch (e) {
      serviceStats.errors += 1
      console.error(`❌ Service «${svc.title}»:`, e instanceof Error ? e.message : e)
    }
  }

  // ───────── 3. Districts (Раменское существующий + 6 новых) ─────────
  const districtStats = ensureStats(cs, 'districts')
  const districtIdBySlug: Record<string, string | number> = {}

  // Раменское — сохраняем существующий (не в DISTRICTS array, но он уже мог быть создан
  // ранее через scripts/seed.ts. Если нет — создаём идентично старому seed).
  let ramenskoye = await findOneBySlug(payload, 'districts', 'ramenskoye')
  if (!ramenskoye) {
    try {
      ramenskoye = await payload.create({
        collection: 'districts',
        data: {
          slug: 'ramenskoye',
          nameNominative: 'Раменское',
          namePrepositional: 'в Раменском',
          nameDative: 'по Раменскому',
          nameGenitive: 'из Раменского',
          coverageRadius: 20,
          distanceFromMkad: 35,
          centerGeo: [38.2333, 55.5667],
          landmarks: [
            { name: 'мкр Гостица', type: 'mkr' },
            { name: 'мкр Холодово', type: 'mkr' },
            { name: 'мкр Дергаево', type: 'mkr' },
            { name: 'КП на Новорязанском направлении', type: 'kp' },
          ],
          courtsJurisdiction: 'Администрация Раменского ГО',
          priority: 'A',
          localPriceAdjustment: 0,
          metaTitle: 'Обиход в Раменском — арбо, снег, мусор, демонтаж',
          metaDescription:
            'Все услуги Обихода в Раменском и Раменском ГО: спил деревьев, чистка крыш, вывоз мусора, демонтаж. Фикс-цена за объект, смета по фото за 10 минут в Telegram.',
        } as never,
      })
      districtStats.created += 1
      console.log('✓ District «Раменское»: создан')
    } catch (e) {
      districtStats.errors += 1
      console.error('❌ District «Раменское»:', e instanceof Error ? e.message : e)
    }
  } else {
    districtStats.skipped += 1
    console.log('• District «Раменское»: уже есть')
  }
  if (ramenskoye) districtIdBySlug['ramenskoye'] = (ramenskoye as { id: string | number }).id

  for (const d of DISTRICTS) {
    try {
      const existing = await findOneBySlug(payload, 'districts', d.slug)
      if (existing) {
        districtIdBySlug[d.slug] = (existing as { id: string | number }).id
        districtStats.skipped += 1
        console.log(`• District «${d.nameNominative}»: уже есть`)
        continue
      }
      const metaTitle = `Обиход ${d.namePrepositional} — арбо, снег, мусор, демонтаж`
      const metaDescription = `Все услуги Обихода ${d.namePrepositional}: спил деревьев, чистка крыш, вывоз мусора, демонтаж. Фикс-цена за объект, смета по фото за 10 минут в Telegram или WhatsApp.`
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
      console.log(`✓ District «${d.nameNominative}»: создан`)
    } catch (e) {
      districtStats.errors += 1
      console.error(`❌ District «${d.nameNominative}»:`, e instanceof Error ? e.message : e)
    }
  }

  // ───────── 4. Authors (Алексей Семёнов) ─────────
  // PANEL-PERSONS-RENAME (2026-05-01): merged Persons → Authors. Idempotent
  // через findOneBySlug на authors slug.
  const personStats = ensureStats(cs, 'authors')
  let aleksey = await findOneBySlug(payload, 'authors', 'aleksey-semenov')
  if (!aleksey) {
    try {
      const worksIn = districtIdBySlug['ramenskoye'] ? [districtIdBySlug['ramenskoye']] : []
      aleksey = await payload.create({
        collection: 'authors',
        data: {
          slug: 'aleksey-semenov',
          firstName: 'Алексей',
          lastName: 'Семёнов',
          jobTitle: 'Бригадир-арборист',
          bio: 'Алексей закрывает Раменское и Жуковский. 11 лет опыта, допуск 3-й группы по высоте (Минтруд №782н), сертификат European Tree Worker.',
          knowsAbout: [{ topic: 'арбористика' }, { topic: 'промальп' }],
          sameAs: [{ url: 'https://t.me/aleksey_obihod' }],
          credentials: [
            {
              name: 'Допуск Минтруда №782н, 3-я группа по высоте',
              issuer: 'Минтруд',
              issuedAt: new Date('2018-01-01').toISOString(),
            },
            {
              name: 'European Tree Worker (ETW)',
              issuer: 'EAC',
              issuedAt: new Date('2020-01-01').toISOString(),
            },
          ],
          worksInDistricts: worksIn,
        } as never,
      })
      personStats.created += 1
      console.log('✓ Author «Алексей Семёнов»: создан')
    } catch (e) {
      personStats.errors += 1
      console.error('❌ Author «Алексей Семёнов»:', e instanceof Error ? e.message : e)
    }
  } else {
    personStats.skipped += 1
    console.log('• Author «Алексей Семёнов»: уже есть')
  }

  // ───────── 4b. Authors (US-11 Phase 1: 4 random RU имени для E-E-A-T axis) ─────────
  // EPIC-SEO-COMPETE-3 US-11 — operator approved 2026-05-06: рандомные русские
  // имена + bio + Person schema. Photos через fal.ai в US-11 Phase 2 после
  // operator передаст FAL_KEY.
  const COMPETE3_AUTHORS = [
    {
      slug: 'igor-kovalev',
      firstName: 'Игорь',
      lastName: 'Ковалёв',
      jobTitle: 'Промышленный альпинист, эксперт по чистке крыш',
      bio: 'Игорь руководит бригадой промальпов: чистка крыш частных домов и МКД, сбивание сосулек, работа на высоте. 9 лет опыта, допуск 5-й группы по высоте, страховой полис ГО на риски проведения работ.',
      knowsAbout: ['промышленный альпинизм', 'чистка крыш', 'удаление наледи'],
      sameAs: ['https://t.me/igor_obihod_alp'],
      credentials: [
        { name: 'Допуск 5-й группы по высоте (Минтруд №782н)', issuer: 'Минтруд' },
        { name: 'Сертификат IRATA (промышленный альпинизм)', issuer: 'IRATA' },
      ],
      districtSlugs: ['khimki', 'mytishchi'],
    },
    {
      slug: 'tatiana-voronina',
      firstName: 'Татьяна',
      lastName: 'Воронина',
      jobTitle: 'Менеджер B2B-сегмента (УК / ТСЖ / FM)',
      bio: 'Татьяна работает с УК, ТСЖ, FM-компаниями и застройщиками. Помогает оформить порубочный билет, лесную декларацию, договор на сезон. 7 лет в сфере коммунальных услуг.',
      knowsAbout: ['B2B-договоры', 'порубочный билет', 'нормативы СРО'],
      sameAs: ['https://t.me/tatiana_obihod_b2b'],
      credentials: [
        { name: 'Сертификат «Управление многоквартирным домом» (Минстрой)', issuer: 'Минстрой РФ' },
      ],
      districtSlugs: ['odincovo', 'krasnogorsk'],
    },
    {
      slug: 'dmitriy-sokolov',
      firstName: 'Дмитрий',
      lastName: 'Соколов',
      jobTitle: 'Специалист по демонтажу и спецтехнике',
      bio: 'Дмитрий ведёт демонтажные проекты: снос дачных домов, бань, сараев, бетонных конструкций. Управляет КАМАЗами с манипулятором и щепомелами. 12 лет в строительной отрасли.',
      knowsAbout: ['демонтаж построек', 'спецтехника', 'утилизация стройматериалов'],
      sameAs: ['https://t.me/dmitriy_obihod_demolish'],
      credentials: [
        { name: 'Удостоверение машиниста КАМАЗ-манипулятор', issuer: 'УЦ Транспорт' },
        { name: 'Допуск 4-й группы по электробезопасности', issuer: 'Ростехнадзор' },
      ],
      districtSlugs: ['pushkino', 'istra'],
    },
    {
      slug: 'olga-malysheva',
      firstName: 'Ольга',
      lastName: 'Малышева',
      jobTitle: 'Агроном, эксперт уборки территории',
      bio: 'Ольга — агроном с 8-летним стажем. Консультирует по подготовке участков: выравнивание, расчистка от поросли, выбор грунта под газон, борьба с борщевиком и сорной растительностью.',
      knowsAbout: ['агрономия', 'уборка территории', 'газоны', 'борьба с борщевиком'],
      sameAs: ['https://t.me/olga_obihod_agro'],
      credentials: [
        { name: 'Диплом агронома (РГАУ-МСХА им. Тимирязева)', issuer: 'РГАУ-МСХА им. Тимирязева' },
      ],
      districtSlugs: ['ramenskoye', 'zhukovskij'],
    },
  ]

  for (const author of COMPETE3_AUTHORS) {
    const existing = await findOneBySlug(payload, 'authors', author.slug)
    if (existing) {
      personStats.skipped += 1
      console.log(`• Author «${author.firstName} ${author.lastName}»: уже есть`)
      continue
    }
    try {
      const worksIn = author.districtSlugs
        .map((slug) => districtIdBySlug[slug])
        .filter((id): id is string | number => id != null)
      await payload.create({
        collection: 'authors',
        data: {
          slug: author.slug,
          firstName: author.firstName,
          lastName: author.lastName,
          jobTitle: author.jobTitle,
          bio: author.bio,
          knowsAbout: author.knowsAbout.map((topic) => ({ topic })),
          sameAs: author.sameAs.map((url) => ({ url })),
          credentials: author.credentials.map((c) => ({
            ...c,
            issuedAt: new Date('2020-01-01').toISOString(),
          })),
          worksInDistricts: worksIn,
        } as never,
      })
      personStats.created += 1
      console.log(`✓ Author «${author.firstName} ${author.lastName}»: создан`)
    } catch (e) {
      personStats.errors += 1
      console.error(
        `❌ Author «${author.firstName} ${author.lastName}»:`,
        e instanceof Error ? e.message : e,
      )
    }
  }

  // ───────── 5. 28 ServiceDistricts (4 × 7) ─────────
  const sdStats = ensureStats(cs, 'service-districts')
  const districtSlugs: string[] = [
    'odincovo',
    'krasnogorsk',
    'mytishchi',
    'khimki',
    'istra',
    'pushkino',
    'ramenskoye',
  ]
  const districtBySlug: Record<string, DistrictSeed> = {}
  for (const d of DISTRICTS) districtBySlug[d.slug] = d

  // Раменское — форма из существующего seed (справочник sa.md §5.5)
  districtBySlug['ramenskoye'] = {
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
  }

  let ramenskoyeArboSdId: string | number | null = null

  for (const svc of SERVICES) {
    const serviceId = serviceIdBySlug[svc.slug]
    if (!serviceId) {
      console.warn(`  ⚠ Service ${svc.slug} отсутствует — пропуск SD-пар`)
      continue
    }
    for (const distSlug of districtSlugs) {
      const districtId = districtIdBySlug[distSlug]
      const districtSeed = districtBySlug[distSlug]
      if (!districtId || !districtSeed) {
        console.warn(
          `  ⚠ District ${distSlug} отсутствует — пропуск пары ${svc.slug} × ${distSlug}`,
        )
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
          console.log(`• SD «${svc.slug} × ${distSlug}»: уже есть`)
          continue
        }

        if (isArboRamenskoye) {
          // Единственная «богатая» пара — 2 FAQ, 3 landmarks, localPriceNote.
          // publishStatus пока draft: miniCase привязывается шагом 7 только если
          // mock-Case создан (тот существует в app/api/seed/route.ts-варианте).
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
          console.log(`✓ SD «${svc.slug} × ${distSlug}»: создан (draft, miniCase позже)`)
          continue
        }

        // 27 draft-LP с базовым шаблоном: leadParagraph + noindex, без localFaq.
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
        console.log(`✓ SD «${svc.slug} × ${distSlug}»: создан (draft)`)
      } catch (e) {
        sdStats.errors += 1
        console.error(`❌ SD «${svc.slug} × ${distSlug}»:`, e instanceof Error ? e.message : e)
      }
    }
  }

  // ───────── 6. Mock-Case + Media + upgrade arbo × ramenskoye ─────────
  // Кейс создаём только если найден placeholder-медиа: без фото Cases не валиден
  // (minRows=1 для photosBefore / photosAfter). Placeholder-файлы живут в
  // site/content/seed/cases/ (коммитятся в репо). Если файлов нет — пропускаем
  // создание кейса, SD остаётся draft + noindex (ожидаемо для AC-1.5.2 для 27 LP,
  // но здесь 28: 27 draft без case + 1 draft без case до появления placeholder-ов).
  const mediaStats = ensureStats(cs, 'media')
  const caseStats = ensureStats(cs, 'cases')

  // Проверяем существующий кейс по slug (переиспользуем, если был создан через
  // app/api/seed/route.ts раньше).
  let mockCase = await findOneBySlug(payload, 'cases', 'snyali-pen-gostitsa-2026')
  const seedPhotosDir = new URL('../content/seed/cases/', import.meta.url).pathname
  const beforePath = `${seedPhotosDir}before.jpg`
  const afterPath = `${seedPhotosDir}after.jpg`

  if (!mockCase) {
    // fs.existsSync — synchronous import через node:fs
    const { existsSync } = await import('node:fs')
    if (!existsSync(beforePath) || !existsSync(afterPath)) {
      console.log(
        `• Mock Case: placeholder-фото не найдены (${beforePath}, ${afterPath}) — пропуск создания Case`,
      )
      caseStats.skipped += 1
    } else {
      try {
        const beforeMedia = await payload.create({
          collection: 'media',
          data: {
            alt: 'Спил аварийного пня в КП Гостица, Раменское — фото до начала работ',
            caption: 'До: пень с разросшейся корневой системой',
          },
          filePath: beforePath,
        })
        mediaStats.created += 1
        const afterMedia = await payload.create({
          collection: 'media',
          data: {
            alt: 'Расчищенная площадка после удаления пня в КП Гостица, Раменское',
            caption: 'После: фрезеровка и вывоз остатков',
          },
          filePath: afterPath,
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
              'Реальный кейс Обихода: фрезеровка пня дуба Ø 55 см с разросшимися корнями в КП Гостица, Раменское. 6 часов работы, 38 000 ₽ за объект, без следов на газоне.',
            ogImage: (beforeMedia as { id: string | number }).id,
          } as never,
        })
        caseStats.created += 1
        console.log('✓ Mock Case «Сняли пень в Гостице»: создан с 2 фото')
      } catch (e) {
        caseStats.errors += 1
        console.error('❌ Mock Case:', e instanceof Error ? e.message : e)
      }
    }
  } else {
    caseStats.skipped += 1
    mediaStats.skipped += 1
    console.log('• Mock Case: уже есть')
  }

  // ───────── 7. Upgrade arbo × ramenskoye → published + miniCase ─────────
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
        console.log('✓ SD «arboristika × ramenskoye»: published + miniCase привязан')
      } else {
        sdStats.skipped += 1
        console.log('• SD «arboristika × ramenskoye»: уже published')
      }
    } catch (e) {
      sdStats.errors += 1
      console.error('❌ SD upgrade:', e instanceof Error ? e.message : e)
    }
  } else if (!mockCase) {
    console.log(
      '• SD upgrade arbo × ramenskoye пропущен: mock-Case отсутствует (placeholder-фото не загружены)',
    )
  }

  // ───────── SUMMARY ─────────
  const duration = ((Date.now() - started) / 1000).toFixed(1)
  const totalErrors = Object.values(cs).reduce((sum, s) => sum + s.errors, 0)
  const status = totalErrors === 0 ? 'ok' : 'fail'

  console.log('\n================ SEED SUMMARY ================')
  console.log('collection           | created | skipped | updated | errors')
  console.log('---------------------|---------|---------|---------|-------')
  for (const [name, s] of Object.entries(cs)) {
    const nm = name.padEnd(21, ' ')
    const c = String(s.created).padStart(7, ' ')
    const sk = String(s.skipped).padStart(7, ' ')
    const u = String(s.updated).padStart(7, ' ')
    const er = String(s.errors).padStart(6, ' ')
    console.log(`${nm}| ${c} | ${sk} | ${u} | ${er}`)
  }
  const totals = Object.values(cs).reduce(
    (acc, s) => ({
      created: acc.created + s.created,
      skipped: acc.skipped + s.skipped,
      updated: acc.updated + s.updated,
      errors: acc.errors + s.errors,
    }),
    { created: 0, skipped: 0, updated: 0, errors: 0 },
  )
  console.log('---------------------|---------|---------|---------|-------')
  console.log(
    `\n📊 Итог: создано ${totals.created} · пропущено ${totals.skipped} · обновлено ${totals.updated} · ошибок ${totals.errors}`,
  )
  console.log(`status: ${status}  duration: ${duration}s`)
  console.log('==============================================')

  process.exit(totalErrors === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('❌ Seed упал:', err)
  process.exit(1)
})
