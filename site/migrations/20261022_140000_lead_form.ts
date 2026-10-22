import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Форма заявки (план 09, этапы 2 и 5): поля «Что нужно сделать» и «Адрес или район», согласие на ПДн
 * (время, редакция документа, отпечаток текста) и фото — коллекция «Фото заявок» (lead-photos).
 * Expand: новые таблица и колонки; старое поле photos скрыто, удаляется вторым релизом. Откат — .down.sql.
 */

// tsx собирает пакет как CommonJS (в package.json нет "type": "module") — там есть __dirname.
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  return await fs.readFile(path.join(dirname, `20261022_140000_lead_form.${suffix}.sql`), 'utf-8')
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(await readSql('up')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(await readSql('down')))
}
