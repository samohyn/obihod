import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Hot-fix typo в hero_title_accent — строки c «в Москве и МО» → «Москве и МО».
 * Причина: Hero.tsx содержит hardcoded `в ` перед span, а seed/admin клал value с «в»
 * → рендер давал «Удаление деревьев в в Москве и МО». См. landing.spec.ts: "в в".
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function readSql(suffix: 'up' | 'down'): Promise<string> {
  const file = path.join(dirname, `20260506_140000_homepage_hero_title_accent_fix.${suffix}.sql`)
  return await fs.readFile(file, 'utf-8')
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const upSql = await readSql('up')
  await db.execute(sql.raw(upSql))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  const downSql = await readSql('down')
  await db.execute(sql.raw(downSql))
}
