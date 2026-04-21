/**
 * Seed-скрипт для M1: первая запись каждой коллекции под Раменское × арбористика.
 * Запуск: pnpm seed
 *
 * Идемпотентен — пропускает существующие записи по slug.
 */
import { getPayload } from 'payload'
import config from '../payload.config.js'

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
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: any,
  slug: string,
) {
  const r = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return r.docs[0] ?? null
}

async function main() {
  const payload = await getPayload({ config })

  // ───────── 1. SeoSettings (global) ─────────
  const seo = await payload.findGlobal({ slug: 'seo-settings' })
  if (!seo?.organization?.telephone) {
    await payload.updateGlobal({
      slug: 'seo-settings',
      data: {
        organization: {
          legalName: 'Общество с ограниченной ответственностью «Обиход»',
          name: 'Обиход',
          taxId: '7847729123',
          addressRegion: 'Санкт-Петербург',
          addressLocality: 'Санкт-Петербург',
          telephone: '+7 (495) 000-00-00',
        },
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
    console.log('✓ SeoSettings: заполнено')
  } else {
    console.log('• SeoSettings: уже заполнено, пропуск')
  }

  // ───────── 2. Service: arboristika ─────────
  let arboService = await findOneBySlug(payload, 'services', 'arboristika')
  if (!arboService) {
    arboService = await payload.create({
      collection: 'services',
      data: {
        slug: 'arboristika',
        title: 'Спил и уход за деревьями',
        h1: 'Спил деревьев',
        metaTitle: 'Спил деревьев в Москве и МО — фикс-цена | Обиход',
        metaDescription:
          'Спилим дерево в Москве и МО по фикс-цене за объект. Смета по 3 фото в Telegram, MAX, WhatsApp за 10 минут. СРО, страховка ГО 10 млн ₽, порубочный билет за наш счёт.',
        intro: lexicalParagraph(
          'Обиход спиливает деревья в Москве и Московской области с фиксированной ценой за объект — от 700 ₽ за дерево Ø до 20 см свободным падением до 45 000 ₽ за аварийный спил Ø 60+ см над постройкой. Смета по 3 фото за 10 минут в Telegram, MAX или WhatsApp. Лицензия Росприроднадзора, СРО, страховка ГО 10 млн ₽, порубочный билет за наш счёт.',
        ),
        priceFrom: 700,
        priceTo: 45000,
        priceUnit: 'tree',
        faqGlobal: [
          {
            question: 'Что входит в фикс-цену за объект?',
            answer: lexicalParagraph(
              'Выезд бригады, оценка на месте, спил, распиловка, погрузка и вывоз порубочных остатков, уборка территории, оформление порубочного билета (если требуется). Без скрытых наценок.',
            ),
          },
          {
            question: 'Как быстро вы приедете на оценку?',
            answer: lexicalParagraph(
              'На приоритетные районы — в течение дня заявки или утром следующего. Аварийные ситуации (упало дерево на дом, провода) — по принципу 24/7, выезд в течение 1–2 часов.',
            ),
          },
          {
            question: 'Кто оформляет порубочный билет?',
            answer: lexicalParagraph(
              'Мы оформляем порубочный билет за собственника в администрации района. Это входит в стоимость, отдельно не доплачивается. Срок оформления — обычно 4–7 рабочих дней.',
            ),
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
      } as any,
    })
    console.log('✓ Service «Арбористика»: создан')
  } else {
    console.log('• Service «Арбористика»: уже есть')
  }

  // ───────── 3. Districts: Раменское + Жуковский ─────────
  let ramenskoye = await findOneBySlug(payload, 'districts', 'ramenskoye')
  if (!ramenskoye) {
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
          'Все услуги Обихода в Раменском и Раменском ГО: спил деревьев, чистка крыш, вывоз мусора, демонтаж. Фикс-цена, смета за 10 минут.',
      } as any,
    })
    console.log('✓ District «Раменское»: создан')
  } else {
    console.log('• District «Раменское»: уже есть')
  }

  let zhukovsky = await findOneBySlug(payload, 'districts', 'zhukovsky')
  if (!zhukovsky) {
    zhukovsky = await payload.create({
      collection: 'districts',
      data: {
        slug: 'zhukovsky',
        nameNominative: 'Жуковский',
        namePrepositional: 'в Жуковском',
        nameDative: 'по Жуковскому',
        nameGenitive: 'из Жуковского',
        coverageRadius: 15,
        distanceFromMkad: 28,
        centerGeo: [38.1167, 55.6],
        landmarks: [
          { name: 'мкр Колонец', type: 'mkr' },
          { name: 'мкр Туполева', type: 'mkr' },
        ],
        courtsJurisdiction: 'Администрация ГО Жуковский',
        priority: 'C',
        localPriceAdjustment: 0,
        metaTitle: 'Обиход в Жуковском — арбо, снег, мусор, демонтаж',
        metaDescription:
          'Все услуги Обихода в Жуковском: спил деревьев, чистка крыш, вывоз мусора, демонтаж. Фикс-цена, смета за 10 минут.',
      } as any,
    })
    console.log('✓ District «Жуковский»: создан')
  } else {
    console.log('• District «Жуковский»: уже есть')
  }

  // Cross-link neighbors (только если ещё не связаны)
  if (
    !((ramenskoye as any).neighborDistricts ?? []).some(
      (n: any) => (typeof n === 'object' ? n.id : n) === (zhukovsky as any).id,
    )
  ) {
    await payload.update({
      collection: 'districts',
      id: (ramenskoye as any).id,
      data: { neighborDistricts: [(zhukovsky as any).id] },
    })
    await payload.update({
      collection: 'districts',
      id: (zhukovsky as any).id,
      data: { neighborDistricts: [(ramenskoye as any).id] },
    })
    console.log('✓ Districts: cross-linked Раменское ↔ Жуковский')
  }

  // ───────── 4. Person: Алексей Семёнов ─────────
  let aleksey = await findOneBySlug(payload, 'persons', 'aleksey-semenov')
  if (!aleksey) {
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
          { name: 'Допуск Минтруда №782н, 3-я группа по высоте', issuer: 'Минтруд', year: 2018 },
          { name: 'European Tree Worker (ETW)', issuer: 'EAC', year: 2020 },
        ],
        worksInDistricts: [(ramenskoye as any).id, (zhukovsky as any).id],
      } as any,
    })
    console.log('✓ Person «Алексей Семёнов»: создан')
  } else {
    console.log('• Person «Алексей Семёнов»: уже есть')
  }

  // ───────── 5. ServiceDistrict: arboristika × ramenskoye (draft) ─────────
  const existingSD = await payload.find({
    collection: 'service-districts',
    where: {
      and: [
        { service: { equals: (arboService as any).id } },
        { district: { equals: (ramenskoye as any).id } },
      ],
    },
    limit: 1,
  })
  if (existingSD.docs.length === 0) {
    await payload.create({
      collection: 'service-districts',
      data: {
        service: (arboService as any).id,
        district: (ramenskoye as any).id,
        leadParagraph: lexicalParagraph(
          'Обиход спиливает деревья в Раменском и Раменском ГО с фиксированной ценой за объект — от 4 900 ₽ за дерево Ø до 20 см до 45 000 ₽ за аварийный спил Ø 60+ см над постройкой. Смета по 3 фото за 10 минут в Telegram, MAX или WhatsApp. Работаем во всех микрорайонах: Гостица, Холодово, Дергаево, в КП на Новорязанском направлении, в СНТ Раменского ГО.',
        ),
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
      } as any,
    })
    console.log('✓ ServiceDistrict «Арбо × Раменское»: создан (draft)')
  } else {
    console.log('• ServiceDistrict «Арбо × Раменское»: уже есть')
  }

  console.log('\n✅ Seed готов.')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Seed упал:', err)
  process.exit(1)
})
