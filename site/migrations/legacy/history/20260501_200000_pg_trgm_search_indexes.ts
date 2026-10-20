import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * PANEL-GLOBAL-SEARCH (ADR-0013): pg_trgm extension + 8 GIN indexes для
 * top-bar global search по 7 коллекциям + Districts.
 *
 * Spec: specs/PANEL-GLOBAL-SEARCH/sa-panel.md
 * ADR: team/adr/ADR-0013-panel-global-search-performance.md
 *
 * Pattern follows persons_merge_into_authors.ts (read .sql, db.execute(sql.raw)).
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260501_200000_pg_trgm_search_indexes.${suffix}.sql`)
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
