---
us: PANEL-GLOBAL-SEARCH
title: Top-bar global search across 7 коллекций
team: panel
po: popanel
type: feature
priority: C
segment: admin
phase: spec-approved
role: sa-panel
status: dev-blocked-by-adr
blocks: []
blocked_by: [ADR-PANEL-GLOBAL-SEARCH-PERFORMANCE]
related: [PANEL-DASHBOARD-V2, US-12-admin-redesign]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, api-design, product-capability]
adr_required: true
---

# Intake — PANEL-GLOBAL-SEARCH

## Skill activation

Активированы: `design-system` (§12.2 mockup line 3016 — top-bar search slot), `api-design` (REST aggregation contract), `product-capability` (capability framing для cross-collection search).

## Резюме запроса

Brand-guide §12.2 (admin v2 mockup line ~3016) включает top-bar slot «Поиск по всему», но текущая prod-реализация admin его не имеет. Оператор для поиска лида/услуги/района/блог-поста делает 3-5 кликов: открыть Sidebar group → выбрать collection → ввести фильтр в list-view. Вместо этого должен быть один input в top-bar, который ищет по 7 коллекциям одновременно (Leads / Services / ServiceDistricts / Cases / Blog / Pages / Persons), показывает grouped results dropdown с кликабельными deep-links на edit-view.

## Похожие реализации в repo

- **W3 PageCatalog** (`specs/US-12-admin-redesign/sa-panel-wave3.md`) — single-collection search через client-side `useDebounce`. Pattern переиспользуем, но scope расширяется на multi-collection aggregation.
- W3 `LeadsBadge` — REST `/api/admin/leads/count` pattern для top-bar widget (precedent для top-bar API endpoint).

## Performance risk

Payload Local API не имеет нативного multi-collection full-text search. Approach options:
1. **Sequential Local API calls** — 7 × `payload.find({collection, where})` параллельно через `Promise.all`. Простой, но N+1 в худшем случае.
2. **PostgreSQL `pg_trgm` или `tsvector` views** — single SQL union query поверх 7 таблиц. Performant, но cross-collection schema invariants поверх Payload-схемы (миграция).
3. **Внешний search index (Meilisearch / Typesense)** — overkill для админа single-tenant.

**Решение требует ADR от tamd** (`ADR-PANEL-GLOBAL-SEARCH-PERFORMANCE`). Без ADR — dev-blocked.

## Deliverables

1. `sa-panel.md` (этот) — capability + AC + контракт endpoint + UI spec.
2. `tamd` пишет `ADR-NN-panel-global-search-performance.md` — выбор approach (1/2/3) + p95 budget + schema contract.
3. После ADR-approve — be-panel + fe-panel реализуют.

## Open questions

- ~~Какие коллекции включаются?~~ — **closed** (PO default): 7 — Leads, Services, ServiceDistricts, Cases, Blog, Pages, Persons (исключаем `media`, `users`, globals).
- ~~Минимальная длина query?~~ — **closed** (PO default): 2 символа (для Leads phone-search), debounce 300ms.
- ~~Open в keyboard shortcut?~~ — **closed** (PO default): `Cmd/Ctrl+K`.

## Hand-off log

- 2026-05-01 · popanel → sa-panel: batch spec request (autonomous mandate). adr_required=true (tamd pulled in).
- 2026-05-01 · sa-panel → popanel: spec ready, dev-blocked-by-adr. tamd handoff: ADR на performance approach.
- 2026-05-01 · popanel → sa-panel: self-approved per autonomous mandate, status dev-blocked-by-adr (ADR clearance прежде dev queueing).
- 2026-05-01 · popanel → tamd: ADR request sent (PERF strategy для multi-collection search).
