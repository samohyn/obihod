---
us: PANEL-RSC-LINT
title: RSC border lint — prevent server-props spread в client component
team: panel
po: popanel
type: tooling
priority: S
segment: admin
phase: spec-approved
role: sa-panel
status: dev-ready
related: [US-12-retro, ADR-0015, PANEL-EMPTY-LIST-WIRING-RSC-FIX]
created: 2026-05-01
updated: 2026-05-01
---

# PANEL-RSC-LINT — intake

## Контекст

cpo retro US-12 (Lessons L2): incident RC-2 BLOCK на PR #120 PANEL-EMPTY-LIST-WIRING — `CollectionListWithEmpty.tsx` (server component) спредил Payload server props (с функциями `access`) в `<DefaultListView>` (client component) → 500 error на коллекциях с docs. Type-check OK, lint OK, format OK, build OK — runtime fail.

Memory `feedback_leadqa_must_browser_smoke_before_push` (2026-04-28) уже задокументировала аналогичный pattern, но как организационное правило не помешала повтору.

**Решение:** ADR-0015 (Accepted 2026-05-01 popanel autonomous mandate) — defense-in-depth tooling: type guard `pickClientProps()` + custom ESLint rule `obikhod/no-spread-server-props-in-client` + Playwright CI gate на коллекциях с `totalDocs > 0`.

## Spec

См. [sa-panel.md](sa-panel.md) — implementation plan на базе ADR-0015.
