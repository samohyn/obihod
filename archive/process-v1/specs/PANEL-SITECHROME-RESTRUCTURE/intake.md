---
us: PANEL-SITECHROME-RESTRUCTURE
title: SiteChrome global — реструктуризация (anti-pattern «длинный скролл»)
team: panel
po: popanel
type: refactor
priority: P0
segment: admin
phase: spec
role: sa-panel
status: spec-draft
blocks: []
blocked_by: [PANEL-UX-AUDIT]
related: [PANEL-UX-AUDIT, US-2-cms-header-footer-globals, ADR-0002]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, frontend-patterns]
---

# Intake — PANEL-SITECHROME-RESTRUCTURE

## Skill activation

Реально активированы: `design-system`, `frontend-patterns`. Зафиксировано в `sa-panel.md`.

## Резюме запроса

`ux-panel` audit (PANEL-UX-AUDIT, секция «Globals (SeoSettings + SiteChrome)») фиксирует SiteChrome global = **405 строк config** в `site/globals/SiteChrome.ts`. Это уже **5 tabs внутри одного `tabs` field** (Header / Footer / Контакты / Реквизиты / Соцсети), но содержимое каждой tab — крупный nested group + несколько array-полей с inline factory `menuItemArrayField()`.

Anti-pattern из brand-guide §12.2 (admin organization patterns) — оператор скроллит длинные tab-контенты вместо быстрого targeting'а раздела. Реальная боль: при правке Header.menu пункта оператор листает мимо CTA group, потом вверх — find-by-eye вместо targeted access.

**Briefing говорит «405 строк config = anti-pattern»** — но при ближайшем рассмотрении 5 tabs уже есть. Реальная проблема:
- Header tab = 60 строк, OK
- Footer tab = 50 строк (slogan + columns × 4 × items × N) — **самая длинная**, drag-and-drop nested 3 уровня
- Contacts tab = 40 строк, OK
- Requisites tab = 70 строк (8 fields), OK на скролл
- Social tab = 30 строк, OK

**Реальный fix не split на коллекции**, а **внутренняя реструктуризация tabs**:
- Footer-колонки слишком глубокие → вынести `menuItemArrayField` в отдельную коллекцию `MenuItems` с relationship-field в SiteChrome.
- ИЛИ: разделить `Header` / `Footer` на отдельные tabs с подгруппами (header-menu / header-cta как внутренние tabs).

## Deliverables

1. **`sa-panel.md`** — спецификация:
   - decision: tabs-deeper vs split-collection (recommend tabs-deeper для P0, split-collection для Phase 2)
   - точный план реорганизации Footer tab (drag-deep уровень → 2 уровня max)
   - migration plan, если split (no migration для tabs-deeper)
   - ADR-NN если split-collection выбран

## Open questions (для PO/operator)

- Tabs-deeper (no migration) vs Split-collection (migration + new collection `MenuItems`) — operator approve по effort/risk?
- Отдельная коллекция `Menus` (Header.menu + Footer.columns[].items) — нужна сейчас или future-proofing?

## Hand-off log

- 2026-05-01 · popanel → sa-panel: writeup spec для P0 anti-pattern fix (effort 1.5 чд, ADR conditional).
