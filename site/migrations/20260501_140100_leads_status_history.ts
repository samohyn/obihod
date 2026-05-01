import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * PANEL-LEADS-INBOX § A.3 + ADR-0012 — audit log смен status через jsonb[].
 *
 * Why jsonb (не отдельная коллекция LeadStatusEvents):
 *   - YAGNI на старте (50-150 leads/неделя × ~3-5 changes = ~500 events/неделя)
 *   - Single query при open doc, нет JOIN
 *   - jsonb backwards-compatible с column-extraction при росте
 *
 * Hook писатель — Leads.hooks.beforeChange (см. site/collections/Leads.ts).
 * Rendering — site/components/admin/leads/StatusHistoryField.tsx.
 *
 * Backfill: synthetic baseline entry → StatusHistoryField не-пустой даже для
 * pre-spec leads.
 *
 * SQL sources:
 *   - up:   20260501_140100_leads_status_history.up.sql
 *   - down: 20260501_140100_leads_status_history.down.sql
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260501_140100_leads_status_history.${suffix}.sql`)
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
