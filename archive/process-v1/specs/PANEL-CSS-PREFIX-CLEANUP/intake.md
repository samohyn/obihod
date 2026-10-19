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

# Intake — PANEL-CSS-PREFIX-CLEANUP

## Skill activation

- `design-system` — verify visual no-regression поверх brand-guide §12 admin tokens.
- `frontend-patterns` — CSS specificity / dead-code elimination patterns.

## Резюме запроса

В US-12 Wave 1 (PR закрыт 2026-04-27) `site/app/(payload)/custom.scss` использовал префикс `.payload__app` для скоупинга стилей внутри Payload admin shell. После Wave 9 (force-light theme + theme-elevation overrides, PR #110 MERGED 2026-04-30) ряд правил с этим префиксом стали dead — родительский селектор не срабатывает в актуальном Payload 3.84 (изменилась shell-структура), либо правило перекрыто более специфичным `:root[data-theme]`.

Audit deferred в `specs/US-12-admin-redesign/sa-panel-wave9.md` (не делали в W9 — фокус был на theme-elevation). Сейчас закрываем как cleanup-задачу.

## Цель

Удалить dead `.payload__app`-prefixed правила из `custom.scss`. Обеспечить visual no-regression во всём admin (login + 7 коллекций + edit-views + mobile drawer + a11y axe routes из W7).

## Deliverables

1. `sa-panel.md` (этот) — AC + verify protocol.
2. `fe-panel` — git-grep `.payload__app` в `site/app/(payload)/custom.scss`, для каждого правила:
   - Проверить, что родительский селектор существует в актуальном DOM Payload 3.84.
   - Если правило мёртвое (нет совпадений в DOM или перекрыто) — удалить.
   - Если правило живое, но префикс лишний — упростить (без префикса).
3. `cr-panel` — diff review + visual smoke.
4. `qa-panel` — playwright `tests/e2e/admin-*.spec.ts` все green + screenshot diff.

## Open questions

- ~~Возможны ли false-positive «dead» правила?~~ — **closed** (PO default): обязательная visual smoke по 5+ routes (login, /admin, /admin/collections/leads, /admin/collections/services, /admin/collections/services/<id>, mobile-chrome viewport) до и после.
- ~~Правки в одном PR или серией?~~ — **closed** (PO default): один PR, иначе risk merge conflicts с в работе PRs.

## Hand-off log

- 2026-05-01 · popanel → sa-panel: batch spec request (autonomous mandate, deferred US-12 W9 audit).
- 2026-05-01 · sa-panel → popanel: spec ready, dev-ready (cleanup, ADR не нужен).
- 2026-05-01 · popanel → sa-panel: self-approved per autonomous mandate, status dev-ready.
