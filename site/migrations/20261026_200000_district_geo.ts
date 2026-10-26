import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Данные (план 09, этап 7.4): настоящие центры и расстояния от МКАД у районов вместо заглушки,
 * «Полный прайс» на главной — на /uslugi/tseny/. Откат — .down.sql (значения до 26.10.2026).
 */

// tsx собирает пакет как CommonJS (в package.json нет "type": "module") — там есть __dirname.
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  return await fs.readFile(
    path.join(dirname, `20261026_200000_district_geo.${suffix}.sql`),
    'utf-8',
  )
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(await readSql('up')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(await readSql('down')))
}
