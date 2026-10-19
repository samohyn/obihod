# leadqa-PAN-18 · /admin/login pixel-perfect §12.1

**Issue:** PAN-18 (PAN-12 epic, US-12 admin redesign)
**Branch:** `fix/pan-18-login-design-system-1to1`
**Date:** 2026-04-29
**Verifier:** popanel (acting leadqa, operator mandate 2026-04-29 «1 в 1»)

## Verdict: **APPROVE → merge → deploy**

Pixel-perfect совпадение `/admin/login` с brand-guide §12.1 mockup достигнуто.

## Evidence

| Источник | Файл |
|---|---|
| Mockup §12.1 (truth) | [screen/pan-18-mockup-12.1-source.png](../../screen/pan-18-mockup-12.1-source.png) |
| Local localhost:3000/admin/login | [screen/pan-18-login-1to1-final.png](../../screen/pan-18-login-1to1-final.png) |
| Промежуточный (с дефолт Payload Logo, ДО fix) | [screen/pan-18-login-1to1-local.png](../../screen/pan-18-login-1to1-local.png) |

## AC compliance (sa-panel-wave2a-v2.md AC-1..34)

| AC | Status | Evidence |
|---|---|---|
| AC-1..5 (functional, native form) | ✅ | Playwright: form / inputs / submit / forgot link / `/admin/` redirect — все green |
| AC-6 background `#f7f5f0` | ✅ | computed `--brand-obihod-paper === '#f7f5f0'` |
| AC-7..10 form 320px / white / 32px / 10px | ✅ | computed match |
| AC-11..13 submit янтарный + hover + focus | ✅ | computed `rgb(230,162,60)` + ink color |
| AC-14..16 lockup / tagline / footer | ✅ | DOM render + getByText/getByLocator |
| AC-22 local verification evidence | ✅ | screenshots above |
| AC-23 Playwright spec green | ✅ | **16/16 passed** локально (`pnpm exec playwright test admin-login --project=chromium`) |
| AC-24 type-check + lint + format | ✅ | tsc clean, 0 lint errors, prettier passed |
| AC-27 lockup is real horizontal-compact.svg | ✅ | inline JSX порт `agents/brand/logo/horizontal-compact.svg`, SVG `<text>ОБИХОД</text>` найден |
| AC-28 labels 13/500/ink/6mb | ✅ | computed match |
| AC-29 inputs 9/12 padding, 14px font, 6px radius, `#e6e1d6` border | ✅ | computed match |
| AC-31 submit width full-width | ✅ | computed `254px` (= 320 − 2 border − 64 padding, box-sizing border-box) |
| AC-32 link color `#2d5a3d` / no underline / center / mt 16 | ✅ | computed match |
| AC-33 field margin-bottom 16px | ✅ | computed match |
| AC-34 visual diff vs §12.1 | ✅ | side-by-side скриншоты, расхождений нет |

## Что было сделано

| Файл | Изменение |
|---|---|
| `site/components/admin/BeforeLoginLockup.tsx` | Replaced inline self-drawn `SeasonsCircleMark` + отдельный wordmark на real `horizontal-compact.svg` (inline JSX, детальный 4-квадрант знак с wordmark внутри одного SVG, 1280×480 viewBox, height 56px) |
| `site/app/(payload)/custom.scss` | Добавлены: hide `.template-minimal__wrap .login__brand` (default Payload logo), `.login__form label` (13/500/ink/6mb), `.login__form input` full style (padding/font/border/radius/width), focus 2px solid primary, `.login__form a` (3px order, color/decoration/center/«→» suffix), `.login__form .field-type` (16px mb), flex column + order (link AFTER submit) |
| `site/tests/e2e/admin-login.spec.ts` | +8 tests under PAN-18 (AC-27..33), fix старого ОБИХОД test под SVG `<text>` selector, fix submit width 254px (border-box) |
| `specs/US-12-admin-redesign/sa-panel-wave2a-v2.md` | Addendum V2.6–V2.11 + AC-27..34 (operator pixel-perfect mandate) |

## Что НЕ было сделано (по дизайну)

- Magic link auth — Wave 2.B (PAN-11), отдельная задача
- Mobile responsive ≤640px — Wave 6 (PAN-7)
- Dark mode toggle — out of scope (brand-guide §12 = light only)

## Process compliance (iron rules)

- ✅ Spec-before-code: `sa-panel-wave2a-v2.md` расширен V2.6–V2.11 + AC-27..34 ДО dev
- ✅ Local verification ДО push: Docker Postgres + pnpm dev + real browser screenshot + Playwright 16/16 green
- ✅ skill-check: `project-flow-ops` активирован

## Deploy checklist для operator

1. Approve этот отчёт.
2. `do` мержит PR в `main`.
3. CI green → `do` deploy на прод.
4. После deploy: `do` smoke step (PAN-17 уже добавил `curl /admin/login | grep "form"`) — pass / fail.
5. Если pass — operator открывает прод `/admin/login`, верифицирует визуально.

---

**Передаю → operator для approve & deploy.**
