import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * EPIC-HOMEPAGE-MIGRATION Phase 3 (ADR-0017) —
 *   Homepage global tables: 1 main row + 8 array sub-tables.
 *   Array tables: hero_trust_bullets / steps / pricing_rows / review_sources /
 *                 reviews / documents / faq / gallery.
 *   FK на media для hero_photo, photo_smeta example, documents.photo, gallery.photo.
 *
 * Sources:
 *   - up:   20260506_120000_homepage_global.up.sql
 *   - down: 20260506_120000_homepage_global.down.sql
 *
 * После применения миграции запустить seed: `pnpm seed:homepage` (TBD скрипт).
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260506_120000_homepage_global.${suffix}.sql`)
  return await fs.readFile(file, 'utf-8')
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const upSql = await readSql('up')
  await db.execute(sql.raw(upSql))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  const downSql = await readSql('down')
  await db.execute(sql.raw(downSql))
}
