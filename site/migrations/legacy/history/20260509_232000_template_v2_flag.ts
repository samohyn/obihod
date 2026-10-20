import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * EPIC-SERVICE-PAGES-UX C4 — feature flag `useTemplateV2` migration.
 *
 * Добавляет boolean column `use_template_v2` на:
 *   - services  +  _services_v
 *   - service_districts  +  _service_districts_v
 *   - b2b_pages  +  _b2b_pages_v
 *
 * Default false — sustained docs не задеваются. Per-URL rollout через Payload
 * admin (см. specs/EPIC-SERVICE-PAGES-UX/c4-migration-plan.md).
 *
 * Контракт: collections/Services.ts + ServiceDistricts.ts + B2BPages.ts
 *           + lib/feature-flags/template-v2.ts.
 *
 * Idempotent: IF NOT EXISTS на ADD COLUMN, IF EXISTS на DROP COLUMN.
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260509_232000_template_v2_flag.${suffix}.sql`)
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
