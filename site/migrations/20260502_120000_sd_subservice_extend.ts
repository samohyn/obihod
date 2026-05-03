import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * US-3 Wave 0.1: расширение service_districts triple unique
 * (service_id, district_id, sub_service_slug) для 4-уровневой URL-иерархии.
 *
 * Подробности в `.up.sql`.
 *
 * Архитектурное замечание be-panel/dba 2026-05-02: спека предлагала
 * relationship на collection `sub-services`, но такой collection не
 * существует — sub-услуги хранятся как inline array Services.subServices.
 * Поэтому используем text-колонку sub_service_slug + partial unique
 * indexes (pillar-level WHERE NULL + sub-level WHERE NOT NULL).
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260502_120000_sd_subservice_extend.${suffix}.sql`)
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
