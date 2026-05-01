import type {
  AuditCaptureEvent,
  AuditDiff,
  AuditEntry,
  AuditFilters,
  AuditListResult,
  AuditLogPort,
} from './types'
import { maskPII } from './maskPII'
import { payloadClient } from '@/lib/payload'

/**
 * PANEL-AUDIT-LOG (ADR-0014 Strategy 3 Hybrid) — реализация AuditLogPort.
 *
 * Storage split:
 *   - PII / security collections (Leads, Users, Media, Redirects, __auth, __bulk)
 *     → custom audit_log table.
 *   - Content collections (Cases, Blog, Services, B2BPages, ServiceDistricts,
 *     Districts, Authors) → Payload <collection>_v versions tables.
 *
 * list() агрегирует UNION ALL поверх всех source tables, сортируя по changed_at
 * DESC, cursor-based pagination.
 *
 * capture() пишет ТОЛЬКО в audit_log (versions автоматически создаются Payload
 * при afterChange — duplicate отсутствует).
 *
 * diff() возвращает before/after snapshot с PII masking applied (write-time для
 * audit_log entries; for versions — masking re-applied для безопасности на
 * случай если PII случайно попадёт в versioned content collection).
 */

interface PgClient {
  query: <T = unknown>(text: string, params?: unknown[]) => Promise<{ rows: T[] }>
  release: () => void
}
interface PgPool {
  connect: () => Promise<PgClient>
}

/**
 * Content collections с Payload versions: true.
 * Каждая создаёт `_<collection>_v` table при включённой versions.
 *
 * Payload Postgres adapter хранит fields как обычные columns (не jsonb) —
 * `version_<field_name>`. Title-column → `version_<title_field>`.
 *
 * Slug → version table name + title column name (для UNION ALL display).
 * titleColumn — null если в коллекции нет читабельного title.
 */
export interface VersionSource {
  collection: string
  versionTable: string
  titleColumn: string | null
}

const VERSION_SOURCES: VersionSource[] = [
  { collection: 'cases', versionTable: '_cases_v', titleColumn: 'version_title' },
  { collection: 'blog', versionTable: '_blog_v', titleColumn: 'version_title' },
  { collection: 'services', versionTable: '_services_v', titleColumn: 'version_title' },
  { collection: 'b2b-pages', versionTable: '_b2b_pages_v', titleColumn: 'version_title' },
  {
    collection: 'service-districts',
    versionTable: '_service_districts_v',
    titleColumn: 'version_computed_title',
  },
  {
    collection: 'districts',
    versionTable: '_districts_v',
    titleColumn: 'version_name_nominative',
  },
  { collection: 'authors', versionTable: '_authors_v', titleColumn: 'version_full_name' },
]

const DEFAULT_LIMIT = 50
const MAX_LIMIT = 200

/**
 * Идемпотентный DDL для audit_log table — гарантирует существование в dev,
 * где push:true Payload может drop'ать non-Payload-managed tables на schema-pull.
 * На проде applies через миграцию (deploy.yml psql) — этот код no-op (CREATE
 * TABLE IF NOT EXISTS).
 */
const ENSURE_AUDIT_LOG_SQL = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS "audit_log" (
  "id"            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "collection"    text NOT NULL,
  "doc_id"        text,
  "user_id"       integer REFERENCES "users"("id") ON DELETE SET NULL,
  "action"        text NOT NULL,
  "changed_at"    timestamptz NOT NULL DEFAULT now(),
  "ip"            inet,
  "user_agent"    text,
  "diff"          jsonb NOT NULL DEFAULT '{}'::jsonb,
  "affected_ids"  text[] DEFAULT NULL,
  "metadata"      jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT "audit_log_action_check" CHECK (
    "action" IN (
      'create','update','delete',
      'publish','unpublish','archive',
      'login','logout','login_failed',
      'bulk_action','rbac_change'
    )
  )
);

CREATE INDEX IF NOT EXISTS "audit_log_changed_at_idx"
  ON "audit_log" ("changed_at" DESC);
CREATE INDEX IF NOT EXISTS "audit_log_collection_idx"
  ON "audit_log" ("collection", "changed_at" DESC);
