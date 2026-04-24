import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Cleanup — drop unused `organization_*` columns + `seo_settings_same_as`
 * table per ADR-0002 (SEO × SiteChrome dedup, US-2).
 *
 * Background:
 *   The US-3 migration (20260424_133242_us_3_blocks_and_seo) intentionally
 *   left 9 organization_* columns on `seo_settings` and the empty
 *   `seo_settings_same_as` child table in place because migration user
 *   `obikhod` was not the owner of those objects on prod (they were created
 *   by postgres superuser during an earlier db.push). `ALTER TABLE ... DROP
 *   COLUMN` therefore failed with `must be owner of table seo_settings`.
 *
 *   On 2026-04-25 the operator applied a REASSIGN-style ownership fix via
 *   Beget VNC (ALTER TABLE ... OWNER TO obikhod across public schema). This
 *   migration performs the deferred cleanup.
 *
 * Prod-safety:
 *   • All dropped columns and the dropped table were empty at cleanup time.
 *   • Current Payload schema does not reference any of them — Payload was
 *     already ignoring them as schema drift.
 *   • down() restores structure (not data) for rollback symmetry.
 *
 * SQL sources:
 *   - up:   migrations/20260425_cleanup_seo_settings_org_columns.up.sql
 *   - down: migrations/20260425_cleanup_seo_settings_org_columns.down.sql
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260425_cleanup_seo_settings_org_columns.${suffix}.sql`)
  return await fs.readFile(file, 'utf-8')
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const statements = await readSql('up')
  // Payload 3 `db.execute(sql.raw(...))` runs the whole buffer in one batch
  // and honours BEGIN/COMMIT boundaries inside the SQL file.
  await db.execute(sql.raw(statements))
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  const statements = await readSql('down')
  await db.execute(sql.raw(statements))
}
