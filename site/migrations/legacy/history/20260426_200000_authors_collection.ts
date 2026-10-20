import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * US-5 REQ-5.5 follow-up: коллекция Authors для E-E-A-T авторов.
 *
 * Создаёт:
 *   - authors (main, ~14 колонок)
 *   - authors_robots_directives (select hasMany)
 *   - authors_knows_about, authors_same_as, authors_credentials (array hasMany)
 *   - _authors_v (versions)
 *
 * Контракт: collections/Authors.ts + lib/seo/jsonld.ts → personSchema().
 *
 * Page route /avtory/<slug>/ — будет создан в US-6 (`fe1` после написания
 * `cw` контента про экспертов).
 *
 * Idempotent: IF NOT EXISTS на всех CREATE.
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260426_200000_authors_collection.${suffix}.sql`)
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
