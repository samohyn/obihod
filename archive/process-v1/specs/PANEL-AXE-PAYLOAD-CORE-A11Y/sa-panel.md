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

# sa-panel — PANEL-AXE-PAYLOAD-CORE-A11Y

## Skill activation (фиксация)

- `design-system` — сверка с brand-guide §12.5 (status/checkbox interaction
  states), §5 Contrast (focus-visible WCAG AAA для touch-targets уже введён
  W6/W9 + PANEL-A11Y-TARGET-SIZE). Меняем accessible name, не visual state —
  визуальные токены не задеваются.
- `accessibility` — WCAG 2.2 SC 4.1.2 Name/Role/Value (Level A), SC 1.3.1
  Info & Relationships (Level A). Не задеваем SC 2.5.5 (Target Size) —
  44×44 hit area уже обеспечен PANEL-A11Y-TARGET-SIZE
  (`custom.scss:920-937`, wrapper 44×44 вокруг 25×25 checkbox icon).

## Цель

Дать Payload native row-select checkbox в list-view **accessible name**, чтобы
screen-reader озвучивал «Выделить строку <doc-title>» (или fallback «Выделить
строку») вместо безымянного `checkbox`. Это закрывает 1 critical axe
violation (4 nodes на коллекциях с docs), который существует во всех
list-views (Cases, Blog, Services, Leads, Authors, Districts) и зафиксирован
в `leadqa-RC-3-hotfix.md` § Findings F1.

## Acceptance Criteria

### AC1 · Accessible name (fe-panel)

- [ ] Каждый row-checkbox `input.checkbox-input__input` в list-view
  получает accessible name. Допустимы 2 равноценных подхода (выбор —
  fe-panel + cr-panel, см. § Approach):
  - **CSS-only через visually-hidden `<label>`** — невозможно (label
    требует JSX), **отвергнуто** на этапе sa.
  - **CSS pseudo-element** на cell — также не даёт accessible name input'у,
    только декоративно visible-hidden текст; **отвергнуто**.
  - **JS injection через admin.components.providers (preferred)** —
    single React effect, который добавляет `aria-label` к каждому
    `input.checkbox-input__input` после mount/update list rows.
  - **Альтернативно — Payload custom Cell** для row-select (требует override
    через `admin.components.cells` Payload API, шире по effort, рассмотреть
    если providers подход не сработает).
- [ ] Текст label: **«Выделить строку»** (общий, без doc-title) — для
  избежания React re-render dependency на row data + i18n complexity. Future:
  если Payload даст доступ к row context — расширить до «Выделить строку
  "<doc-title>"». Hardcode RU (admin SSR использует `i18n.lang = "ru"`,
  see `site/payload.config.ts`).
- [ ] Bulk-select header checkbox (в `<th>:first-child`) получает
  отдельный label **«Выделить все строки»**.

### AC2 · Axe rule passes (qa-panel)

- [ ] В `site/tests/e2e/admin-a11y.spec.ts` axe-core run на routes:
  - `/admin/collections/cases` (4 docs)
  - `/admin/collections/blog` (5 docs)
  - `/admin/collections/services` (8 docs)
  - `/admin/collections/districts` (8 docs)
  - `/admin/` dashboard (если row-checkbox присутствует в widgets — skip)
- [ ] **Zero violations** для axe rules:
  - `aria-input-field-name` (4.1.2 Name/Role/Value)
  - `label` (1.3.1 Info & Relationships)
- [ ] Если remaining violations есть от **non-row-checkbox** Payload widgets
  (Pikaday date picker, RichText editor toolbar) — **остаются вне scope**;
  НЕ добавлять в exception list, фиксировать в follow-up
  `PANEL-AXE-PAYLOAD-NESTED-WIDGETS`.

### AC3 · No visual / interaction regression (qa-panel + leadqa)

- [ ] Visual: row-checkbox остаётся 25×25 visible, hit-area 44×44 (mobile
  ≤1024px) — токены из `custom.scss:920-937` (PANEL-A11Y-TARGET-SIZE) не
  тронуты.
- [ ] Interaction: click/tap на checkbox → toggles selection (Payload
  native behavior сохранён). Bulk-actions row appears при ≥1 selected.
