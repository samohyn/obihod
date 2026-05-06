---
adr: 0018
title: URL-map EPIC-SEO-COMPETE-3 — uborka-territorii как 5-й pillar + новые routes
status: draft
deciders: [tamd, poseo, sa-seo, operator]
date: 2026-05-06
related: [EPIC-SEO-COMPETE-3]
---

# ADR-0018 — URL-map EPIC-SEO-COMPETE-3

## Контекст

Запрос оператора 2026-05-06 — обогнать liwood.ru / arborist.su / arboristik.ru. Ключевые insights:
- arboristik.ru `/tsenyi/` приносит 33% трафика (455 it50, vis 4 861) — нужен зеркальный mega-прайс
- arborist.su B2B-нормативка `/services/oformlenie-dokumentatsii/<doc>/` — 6 лендингов whitespace
- Whitespace `<service> × <city МО>` — НИ один из 3 не делает programmatic geo
- arboristik whitespace 30%+ ёмкости в кластере «уборка территории» (vyravnivanie/raschistka/pokos)

Operator 2026-05-06 через AskUserQuestion approved: `/uborka-territorii/` — **новый 5-й pillar** (не sub арбористики).

## Решение

### Pillars (5 шт)

| URL | Pillar | Источник |
|---|---|---|
| `/vyvoz-musora/` | Вывоз мусора | sustained |
| `/arboristika/` | Арбористика | sustained |
| `/demontazh/` | Демонтаж | sustained |
| `/uborka-snega-i-chistka-krysh/` | Уборка снега + чистка крыш | sustained |
| `/uborka-territorii/` | **Уборка территории** | **новый, 2026-05-06** |

### Sub-pages под каждый pillar

`/<pillar>/<sub>/` — закрывает коммерч-кластеры из US-1 (`lead` + `pricing` интенты).

Под `/uborka-territorii/`:
- `/uborka-territorii/vyravnivanie-uchastka/`
- `/uborka-territorii/raschistka-uchastka/`
- `/uborka-territorii/pokos-travy/`
- `/uborka-territorii/vyvoz-porubochnyh-ostatkov/`

### Programmatic SD (`<service> × <city>`)

`/<pillar>/<sub>/<city>/` — сохраняем существующий ServiceDistricts pattern. Таргет 30-50 МО-городов × 5 pillar = 150-250 SD. Это whitespace, который ни один из 3 конкурентов не делает.

**Включаем uborka-territorii в ServiceDistricts matrix.**

### Новые routes (вне pillar-tree)

| URL | Назначение | US |
|---|---|---|
| `/uslugi/tseny/` | Mega-прайс хаб (зеркало arboristik) | US-4 |
| `/uslugi/tseny/<pillar>/` (5 шт) | Углублённая матрица per pillar | US-4 |
| `/blog/<slug>/` | Контент-машина 30 info-articles | US-5 (sustained route) |
| `/b2b/<doc-type>/` | 6 нормативных лендингов | US-6 (sustained route) |
| `/kalkulyator/foto-smeta/` | USP калькулятор | US-8 |
| `/kontakty/` | Контактная страница + NAP + map | US-8 |
| `/otzyvy/` | Агрегатор отзывов + Review schema | US-9 |
| `/kejsy/` + `/kejsy/<slug>/` | Кейсы (sustained) | US-11 (наполнение) |
| `/avtory/` + `/avtory/<slug>/` | Авторы (sustained, наполнение в US-11) | US-11 |
| `/sro-licenzii/` | СРО + страховка (sustained, расширение в US-11) | US-11 |

### Канонизация

- Каждая страница — `canonical` → self
- Pricing-cluster (`<pillar>/<sub>/`) → НЕ канонизирует на `/uslugi/tseny/<pillar>/` (разные интенты: lead vs pricing)
- ServiceDistricts canonical → self (НЕ на pillar)
- Blog canonical → self
- B2B canonical → self

### Redirects (если миграция)

Ни одного redirect не требуется — все routes новые или sustained. **Выпускаем чистым.** Если в US-2 обнаружим конфликт с existing slug — добавим в Redirects collection.

