---
us: PANEL-AUDIT-LOG
role: cr-panel
phase: review
status: approved
reviewed_by: be-panel + dba + fe-panel inline (PANEL-AUDIT-LOG dev-bundle, popanel autonomous mandate)
reviewed_at: 2026-05-01
adr: ADR-0014
---

# cr-panel sign-off — PANEL-AUDIT-LOG

## Security review

- **PII masking — write-time invariant.** `site/lib/admin/audit/maskPII.ts`
  применяется в `HybridAuditLogAdapter.capture()` ДО `INSERT INTO audit_log`.
  SQL inspect прошёл: `grep` на raw phone «79991234567» / email
  «ivan.test@example.com» / name «Иван Тестовый» в `audit_log.diff` jsonb
  возвращает 0 совпадений. Stored mask: `***-**-67`, `i***@example.com`, `И***`.
  Доказательство — screenshot `screen/audit-log-pii-masked.png` + SQL row dump
  в финальном отчёте.
- **RBAC admin-only.** REST endpoint `/api/admin/audit` + `/api/admin/audit/[id]`
  гайды через `payload.auth({headers})` + role check `=== 'admin'`. Manager /
  seo / content получают 403. Custom views `AuditView.tsx` + `AuditDiffView.tsx`
  проверяют `initPageResult.req.user.role === 'admin'` ДО render — для
  не-admin показывает «Доступно только администраторам».
- **SQL injection guard.** Все user-input (collections, actions, q, dates,
  cursor, scopedTo) приходят как `pushParam()` bind-parameters в pg (`$N`).
  Динамические идентификаторы (versionTable name, titleColumn) — из
  `VERSION_SOURCES` constant + filtered information_schema lookup, не от
  client.
- **Statement timeout.** Inherits from default pg pool config; нет ручного
  `SET LOCAL statement_timeout` на /api/admin/audit (queries наблюдаются
  быстрее 500ms на dev). Если prod покажет slow timeline — добавить per-session
  500ms limit как в `/api/admin/search` (precedent).

## Architecture review

- **Hexagonal port** — `AuditLogPort` interface в `types.ts`, реализация
  `HybridAuditLogAdapter` в одном файле. Allow swap-out future adapter
  (e.g., external audit storage Loki/SigNoz при росте >5GB) без UI / hooks
  changes.
- **Storage split per ADR-0014:**
  - 7 content collections (cases, blog, services, b2b-pages, service-districts,
    districts, authors) — Payload `_<slug>_v` versions tables (versions: true
    был enabled до PANEL-AUDIT-LOG в US-12 / OBI-30 — verified существование
    через `\dt _*_v` в Postgres).
  - 4 PII / non-versioned collections (Leads, Users, Media, Redirects) —
    custom `audit_log` table через afterChange/afterDelete hooks.
  - Security events (login, logout, rbac_change) — `__auth` pseudo-collection
    в `audit_log` через Users.afterLogin / afterLogout / afterChange (RBAC
    detection).
- **Globals (SiteChrome / SeoSettings)** — НЕ покрыты в этой итерации
  (versions: true для globals требует careful migration; precedent US-12 W6
  `_v_version_*` incident — fix-forward в отдельном US). Capture через
  `audit_log` возможен но deferred.

## Migration safety

- Миграция `20260501_220000_audit_log_table.{up,down,ts}.sql` —
  `CREATE TABLE IF NOT EXISTS audit_log` + 5 индексов + check-constraint
  + FK on users(id) ON DELETE SET NULL.
- В dev: `push:true` Payload пересобирает schema, что может drop'ать
  non-Payload tables → `HybridAuditLogAdapter` имеет idempotent
  `ensureAuditLogTable()` с lazy promise singleton (DDL `IF NOT EXISTS`,
  безопасно re-run).
- На проде: `push:false`, deploy.yml применяет миграцию через `psql -f`.
  `ensureAuditLogTable()` остаётся no-op (CREATE IF NOT EXISTS).

## Retention

- Cron script `site/scripts/audit/prune.ts` + npm scripts `audit:prune` /
  `audit:prune:prod`.
- 3 retention scopes (env-configurable per ADR-0014):
  - `AUDIT_RETENTION_AUDIT_LOG_DAYS` default 365 (152-ФЗ)
  - `AUDIT_RETENTION_VERSIONS_DAYS` default 90
  - (`AUDIT_RETENTION_GLOBALS_DAYS` отложен — globals.versions не enabled)
- Idempotent — re-runs пропускают уже-удалённые rows. Использует
  `to_regclass()` guard для skip non-existent versions tables.
- Setup в deploy.yml — отдельный follow-up (do owns), записан в backlog.

## CI

- type-check: green
- eslint: 0 errors, 89 pre-existing warnings (none из audit module)
- format:check: green
- next build: green

## Verdict

**APPROVED** — security & architecture compliant per ADR-0014. Ship.

Open follow-ups (НЕ блокеры релиза):
1. Per-document «История» tab в edit-view коллекций (sidebar tab) —
   текущая итерация делает scope через `/admin/audit?scope_collection=...&scope_doc_id=...`
   query params. Custom Payload edit-view tab — отдельный fe-panel US.
2. Globals (SiteChrome / SeoSettings) versioning — требует careful migration,
   trail US-12 W6 lessons. Audit_log-only capture как fallback.
3. Cron schedule в deploy.yml для `audit:prune:prod` — do owns.
4. Bulk-action capture — gate hook на API endpoint (когда добавится bulk-publish
   batch operations). Сейчас bulk-edit генерирует N afterChange events; group
   collapse — отдельный US.
