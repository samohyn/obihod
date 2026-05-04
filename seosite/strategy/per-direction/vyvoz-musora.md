---
direction: vyvoz-musora
parent: ../seo-master-strategy-2026-05.md
priority: P1
created: 2026-05-03
---

# Per-direction: Вывоз мусора (как обыграем)

## 1 · Где мы (Stage 3 closure 2026-05-03)

- **Pillar:** `/vyvoz-musora/` — 3 800 слов, 8 sub-services, 16 SD priority-A + 60 priority-B = 76 SD
- **Cases:** 4/14 связаны с мусором
- **Discovery pool (normalized.csv):** 384 ключа в `vyvoz-musora.md` cluster (97 кластеров, 161 781 freq)
- **Wave 3 covered %:** 9.7% (329/3 405 ключей у конкурентов)

## 2 · Где конкуренты (Wave 3 numbers)

| Champion | pagesInIndex | it50 | vis | DR | USP-zone |
|---|--:|--:|--:|--:|---|
| **musor.moscow** | 329 | 10 827 | 131 | 27 | URL-объём champion (sitemap 1 658, индексация 20%); калькулятор на главной |
| mmusor.ru | 149 | 1 647 | **468** | 20 | vis champion в категории; 24/7 + ТКО reestrь |
| stroj-musor.moscow | 158 | 5 863 | 58 | 21 | partner musor.moscow, фокус стройотходы |
| moscleaning24.ru | 143 | 2 604 | 141 | 28 | клининг + снег + мусор overlap |
| mmusor / gsvm.ru | 86 | 1 255 | 16 | 24 | автогенерация по округам |

**USP-zones конкурентов** (из `keysso-per-domain-unique-2026-05-03.csv`):
- musor.moscow — auto-generated «контейнер N кубов» страницы для каждого объёма
- mmusor.ru — «вывоз мусора в [город МО]» программатика по 19 городам
- stroj-musor.moscow — стройматериалы / щебень / песок (товарная вертикаль внутри мусорной)

## 3 · Gap analysis

- **Whitespace 13 A2 + 116 B = 129 ключей** (ВЧ-СЧ + НЧ long-tail)
- **Топ A2 wsk:** «кгм» 1 678 / «контейнер заказать для мусора» 606 / «вывоз тбо» 405 / «контейнер 8 кубов» 277 / «вывоз мусора сколько стоит» 250
- **Структурный gap:** у нас НЕТ sub-service для **КГМ** (крупногабарит) и **ТБО** — есть только общий /vyvoz-musora/. Конкуренты получают трафик на отдельные страницы.
- **Auto-gen risk:** musor.moscow держит 1 658 sitemap но реально в индексе 329 (20% — Yandex режет дублирующиеся auto-pages). Нам не повторять этот path.

## 4 · Action plan Stage 4 (US-4.1)

### 4.A · 4 новых sub-services (1 неделя)
- `/vyvoz-musora/kgm/` — КГМ (sub-service, target wsk 1 678 + 110 + 306)
- `/vyvoz-musora/tbo/` — ТБО (target wsk 405 + 326 + 68 + 49 = 848)
- `/vyvoz-musora/krupnogabarit/` — alias по русскому (target 306 + 110)
- `/vyvoz-musora/konteyner/` — sub-service expansion (target 606 + 277 + 117 + 111)

### 4.B · 4 SD по объёмам контейнеров (1 неделя)
- `/vyvoz-musora/konteyner/5-kubov/`
- `/vyvoz-musora/konteyner/8-kubov/` (target wsk 277 «контейнер 8 кубов»)
- `/vyvoz-musora/konteyner/20-kubov/` (target 56 «контейнер мусорный 20 кубов»)
- `/vyvoz-musora/konteyner/27-kubov/` (target 56 «контейнер 27 кубов для мусора»)

### 4.C · Pillar расширение (3 дня)
- `/vyvoz-musora/` H1 + Title + первый абзац — добавить «КГМ / ТБО / контейнер» (target ВЧ-захват)
- Pricing block (target «вывоз мусора сколько стоит» 250 wsk)
- FAQ section с 10 long-tail вопросами (target B-tier)

### 4.D · Blog-bridge (1 день)
- `/blog/chto-takoe-kgm/` (info-bridge, cross-link на /vyvoz-musora/kgm/)
- `/dokumenty/fz-89-ob-othodakh/` (E-E-A-T legal, target «89фз об отходах» 89 wsk)

## 5 · Acceptance criteria

- [ ] AC-1: 4 новых sub-services + 4 SD контейнеров published в Yandex-индексе (через Я.ВебМастер)
- [ ] AC-2: Wave 3 covered % с 9.7% → ≥30% (~1 000 ключей в нашем pool после расширения)
- [ ] AC-3: top-3 ВЧ ключей (КГМ, ТБО, контейнер) — наши URL в outline pillar страницы
- [ ] AC-4: Schema CollectionPage + ItemList + Service на pillar; FAQPage на /vyvoz-musora/ + 4 sub
- [ ] AC-5: Topvisor 50+ commercial ключей под мусор → daily snapshot
- [ ] AC-6: pagesInIndex /vyvoz-musora/* ≥ 60 после полного crawl

## 6 · Out of scope

- Программатика «вывоз мусора в [город МО]» — auto-gen risk (musor.moscow 80% page loss). Только для top-15 districts через priority-B SD pattern уже сделанный.
- Стройматериалы / щебень / песок (товарная вертикаль) — out of scope для services-сайта.
