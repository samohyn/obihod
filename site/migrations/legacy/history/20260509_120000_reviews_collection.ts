import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Reviews collection (US-9 EPIC-SEO-COMPETE-3).
 *
 * Создаёт:
 *   - reviews (main, ~13 колонок)
 *   - _reviews_v (versions/drafts)
 *   - enum_reviews_source (yandex_maps, yandex_business, twogis, avito, site_form, direct)
 *   - payload_locked_documents_rels.reviews_id (FK column которой не было — drift fix)
 *
 * Контракт: collections/Reviews.ts + lib/seo/jsonld.ts → reviewSchema().
 *
 * 2026-05-09 incident: publish-services упал на `column reviews_id does not
 * exist` потому что Reviews collection была добавлена через push:true в
 * dev/CI, но *.up.sql миграция не написана (sustained ADR-0016 root cause #3).
 *
 * Idempotent: IF NOT EXISTS на всех CREATE/ADD.
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260509_120000_reviews_collection.${suffix}.sql`)
  return await fs.readFile(file, 'utf-8')
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const statements = await readSql('up')
  await db.execute(sql.raw(statements))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  const statements = await readSql('down')
  await db.execute(sql.raw(statements))
}
