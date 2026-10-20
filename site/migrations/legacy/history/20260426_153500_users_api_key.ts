import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Enable Payload useAPIKey: true для коллекции users.
 *
 * Background:
 *   2026-04-26 P0 incident — PR #41 включил `auth: { useAPIKey: true }` БЕЗ
 *   explicit migration. На prod schema-push не успел добавить поля до того
 *   как login-handler попытался прочесть юзеров с новой схемой → SQL error
 *   → /api/users/login/ → HTTP 500. Revert PR #42 откатил код.
 *
 *   Этот PR — second pass: явная миграция применяется ДО PM2 restart в
 *   deploy.yml step «Apply Payload migrations» (см. deploy.yml:387). Когда
 *   новый bundle с `useAPIKey: true` стартует — поля уже в БД.
 *
 * What it does:
 *   3 новых поля в users + 1 индекс:
 *     - enable_a_p_i_key (boolean)   — UI checkbox
 *     - api_key (varchar)            — encrypted ключ (Payload encrypts/decrypts)
 *     - api_key_index (varchar)      — HMAC-SHA256 для O(log n) lookup
 *     - users_api_key_index_idx      — index по api_key_index
 *
 * Why странные имена:
 *   `to-snake-case@1.0.0` (используется @payloadcms/db-postgres@3.83)
 *   разбивает CamelCase по каждой заглавной букве, включая внутри слова:
 *     enableAPIKey → enable_a_p_i_key (не enable_api_key!)
 *   Подтверждено практически: see PR description test plan.
 *
 * Idempotent:
 *   IF NOT EXISTS на columns + index — повторное применение безопасно
 *   (хотя tracker payload_migrations и так не даст применить дважды).
 *
 * Rollback safety:
 *   down() удаляет колонки + индекс. Любые сгенерированные API keys теряются.
 *   Перед rollback ротировать live ключи.
 *
 * SQL sources:
 *   - up:   migrations/20260426_153500_users_api_key.up.sql
 *   - down: migrations/20260426_153500_users_api_key.down.sql
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260426_153500_users_api_key.${suffix}.sql`)
  return await fs.readFile(file, 'utf-8')
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const statements = await readSql('up')
  await db.execute(sql.raw(statements))
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  const statements = await readSql('down')
  await db.execute(sql.raw(statements))
}
