---
adr: ADR-0014
title: Panel Audit Log storage strategy — hybrid (Payload versions для content + custom audit_log для PII)
status: Accepted
date: 2026-05-01
accepted_by: popanel (autonomous mandate)
accepted_date: 2026-05-01
authors: [tamd]
related:
  - specs/PANEL-AUDIT-LOG/sa-panel.md
  - team/adr/ADR-0012-payload-cell-inline-update.md
  - team/adr/ADR-0013-panel-global-search-performance.md
skill: architecture-decision-records
---

# ADR-0014 · Panel Audit Log storage strategy

**Статус:** Proposed (autonomous mandate, popanel sign-off pending). При имплементации → Accepted.
**Дата:** 2026-05-01
**Автор:** tamd
**Контекст US:** [PANEL-AUDIT-LOG](../../specs/PANEL-AUDIT-LOG/sa-panel.md)
**Skill activation:** `architecture-decision-records` (skill-check iron rule); `hexagonal-architecture`, `postgres-patterns`, `database-migrations` (контекстно).

---

## Контекст

PANEL-AUDIT-LOG требует **сводный audit-trail** (`/admin/audit`) с фильтрами collection / user / action / date-range, кликабельный entries → side-by-side diff view (before / after JSON), а также per-document timeline в edit-view коллекций. Capture перечисленных actions: create / update / delete / publish / unpublish / archive / login / logout / bulk-action / rbac-change. PII полей в Leads (customer_phone, customer_email) **должно быть маскировано** в audit display (даже admin не видит raw phone в audit, только в Leads edit-view).

**Бизнес-нужда (operator capability):**
- Ответить «кто опубликовал Lead в новый статус» — sometimes под спором с менеджером.
- Ответить «кто изменил metaTitle услуги "Спил дерева"» — для SEO-инцидентов.
- Ответить «когда последний раз правился SiteChrome.footer» — для marketing-рассылок.
- Compliance след для 152-ФЗ — кто прикасался к PII (Leads), когда.

**Существующие constraints:**
- Payload 3.84 имеет native `versions: true` per-collection toggle: создаёт `<collection>_versions` table, snapshot полного документа per change, `_v` join tables для arrays/relationships. Используется в Payload native «Versions» tab в edit-view.
- На 2026-05-01 ни одна коллекция (Leads, Services, Cases, Blog, Districts, ServiceDistricts, Authors, B2BPages, Persons, Media, Redirects, Users) не имеет `versions: true` (verified ADR-0012 § Verification). Включение — миграция (создание `*_v*` тейблов).
- `versions` design: storage rapidly growing (full snapshot per change), но built-in diff algorithm + UI; нет global timeline API (только per-document); нет PII masking.
- Globals (SiteChrome, SeoSettings) versioning — **отдельный** API (`globals.versions`); не unified с collections.

**Связанные incident patterns:**
- US-12 retro L2 (PANEL-RSC-LINT, см. ADR-0015) — type-check недостаточен; для audit log диф-views (server props в client components) обязателен real-browser smoke.
- US-12 W6 SeoSettings — миграция type-check OK, runtime `_v_version_*` join tables не созданы → 500 errors в admin (см. ADR-0012 § Verification). Включение `versions: true` для коллекций требует verified-by-prototype migration approach.

---

## Решение

**Принимается Strategy 3 — Hybrid: Payload `versions: true` для content collections + custom `audit_log` table для action-audit + PII collections.**

### Разделение по типу storage

| Коллекция | Storage | Capture | Diff |
|---|---|---|---|
| **Cases** | Payload `versions` | автоматически | native diff (Payload UI + custom render для unified `/admin/audit`) |
| **Blog** | Payload `versions` | автоматически | native diff |
| **Services** | Payload `versions` | автоматически | native diff |
| **B2BPages** | Payload `versions` | автоматически | native diff |
| **ServiceDistricts** | Payload `versions` | автоматически | native diff |
| **Districts** | Payload `versions` | автоматически | native diff |
| **Authors** | Payload `versions` | автоматически | native diff |
| **Persons** | Payload `versions` | автоматически | native diff |
| **Leads** (PII) | Custom `audit_log` table | `afterChange` / `afterDelete` hooks | server-side masked diff |
| **Users** (RBAC events) | Custom `audit_log` | `afterChange` / `afterLogin` / `afterLogout` hooks | masked diff |
| **Media** | Custom `audit_log` (минимально — upload/delete events, не versions) | `afterChange` / `afterDelete` | trivial diff (filename, size) |
| **Redirects** | Custom `audit_log` | `afterChange` / `afterDelete` | full diff (источник/цель — не PII) |
| **SiteChrome** (global) | Payload `versions` (globals.versions) | автоматически | native diff |
| **SeoSettings** (global) | Payload `versions` (globals.versions) | автоматически | native diff |
| **Bulk actions** (cross-collection) | Custom `audit_log` (single grouped entry с `affected_doc_ids`) | API gate hook | aggregate view |
| **Login / Logout / RBAC change** | Custom `audit_log` | Payload `afterLogin` / `afterLogout` / hooks | минимальный diff (role from/to) |

