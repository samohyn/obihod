/**
 * Печатает SQL-разницу между схемой из payload.config.ts и текущей БД — без применения.
 *
 * Зачем: CLI `payload migrate:create` в этом проекте не работает (ADR-0016, undici под tsx),
 * а dev-push интерактивный и предлагает удалить raw-таблицу audit_log. Скрипт вызывает тот же
 * drizzle-kit pushSchema, что и dev-push, но не делает apply(). По выводу пишем идемпотентные
 * migrations/<ts>_<name>.up.sql / .down.sql.
 *
 * Запуск (против локальной БД из .env.local):
 *   PAYLOAD_DISABLE_PUSH=1 pnpm schema:diff
 */
import { getPayload } from 'payload'

import config from '../payload.config.js'

type PushResult = { hasDataLoss: boolean; warnings: string[]; statementsToExecute: string[] }
type DrizzleAdapterLike = {
  requireDrizzleKit: () => { pushSchema: (...args: unknown[]) => Promise<PushResult> }
  schema: unknown
  drizzle: unknown
  schemaName?: string
  tablesFilter?: string[]
  extensions?: { postgis?: boolean }
}

async function main() {
  const payload = await getPayload({ config })
  const adapter = payload.db as unknown as DrizzleAdapterLike
  const { pushSchema } = adapter.requireDrizzleKit()
  const { hasDataLoss, warnings, statementsToExecute } = await pushSchema(
    adapter.schema,
    adapter.drizzle,
    adapter.schemaName ? [adapter.schemaName] : undefined,
    adapter.tablesFilter,
    adapter.extensions?.postgis ? ['postgis'] : undefined,
  )
  console.log(JSON.stringify({ hasDataLoss, warnings, statements: statementsToExecute }, null, 2))
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
