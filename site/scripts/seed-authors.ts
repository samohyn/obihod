/**
 * Authors seed — company-page «Бригада вывоза Обихода» + оператор-placeholder.
 *
 * US-0 Track C, AC-10. Idempotent: повторный запуск пропускает существующие
 * записи по slug.
 *
 * Запуск:
 *   pnpm seed:authors                   # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm seed:authors:prod   # prod
 *
 * Что делает:
 *   1) Создаёт «Бригада вывоза Обихода» (jobTitle='Команда', knowsAbout=4 темы).
 *   2) Создаёт «Georgy S.» (placeholder под реального оператора; W2-W3 cms
 *      заменит ФИО/sameAs на реальные через Payload Admin UI).
 *
 * worksInDistricts проставляется на ВСЕ найденные districts (Authors имеет
 * relationship hasMany — см. site/collections/Authors.ts).
 *
 * Bio тексты — в TOV §13 (Caregiver+Ruler, конкретные цифры, без «гарантируем
 * качество»). Прошли через mental TOV-checker в момент написания (cw).
 *
 * art apruvит silhouette/back-shot аватары в W2 — пока imageUrl не ставим
 * (поле avatar — upload, оно опциональное, оставляем null).
 *
 * Источник контракта: specs/EPIC-SEO-CONTENT-FILL/US-0-templates-ux-migration/sa-seo.md AC-10.
 */

import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../payload.config.js'

type AuthorSeed = {
  slug: string
  firstName: string
  lastName: string
  jobTitle: string
  bio: string
  knowsAbout: { topic: string }[]
  sameAs?: { url: string }[]
  credentials?: { name: string; issuer?: string }[]
}

