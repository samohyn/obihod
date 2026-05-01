import { SEARCH_COLLECTIONS, type SearchCollectionConfig } from './config'

/**
 * PANEL-GLOBAL-SEARCH (ADR-0013) — SQL UNION ALL builder.
 *
 * Генерирует параметризованный запрос с одним bind-параметром $1 = q.
 * Каждая sub-query использует pg_trgm `%` operator (similarity > threshold) +
 * similarity() для ранжирования. ORDER BY rank DESC по всему UNION,
 * limit total — по N результатов на коллекцию + общий cap.
 *
 * Параметризация: query string собирается из constant string literals
 * (table names, expression strings из конфига — НЕ от user input). User input
 * приходит ТОЛЬКО как bind-параметр $1 — SQL injection невозможен.
 */

interface BuildOptions {
  perCollectionLimit: number
}

/**
 * Возвращает SQL шаблон с одним placeholder $1 = q.
 *
 * Структура результирующих rows:
 *   collection_slug | id | title | subtitle | rank
 */
export function buildUnionQuery(
  configs: SearchCollectionConfig[] = SEARCH_COLLECTIONS,
  opts: BuildOptions = { perCollectionLimit: 5 },
): string {
  const subqueries = configs.map((c) => {
    const where = [`${c.matchExpr} % LOWER($1)`, ...(c.whereExtra ? [c.whereExtra] : [])].join(
      ' AND ',
    )
    return `
      (
        SELECT
          '${c.collectionSlug}'::varchar AS collection_slug,
          id::text AS id,
          (${c.titleExpr})::varchar AS title,
          (${c.subtitleExpr})::varchar AS subtitle,
          similarity(${c.matchExpr}, LOWER($1)) AS rank
        FROM ${c.table}
        WHERE ${where}
        ORDER BY rank DESC, id DESC
        LIMIT ${opts.perCollectionLimit}
      )`.trim()
  })

  return subqueries.join('\nUNION ALL\n') + '\nORDER BY rank DESC LIMIT 50;'
}

export interface SearchRowRaw {
  collection_slug: string
  id: string
  title: string | null
  subtitle: string | null
  rank: number
}

export interface SearchHit {
  id: string
  title: string
  subtitle: string | null
  url: string
  rank: number
}

export interface SearchGroup {
  collection: string
  label: string
  hits: SearchHit[]
}

/**
 * Группирует raw rows по collection_slug + добавляет admin URL для каждого hit.
 */
export function groupRows(rows: SearchRowRaw[]): SearchGroup[] {
  const byCollection = new Map<string, SearchRowRaw[]>()
  for (const row of rows) {
    const list = byCollection.get(row.collection_slug) ?? []
    list.push(row)
    byCollection.set(row.collection_slug, list)
  }

  const groups: SearchGroup[] = []
  // Соблюдаем порядок из SEARCH_COLLECTIONS, не Map iteration order.
  for (const cfg of SEARCH_COLLECTIONS) {
    const rows = byCollection.get(cfg.collectionSlug)
    if (!rows || rows.length === 0) continue
    groups.push({
      collection: cfg.collectionSlug,
      label: cfg.groupLabel,
      hits: rows.map((r) => ({
        id: r.id,
        title: r.title ?? `#${r.id}`,
        subtitle: r.subtitle && r.subtitle !== r.title ? r.subtitle : null,
        url: `${cfg.editUrlPrefix}${r.id}`,
        rank: r.rank,
      })),
    })
  }
  return groups
}
