/**
 * Миграция B2BPages: legacy `body` (richText) → `blocks: [{blockType:'text-content', body, columns:'1'}]`.
 *
 * **Idempotent + safe to re-run.** ADR-0009 preload `_payload-cjs-shim.cjs` обязателен.
 *
 * Сценарий (US-0 Track B-2, AC-3.2):
 *   - Берём все B2BPages-документы.
 *   - Если `blocks.length > 0` — пропускаем.
 *   - Если `body` пустой — пропускаем.
 *   - Иначе оборачиваем legacy body в text-content блок.
 *
 * Поля casesShowcase / formConfig / contractTemplateUrl / krishaShtraf — НЕ
 * затрагиваются (активные fields, не legacy).
 *
 * Запуск:
 *   pnpm migrate:blocks:b2bpages                          # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm migrate:blocks:b2bpages:prod  # prod (с backup!)
 *
 * **Backup-стратегия (R3 mitigation, sa-spec §AC-3.5.c):**
 *   pg_dump $DATABASE_URI > backup-pre-blocks-b2bpages-$(date +%Y%m%d-%H%M).sql
 *
 * **down() — как откатить:**
 *   UPDATE b2b_pages SET blocks = NULL;
 *   Legacy body не трогается, остаётся первоисточником.
 */

import { getPayload } from 'payload'
import config from '../payload.config.js'

interface LegacyB2BPageDoc {
  id: string | number
  slug?: string
  body?: unknown
  blocks?: Array<{ blockType?: string }> | null
}

async function main() {
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('ABORT: prod-БД, OBIKHOD_SEED_CONFIRM=yes не выставлен.')
    console.error('  pnpm migrate:blocks:b2bpages:prod — только после pg_dump backup.')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'b2b-pages',
    limit: 0,
    pagination: false,
    overrideAccess: true,
  })

  let migrated = 0
  let skippedAlready = 0
  let skippedNoBody = 0

  for (const docRaw of result.docs) {
    const doc = docRaw as unknown as LegacyB2BPageDoc

    if (Array.isArray(doc.blocks) && doc.blocks.length > 0) {
      skippedAlready++
      continue
    }
    if (!doc.body) {
      skippedNoBody++
      continue
    }

    await payload.update({
      collection: 'b2b-pages',
      id: doc.id,
      data: {
        blocks: [
          {
            blockType: 'text-content',
            body: doc.body,
            columns: '1',
            enabled: true,
          },
        ],
      } as never,
      overrideAccess: true,
    })
    migrated++
    console.log(`✓ b2b-pages#${doc.id} (slug=${doc.slug ?? '?'}) — body → text-content block`)
  }

  console.log('')
  console.log(
    `Done. migrated=${migrated} · skipped_already=${skippedAlready} · skipped_no_body=${skippedNoBody} · total=${result.docs.length}`,
  )
  process.exit(0)
}

main().catch((e) => {
  console.error('[migrate-b2bpages-to-blocks] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
