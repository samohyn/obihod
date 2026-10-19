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
status: dev-blocked-by-adr
blocks: []
blocked_by: [ADR-PANEL-AUDIT-LOG-STORAGE]
related: [PANEL-BULK-PUBLISH, PANEL-AUTH-2FA]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, api-design, hexagonal-architecture, product-capability]
adr_required: true
---

# Intake — PANEL-AUDIT-LOG

## Skill activation

- `design-system` — brand-guide §12 admin diff-view + sidebar entry «История».
- `api-design` — versions API contract (GET /<collection>/<id>/versions).
- `hexagonal-architecture` — audit-log как cross-cutting capability (port над storage adapter).
- `product-capability` — capability framing: оператор должен видеть «кто опубликовал лида в "Перезвонить"», «кто изменил metaTitle услуги».

## Резюме запроса

Сейчас Payload 3 имеет встроенный `versions` mechanism (per-collection `versions: { drafts: true }`) — каждое изменение сохраняется как version. Однако:
1. Versions хранятся per-collection в `<collection>_versions` table — нет единой timeline.
2. `users` reference (`user`) сохраняется автоматически.
3. Diff view нативно НЕ предоставляется — нужна custom view.
4. Globals (SiteChrome, SeoSettings) отдельный механизм versioning.

Альтернатива — собственная `audit_log` table с unified schema:
```
audit_log (id, user_id, collection, doc_id, action, diff_json, created_at, ip, user_agent)
```
Позволяет cross-collection timeline, но дублирует Payload native механизм.

**Storage strategy ADR обязательна** (от tamd) — без неё dev не стартует. Варианты:
1. Pure Payload `versions` + custom diff-view UI поверх (минимальные миграции).
2. Custom `audit_log` table параллельно с versions (unified timeline, дублирует storage).
3. Hybrid: Payload versions для content, audit_log для security events (login, RBAC change, bulk-action).

## Целевые collections для audit (все):

Cases, Blog, Services, ServiceDistricts, Pages, Persons, Leads, Users, SiteChrome, SeoSettings.

## Целевые actions для audit:

create / update / delete / publish / unpublish / archive / login / logout / bulk-action / RBAC change.

## Deliverables

1. `sa-panel.md` (этот) — capability + AC + UI spec + fields contract.
2. `tamd` пишет `ADR-NN-panel-audit-log-storage.md` — strategy 1/2/3 + retention policy.
3. `dba` ревью миграции (если ADR-2 или ADR-3 — `audit_log` table).
4. После ADR-approve — be-panel + fe-panel.

## Open questions

- ~~Все коллекции?~~ — **closed** (PO default): YES, все 10.
- ~~Включая Leads (PII)?~~ — **closed** (PO default): YES, но diff PII полей (phone/email) маскируется в UI («***-**-89»).
- ~~Retention policy?~~ — **deferred to ADR (tamd):** infinite vs 90 дней vs configurable.
- ~~Diff format (JSON / side-by-side / inline)?~~ — **closed** (PO default): side-by-side, brand-guide diff colors.

## Hand-off log

- 2026-05-01 · popanel → sa-panel: batch spec request (autonomous mandate). adr_required=true (tamd для storage strategy).
- 2026-05-01 · sa-panel → popanel: spec ready, dev-blocked-by-adr.
- 2026-05-01 · popanel → sa-panel: self-approved per autonomous mandate, status dev-blocked-by-adr.
- 2026-05-01 · popanel → tamd: ADR request `ADR-NN-panel-audit-log-storage.md` queued.
