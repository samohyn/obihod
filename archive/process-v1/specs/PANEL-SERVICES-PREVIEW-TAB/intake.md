---
us: PANEL-SERVICES-PREVIEW-TAB
title: Services edit-view — tab «Превью» (live preview публичной страницы)
team: panel
po: popanel
type: feature
priority: P0
segment: admin
phase: spec
role: sa-panel
status: spec-draft
blocks: []
blocked_by: [PANEL-UX-AUDIT]
related: [PANEL-UX-AUDIT, US-12-W4]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, frontend-patterns]
---

# Intake — PANEL-SERVICES-PREVIEW-TAB

## Skill activation

Реально активированы: `design-system`, `frontend-patterns`. Зафиксировано в `sa-panel.md`.

## Резюме запроса

`ux-panel` audit (PANEL-UX-AUDIT) обнаружил: **brand-guide §12.4 mockup (line 3080-3086)** показывает 6 tabs в Services edit-view с финальной tab «**Превью**». В коде `site/collections/Services.ts:18-264` tabs: `Основные / Контент / Sub-услуги / FAQ / SEO / Связи` — 6 штук, но **«Превью» отсутствует**, вместо неё «Связи» (related-services list).

Daily-use оператора: «обновил цену → проверил на сайте» (1-2 раза в день). Сейчас оператор: save → open new tab → копировать `/uslugi/<slug>/` → paste → reload. ≥4 кликов + переключение tab контекста. С «Превью» — 1 клик.

## Deliverables

1. **`sa-panel.md`** — спецификация:
   - выбор подхода (iframe inline / top-bar button / hybrid)
   - decision: «Связи» сохраняем или мерджим с «Sub-услуги»?
   - draft preview через Payload `preview` API vs hard `/uslugi/<slug>` route
   - AC + screenshot evidence + UX states (saved doc / unsaved / draft)

## Open questions (для PO/operator)

- Approach A (iframe inline) vs B (top-bar button → new tab) vs C (split-view) — sa-panel рекомендует, popanel choose.
- «Связи» tab — оставить или удалить (контент дублирует Sub-услуги field group)?
- Live preview в iframe — может ли отображать draft (autosave 2000ms) или только published?

## Hand-off log

- 2026-05-01 · popanel → sa-panel: writeup spec для P0 daily-use feature (effort 1 чд, ADR conditional).
