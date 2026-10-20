import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * PANEL-LEADS-INBOX § A.1 + § C.3 — переход на brand-guide §32.4 canonical
 * 7-status enum + добавление archivedAt для soft-delete.
 *
 * Old → New mapping (per dba review):
 *   in_amocrm → contacted
 *   estimated → smeta
 *   converted → done
 *   lost      → cancelled
 *   new, spam → без изменений
 *   brigade   → новый (no pre-spec данных)
 *
 * Idempotent: WHERE old-value защищает от повторного apply.
 *
 * Rollback safety: down() реверсит mapping (lossy для 'brigade' → 'in_amocrm'),
 * dropит archivedAt + partial index.
 *
 * SQL sources:
 *   - up:   20260501_140000_leads_status_canonical.up.sql
 *   - down: 20260501_140000_leads_status_canonical.down.sql
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260501_140000_leads_status_canonical.${suffix}.sql`)
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
