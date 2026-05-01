/**
 * PANEL-AUDIT-LOG (ADR-0014 §Retention) — daily cleanup script.
 *
 * Запуск (локально):
 *   pnpm tsx --require=./scripts/_payload-cjs-shim.cjs --env-file=.env.local scripts/audit/prune.ts
 *
 * На проде — через GitHub Actions cron либо PM2 daily entry (do owns).
 *
 * Retention scopes (env-configurable, fallback per ADR §Retention):
 *   - audit_log              → AUDIT_RETENTION_AUDIT_LOG_DAYS (default 365) — 152-ФЗ
 *   - <collection>_v versions → AUDIT_RETENTION_VERSIONS_DAYS (default 90)
 *   - globals._v             → AUDIT_RETENTION_GLOBALS_DAYS (default 180)
 *
 * Idempotent: можно запускать несколько раз — DELETE WHERE older уже-удалённые
 * rows skip автоматически. Безопасен для batch / cron retry.
 *
 * Production safeguard: дефолты применяются только если env не задан.
 * Чтобы протестировать на проде с агрессивным cutoff — задать env вручную.
 */

import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../../payload.config.js'

interface PgClient {
  query: <T = unknown>(
    text: string,
    params?: unknown[],
  ) => Promise<{ rows: T[]; rowCount: number | null }>
  release: () => void
}
interface PgPool {
  connect: () => Promise<PgClient>
}

const VERSIONED_COLLECTIONS = [
  'cases',
  'blog',
  'services',
  'b2b_pages',
  'service_districts',
  'districts',
  'authors',
]

function envInt(key: string, fallback: number): number {
  const raw = process.env[key]
  if (!raw) return fallback
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

async function pruneAuditLog(pool: PgPool, days: number): Promise<number> {
  const client = await pool.connect()
  try {
    const result = await client.query(
      `DELETE FROM audit_log WHERE changed_at < now() - ($1 || ' days')::interval`,
      [String(days)],
    )
    return result.rowCount ?? 0
  } finally {
    client.release()
  }
}

async function pruneVersions(pool: PgPool, days: number): Promise<Record<string, number>> {
  const stats: Record<string, number> = {}
  const client = await pool.connect()
  try {
    for (const coll of VERSIONED_COLLECTIONS) {
      const table = `_${coll}_v`
      // Use to_regclass guard — table may not yet exist если versions не enabled
      // для конкретной коллекции (e.g. до миграции). Skip silently.
      const exists = await client.query<{ exists: boolean }>(
        `SELECT to_regclass($1) IS NOT NULL AS exists`,
        [table],
      )
      if (!exists.rows[0]?.exists) {
        stats[coll] = 0
        continue
      }
      const result = await client.query(
        `DELETE FROM ${table} WHERE updated_at < now() - ($1 || ' days')::interval`,
        [String(days)],
      )
      stats[coll] = result.rowCount ?? 0
    }
  } finally {
    client.release()
  }
  return stats
}

async function main(): Promise<void> {
  const auditDays = envInt('AUDIT_RETENTION_AUDIT_LOG_DAYS', 365)
  const versionsDays = envInt('AUDIT_RETENTION_VERSIONS_DAYS', 90)

  console.log(`[audit:prune] starting · audit_log=${auditDays}d · versions=${versionsDays}d`)

  const payload: Payload = await getPayload({ config })
  const pool = (payload.db as unknown as { pool: PgPool }).pool

  const auditDeleted = await pruneAuditLog(pool, auditDays)
  console.log(`[audit:prune] audit_log: deleted ${auditDeleted} rows`)

  const versionsStats = await pruneVersions(pool, versionsDays)
  for (const [coll, n] of Object.entries(versionsStats)) {
    console.log(`[audit:prune] _${coll}_v: deleted ${n} rows`)
  }

  console.log('[audit:prune] done')
  process.exit(0)
}

main().catch((err) => {
  console.error('[audit:prune] failed', err)
  process.exit(1)
})
