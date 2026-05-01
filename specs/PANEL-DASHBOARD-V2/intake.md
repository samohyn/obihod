---
us: PANEL-DASHBOARD-V2
title: Кастомизируемый dashboard (drag-drop widgets)
team: panel
po: popanel
type: feature
priority: W
segment: admin
phase: spec-approved
role: sa-panel
status: dev-ready
blocks: []
blocked_by: []
related: [US-12-admin-redesign-wave3, PANEL-LEADS-INBOX, PANEL-AUDIT-LOG]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, api-design, product-capability]
adr_required: false
---

# Intake — PANEL-DASHBOARD-V2

## Skill activation

- `design-system` — brand-guide §12 dashboard patterns + §11 cards.
- `api-design` — `users.dashboardLayout` field schema + persistence API.
- `product-capability` — capability framing: оператор сам решает, какие виджеты видит на стартовом экране admin.

## Резюме запроса

Wave 3 (US-12) добавил виджет «Свежие правки» (стабилен в main с PR #100). Сейчас dashboard — статичный набор виджетов в фиксированном порядке. Цель — drag-drop reorder + show/hide + (Phase 2) widget config, с persistence на per-user level.

**Priority: W (Won't этот цикл)** per backlog.md. Spec пишем сейчас (autonomous mandate), но dev queueing — после очереди M/S/C.

## Initial widget catalog

1. **«Свежие правки»** — recent edits across collections (W3, существует, PR #100).
2. **«Новые лиды»** — Leads с `status: new` за последние 24h (paired с PANEL-LEADS-INBOX badge).
3. **«SEO health»** — services без published_at (sitemap gap).
4. **«Storage»** — total media size + orphan count (paired с PANEL-MEDIA-LIBRARY).
5. **«Активность за неделю»** — chart create/update events (paired с PANEL-AUDIT-LOG).

Phase 1 — show/hide + reorder только. Phase 2 — config (widget params, например «Новые лиды за 24h vs 7d»).

## Persistence

`users` collection extended: `dashboardLayout: { widgetIds: string[], hiddenIds: string[] }` JSON field. Per-user (admin operator может видеть свой layout).

## Tech notes

- **Drag-drop:** не вводим тяжёлый dnd-kit для одного flow; используем native HTML5 drag API + minimal CSS. Альтернатива — `react-grid-layout` (но это lib для тяжёлых dashboards, premature). Sub-task fe-panel.
- **Widget registry:** static registry в `site/app/(payload)/admin/dashboard/widgets.ts` — array `{id, title, icon, render, defaultEnabled}`. Новые виджеты — PR в этот файл.
- **Persistence API:** `PATCH /api/users/<me>` (Payload native) с body `{dashboardLayout: {...}}`. Existing API, no new endpoint.

## Deliverables

1. `sa-panel.md` (этот) — capability + AC + widget registry contract.
2. `be-panel` — `users.dashboardLayout` field + RBAC (user editing own layout only, не других users).
3. `fe-panel` — drag-drop UI + widget registry + 5 initial widgets (3 переиспользуют existing data: W3 «Свежие правки», LEADS-INBOX, MEDIA-LIBRARY orphan count).
4. `qa-panel` — Playwright: drag widget → reload → layout сохранился.

## Open questions

- ~~Drag-drop lib vs native?~~ — **closed** (PO default): native HTML5 drag API; `react-grid-layout` если native не вытянет responsive — Phase 2 escalation.
- ~~Phase 1 scope?~~ — **closed** (PO default): show/hide + reorder. Widget config — Phase 2.
- ~~Per-user or global layout?~~ — **closed** (PO default): per-user (на будущий multi-user mode).
- ~~Что делать если widget существует в layout, но registry удалён (deprecated widget)?~~ — **closed** (PO default): silently skip, лог warning в Sentry.

## Hand-off log

- 2026-05-01 · popanel → sa-panel: batch spec request (autonomous mandate). Priority W — spec пишем впрок.
- 2026-05-01 · sa-panel → popanel: spec ready, dev-ready (queueable когда M/S/C закроются).
- 2026-05-01 · popanel → sa-panel: self-approved per autonomous mandate, status dev-ready (priority W — пойдёт в очередь после остальных).
