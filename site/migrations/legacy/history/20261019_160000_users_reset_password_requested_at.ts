import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Payload 3.90 security release — users.resetPasswordRequestedAt column.
 *
 * Payload 3.90.0 добавляет auth-коллекциям поле resetPasswordRequestedAt (сброс пароля снимает
 * блокировку, forgot-password троттлится). Колонка `reset_password_requested_at`, nullable.
 *
 * Idempotent: IF NOT EXISTS / IF EXISTS.
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20261019_160000_users_reset_password_requested_at.${suffix}.sql`)
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
