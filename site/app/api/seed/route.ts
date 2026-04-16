import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Seed-эндпоинт для M1: первая запись каждой коллекции под Раменское × арбористика.
 * Защищён через `x-revalidate-secret` header (тот же, что и /api/revalidate).
 * Идемпотентен — пропускает существующие записи по slug.
 *
 * Использовать через Local API в Next.js route, потому что Payload 3.83
 * standalone CLI ломается на @next/env loadEnvConfig в Next 16.
 *
 * После M1 файл удалим — продакшен seed делается через миграции/админку.
 */

const lexicalParagraph = (text: string) => ({
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
})

async function findOneBySlug(payload: any, collection: string, slug: string) {
  const r = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return r.docs[0] ?? null
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const log: string[] = []
  try {
    const payload = await getPayload({ config })

    // ───────── 1. SeoSettings ─────────
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
      log.push('✓ SeoSettings: заполнено')
    } else {
      log.push('• SeoSettings: уже заполнено')
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
            'Спил деревьев в Москве и МО по фикс-цене за объект. Смета по 3 фото в Telegram/MAX/WhatsApp за 10 минут. СРО, страховка 10 млн ₽, билет за наш счёт.',
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
            { slug: 'kronirovanie', title: 'Кронирование', h1: 'Кронирование деревьев', priceFrom: 3500 },
            { slug: 'udalenie-pnya', title: 'Удаление пня', h1: 'Удаление пня фрезой', priceFrom: 1500 },
            { slug: 'avariynyy-spil', title: 'Аварийный спил', h1: 'Аварийный спил 24/7', priceFrom: 8000 },
            { slug: 'sanitarnaya-obrezka', title: 'Санитарная обрезка', h1: 'Санитарная обрезка плодовых', priceFrom: 2500 },
          ],
        } as any,
      })
      log.push('✓ Service «Арбористика»: создан')
    } else {
      log.push('• Service «Арбористика»: уже есть')
    }

    // ───────── 3. Districts ─────────
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
      log.push('✓ District «Раменское»: создан')
    } else {
      log.push('• District «Раменское»: уже есть')
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
      log.push('✓ District «Жуковский»: создан')
    } else {
      log.push('• District «Жуковский»: уже есть')
    }

    // Cross-link neighbors
    const ramenskoyeNeighbors = ((ramenskoye as any).neighborDistricts ?? []).map((n: any) =>
      typeof n === 'object' ? n.id : n,
    )
    if (!ramenskoyeNeighbors.includes((zhukovsky as any).id)) {
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
      log.push('✓ Districts: cross-linked Раменское ↔ Жуковский')
    }

    // ───────── 4. Person ─────────
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
      log.push('✓ Person «Алексей Семёнов»: создан')
    } else {
      log.push('• Person «Алексей Семёнов»: уже есть')
    }

    // ───────── 5. ServiceDistrict (draft) ─────────
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
    let sdRecord = existingSD.docs[0]
    if (!sdRecord) {
      sdRecord = await payload.create({
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
      log.push('✓ ServiceDistrict «Арбо × Раменское»: создан (draft)')
    } else {
      log.push('• ServiceDistrict «Арбо × Раменское»: уже есть')
    }

    // ───────── 6. Mock Case с placeholder фото ─────────
    let mockCase = await findOneBySlug(payload, 'cases', 'snyali-pen-gostitsa-2026')
    if (!mockCase) {
      // Загружаем placeholder JPEG (сгенерены python PIL в /tmp)
      const beforeMedia = await payload.create({
        collection: 'media',
        data: {
          alt: 'Спил аварийного пня в КП Гостица, Раменское — фото до начала работ',
          caption: 'До: пень с разросшейся корневой системой',
        },
        filePath: '/tmp/obikhod-seed-photos/before.jpg',
      })
      const afterMedia = await payload.create({
        collection: 'media',
        data: {
          alt: 'Расчищенная площадка после удаления пня в КП Гостица, Раменское',
          caption: 'После: фрезеровка и вывоз остатков',
        },
        filePath: '/tmp/obikhod-seed-photos/after.jpg',
      })

      mockCase = await payload.create({
        collection: 'cases',
        data: {
          slug: 'snyali-pen-gostitsa-2026',
          title: 'Сняли аварийный пень в КП Гостица',
          h1: 'Удаление аварийного пня в КП Гостица, Раменское',
          service: (arboService as any).id,
          district: (ramenskoye as any).id,
          dateCompleted: '2026-03-15T00:00:00.000Z',
          brigade: [(aleksey as any).id],
          photosBefore: [
            {
              image: (beforeMedia as any).id,
              caption: 'Старый пень с разросшейся корневой системой, диаметр Ø 55 см',
            },
          ],
          photosAfter: [
            {
              image: (afterMedia as any).id,
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
          ogImage: (beforeMedia as any).id,
        } as any,
      })
      log.push('✓ Mock Case «Сняли пень в Гостице»: создан с 2 фото')
    } else {
      log.push('• Mock Case: уже есть')
    }

    // ───────── 7. Привязка mini-case к ServiceDistrict + publish ─────────
    const sdHasCase = (sdRecord as any).miniCase
    const sdPublished = (sdRecord as any).publishStatus === 'published'
    if (!sdHasCase || !sdPublished) {
      await payload.update({
        collection: 'service-districts',
        id: (sdRecord as any).id,
        data: {
          miniCase: (mockCase as any).id,
          publishStatus: 'published',
          noindexUntilCase: false,
        } as any,
      })
      log.push('✓ ServiceDistrict «Арбо × Раменское»: published + miniCase привязан')
    } else {
      log.push('• ServiceDistrict уже published')
    }

    return NextResponse.json({ ok: true, log }, { status: 200 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ ok: false, error: message, log }, { status: 500 })
  }
}
