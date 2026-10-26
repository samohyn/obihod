import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Данные для 5.1, отдельно от схемы: старые заявки получают срок по времени создания, у закрытых
 * срока нет, у тех, с кем уже работали (статус не «Новая»), таймер остановлен. Откат — .down.sql.
 */

// tsx собирает пакет как CommonJS (в package.json нет "type": "module") — там есть __dirname.
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  return await fs.readFile(
    path.join(dirname, `20261026_120100_leads_sla_backfill.${suffix}.sql`),
    'utf-8',
  )
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(await readSql('up')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(await readSql('down')))
}
