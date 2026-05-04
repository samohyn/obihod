---
title: Ландшафтный дизайн — pillar cluster (Wave 3 skeleton)
direction: landshaft
parent: ../_wave3-update-2026-05-03.md
created: 2026-05-03
status: skeleton (extraction baseline; full rebuild Wave 4 после re Wave 2 deep)
note: Этот файл = compact 7-cluster skeleton в одном документе. Split в 7+1 файлов планируется в Wave 4 после `seosite/01-competitors/deep/landshaft-studio-1..7.md`.
---

# Ландшафтный дизайн — pillar cluster (Wave 3)

> **Status:** Wave 3 extraction baseline (76 ключей через services-домены overlap, 0 commercial ВЧ/СЧ, 9 commercial НЧ). Direct landshaft-конкуренты 0/5 в Keys.so базе → full coverage блокирован re Wave 2 deep + Keys.so retrofit Wave 4.

## Контекст (sustained от EPIC-SEO-LANDSHAFT intake 2026-04-29)

- 9 категорий магазина саженцев (`apps/shop/`) — **отдельный track**, EPIC-SEO-SHOP
- Landshaft-сервис у нас — **отдельный pillar URL TBD** (ADR-uМ-20+: `/landshaftnyj-dizajn/` vs `/landshaft/`)
- TOV — `design-system/brand-guide-landshaft.html` blocked by art (sustained от 2026-04-29)
- Cross-link map: arboristika (посадка) ↔ landshaft (композиция) ↔ shop (саженцы)

## 7 cluster skeleton (по EPIC-SEO-LANDSHAFT deliverables)

### 1 · proekt — Проектирование

**Wave 3 extraction:** ~10 ключей НЧ
- «проект ландшафтного дизайна»
- «проектирование участка»
- «план участка»
- «эскиз благоустройства»

**Stage 4 action:** sub-page `/landshaftnyj-dizajn/proekt/` (3 500 слов), Schema `Service`. Cross-link с arboristika /uslugi-sadovnika/.

### 2 · blagoustroystvo — Благоустройство участка

**Wave 3 extraction:** ~15 ключей НЧ
- «благоустройство участка»
- «благоустройство загородного дома»
- «комплексное благоустройство территории»

**Stage 4 action:** sub `/landshaftnyj-dizajn/blagoustroystvo/`. USP «под ключ» совпадает с Caregiver+Ruler TOV сайта.

### 3 · gazon — Газон

**Wave 3 extraction:** ~12 ключей НЧ
- «газон рулонный»
- «газон посевной»
- «уход за газоном»
- «стрижка газона»

**Stage 4 action:** sub `/landshaftnyj-dizajn/gazon/`. **Cross-link** с shop `/magazin/gazonnaya-trava/` (когда apps/shop scaffolding сделан).

### 4 · malye-formy — Малые формы

**Wave 3 extraction:** ~5 ключей НЧ
- «малые архитектурные формы»
- «садовые скамейки»
- «садовая беседка»
- «декоративный пруд»

**Stage 4 action:** sub `/landshaftnyj-dizajn/malye-formy/`. Включает: беседки / скамейки / арки / перголы / decorative водоёмы.

### 5 · posadka — Посадка деревьев и кустарников

**Wave 3 extraction:** ~15 ключей НЧ
- «посадка деревьев»
- «посадка кустарников»
- «крупномеры посадка»
- «декоративные деревья посадка»

**Stage 4 action:** sub `/landshaftnyj-dizajn/posadka-derevyev/`. **Cross-link** с arboristika (техническая посадка) + shop (саженцы / крупномеры).

### 6 · vert-ozelenenie — Вертикальное озеленение

**Wave 3 extraction:** ~3 ключей НЧ
- «вертикальное озеленение»
- «зелёная стена»

**Stage 4 action:** sub `/landshaftnyj-dizajn/vertikalnoe-ozelenenie/`. Niche, low priority Wave 4.

### 7 · kejsy — Кейсы

**Wave 3 extraction:** 0 ключей extraction (кейсы не индексируются как self-keywords)

**Stage 4 action:** `/landshaftnyj-dizajn/kejsy/` — каталог 5-7 кейсов с фото / до-после / стоимостью. Зависит от operator: реальные фото проектов.

## Whitespace (Wave 3)

**0 A1+A2 + 0 B** в extraction-pool. Объяснение: services-домены не специализируются на landshaft, dedicated конкуренты не проиндексированы Keys.so на 2026-05-03.

## Wave 4 retrofit план (зависимости)

| Шаг | Owner | Status | ETA |
|---|---|---|---|
| re deep-профили 5+ landшафт-доменов | re | pending | TBD |
| brand-guide-landshaft.html | art | pending (sustained 2026-04-29) | TBD |
| Keys.so retrofit pull (новые проекты) | poseo (через Keys.so support либо organic recheck) | pending | 4-8 нед |
| Pillar `/landshaftnyj-dizajn/` create | podev + cw + cms | blocked by re + art | Stage 4 week 5+ |
| 7 cluster .md split (этот файл → 7+1 файлов) | seo-content | blocked by retrofit pull | Wave 4 |
| ADR-uМ-20+: URL slug landshaft | tamd + cpo | discussion | TBD |

## Source ключей extraction (Wave 3)

```
Master union: seosite/02-keywords/derived/keysso-master-union-2026-05-03.csv
Filter: cluster_hint == 'landshaft' OR cluster_hint contains 'landshaft' (multi-cluster)
Count: 76 keys (74 без overlap)
Donor domains: liwood.ru (probe), arbogarden.ru, treeworkers.ru, tvoi-sad.com
```

## Связанные артефакты

- [`../strategy/per-direction/landshaft.md`](../../strategy/per-direction/landshaft.md) — action plan US-4.5
- [`../strategy/seo-master-strategy-2026-05.md`](../../strategy/seo-master-strategy-2026-05.md) §5.5
- [`../../../specs/EPIC-SEO-LANDSHAFT/intake.md`](../../../specs/EPIC-SEO-LANDSHAFT/intake.md) — discovery scope
- `_wave3-update-2026-05-03.md` — Wave 3 cluster summary across 5 directions

> **Stage 4 acceptance** для landshaft direction = re Wave 2 + new Keys.so pull → этот файл split в `pillar.md` + 7 cluster files (`proekt.md` / `blagoustroystvo.md` / `gazon.md` / `malye-formy.md` / `posadka.md` / `vert-ozelenenie.md` / `kejsy.md`).
