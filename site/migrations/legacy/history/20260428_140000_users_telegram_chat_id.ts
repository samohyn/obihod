import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * PAN-9 finish — добавляет поле telegram_chat_id в users.
 *
 * Использование: Wave 2.B (PAN-11) magic link login. Webhook handler
 * site/app/(payload)/api/telegram/webhook/route.ts при `/start` команде
 * сохраняет chat_id оператора в это поле, чтобы потом TelegramChannel мог
 * найти получателя magic-link по email.
 *
 * Snake-case через to-snake-case@1.0.0:
 *   telegramChatId → telegram_chat_id (без внутренних acronyms)
 *
 * Idempotent: IF NOT EXISTS защищает от повторного apply.
 *
 * Rollback safety: down() удаляет колонку. Operator должен заново сделать
 * `/start` боту чтобы восстановить chat_id.
 *
 * SQL sources:
 *   - up:   20260428_140000_users_telegram_chat_id.up.sql
 *   - down: 20260428_140000_users_telegram_chat_id.down.sql
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260428_140000_users_telegram_chat_id.${suffix}.sql`)
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
