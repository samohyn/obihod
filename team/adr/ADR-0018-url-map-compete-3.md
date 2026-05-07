---
adr: 0018
title: URL-map EPIC-SEO-COMPETE-3 — uborka-territorii как 5-й pillar + новые routes
status: accepted_with_changes
deciders: [tamd, poseo, sa-seo, operator]
date: 2026-05-06
related:
  - EPIC-SEO-COMPETE-3
  - seosite/strategy/02-url-map.json
  - seosite/strategy/01-semantic-core.md
  - seosite/02-keywords/derived/clusters-tfidf.csv
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
| `/chistka-krysh/` | Чистка крыш и уборка снега | **sustained** (2026-05-06 решение НЕ переименовывать в `/uborka-snega-i-chistka-krysh/` — sustained pillar slug сохраняет incoming SEO + Я.Метрика baseline; semantic coverage обеспечивается через new sub-pages `cena` / `krysha-ot-naledi` / `v-moskve` / `uborka-snega-uchastok`) |
| `/uborka-territorii/` | **Уборка территории** | **новый, 2026-05-06** |

### Sub-pages: 18 sustained + 17 new = **35 sub** (derived из US-1 + audit `site/scripts/seed.ts`)

Машиночитаемая полная структура — `seosite/strategy/02-url-map.json`. Здесь human-readable summary (📌 = sustained existing, ➕ = new):

| Pillar | Sub | URL | Status | Cluster | wsk |
|---|---|---|---|---|---:|
| **vyvoz-musora** | vyvoz-stroymusora | `/vyvoz-musora/vyvoz-stroymusora/` | 📌 sustained | — | — |
| | vyvoz-sadovogo-musora | `/vyvoz-musora/vyvoz-sadovogo-musora/` | 📌 sustained | — | — |
| | uborka-uchastka | `/vyvoz-musora/uborka-uchastka/` | 📌 sustained | — | — |
| | staraya-mebel | `/vyvoz-musora/staraya-mebel/` | 📌 sustained | — | — |
| | tbo | `/vyvoz-musora/tbo/` | ➕ new | sustained_us4_1 | — |
| | kgm | `/vyvoz-musora/kgm/` | ➕ new | sustained_us4_1 | — |
| | konteyner | `/vyvoz-musora/konteyner/` | ➕ new | sustained_us4_1 | — |
| | vyvoz-snega | `/vyvoz-musora/vyvoz-snega/` | ➕ new | C1 | 139 |
| **arboristika** | spil-dereviev | `/arboristika/spil-dereviev/` | 📌 sustained (orthography 'и') | — | — |
| | kronirovanie | `/arboristika/kronirovanie/` | 📌 sustained | C4_part | — |
| | udalenie-pnya | `/arboristika/udalenie-pnya/` | 📌 sustained | — | — |
| | avariynyy-spil | `/arboristika/avariynyy-spil/` | 📌 sustained | — | — |
| | sanitarnaya-obrezka | `/arboristika/sanitarnaya-obrezka/` | 📌 sustained | — | — |
| | obrabotka-ot-koroeda | `/arboristika/obrabotka-ot-koroeda/` | ➕ new | sustained | — |
| | vykorchevanie-pney | `/arboristika/vykorchevanie-pney/` | ➕ new | C42_part | — |
| | izmelchenie-vetok | `/arboristika/izmelchenie-vetok/` | ➕ new | C42+C45 | — |
| | obrezka-derevev | `/arboristika/obrezka-derevev/` | ➕ new | C4 | — |
| **demontazh** | demontazh-dachi | `/demontazh/demontazh-dachi/` | 📌 sustained | — | — |
| | demontazh-bani | `/demontazh/demontazh-bani/` | 📌 sustained | — | — |
| | demontazh-saraya | `/demontazh/demontazh-saraya/` | 📌 sustained | — | — |
| | snos-zdaniy | `/demontazh/snos-zdaniy/` | ➕ new | C31 | 98 |
| | demontazh-zaborov | `/demontazh/demontazh-zaborov/` | ➕ new | sustained_us2_followup | — |
| | demontazh-betona | `/demontazh/demontazh-betona/` | ➕ new | sustained_us2_followup | — |
| | uborka-stroitelnogo-musora | `/demontazh/uborka-stroitelnogo-musora/` | ➕ new | sustained_us2_followup | — |
| **chistka-krysh** | chistka-krysh-chastnyy-dom | `/chistka-krysh/chistka-krysh-chastnyy-dom/` | 📌 sustained | — | — |
| | chistka-krysh-mkd | `/chistka-krysh/chistka-krysh-mkd/` | 📌 sustained | — | — |
| | sbivanie-sosulek | `/chistka-krysh/sbivanie-sosulek/` | 📌 sustained | — | — |
| | chistka-krysh-ot-snega | `/chistka-krysh/chistka-krysh-ot-snega/` | 📌 sustained | — | — |
| | chistka-krysh-uborka-territorii-zima | `/chistka-krysh/chistka-krysh-uborka-territorii-zima/` | 📌 sustained | — | — |
| | chistka-krysh-dogovor-na-sezon | `/chistka-krysh/chistka-krysh-dogovor-na-sezon/` | 📌 sustained | — | — |
| | cena | `/chistka-krysh/cena/` | ➕ new | C34 | 823 |
| | krysha-ot-naledi | `/chistka-krysh/krysha-ot-naledi/` | ➕ new | C56 | 850 |
| | v-moskve | `/chistka-krysh/v-moskve/` | ➕ new | C21 | 714 |
| | uborka-snega-uchastok | `/chistka-krysh/uborka-snega-uchastok/` | ➕ new | sustained | — |
| **uborka-territorii** | vyravnivanie-uchastka | `/uborka-territorii/vyravnivanie-uchastka/` | ➕ new | C43+C6+C9 | 745 |
| (operator approved 2026-05-06) | raschistka-uchastka | `/uborka-territorii/raschistka-uchastka/` | ➕ new | C15 | 168 |
| | pokos-travy | `/uborka-territorii/pokos-travy/` | ➕ new | C12 | 913 |
| | vyvoz-porubochnyh-ostatkov | `/uborka-territorii/vyvoz-porubochnyh-ostatkov/` | ➕ new | C45_part | — |

