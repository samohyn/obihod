---
title: Whitespace priority — Wave 3 quick wins
parent: seo-master-strategy-2026-05.md
created: 2026-05-03
source: seosite/02-keywords/derived/keysso-whitespace-2026-05-03.csv
---

# Whitespace priority — обгон конкурентов (Wave 3)

> Ключи у **≥3 services-конкурентов**, которых **нет** в нашем discovery pool (`normalized.csv` 1601 ключей). 1 204 whitespace ключа total → 70 priority A1+A2.

## Priority схема

| Tier | Условие | Action |
|---|---|---|
| **A1** | ВЧ + ≥5 доменов | Создать pillar-уровневую страницу за неделю |
| **A2** | (ВЧ + 3-4 доменов) или (СЧ + ≥3 доменов) | Sub-service / sub-pillar / blog-bridge — 2 недели |
| **B** | НЧ + ≥3 доменов | Long-tail внутренней перелинковки + blog Wave 4+ |

## По направлениям × приоритет

### Вывоз мусора

#### A2 (13 ключей)

| wsk | d | t | keyword | top-конкурент URL pattern | Recommended URL |
|--:|--:|---|---|---|---|
| 1 678 | 3 | ВЧ | «кгм» | musor /blog/krupnogabaritnyj-musor | `/vyvoz-musora/kgm/` (sub-service) + `/blog/chto-takoe-kgm/` (blog-bridge) |
| 606 | 3 | СЧ | «контейнер заказать для мусора» | / | `/vyvoz-musora/konteyner/` (sub-service expand) |
| 405 | 3 | СЧ | «вывоз тбо» | /service | `/vyvoz-musora/tbo/` |
| 326 | 4 | СЧ | «тбо вывоз» | / | redirect → /vyvoz-musora/tbo/ |
| 306 | 3 | СЧ | «вывоз мусора крупногабаритного» | /service | `/vyvoz-musora/krupnogabarit/` |
| 291 | 4 | СЧ | «вывоз мусора контейнер» | / | merge с /vyvoz-musora/konteyner/ |
| 277 | 3 | СЧ | «контейнер 8 кубов» | /arenda-kontejnera-8-m3 | `/vyvoz-musora/konteyner/8-kubov/` |
| 250 | 3 | СЧ | «вывоз мусора сколько стоит» | /service | расширить /vyvoz-musora/ pillar секцией «цены» |
| 249 | 4 | СЧ | «вывоз» | / | head-keyword без context — H1 на /vyvoz-musora/ |
| 203 | 3 | СЧ | «кгм это» | /blog/krupnogabaritnyj-musor | merge с /blog/chto-takoe-kgm/ |
| 117 | 3 | СЧ | «контейнер под мусор заказать» | /vyvoz-musora-kontejnerom | merge /vyvoz-musora/konteyner/ |
| 111 | 3 | СЧ | «контейнер заказать» | / | merge /vyvoz-musora/konteyner/ |
| 110 | 3 | СЧ | «контейнер для мусора крупногабаритного» | /blog/krupnogabaritnyj-musor | merge /vyvoz-musora/krupnogabarit/ |

**Action:** 4 новых URL под `/vyvoz-musora/` + 1 blog-bridge:
- `/vyvoz-musora/kgm/` (КГМ sub-service)
- `/vyvoz-musora/tbo/` (ТБО sub-service)
- `/vyvoz-musora/krupnogabarit/` (КГМ alias по русскому)
- `/vyvoz-musora/konteyner/{5,8,20,27}-kubov/` (4 SD по объёмам)
- `/blog/chto-takoe-kgm/` (info-bridge)

#### B (top-15 НЧ)

| wsk | d | keyword | URL hint |
|--:|--:|---|---|
| 89 | 3 | «89фз об отходах производства и потребления» | `/dokumenty/fz-89-ob-othodakh/` (E-E-A-T страница, legal) |
| 84 | 3 | «контейнер для мусора вывоз» | merge /vyvoz-musora/konteyner/ |
| 70 | 3 | «камаз вывоз мусора» | `/spectehnika/kamaz/` (sub под /vyvoz-musora/) |
| 68 | 3 | «тбо вывоз мусора» | merge /vyvoz-musora/tbo/ |
| 56 | 4 | «контейнер 27 кубов для мусора» | merge /vyvoz-musora/konteyner/27-kubov/ |

(полный B-список 116 ключей в CSV)

---

### Арбористика

#### A1 (1 ключ — единственный A1 во всём датасете)

