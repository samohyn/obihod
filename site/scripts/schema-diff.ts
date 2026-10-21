/**
 * SQL-разница между схемой из payload.config.ts и текущей БД — без применения.
 *
 * Зачем: CLI `payload migrate:create` в этом проекте не работает (ADR-0016, undici под tsx).
 * Скрипт вызывает тот же drizzle-kit pushSchema, что и dev-push, но не делает apply().
 * По выводу пишется миграция migrations/<ts>_<name>.ts (+ .up.sql / .down.sql).
 *
 *   pnpm schema:diff           — печатает JSON с командами
 *   pnpm schema:diff --check   — CI: код выхода 1, если схема разошлась с БД («забыли миграцию»)
 *
 * Пары «DROP <обрезанное имя> + CREATE <имя длиннее 63>» не считаются: Postgres обрезает
 * идентификаторы до 63 байт, индекс/ограничение в базе тот же, а drizzle сравнивает с полным
 * именем и видит разницу при каждом запуске (вложенные массивы блоков service_districts).
 * Сокращаются только пары, где в этом же диффе есть DROP обрезанного имени — реально
 * отсутствующий объект так не спрячется. Так же не считаются `SET DEFAULT <число>` у numeric-колонок,
 * если в базе уже стоит это число (drizzle-kit 0.31 предлагает их при каждом сравнении).
 *
 * Внимание: если в схеме появилась НОВАЯ таблица/колонка с похожим на старое именем, drizzle-kit
 * спрашивает в терминале «создана или переименована» — тогда скрипт ждёт ввода. Переименования
 * пишем в миграцию вручную (ALTER TABLE … RENAME), применяем и сравниваем снова.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { sql } from '@payloadcms/db-postgres/drizzle'
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

const PG_MAX_IDENTIFIER = 63

/** Убирает пары DROP/CREATE (индексы) и DROP/ADD CONSTRAINT, различающиеся только обрезкой имени. */
export function dropTruncationNoise(statements: string[]): string[] {
  const dropIndex = (s: string) =>
    s.match(/^DROP INDEX (?:IF EXISTS )?"(?:public"\.")?([^"]+)"/)?.[1]
  const createIndex = (s: string) =>
    s.match(/^CREATE (?:UNIQUE )?INDEX (?:IF NOT EXISTS )?"([^"]+)"/)?.[1]
  const dropConstraint = (s: string) => s.match(/^ALTER TABLE "([^"]+)" DROP CONSTRAINT "([^"]+)"/)
  const addConstraint = (s: string) => s.match(/^ALTER TABLE "([^"]+)" ADD CONSTRAINT "([^"]+)"/)

  const truncated = (name: string) => name.slice(0, PG_MAX_IDENTIFIER)
  const droppedIndexes = new Set(statements.map(dropIndex).filter(Boolean) as string[])
  const droppedConstraints = new Set(
    statements
      .map(dropConstraint)
      .filter(Boolean)
      .map((m) => `${m![1]}.${m![2]}`),
  )
  const noise = new Set<string>()
  for (const s of statements) {
    const ci = createIndex(s)
    if (ci && ci.length > PG_MAX_IDENTIFIER && droppedIndexes.has(truncated(ci))) {
      noise.add(s)
      noise.add(statements.find((d) => dropIndex(d) === truncated(ci))!)
    }
    const ac = addConstraint(s)
    if (
      ac &&
      ac[2].length > PG_MAX_IDENTIFIER &&
      droppedConstraints.has(`${ac[1]}.${truncated(ac[2])}`)
    ) {
      noise.add(s)
      noise.add(
        statements.find((d) => {
          const m = dropConstraint(d)
          return m?.[1] === ac[1] && m?.[2] === truncated(ac[2])
        })!,
      )
    }
  }
  return statements.filter((s) => !noise.has(s))
}

type Executor = { execute: (q: unknown) => Promise<{ rows: Record<string, unknown>[] }> }

/**
 * drizzle-kit 0.31 предлагает `SET DEFAULT <число>` для numeric-колонок при каждом сравнении,
 * даже когда в базе стоит то же значение. Убираем такие команды, только если DEFAULT в базе
 * (information_schema) действительно равен этому числу.
 */
async function dropNumericDefaultNoise(
  statements: string[],
  db: Executor,
  sqlTag: (s: TemplateStringsArray, ...v: unknown[]) => unknown,
): Promise<string[]> {
  const re = /^ALTER TABLE "([^"]+)" ALTER COLUMN "([^"]+)" SET DEFAULT (-?\d+(?:\.\d+)?);$/
  const kept: string[] = []
  for (const s of statements) {
    const m = s.trim().match(re)
    if (!m) {
      kept.push(s)
      continue
    }
    const { rows } = await db.execute(
      sqlTag`select column_default from information_schema.columns
             where table_schema = 'public' and table_name = ${m[1]} and column_name = ${m[2]}`,
    )
    const current = String(rows[0]?.column_default ?? '').replace(/^'(.*)'::numeric$/, '$1')
    if (current === '' || Number(current) !== Number(m[3])) kept.push(s)
  }
  return kept
}

async function main() {
  const check = process.argv.includes('--check')
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
  const statements = await dropNumericDefaultNoise(
    dropTruncationNoise(statementsToExecute),
    adapter.drizzle as Executor,
    sql,
  )
  // Expand → contract: удаления, которые ждут миграции следующего релиза (migrations/pending-contract.json)
  const norm = (q: string) => q.replace(/\s+/g, ' ').trim()
  // tsx собирает скрипты как CommonJS — там есть __dirname
  const here =
    typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))
  const pendingFile = path.join(here, '../migrations/pending-contract.json')
  const pending = new Set(
    fs.existsSync(pendingFile)
      ? (
          JSON.parse(fs.readFileSync(pendingFile, 'utf8')) as { statements: string[] }
        ).statements.map(norm)
      : [],
  )
  const waiting = statements.filter((q) => pending.has(norm(q)))
  const diff = statements.filter((q) => !pending.has(norm(q)))
  console.log(JSON.stringify({ hasDataLoss, warnings, statements: diff }, null, 2))
  if (waiting.length) console.error(`ожидают удаления (pending-contract.json): ${waiting.length}`)
  if (check && diff.length > 0) {
    console.error(
      `\n✗ Схема в коде разошлась с БД (${diff.length} команд выше): нужна миграция в migrations/.`,
    )
    process.exit(1)
  }
  if (check) console.error('✓ Схема в коде совпадает с БД.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
