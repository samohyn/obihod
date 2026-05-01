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

# sa-panel — PANEL-SITECHROME-RESTRUCTURE

## Skill activation (фиксация)

- `design-system` — brand-guide §12.2 admin organization patterns (sidebar groups, tabs depth), §12.4 tab states (длинная tab-навигация перегружает horizontal scan).
- `frontend-patterns` — config decomposition, factory functions, separation of concerns в Payload `tabs` field.

## Контекст

`SiteChrome.ts:1-405` — единый global для «рамки сайта» (header + footer + контакты + реквизиты + соцсети). Создан в US-2 (ADR-0002), содержит 5 tabs:

| Tab | Lines | Сложность | Drag-deep |
|---|---|---|---|
| Header | 152-213 (~62) | medium | 1 (menu items) |
| Footer | 215-257 (~43) | high | 3 (columns → items → kind/anchor/route/url) |
| Контакты | 259-298 (~40) | low | 0 |
| Реквизиты | 300-365 (~65) | low | 0 (8 flat fields) |
| Соцсети | 367-401 (~35) | low | 1 (array) |

**Real anti-pattern не «405 строк» (5 tabs spread weight = ~80 lines/tab — приемлемо)**, а:

1. **Footer tab — 3-уровневая вложенность** (`columns[].items[].{kind/anchor/route/url}`). Оператор для редактирования одного menu-item делает ≥4 клика-дрилла в drawer.
2. **`menuItemArrayField()` factory** дублируется в `header.menu` и `footer.columns[].items`. Если меняется shape (добавляем kind=tel: или kind=mailto:) — два места.
3. **Реквизиты** — 8 плоских полей, могут быть сгруппированы в подсекции (Юрлицо / Адрес / ...).

## Approach Decision

**3 альтернативы:**

| Вариант | Описание | Migration? | Effort | Risk |
|---|---|---|---|---|
| **A · tabs-deeper (preferred P0)** | Footer tab разбивается на 2 sub-tabs внутри (Slogan & Links / Legal); Реквизиты — на 2 sub-groups (Юрлицо / Адрес); MenuItems factory упрощается | NO | 0.5-1 чд | LOW |
| **B · split-collection `MenuItems`** | `header.menu` + `footer.columns[].items` → relationship на новую коллекцию `MenuItems`. SiteChrome держит только metadata + relationship arrays | YES (data migration script) | 1.5-2 чд | MEDIUM |
| C · split на 2 globals (`SiteHeader` / `SiteFooter`) | `SiteChrome` распадается; SeoSettings.organization references | YES + переименование refs | 2-3 чд | HIGH (ADR-0002 нарушается) |

**Sa-panel рекомендация — A для P0 этого US, B как future-proofing follow-up.**

**Reasoning:**
- A — нулевой schema-impact (Payload `tabs` UI-only при unnamed tabs, как в Services). Migration не нужна. Сразу решает operator pain.
- B — стоит делать, **когда** появится третий потребитель `MenuItems` (например, mega-menu в US-11 IA-extension). Сейчас два потребителя — premature.
- C — нарушает ADR-0002 («единый source of truth для рамки сайта»), не делаем без re-write ADR.

## Acceptance Criteria

### AC1 · Footer tab restructure (be-panel)

- [ ] В `site/globals/SiteChrome.ts` Footer tab переделана:

```ts
{
  label: 'Footer',
  fields: [
    {
      type: 'tabs',  // вложенный tabs внутри tab Footer
      tabs: [
        {
          label: 'Контент',
          fields: [
            { name: 'footer.slogan', type: 'textarea', maxLength: 200 },
            // columns array остаётся, но labels: Колонка / Пункты явно описаны
          ]
        },
        {
          label: 'Юридические ссылки',
          fields: [
            { name: 'footer.privacyUrl', ... },
            { name: 'footer.ofertaUrl', ... },
            { name: 'footer.copyrightPrefix', ... },
          ]
        }
      ]
    }
  ]
}
```

**ВАЖНО**: Payload group `footer.*` сохраняет dot-path (no schema migration). Sub-tabs UI-only (unnamed).

- [ ] **Альтернатива** (если nested tabs не работают на Payload 3.84 group field): использовать `collapsible` блоки внутри Footer tab вместо sub-tabs. Sub-tasks 1.1 — research fe-panel.

### AC2 · Requisites grouping (be-panel)

- [ ] Tab «Реквизиты» — collapsible-блоки:
  - **Юридическое лицо** (open by default): `legalName`, `taxId`, `kpp`, `ogrn`
  - **Адрес** (open by default): `addressRegion`, `addressLocality`, `streetAddress`, `postalCode`

```ts
{
  label: 'Реквизиты',
  fields: [
    {
      type: 'collapsible',
      label: 'Юридическое лицо',
      fields: [/* legalName, taxId, kpp, ogrn */],
    },
    {
      type: 'collapsible',
      label: 'Адрес',
      fields: [/* addressRegion, addressLocality, streetAddress, postalCode */],
    },
  ]
}
```

### AC3 · MenuItems factory simplification (be-panel)