### Capability port (hexagonal — sa-panel.md §approach)

```ts
// site/lib/admin/audit/AuditLogPort.ts
interface AuditLogPort {
  list(filters: AuditFilters): Promise<{entries: AuditEntry[], nextCursor: string|null}>;
  get(id: string): Promise<AuditEntry>;
  diff(id: string): Promise<{before: object, after: object}>;  // PII masking applied server-side
  capture(event: AuditEvent): Promise<void>;
}

// Adapter
class HybridAuditLogAdapter implements AuditLogPort {
  // list/get aggregates UNION ALL across:
  //   1. <collection>_versions tables for content collections
  //   2. audit_log table for PII/security events
  //   3. globals.versions for SiteChrome/SeoSettings
  // diff applies PII masking based on collection + field whitelist
  // capture writes to audit_log for non-versioned collections + security events
}
```

### Custom `audit_log` table schema

```sql
CREATE TABLE audit_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection    text NOT NULL,             -- 'leads' | 'users' | 'media' | 'redirects' | '__bulk' | '__auth'
  doc_id        text,                       -- nullable для login/logout (нет doc)
  user_id       uuid REFERENCES users(id) ON DELETE SET NULL,
  action        text NOT NULL,              -- 'create'|'update'|'delete'|'publish'|'unpublish'|'archive'|'login'|'logout'|'bulk-action'|'rbac-change'
  changed_at    timestamptz NOT NULL DEFAULT now(),
  ip            inet,
  user_agent    text,
  diff          jsonb NOT NULL DEFAULT '{}'::jsonb,  -- { before: {...masked...}, after: {...masked...} }
  affected_ids  text[] DEFAULT NULL,        -- для bulk-action: список doc_id
  metadata      jsonb DEFAULT '{}'::jsonb   -- e.g., { from_role: 'manager', to_role: 'admin' } для rbac-change
);

CREATE INDEX audit_log_changed_at_idx ON audit_log (changed_at DESC);
CREATE INDEX audit_log_collection_idx ON audit_log (collection, changed_at DESC);
CREATE INDEX audit_log_user_idx ON audit_log (user_id, changed_at DESC);
CREATE INDEX audit_log_action_idx ON audit_log (action, changed_at DESC);
CREATE INDEX audit_log_doc_idx ON audit_log (collection, doc_id, changed_at DESC);  -- для per-document timeline
```

### PII masking pipeline

PII masking применяется **на capture time** (write-time), не render-time. Это гарантирует:
1. Никакой raw phone/email никогда не лежит в `audit_log.diff` jsonb.
2. Утечка `audit_log` (read-only PII), ничто не выйдет в clear.
3. Replay/debug audit не требует re-masking.

```ts
// site/lib/admin/audit/maskPII.ts
const PII_RULES: Record<string, Record<string, (val: unknown) => string>> = {
  leads: {
    customer_phone: (v) => typeof v === 'string' ? `***-**-${v.slice(-2)}` : '***',
    customer_email: (v) => typeof v === 'string' ? v.replace(/(.).*@(.*)/, '$1***@$2') : '***',
  },
  users: {
    email: (v) => typeof v === 'string' ? v.replace(/(.).*@(.*)/, '$1***@$2') : '***',
  },
};

export function maskPII(collection: string, doc: Record<string, unknown>) {
  const rules = PII_RULES[collection];
  if (!rules) return doc;
  const masked = { ...doc };
  for (const [field, mask] of Object.entries(rules)) {
    if (field in masked) masked[field] = mask(masked[field]);
  }
  return masked;
}
```

### Retention policy

| Storage | Retention | Cleanup mechanism | Rationale |
|---|---|---|---|
| `<collection>_versions` (content) | **90 дней** rolling window | Daily cron `pnpm payload:exec scripts/audit/prune-versions.ts` — `payload.deleteVersions({ collection, where: { updatedAt: { less_than: ninetyDaysAgo } } })` | Storage growth control; контент-revisions редко нужны старше квартала; полная история в git/Sentry если business-critical |
| `audit_log` (PII / actions) | **1 год** rolling window | Daily cron `DELETE FROM audit_log WHERE changed_at < now() - interval '1 year'` | 152-ФЗ recommended retention для PII access logs; при росте >5 GB — пересмотр через ADR |
| globals.versions (SiteChrome / SeoSettings) | **180 дней** | Daily cron analogous | Globals меняются реже, имеет смысл хранить дольше |

