---
us: US-12
wave: 9
title: "Admin v2 deeper alignment — force-light depth + BrandIcon size + favicon mismatch"
team: panel
po: popanel
type: bug-fix
priority: P0
segment: admin
phase: dev-complete
role: popanel
status: spec-approved (popanel autonomous-mode 2026-04-30)
blocks: [US-12 release]
blocked_by: []
related: [W1, W8, ADR-0007]
created: 2026-04-30
updated: 2026-04-30
---

# sa-panel — Wave 9 · Admin v2 deeper alignment

**Issue:** PAN-NEXT (popanel назначит)
**Wave:** 9 — глубокий prod alignment после W8 (3 issue репорта оператора 2026-04-30 после merge PR #109)
**Source of truth:** [brand-guide.html §12.2 + §12.4](../../design-system/brand-guide.html) · [ADR-0007 force-light](../../team/adr/ADR-0007-payload-login-customization.md) · [ADR-0011 sidebar icons](../../team/adr/ADR-0011-sidebar-icons-strategy.md)
**Status:** `spec-approved` (popanel autonomous-mode 2026-04-30)
**Skills активированы:** `blueprint`, `product-capability`
**Author:** popanel
**Date:** 2026-04-30

---

## Контекст

После merge PR #109 (W8 admin v2 prod alignment) оператор открыл prod /admin и зафиксировал **3 новых issue** (скриншоты 2026-04-30 evening):

1. **Favicon кривой** — выглядит как обрывок ico на admin tabs.
2. **Тёмная тема внутри панели** на edit view (`/admin/collections/services/X`): inputs тёмные, tabs тёмные, status bar тёмный, right sidebar тёмный — **всё кроме верхней части и sidebar**.
3. **Кривой лого в crumbs** — на скриншотах в top-bar `/admin/...` BrandIcon выглядит как обрезанный circle / мини-dot.

Все 3 — **regression / уже-существующие баги**, которые не были покрыты W1 (Wave 1 — palette baseline) или W8 (W8 — sidebar order + icons + dashboard hide). В W9 закрываем глубже.

---

## Root cause analysis (verified через Playwright DevTools)

### W9.1 · Force-light theme depth

**Проблема:** при `data-theme="dark"` (например `prefers-color-scheme: dark` в системных настройках браузера) Payload **инвертирует** `--theme-elevation-*` 0..1000 через `var(--color-base-N)` cascade (см. [`@payloadcms/ui/dist/scss/colors.scss` lines 190-212](../../site/node_modules/@payloadcms/ui/dist/scss/colors.scss)). Наш W1 `html[data-theme='dark']` блок переопределял только `--brand-obihod-*` и selected `--color-base-*` (0/50/100/150/200/900/1000), но **не сами** `--theme-elevation-*` напрямую. Результат: `--theme-elevation-100 = var(--color-base-800) = #1c1c1c` (наш :root override base-800), что делает input/tab background ink. Это и есть «тёмная тема внутри панели».

**Verified evaluation (до W9):**
```
--theme-bg: #111
--theme-elevation-0: #111
--theme-elevation-100: #1c1c1c
--theme-input-bg: #15140f
--theme-text: #f7f5f0
input.bg = rgb(247, 245, 240) [cream] BUT text color = rgb(230, 225, 214) [light cream] → cream-on-cream invisible
```

**Fix:** добавить direct override `--theme-elevation-0..1000` в нашем `html[data-theme='dark']` блоке custom.scss + `--theme-bg`, `--theme-input-bg`, `--theme-text` явно.

### W9.2 · BrandIcon 32×32 в `.step-nav` slot 20px

**Проблема:** `BrandIcon` в [`site/components/admin/BrandIcon.tsx`](../../site/components/admin/BrandIcon.tsx) был `width="32" height="32"`. Slot Payload `.step-nav` (top-bar breadcrumbs container) в edit views имеет height = 20px. SVG 32×32 рендерится с overflow → визуально выглядит как обрезанный circle / "О" (top half visible, bottom clipped).

**Verified DOM (до W9):**
```
.step-nav height = 20px
.step-nav__home svg box = 32×32  ← overflow
```

**Fix:** уменьшить SVG до 20×20 (size matches slot) + adjust internal sizing (cx/cy/r/font) так чтобы всё помещалось.

### W9.3 · Favicon type/url mismatch

**Проблема:** в `site/payload.config.ts`:
```ts
icons: [{ rel: 'icon', type: 'image/png', url: '/favicon.ico' }]
```
`type: 'image/png'` + url `.ico` — браузеры (особенно Chrome) могут отвергать как corrupt MIME mismatch → favicon не показывается или показывается «кривой».

**Fix:** правильный type для `.ico` + добавить PNG fallback для современных браузеров (Next.js auto-публикует `app/icon.png` → `/icon.png`).

---

## ADR-0005 уровни

| Подсистема | Уровень | Файл |
|---|---|---|
| W9.1 force-light depth | Уровень 1 (custom.scss) | `site/app/(payload)/custom.scss` lines 121+ extended |
| W9.2 BrandIcon size | Уровень 2 (custom React component override) | `site/components/admin/BrandIcon.tsx` |
| W9.3 favicon meta | Уровень 0 (config) | `site/payload.config.ts` admin.meta.icons |

---

## Acceptance criteria

### AC W9-1 Force-light theme depth
- [x] При `html[data-theme='dark']` `--theme-elevation-0..1000` равны light values (cream-to-ink scale, не invert).
- [x] `--theme-bg: #f7f5f0`, `--theme-input-bg: #ffffff`, `--theme-text: #1c1c1c` при dark theme.
- [x] Inputs в edit view имеют `background: rgb(255, 255, 255)` и `color: rgb(28, 28, 28)` независимо от data-theme.
- [x] Status bar / tabs / right sidebar остаются cream при dark theme.
- [x] Verified Playwright DOM eval после reload + `setAttribute('data-theme', 'dark')`.

### AC W9-2 BrandIcon size
- [x] BrandIcon SVG `width="20" height="20"` `viewBox="0 0 20 20"`.
- [x] В top-bar `.step-nav__home` иконка занимает 20×20 без overflow / clipping.
- [x] Контраст `#f7f5f0` на `#2d5a3d` ≥ 8.9:1 (WCAG AAA сохраняется).

### AC W9-3 Favicon
- [x] `payload.config.ts` admin.meta.icons:
  - `{ rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' }` (правильный MIME)
  - `{ rel: 'icon', type: 'image/png', url: '/icon.png' }` (PNG fallback)
- [x] `<link>` теги в admin DOM:
  ```
  rel=icon type=image/x-icon href=/favicon.ico
  rel=icon type=image/x-icon href=/favicon.ico (Next.js auto)
  rel=icon type=image/png href=/icon.png
  ```

### AC W9 общие
- [x] Light mode не сломан (regression check Playwright /admin/, /admin/collections/services, /admin/collections/services/5).
- [x] Dark mode (force) визуально идентичен light mode (3 screenshots в `screen/wave9-*-dark-*.png`).
- [x] Type-check 0 errors / lint 0 errors / format clean.
- [x] W1 + W8 e2e tests still passing.

---

## Out-of-scope (явные deferred)

- **`.payload__app` префикс cleanup** — большинство W1 правил (btn-primary, secondary, inputs focus, status pills, tabs) prefixed с `.payload__app` ancestor, который **отсутствует** на admin shell (только `.payload__modal-container` в DOM). Эти rules `dead code` на /admin/* routes, но визуально admin выглядит правильно благодаря `--theme-elevation-*` cascade (W9.1) и `:root` token overrides (W1 baseline). Cleanup не входит в W9 — отдельный backlog item `PANEL-CSS-PREFIX-CLEANUP` (RICE TBD, не блокер).
- **Создать button styling** — Payload использует `.btn--style-pill` для list-view "Создать" CTA, в brand-guide §12.4.1 primary CTA = янтарный. Native pill style сейчас #d6d0bf (line-hover). Не покрывается W9. Опционально → `PANEL-LIST-CREATE-AMBER` (RICE low).

---

## Hand-off log

```
21:00 operator → popanel: 3 issues после merge PR #109 (favicon кривой + тёмная тема внутри + кривой лого в crumbs) + запрос pristal'no audit
21:00 popanel → blueprint skill activation
21:05 popanel local-verify через Playwright + Payload source чтение → 3 root cause найдены (--theme-elevation-* override missing + BrandIcon 32→20 + favicon type mismatch)
21:30 popanel → fe-panel (autonomous): 3 fixes — custom.scss + BrandIcon.tsx + payload.config.ts
21:50 popanel local-verify forced-dark + light: все 3 AC pass (3 screenshots evidence в screen/wave9-*.png)
22:00 popanel → qa-panel (autonomous): 2 W9 e2e tests
22:15 popanel → do (autonomous): green CI
22:30 popanel → release: готов к gate (PR #110)
```

---

## Артефакты

- [`site/app/(payload)/custom.scss`](../../site/app/(payload)/custom.scss) — `html[data-theme='dark']` block extended +25 lines (`--theme-elevation-0..1000` + `--theme-bg/input-bg/text`).
- [`site/components/admin/BrandIcon.tsx`](../../site/components/admin/BrandIcon.tsx) — 32→20px rewrite.
- [`site/payload.config.ts`](../../site/payload.config.ts) — admin.meta.icons fix.
- [`site/tests/e2e/admin-design-compliance.spec.ts`](../../site/tests/e2e/admin-design-compliance.spec.ts) — W9 test cases.
- `screen/wave9-edit-view-dark-final.png`, `screen/wave9-list-view-dark-fixed.png`, `screen/wave9-dashboard-light.png` — evidence.
