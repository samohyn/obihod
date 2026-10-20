import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * US-5 REQ-5.7 follow-up: SEO override + E-E-A-T поля для Blog/B2BPages/Districts.
 *
 * Зеркало миграции 20260426_180000_seo_override_fields (Services + Cases).
 * Закрывает «остальные коллекции» из sa.md US-5 §REQ-5.7.
 *
 * Поля:
 *   blog:        canonical_override, breadcrumb_label, last_reviewed_at,
 *                reviewed_by_id (FK → persons), robots_directives[]
 *   b2b_pages:   canonical_override, breadcrumb_label, robots_directives[]
 *   districts:   canonical_override, breadcrumb_label, robots_directives[]
 *
 * Idempotent: IF NOT EXISTS на columns/tables/indexes/constraints.
 *
 * SQL:
 *   - up:   migrations/20260426_193000_seo_override_blog_b2b_districts.up.sql
 *   - down: migrations/20260426_193000_seo_override_blog_b2b_districts.down.sql
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260426_193000_seo_override_blog_b2b_districts.${suffix}.sql`)
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