Retention values **конфигурируемы через env**:
- `AUDIT_RETENTION_VERSIONS_DAYS=90`
- `AUDIT_RETENTION_AUDIT_LOG_DAYS=365`
- `AUDIT_RETENTION_GLOBALS_DAYS=180`

Cron — отдельный GitHub Action либо PM2 cron entry (do owns).

### UI: unified `/admin/audit` page

- Custom Payload page `site/app/(payload)/audit/page.tsx` — sidebar entry «История» (см. retro PANEL-AXE-PAYLOAD-CORE-A11Y context, иконка clock/history из 49-glyph set §9 либо новая через `art`).
- List rendering: cursor-based pagination, 50 entries per page.
- Adapter `list()` делает UNION ALL query:

  ```sql
  SELECT 'cases' AS collection, id::text AS doc_id, "createdBy" AS user_id,
         updated_at AS changed_at, '__version' AS action,
         row_to_json(c.*) AS snapshot
  FROM cases_v c
  WHERE c.updated_at > $cursor_ts AND ...
  UNION ALL
  -- ... per content collection
  UNION ALL
  SELECT collection, doc_id, user_id, changed_at, action, diff AS snapshot
  FROM audit_log
  WHERE changed_at > $cursor_ts AND ...
  ORDER BY changed_at DESC
  LIMIT 50;
  ```

- Diff view `/admin/audit/<id>` — server component fetches single entry (route by id + collection ИЛИ audit_log row), вызывает `adapter.diff(id)` → side-by-side rendering.
- Per-document timeline (sidebar tab «История» в edit-view) — scoped query: для content collection — `*_versions` table where `parent_id = doc_id`; для PII — `audit_log` where `(collection, doc_id) = (..., ...)`.

---

## Альтернативы

### Альтернатива 1 — Payload native `versions: true` ALL коллекций

**Pros:**
- Built-in: zero capture-code, no hooks.
- Native diff algorithm + UI (Payload «Versions» tab из коробки).
- Per-collection toggle, can enable selectively.

**Cons:**
- **No global query API** — нет способа эффективно сделать «show all changes in last 7 days across collections» без UNION ALL над 12 versions tables (та же сложность, что в Strategy 3).
- **Storage cost:** full document snapshot per change. Для Cases с rich text + 5 фото = ~50 KB per version × 100 changes = 5 MB на 1 case. На 50 cases × 100 changes = 250 MB. Без retention — растёт линейно.
- **No PII masking:** Leads.customer_phone в `leads_versions` хранится в clear → Versions tab в admin показывает phone в clear для всех admins. **Это блокер** для PANEL-AUDIT-LOG §AC3 (PII masking даже для admins).
- **No login/logout/bulk-action capture:** versions создаются только на document change, не на security events. Strategy 1 НЕ закрывает §AC5 fully.
- Migration risk на existing data (см. US-12 W6 SeoSettings `_v_version_*` incident, ADR-0012 § Verification).

**Verdict:** Rejected as sole solution — не закрывает PII masking + login/logout audit. Используется как **частичный компонент Strategy 3** (для content collections где PII нет).

### Альтернатива 2 — Custom `audit_log` table-only для всех коллекций

**Pros:**
- Single unified storage → simple UNION-free queries.
- Native PII masking pipeline (server-side at capture).
- Captures security events (login/logout/rbac/bulk) на equal footing с document changes.
- Single retention policy.

**Cons:**
- **Maintenance overhead:** explicit `afterChange` / `afterDelete` hooks в каждой коллекции (~20-30 строк каждая × 12 коллекций = 250-350 строк хуковой code). При добавлении коллекции — обязательно копировать.
- **Diff algorithm — NIH:** нужно реализовать field-level diff (object diff + array diff + nested object handling). Mitigation: `microdiff` либо `deep-object-diff` npm — но всё равно: тестирование, edge cases (Slate JSON для rich text Cases — нетривиально).
- **Duplicates Payload Versions UI:** Payload UI tab «Versions» в edit-view содержит rollback/restore, который оператор может ожидать. Audit_log не даёт rollback (read-only audit) → operator UX confusion: «почему в Cases есть restore, а в Leads нет».
- **Cost для content collections:** Cases / Blog имеют большой rich text Slate JSON; full diff capture в jsonb на каждое сохранение = duplicate work уже встроенный Payload versions делает лучше.

