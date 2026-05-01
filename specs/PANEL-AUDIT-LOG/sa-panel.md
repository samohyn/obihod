---
us: PANEL-AUDIT-LOG
title: Audit log — кто/что/когда менял (Payload versions + diff view)
team: panel
po: popanel
type: feature
priority: C
segment: admin
phase: spec-approved
role: sa-panel
status: dev-ready
blocks: []
blocked_by: []
adr: ADR-0014 (Accepted 2026-05-01 by popanel autonomous mandate) — Hybrid (Payload versions для content + custom audit_log для PII + retention policy)
related: [PANEL-BULK-PUBLISH, PANEL-AUTH-2FA, PANEL-LEADS-INBOX]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, api-design, hexagonal-architecture, product-capability]
adr_required: true
---

# sa-panel — PANEL-AUDIT-LOG

## Skill activation (фиксация)

- `design-system` — brand-guide §12 timeline view, diff colors (added — primary green tint, removed — error red tint), `<TimelineEntry>` component (mockup §12.6 если присутствует, иначе следуем §11 list pattern).
- `api-design` — `GET /api/admin/audit?collection=&doc_id=&user_id=&from=&to=&limit=&cursor=` контракт.
- `hexagonal-architecture` — `AuditLogPort` интерфейс над storage adapter (Payload versions adapter vs audit_log table adapter); позволит swap strategy без UI rewrite.
- `product-capability` — оператор отвечает на вопросы «кто опубликовал лида в новый-status», «кто изменил metaTitle услуги "Спил дерева"», «когда последний раз правился SiteChrome.footer».

## Цель

Сводный audit-trail в `/admin/audit` с фильтрами (collection / user / action / date-range), кликабельные entries → diff view (side-by-side before/after JSON). На каждой edit-view коллекции — sidebar tab «История» со scoped timeline (только этот document).

## Acceptance Criteria

- **AC1 — Timeline view (`/admin/audit`):** Custom Payload page в sidebar (после `Catalog`, before `Leads`). Список entries: `[avatar][user.name] [action] в [collection] / [doc.title] · [N мин назад]`. Кликабельная entry → `/admin/audit/<id>` диффчик. Pagination — cursor-based, limit 50.
- **AC2 — Filters:**
  - `collection` (multi-select из 10).
  - `user` (relationship users).
  - `action` (multi-select: create/update/delete/publish/unpublish/archive/login/logout/bulk-action/rbac-change).
  - `from` / `to` (date range, default last 7 days).
  - Free-text search по `doc.title` и `user.name` (через GLOBAL-SEARCH endpoint pattern, может быть отдельный endpoint).
- **AC3 — Diff view:** Side-by-side panels (before / after), JSON-aware (collapsed nested objects, expand-on-click), changed fields highlighted (green added, red removed, yellow changed). PII полей в Leads (`customer_phone`, `customer_email`) маскируются `***-**-89` / `***@***.ru`.
- **AC4 — Per-document timeline:** На edit-view каждой коллекции — новый sidebar tab «История» (между Edit / Versions / API). Показывает scoped timeline (только этот `doc_id`), без filters; кликабельная entry → diff view.
- **AC5 — Capture:** Каждое из перечисленных actions фиксируется audit-entry. Source — Payload `afterChange` / `afterDelete` / `afterLogin` hooks (или audit_log INSERT, depends on ADR strategy).
- **AC6 — RBAC:** `/admin/audit` доступна admin-only. PII masking всегда applied (даже admin не видит phone в clear, только в edit-view коллекции Leads).
- **AC7 — Retention:** Default infinite (значение по ADR от tamd). Если ADR требует TTL — sidebar message «История за последние N дней».
- **AC8 — Tests + Evidence:** Playwright: login → edit Service → change `metaTitle` → save → open «История» tab → видим entry → click → diff view с changed `metaTitle` highlight. Cross-collection: open `/admin/audit` → filter `action: publish` → видим recent publish events.
- **AC9 — Performance:** `/admin/audit` initial load p95 < 1.5s (50 entries + filter UI). Diff view < 500ms (single entry fetch + render).

## Brand-guide §12 mapping

- **§12 admin** — sidebar entry «История» с line-art icon (clock или history icon из 49-glyph набора §9; если icon отсутствует — pull request к `art` через cpo).
- **§11 lists** — timeline rows = list pattern.
- **§12.4 states** — entry hover, focus-visible, active.
- **§13 TOV** — labels («История», «Все изменения», «Кто», «Когда», action labels — «Опубликовал», «Создал», «Удалил»).
- **§13 TOV PII** — masking pattern «***-**-89» обоснован в TOV (privacy by default).

