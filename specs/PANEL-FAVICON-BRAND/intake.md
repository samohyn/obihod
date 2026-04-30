---
us: PANEL-FAVICON-BRAND
title: Бренд-favicon ОБИХОД на всём периметре сайта
team: panel
po: popanel
type: bug + feature
priority: P0
segment: cross-site (admin + public)
phase: intake
role: popanel
status: intake
blocks: []
blocked_by: [art-favicon-svg-asset]
related: [US-12-admin-redesign, US-12-W9 (favicon meta type fix)]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, frontend-patterns, brand]
---

# PANEL-FAVICON-BRAND — Бренд-favicon ОБИХОД (panel + публичный сайт)

**Автор intake:** popanel
**Дата:** 2026-05-01
**Источник:** запрос оператора 2026-05-01 на скрине `/admin` («favicon сейчас не тот — на всех страницах сайта перепроверить, в панели сейчас чёрный круг с белым треугольником»)
**Тип:** bug fix + brand asset rollout
**Срочность:** **P0** — bp-уровень: дефолтный Next.js favicon (чёрный круг с белым треугольником = Vercel ▲) виден в браузерной вкладке на всех страницах публичного сайта и в `/admin`. Это удар по brand perception. RICE 38 — топ panel.next.
**Сегмент:** cross-site (panel + публичный сайт)

---

## Skill activation (iron rule)

`popanel` (intake) активирует **`design-system`** + **`brand`** для сверки favicon с §3 Logo (master lockup) и §12 Payload admin meta. `fe-panel` + `fe-site` активируют **`frontend-patterns`** + **`nextjs-turbopack`** (Next.js 16 favicon convention) при wiring.

---

## Исходный запрос оператора (2026-05-01)

> favicon сейчас не тот - на всех страницах сайта перероверить (в панели щас черный круг с белым треугольником)

---

## Резюме задачи

В `site/app/favicon.ico` лежит дефолтный Next.js favicon (Vercel ▲ glyph), который Next.js 16 автоматически подсасывает в `<head>` для всех публичных страниц. В `/admin` Payload подсасывает тот же `/favicon.ico` через `payload.config.ts` `admin.meta.icons[]` (W9 fix). Бренд-favicon ОБИХОД (master lockup §3 brand-guide) ни разу не был положен в проект.

**Цель:** заменить дефолтный favicon на бренд ОБИХОД на ВСЁМ периметре (publicсайт + admin) с правильным набором форматов под все браузеры и iOS/Android home-screen.

---

## Deliverables (что считается готовым)

| # | Артефакт | Owner | Путь |
|---|---|---|---|
| 1 | **Master favicon SVG** — упрощённая адаптация §3 master lockup для 16×16 / 32×32 (читаемая буква «О» в круге, бренд-зелёный `#2d5a3d` или контурный вариант) | `art` через `cpo` trigger | `site/public/favicon.svg` |
| 2 | **favicon.ico** мульти-resolution (16/32/48px) | `art` (export from SVG) | `site/app/favicon.ico` (заменяет дефолтный Next.js) |
| 3 | **apple-touch-icon.png** 180×180 | `art` | `site/public/apple-touch-icon.png` |
| 4 | **icon.png** 192×192 + **icon-512.png** 512×512 (PWA / Android) | `art` | `site/public/icon-192.png`, `site/public/icon-512.png` |
| 5 | **site.webmanifest** обновление (если нет — создать с brand name + theme_color `#2d5a3d` + icons[]) | `fe-site` | `site/public/site.webmanifest` |
| 6 | **`<head>` meta sync** (Next.js metadata API в root layout) | `fe-site` | `site/app/layout.tsx` |
| 7 | **`payload.config.ts` admin meta sync** — обновление `admin.meta.icons[]` под новый набор (W9 уже завёл паттерн) | `fe-panel` | `site/payload.config.ts` |
| 8 | **QA cross-browser smoke** — Chrome / Safari / Firefox + iOS Safari home-screen + Android Chrome home-screen | `qa-panel` + `qa-site` | screenshots в `screen/favicon-*.png` |
| 9 | **cr-panel + cr-site** double-review (потому что cross-team) | `cr-panel` + `cr-site` | в PR review |

---

## Ключевые вопросы / технические детали

1. **Стиль favicon** — solid fill «О» в зелёном круге vs контурный line-art. PO рекомендация: **solid fill** (более читаемо @ 16×16). Финал — `art`.
2. **PWA-готовность** — добавить ли site.webmanifest сейчас или отдельным US? PO рекомендация: **сейчас**, минимальный manifest без install-promotion (theme_color + name + 2 icon-размера). Stand-alone PWA-режим — отдельный US в panel.later.
3. **Admin vs publik — один favicon или разные?** PO рекомендация: **один** (бренд един). Payload в W9 уже подсасывает публичный favicon — паттерн валиден.
4. **CDN cache invalidation** — после deploy браузеры могут держать старый favicon неделями. Mitigation: добавить query-param `?v=2` в meta-ссылки на первый деплой; через 2 недели убрать.

---

## Состав команды и расчёт нагрузки

| Роль | Задача | Чд |
|---|---|---|
| `art` (через cpo trigger) | Master SVG + ico + 4 PNG raster + sign-off на §3 compliance | 0.2 |
| `fe-site` | layout.tsx metadata API + site.webmanifest | 0.1 |
| `fe-panel` | payload.config.ts admin.meta.icons sync | 0.05 |
| `qa-panel` + `qa-site` | Cross-browser + iOS/Android home-screen smoke | 0.1 |
| `cr-panel` + `cr-site` | Double-review | 0.05 |
| **Итого** | | **~0.5 чд** |

**Timeline:** 1-2 рабочих дня (зависит от загрузки `art`).

---

## Open questions to operator

1. **Style** — solid fill «О» в зелёном круге (рекомендация PO) vs контурный? Финальный апрув — после превью от `art` (3 варианта).
2. **PWA manifest** — включить в этот US (рекомендация) или отдельный US? Если позже — добавит `art` или `do`.
3. **Cache busting** — `?v=2` query на 2 недели — ОК?

(Если оператор молчит — иду по рекомендациям PO без эскалации.)

---

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | art (через cpo trigger) | intake.md готов. Прошу мастер-SVG favicon из §3 brand-guide master lockup + 4 raster-export'а (16/32/180/192/512) + sign-off на §3 compliance. Дедлайн — 1 чд. Cross-team trigger через cpo (потому что art — отдельная команда design). |
| 2026-05-01 | popanel | sa-panel | прошу мини-spec (sa-panel-favicon.md) — DoD + acceptance + cross-browser-smoke checklist + W9 admin.meta.icons regression — после получения assets от art. |
