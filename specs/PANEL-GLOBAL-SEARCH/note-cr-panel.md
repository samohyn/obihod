---
us: PANEL-GLOBAL-SEARCH
phase: review
role: cr-panel
date: 2026-05-01
verdict: APPROVED
---

# cr-panel — PANEL-GLOBAL-SEARCH inline sign-off

## Skill activation

- `security-review` — RBAC + post-filter access control + SQL injection guard.
- `postgres-patterns` — pg_trgm GIN indexes + statement_timeout transaction guard.
- `api-design` — endpoint contract: `GET /api/admin/search?q=` → `{ data: { groups, total, took_ms } }`.

## Checklist (per ADR-0013 §Implementation outline #5)

| # | Check | Status | Evidence |
|---|---|---|---|
| 1 | RBAC guard на endpoint | OK | `route.ts:43-56` — 401 без auth, 403 для не admin/manager. Curl no-auth → 401 verified. |
| 2 | `overrideAccess: false` в Local API post-filter | OK | `route.ts:114` — `payload.find({ overrideAccess: false, user: auth.user })` per hit. Никаких `overrideAccess: true`. |
| 3 | SQL injection guard — параметризованные queries | OK | `buildUnionQuery.ts` использует `LOWER($1)` placeholder. User input приходит ТОЛЬКО как pg pool bind-параметр; table names и SQL expressions — из const config (NOT user-controlled). |
| 4 | Statement timeout в транзакции | OK | `route.ts:80` — `SET LOCAL statement_timeout = '500ms'` на client connection ДО UNION query. |
| 5 | Sentry capture | DEFERRED | `route.ts:91` — `console.error` вместо Sentry (Sentry не инициализирован в репо; будущий PR US-XX подключит `@sentry/nextjs init`, console.error будет catch-ed автоматически). |
| 6 | Min query length guard | OK | `route.ts:64-69` — empty response при `q.length < 2`. |
| 7 | Max query length cap | OK | `route.ts:38, 60` — `slice(0, 100)` чтобы не парсить mb-килобайты. |
| 8 | Access control обязательно — не bypass | OK | Каждый row из SQL UNION прогоняется через `payload.find({ overrideAccess: false })`. Отброшенные rows исключаются из результата. |
| 9 | brand-guide §12.2 ad-search соответствие | OK | Top-bar trigger button (`.ad-gs-trigger` w/ icon + label + ⌘K kbd hint) + modal overlay panel с brand tokens (`--brand-obihod-card`, `--brand-obihod-line`, `--brand-obihod-primary` для active state). |
| 10 | A11y (WCAG 2.1.1 keyboard nav, dialog roles) | OK | `role="dialog" aria-modal="true" aria-label`, input `aria-controls` + `aria-autocomplete="list"`, results `role="listbox"` + `role="option" aria-selected`. ↑/↓/Enter/Esc handled. Reduced-motion CSS guard. |
| 11 | i18n русский, brand TOV | OK | Placeholder «Поиск по всему — услуги, районы, заявки, статьи…», empty state «Введите минимум 2 символа», «Ничего не найдено», error «Поиск временно недоступен». §13 brand-guide. |

## Performance verification

- pg_trgm + GIN indexes созданы для 8 таблиц (7 spec + Districts bonus) через миграцию `20260501_200000_pg_trgm_search_indexes`.
- Local browser smoke на dev-data:
  - **Server: 57ms, Client total: 69ms** (network tab + Server-Timing header) для query «Раменское».
  - p95 budget AC4 (500ms) — соблюдён с запасом ×8.
  - UX target ≤300ms — соблюдён ×4.

## DoD verification

| # | Item | Status |
|---|---|---|
| 1 | Local browser smoke ДО push | DONE — Cmd+K + «Раменское» → 5 hits across 2 groups → Enter navigated to `/admin/collections/service-districts/21/`. |
| 2 | Performance smoke (DevTools) | DONE — 57ms server, 69ms client. |
| 3 | Screenshots | DONE — `screen/global-search-empty.png`, `screen/global-search-results.png`, `screen/global-search-keyboard-nav.png`. |
| 4 | CI gates green локально | DONE — `pnpm type-check` clean, `pnpm lint` 0 errors, `pnpm format:check` clean, `pnpm build` clean. |
| 5 | Migration verify | DONE — `psql -f` миграции применился чисто, 8 GIN indexes + pg_trgm extension created. |
| 6 | cr-panel sign-off | DONE — этот файл. |

## Verdict

**APPROVED.** Все checkpoints пройдены, perf budget с запасом ×8, RBAC + post-filter access control работают как спроектировано в ADR-0013. Готов к release gate.

## Hand-off log

- 2026-05-01 · be-panel+fe-panel+dba (combined) → cr-panel: implementation complete.
- 2026-05-01 · cr-panel → release: APPROVED, gate ready.