| wsk | d | keyword | top-URL у champions |
|--:|--:|---|---|
| **1 020** | **6** | **«арборист»** | различные landing pages у liwood / arboristik / arborist.su |

**Action:** новая pillar-bridge страница `/arboristika/arborist/` или `/poleznoe/kto-takoy-arborist/`:
- H1 «Арборист — кто это и чем занимается»
- Содержимое: профессия, что делает, какие услуги (cross-link на 6 sub нашего pillar), почему выбирать сертифицированного, FAQ
- Schema: `Article` + `BreadcrumbList` + `FAQPage`
- CTA: вызвать арбориста на участок (lead-form embed)
- Ожидаемая позиция: топ-10 в течение 2 месяцев (6 конкурентов уже там — мы покроем pillar глубже)

#### A2 (16 ключей)

| wsk | d | keyword | URL hint |
|--:|--:|---|---|
| 576 | 4 | «спил» | merge с `/arboristika/spil-derevev/` (head ссылка) |
| 366 | 6 | «арбористика» | merge `/arboristika/` pillar (расширить H1 / Title с словом) |
| 339 + 339 + 226 | 4-3 | «арборист это кто» / «арборист кто это» / «арборист кто это профессия» | все cross-link на `/arboristika/arborist/` (A1 страница) |
| 290 | 6 | «сколько стоит дерево спилить» | sub `/arboristika/spil-derevev/tseny/` |
| 247 + 219 + 160 + 127×2 | 5-8 | «арборист это» / «спилить дерево» / «арбористы» / «арбористы это/кто это» | all cross-link на A1 страницу |
| 203 | 6 | «опиловка деревьев» | sub `/arboristika/opilovka/` (новый, синоним обрезки) |
| 140 | 3 | «как спилить дерево» | blog `/blog/kak-spilit-derevo-pravilno/` |
| 136 | 5 | «арбористика что это» | merge /arboristika/arborist/ (A1) |
| 106 | 5 | «корчевание» | sub `/arboristika/korchevanie-pney/` (если ещё нет) |

**Action:** 1 A1 page + 4 расширения существующего pillar + 5 cross-link merges + 1 blog.

#### B (top-15 НЧ)

| wsk | d | keyword |
|--:|--:|---|
| 96 | 7 | «рубка деревьев» |
| 87 | 3 | «как правильно пилить дерево» |
| 85 | 3 | «выкорчевывание» |
| 83 | 4 | «кто такой арборист» |
| 82 | 6 | «опилка деревьев» |
| 81 | 5 | «опил деревьев» |
| 79 + 79 | 3 | «от короеда препараты на деревьях» / «обрезка хвойных деревьев» |
| 75 | 5 | «обрезка деревьев авито» |
| 74 + 74 | 3-4 | «можно ли на своём участке спиливать деревья» / «опиловка деревьев что это такое» |
| 70 | 3 | «корчевка деревьев» |
| 65 | 5 | «выкорчевывание деревьев» |

(полный B 621 ключ, blog Wave 4+ + перелинковка)

---

### Демонтаж B2C

#### A2 (2 ключа)

| wsk | d | keyword | top URL у champions |
|--:|--:|---|---|
| 3 587 | 3 | **«демонтаж»** | demontazhmsk / snosim / demonti — / |
| 136 | 3 | «снос домов» | / |

**Action:** **расширить** `/demontazh/` pillar — H1+Title включить «Демонтаж в Москве и МО под ключ — снос домов / дач / хозпостроек», добавить sub-service сетку 6 шт. (текущие 2 → 6+ через Wave 4):
- `/demontazh/snos-doma/`
- `/demontazh/snos-dachi/`
- `/demontazh/snos-bani/`
- `/demontazh/demontazh-zabora/`
- `/demontazh/demontazh-fundamenta/`
- `/demontazh/snos-garazha/`

#### B (top-15 НЧ)

