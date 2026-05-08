/**
 * seed-cities — Districts +23 city seed (US-3 §контракт).
 *
 * Читает `seosite/strategy/03-uslugi-url-inventory.json` секцию `cities30`
 * и для каждой city добавляет District в Postgres, если ещё не существует.
 *
 * Идемпотентен: проверяет existence по slug. Перезапуск пропускает sustained.
 *
 * Required fields (Districts.ts):
 *   slug, nameNominative, namePrepositional, nameDative, nameGenitive,
 *   coverageRadius, distanceFromMkad, centerGeo, priority, localPriceAdjustment.
 *
 * Inventory содержит ТОЛЬКО nominative + prepositional (US-1 deliverable),
 * остальные склонения генерируются placeholder'ом из nominative — US-5 cw
 * уточнит в content phase.
 *
 * coverageRadius / distanceFromMkad / centerGeo — placeholder-значения
 * (radius=15, distance=30, geo=[37.6, 55.75] — центр Москвы). US-5 заполнит
 * реальные через geocoding.
 *
 * Запуск:
 *   pnpm seed:cities           # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm seed:cities:prod   # prod
 */
/* eslint-disable no-console */

import { getPayload } from 'payload'
import type { Payload } from 'payload'
import fs from 'node:fs'
import path from 'node:path'
import config from '../payload.config.js'

type CityInv = {
  slug: string
  nominative: string
  prepositional: string
  class: 'A' | 'B' | 'C'
  rank: number
  sustained: boolean
}

type InventoryRoot = {
  cities30: CityInv[]
}

async function findDistrictBySlug(payload: Payload, slug: string) {
  const r = await payload.find({
    collection: 'districts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return r.docs[0] ?? null
}

function priorityFromClass(cls: 'A' | 'B' | 'C'): 'A' | 'B' | 'C' {
  return cls
}

async function main() {
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('ABORT: prod-БД, OBIKHOD_SEED_CONFIRM=yes не выставлен.')
    process.exit(1)
  }

  // Читаем inventory.
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
  if (!Array.isArray(inv.cities30) || inv.cities30.length === 0) {
    console.error('ABORT: inventory.cities30 пустой')
    process.exit(1)
  }

  console.log(`[seed-cities] читаю ${inv.cities30.length} cities из inventory`)

  const payload = await getPayload({ config })

  let created = 0
  let skipped = 0
  let errors = 0

  for (const city of inv.cities30) {
    try {
      const existing = await findDistrictBySlug(payload, city.slug)
      if (existing) {
        skipped += 1
        console.log(`• ${city.slug} (${city.nominative}): уже есть, пропуск`)
        continue
      }

      // Placeholder-падежи: nameDative и nameGenitive копируются из nominative,
      // US-5 cw заменит через Payload Admin UI.
      // namePrepositional берём из inventory как готовое поле (без предлога —
      // sustained pattern: «в Раменском» сохранёно как «в Раменском» с предлогом
      // в существующих data, но inventory даёт только «Раменском» — добавляем
      // префикс «в »).
      const prepWithPrefix = `в ${city.prepositional}`

      await payload.create({
        collection: 'districts',
        data: {
          slug: city.slug,
          nameNominative: city.nominative,
          namePrepositional: prepWithPrefix,
          nameDative: city.nominative, // placeholder — cw US-5
          nameGenitive: city.nominative, // placeholder — cw US-5
          coverageRadius: 15, // placeholder — US-5 geocoding
          distanceFromMkad: 30, // placeholder — US-5 geocoding
          centerGeo: [37.6173, 55.7558], // placeholder = центр Москвы
          priority: priorityFromClass(city.class),
          localPriceAdjustment: 0,
          metaTitle: `Обиход ${prepWithPrefix} — арбо, снег, мусор, демонтаж`,
          metaDescription: `Все услуги Обихода ${prepWithPrefix}: спил деревьев, чистка крыш, вывоз мусора, демонтаж. Фикс-цена за объект, смета по фото за 10 минут.`,
        } as never,
      })
      created += 1
      console.log(`✓ ${city.slug} (${city.nominative}): создан [class=${city.class}]`)
    } catch (e) {
      errors += 1
      console.error(`❌ ${city.slug}:`, e instanceof Error ? e.message : e)
    }
  }

  console.log('')
  console.log(`[seed-cities] итог: создано ${created}, пропущено ${skipped}, ошибок ${errors}`)
  console.log(
    'TODO (cw, US-5): заменить placeholder nameDative/nameGenitive/centerGeo/coverageRadius/distanceFromMkad на реальные через Payload Admin UI.',
  )

  process.exit(errors === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error('[seed-cities] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