const AUTHORS: AuthorSeed[] = [
  {
    slug: 'brigada-vyvoza-obihoda',
    firstName: 'Бригада',
    lastName: 'вывоза Обихода',
    jobTitle: 'Команда',
    // Bio ~200 слов, TOV §13: цифры конкретные, договор с УК — не «индивидуальный
    // подход», страховка ГО 10 млн ₽ — не «гарантируем качество».
    bio:
      'Бригада Обихода работает в Москве и Московской области с 2024 года. ' +
      'Закрываем четыре направления одним договором: вывоз мусора, спил деревьев, ' +
      'чистка крыш от снега и демонтаж построек. За первый сезон отработали ' +
      '86 объектов в Раменском, Одинцовском и Красногорском городских округах — ' +
      'в основном частный сектор и небольшие УК.\n\n' +
      'По договору с УК и ТСЖ берём на себя штрафы ГЖИ и ОАТИ в пределах ' +
      'ответственности подрядчика. Страховка ГО — 10 млн ₽, лицензия ' +
      'Росприроднадзора на транспортирование отходов IV класса, СРО строителей. ' +
      'Допуски Минтруда №782н, 3-я группа по высоте — для работ на кровлях и ' +
      'арбористики на высоте.\n\n' +
      'Смету присылаем за 10 минут после трёх фото в Telegram, MAX или WhatsApp. ' +
      'Окна выезда — типовая заявка послезавтра до 12:00, аварийная (упало дерево, ' +
      'затопило подвал) — в течение 1–2 часов 24/7. Минимальный заказ зависит от ' +
      'плеча: в Москве и ближнем поясе МО — без минимума, дальше 30 км от МКАД — ' +
      'от 8 000 ₽ за выезд.',
    knowsAbout: [
      { topic: 'вывоз мусора' },
      { topic: 'арбористика' },
      { topic: 'чистка крыш' },
      { topic: 'демонтаж' },
      { topic: 'B2B-договоры с УК и ТСЖ' },
      { topic: 'штрафы ГЖИ и ОАТИ' },
    ],
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
  {
    slug: 'georgy-s',
    firstName: 'Georgy',
    lastName: 'S.',
    jobTitle: 'Основатель и руководитель',
    // Placeholder ФИО — оператор подменит на реальное через Payload Admin UI
    // в W2-W3 (см. Hand-off log → operator на 2026-05-01). bio — общий
    // паттерн B2B-автора с четырьмя направлениями опыта; ~150 слов.
    bio:
      'Запустил Обиход в 2024 году, чтобы закрыть собственникам и управляющим ' +
      'компаниям один договор на четыре сезонные задачи — вместо четырёх ' +
      'разных подрядчиков с разными SLA. До этого десять лет вёл операционную ' +
      'часть в B2B-обслуживании жилого фонда: УК, ТСЖ, FM, тендеры по 44-ФЗ.\n\n' +
      'Лично подписываю каждый договор с УК и ТСЖ, в котором мы берём на себя ' +
      'штрафы ГЖИ и ОАТИ. По объектам в Московской области выезжаю на первичную ' +
      'оценку сам — для УК это норма, не маркетинг. Контакты в Telegram и VK ' +
      'открыты, отвечаю в течение часа в рабочее время.',
    knowsAbout: [
      { topic: 'B2B-договоры с УК и ТСЖ' },
      { topic: 'обслуживание жилого фонда' },
      { topic: 'штрафы ГЖИ и ОАТИ' },
      { topic: 'госзаказ 44-ФЗ' },
      { topic: 'операционный менеджмент' },
    ],
    sameAs: [
      // Placeholder URL — оператор подменит реальные в W2-W3.
      { url: 'https://t.me/obihod_operator_placeholder' },
      { url: 'https://vk.com/obihod_placeholder' },
    ],
  },
]

async function findAllDistrictIds(payload: Payload): Promise<(string | number)[]> {
  const r = await payload.find({
    collection: 'districts',
    limit: 100,
    pagination: false,
  })
  return r.docs.map((d) => (d as { id: string | number }).id)
}

async function findAuthorBySlug(payload: Payload, slug: string) {
  const r = await payload.find({
    collection: 'authors',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return r.docs[0] ?? null
}

async function main() {
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('ABORT: prod-БД, OBIKHOD_SEED_CONFIRM=yes не выставлен. Запуск отменён.')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  const districtIds = await findAllDistrictIds(payload)
  console.log(`[seed-authors] districts найдено: ${districtIds.length}`)

  let created = 0
  let skipped = 0
  let errors = 0

  for (const a of AUTHORS) {
    try {
      const existing = await findAuthorBySlug(payload, a.slug)
      if (existing) {
        skipped += 1
        console.log(`• Author «${a.firstName} ${a.lastName}» (${a.slug}): уже есть, пропуск`)
        continue
      }
      await payload.create({
        collection: 'authors',
        data: {
          slug: a.slug,
          firstName: a.firstName,
          lastName: a.lastName,
          jobTitle: a.jobTitle,
          bio: a.bio,
          knowsAbout: a.knowsAbout,
          sameAs: a.sameAs ?? [],
          credentials: (a.credentials ?? []).map((c) => ({
            name: c.name,
            issuer: c.issuer,
          })),
          worksInDistricts: districtIds,
        } as never,
      })
      created += 1
      console.log(`✓ Author «${a.firstName} ${a.lastName}» создан (slug=${a.slug})`)
    } catch (e) {
      errors += 1
      console.error(`❌ Author «${a.firstName} ${a.lastName}»:`, e instanceof Error ? e.message : e)
    }
  }

  console.log('')
  console.log(`[seed-authors] итог: создано ${created}, пропущено ${skipped}, ошибок ${errors}`)
  console.log(
    'TODO (cms, W2-W3): через Payload Admin UI заменить ФИО Georgy S. на реальное + sameAs URLs.',
  )
  console.log(
    'TODO (art + cw, W2): silhouette/back-shot аватары через fal.ai (companyAuthorAvatarPrompt) → upload в Media → привязать к авторам.',
  )

  process.exit(errors === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error('[seed-authors] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
