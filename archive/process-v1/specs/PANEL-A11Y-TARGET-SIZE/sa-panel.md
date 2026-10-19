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

# sa-panel — PANEL-A11Y-TARGET-SIZE

## Skill activation (фиксация)

- `design-system` — сверка с brand-guide §12.4 interaction states (touch hint), §12.4.1 token-map.
- `frontend-patterns` — CSS-only enhancement без JSX-патчей, минимальная хирургическая правка.
- `accessibility` — WCAG 2.2 AA, SC 2.5.5 (Target Size 44×44), SC 2.5.8 (Target Size Minimum 24×24).

## Контекст

W7 admin-a11y axe spec (`site/tests/e2e/admin-a11y.spec.ts:29-43`) перечисляет 7 disabled rules. Из них `target-size` — не framework-constraint, а наш технический долг: W6 mobile rules покрыли `.btn`, `[type="button"]`, links и `[role="tab"]`, но **row-action icon-buttons** в list-view имеют specific class selectors (`.cell-actions`, `.row-actions`, `.popup-button` и т. п.) с inline width/height `<= 24-28px`.

Оператор на mobile/tablet (полевая работа на объекте — измерил дерево, открыл админку, нажал «edit» в Cases) не попадает пальцем в иконку. Это P0 ergonomic блокер.

## Acceptance Criteria

### AC1 · Audit (sa-panel + fe-panel)

- [ ] Зафиксирован полный список Payload list-view row-action селекторов с актуальным размером (`width × height` через DevTools на ≤1024px viewport):
  - `.cell-actions` / `.cell-actions__edit-button`
  - `.row-actions` / `.row-actions__button`
  - `.popup-button` (3-dot kebab)
  - `.thumbnail-action__button`
  - **bulk-select** checkbox `.checkbox-input__input` (если <24×24)
  - `.collection-list__edit-button` (если есть)
- [ ] Артефакт аудита — `audit-row-actions.md` в этой же папке: имя элемента / current size / required size / delta.

### AC2 · CSS-only fix (fe-panel)

- [ ] В `site/app/(payload)/custom.scss` секция `§6.3 Tablet+mobile common (≤1024px)` (lines 599-625) расширена правилами для row-actions:

```scss
@media (max-width: 1024px) {
  .payload__app .cell-actions__edit-button,
  .payload__app .row-actions__button,
  .payload__app .popup-button,
  .payload__app .thumbnail-action__button {
    min-width: 44px !important;
    min-height: 44px !important;
    padding: 10px !important; /* keep icon visual size 24×24, expand hit-area */
    box-sizing: border-box !important;
  }
}
```

- [ ] **Padding strategy** — увеличиваем hit-area через padding, **НЕ** размер SVG-glyph (визуальная плотность list-view сохраняется на desktop, regression-free).
- [ ] При desktop ≥1025px правил target-size **нет** (в desktop оператор работает мышью, 24×24 достаточно — SC 2.5.8 Minimum).

### AC3 · Re-enable axe rule (qa-panel)

- [ ] В `site/tests/e2e/admin-a11y.spec.ts` из `PAYLOAD_NATIVE_EXCEPTIONS` массива удалена строка `'target-size'` + связанный комментарий (lines 36-40).
- [ ] Тесты `'/admin/collections/services/' (list-view)` + `'/admin/' (dashboard)` зелёные на mobile viewport `1024×768` (Playwright `viewport`).
- [ ] Если remaining violations есть от Payload native checkboxов — добавить **специфичный** selector в exclude (`.disableRules`-list **НЕ** трогать; использовать `.exclude('selector')`).

### AC4 · No regression (qa-panel)

- [ ] W6 mobile real-device smoke (iPhone 12 Safari + Android Chrome) — оператор pop-up tap = always hits.
- [ ] Desktop W7 axe baseline остаётся зелёным.
- [ ] Visual regression на desktop list-view: row высота `≤44px` (icons остаются 24×24 visual, hit-area через padding только на mobile).

### AC5 · Evidence

- [ ] Screenshot mobile viewport (Playwright `screen/panel-a11y-target-size-mobile.png`) — иконки edit/kebab показывают inline-flex 44×44.
- [ ] Screenshot desktop (`screen/panel-a11y-target-size-desktop.png`) — никаких visual изменений vs main.
- [ ] axe-core CLI output `target-size: 0 violations`.

## §-mapping (brand-guide.html)

- **§12.4 Interaction states** — touch-hint patch не меняет visual states (default/hover/pressed/focus-visible сохранены).
- **§12.4.1 Token-map** — padding не задевает token-map (padding ≠ background/border tokens).
- **§12.6 EmptyState** — не задевается.

## Sub-tasks (decomposition)

| # | Кто | Что | Effort |
|---|---|---|---|
| 1 | sa-panel | audit-row-actions.md | 0.1 чд |
| 2 | fe-panel | CSS правки + локальный prove (DevTools на mobile viewport) | 0.2 чд |
| 3 | qa-panel | re-enable target-size rule + Playwright runs | 0.1 чд |
| 4 | qa-panel + leadqa | real-device smoke + screenshots → evidence | 0.1 чд |

**Total**: 0.5 чд.

## ADR-NEEDED?

**NO.** Это патч-уровень W6/W9, без архитектурных решений. CSS-only, no schema changes, no new admin views.

## Состав команды

- **sa-panel** (this) — spec + audit
- **fe-panel** — CSS implementation
- **qa-panel** — re-enable axe rule + Playwright + real-device smoke
- **leadqa** — final verify перед merge

**НЕ нужны**: `be-panel`, `dba`, `tamd`, `ux-panel` (visual-only без концептуального изменения).

## Open questions

1. ~~CSS-only достаточно?~~ — **resolved**: yes, `min-width/min-height` + `padding` через @media query без JSX-touch.
2. ~~Bulk-checkbox в scope?~~ — **в scope, если current size <24×24**; иначе skip (SC 2.5.8 fallback допустим для form controls).
3. ~~Desktop размеры?~~ — **out-of-scope**, desktop сохраняется как есть.

## Hand-off log

- 2026-05-01 · popanel → sa-panel: spec request (effort 0.5 чд, P0).
- 2026-05-01 · sa-panel → popanel: spec-draft готов, AC1-AC5 ясны, no ADR, ждёт popanel approve → `phase: dev`.