**Verdict:** Rejected as sole solution. Maintenance burden высок, и теряем native Payload UX для content. Используется как **частичный компонент Strategy 3** (для PII / security / non-versionable).

### Альтернатива 3 — Hybrid (выбран — см. § Решение)

### Альтернатива 4 — External audit storage (Loki / Elasticsearch / SigNoz)

**Pros:**
- Built-in retention policies.
- Powerful search / aggregation для audit replay.
- Не давит на main Postgres storage.

**Cons:**
- Дополнительный сервис (RAM 200-500 MB) — VPS 2GB не позволяет (см. ADR-0013 § Alt 3).
- 152-ФЗ юрисдикция тот же концерн.
- Complexity: 2 storages + sync + admin UI integration.
- YAGNI — текущий объём (50-150 leads/week, 1-3 admins) → custom audit_log table укладывается в 1 GB / год при capture rate 10k entries/month.

**Verdict:** Rejected. Defer until usage justifies (similar trigger как ADR-0013: usage growth >10× projected).

---

## Последствия

### Положительные

- **PII masking встроена в pipeline** (capture-time) → leak-resistant. cr-panel security review проходит без compromises.
- **Native Payload UX сохраняется** для content collections: «Versions» tab в Cases/Blog/Services работает как раньше (compare versions, restore).
- **Unified `/admin/audit`** UI даёт оператору single-pane-of-glass через UNION ALL adapter.
- **Hexagonal isolation** — `AuditLogPort` interface позволяет swap adapter (например, на Strategy 4 external storage) без UI rewrite.
- **Retention configurable** через env — operations может настроить под compliance требования без code changes.
- **Globals покрыты** через native globals.versions (SiteChrome / SeoSettings).
- **Bulk actions групируются** в single audit_log entry с `affected_ids[]` — timeline не «забивается» 50 entries за один bulk-publish.

### Отрицательные

- **Two storages для maintenance** — Payload versions config + custom audit_log table + cleanup crons. cr-panel review должен покрывать оба.
- **Storage cost для versions** — даже с 90-day retention Cases с rich text + photos может расти до 100-300 MB на коллекцию. Mitigation: retention cron + monitoring (Sentry custom metric `audit.versions.size_mb`).
- **Migration на existing коллекции** — включение `versions: true` для уже существующих Cases/Blog/etc. требует careful migration (см. US-12 W6 SeoSettings `_v_version_*` incident). Mitigation: dba prototype + verify в dev before prod.
- **Diff view rendering complexity** — JSON-aware side-by-side с PII masking + collapsed nested objects = ~300-500 строк fe-panel code. Mitigation: библиотека `react-diff-viewer-continued` либо `jsondiffpatch` для baseline, custom render для PII fields.
- **Cleanup cron — operational overhead** — daily job × 3 retention scopes. Mitigation: один merged script `scripts/audit/prune.ts` с config, idempotent.

### Mitigation

- **Migration safety:** для каждой коллекции включающей `versions: true` — dba предоставляет migration который verified в dev, prod-applied через `pnpm payload migrate` flow. Не enable в bulk; staged rollout (Cases first → verify → Blog → ...).
- **PII leak test:** qa-panel Playwright test — create Lead с phone «+79991234567» → update → open `/admin/audit` → verify rendering показывает «***-**-67» а не raw. Также verify `psql ... SELECT diff FROM audit_log WHERE collection='leads'` не содержит raw phone в jsonb (capture-time mask invariant).
- **Storage monitoring:** Sentry custom metric `audit.versions.total_mb` per collection daily; alert >2 GB total.
- **Adapter abstraction:** `AuditLogPort` interface — IDE/typecheck форсит conformance; swap-out обеспечен.
- **Index validation:** dba validates `audit_log` indexes covered queries в `EXPLAIN ANALYZE` на репрезентативном объёме (10k entries) до deploy.

### Риски

