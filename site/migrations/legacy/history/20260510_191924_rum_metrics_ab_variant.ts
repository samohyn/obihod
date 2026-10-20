import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * EPIC-SERVICE-PAGES-REDESIGN D5 — RumMetrics.abVariant column.
 *
 * Добавляет ENUM `enum_rum_metrics_ab_variant` ('v1','v2') + nullable column
 * `ab_variant` + index для group-by aggregation. Используется RumProvider'ом
 * для пометки сэмплов с pilot URL (/vyvoz-musora/*). Sustained сэмплы (без
 * abVariant) остаются NULL.
 *
 * Контракт: collections/RumMetrics.ts + components/analytics/RumProvider.tsx +
 *           app/api/rum/route.ts.
 *
 * Idempotent: IF NOT EXISTS на всё.
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260510_191924_rum_metrics_ab_variant.${suffix}.sql`)
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