- [ ] `menuItemArrayField()` остаётся (используется в 2 местах), но:
  - Внутренние fields с `condition` — переход на shared-array через **inline `tabs` per kind** (если Payload позволяет на array-row level) или сохранить current pattern.
  - **NO breaking changes** в shape — schema идентична.
- [ ] Если research показал ограничение Payload — оставить current pattern, фиксируем в комментарии «factory дублируется по design ADR-0002, future split в `MenuItems` collection — PANEL-MENUS-COLLECTION future US».

### AC4 · No data migration (qa-panel + dba)

- [ ] **Critical**: `npx payload migrate:status` (или dev-mode auto-migrate) показывает **0 pending migrations** после изменений.
- [ ] Verify: dump Postgres `globals.site_chrome` row до и после применения изменений — поля идентичны (Payload tabs UI-only поведение).
- [ ] Если migration появляется (например, из-за `collapsible` field) — `dba` consult, либо корректируем подход, либо ADR обновление.

### AC5 · Brand-guide compliance (ux-panel)

- [ ] §12.2 admin organization — sub-tabs внутри tab допустимы (mockup level), но **глубина не более 2 уровней tabs** (top-level + sub-tabs). НЕ делать tabs-в-tabs-в-tabs.
- [ ] §12.4 tab states — sub-tabs наследуют те же interaction states (hover / active / pressed / focus-visible / has-error).
- [ ] Visual: collapsible-блоки следуют brand-guide collapsible pattern (если описан).

### AC6 · Tests + Evidence (qa-panel + leadqa)

- [ ] Playwright e2e (`site/tests/e2e/admin-site-chrome.spec.ts` — расширить existing):
  - login → `/admin/globals/site-chrome/edit` → 5 top-tabs visible (no change vs main)
  - click «Footer» tab → 2 sub-tabs visible («Контент», «Юридические ссылки»)
  - click «Реквизиты» tab → 2 collapsible blocks visible (Юрлицо / Адрес), default open
- [ ] Existing `site-chrome.spec.ts` (`site/tests/e2e/site-chrome.spec.ts`) — все green (revalidate hooks, render Header/Footer на сайте без regression).
- [ ] Screenshots: `screen/panel-sitechrome-footer-subtabs.png`, `screen/panel-sitechrome-requisites-collapsible.png`.

## §-mapping (brand-guide.html)

- **§12.2 admin organization patterns** — sidebar groups + tabs depth.
- **§12.4 tab states** — sub-tabs наследуют main tab states.
- **§14 Don't** — anti-pattern «бесконечный скролл», не нарушаем.

## Sub-tasks (decomposition)

| # | Кто | Что | Effort |
|---|---|---|---|
| 1 | sa-panel | spec + decision matrix (this) + check Payload 3.84 nested-tabs support | 0.3 чд |
| 1.1 | fe-panel | research: nested tabs vs collapsible на Payload 3.84 group field | 0.2 чд |
| 2 | be-panel | Footer restructure + Requisites collapsible | 0.4 чд |
| 3 | dba | migration check (verify globals row identical) | 0.1 чд |
| 4 | ux-panel | brand-guide §12.2 visual review | 0.2 чд |
| 5 | qa-panel | Playwright spec + screenshots + existing tests green | 0.3 чд |

**Total**: 1.5 чд.

## ADR-NEEDED?

**NO** для Phase A (tabs-deeper, no migration, no schema change). Reference existing **ADR-0002** (US-2 SiteChrome single global).

**YES** для **Phase B (split-collection `MenuItems`)** — будет отдельный future US `PANEL-MENUS-COLLECTION`, ADR-0011 (или next-в-нумерации) от `tamd`. В scope этого US — НЕ делается.

## Состав команды

- **sa-panel** (this) — spec + decision matrix
- **fe-panel** — research nested-tabs Payload 3.84
- **be-panel** — implementation
- **dba** — migration verify (consult, не блокер)
- **ux-panel** — visual review §12.2
- **qa-panel** — Playwright + screenshots
- **cr-panel** — final review

**НЕ нужны (для Phase A)**: `tamd` (ADR не нужен), `cw` (copy не меняется).

## Open questions

1. ~~A vs B vs C?~~ — **resolved**: A для текущего US, B — future follow-up `PANEL-MENUS-COLLECTION`, C — rejected.
2. **Open**: nested tabs на group-field в Payload 3.84 — supported? (sub-task 1.1, fe-panel research). Если нет → fallback collapsible по всему Footer.
3. **Open**: `collapsible` field default-open поведение в Payload 3.84 — задаётся через `admin.initCollapsed: false`?  (fe-panel verify в research-итерации).
4. **Open**: возможны UI regressions в frontend renderer footer/header (хуки `afterChange` revalidate теги — должны сработать, но verify в qa).

## Hand-off log

- 2026-05-01 · popanel → sa-panel: spec request (P0 anti-pattern, effort 1.5 чд, ADR conditional).
- 2026-05-01 · sa-panel → popanel: spec-draft готов, decision Phase A (no ADR), Phase B вынесен в future PANEL-MENUS-COLLECTION. Open questions 2-3 — fe-panel research-итерация (sub-task 1.1) перед dev-стартом.
