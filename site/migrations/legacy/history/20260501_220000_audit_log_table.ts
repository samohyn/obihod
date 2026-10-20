import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * PANEL-AUDIT-LOG (ADR-0014 Strategy 3 Hybrid) —
 *   custom audit_log table для PII collections (Leads/Users/Media/Redirects)
 *   + security events (login/logout/rbac/bulk-action) + globals.
 *
 * Why not Payload collection (audit_log как Payload-managed):
 *   - Payload коллекция автоматически генерирует id INTEGER serial (а не UUID),
 *     полный set Payload polymorphic relationship overhead, "Versions" UI tab
 *     и hook lifecycle, которые тут не нужны (audit log read-only).
 *   - SQL UNION ALL с <collection>_versions проще когда таблица raw.
 *   - jsonb diff column не нужен Payload field-mapping (мы пишем сырой объект
 *     с masking, читаем напрямую в diff view).
 *
 * Sources:
 *   - up:   20260501_220000_audit_log_table.up.sql
 *   - down: 20260501_220000_audit_log_table.down.sql
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260501_220000_audit_log_table.${suffix}.sql`)
  return await fs.readFile(file, 'utf-8')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const statements = await readSql('up')
  await db.execute(sql.raw(statements))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  const statements = await readSql('down')
  await db.execute(sql.raw(statements))
}
