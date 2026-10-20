import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * US-5 REQ-5.7: SEO override + E-E-A-T поля для Services и Cases.
 *
 * Поля:
 *   services:        canonical_override, breadcrumb_label, robots_directives[]
 *   _services_v:     то же (для drafts)
 *   cases:           canonical_override, breadcrumb_label, robots_directives[],
 *                    last_reviewed_at, reviewed_by_id (FK → persons)
 *
 * Drizzle convention для select hasMany — отдельная join-таблица
 * `<parent>_<field>` с колонками order/parent_id/value/id.
 *
 * Idempotent: IF NOT EXISTS на columns/tables/indexes/constraints.
 *
 * Background:
 *   До этой миграции ни одна коллекция кроме ServiceDistricts не имела
 *   override-полей. По US-5 sa.md REQ-5.7 — нужны на всех публичных
 *   коллекциях. В этом PR покрываем 2 главных (Services pillar + Cases).
 *   Остальные (Blog, B2BPages, Districts) — отдельная миграция в US-6/US-7.
 *
 * SQL:
 *   - up:   migrations/20260426_180000_seo_override_fields.up.sql
 *   - down: migrations/20260426_180000_seo_override_fields.down.sql
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260426_180000_seo_override_fields.${suffix}.sql`)
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
