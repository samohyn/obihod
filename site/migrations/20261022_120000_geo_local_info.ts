import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * «Что важно в районе» — карточки местных сведений в записи «Услуги × район» (план 09, этап 6:
 * гео-страницы без шаблонного текста) и заголовок блока в «Шаблонах страниц». Expand: новые таблицы
 * и колонка со значением по умолчанию. Откат — .down.sql.
 */

// tsx собирает пакет как CommonJS (в package.json нет "type": "module") — там есть __dirname.
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  return await fs.readFile(
    path.join(dirname, `20261022_120000_geo_local_info.${suffix}.sql`),
    'utf-8',
  )
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(await readSql('up')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(await readSql('down')))
}
