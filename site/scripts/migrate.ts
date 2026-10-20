/**
 * Применяет миграции БД (план 09, этап 1 — «Дрейф схемы»).
 *
 *   pnpm migrate
 *
 * Где запускается: шаг выкатки на сервере (deploy/server/obikhod-deploy.sh — после бэкапа и
 * сборки, до переключения релиза), CI (с нуля на чистой БД), локально.
 * CLI `payload migrate` здесь не работает (ADR-0016) — используем Local API.
 *
 * Старая БД (до базовой миграции): в payload_migrations нет BASELINE, но таблица users есть —
 * схема создавалась dev-push и ручными миграциями. Тогда один раз, в одной транзакции:
 *   1. migrations/legacy/sync-to-baseline.sql — приводит старую схему к базовой;
 *   2. отметка BASELINE применённой (её DDL не выполняется);
 *   3. удаление строки 'dev' (batch -1) — иначе payload.db.migrate() спрашивает в терминале и
 *      без терминала молча выходит с кодом 0, ничего не применив.
 * Потом — обычный payload.db.migrate(): каждая новая миграция в своей транзакции.
 *
 * Последняя строка вывода — MIGRATIONS_APPLIED=<n>: по ней выкатка понимает, менялась ли схема
 * (если менялась, откат кода без отката БД небезопасен).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { PostgresAdapter } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'

import config from '../payload.config.js'

type Pool = PostgresAdapter['pool']

const BASELINE = '20261020_120000_baseline'
// tsx собирает пакет как CommonJS (в package.json нет "type": "module") — там есть __dirname.
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))
const SYNC_SQL = path.resolve(dirname, '../migrations/legacy/sync-to-baseline.sql')

async function appliedCount(pool: Pool): Promise<number> {
  const { rows } = await pool.query<{ exists: boolean }>(
    "select to_regclass('public.payload_migrations') is not null as exists",
  )
  if (!rows[0]?.exists) return 0
  const res = await pool.query<{ n: string }>(
    'select count(*) as n from payload_migrations where batch > 0',
  )
  return Number(res.rows[0]?.n ?? 0)
}

async function adoptLegacySchema(pool: Pool): Promise<boolean> {
  const { rows } = await pool.query<{ users: boolean; migrations: boolean }>(
    "select to_regclass('public.users') is not null as users, to_regclass('public.payload_migrations') is not null as migrations",
  )
  if (!rows[0]?.users) return false // новая БД — базовая миграция создаст всё
  if (rows[0].migrations) {
    const has = await pool.query('select 1 from payload_migrations where name = $1', [BASELINE])
    if (has.rowCount) return false // уже на новой истории
  }
  const sync = await fs.readFile(SYNC_SQL, 'utf-8')
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(sync)
    const batch = await client.query<{ next: number }>(
      'select coalesce(max(batch), 0) + 1 as next from payload_migrations where batch > 0',
    )
    await client.query(
      'insert into payload_migrations (name, batch, updated_at, created_at) values ($1, $2, now(), now())',
      [BASELINE, batch.rows[0]?.next ?? 1],
    )
    await client.query("delete from payload_migrations where name = 'dev' and batch = -1")
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
  return true
}

async function main() {
  const payload = await getPayload({ config })
  const pool = (payload.db as unknown as PostgresAdapter).pool
  const before = await appliedCount(pool)

  if (await adoptLegacySchema(pool)) {
    payload.logger.info(`Старая схема приведена к базовой (${BASELINE}), строка 'dev' удалена`)
  }
  await payload.db.migrate()

  const applied = (await appliedCount(pool)) - before
  console.log(`MIGRATIONS_APPLIED=${applied}`)
  process.exit(0)
}

main().catch((e) => {
  console.error('[migrate]', e)
  process.exit(1)
})
