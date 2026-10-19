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

# sa-panel — PANEL-SERVICES-PREVIEW-TAB

## Skill activation (фиксация)

- `design-system` — сверка brand-guide §12.4 mockup (line 3080-3086 — 6 tabs с «Превью»), §11 (preview UX patterns).
- `frontend-patterns` — Payload custom field component pattern, RSC preview integration.

## Контекст

**brand-guide §12.4 mockup** (`design-system/brand-guide.html:3072-3086`) показывает 6 tabs в Services edit-view: `Основные / Контент / SEO / Sub-services / FAQ / Превью`. В коде (`site/collections/Services.ts:18-264`) фактически 6 tabs, но другой набор: `Основные / Контент / Sub-услуги / FAQ / SEO / Связи`.

**Gap**: tab «Превью» отсутствует. Tab «Связи» (related-services) — лишняя или некорректно named (по факту это group-fields, не master tab).

Daily-flow оператора (по PANEL-UX-AUDIT): обновить `priceFrom` → save → check на сайте. Сейчас:
1. save (Cmd+S)
2. open new browser tab
3. type `obikhod.ru/uslugi/<slug>` (или копировать slug)
4. reload
≥4 действий, контекст-switching. С preview-tab — 1 click.

## Approach Decision

**3 альтернативы:**

| Вариант | Описание | Pros | Cons | Recommend |
|---|---|---|---|---|
| **A · iframe inline** | Custom field component с `<iframe src="/uslugi/<slug>" />` внутри tab «Превью» | Контекст не теряется, side-by-side editing | iframe security (Payload admin and public domain — ок, same-origin); cookie/preview-token нужен для draft; высота iframe `min-height: 800px` отъедает экран | **Phase 2** |
| **B · top-bar button «Открыть на сайте»** | edit-view top-bar action button, открывает `/uslugi/<slug>?_preview=...` в новой вкладке | Минимум кода, ноль iframe-сложностей, tab «Превью» становится уместной только для контейнера 1 button | Контекст-switch остаётся (но 1 click vs 4) | **Phase 1 (this US)** |
| C · split-view | Right-pane preview всегда виден (выбирается через layout-toggle) | Мощный UX | Сильно меняет Payload edit-view layout, требует ADR | Out-of-scope (rejected) |

**Sa-panel рекомендация — B (top-bar button) для Phase 1, A (iframe) — следующая итерация** (если оператор скажет «всё-таки хочу side-by-side»).

**Альтернатива «вместо tab»**: добавить кнопку «Открыть на сайте» прямо в edit-view top-bar (рядом с Save Draft / Publish), без отдельной tab. brand-guide §12.4 mockup line 3086 показывает «Превью» как **именно tab** — поэтому делаем tab, но содержимое = top-bar action equivalent (button «Открыть на сайте» + preview hint card).

**Phase 1 implementation в tab «Превью»:**
- Card-блок с preview-link `/uslugi/<slug>/` (рендерится через slug field из form context)
- Большая primary-button «Открыть на сайте ↗» (target=_blank, rel=noopener)
- Hint: «Превью открывается в новой вкладке. Для draft-режима — нажмите «Save Draft» → «Открыть на сайте»»
- Состояния:
  - **doc unsaved (no slug)**: button disabled, hint «Заполните slug и сохраните черновик, чтобы открыть превью»
  - **doc saved, draft**: button active, ссылка `/uslugi/<slug>/?_draft=1` (preview API)
  - **doc published**: button active, ссылка `/uslugi/<slug>/`

## Acceptance Criteria

### AC1 · Tab «Превью» в коллекции (sa-panel + be-panel)

- [ ] В `site/collections/Services.ts` массив `tabs[]` дополнен 6-м tab `{ label: 'Превью', fields: [...] }`. Текущий 6-й tab «Связи» **переименован в «Sub-услуги»** или **смерджен** с tab «Sub-услуги» (decision: смерджить — `relatedServices` field переезжает в существующую tab «Sub-услуги», новый tab «Превью» становится финальным; tabs остаются 6).
- [ ] Поскольку tab UI-only (Payload unnamed tab, без `name`) — schema БД не меняется, миграции не нужны.

### AC2 · Preview component (fe-panel)

- [ ] Новый custom field component `site/components/admin/ServicePreviewPanel.tsx`:
  - читает `slug` из `useFormFields(['slug'])`
  - читает `_status` из form context (draft / published / unsaved)
  - рендерит StatePanel-card (визуально близкий к `EmptyErrorStates.tsx` шаблону, но без icon)
  - primary-button «Открыть на сайте ↗» с `target="_blank" rel="noopener"`
  - URL: `/uslugi/<slug>/` (published) или `/uslugi/<slug>/?_draft=1` (draft)
  - disabled-state, если slug пуст или doc не сохранён

