import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * EPIC-SERVICE-PAGES-UX C5 wave B — CREATE TABLE для 2 v2.6 blocks на Services.
 *
 * Pillar-страницы (`/<pillar>/`, T2_PILLAR) для редизайна (templateV2) требуют
 * реальные блоки pricing-table + process-steps. ServiceDistricts уже получил их
 * в C2.6 (`20260510_161708_sd_blocks_extension`) — эта миграция зеркалит то же
 * для Services (published + drafts `_services_v_*`).
 *
 * Создаёт:
 *   • PricingTable  → services_blocks_pricing_table (+ _tiers, _tiers_features)
 *   • ProcessSteps  → services_blocks_process_steps (+ _steps)
 *   • drafts mirror → _services_v_blocks_pricing_table (+ _tiers, _tiers_features)
 *                     _services_v_blocks_process_steps (+ _steps)
 *
 * После apply: Services.blockReferences extended → +PricingTable +ProcessSteps.
 *
 * Idempotent на ВСЁМ:
 *   - CREATE TYPE  guarded `pg_type lookup`
 *   - CREATE TABLE / SEQUENCE  IF NOT EXISTS
 *   - ADD CONSTRAINT  guarded `pg_constraint lookup`
 *   - CREATE INDEX  IF NOT EXISTS
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260511_120000_services_blocks_v26_extension.${suffix}.sql`)
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