### Programmatic SD — **2-сегмент `/<pillar>/<city>/` (sustained pattern)**

**REC #1 уточнение (после tamd review 2026-05-06):** sustained route — `app/(marketing)/[service]/[district]/page.tsx` рендерит **2-сегмент** `/<pillar>/<city>/`, **НЕ 3-сегмент** `/<pillar>/<sub>/<city>/`. Уточнение:

| Pattern | Sustained? | Use case |
|---|---|---|
| `/<pillar>/<city>/` | ✅ sustained ServiceDistricts | Programmatic SD — pillar-уровень × city × intent (lead). Расширяется с текущих ~211 SD до 400-600. |
| `/<pillar>/<sub>/` | ✅ sustained `[service]/[sub]/page.tsx` | Sub-page без geo-modifier. См. таблицу выше. |
| `/<pillar>/<sub>/<city>/` | ❌ **out of scope EPIC-SEO-COMPETE-3** | Требует новый файл `app/(marketing)/[service]/[sub]/[district]/page.tsx` + расширение ServiceDistricts collection (composite key sub+city). **Sustained для US-2 follow-up.** |

**Решение:** US-7 расширяет SD только на pillar-уровне (`/<pillar>/<city>/`). Sub × city — отдельный track в US-2 follow-up (если whitespace анализ покажет ROI).

**Включаем uborka-territorii в sustained ServiceDistricts matrix.** Bulk-seed создаёт 30-50 city × 1 pillar × ServiceDistrict row.

**Тарget:** 30-50 МО-городов × 5 pillars = **150-250 SD**. Whitespace — никто из 3 конкурентов не делает geo-programmatic.

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

### 13 SEO-правил (canonical + robots-meta + URL conventions + H1 differentiation)

**REC #2 после tamd review:** переименовано из «canonical правил» — реально это смесь правил canonical-tag + robots-meta + URL conventions + H1 templates. Правила #4, #10, #11 — не canonical-tag.

