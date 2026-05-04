---
direction: landshaft
parent: ../seo-master-strategy-2026-05.md
priority: P1 (discovery + content track)
created: 2026-05-03
status: skeleton (semantic from extraction; full coverage blocked by re Wave 2)
---

# Per-direction: Ландшафтный дизайн (как обыграем)

> **Discovery direction.** EPIC-SEO-LANDSHAFT в intake phase, brand-guide-landshaft.html не создан, 5 landshaft-кандидатов **0/5 в Keys.so базе**. Wave 3 = extraction-baseline, full content track зависит от re Wave 2.

## 1 · Где мы (Stage 3)

- **Pillar:** ⚠ нет — `/landshaftnyj-dizajn/` URL ещё не создан
- **Cases:** 0/14
- **Discovery pool:** 0 ключей в `seosite/03-clusters/landshaft/` (skeleton README only)
- **Wave 3 covered %:** 0% (0/74)

## 2 · Где конкуренты (extraction-baseline)

**Direct landshaft-конкуренты в Keys.so:** 0/5 в базе (sustained 404):
- studio-fito.ru — TBD slug (re Wave 2 deep)
- landshaft-bureau.ru — TBD
- landshaftnoye.ru — TBD
- dachnyu.ru — TBD
- yardesign.ru — TBD

**Extraction-сигнал** (через services-домены с landshaft-разрезом):

| Champion (через extraction) | pagesInIndex | landshaft-сегменты в pull | USP-zone |
|---|--:|--:|---|
| **liwood.ru** (probe) | 158 | URL `/services/landshaftniy-dizayn-uchastka/` | content-depth eталон, 3-уровень иерархия |
| arbogarden.ru | 54 | арбо + ландшафт overlap | dropbox для ключей «дизайн участка / газон» |
| treeworkers.ru | 7 | минимум | one-pager |
| tvoi-sad.com | 2 | один-два ключа | отброшен в W14 как off-vertical |

**Через extraction найдено:** 76 ключей с cluster_hint=landshaft (regex match), 0 коммерческих в ВЧ/СЧ, 9 коммерческих в НЧ.

## 3 · Gap analysis

- **Whitespace: 0 A1+A2** в этом extraction-pool (объясняется: services-домены не специализируются на landshaft, dedicated конкуренты не проиндексированы Keys.so).
- **Critical missing:** прямые landshaft-домены (studio-fito / landshaftnoye etc.) НЕ в Keys.so базе → не можем достать их семантику и whitespace.
- **Extraction findings (НЧ только):** «ландшафтный дизайн участка», «благоустройство участка», «дренаж участка», «газон рулонный», «посадка деревьев на участке» — все НЧ wsk <100, информационный intent.

## 4 · Action plan Stage 4 (US-4.5)

### 4.A · Phase 1 — discovery dependencies unlock (week 1-3, blocked by external)

1. **`re` Wave 2 deep-профили** (`seosite/01-competitors/deep/landshaft-studio-1..7.md`) — подтверждение точных доменов 5 landscape-студий + 2 дополнительных кандидата.
2. **`art` brand-guide-landshaft.html** — TOV для landshaft, pre-required для контента (sustained от 2026-04-29 EPIC-SEO-LANDSHAFT intake).
3. **Mannual SERP probe** через Keys.so search-key endpoint для топ-15 landshaft фраз («ландшафтный дизайн участка цена», «проект ландшафтного дизайна», «благоустройство участка под ключ») → найти реальные топовые домены не в нашей base.
4. **Add landshaft-конкуренты в Keys.so**: при successful identify — re-bootstrap проектов (~5-7 новых проектов через `POST /projects`).

### 4.B · Phase 2 — pillar create (week 3-5, after 4.A.1-4.A.2)

- `/landshaftnyj-dizajn/` (или `/landshaft/`, slug TBD ADR-uМ-20+) — pillar 4 500 слов
- 7 sub-services по skeleton README:
  - `/landshaftnyj-dizajn/proekt/` (проектирование)
  - `/landshaftnyj-dizajn/blagoustroystvo/`
  - `/landshaftnyj-dizajn/gazon/` (рулонный + посевной)
  - `/landshaftnyj-dizajn/posadka-derevyev/` (cross-link с arboristika)
  - `/landshaftnyj-dizajn/malye-formy/`
  - `/landshaftnyj-dizajn/vertikalnoe-ozelenenie/`
  - `/landshaftnyj-dizajn/cases/`

### 4.C · Phase 3 — content waves (week 5-8, after 4.B + new Keys.so pull)

- На основе **обновлённого Wave 4 pull** с landshaft-конкурентами — создать `seosite/strategy/per-direction/landshaft.md` v2 с реальными whitespace numbers
- Per-cluster контент-волны: 3 800 слов на pillar + 1 500 на каждый sub
- 3-5 кейсов с landшафт-проектами (требует фото от operator)

### 4.D · Cross-link strategy

- `/arboristika/posadka-derevev/` ↔ `/landshaftnyj-dizajn/posadka-derevyev/` (landshaft посадка композиций vs arbo техническая посадка)
- `/landshaftnyj-dizajn/blagoustroystvo/` ↔ `/vyvoz-musora/uborka-territorii/` (после landшафт работ — вывоз остатков)
- `/landshaftnyj-dizajn/gazon/` → магазин саженцев `/magazin/gazonnaya-trava/` (при scaffolding apps/shop)

## 5 · Acceptance criteria

- [ ] AC-1: re Wave 2 deep-профили published (5+ landshaft-доменов)
- [ ] AC-2: art brand-guide-landshaft.html merge на main
- [ ] AC-3: pillar `/landshaftnyj-dizajn/` + 7 sub published
- [ ] AC-4: Wave 4 monthly snapshot включает 5 landshaft-конкурентов через прямой Keys.so pull
- [ ] AC-5: Wave 3 covered % с 0% → ≥30% после Wave 4 retrofit
- [ ] AC-6: ADR-uМ-20+ — URL-slug ландшафта решён (`/landshaftnyj-dizajn/` vs `/landshaft/`)
- [ ] AC-7: Cross-link map с arboristika + shop задокументирован

## 6 · Dependencies

| Dep | Owner | ETA |
|---|---|---|
| re Wave 2 deep-профили 5+ landшафт-доменов | re | TBD |
| brand-guide-landshaft.html | art | TBD (sustained от 2026-04-29) |
| Verified landshaft-домены в Keys.so базе | external (Keys.so support либо organic crawl) | 4-8 недель |
| Решение по landshaft URL-slug | tamd + cpo | ADR-uМ-20+ |

## 7 · Why P1 (despite blocked)

- Operator явно включил landshaft в 5 направлений → strategic priority
- Cross-vertical opportunity с shop (питомник саженцев) — комплексный USP «landшафт + растения под ключ»
- Sustained content investment (5 weeks) приносит ВЧ-страницы которые мы пока вообще не имеем

## 8 · Out of scope для Wave 3

- Реальный pillar контент (blocked by 4.A dependencies)
- 8 cluster .md файлов на основе real data (blocked by Keys.so pull retrofit Wave 4)
- Текущий artefact = **skeleton + dependency tracking**, реальная стратегия в Wave 4 strategy doc.
