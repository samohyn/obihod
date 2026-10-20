/**
 * Объекты БД, которых нет в коллекциях Payload, — описаны здесь, чтобы схема из
 * конфига совпадала с базой целиком (план 09, этап 1 — «Дрейф схемы»).
 * Без этого drizzle при каждом сравнении предлагает их удалить:
 *   - audit_log — журнал действий в админке (ADR-0014), пишется raw SQL
 *     в lib/admin/audit/HybridAuditLogAdapter.ts;
 *   - частичные уникальные индексы service_districts: одна посадочная «услуга × город»
 *     и одна страница на подуслугу в городе (миграция 20260502_120000).
 * Описание обязано совпадать с DDL в базе байт в байт: имена, порядок колонок,
 * выражения WHERE/CHECK. Проверка — `pnpm schema:diff` (0 команд).
 */
import type { postgresAdapter } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres/drizzle'
import {
  check,
  foreignKey,
  index,
  inet,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from '@payloadcms/db-postgres/drizzle/pg-core'

type SchemaHook = NonNullable<Parameters<typeof postgresAdapter>[0]['afterSchemaInit']>[number]

export const auditLogTable: SchemaHook = ({ schema }) => {
  const users = schema.tables.users
  const auditLog = pgTable(
    'audit_log',
    {
      id: uuid('id').defaultRandom().primaryKey().notNull(),
      collection: text('collection').notNull(),
      docId: text('doc_id'),
      userId: integer('user_id'),
      action: text('action').notNull(),
      changedAt: timestamp('changed_at', { withTimezone: true }).defaultNow().notNull(),
      ip: inet('ip'),
      userAgent: text('user_agent'),
      diff: jsonb('diff')
        .default(sql`'{}'::jsonb`)
        .notNull(),
      affectedIds: text('affected_ids').array(),
      metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    },
    (t) => [
      check(
        'audit_log_action_check',
        sql`(action = ANY (ARRAY['create'::text, 'update'::text, 'delete'::text, 'publish'::text, 'unpublish'::text, 'archive'::text, 'login'::text, 'logout'::text, 'login_failed'::text, 'bulk_action'::text, 'rbac_change'::text]))`,
      ),
      foreignKey({
        name: 'audit_log_user_id_fkey',
        columns: [t.userId],
        foreignColumns: [users.id],
      }).onDelete('set null'),
      // В базе индексы созданы как DESC — в Postgres это NULLS FIRST; drizzle по умолчанию пишет NULLS LAST.
      index('audit_log_action_idx').on(t.action, t.changedAt.desc().nullsFirst()),
      index('audit_log_changed_at_idx').on(t.changedAt.desc().nullsFirst()),
      index('audit_log_collection_idx').on(t.collection, t.changedAt.desc().nullsFirst()),
      index('audit_log_doc_idx').on(t.collection, t.docId, t.changedAt.desc().nullsFirst()),
      index('audit_log_user_idx').on(t.userId, t.changedAt.desc().nullsFirst()),
    ],
  )
  return { ...schema, tables: { ...schema.tables, audit_log: auditLog } }
}

export const serviceDistrictIndexes: SchemaHook = ({ schema, extendTable }) => {
  extendTable({
    table: schema.tables.service_districts,
    extraConfig: (t) => ({
      sdDistrictService: index('idx_service_districts_district_service').on(t.district, t.service),
      sdPillarUniq: uniqueIndex('service_districts_service_district_pillar_uniq')
        .on(t.service, t.district)
        .where(sql`(sub_service_slug IS NULL)`),
      sdSubUniq: uniqueIndex('service_districts_service_district_sub_uniq')
        .on(t.service, t.district, t.subServiceSlug)
        .where(sql`(sub_service_slug IS NOT NULL)`),
    }),
  })
  return schema
}
