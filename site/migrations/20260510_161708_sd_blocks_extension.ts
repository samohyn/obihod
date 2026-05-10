import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * EPIC-SERVICE-PAGES-UX C2.6 — CREATE TABLE migrations для 6 SD blocks.
 *
 * Sustained note из incident PR #209/#210: prod regression `relation
 * "service_districts_blocks_breadcrumbs" does not exist` — blockReferences
 * extended без schema sync (PAYLOAD_DISABLE_PUSH=1 локально).
 *
 * Создаёт published + drafts таблицы для:
 *   • Breadcrumbs        → service_districts_blocks_breadcrumbs (+ _items)
 *   • Tldr               → service_districts_blocks_tldr
 *   • PricingTable       → service_districts_blocks_pricing_table (+ _tiers, _tiers_features)
 *   • ProcessSteps       → service_districts_blocks_process_steps (+ _steps)
 *   • NeighborDistricts  → service_districts_blocks_neighbor_districts (+ _items)
 *   • RelatedServices    → service_districts_blocks_related_services (+ _items)
 *
 * NOT включён 7-й block Calculator (slug='calculator-placeholder') — sustained
 * 65-char enum issue (`enum_service_districts_blocks_calculator_placeholder_
 * service_type` > Postgres NAMEDATALEN 63). Backlog: Payload v3 enumName
 * override field option.
 *
 * После apply этой миграции — restore B4 work: ServiceDistricts.blockReferences
 * extended → 11 blocks (5 sustained + 6 new).
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
  const file = path.join(dirname, `20260510_161708_sd_blocks_extension.${suffix}.sql`)
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
