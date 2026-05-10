/**
 * SQL-cleanup для blog/26 + blog/23 — обход Payload Local API.
 *
 * Причина: Local API update (clean-shop-mentions.ts) триггерит
 * checkDocumentLockStatus → query на payload_locked_documents_rels.reviews_id,
 * а в локальной БД эта колонка отсутствует (drift из-за неприменённой
 * 20260509_120000_reviews_collection миграции, см. commit d2e194a).
 * Constraint EPIC-SHOP-REMOVAL: НЕ запускать миграции.
 *
 * Решение: прямой UPDATE на JSONB поля + DELETE на blocks_related_services_items.
 * Не трогает schema, только data — это не migration.
 *
 * Запуск:
 *   pnpm tsx --env-file=.env.local scripts/clean-shop-mentions-sql.ts
 */
export {} // module marker для isolatedModules

// `pg` есть в node_modules как transitive (через @payloadcms/db-postgres),
// но не объявлен в package.json напрямую. Через require + inline-тип tsc не
// требует @types/pg. Имя `PgClient` (а не `Client`) чтобы не конфликтовать
// с глобальным DOM `Client` type в lib.dom.
type PgClientCtor = new (cfg: { connectionString: string }) => {
  connect(): Promise<void>
  query(sql: string, params?: unknown[]): Promise<{ rowCount: number | null }>
  end(): Promise<void>
}
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PgClient: PgClientCtor = (require('pg') as { Client: PgClientCtor }).Client

interface Replacement {
  find: string // SQL-regex (POSIX ERE) — НЕ JS RegExp
  replace: string
  reason: string
}

// blog/26 cherta-mezhdu-arbo-i-sadovnikom — body + blocks_text_content.body
const BLOG_26_REPLACEMENTS: Replacement[] = [
  {
    find: ' См\\. /shop/ для каталога саженцев и посадочного материала\\.',
    replace: '',
    reason: '«См. /shop/ для каталога…» промо',
  },
  {
    find: ' Для заказа саженцев плодовых, декоративных кустарников и хвойных пород Подмосковной адаптации работает наш магазин \\(см\\. /shop/\\) — мы берём только зимостойкий материал из проверенных питомников Тульской и Воронежской областей с успешным опытом выращивания в подмосковных условиях\\. Саженцы оформляются как отдельная позиция к заказу: садовник выезжает с саженцами, делает посадку и приёмку до полного укоренения\\.',
    replace:
      ' Для посадки используем только зимостойкий материал из проверенных питомников Тульской и Воронежской областей с успешным опытом выращивания в подмосковных условиях. Садовник выезжает с саженцами, делает посадку и приёмку до полного укоренения.',
    reason: '«работает наш магазин (см. /shop/)» промо',
  },
  {
    find: ' У нашего магазина \\(см\\. /shop/\\) только адаптированный материал с гарантией приживаемости\\.',
    replace: '',
    reason: '«У нашего магазина (см. /shop/)» промо',
  },
]

// blog/23 uhod-za-derevyami-letom-osenyu — body + blocks_text_content.body
const BLOG_23_REPLACEMENTS: Replacement[] = [
  {
    find: ' или в нашем магазине саженцев и инструмента \\(см\\. каталог\\)',
    replace: '',
    reason: '«или в нашем магазине» промо',
  },
]

async function applyToJsonbColumn(
  client: InstanceType<PgClientCtor>,
  table: string,
  column: string,
  whereSql: string,
  whereParams: unknown[],
  replacements: Replacement[],
): Promise<void> {
  for (const r of replacements) {
    // jsonb -> text -> regexp_replace -> jsonb. Безопасно для UTF-8.
    const sql = `
      UPDATE ${table}
      SET ${column} = regexp_replace(${column}::text, $1, $2, 'g')::jsonb
      WHERE ${whereSql}
        AND ${column}::text ~ $1
    `
    const params = [r.find, r.replace, ...whereParams]
    const res = await client.query(sql, params)
    console.log(`  ${table}.${column} «${r.reason}» — rows updated: ${res.rowCount}`)
  }
}

async function main(): Promise<void> {
  const url =
    process.env.DATABASE_URI ||
    process.env.DATABASE_URL ||
    'postgres://obikhod:obikhod_dev@localhost:5432/obikhod'
  console.log(`[clean-shop-sql] Connect: ${url.replace(/:[^:@]+@/, ':***@')}`)
  const client = new PgClient({ connectionString: url })
  await client.connect()

  try {
    // ─── blog/26 ─────────────────────────────────────────────────────────
    console.log('\n=== blog/26 cherta-mezhdu-arbo-i-sadovnikom ===')
    // 1. Legacy body (jsonb)
    await applyToJsonbColumn(client, 'blog', 'body', 'id = $3', [26], BLOG_26_REPLACEMENTS)
    // 2. Migrated blocks_text_content.body
    await applyToJsonbColumn(
      client,
      'blog_blocks_text_content',
      'body',
      '_parent_id = $3',
      ['26'],
      BLOG_26_REPLACEMENTS,
    )
    // 3. FAQ items (answer jsonb) — только тот, где упоминается /shop/
    await applyToJsonbColumn(
      client,
      'blog_blocks_faq_items',
      'answer',
      '_parent_id IN (SELECT id FROM blog_blocks_faq WHERE _parent_id = $3)',
      [26],
      BLOG_26_REPLACEMENTS,
    )
    // 4. RelatedServices items с slug=shop
    const relRes = await client.query(
      `DELETE FROM blog_blocks_related_services_items
       WHERE _parent_id IN (SELECT id FROM blog_blocks_related_services WHERE _parent_id = $1)
         AND slug = 'shop'`,
      [26],
    )
    console.log(`  blog_blocks_related_services_items slug=shop deleted: ${relRes.rowCount}`)

    // ─── blog/23 ─────────────────────────────────────────────────────────
    console.log('\n=== blog/23 uhod-za-derevyami-letom-osenyu ===')
    await applyToJsonbColumn(client, 'blog', 'body', 'id = $3', [23], BLOG_23_REPLACEMENTS)
    await applyToJsonbColumn(
      client,
      'blog_blocks_text_content',
      'body',
      '_parent_id = $3',
      ['23'],
      BLOG_23_REPLACEMENTS,
    )

    // ─── Bump updated_at, чтобы Next.js ISR подобрал ────────────────────
    const bump = await client.query(
      `UPDATE blog SET updated_at = now() WHERE id = ANY($1::int[])`,
      [[26, 23]],
    )
    console.log(`\nBumped blog.updated_at for ${bump.rowCount} rows`)

    console.log('\n[clean-shop-sql] DONE')
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error('[clean-shop-sql] FATAL:', err)
  process.exit(2)
})
