---
us: PANEL-CSS-PREFIX-CLEANUP
title: Удалить .payload__app prefix из W1 dead rules
team: panel
po: popanel
type: refactor
priority: C
segment: admin
phase: spec-approved
role: sa-panel
status: dev-ready
blocks: []
blocked_by: []
related: [US-12-admin-redesign-wave1, US-12-admin-redesign-wave9]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, frontend-patterns]
adr_required: false
---

# sa-panel — PANEL-CSS-PREFIX-CLEANUP

## Skill activation (фиксация)

- `design-system` — brand-guide §12 token namespace `--brand-obihod-*` остаётся inviolate; задача — структурный CSS cleanup, не token-rename.
- `frontend-patterns` — dead-code elimination, CSS specificity verification.

## Цель

Удалить мёртвые `.payload__app`-prefixed правила из `site/app/(payload)/custom.scss` (наследие Wave 1, не работающие в текущей Payload 3.84 shell-структуре или перекрытые W9 force-light theme overrides). Без visual regression по всему admin периметру.

## Acceptance Criteria

- **AC1 — Identification:** `fe-panel` делает `git grep "\.payload__app" site/app/(payload)/custom.scss` и для каждого селектора:
  - Открывает релевантный admin route в Playwright/dev browser.
  - Проверяет через DevTools, применяется ли правило (Computed tab → Filter `Show all`).
  - Классифицирует: `dead` (нет matched element) / `overridden` (matched, но `currentColor` или `--theme-elevation-*` от W9 побеждает) / `live` (используется).
  - Документирует решение per-rule в PR-описании.
- **AC2 — Removal:** `dead` и `overridden` правила удаляются. `live` правила остаются неизменными (не упрощаем префикс — risk specificity-shift, отдельная задача).
- **AC3 — Visual no-regression:** `qa-panel` делает screenshot diff на 5 routes до/после:
  - `/admin/login`
  - `/admin` (dashboard)
  - `/admin/collections/leads` (list-view, ≥1 row)
  - `/admin/collections/services` (list-view, EmptyState если 0 rows)
  - `/admin/collections/services/<id>` (edit-view с tabs)
  - Mobile-chrome viewport (375×667) для одного из routes (drawer open).
  - **Acceptance:** pixel diff < 1% на каждом route. Скриншоты в `screen/panel-css-cleanup-{route}-{before|after}.png`.
- **AC4 — A11y no-regression:** `pnpm test:e2e --project=chromium tests/e2e/admin-a11y.spec.ts` (W7 axe-core suite) все green.
- **AC5 — Tests + Evidence:** Все existing admin Playwright specs зелёные (`pnpm test:e2e --project=chromium tests/e2e/admin-*.spec.ts`). PR description содержит таблицу «Selector | Verdict (dead/overridden/live) | Action».

## Brand-guide §12 mapping

- **§12 admin** — token namespace `--brand-obihod-*` не трогаем; задача чисто структурная. Никаких новых tokens, никаких color/spacing-shifts.
- **§14 Don't** — не «улучшаем» соседний код (iron rule #3 «хирургические правки»).

## Архитектура / approach

Single-file change в `site/app/(payload)/custom.scss`. Никаких новых файлов, никаких новых stylesheets. Approach — pure deletion. PR diff читается визуально как `-N строк` без `+`-блоков (за исключением, возможно, обновлённого комментария-заголовка секции).

Sequence:
1. `fe-panel` готовит audit-таблицу (markdown в PR description).
2. Делает branch `panel/css-prefix-cleanup`, удаляет dead rules одним коммитом.
3. Локально гоняет `pnpm type-check && pnpm lint && pnpm test:e2e --project=chromium tests/e2e/admin-*.spec.ts` → all green.
4. PR open → `qa-panel` screenshot diff → `cr-panel` review → merge.

## Risks + mitigations

1. **False-positive «dead»** (правило срабатывает только в edge-случае: hover/focus/error-state) → Mitigation: AC3 включает hover/focus state в screenshot routes (qa-panel snapshot после `:hover` simulation); audit-таблица обязана покрывать все pseudo-states.
2. **Specificity shift** при удалении одного правила → каскад другого, ранее перекрытого → Mitigation: пиксельный diff < 1% на 5 routes ловит regression.
3. **Mobile drawer regression** (W6 mobile responsive) → Mitigation: AC3 mobile viewport включён в screenshot suite.
4. **Merge conflict с другими в работе panel PRs** → Mitigation: один атомарный PR в одном sitting, ребейз перед merge.
5. **Скрытое использование префикса в JSX/TSX** (className внутри custom компонентов W3-W9) → Mitigation: `git grep "payload__app" site/` (не только .scss); если есть match в .tsx — НЕ трогать соответствующее правило.

## Out-of-scope

- Полный rewrite `custom.scss` (375 строк W1) — premature, не в этом цикле.
- Rename token namespace `--brand-obihod-*` — отдельный ADR.
- BEM-rename / упрощение префиксов на live-правилах — отдельный refactor US.
- Migration на CSS modules / styled-components — стек-decision уровня tamd.

## Состав команды

- **sa-panel** (this) — verify protocol.
- **fe-panel** — audit + removal + local CI.
- **qa-panel** — screenshot diff + a11y suite.
- **cr-panel** — final review.

**НЕ нужны**: `tamd` (no architectural decision), `ux-panel` (no design change, visual diff = 0), `be-panel`, `dba`.

## Open questions

- ~~False-positive risk?~~ closed (mandatory visual smoke 5 routes + a11y suite).
- ~~Один PR или серия?~~ closed (один атомарный PR).

## Hand-off log

- 2026-05-01 · popanel → sa-panel: batch spec request (autonomous mandate, deferred US-12 W9 audit).
- 2026-05-01 · sa-panel → popanel: spec ready, ADR не нужен (cleanup), 0.5 чд effort consistent.
- 2026-05-01 · popanel → sa-panel: self-approved per autonomous mandate, status dev-ready.