| # | Правило | Rationale |
|---|---|---|
| 1 | `canonical = self` для всех опубликованных URL | По умолчанию, базовая защита от дубликатов |
| 2 | `/<pillar>/<sub>/` НЕ канонизирует на `/uslugi/tseny/<pillar>/` | Разные интенты: pillar/sub = lead, tseny/pillar = pricing |
| 3 | `/<pillar>/<sub>/<city>/` (SD) НЕ канонизирует на pillar/sub | Local-intent отличается от non-geo |
| 4 | SD draft (без miniCase или localFaq < 2) → `noindex` (sustained pattern) | Защита от thin-content |
| 5 | `/uslugi/tseny/<pillar>/` НЕ канонизирует на `/uslugi/tseny/` | Глубина = разные ёмкости запросов |
| 6 | `/blog/<slug>/` canonical → self | Авторская атрибуция требует уникальности |
| 7 | `/b2b/<doc>/` canonical → self + цитата на PDF в `mainEntity.contentUrl` | Schema-driven, не canonical-replacement |
| 8 | `/avtory/<slug>/` canonical → self (Person schema) | E-E-A-T axis |
| 9 | `/kejsy/<slug>/` canonical → self | Каждый кейс уникален |
| 10 | Trailing slash обязателен (Next.js `trailingSlash: true` уже sustained) | sustained от существующего sitemap |
| 11 | URL все lowercase, kebab-case slugs | sustained convention |
| 12 | Query-параметры (`?utm_*`, `?ref=`) → канонизация на base URL | sustained стандарт |
| **13** | **H1 differentiation: `/<pillar>/` H1 = lead-intent («Услуги X — заказать в МО»), `/uslugi/tseny/<pillar>/` H1 = pricing-intent («Цены на X — прайс 2026 МО»). Разные template-блоки.** | **Снимает risk каннибализации (REC #3 tamd 2026-05-06). Реализуется в seo-tech US-3 + контент US-4** |

### Redirects (миграция existing → new)

**Решение 2026-05-06:** sustained slugs сохраняются. **0 redirect-records требуется** — операция clean (без миграции).

| Существующий URL | Действие | Reason |
|---|---|---|
| `/[service]/` (4 sustained: arboristika, vyvoz-musora, demontazh, chistka-krysh) | **Sustained, no rename, no redirect** | Сохраняем incoming SEO + Я.Метрика baseline |
| `/[service]/[district]/` SubServiceView | **Sustained**, расширяется в US-7 | Уже работающий programmatic |
| Все sustained sub-pages (18 шт) | **Sustained, no redirect** | См. таблицу выше |
| `/kejsy/`, `/blog/`, `/raiony/`, `/komanda/`, `/avtory/`, `/sro-licenzii/`, `/o-kompanii/`, `/garantii/`, `/kak-my-rabotaem/`, `/park-tehniki/`, `/b2b/` | **No redirect** | Sustained, наполняются в US-5/US-6/US-9/US-11 |
| `/admin/[[...segments]]` | **No redirect** | Payload sustained |

**Новые routes требуют создания** (US-3..US-9, через `podev` cross-team):
- `/uborka-territorii/` + 4 sub (новый pillar) — US-2 (создание pillar в Payload Services + sub в seed) + US-7 (контент)
- 17 new sub-pages под существующие 4 pillars — US-2 (Services + sub seed) + US-4/5/7 (контент)
- `/uslugi/tseny/` + 5 deep pages — US-4
- `/kalkulyator/foto-smeta/`, `/kontakty/` — US-8
- `/otzyvy/` — US-9

**Phantom rename rejected:** в более ранней draft-версии этого ADR обсуждался rename `chistka-krysh` → `uborka-snega-i-chistka-krysh`. Audit `site/scripts/seed.ts` показал что sustained slug `chistka-krysh` имеет 6 sustained sub-pages, переименование = 7 redirect-records + риск SEO drop. **Решение:** semantic coverage снега обеспечивается через 4 new sub под `/chistka-krysh/` (cena / krysha-ot-naledi / v-moskve / uborka-snega-uchastok) — wsk покрытие 2387+ без redirect-боли.

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

- **Reviews collection — новая** (REC #6 tamd review). Sustained `homepage_reviews` array в `site/globals/Homepage.ts:280-282` уже содержит 6 review. **Решение:** dba migration в US-9 — `homepage_reviews` array → новая `Reviews` collection, оба места (Homepage hero + `/otzyvy/`) рендерятся из new collection.
- PricingTiers collection или Globals.PriceCatalog — решение в US-4 (DB-driven обязательно).
- Sub × city programmatic (`/<pillar>/<sub>/<city>/`) — sustained для US-2 follow-up если whitespace анализ покажет ROI.

### Collisions resolved (REC #4 tamd review)

`chistka-krysh/sbivanie-sosulek/` (sustained) ↔ `chistka-krysh/krysha-ot-naledi/` (new) — оба внутри одного pillar, semantic overlap. **Решение:**
- `/chistka-krysh/sbivanie-sosulek/` → strict-action page (механика, инструменты, безопасность, видео)
- `/chistka-krysh/krysha-ot-naledi/` → pricing-info page (виды наледи, тарифы, договор сезон)
- Cross-link обязательный: «как сбивают сосульки →» / «← цены на регулярную чистку наледи»

### Sitemap priority — sustained `PILLAR_PRIORITY` остаётся (REC #7 tamd review)

ADR-0018 priority таблица — **универсальный baseline**. Sustained `PILLAR_PRIORITY` в `site/app/sitemap.ts:29-39` имеет **asymmetric data-driven** distribution:
- `vyvoz-musora: 1.0` (74% wsfreq)
- `arboristika: 0.9`
- `chistka-krysh: 0.7`
- `demontazh: 0.6`

**Решение:** asymmetric distribution **сохраняется** (data-driven > universal). seo-tech добавляет `uborka-territorii: 0.85` (новый pillar wsk-весом ~80% arboristika) в US-3. ADR-0018 §Sitemap priority — это нижняя граница; sustained map имеет приоритет.

### priceFrom defaults для 17 new sub-services (REC #5 tamd review)

`Services.subServices` array требует `priceFrom`. Defaults для 17 new sub:

| Pillar / Sub | priceFrom (₽) | Source |
|---|---:|---|
| vyvoz-musora/tbo | 700 | sustained pillar baseline |
| vyvoz-musora/kgm | 1 200 | sustained vyvoz-stroymusora baseline |
| vyvoz-musora/konteyner | 8 000 | контейнер 8м³ |
| vyvoz-musora/vyvoz-snega | 4 500 | per Камаз |
| arboristika/obrabotka-ot-koroeda | 5 000 | per дерево |
| arboristika/vykorchevanie-pney | 3 500 | per пень |
| arboristika/izmelchenie-vetok | 1 500 | per куб щепы |
| arboristika/obrezka-derevev | 2 500 | per плодовое дерево |
| demontazh/snos-zdaniy | 25 000 | per м² |
| demontazh/demontazh-zaborov | 200 | per погонный м |
| demontazh/demontazh-betona | 4 500 | per м³ |
| demontazh/uborka-stroitelnogo-musora | 1 500 | per м³ |
| chistka-krysh/cena | 35 | per м² (price-page тариф) |
| chistka-krysh/krysha-ot-naledi | 60 | per погонный м |
| chistka-krysh/v-moskve | 35 | per м² |
| chistka-krysh/uborka-snega-uchastok | 800 | per м² |
| uborka-territorii/vyravnivanie-uchastka | 250 | per сотку |
| uborka-territorii/raschistka-uchastka | 800 | per сотку |
| uborka-territorii/pokos-travy | 80 | per сотку (wsk C12 cluster keyword) |
| uborka-territorii/vyvoz-porubochnyh-ostatkov | 1 800 | per куб |

**Это baseline.** Финальные значения подтверждает оператор + cw в US-7 после конкурент-spread review.

## Действия

| Кто | Когда | Что | Статус |
|---|---|---|---|
| **poseo** | 2026-05-06 | Финализировать ADR + URL-map JSON + US-2 sa-seo skeleton | ✅ done |
| **tamd** | W2 (deadline 2026-05-13) | Review этого ADR + approve (или request changes) | 🔵 pending |
| **podev** (через cpo) | W2 | Approve нагрузки на 6 новых routes + 1 Reviews collection | 🔵 pending |
| **poseo** | W2 после approves | Статус → `accepted` + handoff к sa-seo для US-3..US-9 | 🔵 pending |
| **sa-seo** | W2-W3 | US-3..US-9 sub-specs (по 1 на US, ссылка на этот ADR) | 🔵 pending |
| **seo-tech** | W3 | sitemap.ts расширение per priority-таблица + canonical правила | 🔵 pending |

## Hand-off log

- 2026-05-06 14:00 · poseo: ADR-0018 skeleton draft создан в bootstrap PR EPIC-SEO-COMPETE-3
- 2026-05-06 14:00 · poseo → tamd: review request, deadline W2 (2026-05-13)
- 2026-05-06 16:30 · poseo: ADR финализирован после US-1 closure — добавлены 24 sub-pages (из top-25 TF-IDF cluster), 12 canonical правил, redirect-карта, action-grid с статусами. Status: draft → ready_for_review.
- 2026-05-06 17:00 · tamd-proxy review: 🟡 approve with 7 actionable comments. Status: ready_for_review → accepted_with_changes.
- 2026-05-06 17:15 · poseo: применил 7 fix'ов:
  1. SD route depth уточнено (sustained 2-сегмент `/<pillar>/<city>/`, sub×city — out-of-scope)
  2. «12 canonical правил» → «13 SEO правил» rename + добавлено правило #13 (H1 differentiation)
  3. Collision `chistka-krysh/sbivanie-sosulek` vs `krysha-ot-naledi` — resolved (action-page vs pricing-info-page split)
  4. priceFrom defaults для 17 new sub-services добавлены в §Технический долг
  5. Reviews collection plan уточнён (dba migrate sustained homepage_reviews → new Reviews collection)
  6. Sitemap priority — sustained asymmetric `PILLAR_PRIORITY` остаётся, ADR — baseline
  7. seo-tech US-3 added: добавить `uborka-territorii: 0.85` в PILLAR_PRIORITY map
  Status: accepted_with_changes (pending operator/tamd final approve).