### sitemap.xml priority

| URL pattern | Priority | Changefreq |
|---|---:|---|
| `/` (homepage) | 1.0 | weekly |
| `/<pillar>/` | 0.9 | weekly |
| `/<pillar>/<sub>/` | 0.85 | weekly |
| `/<pillar>/<sub>/<city>/` | 0.8 | monthly |
| `/uslugi/tseny/` + `/uslugi/tseny/<pillar>/` | 0.8 | weekly |
| `/b2b/<doc>/` | 0.75 | monthly |
| `/blog/<slug>/` | 0.7 | weekly |
| `/kejsy/<slug>/` | 0.65 | monthly |
| `/avtory/<slug>/` | 0.6 | monthly |
| `/otzyvy/` | 0.6 | weekly |
| `/kontakty/` | 0.6 | yearly |
| `/kalkulyator/foto-smeta/` | 0.6 | yearly |
| `/sro-licenzii/` | 0.5 | yearly |

## Альтернативы

### A) `/uborka-territorii/` как sub арбористики (`/arboristika/uborka-territorii/`)

**Минусы:**
- Конфликт интентов: «спил дерева» и «выравнивание участка» — разные jobs-to-be-done
- arboristik whitespace по vyravnivanie/raschistka/pokos сильнее всего разворачивается под отдельным pillar (4-7 sub в одном pillar = mega-cluster)
- ServiceDistricts matrix не поддержит 8+ sub под одним pillar чисто
- TOV «арбористика» (зелёные насаждения) ≠ TOV «уборка территории» (земляные работы)

**Отвергнуто** оператором 2026-05-06.

### B) Out-of-scope (отдельный EPIC потом)

**Минусы:** Минус ~30% коммерч-ёмкости arboristik whitespace, теряем W14 DoD.

**Отвергнуто** оператором 2026-05-06.

### C) `/uborka-territorii/` принят (✅)

**Плюсы:**
- Закрывает arboristik whitespace полностью
- Чистая интент-границы между pillar
- ServiceDistricts расширяется автоматически
- Brand-guide TOV §13 — Caregiver+Ruler работает для обоих pillar

**Минусы:**
- +1 неделя на seed контента (US-7)
- Нужны 4 новых sub-templates (US-2 + US-7)

**Принято.**

## Последствия

### Положительные

- Покрытие 5 pillar × 30-50 cities × ~5 sub = ~750-1 250 потенциальных URL (whitespace)
- Mega-прайс хаб + B2B вкладка — закрывают ёмкость arboristik+arborist
- Контент-машина `/blog/` зеркалирует liwood

### Отрицательные

- Нагрузка на podev: 6 новых routes (`/uslugi/tseny/`, `/uslugi/tseny/<pillar>/`, `/kontakty/`, `/kalkulyator/foto-smeta/`, `/otzyvy/`, опциональные redirect-handlers). Через `cpo` согласовать в W2.
- Нагрузка на cw: 30 articles + 6 b2b + 50-150 SD intro + 6 pillar/sub copy + 4 новых uborka-territorii sub. Двойная команда seo-content + cw в W3-W12.

### Технический долг

- Reviews collection — новая, миграция через dba (US-9).
- PricingTiers collection или Globals.PriceCatalog — решение в US-4 (DB-driven обязательно).

## Действия

| Кто | Когда | Что |
|---|---|---|
| **tamd** | W2 | Review этого ADR + approve (или request changes) |
| **poseo** | W2 | После tamd approve — статус `accepted` + handoff к sa-seo для US-2 |
| **sa-seo** | W2 | Применить URL-map в US-2 spec (URL-инвентарь JSON) |
| **seo-tech** | W3 | sitemap.ts расширение per priority-таблица |
| **podev** (через cpo) | W2 | Approve нагрузки на 6 новых routes + 1-2 collections |

## Hand-off log

- 2026-05-06 14:00 · poseo: ADR-0018 skeleton draft создан в bootstrap PR EPIC-SEO-COMPETE-3
- 2026-05-06 14:00 · poseo → tamd: review request, deadline W2 (2026-05-13)
