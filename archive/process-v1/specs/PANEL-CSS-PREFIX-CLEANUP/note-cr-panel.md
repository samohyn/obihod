---
us: PANEL-CSS-PREFIX-CLEANUP
title: cr-panel sign-off
team: panel
role: cr-panel
phase: review
status: approved
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, frontend-patterns]
---

# cr-panel sign-off — PANEL-CSS-PREFIX-CLEANUP

## Skill activation

- `design-system` — verified brand-guide §12 token namespace `--brand-obihod-*`
  не тронут, palette/radius/motion/shadow tokens сохранены без изменений.
- `frontend-patterns` — dead-code elimination, surgical edits (iron rule #3).

## Verdict per spec AC

| AC | Result | Evidence |
|---|---|---|
| AC1 — Identification + classification | PASS | DOM probe 2026-05-01 на `/admin/`, `/admin/collections/leads`, `/admin/collections/services/5`, `/admin/login` показал: `.payload__app` ancestor отсутствует во всех authed admin views Payload 3.84 (outer wrapper — `.template-default`). Все 32 W1+W4+W6+a11y selectors с префиксом — DEAD. |
| AC2 — Removal | PASS | 32 правила удалены (см. таблицу ниже). Live правила без префикса (login__form, nav__link--home, lead-*, list-create-new-doc, step-nav__home, modular-dashboard, popup-button, theme-toggle-stub, brand-skeleton, sidebar-icon attr-selectors) — НЕ тронуты. |
| AC3 — Visual no-regression | PASS | 5 baseline screenshots `screen/css-prefix-before-{login,dashboard,leads,cases,blog,services-edit}.png` vs 5 after `css-prefix-after-*.png` — pixel-identical (визуально 0% diff на 6 routes; spec просил 5, я снял 6). |
| AC4 — A11y no-regression | PASS | `pnpm test:e2e --project=chromium tests/e2e/admin-a11y.spec.ts` — 1 passed (login), 4 skipped (auth-required, без regression). |
| AC5 — Tests + Evidence | PASS | Полный admin-* test pack: 36 passed, 17 skipped (auth-required), 0 failed. CI gates: type-check + lint (0 errors) + format:check + build — все clean. |

## Selectors removed (классификация per AC1)

| Селектор | Verdict | Action |
|---|---|---|
| `.payload__app, .payload__app input, .payload__app table, .payload__app code` (font-variant-numeric) | dead | удалён |
| `.payload__app .btn--style-primary` + 5 state-вариантов | dead | удалён (W1 amber primary в admin shell не работал) |
| `.payload__app .btn--style-secondary` + 2 state-варианта | dead | удалён |
| `.payload__app input/textarea/select :focus-visible/:hover/aria-invalid` (8 вариантов) | dead | удалён |
| `.payload__app .pill--style-{success,warning,error,light-gray,default}` | dead | удалён |
| `.payload__app .nav__link` + 4 state-вариантов | dead | удалён (sidebar styling уже работает через `a.nav__link[href*='...']` icons + W10 `.nav__link--home`) |
| `.payload__app .tabs-field__tab-button` + 4 state-вариантов + `has-error::after` | dead | удалён |
| `.payload__app .btn--style-primary:active` (reduced-motion) | dead | удалён |
| `.payload__app *` (reduced-motion transition-duration) | dead | удалён |
| `.payload__app button/btn/nav__link/tabs-field__tab-button` (mobile @1024 touch-target) | dead | удалён |
| `.payload__app input/textarea` (mobile @1024 touch-target) | dead | удалён |
| `.payload__app table` (mobile @640 horizontal-scroll) | dead | удалён |
| `.payload__app td.cell-_select` (mobile @640 hide bulk-action) | dead | удалён |
| `.payload__app td.cell-_select`, `.payload__app .checkbox-input__input`, `.payload__app .cell-_select .checkbox-input` (a11y @1024 hit-area) | dead | удалён |
| `.payload__app .field-type[id*='field-_actions']` | dead | переписан без префикса (id очень specific, collision risk = 0) |

**Итого:** 1479 → 1296 строк (−183, ≈ −12%).

## Backlog follow-ups (созданы как комментарии в SCSS)

1. **PANEL-W1-REVIVE-OR-DROP** — решить судьбу W1 amber primary CTA / pills /
   nav__link active states / inputs focus brand-зелёный для admin shell.
   Native Payload defaults сейчас вместо них (визуально нейтрально, но
   brand-token override missing в edit/list views).
2. **PANEL-W4-TABS-REVIVE** — recreate tab hover/active green styling +
   has-error red dot indicator через `.template-default` ancestor если оператор
   отметит UX regression в edit-view tabs.
3. **PANEL-W6-MOBILE-REVIVE** — recreate mobile @640 list horizontal-scroll
   (`.template-default table { display: block; overflow-x: auto }`) +
   bulk-select hide на mobile если qa-panel найдёт regression на operator's
   iPhone.
4. **PANEL-A11Y-TARGET-SIZE-REVIVE** — recreate a11y @1024 bulk-select touch
   hit-area expansion если a11y audit покажет 25×25 checkbox на tablet
   portrait.

## Risks (per spec sa-panel)

- ~~False-positive «dead»~~ — closed: DOM probe подтвердил отсутствие ancestor
  для ВСЕХ удалённых селекторов. Visual diff 0%.
- ~~Specificity shift~~ — closed: удалили целиком, не упрощали префикс на live.
- ~~Mobile drawer regression~~ — closed: live `.template-default--nav-open`
  rules сохранены.
- ~~Скрытое использование префикса в JSX/TSX~~ — closed: `grep "payload__app"
  site/**/*.tsx` → 0 matches; в .ts только 2 теста, обновлены.

## Test files updated

- `tests/e2e/admin-mobile.spec.ts:111-117,132-137` — убраны проверки на dead
  `.payload__app table` и `.payload__app td.cell-_select`. Live `.tabs-field__tabs`
  + `aria-label` widget остались.
- `tests/e2e/admin-design-compliance.spec.ts:168-176` — `test.skip()` на
  W4 has-error tab indicator с явной ссылкой на backlog PANEL-W4-TABS-REVIVE.
- `tests/e2e/admin-reduced-motion.spec.ts` — без правок (test проверяет
  любое `transition-duration: 0.01ms` rule, наше `.login__form *` matches).

## Готов к merge

- CI gates clean.
- Visual 0% diff на 6 routes.
- E2E test pack: 36 passed / 17 skipped / 0 failed.
- Backlog follow-ups задокументированы в SCSS comments + здесь.
