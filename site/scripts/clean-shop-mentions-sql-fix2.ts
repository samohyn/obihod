/**
 * Final cleanup pass v2 — учитываем JSONB::text режим, в котором '\n' в
 * Lexical text node хранится как literal `\\n` (2 байта). Поэтому ведущий
 * пробел в pattern не матчит — текст после '.' идёт через `\\n\\n`.
 *
 * Стратегия: матчим без leading whitespace, начинаем с «Для заказа саженцев»
 * — уникальный anchor только для blog/26.
 *
 * Запуск:
 *   pnpm tsx --env-file=.env.local scripts/clean-shop-mentions-sql-fix2.ts
 */
export {} // module marker для isolatedModules

// `pg` через transitive resolve (см. clean-shop-mentions-sql.ts comment).
type PgClientCtor = new (cfg: { connectionString: string }) => {
  connect(): Promise<void>
  query(sql: string, params?: unknown[]): Promise<{ rowCount: number | null; rows: unknown[] }>
  end(): Promise<void>
}
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PgClient: PgClientCtor = (require('pg') as { Client: PgClientCtor }).Client

interface Patch {
  table: string
  column: string
  whereSql: string
  whereParams: unknown[]
  pattern: string
  replace: string
  reason: string
}

const PATCHES: Patch[] = [
  // ─── blog/26 migrated text_content ──────────────────────────────────────
  {
    table: 'blog_blocks_text_content',
    column: 'body',
    whereSql: '_parent_id = $1',
    whereParams: ['26'],
    pattern:
      'Для заказа саженцев плодовых, декоративных кустарников и хвойных пород Подмосковной адаптации работает наш магазин \\(см\\. /shop/\\) — мы берём только зимостойкий материал из проверенных питомников Тульской и Воронежской областей с успешным опытом выращивания в [^.]+\\. (Саженцы|Посадочные работы) оформляются как отдельная позиция к заказу: садовник выезжает с саженцами, делает посадку и приёмку до полного укоренения\\.',
    replace:
      'Для посадки используем только зимостойкий материал из проверенных питомников Тульской и Воронежской областей с успешным опытом выращивания в подмосковных условиях. Садовник выезжает с саженцами, делает посадку и приёмку до полного укоренения.',
    reason: 'blog 26 «работает наш магазин» промо',
  },
  {
    table: 'blog_blocks_text_content',
    column: 'body',
    whereSql: '_parent_id = $1',
    whereParams: ['26'],
    pattern:
      'У нашего магазина \\(см\\. /shop/\\) только адаптированный материал с гарантией приживаемости\\.',
    replace: '',
    reason: 'blog 26 «У нашего магазина» промо',
  },
  // FAQ items на всякий случай (вдруг migrated faq не задело)
  {
    table: 'blog_blocks_faq_items',
    column: 'answer',
    whereSql: '_parent_id IN (SELECT id FROM blog_blocks_faq WHERE _parent_id = $1)',
    whereParams: ['26'],
    pattern:
      'У нашего магазина \\(см\\. /shop/\\) только адаптированный материал с гарантией приживаемости\\.',
    replace: '',
    reason: 'blog 26 FAQ «У нашего магазина»',
  },
]

async function main(): Promise<void> {
  const url =
    process.env.DATABASE_URI ||
    process.env.DATABASE_URL ||
    'postgres://obikhod:obikhod_dev@localhost:5432/obikhod'
  console.log(`[fix2] Connect: ${url.replace(/:[^:@]+@/, ':***@')}`)
  const client = new PgClient({ connectionString: url })
  await client.connect()

  try {
    for (const p of PATCHES) {
      const sql = `
        UPDATE ${p.table}
        SET ${p.column} = regexp_replace(${p.column}::text, $${p.whereParams.length + 1}, $${p.whereParams.length + 2}, 'g')::jsonb
        WHERE ${p.whereSql}
          AND ${p.column}::text ~ $${p.whereParams.length + 1}
      `
      const params = [...p.whereParams, p.pattern, p.replace]
      const r = await client.query(sql, params)
      console.log(`  ${p.table}.${p.column} «${p.reason}»: ${r.rowCount}`)
    }

    // Sanity
    const c1 = await client.query(
      `SELECT body::text ~ '/shop/' AS s, body::text ~ 'наш магазин' AS m FROM blog_blocks_text_content WHERE _parent_id='26'`,
    )
    console.log('\nblog/26 text_content post-check:', c1.rows[0])

    const c2 = await client.query(
      `SELECT body::text ~ '/shop/' AS s FROM blog WHERE id IN (23, 26)`,
    )
    console.log('blog/23+26 legacy body post-check:', c2.rows)

    await client.query(`UPDATE blog SET updated_at = now() WHERE id IN (23, 26)`)
    console.log('\n[fix2] DONE')
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error('[fix2] FATAL:', err)
  process.exit(2)
})