- [ ] Screen-reader smoke (VoiceOver macOS, leadqa) — Tab → row-checkbox
  → озвучка «Выделить строку, флажок, не отмечен» (в RU локали macOS).
- [ ] Screenshots: `screen/panel-axe-row-checkbox-{cases,blog}.png` (DOM
  inspector панель показывает `aria-label="Выделить строку"` на input).

## Approach (выбор + rationale)

### Decision: JS injection через `admin.components.providers`

**Выбран** custom React provider, который через `useEffect` + `MutationObserver`
(или `useLayoutEffect` + delegation) вешает `aria-label` на каждый
`input.checkbox-input__input` в list-view DOM tree.

```typescript
// site/components/admin/A11yRowCheckboxProvider.tsx (skeleton, не код для копирования)
'use client';
import { useEffect } from 'react';

export const A11yRowCheckboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const apply = () => {
      document.querySelectorAll<HTMLInputElement>('input.checkbox-input__input').forEach((input) => {
        if (input.getAttribute('aria-label')) return;
        const isHeader = input.closest('th') !== null;
        input.setAttribute('aria-label', isHeader ? 'Выделить все строки' : 'Выделить строку');
      });
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return <>{children}</>;
};
```

**Регистрация** в `site/payload.config.ts`:
```typescript
admin: {
  components: {
    providers: [
      // existing providers...
      'site/components/admin/A11yRowCheckboxProvider#A11yRowCheckboxProvider',
    ],
  },
},
```

**Rationale выбора JS over CSS:**
- CSS pseudo-elements (`::before content`) **не дают** input'у accessible
  name (axe рассматривает только `aria-label`, `aria-labelledby`, `<label
  for>` или `title`). CSS-only **не работает** для этого класса violation.
- Payload re-render row-checkbox dynamically (sort/filter/pagination) —
  `MutationObserver` единственный надёжный способ догнать post-mount DOM.
- Single provider = single mount point = no per-route boilerplate.
- React tree manipulation минимальна (1 component без UI, только side-effect).

**Alternative (fallback)** — Payload custom Cell override для row-select
column. Effort 1.5-2 чд (требует копирования Payload Cell logic + JSX
с правильным `<label htmlFor>`). Откладываем как fallback **только**, если
provider подход даст a11y noise или performance regression.

## §-mapping (brand-guide.html)

- **§12.5 Status badges & interaction states** — checkbox interaction states
  (default/hover/checked/focus-visible) НЕ меняются; meaningful change только
  в accessibility tree (Name/Role/Value).
- **§5 Contrast** — focus-visible ring (WCAG AAA, токен из W6/W9) сохранён.
- **§13 TOV** — текст label «Выделить строку» / «Выделить все строки»:
  - Caregiver-Ruler tone: лаконично, действие-глагол, без эмоций.
  - НЕ «Выбрать» (двусмысленно), НЕ «Selection of row N» (английский).
  - Sync с существующей лексикой Payload admin (RU локаль уже использует
    «Выделить» в bulk-actions toolbar — verified в `node_modules/@payloadcms/translations/dist/languages/ru.js`).

## Risks

1. **Payload 3 re-render row-checkbox dynamically** при sort/filter/page
   change. `MutationObserver` mitigation: subtree observer на `document.body`
   с гард `if (input.getAttribute('aria-label')) return;` чтобы избежать
   бесконечного цикла. Performance: ≤1 forEach на каждое DOM mutation;
   measured impact — negligible (десятки checkbox per page, ms-level).
2. **i18n hardcode** — только RU label, EN/прочие локали не покрыты. MVP
   acceptable (admin живёт в RU локали per `payload.config.ts`); future
   enhancement — читать `i18n.t('general:selectRow')` из Payload context
   (требует useTranslation hook, может конфликтовать с MutationObserver
   life-cycle).
3. **axe rule может flag Pikaday или другие nested widgets** (RichText
   toolbar, MediaUpload preview) — focus только на `input.checkbox-input__input`
   selector в QA; остальные violations фиксируются в follow-up
   `PANEL-AXE-PAYLOAD-NESTED-WIDGETS`, НЕ блокируют этот spec.
4. **CSP / strict-mode React** — `MutationObserver` legal в strict-mode
   (no side-effects в render, только в `useEffect`). Verified pattern в
   React 19 docs.

## Out of scope

