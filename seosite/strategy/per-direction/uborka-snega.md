---
direction: uborka-snega-i-chistka-krysh
parent: ../seo-master-strategy-2026-05.md
priority: P2 (closest to closure — 53% covered)
created: 2026-05-03
---

# Per-direction: Уборка снега + чистка крыш (как обыграем)

> **Closest to closure.** 53% covered Wave 3 — most mature direction. Wave 3 finishing touch.

## 1 · Где мы (Stage 3)

- **Pillar:** `/chistka-krysh/` — 3 200 слов (Stage 3 W12 sustained migration `ochistka-krysh` → `chistka-krysh` через 301)
- **Cases:** 1/14
- **Discovery pool:** 197 ключей в `chistka-krysh.md` (8 кластеров, 888 freq) — second-smallest
- **Wave 3 covered %:** **52.9%** (83/157) — best in directions

## 2 · Где конкуренты

| Champion | pagesInIndex | it50 | vis | DR | USP-zone |
|---|--:|--:|--:|--:|---|
| **cleaning-moscow.ru** | 271 | 6 123 | 36 | 29 | E-E-A-T champion (авторы); клининг+снег+кронирование комплексный |
| moscleaning24.ru | 143 | 2 604 | **141** | 28 | vis эксцеллент — клининг + снег короткие туры |
| formula-v.ru | 70 | 949 | 4 | 8 | клининг + снег с крыш narrow |
| fasadrf.ru | 186 | 3 216 | 42 | 20 | фасады + кровля + снег (out-of-vertical для нас) |
| alpme.ru | 42 | 139 | — | 18 | промальп — крыши + кровля |

**USP-zones:**
- cleaning-moscow.ru — авторы (E-E-A-T) + B2B/B2C сегментация в URL `/chastnym-klientam/` + `/korporativnym/`
- moscleaning24.ru — pricing-aggressive «уборка снега + клининг bundle»
- fasadrf.ru — глубочайшая иерархия по производителям

## 3 · Gap analysis

- **Whitespace 1 A2 + 2 B = 3 ключей** — почти закрыто
- **A2: «чистка кровли»** (159 wsk, 6 d) — sustained синоним крыш↔кровля. Sub-service `/chistka-krysh/chistka-krovli/` или alias.
- **B: «механизированная уборка»** (46) + «механизированная уборка территории» (37) — sub `/uborka-snega/mehanizirovannaya/`

**Структурный split:** оператор просил расширить direction до **«уборка снега + чистка крыш»**. Текущий cluster `chistka-krysh.md` фокусирует на крышах. Нужно добавить:
- Уборка снега с участка (B2C, target «уборка снега» wsfreq)
- Вывоз снега (cross-link с vyvoz-musora)
- Механизированная уборка территории

## 4 · Action plan Stage 4 (US-4.4)

### 4.A · Rename + restructure (1 день)
- `git mv seosite/03-clusters/chistka-krysh.md seosite/03-clusters/uborka-snega-i-chistka-krysh.md`
- Pillar URL остаётся `/chistka-krysh/` (sustained от ADR-uМ-13 migration)
- Расширить pillar H1 + Title: «Уборка снега и чистка крыш — частные дома, дачи, офисы»

### 4.B · 2 новых sub (3 дня)
- `/chistka-krysh/chistka-krovli/` (target A2 «чистка кровли» 159 wsk)
- `/uborka-snega/mehanizirovannaya/` (target B «механизированная уборка» 46+37)

> **Note:** `/uborka-snega/` НОВЫЙ pillar URL? Или sub под `/chistka-krysh/`? — Stage 4 ADR (`decisions.md` ADR-uМ-19+) — рекомендация: sub `/chistka-krysh/uborka-snega/` для preserve существующего ranking, добавить redirect от `/uborka-snega/` к sub.

### 4.C · USP «уборка снега с участка» (1 неделя)
- Sub `/chistka-krysh/uborka-snega/` (target B2C-частный сектор)
- Cross-link с `/vyvoz-musora/` (вывоз снега как услуга)
- B2B-секция (УК / парковки / дворы) → cross-link с b2b.md

### 4.D · Sustained pillar обновление (existing cluster)
- Добавить FAQ block (target B-tier «при какой высоте снега обязательна чистка», «штрафы ОАТИ» — наш USP)
- Cases — добавить 1-2 кейса по ЖК/УК (sustained от Stage 2 USP «штрафы ГЖИ берём»)

## 5 · Acceptance criteria

- [ ] AC-1: rename chistka-krysh.md → uborka-snega-i-chistka-krysh.md (git mv preserve history)
- [ ] AC-2: 2 новых sub published, Wave 3 covered % с 53% → ≥75% (~120 ключей)
- [ ] AC-3: «чистка кровли» 159 wsk — наш sub в топ-10 через 6 недель
- [ ] AC-4: pagesInIndex /chistka-krysh/* + /uborka-snega/* ≥ 8
- [ ] AC-5: ADR-uМ-19 (или later) — URL-структура uborka-snega vs chistka-krysh resolved

## 6 · Out of scope

- Кровля repair (фасады + кровля как fasadrf.ru) — out of vertical
- Промышленный alpinism (промальп services) — out of vertical (передан в b2b если решим)
- DIY blog «как почистить крышу самому» — Wave 4 priority

## 7 · Why P2 (low priority)

Direction **уже на 53% covered** — Wave 3 = small finishing touches. Не drains effort vs P0 demontazh-b2c (4% covered) или P1 arboristika/vyvoz-musora (10-12%).
