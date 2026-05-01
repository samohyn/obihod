/**
 * Миграция Districts: blocks-field готов к наполнению.
 *
 * **Idempotent + safe to re-run.** ADR-0009 preload `_payload-cjs-shim.cjs` обязателен.
 *
 * **Особенность:** Districts НЕ имеет legacy `body: richText` поля — у коллекции
 * структурированные fields (landmarks, neighborDistricts, coverageRadius,
 * centerGeo, …). Поэтому миграция = no-op для всех существующих документов.
 *
 * Скрипт создан для unified pattern (Track B-2 6 миграций) и `migrate:blocks:all`
 * aggregate. Когда сms начнёт наполнять District Hub /raiony/<district>/ через
 * blocks-конструктор, скрипт можно расширить (или удалить как неактуальный).
 *
 * Все документы будут просто пропущены — но скрипт логирует статистику для
 * audit trail (sa-spec §AC-3.5).
 *
 * Запуск:
 *   pnpm migrate:blocks:districts                          # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm migrate:blocks:districts:prod  # prod (с backup!)
 *
 * **Backup-стратегия (R3 mitigation, sa-spec §AC-3.5.c):**
 *   pg_dump $DATABASE_URI > backup-pre-blocks-districts-$(date +%Y%m%d-%H%M).sql
 *
 * **down() — как откатить:**
 *   UPDATE districts SET blocks = NULL;
 */

import { getPayload } from 'payload'
import config from '../payload.config.js'

interface DistrictDoc {
  id: string | number
  slug?: string
  blocks?: Array<{ blockType?: string }> | null
}

async function main() {
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('ABORT: prod-БД, OBIKHOD_SEED_CONFIRM=yes не выставлен.')
    console.error('  pnpm migrate:blocks:districts:prod — только после pg_dump backup.')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'districts',
    limit: 0,
    pagination: false,
    overrideAccess: true,
  })

  let alreadyHasBlocks = 0
  let noLegacyBody = 0

  for (const docRaw of result.docs) {
    const doc = docRaw as unknown as DistrictDoc
    if (Array.isArray(doc.blocks) && doc.blocks.length > 0) {
      alreadyHasBlocks++
    } else {
      // Districts не имеет legacy body для миграции.
      noLegacyBody++
    }
  }

  console.log('')
  console.log(
    `Done. already_has_blocks=${alreadyHasBlocks} · no_legacy_body=${noLegacyBody} · total=${result.docs.length}`,
  )
  console.log(
    'Districts: blocks-field готов; контент наполняется cms через admin UI вручную (нет legacy richText для авто-миграции).',
  )
  process.exit(0)
}

main().catch((e) => {
  console.error('[migrate-districts-to-blocks] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
