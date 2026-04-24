import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * US-3 — ServiceDistricts blocks + SEO fields + SiteChrome global +
 * polymorphic rels, одним атомарным batch.
 *
 * Полное приведение prod-схемы к US-3 baseline (prod-dump 2026-04-24 15:21 UTC
 * на момент написания пустой: 0 строк во всех бизнес-таблицах,
 * 0 записей в payload_migrations). Миграция собирает ровно то, что отличает
 * prod от `site/__generated__/us3-new-schema.sql`:
 *
 *   • DROP `seo_settings_same_as` + 9 stale `organization_*` колонок
 *     на `seo_settings` (ADR-0002 SEO×SiteChrome dedup).
 *   • ADD 8 SEO/audit колонок на `service_districts` (и version_*
 *     аналоги на `_service_districts_v`) + FK на media/persons +
 *     2 новых ENUM (`*_robots`, `*_version_robots`).
 *   • CREATE 12 blocks-таблиц (6 published + 6 drafts) + 8 ENUM + sequences +
 *     42 индекса + 14 FK + 12 PK.
 *   • CREATE 2 polymorphic rels-таблицы (`service_districts_rels`,
 *     `_service_districts_v_rels`) + sequences + 8 индексов + 4 FK + 2 PK.
 *   • CREATE 5 site_chrome таблиц (site_chrome global + 4 children) +
 *     sequence + 4 ENUM + 8 индексов + 4 FK + 5 PK.
 *
 * Тесты (docker postgres:16-alpine, клон prod-dump):
 *   • UP на prod-snapshot: 62 → 80 таблиц, 0 ошибок, итог идентичен
 *     us3-new-schema по таблицам, колонкам, индексам, FK и ENUM.
 *   • DOWN: 80 → 62 таблиц, восстанавливает seo_settings_same_as +
 *     organization_* колонки, полный return-to-prod.
 *   • Cycle UP→DOWN→UP: clean, без конфликтов типов.
 *
 * Prod-safety: prod пустой → нет data-loss даже на deliberate rollback.
 * Production run должен быть предварён `gh workflow run prod-backup.yml`.
 *
 * SQL-исходники:
 *   - up:   migrations/20260424_133242_us_3_blocks_and_seo.up.sql
 *   - down: migrations/20260424_133242_us_3_blocks_and_seo.down.sql
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260424_133242_us_3_blocks_and_seo.${suffix}.sql`)
  return await fs.readFile(file, 'utf-8')
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const statements = await readSql('up')
  // Payload 3 `db.execute(sql.raw(...))` выполняет всю строку одним батчем
  // с поддержкой BEGIN/COMMIT внутри SQL-файла.
  await db.execute(sql.raw(statements))
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  const statements = await readSql('down')
  await db.execute(sql.raw(statements))
}
