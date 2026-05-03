/**
 * Миграция Services: legacy `intro` (richText) → `blocks: [{blockType:'text-content', body: <intro>, columns:'1'}]`.
 *
 * **Idempotent + safe to re-run.** Запускается через Payload Local API + tsx
 * (ADR-0009 preload `_payload-cjs-shim.cjs` обязателен).
 *
 * Сценарий (US-0 Track B-2, AC-3.2):
 *   - Берём все Services-документы.
 *   - Если `blocks.length > 0` — пропускаем (уже мигрировано).
 *   - Если `intro` пустой — пропускаем (нечего мигрировать).
 *   - Иначе создаём один text-content блок, оборачивающий legacy intro.
 *
 * Запуск:
 *   pnpm migrate:blocks:services                              # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm migrate:blocks:services:prod  # prod (с backup!)
 *
 * **Backup-стратегия (R3 mitigation, sa-spec §AC-3.5.c):**
 *   ПЕРЕД запуском на prod выполнить:
 *     pg_dump $DATABASE_URI > backup-pre-blocks-services-$(date +%Y%m%d-%H%M).sql
 *
 * **down() — как откатить:**
 *   Удалить blocks[] полностью (UPDATE services SET blocks=NULL).
 *   Legacy intro не трогается миграцией, остаётся первоисточником.
 *
 *   ИЛИ психологический rollback (если intro было обнулено вручную):
 *     UPDATE services SET intro = blocks[0]->>'body' WHERE blocks[0]->>'blockType' = 'text-content';
 *
 * Источник контракта: sa-seo US-0 §AC-3.
 */

import { getPayload } from 'payload'
import config from '../payload.config.js'

interface LegacyServiceDoc {
  id: string | number
  slug?: string
  intro?: unknown
  blocks?: Array<{ blockType?: string }> | null
}

async function main() {
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('ABORT: prod-БД, OBIKHOD_SEED_CONFIRM=yes не выставлен.')
    console.error('  pnpm migrate:blocks:services:prod — только после pg_dump backup.')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'services',
    limit: 0,
    pagination: false,
    overrideAccess: true,
  })

  let migrated = 0
  let skippedAlready = 0
  let skippedNoBody = 0

  for (const docRaw of result.docs) {
    // TODO(be-panel): после `pnpm generate:types` Services тип получит blocks
    // union. Пока скрипт работает с legacy-формой через unknown cast — пишем
    // только в blocks[], не трогаем intro.
    const doc = docRaw as unknown as LegacyServiceDoc

    if (Array.isArray(doc.blocks) && doc.blocks.length > 0) {
      skippedAlready++
      continue
    }
    if (!doc.intro) {
      skippedNoBody++
      continue
    }

    await payload.update({
      collection: 'services',
      id: doc.id,
      data: {
        blocks: [
          {
            blockType: 'text-content',
            body: doc.intro,
            columns: '1',
            enabled: true,
          },
        ],
      } as never,
      overrideAccess: true,
    })
    migrated++
    console.log(`✓ services#${doc.id} (slug=${doc.slug ?? '?'}) — intro → text-content block`)
  }

  console.log('')
  console.log(
    `Done. migrated=${migrated} · skipped_already=${skippedAlready} · skipped_no_intro=${skippedNoBody} · total=${result.docs.length}`,
  )
  process.exit(0)
}

main().catch((e) => {
  console.error('[migrate-services-to-blocks] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