CREATE INDEX IF NOT EXISTS "audit_log_user_idx"
  ON "audit_log" ("user_id", "changed_at" DESC);
CREATE INDEX IF NOT EXISTS "audit_log_action_idx"
  ON "audit_log" ("action", "changed_at" DESC);
CREATE INDEX IF NOT EXISTS "audit_log_doc_idx"
  ON "audit_log" ("collection", "doc_id", "changed_at" DESC);
`

let ensurePromise: Promise<void> | null = null

async function ensureAuditLogTable(pool: PgPool): Promise<void> {
  if (ensurePromise) return ensurePromise
  ensurePromise = (async () => {
    const client = await pool.connect()
    try {
      await client.query(ENSURE_AUDIT_LOG_SQL)
    } finally {
      client.release()
    }
  })()
  return ensurePromise
}

export class HybridAuditLogAdapter implements AuditLogPort {
  /**
   * Capture audit event. Пишет в audit_log (PII / security).
   * NOOP для content collections — Payload versions создаётся автоматически.
   */
  async capture(event: AuditCaptureEvent): Promise<void> {
    const payload = await payloadClient()
    const pool = (payload.db as unknown as { pool: PgPool }).pool
    await ensureAuditLogTable(pool)
    const client = await pool.connect()
    try {
      const before = maskPII(event.collection, event.before ?? null)
      const after = maskPII(event.collection, event.after ?? null)

      const diff = JSON.stringify({ before, after })
      const metadata = JSON.stringify(event.metadata ?? {})

      await client.query(
        `INSERT INTO audit_log
           (collection, doc_id, user_id, action, ip, user_agent, diff, affected_ids, metadata)
         VALUES ($1, $2, $3, $4, $5::inet, $6, $7::jsonb, $8, $9::jsonb)`,
        [
          event.collection,
          event.docId,
          event.userId,
          event.action,
          event.ip ?? null,
          event.userAgent ?? null,
          diff,
          event.affectedIds ?? null,
          metadata,
        ],
      )
    } finally {
      client.release()
    }
  }

  async list(filters: AuditFilters): Promise<AuditListResult> {
    const payload = await payloadClient()
    const pool = (payload.db as unknown as { pool: PgPool }).pool
    await ensureAuditLogTable(pool)
    const client = await pool.connect()
    try {
      const limit = Math.min(Math.max(filters.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT)

      const cursorTs = decodeCursor(filters.cursor ?? null)
      const fromTs = filters.from ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const toTs = filters.to ?? new Date().toISOString()

      // Per-document scope: один UNION только нужного source.
      const sources = filters.scopedTo
        ? this.sourcesForCollection(filters.scopedTo.collection)
        : this.activeSources(filters.collections)

      if (sources.length === 0) {
        return { entries: [], nextCursor: null }
      }

      const params: unknown[] = []
      const pushParam = (v: unknown): string => {
        params.push(v)
        return `$${params.length}`
      }

      const fromParam = pushParam(fromTs)
      const toParam = pushParam(toTs)
      const cursorParam = cursorTs ? pushParam(cursorTs) : null
      const userParam =
        filters.userId !== undefined && filters.userId !== null ? pushParam(filters.userId) : null
      const actionsParam =
        filters.actions && filters.actions.length > 0 ? pushParam(filters.actions) : null
      const collectionsParam =
        filters.collections && filters.collections.length > 0
          ? pushParam(filters.collections)
          : null
      const qParam =
        filters.q && filters.q.trim().length > 0
          ? pushParam(`%${filters.q.trim().toLowerCase()}%`)
          : null
      const scopeDocParam = filters.scopedTo ? pushParam(filters.scopedTo.docId) : null
      const scopeCollParam = filters.scopedTo ? pushParam(filters.scopedTo.collection) : null

      const subqueries: string[] = []

      // ── audit_log table (PII / security)
      if (
        !filters.collections ||
        filters.collections.some((c) => isPiiOrSecurity(c)) ||
        filters.scopedTo === undefined ||
        isPiiOrSecurity(filters.scopedTo?.collection ?? '')
      ) {
        const wheres: string[] = [
          `al.changed_at >= ${fromParam}::timestamptz`,
          `al.changed_at <= ${toParam}::timestamptz`,
        ]
        if (cursorParam) wheres.push(`al.changed_at < ${cursorParam}::timestamptz`)
        if (userParam) wheres.push(`al.user_id = ${userParam}::integer`)
        if (actionsParam) wheres.push(`al.action = ANY(${actionsParam}::text[])`)
        if (collectionsParam) wheres.push(`al.collection = ANY(${collectionsParam}::text[])`)
        if (qParam) {
          wheres.push(
            `(LOWER(COALESCE(al.doc_id, '')) LIKE ${qParam} OR LOWER(COALESCE(u.email, '')) LIKE ${qParam})`,
          )
        }
        if (scopeDocParam && scopeCollParam) {
          wheres.push(`al.doc_id = ${scopeDocParam}`)
          wheres.push(`al.collection = ${scopeCollParam}`)
        }

        subqueries.push(`
          SELECT
            al.id::text                      AS id,
            'audit_log'::text                AS source,
            al.collection                    AS collection,
            al.doc_id                        AS doc_id,
            NULL::text                       AS doc_title,
            al.user_id                       AS user_id,
            u.email                          AS user_email,
            al.action                        AS action,
            al.changed_at                    AS changed_at,
            al.ip::text                      AS ip,
            al.affected_ids                  AS affected_ids,
            al.metadata                      AS metadata
          FROM audit_log al
          LEFT JOIN users u ON u.id = al.user_id
          WHERE ${wheres.join(' AND ')}
        `)
      }

      // ── Versions tables (content collections)
      for (const src of sources) {
        if (filters.scopedTo && filters.scopedTo.collection !== src.collection) continue

        // Защита от actions filter — versions покрывают только create/update/publish.
        if (
          actionsParam &&
          filters.actions &&
          !filters.actions.some((a) => ['create', 'update', 'publish', 'unpublish'].includes(a))
        ) {
          continue
        }

        const titleSelect = src.titleColumn
          ? `COALESCE(v."${src.titleColumn}", '')::text`
          : `'(без названия)'::text`

        const wheres: string[] = [
          `v.updated_at >= ${fromParam}::timestamptz`,
          `v.updated_at <= ${toParam}::timestamptz`,
        ]
        if (cursorParam) wheres.push(`v.updated_at < ${cursorParam}::timestamptz`)
        // Payload versions tables не содержат user_id (changedBy не tracked
        // в schema). Если userParam задан — это эффективно exclude versions
        // (filter не matches). Это OK поведение: «найти все изменения
        // пользователя X» → только audit_log entries.
        if (userParam) {
          wheres.push(`FALSE`)
        }
        if (qParam) {
          wheres.push(`LOWER(${titleSelect}) LIKE ${qParam}`)
        }
        if (scopeDocParam && filters.scopedTo?.collection === src.collection) {
          wheres.push(`v.parent_id::text = ${scopeDocParam}`)
        }

        // Action mapping: status latest_snapshot — для MVP всегда 'update'.
        // Payload не хранит native `_action` field; create/update неотличимы без extra metadata.
        // Fallback: versionNum == 1 → 'create', иначе 'update'.
        subqueries.push(`
          SELECT
            ('${src.collection}:' || v.id::text)::text AS id,
            'version'::text                            AS source,
            '${src.collection}'::text                  AS collection,
            v.parent_id::text                          AS doc_id,
            ${titleSelect}                             AS doc_title,
            NULL::integer                              AS user_id,
            NULL::text                                 AS user_email,
            'update'::text                             AS action,
            v.updated_at                               AS changed_at,
            NULL::text                                 AS ip,
            NULL::text[]                               AS affected_ids,
            '{}'::jsonb                                AS metadata
          FROM ${src.versionTable} v
          WHERE ${wheres.join(' AND ')}
        `)
      }

      if (subqueries.length === 0) {
        return { entries: [], nextCursor: null }
      }

      // limit + 1 для определения nextCursor.
      const limitParam = pushParam(limit + 1)
      const sqlText = `
        ${subqueries.join('\n        UNION ALL\n')}
        ORDER BY changed_at DESC
        LIMIT ${limitParam}::integer
      `

      const result = await client.query<{
        id: string
        source: 'audit_log' | 'version'
        collection: string
        doc_id: string | null
        doc_title: string | null
        user_id: number | null
        user_email: string | null
        action: string
        changed_at: Date | string
        ip: string | null
        affected_ids: string[] | null
        metadata: Record<string, unknown> | null
      }>(sqlText, params)

      const rows = result.rows
      const hasMore = rows.length > limit
      const sliced = hasMore ? rows.slice(0, limit) : rows

      const entries: AuditEntry[] = sliced.map((r) => ({
        id: r.id,
        source: r.source,
        collection: r.collection,
        docId: r.doc_id,
        docTitle: r.doc_title,
        userId: r.user_id,
        userEmail: r.user_email,
        action: r.action as AuditEntry['action'],
        changedAt: r.changed_at instanceof Date ? r.changed_at.toISOString() : String(r.changed_at),
        ip: r.ip,
        affectedIds: r.affected_ids,
        metadata: r.metadata ?? {},
      }))

      const nextCursor =
        hasMore && entries.length > 0 ? encodeCursor(entries[entries.length - 1].changedAt) : null

      return { entries, nextCursor }
    } finally {
      client.release()
    }
  }

  async get(id: string): Promise<AuditEntry | null> {
    const payload = await payloadClient()
    const pool = (payload.db as unknown as { pool: PgPool }).pool
    await ensureAuditLogTable(pool)
    const client = await pool.connect()
    try {
      // Compose id format: 'audit_log' UUID OR `<collection>:<version_id>`
      if (id.includes(':')) {
        const [collection, versionId] = id.split(':')
        const src = VERSION_SOURCES.find((s) => s.collection === collection)
        if (!src) return null
        const titleSelect = src.titleColumn
          ? `COALESCE(v."${src.titleColumn}", '')::text`
          : `'(без названия)'::text`

        const r = await client.query<{
          id: string
          parent_id: string
          updated_at: Date
          doc_title: string
        }>(
          `SELECT v.id::text AS id, v.parent_id::text AS parent_id, v.updated_at,
                  ${titleSelect} AS doc_title
           FROM ${src.versionTable} v
           WHERE v.id = $1::integer
           LIMIT 1`,
          [versionId],
        )
        if (r.rows.length === 0) return null
        const row = r.rows[0]
        return {
          id,
          source: 'version',
          collection,
          docId: row.parent_id,
          docTitle: row.doc_title,
          userId: null,
          userEmail: null,
          action: 'update',
          changedAt: row.updated_at.toISOString(),
        }
      }

      // audit_log row
      const r = await client.query<{
        id: string
        collection: string
        doc_id: string | null
        user_id: number | null
        user_email: string | null
        action: string
        changed_at: Date
        ip: string | null
        affected_ids: string[] | null
        metadata: Record<string, unknown> | null
      }>(
        `SELECT al.id::text, al.collection, al.doc_id, al.user_id, u.email AS user_email,
                al.action, al.changed_at, al.ip::text, al.affected_ids, al.metadata
         FROM audit_log al
         LEFT JOIN users u ON u.id = al.user_id
         WHERE al.id = $1::uuid
         LIMIT 1`,
        [id],
      )
      if (r.rows.length === 0) return null
      const row = r.rows[0]
      return {
        id: row.id,
        source: 'audit_log',
        collection: row.collection,
        docId: row.doc_id,
        docTitle: null,
        userId: row.user_id,
        userEmail: row.user_email,
        action: row.action as AuditEntry['action'],
        changedAt: row.changed_at.toISOString(),
        ip: row.ip,
        affectedIds: row.affected_ids,
        metadata: row.metadata ?? {},
      }
    } finally {
      client.release()
    }
  }

  async diff(id: string): Promise<AuditDiff> {
    const payload = await payloadClient()
    const pool = (payload.db as unknown as { pool: PgPool }).pool
    await ensureAuditLogTable(pool)
    const client = await pool.connect()
    try {
      if (id.includes(':')) {
        const [collection, versionId] = id.split(':')
        const src = VERSION_SOURCES.find((s) => s.collection === collection)
        if (!src) return { before: null, after: null }

        // Payload Postgres adapter хранит fields как `version_<field>` columns
        // (не jsonb). Собираем все `version_*` columns в jsonb через
        // information_schema query + dynamic row_to_json без version_-prefix.
        const colsRes = await client.query<{ column_name: string }>(
          `SELECT column_name FROM information_schema.columns
           WHERE table_schema = 'public' AND table_name = $1
             AND column_name LIKE 'version\\_%' ESCAPE '\\'`,
          [src.versionTable.replace(/^_/, '')], // strip leading underscore for lookup
        )

        // Note: information_schema.tables strips leading underscore — re-try with full name.
        const colsRes2 =
          colsRes.rows.length === 0
            ? await client.query<{ column_name: string }>(
                `SELECT column_name FROM information_schema.columns
               WHERE table_schema = 'public' AND table_name = $1
                 AND column_name LIKE 'version\\_%' ESCAPE '\\'`,
                [src.versionTable],
              )
            : colsRes

        const versionCols = colsRes2.rows.map((r) => r.column_name)
        if (versionCols.length === 0) return { before: null, after: null }

        const buildSnapshot = `jsonb_build_object(${versionCols
          .map((c) => `'${c.replace(/^version_/, '')}', v."${c}"`)
          .join(', ')})`

        const r = await client.query<{
          snapshot: Record<string, unknown>
          parent_id: string
        }>(
          `SELECT ${buildSnapshot} AS snapshot, v.parent_id::text AS parent_id
           FROM ${src.versionTable} v
           WHERE v.id = $1::integer LIMIT 1`,
          [versionId],
        )
        if (r.rows.length === 0) return { before: null, after: null }
        const after = r.rows[0].snapshot
        const parentId = r.rows[0].parent_id

        const prev = await client.query<{ snapshot: Record<string, unknown> }>(
          `SELECT ${buildSnapshot} AS snapshot
           FROM ${src.versionTable} v
           WHERE v.parent_id = $1::integer AND v.id < $2::integer
           ORDER BY v.id DESC LIMIT 1`,
          [parentId, versionId],
        )
        const before = prev.rows.length > 0 ? prev.rows[0].snapshot : null
        return {
          before: maskPII(collection, before),
          after: maskPII(collection, after),
        }
      }

      const r = await client.query<{ diff: { before?: unknown; after?: unknown } }>(
        `SELECT al.diff FROM audit_log al WHERE al.id = $1::uuid LIMIT 1`,
        [id],
      )
      if (r.rows.length === 0) return { before: null, after: null }
      const d = r.rows[0].diff ?? {}
      // PII masking уже применена write-time, re-mask is no-op safety net.
      return {
        before: (d.before as Record<string, unknown> | null) ?? null,
        after: (d.after as Record<string, unknown> | null) ?? null,
      }
    } finally {
      client.release()
    }
  }

  // ── helpers

  private activeSources(collections?: string[]): VersionSource[] {
    if (!collections || collections.length === 0) return VERSION_SOURCES
    return VERSION_SOURCES.filter((s) => collections.includes(s.collection))
  }

  private sourcesForCollection(collection: string): VersionSource[] {
    const src = VERSION_SOURCES.find((s) => s.collection === collection)
    return src ? [src] : []
  }
}

/**
 * Cursor encoding — base64 ISO timestamp. Opaque to clients, deterministic.
 */
function encodeCursor(ts: string): string {
  return Buffer.from(ts, 'utf-8').toString('base64')
}

function decodeCursor(cursor: string | null): string | null {
  if (!cursor) return null
  try {
    return Buffer.from(cursor, 'base64').toString('utf-8')
  } catch {
    return null
  }
}

/**
 * Помечает collection slug как «PII / security» (хранится в audit_log table,
 * не в versions).
 */
export function isPiiOrSecurity(collection: string): boolean {
  return [
    'leads',
    'users',
    'media',
    'redirects',
    '__auth',
    '__bulk',
    'site-chrome',
    'seo-settings',
  ].includes(collection)
}

/**
 * Singleton instance — переиспользуется во всех hooks и REST endpoint.
 */
let cached: HybridAuditLogAdapter | null = null
export function getAuditLogAdapter(): HybridAuditLogAdapter {
  if (!cached) cached = new HybridAuditLogAdapter()
  return cached
}