### AC3 · Payload integration (be-panel)

- [ ] В `Services` collection tab «Превью» добавлен `ui` field:

```ts
{
  type: 'ui',
  name: 'previewPanel',
  admin: {
    components: {
      Field: 'site/components/admin/ServicePreviewPanel#default',
    },
  },
}
```

- [ ] Component path добавлен в `site/payload.config.ts` `admin.components.fields` (если требуется importMap registration в Payload 3.x).
- [ ] Component **server-rendered safe** (Payload RSC), без heavy client-side state.

### AC4 · Brand-guide compliance (qa-panel + ux-panel)

- [ ] Visual: card padding 24px, primary-button следует §12.4 button styles (`.btn--style-primary`), focus-visible через §12.4.1 token-map.
- [ ] TOV для hint-text — §13 brand-guide (matter-of-fact, без «Упс! / Что-то пошло не так»).
- [ ] Иконка ↗ (external-link) — из §9 icon set.

### AC5 · Tests + Evidence (qa-panel + leadqa)

- [ ] Playwright e2e (`site/tests/e2e/admin-services-preview.spec.ts`):
  - login → open existing service → tabs[5] === 'Превью' visible
  - click tab → preview card rendered с button
  - button has `href="/uslugi/<slug>/"` + `target="_blank"`
  - empty-slug case → button disabled
- [ ] Screenshots: `screen/panel-services-preview-tab-published.png`, `screen/panel-services-preview-tab-draft.png`, `screen/panel-services-preview-tab-empty.png`.
- [ ] axe-core: tab + button passes WCAG 2.2 AA (target-size 44×44, focus-visible, label).

## §-mapping (brand-guide.html)

- **§12.4 mockup line 3086** — «Превью» tab anchor.
- **§12.4 Interaction states** — button states (default / hover / pressed / focus-visible / disabled).
- **§9 Icons** — external-link glyph (если из icon set; иначе SVG inline ↗ через text).
- **§13 TOV** — hint copy без «Упс».
- **§11 Preview patterns** — preview-card шаблон.

## Sub-tasks (decomposition)

| # | Кто | Что | Effort |
|---|---|---|---|
| 1 | sa-panel | spec + decision matrix (this) + decision: merge «Связи» в «Sub-услуги» | 0.2 чд |
| 2 | be-panel | tab «Превью» + ui-field в `Services.ts` + merge «Связи» в «Sub-услуги» | 0.2 чд |
| 3 | fe-panel | `ServicePreviewPanel.tsx` (RSC + slug from form context) | 0.3 чд |
| 4 | qa-panel | Playwright spec + axe + 3 screenshots | 0.2 чд |
| 5 | cr-panel | review brand-guide compliance | 0.1 чд |

**Total**: 1 чд.

## ADR-NEEDED?

**Conditional**.
- Phase 1 (top-bar button-equivalent в tab) — **NO ADR**, это standard Payload `ui` field pattern.
- Phase 2 (iframe inline) — **YES ADR** (`tamd`), потому что задевает Payload preview API integration + cookie/session forwarding для draft preview.

This US — Phase 1 → **NO ADR**.

## Состав команды

- **sa-panel** (this) — spec + decision
- **be-panel** — tab + ui-field в `Services.ts`
- **fe-panel** — `ServicePreviewPanel.tsx`
- **ux-panel** — visual review (brand-guide §12.4 + §11)
- **qa-panel** — Playwright + axe + screenshots
- **cr-panel** — final review

**НЕ нужны**: `dba` (no schema), `tamd` (no ADR for Phase 1).

## Open questions

1. ~~A vs B vs C?~~ — **resolved**: B для Phase 1.
2. ~~«Связи» tab — куда?~~ — **resolved**: смерджить в «Sub-услуги» (single tab), новый «Превью» становится финальным 6-м.
3. ~~Draft preview API?~~ — **resolved для Phase 1**: `?_draft=1` query param, `app/uslugi/[slug]/page.tsx` уже умеет рендерить draft через Payload preview cookie (verify в site team если нет — отдельный sub-task).
4. **Open**: `?_draft=1` route handler — needs verification от `fe-site` (cross-team consult). **Hand-off**: popanel pings podev для подтверждения.

## Hand-off log

- 2026-05-01 · popanel → sa-panel: spec request (P0, daily-use, effort 1 чд).
- 2026-05-01 · sa-panel → popanel: spec-draft готов, decision A vs B вынесена (recommend B), open question 4 на podev (cross-team consult).
