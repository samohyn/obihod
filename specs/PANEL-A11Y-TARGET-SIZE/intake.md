---
us: PANEL-A11Y-TARGET-SIZE
title: Row-action touch targets ≥44×44 + re-enable axe target-size
team: panel
po: popanel
type: bug
priority: P0
segment: admin
phase: spec
role: sa-panel
status: spec-draft
blocks: []
blocked_by: [PANEL-UX-AUDIT]
related: [PANEL-UX-AUDIT, US-12-W6, US-12-W7, US-12-W9]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, frontend-patterns, accessibility]
---

# Intake — PANEL-A11Y-TARGET-SIZE

## Skill activation

Реально активированы: `design-system`, `frontend-patterns`, `accessibility`. Зафиксировано в `sa-panel.md`.

## Резюме запроса

`ux-panel` audit (PANEL-UX-AUDIT, `note-uxpanel.md`) выявил: row-action touch targets (edit-pencil, 3-dot kebab, delete) в Payload list-view имеют размер <44×44 на mobile (≤1024px). Это нарушает **WCAG 2.5.5 (Target Size, AA)**.

W7 admin-a11y axe-core spec (`tests/e2e/admin-a11y.spec.ts:36-40`) **отключил `target-size` rule** с комментарием «Payload native row-action icons …framework constraint» — но это технический долг, не permanent solution. CSS @media (max-width: 1024px) в `custom.scss:599-625` покрывает `.btn`, `[type="button"]`, links и tab triggers, но **не row-icons** (specific class selectors с inline width/height).

Оператор использует list-view ежедневно (>10 раз/день). На mobile/tablet promise blackout — actual blocker для оператора в полевых условиях.

## Deliverables

1. **`sa-panel.md`** — спецификация:
   - аудит row-action selectors в Payload list-view (которые сейчас <44×44)
   - CSS rules для touch-target 44×44 без визуального увеличения иконок (padding-вокруг, не размер SVG)
   - стратегия re-enable `target-size` в axe baseline
   - проверка: W6 mobile rules не сломались (regression на desktop hover targets)

## Open questions (для PO/operator)

- Достаточно ли CSS-only решения, или нужно правки JSX через `admin.components.cells` Payload? (sa-panel research → answer)
- Real-device smoke (iPhone Safari + Android Chrome) — leadqa или qa-panel?

## Hand-off log

- 2026-05-01 · popanel → sa-panel: writeup spec для P0 a11y patch (effort 0.5 чд, no ADR).