- **Risk:** Включение `versions: true` для Leads (если когда-то понадобится) автоматически создаст `leads_versions` с raw phone. Mitigation: явный rule в `team/panel/sa-panel.md` template — Leads + Users НЕ получают `versions: true`, audit-only через `audit_log`. Code review gate.
- **Risk:** Bulk-action capture race condition — concurrent bulk-publish 50 docs создаст 50 hooks fired одновременно, single grouped audit_log entry может не дождаться all. Mitigation: gate hook на API endpoint level (не per-doc afterChange), wrap в transaction, single capture call после batch operation.
- **Risk:** Globals versioning API `globals.versions` может не быть available в Payload 3.84 same way как collections. Mitigation: dba + be-panel verify в Payload source (`@payloadcms/db-postgres`) до прототипа; fallback — capture globals через `audit_log` если native versions нет.
- **Risk:** Diff algorithm на Slate rich text JSON может выдавать нечитаемые diffs (binary-like). Mitigation: для rich text fields — render diff на rendered HTML (server-side `slate-to-html`), показывать читаемое сравнение vs raw JSON.
- **Risk:** GDPR-style "right to be forgotten" для Leads — если оператор удаляет Lead, audit_log entries остаются с маскированными PII. acceptable per 152-ФЗ recommended (audit retention legitimate interest), но fix-forward возможен — selective `audit_log` deletion для конкретного customer на запрос.

---

## Implementation outline

1. **dba** — миграции:
   - `add_audit_log_table` — `CREATE TABLE audit_log + 5 indexes` + extension `pgcrypto` (для `gen_random_uuid()`).
   - `enable_versions_cases` — добавить `versions: true` в `Cases.ts` + migration `payload migrate:create` → verify `_v` join tables.
   - Аналогично для Blog, Services, B2BPages, ServiceDistricts, Districts, Authors, Persons (8 миграций staged).
   - Down migrations — `DROP TABLE audit_log` + revert versions config.
   - Validate в dev на seeded data (per US-12 W6 lessons).

2. **be-panel**:
   - `site/lib/admin/audit/AuditLogPort.ts` — interface.
   - `site/lib/admin/audit/HybridAuditLogAdapter.ts` — `list/get/diff/capture` с UNION ALL query (как ADR-0013 — параметризованный SQL).
   - `site/lib/admin/audit/maskPII.ts` — masking pipeline.
   - Per PII-collection (Leads, Users, Media, Redirects) — `afterChange` / `afterDelete` hooks → `adapter.capture(...)`.
   - Login/logout/RBAC capture — `afterLogin` / `afterLogout` hooks в Users config + custom RBAC mutation hook.
   - Bulk-action capture — gate hook на API endpoint (не per-doc).
   - REST endpoint `GET /api/admin/audit?...` — проксирует `adapter.list()`, RBAC admin-only.
   - Statement timeout (как ADR-0013).

3. **fe-panel**:
   - `/admin/audit/page.tsx` — list rendering, filters UI, cursor pagination.
   - `/admin/audit/[id]/page.tsx` — diff view, side-by-side, JSON-aware.
   - Sidebar tab «История» в edit-view (per-document timeline) — Payload custom views API (см. ADR-0010).
   - PII masking visualised → не decoded (server already masked).

4. **scripts/audit/prune.ts** — cleanup cron, runs daily, three retention scopes.

5. **qa-panel**:
   - Playwright e2e — change Service.metaTitle → open `/admin/audit` → verify entry → click → diff view.
   - PII masking test (раw phone never in audit display).
   - Bulk-action test (single entry с `affected_ids`).
   - Login/logout capture test.
   - Performance — load 1k entries, p95 < 1.5s (AC9).

6. **cr-panel** review checklist:
   - PII masking applied на capture-time (verified via SQL inspect).
   - RBAC admin-only на endpoint.
   - SQL injection guard.
   - Retention cron idempotent.
   - Adapter conformance к `AuditLogPort` interface.

7. **leadqa** — real-browser smoke (iron rule #6):
   - Login → 5 different actions (create/update/delete/publish/login) → verify each appears in `/admin/audit`.
   - Diff view on PII collection → verify masking in browser (DevTools network response).
   - Screenshot.

---

## References

- Spec: [`specs/PANEL-AUDIT-LOG/sa-panel.md`](../../specs/PANEL-AUDIT-LOG/sa-panel.md)
- Payload Versions docs: https://payloadcms.com/docs/versions/overview
- ADR-0012 § Verification — precedent для verifying Payload schema до миграции.
- ADR-0013 — параллельный pattern для cross-collection UNION ALL query.
- US-12 retro § Lessons L2 — обоснование real-browser smoke before push.
- Memory: `feedback_leadqa_must_browser_smoke_before_push`.
- 152-ФЗ — рекомендации по PII access logs retention.

---

## История

- 2026-05-01 · sa-panel зафиксировал spec PANEL-AUDIT-LOG с открытым question по storage strategy 1/2/3 + retention.
- 2026-05-01 · popanel передал tamd под autonomous mandate.
- 2026-05-01 · tamd accepted Strategy 3 (Hybrid versions + audit_log с PII masking + 90/365/180 days retention). Awaiting popanel sign-off → status Accepted, dev-ready.
