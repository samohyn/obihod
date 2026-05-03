/**
 * Миграция Blog: legacy `body` (richText) → `blocks: [{blockType:'text-content', body, columns:'1'}]`.
 *
 * **Idempotent + safe to re-run.** ADR-0009 preload `_payload-cjs-shim.cjs` обязателен.
 *
 * Сценарий (US-0 Track B-2, AC-3.2):
 *   - Берём все Blog-документы.
 *   - Если `blocks.length > 0` — пропускаем.
 *   - Если `body` пустой — пропускаем.
 *   - Иначе создаём один text-content блок, оборачивающий legacy body.
 *
 * Запуск:
 *   pnpm migrate:blocks:blog                          # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm migrate:blocks:blog:prod  # prod (с backup!)
 *
 * **Backup-стратегия (R3 mitigation, sa-spec §AC-3.5.c):**
 *   pg_dump $DATABASE_URI > backup-pre-blocks-blog-$(date +%Y%m%d-%H%M).sql
 *
 * **down() — как откатить:**
 *   UPDATE blog SET blocks = NULL;
 *   Legacy body не трогается, остаётся первоисточником.
 */

import { getPayload } from 'payload'
import config from '../payload.config.js'

interface LegacyBlogDoc {
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
    console.error('  pnpm migrate:blocks:blog:prod — только после pg_dump backup.')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'blog',
    limit: 0,
    pagination: false,
    overrideAccess: true,
  })

  let migrated = 0
  let skippedAlready = 0
  let skippedNoBody = 0

  for (const docRaw of result.docs) {
    // TODO(be-panel): после `pnpm generate:types` Blog тип получит blocks union.
    const doc = docRaw as unknown as LegacyBlogDoc

    if (Array.isArray(doc.blocks) && doc.blocks.length > 0) {
      skippedAlready++
      continue
    }
    if (!doc.body) {
      skippedNoBody++
      continue
    }

    await payload.update({
      collection: 'blog',
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
    console.log(`✓ blog#${doc.id} (slug=${doc.slug ?? '?'}) — body → text-content block`)
  }

  console.log('')
  console.log(
    `Done. migrated=${migrated} · skipped_already=${skippedAlready} · skipped_no_body=${skippedNoBody} · total=${result.docs.length}`,
  )
  process.exit(0)
}

main().catch((e) => {
  console.error('[migrate-blog-to-blocks] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
