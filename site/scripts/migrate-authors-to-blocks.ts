/**
 * Миграция Authors: blocks-field готов к наполнению.
 *
 * **Idempotent + safe to re-run.** ADR-0009 preload `_payload-cjs-shim.cjs` обязателен.
 *
 * **Особенность:** Authors имеет `bio: textarea` (plain-text, не richText) —
 * это поле осталось как Person.description в JSON-LD schema, его НЕ
 * мигрируем в text-content (там Lexical richText, формат не совместим).
 *
 * Скрипт = no-op для всех существующих документов; создан для unified pattern
 * Track B-2 + audit trail. Когда `cms` начнёт наполнять страницы авторов
 * блочно (статьи, экспертиза, cross-link на услуги) — будет наполнять через
 * admin UI вручную.
 *
 * `worksInDistricts` field уже существует в Authors.ts (tab «Связи») —
 * добавлять не нужно. Track C seed-authors.ts использует его как есть.
 *
 * Запуск:
 *   pnpm migrate:blocks:authors                          # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm migrate:blocks:authors:prod  # prod (с backup!)
 *
 * **Backup-стратегия (R3 mitigation, sa-spec §AC-3.5.c):**
 *   pg_dump $DATABASE_URI > backup-pre-blocks-authors-$(date +%Y%m%d-%H%M).sql
 *
 * **down() — как откатить:**
 *   UPDATE authors SET blocks = NULL;
 */

import { getPayload } from 'payload'
import config from '../payload.config.js'

interface AuthorDoc {
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
    console.error('  pnpm migrate:blocks:authors:prod — только после pg_dump backup.')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'authors',
    limit: 0,
    pagination: false,
    overrideAccess: true,
  })

  let alreadyHasBlocks = 0
  let noLegacyRichText = 0

  for (const docRaw of result.docs) {
    const doc = docRaw as unknown as AuthorDoc
    if (Array.isArray(doc.blocks) && doc.blocks.length > 0) {
      alreadyHasBlocks++
    } else {
      // Authors.bio — textarea (plain-text), НЕ конвертируется в Lexical text-content.
      noLegacyRichText++
    }
  }

  console.log('')
  console.log(
    `Done. already_has_blocks=${alreadyHasBlocks} · no_legacy_richtext=${noLegacyRichText} · total=${result.docs.length}`,
  )
  console.log(
    'Authors: blocks-field готов; bio (textarea) сохранён для Person.description JSON-LD schema. Контент cms наполняет через admin UI.',
  )
  process.exit(0)
}

main().catch((e) => {
  console.error('[migrate-authors-to-blocks] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
