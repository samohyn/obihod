import { type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Базовая миграция — вся схема БД с нуля (план 09, этап 1 — «Дрейф схемы», 20.10.2026).
 *
 * До неё схема жила на dev-push и ручных миграциях, которые с пустой БД не проигрываются —
 * они в migrations/legacy/history (не запускаются). На новой БД (CI, локально) эта миграция
 * создаёт всё; на старой (прод, staging) scripts/migrate.ts сначала применяет
 * migrations/legacy/sync-to-baseline.sql и отмечает эту миграцию применённой без запуска DDL.
 *
 * Новые изменения схемы — отдельными миграциями после неё: `pnpm schema:diff` → файлы
 * migrations/<ts>_<имя>.ts + .up.sql + .down.sql → `pnpm migrate`.
 */

// tsx собирает пакет как CommonJS (в package.json нет "type": "module") — там есть __dirname.
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const statements = await fs.readFile(
    path.join(dirname, '20261020_120000_baseline.up.sql'),
    'utf-8',
  )
  await db.execute(sql.raw(statements))
}

export async function down(): Promise<void> {
  throw new Error(
    'Базовая миграция не откатывается: она создаёт всю схему. Откат — восстановление БД из бэкапа.',
  )
}
