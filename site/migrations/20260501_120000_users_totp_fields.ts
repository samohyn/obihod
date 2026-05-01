import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * PANEL-AUTH-2FA — TOTP 2FA fields в users + child table users_recovery_codes.
 *
 * Spec: specs/PANEL-AUTH-2FA/sa-panel.md (AC-1).
 *
 * Adds:
 *   - users.totp_enabled (boolean, default false)
 *   - users.totp_secret_enc (varchar, nullable, AES-256-GCM blob)
 *   - users_recovery_codes (child table, Payload array): id, _parent_id (FK→users
 *     ON DELETE CASCADE), _order, hash varchar, consumed_at timestamp
 *
 * Backwards compat: existing seed admin (admin@obikhod.local) и Playwright
 * fixtures продолжают логиниться без второго шага (totp_enabled = false default).
 *
 * Zero-downtime: ADD COLUMN с DEFAULT false на postgres 16 — instant metadata-only.
 *
 * Idempotent: IF NOT EXISTS на columns + table + index + FK constraint.
 *
 * Rollback: down() удаляет child table CASCADE + 2 columns. Все настроенные
 * 2FA теряются — пользователи должны перевключить через профиль.
 *
 * SQL sources:
 *   - up:   20260501_120000_users_totp_fields.up.sql
 *   - down: 20260501_120000_users_totp_fields.down.sql
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260501_120000_users_totp_fields.${suffix}.sql`)
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
