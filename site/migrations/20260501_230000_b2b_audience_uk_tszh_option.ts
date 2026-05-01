import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * US-0 W3 — добавляет combined option `uk-tszh` в audience ENUM B2BPages.
 *
 * Контекст: cw эталон `b2b-segment.json` использует `uk-tszh` для combined
 * сегмента «УК + ТСЖ». Раздельные `uk` и `tszh` сохраняются для специализированных
 * страниц.
 *
 * Pattern (из memory `reference_payload_select_postgres_enum.md`):
 *   `ALTER TYPE ADD VALUE IF NOT EXISTS` — idempotent.
 *   Удаление option невозможно без drop+recreate, orphan label OK.
 *
 * Sources:
 *   - up:   20260501_230000_b2b_audience_uk_tszh_option.up.sql
 *   - down: 20260501_230000_b2b_audience_uk_tszh_option.down.sql (no-op)
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260501_230000_b2b_audience_uk_tszh_option.${suffix}.sql`)
  return await fs.readFile(file, 'utf-8')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const statements = await readSql('up')
  // ALTER TYPE ADD VALUE не может выполняться внутри транзакции,
  // поэтому каждое утверждение отправляем отдельно.
  for (const stmt of statements
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('--'))) {
    await db.execute(sql.raw(stmt))
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  const statements = await readSql('down')
  await db.execute(sql.raw(statements))
}
