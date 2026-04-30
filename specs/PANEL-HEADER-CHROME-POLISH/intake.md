---
us: PANEL-HEADER-CHROME-POLISH
title: Polish-волна header /admin — home-icon + dark-toggle stub + breadcrumb «О» fix
team: panel
po: popanel
type: feature + bug
priority: P1
segment: admin
phase: intake
role: popanel
status: blocked-by-audit
blocks: []
blocked_by: [PANEL-UX-AUDIT]
related: [US-12-admin-redesign, US-12-W8 (sidebar icons), US-12-W9 (BrandIcon)]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, ui-styling, frontend-patterns, accessibility]
---

# PANEL-HEADER-CHROME-POLISH — Polish-волна header /admin

**Автор intake:** popanel
**Дата:** 2026-05-01
**Источник:** запрос оператора 2026-05-01 (3 точечных правки на скриншотах /admin) + UX recommendations из PANEL-UX-AUDIT
**Тип:** feature (home-icon, dark-toggle stub) + bug fix (breadcrumb «О» alignment)
**Срочность:** P1 — после US-12 release closure, параллельно с PANEL-LEADS-INBOX
**Сегмент:** admin (top-bar / breadcrumbs / header chrome)
**Blocked by:** PANEL-UX-AUDIT (нужны А/В/С-рекомендации по placement)

---

## Skill activation (iron rule)

Активируется когда `sa-panel` начнёт писать `sa-panel-header-chrome.md` (после получения findings от ux-panel). Pre-activate: **`design-system`** (§9 Icons + §12.2 Sidebar/Topbar + §12.4 Interaction states), **`ui-styling`** (token-correct CSS), **`frontend-patterns`** (Payload custom components — паттерн W3 LeadsBadge переиспользуем), **`accessibility`** (focus-visible + aria-label + WCAG 2.2 AA touch targets 44×44 W6).

---

## Исходный запрос оператора (2026-05-01)

> я бы добавил переключатель темной темы кнопку в личный кабинет /admin (но пока сделаем ее не рабочей, позже привяжем логику)
> на скриншоте я показываю иконку в красном прямоугольнике как будто она кривовата (проверить не съехала ли она)
> я бы добавил куда то где показывает красная стрелочка на скрине в панели иконку домика которая бы возвращала на главную страницу

---

## Резюме задачи

3 точечные правки в panel header chrome, объединённые в одну волну (тематически связаны: всё header / top-bar / breadcrumbs):

1. **Home-icon** в top-bar → ссылка на публичную главную `obikhod.ru/` (открывается в новой вкладке `target="_blank"`). Placement определяется по А/В/С-рекомендации `ux-panel`.
2. **Dark-theme toggle** — кнопка переключения темы в `/admin`, **UI-only stub** на этом этапе. Логика toggling темы (CSS variables swap + persistence в `localStorage` + Payload user pref) — отдельный US в panel.later (PANEL-DARK-THEME-LOGIC). Placement — по А/В/С-рекомендации `ux-panel`.
3. **Breadcrumb «О» alignment** — иконка `BrandIcon` в breadcrumbs (зелёный круг с буквой «О» рядом с `/ Панель ▾`) выглядит кривовато. Probe `ux-panel` определит причину (SVG path / round container / typography baseline / margin inheritance). Fix — точечный CSS / SVG patch.

---

## Deliverables (что считается готовым)

| # | Артефакт | Owner | Путь |
|---|---|---|---|
| 1 | `sa-panel-header-chrome.md` — спека с 3 sub-tasks, AC по каждой, brand-guide §12 mapping, A11y checklist, mobile @ 375px поведение | sa-panel | `specs/PANEL-HEADER-CHROME-POLISH/sa-panel-header-chrome.md` |
| 2 | Home-icon component + wiring | fe-panel | `site/app/(payload)/admin/components/HomeIcon.tsx` или extension custom.scss + Payload slot |
| 3 | Dark-theme toggle UI-only stub (button + sun/moon icon swap on click без реального theme apply) | fe-panel | `site/app/(payload)/admin/components/ThemeToggle.tsx` |
| 4 | Breadcrumb «О» alignment fix — точечный patch (CSS или SVG) | fe-panel | `site/app/(payload)/custom.scss` |
| 5 | QA по brand-guide §12 + a11y axe-core route + mobile smoke @ 375px | qa-panel | `screen/header-chrome-polish-*.png` |
| 6 | cr-panel review | cr-panel | в PR |

---

## Ключевые вопросы (закроются на spec этапе)

1. **Home-icon glyph** — какой из §9 brand-guide icon-set'ов? Кандидат: line-art house / line-art arrow-out-to-site. PO рекомендация: **line-art house** (универсально). Финал — `art` consult если такого нет в §9.
2. **Home-icon placement** — A (рядом с collapse `<` в верху сайдбара), B (top-bar справа), C (внутри user-menu dropdown). Финал — UX audit А/В/С-рекомендация.
3. **Dark-toggle placement** — A (user-menu dropdown), B (top-bar отдельная кнопка), C (settings page). Финал — UX audit.
4. **Dark-toggle visual state** — sun/moon swap on click. Хранение state в этом US? PO рекомендация: **нет** — toggle визуально переключается на click, но при reload возвращается в default (light). Это явно UI-only stub. Persistence + theme apply — следующий US.
5. **Breadcrumb «О» — root cause** — определит ux-panel probe (DOM inspect zoom). Возможные причины: (a) SVG viewBox не центрирован, (b) flex-align baseline вместо center, (c) кириллический «О» сдвинут от latin baseline в Golos Text (требует font-feature settings), (d) round container `border-radius: 50%` + buttonelement padding mismatch.

---

## Состав команды и расчёт нагрузки

| Роль | Задача | Чд |
|---|---|---|
| `sa-panel` | Спека (sa-panel-header-chrome.md) с AC + brand-guide §12 mapping + UX audit findings sync | 0.4 |
| `fe-panel` | Реализация home-icon + dark-toggle stub + breadcrumb fix | 0.7 |
| `qa-panel` | Brand-guide §12 mapping check + a11y axe + mobile @ 375px smoke | 0.2 |
| `cr-panel` | Review | 0.1 |
| **Cross-team consult** |||
| `art` (если новый glyph) | Sign-off на home-icon если нет в §9 brand-guide | 0.1 |
| **Итого** | | **~1.5 чд** |

**Timeline:** 2-3 рабочих дня после разблокировки PANEL-UX-AUDIT.

---

## Open questions to operator

(Закроются по итогам PANEL-UX-AUDIT + sa-panel spec — поднимаются если PO сомневается. Сейчас sa-panel может писать после получения UX findings без эскалации.)

---

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | sa-panel | intake.md готов, blocked-by PANEL-UX-AUDIT. Когда `note-uxpanel.md` готов с А/В/С-рекомендациями по 3 пинам — start writing `sa-panel-header-chrome.md`. Spec-before-code iron rule — dev НЕ стартует без approve. |
