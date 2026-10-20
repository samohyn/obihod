import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * EPIC-SERVICE-PAGES-UX C2.6 issue 3 — Calculator enum overflow fix.
 *
 * Sustained note из 20260510_161708_sd_blocks_extension: Calculator
 * (slug='calculator-placeholder') был исключён из ServiceDistricts.
 * blockReferences потому что auto-derived enum name на T4_SD parent
 * (`enum_service_districts_blocks_calculator_placeholder_service_type`)
 * = 65 символов > Postgres NAMEDATALEN 63.
 *
 * Fix: Payload v3 `enumName` function override на Calculator.serviceType
 * field (`blocks/Calculator.ts`):
 *   enumName: ({ tableName }) => `enum_${tableName}_svc_t`
 *
 * Per-table enum-имена становятся:
 *   • T2          enum_services_blocks_calculator_placeholder_svc_t            (49)
 *   • T2 drafts   enum__services_v_blocks_calculator_placeholder_svc_t          (52)
 *   • T4_SD       enum_service_districts_blocks_calculator_placeholder_svc_t    (58)
 *   • T4_SD draft enum__service_districts_v_blocks_calculator_placeholder_svc_t (61)
 *
 * Эта миграция:
 *   1. ALTER TYPE … RENAME TO … для существующих T2 enum типов
 *      (sustained data в services_blocks_calculator_placeholder unchanged —
 *      Postgres rename atomic, columns референсят TYPE по oid).
 *   2. CREATE T4_SD calculator-placeholder published + drafts tables
 *      (parent FK к service_districts / _service_districts_v).
 *   3. CREATE T4_SD enum types (короткие, ≤ 63 символа).
 *
 * После apply: ServiceDistricts.blockReferences re-extended → 12 blocks
 * (11 из 20260510_161708 + Calculator).
 *
 * Idempotent во ВСЁМ:
 *   - RENAME guarded `pg_type lookup` (skip если уже переименован)
 *   - CREATE TYPE  guarded `pg_type lookup`
 *   - CREATE TABLE / SEQUENCE  IF NOT EXISTS
 *   - ADD CONSTRAINT  guarded `pg_constraint lookup`
 *   - CREATE INDEX  IF NOT EXISTS
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260510_220000_calculator_enum_rename.${suffix}.sql`)
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
