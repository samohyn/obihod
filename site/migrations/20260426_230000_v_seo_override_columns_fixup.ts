import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Fixup: добавляет version_* колонки в _v таблицы для SEO override полей.
 *
 * В миграциях SEO override эти колонки добавлены только в основные таблицы,
 * для версионных копий _v они забыты везде кроме Services. Симптом: B2B/Blog/
 * Cases/Districts POST или PATCH → HTTP 500 при попытке Payload записать
 * snapshot с canonical_override / breadcrumb_label / lastReviewedAt / reviewedBy.
 *
 * Подробности в `.up.sql`.
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260426_230000_v_seo_override_columns_fixup.${suffix}.sql`)
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