| wsk | d | keyword | URL hint |
|--:|--:|---|---|
| 94 | 3 | «демонтаж зданий» | (B2B, leave для b2b.md cluster) |
| 68 | 3 | «демонтаж здания» | (B2B, аналог) |
| 51 + 51 | 3 | «снос здания» / «демонтаж фундамента» | demontazh-fundamenta sub |
| 47 | 3 | «сколько стоит демонтаж дома» | merge /demontazh/snos-doma/ |
| 40 | 4 | «снос дома сколько стоит» | merge /demontazh/snos-doma/ tseny |
| 28 | 4 | «демонтаж цена» | merge /demontazh/ pillar pricing block |
| 20 | 3 | «демонтаж фундамента цена» | merge /demontazh/demontazh-fundamenta/ |
| 15 | 4 | «снос частного дома цена» | (B2C-specific) merge /demontazh/snos-doma/ |
| 14 | 3 | «демонтаж бани сколько стоит» | merge /demontazh/snos-bani/ |
| 13 | 3 | «разборка дома» | merge /demontazh/snos-doma/ |
| 12 | 3 | «демонтаж кирпичной дымовой трубы» | sub `/demontazh/dymovaya-truba/` (если поддержим) |

(полный B 40 ключей)

> **Note:** «демонтаж зданий» / «снос здания» — частично B2B. Cross-link с `b2b.md` cluster через `/b2b/demontazh-promyshlenny/` если решим расширить B2B.

---

### Уборка снега + чистка крыш

#### A2 (1 ключ)

| wsk | d | keyword | URL hint |
|--:|--:|---|---|
| 159 | 6 | «чистка кровли» | sub `/chistka-krysh/chistka-krovli/` (синоним крыш-кровля) |

#### B (2 ключа)

| wsk | d | keyword | URL hint |
|--:|--:|---|---|
| 46 | 3 | «механизированная уборка» | sub `/uborka-snega/mehanizirovannaya/` |
| 37 | 3 | «механизированная уборка территории» | merge выше |

> **Note:** uborka-snega tier closure best (53% от Wave 1). 3 whitespace ключа = nearly closed direction. Wave 3 — finishing touch.

---

### Ландшафтный дизайн

В extraction-based pull (через services-домены) **0 whitespace** = ландшафт направление слабо покрывается services-доменами в принципе. Подтверждает рекомендацию: re Wave 2 deep-профили dedicated landshaft-конкурентов.

**Stage 4 action:** дождаться `seosite/01-competitors/deep/landshaft-studio-1..7.md` от re → следующий monthly snapshot включит landshaft-конкурентов через прямой pull (если их домены попадут в Keys.so базу).

---

### Unmatched (out-of-vertical signals)

37 A2 + 355 B ключей которые regex не отнёс к 5 directions. Анализ показал:

1. **Промальп / фасады** — ~25 ключей A2 (промышленный альпинист, фасадные работы, ремонт фасада, мойка окон альпинистами, герметизация швов). **Out of vertical** — НЕ покрываем.
2. **Клининг офисов / складов** — ~5 ключей (клининг складских помещений, мытьё окон). **Out of vertical**.
3. **«Короед» — split на 2 значения:**
   - «жук короед» (3 295) + «короед жук» (3 045) + «короеды жуки» (466) = **~6 800 wsk arboristika** (наша вертикаль). Override → создать `/arboristika/obrabotka-ot-koroeda/`.
   - «короед штукатурка» (5 813) + «штукатурка короед» (3 346) + «короед декоративная» / «короед фасад» — **декоративная фасадная штукатурка, out of vertical**, exclude.
4. **«Селитра для удаления пней»** (214) + «измельчитель веток аренда» (235 + 199 + 117 + 102) — **наша вертикаль**, sub `/arboristika/`. Override.
5. **«ОСИГ» / «АИС ОССИГ»** — Stage 4: понять что это (отходы строительные?) — возможно это про ТКО реестр, B2B. cpo decision.

**Action:** override-list в `_clustering-decisions.md` Stage 4 backlog.

---

## Сводная action-таблица

| Direction | A1 actions | A2 actions | B (long-tail) | Effort |
|---|---|---|---|---|
| Вывоз мусора | 0 | 4 sub-services + 1 blog | 116 (Wave 4 blog) | 1 неделя |
| Арбористика | 1 (арборист) | 4 расширения + 1 blog | 621 | 2 недели |
| Демонтаж B2C | 0 | расширение pillar + 6 sub | 40 | 2 недели |
| Уборка снега | 0 | 1 sub | 2 | 3 дня |
| Ландшафт | 0 (нет в pull) | 0 | 0 | wait re Wave 2 |
| **Σ Stage 4 backlog** | **1 A1** | **~12 A2** | **~780 B** | **~5 недель** |

После Stage 4 closure — closure A1+A2 = **~13/70 = 19%** (target 80% к 12-week mark).

> Корень закрывается с помощью US-4.1..US-4.5 в EPIC-SEO-OUTRANK (см. master strategy §8).
