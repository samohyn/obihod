import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Fixup: версионные snapshot join tables для select hasMany / array hasMany.
 *
 * В предыдущих миграциях (180000 SEO override Cases, 193000 Blog/B2B/Districts,
 * 200000 Authors) забыты `_<table>_v_version_robots_directives` snapshot-таблицы.
 * При REST POST/PATCH Payload пишет version через createVersion → INSERT в
 * snapshot-таблицу → "relation does not exist" → 500 generic error.
 *
 * Эталон сделан правильно в 180000 для Services: `_services_v_version_robots_directives`.
 *
 * Подробности в `.up.sql`.
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260426_210000_v_version_join_tables_fixup.${suffix}.sql`)
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
