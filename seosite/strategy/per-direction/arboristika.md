---
direction: arboristika
parent: ../seo-master-strategy-2026-05.md
priority: P1
created: 2026-05-03
---

# Per-direction: Арбористика (как обыграем)

## 1 · Где мы (Stage 3 closure)

- **Pillar:** `/arboristika/` — 3 800 слов, 6 sub-services + выравнивание участка
- **Cases:** 3/14
- **Discovery pool:** 534 ключа в `arboristika.md` cluster (38 кластеров, 27 589 freq)
- **Wave 3 covered %:** 11.9% (303/2 536)

## 2 · Где конкуренты

| Champion | pagesInIndex | it50 | vis | DR | USP-zone |
|---|--:|--:|--:|--:|---|
| **liwood.ru** (probe-occupied) | 158 | 5 145 | 37 | 21 | content-depth & IA champion; 3 уровня иерархии; 40 districts × 1 service programmatic; 29 sub-services по обрезке |
| arboristik.ru | 69 | 1 393 | 35 | 25 | арбо + снег + мусор + демонтаж комплексный (наш «прямой» аналог по формату) |
| arborist.su | 74 | 1 363 | 17 | 24 | антибот, sustained no-measure глубоких страниц |
| spilservis.ru | 45 | 782 | 6 | 22 | emerging +388% W14, growing |
| virubka-dereva.ru | 61 | 796 | 3 | 16 | EMD-домен, narrow long-tail focus |

**USP-zones конкурентов:**
- liwood.ru — выравнивание участка / комплексная подготовка территории; arborist-bio как авторитетная страница
- arboristik.ru — 4-pillar структура (наш формат, прямая конкуренция), но Schema microdata not JSON-LD
- spilservis.ru — emerging «спилить дерево + локализация» по 50+ локациям

## 3 · Gap analysis

- **Whitespace 1 A1 + 16 A2 + 621 B**
- **A1: «арборист»** (1 020 wsk, у 6 конкурентов) — критический gap. Все champions имеют info-pillar «кто такой арборист», у нас НЕТ.
- **A2 cluster «арборист»:** «арбористика» 366 / «арборист это кто» 339×2 / «арбористы это/кто это» 247 + 226 + 160 + 127×2 = **8 ключей в одном semantic cluster**. Все ведут на info-bridge страницу.
- **A2 «спил» / «спилить дерево»** — высокий wsk (576, 219), у 4-8 конкурентов. У нас есть `/arboristika/spil-derevev/`, нужно усилить.
- **A2 «корчевание» 106 wsk у 5 d** — sub-service `/arboristika/korchevanie-pney/` (создаётся / уже есть?)
- **«Короед»** false-negative regex (5 348 wsk, 3 d) — реально arboristika cluster.

## 4 · Action plan Stage 4 (US-4.2)

### 4.A · A1 page (1 неделя)
- **Новый pillar-bridge:** `/arboristika/arborist/` (или `/poleznoe/kto-takoy-arborist/`)
- H1: «Арборист — кто это и чем занимается»
- 2 500 слов: профессия, что делает, услуги (cross-link 6 sub нашего pillar), почему сертифицированный, FAQ
- Schema: `Article` + `BreadcrumbList` + `FAQPage` + `Person` для авторов (E-E-A-T track A)
- CTA: вызов арбориста на участок (lead-form embed + photo→quote)
- **Ожидаемая позиция:** топ-10 за 2 месяца (6 конкурентов уже там, у нас глубже pillar)

### 4.B · 4 расширения существующих sub (3 дня)
- `/arboristika/spil-derevev/` — добавить sub `/tseny/` (target «сколько стоит дерево спилить» 290 wsk)
- `/arboristika/opilovka/` — НОВЫЙ sub (синоним обрезки, target «опиловка деревьев» 203, «опиловка» 104, «опил деревьев» 81)
- `/arboristika/obrabotka-ot-koroeda/` — НОВЫЙ sub (target «жук короед» 3 295 + «короед жук» 3 045 + «обработка от короеда» 227 = ~6 570). **Important:** «короед штукатурка» / «короед фасад» (~5 800 wsk) — это декоративная фасадная штукатурка, **out of vertical**, exclude через negative lookahead.
- `/arboristika/arenda-izmelchitelya/` — НОВЫЙ sub (target «измельчитель веток аренда» 235 + 199 + 117 + 102 = ~650)

### 4.C · Blog-bridges (1 день)
- `/blog/kak-spilit-derevo-pravilno/` (target «как спилить дерево» 140)
- `/blog/mozhno-li-spilit-derevo-na-svoem-uchastke/` (target wsk 74)
- `/blog/zashchita-ot-koroeda/` (target «обработка от короеда» 227)

### 4.D · USP «выравнивание участка» расширение (already started Stage 3)
- Sustained от Stage 3 — продолжить углублять `/arboristika/vyravnivanie-uchastka/` до 5 000 слов (champion в Wave 1 — wsk 5 523)

## 5 · Acceptance criteria

- [ ] AC-1: A1 «арборист» pillar-bridge published, в индексе через 4 недели
- [ ] AC-2: 4 новых sub-services published, Wave 3 covered % с 11.9% → ≥30% (~760 ключей)
- [ ] AC-3: top-3 ВЧ ключей (арборист / спил / арбористика) — топ-10 Я.выдача через 2 месяца
- [ ] AC-4: pagesInIndex `/arboristika/*` ≥ 25 после полного crawl
- [ ] AC-5: Topvisor 50 commercial ключей в категории
- [ ] AC-6: A1 page = top-3 для запроса «арборист» через 3 месяца

## 6 · Out of scope

- Покрытие promo-альп / фасадных работ — out of vertical (sustained от Stage 3)
- DIY-блоги «обрезка яблони весной» (5 457 wsk, 1 d) — высокий wsk но информационный, не commercial. Phase E классифицирован как arbo-blog, но Wave 4 priority (после конверсионных страниц).
