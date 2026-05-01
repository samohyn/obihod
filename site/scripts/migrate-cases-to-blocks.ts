/**
 * Миграция Cases: legacy `description` (richText) → `blocks: [{blockType:'text-content', body, columns:'1'}]`.
 *
 * **Idempotent + safe to re-run.** ADR-0009 preload `_payload-cjs-shim.cjs` обязателен.
 *
 * Сценарий (US-0 Track B-2, AC-3.2):
 *   - Берём все Cases-документы.
 *   - Если `blocks.length > 0` — пропускаем.
 *   - Если `description` пустой — пропускаем.
 *   - Иначе оборачиваем legacy description в text-content блок.
 *
 * Поля service/district (required) и galleries (photosBefore/photosAfter)
 * НЕ затрагиваются — это активные fields, не legacy.
 *
 * Запуск:
 *   pnpm migrate:blocks:cases                          # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm migrate:blocks:cases:prod  # prod (с backup!)
 *
 * **Backup-стратегия (R3 mitigation, sa-spec §AC-3.5.c):**
 *   pg_dump $DATABASE_URI > backup-pre-blocks-cases-$(date +%Y%m%d-%H%M).sql
 *
 * **down() — как откатить:**
 *   UPDATE cases SET blocks = NULL;
 *   Legacy description не трогается, остаётся первоисточником.
 */

import { getPayload } from 'payload'
import config from '../payload.config.js'

interface LegacyCaseDoc {
  id: string | number
  slug?: string
  description?: unknown
  blocks?: Array<{ blockType?: string }> | null
}

async function main() {
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('ABORT: prod-БД, OBIKHOD_SEED_CONFIRM=yes не выставлен.')
    console.error('  pnpm migrate:blocks:cases:prod — только после pg_dump backup.')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'cases',
    limit: 0,
    pagination: false,
    overrideAccess: true,
  })

  let migrated = 0
  let skippedAlready = 0
  let skippedNoBody = 0

  for (const docRaw of result.docs) {
    const doc = docRaw as unknown as LegacyCaseDoc

    if (Array.isArray(doc.blocks) && doc.blocks.length > 0) {
      skippedAlready++
      continue
    }
    if (!doc.description) {
      skippedNoBody++
      continue
    }

    await payload.update({
      collection: 'cases',
      id: doc.id,
      data: {
        blocks: [
          {
            blockType: 'text-content',
            body: doc.description,
            columns: '1',
            enabled: true,
          },
        ],
      } as never,
      overrideAccess: true,
    })
    migrated++
    console.log(`✓ cases#${doc.id} (slug=${doc.slug ?? '?'}) — description → text-content block`)
  }

  console.log('')
  console.log(
    `Done. migrated=${migrated} · skipped_already=${skippedAlready} · skipped_no_description=${skippedNoBody} · total=${result.docs.length}`,
  )
  process.exit(0)
}

main().catch((e) => {
  console.error('[migrate-cases-to-blocks] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
