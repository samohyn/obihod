import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * План 09, этап 1 — быстрые SEO-фиксы: данные контента (битые ссылки, дубль «Жуковский»,
 * публикация «Дизайна ландшафта», выдуманные отзывы главной, контакты SiteChrome).
 *
 * Только данные, схема не меняется. Idempotent. Down — восстановление из pg_dump.
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20261019_200000_seo_quick_fixes_data.${suffix}.sql`)
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
