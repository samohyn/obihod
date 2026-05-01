---
us: PANEL-AXE-PAYLOAD-CORE-A11Y
title: Row-checkbox accessible name (Payload native, list-view, all collections)
team: panel
po: popanel
type: a11y-fix
priority: S
segment: admin
phase: spec-approved
role: sa-panel
status: dev-ready
blocks: []
blocked_by: []
related: [US-12-retro, leadqa-RC-3-hotfix, PANEL-A11Y-TARGET-SIZE]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, accessibility]
---

# Intake — PANEL-AXE-PAYLOAD-CORE-A11Y

## Skill activation

Реально активированы: `design-system`, `accessibility`. Зафиксировано в `sa-panel.md` и в commit-сообщении при merge.

## Резюме запроса

`leadqa-RC-3-hotfix.md` § Findings F1 (carry-over из RC-2 baseline) зафиксировал
**1 critical axe violation** — Payload native row-checkbox в list-view
(`<input type="checkbox" id="_R_…" class="checkbox-input__input">`) **без
accessible name** (нет `aria-label`, нет `<label>`, нет `aria-labelledby`).
4 nodes на коллекцию Cases (1 row-checkbox в каждой строке × 4 docs); те же
nodes присутствуют на Blog, Services, Leads, Authors и любой коллекции
с docs.

Это **Payload core debt** — не введён US-12, существует во всех list-views.
Не блокировал релиз (operator approve по leadqa-RC-3 уже получен), но
нарушает WCAG 2.2 SC 4.1.2 Name/Role/Value (Level A) и SC 1.3.1 Info and
Relationships для screen-reader пользователей.

cpo retro US-12 поставил RICE = 16.8, priority **S** (Should, не Must),
эффорт **0.5 чд** для local override.

## Decision (popanel, autonomous mandate 2026-05-01)

**Local CSS / DOM override через `custom.scss` либо JSX shim** (~0.5 чд) для
немедленного fix. Upstream PR в `payloadcms/payload` — отдельный optional
follow-up (`PANEL-AXE-PAYLOAD-CORE-A11Y-UPSTREAM`), если оператор позже
решит contribute upstream; out-of-scope для этого spec'а.

Rationale выбора local-override:
- Immediate value: 1 critical violation закрывается за 0.5 чд vs 2-3 чд на
  upstream + 2-4 недели review cycle.
- Низкий риск: scope = 1 visually-hidden label, no Payload core changes,
  rollback в 1 commit revert.
- A11y baseline для следующих RC: после fix axe `target-name` rule можно
  оставить enabled (вместо exception), что даёт регрессионную защиту.

## Deliverables

1. **`sa-panel.md`** — спецификация:
   - Approach: CSS pseudo-element `::before` с visually-hidden label vs
     JS injection через `admin.components.providers` (single useEffect)
     vs Payload custom Cell component override — выбор + rationale.
   - 3 AC: accessible name, axe rule pass, no visual regression
     (touch-target 44×44 из PANEL-A11Y-TARGET-SIZE сохранён).
   - §-mapping (brand-guide §12.5 status/checkbox states, §5 Contrast for
     focus-visible).
   - Risks (Payload re-render, i18n hardcode RU, axe noise from nested
     widgets), out-of-scope (upstream PR, full a11y audit, bulk-actions).

## Open questions (для PO/operator)

- Все resolved популятельно (CSS-first preferred), новых нет — popanel
  self-approved per iron rule #7 (autonomous mandate, scope внутри одной
  команды panel, бизнес-решение оператора зафиксировано в US-12 retro RICE).

## Hand-off log

- 2026-05-01 · cpo → popanel: follow-up из US-12 retro § L1, RICE 16.8, S.
- 2026-05-01 · popanel → sa-panel: writeup spec для local override (CSS-first),
  effort 0.5 чд, no ADR.
- 2026-05-01 · sa-panel → popanel: spec-approved готов, AC1-AC3 + approach
  decision + risks + §-mapping. Ready to dispatch fe-panel + qa-panel.
- 2026-05-01 · popanel → popanel: self-approved (autonomous mandate, iron
  rule #7, scope = 1 файл custom.scss или 1 small admin.components shim,
  внутри panel, no cross-team).