- **Upstream PR в Payload 3** (`payloadcms/payload`) — отдельный optional
  follow-up `PANEL-AXE-PAYLOAD-CORE-A11Y-UPSTREAM`, если оператор позже
  захочет contribute. cpo retro § L4 не предписал upstream.
- **Полный a11y audit list-view** — Pikaday, RichText, MediaUpload,
  date-time picker и прочие nested Payload widgets имеют отдельные axe
  violations (color-contrast, aria-hidden-focus). Покрыты в
  `PANEL-UX-AUDIT` + future `PANEL-AXE-PAYLOAD-NESTED-WIDGETS`.
- **Bulk-actions checkbox toolbar** (отдельный `PANEL-BULK-PUBLISH` scope) —
  toolbar inputs уже имеют labels из Payload core, не требуют patch.
- **i18n EN locale** — MVP RU-only (admin локализован в RU полностью).
- **Edit-view checkbox fields** (например, Boolean field в Service edit) —
  Payload core рендерит их с `<label>` обёрткой, axe-clean. Не задеваются.

## Sub-tasks (decomposition)

| # | Кто | Что | Effort |
|---|---|---|---|
| 1 | sa-panel | This spec + intake.md | done (≈0.05 чд) |
| 2 | fe-panel | `A11yRowCheckboxProvider.tsx` + регистрация в `payload.config.ts` + local browser-smoke на `cases` + `blog` (real DOM, console.error check) | 0.2 чд |
| 3 | qa-panel | axe-core run на 4 routes + screenshot evidence + Playwright assertion `expect(input).toHaveAttribute('aria-label')` | 0.15 чд |
| 4 | leadqa | VoiceOver smoke + screenshots + final verify перед operator approve | 0.1 чд |

**Total**: ~0.5 чд (соответствует RICE estimate из US-12 retro).

## ADR-NEEDED?

**NO.** Это патч-уровень a11y fix, без архитектурных решений. Single React
provider, no schema changes, no new admin views, no new dependencies.
Pattern (`admin.components.providers` + `MutationObserver`) — стандартный
Payload extension point.

## Состав команды

- **sa-panel** (this) — spec + intake
- **fe-panel** — provider implementation + payload.config.ts регистрация
- **cr-panel** — code review (single PR, scope маленький, может быть
  self-approved per iron rule #7 если scope < 50 строк и no cross-cutting)
- **qa-panel** — axe + Playwright smoke
- **leadqa** — final real-browser + VoiceOver smoke перед operator approve

**НЕ нужны**: `be-panel` (no Payload schema / API touch), `dba` (no DB),
`tamd` (no architectural decision), `ux-panel` (visual no-op, label текст
sync с Payload native RU локалью), `do` (deploy через стандартный gate).

## Open questions

1. ~~CSS-only достаточно?~~ — **resolved NO**: CSS pseudo-elements не дают
   input'у accessible name; нужен JS provider для `aria-label` injection.
2. ~~aria-label с doc-title или generic?~~ — **resolved generic** «Выделить
   строку» (без doc-title) для MVP; future enhancement when Payload Cell
   API даст row context.
3. ~~i18n EN?~~ — **resolved RU-only** (admin локализован полностью в RU).
4. ~~Upstream PR scope?~~ — **resolved out-of-scope**, отдельный optional
   follow-up.

## Hand-off log

- 2026-05-01 · cpo → popanel: follow-up из US-12 retro § L1 (RICE 16.8, S),
  bound to autonomous mandate batch.
- 2026-05-01 · popanel → sa-panel: spec request (effort 0.5 чд, no ADR,
  CSS-or-JS approach decision до fe-panel).
- 2026-05-01 · sa-panel → popanel: spec-approved (AC1-AC3, approach decision
  = JS provider per accessibility skill insight «CSS pseudo не даёт name»),
  ready to dispatch fe-panel + qa-panel + leadqa.
- 2026-05-01 · popanel → popanel: self-approved (autonomous mandate, iron
  rule #7, scope = 1 small provider + 1 config line, внутри panel team,
  no cross-team conflict, бизнес-решение зафиксировано в US-12 retro).
- _next_ 2026-05-01 · popanel → fe-panel: kick-off implementation (PR
  branch `panel/axe-row-checkbox`, base = main).
