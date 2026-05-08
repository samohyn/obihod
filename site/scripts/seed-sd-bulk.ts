/**
 * seed-sd-bulk — 150 ServiceDistricts bulk-seed (US-3 §контракт).
 *
 * Для каждой комбинации (5 pillar × 30 city) создаёт ServiceDistrict
 * pillar-level (`sub_service_slug IS NULL`) если ещё нет. Все SD создаются
 * в `publishStatus=draft` + `noindexUntilCase=true` (sustained iron rule:
 * без mini-Case страница носит noindex).
 *
 * 5 pillar slug'ы (sustained сейчас 4 + uborka-territorii):
 *   - vyvoz-musora
 *   - arboristika
 *   - demontazh
 *   - chistka-krysh
 *   - uborka-territorii  (пока в БД может отсутствовать → автосоздание)
 *
 * 30 city slug'ы — из `seosite/strategy/03-uslugi-url-inventory.json` cities30.
 *
 * Идемпотентен: проверяет existence через find({service, district, sub=null}).
 *
 * Запуск:
 *   pnpm seed:sd-bulk           # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm seed:sd-bulk:prod   # prod
 */
/* eslint-disable no-console */

import { getPayload } from 'payload'
import type { Payload } from 'payload'
import fs from 'node:fs'
import path from 'node:path'
import config from '../payload.config.js'

type CityInv = { slug: string }
type InventoryRoot = { cities30: CityInv[] }

const PILLAR_SLUGS = [
  'vyvoz-musora',
  'arboristika',
  'demontazh',
  'chistka-krysh',
  'uborka-territorii',
]

// Lexical paragraph helper (sustained pattern из seed.ts).
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

async function findOneBySlug(payload: Payload, collection: 'services' | 'districts', slug: string) {
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
        // partial unique index pillar-level: sub_service_slug IS NULL
        // в API exists:false проверяет именно это.
        { subServiceSlug: { exists: false } },
      ],
    },
    limit: 1,
    depth: 0,
  })
  return r.docs[0] ?? null
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
  const inv = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8')) as InventoryRoot
  const cities = inv.cities30
  if (!Array.isArray(cities) || cities.length !== 30) {
    console.warn(
      `[seed-sd-bulk] WARN: inventory.cities30.length = ${cities?.length ?? 'undefined'} (ожидалось 30)`,
    )
  }

  const payload = await getPayload({ config })

  // Резолвим pillar IDs.
  const pillarIdBySlug = new Map<string, number | string>()
  for (const slug of PILLAR_SLUGS) {
    const svc = await findOneBySlug(payload, 'services', slug)
    if (!svc) {
      console.warn(`[seed-sd-bulk] WARN: pillar service «${slug}» отсутствует — SD под него skip`)
      continue
    }
    pillarIdBySlug.set(slug, (svc as { id: number | string }).id)
  }
  console.log(
    `[seed-sd-bulk] резолвлено ${pillarIdBySlug.size}/${PILLAR_SLUGS.length} pillar services`,
  )

  // Резолвим city IDs.
  const cityIdBySlug = new Map<string, number | string>()
  const cityNomBySlug = new Map<string, string>()
  for (const c of cities) {
    const d = await findOneBySlug(payload, 'districts', c.slug)
    if (!d) {
      console.warn(`[seed-sd-bulk] WARN: city «${c.slug}» отсутствует — SD под него skip`)
      continue
    }
    const dt = d as { id: number | string; nameNominative?: string }
    cityIdBySlug.set(c.slug, dt.id)
    cityNomBySlug.set(c.slug, dt.nameNominative ?? c.slug)
  }
  console.log(
    `[seed-sd-bulk] резолвлено ${cityIdBySlug.size}/${cities.length} cities — нужно run seed-cities если меньше 30`,
  )

  let created = 0
  let skipped = 0
  let errors = 0

  for (const pillarSlug of PILLAR_SLUGS) {
    const pillarId = pillarIdBySlug.get(pillarSlug)
    if (pillarId == null) continue

    for (const c of cities) {
      const cityId = cityIdBySlug.get(c.slug)
      if (cityId == null) continue

      try {
        const existing = await findExistingPillarSd(payload, pillarId, cityId)
        if (existing) {
          skipped += 1
          continue
        }

        const cityNom = cityNomBySlug.get(c.slug) ?? c.slug
        await payload.create({
          collection: 'service-districts',
          data: {
            service: pillarId,
            district: cityId,
            // pillar-level → sub_service_slug = null
            // (Payload автоматически сохраняет undefined → NULL)
            leadParagraph: lexicalParagraph(
              `Программная посадочная: ${pillarSlug} × ${cityNom}. Контент будет наполнен в US-5 (cw + cms). Сейчас — draft + noindex.`,
            ),
            publishStatus: 'draft',
            noindexUntilCase: true,
          } as never,
        })
        created += 1
      } catch (e) {
        errors += 1
        console.error(`❌ SD ${pillarSlug} × ${c.slug}:`, e instanceof Error ? e.message : e)
      }
    }
  }

  console.log('')
  console.log(
    `[seed-sd-bulk] итог: создано ${created}, пропущено ${skipped}, ошибок ${errors} (target ${PILLAR_SLUGS.length}×${cities.length}=${PILLAR_SLUGS.length * cities.length})`,
  )
  process.exit(errors === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error('[seed-sd-bulk] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
