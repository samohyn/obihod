---
us: PANEL-EMPTY-LIST-WIRING
title: EmptyState wiring в list-view коллекций (Cases / Blog / Authors / B2BPages)
team: panel
po: popanel
type: feature
priority: P1
segment: admin
phase: spec
role: sa-panel
status: spec-draft
blocks: []
blocked_by: [PANEL-UX-AUDIT]
related: [PANEL-UX-AUDIT, US-12-W5, ADR-0010]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, frontend-patterns]
---

# Intake — PANEL-EMPTY-LIST-WIRING

## Skill activation

Реально активированы: `design-system`, `frontend-patterns`. Зафиксировано в `sa-panel.md`.

## Резюме запроса

`ux-panel` audit (PANEL-UX-AUDIT, секция «Кейсы (cases)») выявил: компонент `site/components/admin/EmptyErrorStates.tsx` (W5 part 1) **существует** и экспортирует `EmptyState / ErrorState / ForbiddenState`, но **не wired** в list-view конкретных коллекций. Когда коллекция пустая (например, новая инсталляция, нет ни одного `Case`) — оператор видит дефолтный пустой Payload-table вместо §12.6 EmptyState с CTA «+ Добавить».

**Контекст ADR-0010**: Payload 3.84 не имеет публичного `views.list.Empty/Loading` API. Обходим через **custom List view component** (`admin.components.views.list`), который оборачивает default ListView и conditionally рендерит EmptyState при `docs.length === 0`.

Reach: оператор видит empty list 1 раз на коллекцию (после первой записи — больше никогда). Но это **первый user touch** при онбординге → high impact на восприятие admin.

## Deliverables

1. **`sa-panel.md`** — спецификация:
   - список коллекций в scope (priority): `Cases`, `Blog`, опционально `Authors`, `B2BPages`
   - паттерн custom-view wrapper (preserve native sort/filter/pagination при docs > 0)
   - copy для каждой коллекции (heading + text + CTA label)
   - AC + screenshot evidence

## Open questions (для PO/operator)

- Authors / B2BPages — в scope текущего US или отдельный follow-up?
- EmptyState показывать только при `docs.length === 0` без filters, или и при пустых результатах фильтра тоже? (sa-panel рекомендует: только при no docs at all; «no results from filter» — отдельный паттерн).

## Hand-off log

- 2026-05-01 · popanel → sa-panel: writeup spec для P1 wiring (effort 0.7 чд, no ADR — referenced ADR-0010).
