import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * PANEL-PERSONS-RENAME (variant b): merge Persons → Authors.
 *
 * Spec: specs/PANEL-PERSONS-RENAME/sa-panel.md
 * Operator decision (2026-05-01): variant (b) merge with Authors. Default
 * conflict resolution = keep newest + suffix slug `-2`..`-99`.
 *
 * Шаги:
 *   1. Создаёт _persons_to_authors_map (mapping table — рабочая, остаётся для аудита).
 *   2. Создаёт authors_rels (новый join table для worksInDistricts на Authors).
 *   3. Копирует persons → authors с conflict resolution slug + Lexical bio extract.
 *   4. Копирует persons_credentials → authors_credentials (year → issued_at='YYYY-01-01').
 *   5. Копирует persons_knows_about → authors_knows_about.
 *   6. Копирует persons_same_as → authors_same_as.
 *   7. Копирует persons_rels.districts_id → authors_rels.
 *   8. Rebinds FK references (blog/cases/service_districts + version tables).
 *   9. DROPs persons + persons_* tables.
 *  10. Удаляет payload_locked_documents_rels.persons_id.
 *
 * Refs пере-mapped (5 references из spec + 1 пропущенная — service_districts):
 *   - blog.author_id, blog.reviewed_by_id, _blog_v.version_*
 *   - cases.reviewed_by_id, cases_rels.persons_id (→authors_id), _cases_v_rels.persons_id (→authors_id), _cases_v.version_reviewed_by_id
 *   - service_districts.reviewed_by_id, _service_districts_v.version_reviewed_by_id
 *
 * Idempotent guards: IF NOT EXISTS / IF EXISTS на DDL.
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260501_180000_persons_merge_into_authors.${suffix}.sql`)
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
