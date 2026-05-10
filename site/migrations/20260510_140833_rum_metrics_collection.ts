import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * RumMetrics collection — Core Web Vitals RUM-сэмплы (OVT-3, EPIC-LIWOOD-OVERTAKE).
 *
 * Создаёт `rum_metrics` table + 3 ENUM type'а (`name`, `rating`, `navigation_type`)
 * + 5 индексов. Коллекция не использует drafts → нет `_rum_metrics_v` table.
 *
 * Контекст: collections/RumMetrics.ts уже зарегистрирована в payload.config.ts,
 * но prod БД не создавала table (PAYLOAD_DISABLE_PUSH=1) → POST /api/rum silent
 * fail. ADR-0016 root cause #3: push:true ↔ migrations drift.
 *
 * Idempotent: IF NOT EXISTS на CREATE TABLE/INDEX, DO $$...IF NOT EXISTS на CREATE TYPE.
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260510_140833_rum_metrics_collection.${suffix}.sql`)
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
