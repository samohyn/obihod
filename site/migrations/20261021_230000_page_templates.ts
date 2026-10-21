import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Глобал «Шаблоны страниц» (план 09, этап 4.4): тексты района, «услуги в районе», статьи, кейса,
 * авторов, 404 и контактов. Expand: новая таблица, значения по умолчанию — нынешние тексты сайта;
 * пока раздел не сохранён, сайт берёт их из кода (lib/page-templates.ts). Откат — .down.sql.
 */

// tsx собирает пакет как CommonJS (в package.json нет "type": "module") — там есть __dirname.
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  return await fs.readFile(
    path.join(dirname, `20261021_230000_page_templates.${suffix}.sql`),
    'utf-8',
  )
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(await readSql('up')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(await readSql('down')))
}
