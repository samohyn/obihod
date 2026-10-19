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
status: dev-ready
blocks: []
blocked_by: []
adr: ADR-0013 (Accepted 2026-05-01 by popanel autonomous mandate) — pg_trgm UNION ALL + post-filter access control
related: [PANEL-DASHBOARD-V2, US-12-admin-redesign-wave3]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, api-design, product-capability]
adr_required: true
---

# sa-panel — PANEL-GLOBAL-SEARCH

## Skill activation (фиксация)

- `design-system` — brand-guide §12.2 admin top-bar mockup (~line 3016) + §11 results-list pattern.
- `api-design` — REST endpoint `GET /api/admin/search` контракт (query params, response shape, pagination, error codes).
- `product-capability` — capability framing: admin operator должен 1-input открыть 7 коллекций без context switch.

## Цель

Один input в top-bar `/admin` ищет совпадения по 7 коллекциям, показывает grouped dropdown с deep-links на edit-view. Заменяет цепочку «Sidebar → Collection → list-view filter» на одно действие.

## Acceptance Criteria

- **AC1 — UI:** В `<TopBar>` admin (mockup §12.2) есть input с placeholder «Поиск по всему», ширина растяжимая, иконка-лупа слева, `Cmd/Ctrl+K` открывает фокус. Реализация — fe-panel custom component зарегистрирован через `admin.components.beforeNavLinks` или `admin.components.actions` (зависит от Payload 3.84 slot — research в dev).
- **AC2 — Endpoint:** `GET /api/admin/search?q=<str>&limit=10` возвращает JSON `{ groups: [{collection, label, hits: [{id, title, subtitle, url}]}], total, took_ms }`. RBAC: эндпоинт за `req.user` гвардом (admin only). Min query length = 2; пустой ответ при `q.length < 2`.
- **AC3 — Coverage:** Поиск по 7 коллекциям с конкретными полями:
  - `Leads` → `customer_phone`, `customer_name`
  - `Services` → `title`, `slug`
  - `ServiceDistricts` → `title` (composite service+district)
  - `Cases` → `title`, `slug`
  - `Blog` → `title`, `slug`
  - `Pages` → `title`, `slug`
  - `Persons` → `name`
- **AC4 — Performance:** p95 < 500ms на dev-data (10k Leads, 100 Services, 200 Districts, 50 Cases/Blog, 30 Pages, 20 Persons). Будет доуточнён в ADR.
- **AC5 — A11y + UX states:** Empty state «Ничего не найдено» (после 300ms debounce + ≥2 chars). Loading state — skeleton row × 3. Error state — toast «Поиск временно недоступен» + Sentry capture. Keyboard nav `↑/↓/Enter/Esc` — WCAG 2.1.1.
- **AC6 — Tests:** Playwright e2e — `Cmd+K → ввести "Иван" → видим groups Leads + Persons → Enter → редирект на edit-view первого hit`.

## Brand-guide §12 mapping

- **§12.2 admin organization** — top-bar global search slot, mockup line ~3016.
- **§11 lists/notifications** — results dropdown следует token'ам `--brand-obihod-bg-elevated`, `--brand-obihod-divider`, hover `--brand-obihod-bg-muted`.
- **§12.4 interaction states** — input states (rest / focus-visible / has-value / disabled), result rows (hover / active / keyboard-focused).
- **§13 TOV** — placeholder «Поиск по всему», empty state «Ничего не найдено» (без жаргона, по brand-guide).

## Архитектура / approach

**Endpoint:** Next.js API route `site/app/(payload)/api/admin/search/route.ts` (паттерн из PR #100 `/api/admin/leads/count`). Внутри — Payload Local API `payload.find()` per collection, агрегация. Конкретный approach (sequential `Promise.all` vs `pg_trgm` vs `tsvector` view) — выбирает `tamd` в ADR. Endpoint contract стабилен независимо от внутренней реализации.

**Frontend:** Custom React component `<GlobalSearch>` зарегистрирован в `payload.config.ts` под `admin.components.actions` (или эквивалент slot). Local state (`q`, `results`, `loading`), `useDebounce(300)`, fetch через `qs-esm`. Re-используем PageCatalog UX pattern (W3) — расширенный на grouped results.

## Risks + mitigations

1. **PERF risk (multi-collection N+1)** → ADR от tamd выбирает strategy; budget зашит в AC4; load-test в qa-panel.
2. **Slot availability в Payload 3.84** — `admin.components.actions` может не давать top-bar placement → fallback на BeforeNavLinks (sidebar header) или injection через CSS portal. Research в dev (sub-task fe-panel).
3. **RBAC bypass** — admin-only endpoint обязан проверить `req.user?.collection === 'users'`; иначе 401. Cr-panel review.
4. **Search relevance** — простой `LIKE %q%` достаточен на MVP; ranking deferred (не AC).
5. **i18n** — поля русскоязычные, query — кириллица. Postgres `LOWER()` + `unaccent` если ADR-2 (pg_trgm). Не блокер MVP.

## Out-of-scope

- Полнотекстовый search engine (Meilisearch / Typesense) — premature.
- Search analytics / popular queries — отдельный US.
- Saved searches / search history — отдельный US.
- Поиск внутри `media` / `users` / globals — исключено по PO default.
- Faceted filters в dropdown — оператор уходит в list-view для filtering.

## Состав команды

- **sa-panel** (this) — spec + endpoint contract.
- **tamd** — ADR-NN performance strategy (BLOCKER).
- **be-panel** — endpoint implementation после ADR.
- **fe-panel** — `<GlobalSearch>` component + slot wiring.
- **qa-panel** — Playwright e2e + load-test (10k Leads).
- **ux-panel** — visual review §12.2 mockup parity.
- **cr-panel** — final review (RBAC + perf budget verify).

## Open questions

- ~~Какие коллекции?~~ closed (PO default — 7).
- ~~Min query length?~~ closed (PO default — 2 chars).
- ~~Hotkey?~~ closed (PO default — `Cmd/Ctrl+K`).
- **Open (для tamd ADR):** strategy 1 (sequential Local API) vs 2 (pg_trgm view) vs 3 (внешний index). Не блокирует AC, блокирует dev start.

## Hand-off log

- 2026-05-01 · popanel → sa-panel: batch spec request (autonomous mandate).
- 2026-05-01 · sa-panel → popanel: spec ready, dev-blocked-by-adr (tamd ADR на perf strategy).
- 2026-05-01 · popanel → sa-panel: self-approved per autonomous mandate, status dev-blocked-by-adr.
- 2026-05-01 · popanel → tamd: ADR request `ADR-NN-panel-global-search-performance.md` queued.