## Архитектура / approach

**Capability port (hexagonal):**
```ts
interface AuditLogPort {
  list(filters: AuditFilters): Promise<{entries: AuditEntry[], nextCursor: string|null}>;
  get(id: string): Promise<AuditEntry>;
  diff(id: string): Promise<{before: object, after: object}>;
  capture(event: AuditEvent): Promise<void>;
}
```

**Adapter (определяется ADR от tamd):**
- **Strategy 1 (Payload versions):** `PayloadVersionsAdapter` — `list()` агрегирует `<collection>_versions` тейблов через UNION SQL view; `diff()` сравнивает version[N] vs version[N-1]; `capture()` no-op (Payload автоматически).
- **Strategy 2 (Custom audit_log table):** `AuditLogTableAdapter` — отдельная collection `audit_log` (Payload-managed) или raw SQL table; explicit `capture()` через `afterChange` hooks; unified timeline native.
- **Strategy 3 (Hybrid):** content actions через Payload versions, security events (login/logout/rbac/bulk-action) — custom audit_log.

**UI:** Custom Payload pages `/admin/audit` + `/admin/audit/<id>` + sidebar tab. Используем W3 page-page pattern (PR #100 PageCatalog precedent).

## Risks + mitigations

1. **Storage doubling (если ADR-2)** — каждое изменение пишется и в `<collection>_versions`, и в `audit_log` → x2 storage, x2 hooks. Mitigation: ADR от tamd взвешивает; possible TTL для audit_log (90 days vs infinite).
2. **PII leak in diff JSON** — Lead phone в `before/after` JSON может оказаться в clear. Mitigation: AC3 masking applied **на сервере** (capture-time или render-time, чтобы admin никогда не видел raw phone в audit). Cr-panel review на security.
3. **Performance (timeline aggregation 10 коллекций)** — UNION 10 versions tables может быть slow. Mitigation: ADR-стратегия + index `created_at DESC` + cursor pagination; SeqScan на dev acceptable, prod — материализованная view если slow.
4. **Globals не в `<collection>_versions`** — SiteChrome / SeoSettings versioning отдельный API. Mitigation: ADR явно указывает, как обрабатывать globals (либо `globals_versions` если Payload поддерживает, либо force через Strategy 2/3).
5. **Bulk-action audit cardinality** — bulk-publish 50 cases = 50 entries. Может «забить» timeline. Mitigation: bulk actions фиксируются как single grouped entry с `affected_doc_ids: [...]`, expand-on-click показывает list.

## Out-of-scope

- Replay / rollback из audit-entry (revert to version) — отдельный future US.
- Real-time stream (SSE / WebSocket) на `/admin/audit` — premature, refresh button.
- Аналитика поверх audit (dashboard «top-changed collection за неделю») — отдельный US.
- Export audit log в CSV / Excel — отдельный US.
- Email-уведомления на критические events (RBAC change) — отдельный US.

## Состав команды

- **sa-panel** (this) — capability + spec.
- **tamd** — ADR-NN storage strategy (BLOCKER).
- **dba** — миграции если ADR-2/3 (audit_log table) + index review.
- **be-panel** — adapter implementation + Payload hooks + RBAC.
- **fe-panel** — `/admin/audit` page + diff view + sidebar tab + line-art icon (через `art`).
- **cw** — RU labels review.
- **qa-panel** — Playwright + load-test 1k entries + PII masking verify.
- **ux-panel** — visual review §12 timeline + diff colors.
- **cr-panel** — security review (PII), final review.

## Open questions

- ~~Все коллекции?~~ closed (10).
- ~~Включая Leads PII?~~ closed (YES с masking).
- **Open (для tamd ADR):** strategy 1/2/3 + retention policy.
- ~~Diff format?~~ closed (side-by-side).
- **Open (для art через cpo):** «История» icon в 49-glyph set §9 — есть или нужен новый? Не блокер, можно clock-icon как placeholder.

## Hand-off log

- 2026-05-01 · popanel → sa-panel: batch spec request (autonomous mandate). adr_required=true.
- 2026-05-01 · sa-panel → popanel: spec ready, dev-blocked-by-adr.
- 2026-05-01 · popanel → sa-panel: self-approved per autonomous mandate, status dev-blocked-by-adr.
- 2026-05-01 · popanel → tamd: ADR `ADR-NN-panel-audit-log-storage.md` requested (Payload versions vs audit_log table vs hybrid + retention).
