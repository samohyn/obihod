---
epic: EPIC-SEO-OUTRANK
title: Wave 3 multi-domain pull → Stage 4 SEO action plan для обгона 32 services-конкурентов
team: seo
po: poseo
type: programmatic + content + research
priority: P0
segment: services + cross
phase: dev
role: poseo
status: active
blocks: []
blocked_by:
  - tamd ADR uborka-territorii (новый pillar или sub arboristika — нужно решение до создания страниц)
  - re Wave 2 deep-профили (для landshaft track US-4.5)
  - art brand-guide-landshaft.html (для US-4.5)
  - operator real-name + sameAs (для E-E-A-T axis в monitoring track US-5)
related:
  - EPIC-SEO-CONTENT-FILL (done, DoD PASS 2026-05-03)
  - EPIC-SEO-LANDSHAFT (discovery, US-4.5 dependency)
  - EPIC-SEO-SHOP (out of scope — отдельный track)
created: 2026-05-03
updated: 2026-05-04
skills_activated: [seo, product-capability, blueprint, market-research, search-first, project-flow-ops]
strategy_doc: seosite/strategy/seo-master-strategy-2026-05.md
gap_matrix: seosite/strategy/service-gap-matrix.md
---

# EPIC-SEO-OUTRANK — Wave 3 → Stage 4 Action Plan

**Автор intake:** poseo
**Дата:** 2026-05-03
**Источник:** запрос оператора 2026-05-03 «полноценная SEO-стратегия как обыграем конкурентов»
**Approved через AskUserQuestion:** 4 ответа Recommended (тир α / landshaft через services / W14 correction в новом doc / новый эпик)

---

## Skill activation (iron rule)

`poseo` активирует на старте: **`seo`** (основной), **`market-research`** (intersect 32 конкурентов), **`product-capability`** (5-direction capability map), **`blueprint`** (5 US декомпозиция), **`project-flow-ops`** (US-1..US-5 sequencing), **`search-first`** (Keys.so endpoint reuse).

---

## Контекст

### Trigger от оператора

> «вытащить по всем конкурентам и их пересечениям семантику · кластернуть только коммерческие · ВЧ СЧ НЧ · фокус на арбо, демонтаж в частном секторе, уборка снега, вывоз мусора, ландшафт дизайн · продажа растений из питомника будет отдельно · полноценная seo стратегия как мы обыграем конкурентов»

### Critical correction (sustained от W14)

W14 benchmark использовал **sitemap.xml URL count** как метрику URL-объёма. Live Keys.so данные на 2026-05-03 показали значительное расхождение sitemap vs `pagesInIndex`:
- musor.moscow: 1 658 → **329 в индексе** (-80%)
- liwood.ru: 319 → **158** (-50%)
- cleaning-moscow.ru: 626 → **271** (-57%)

После полного Yandex crawl наших 211 sitemap URL → ожидаемый pagesInIndex 150-180 = **realistic parity к liwood / +33% к real-index 158**. URL-axis recalibrated с 🟡 partial → ✅ confirmed (4-я ось от 3 W14).

Sustained `seosite/01-competitors/benchmark-W14.md` НЕ редактируется. Correction layer в новом [`seosite/strategy/seo-master-strategy-2026-05.md`](../../seosite/strategy/seo-master-strategy-2026-05.md) §2 (operator approved 2026-05-03).

---

## Wave 3 артефакты (закрыты pre-EPIC-OUTRANK как Phase A-F)

| Phase | Артефакт | Status |
|---|---|---|
| A | [`seosite/scripts/keysso_pull_competitors.py`](../../seosite/scripts/keysso_pull_competitors.py) — pull 33 services-доменов | ✅ done |
| A | 33 JSON в [`seosite/02-keywords/raw/`](../../seosite/02-keywords/raw/) + manifest | ✅ done (32/34 ok, 29 256 ключей) |
| B | [`seosite/scripts/keysso_intersect.py`](../../seosite/scripts/keysso_intersect.py) — intersect analysis | ✅ done |
| B | 4 derived CSV в [`seosite/02-keywords/derived/`](../../seosite/02-keywords/derived/) | ✅ done (21 051 unique / 4 013 multi / 1 204 whitespace / 917 unique) |
| C | Commercial filter (regex + intent column) | ✅ done (6 008 коммерческих, 28.5%) |
| C | [`_filter-decisions.md`](../../seosite/02-keywords/derived/_filter-decisions.md) | ✅ done |
| D | [`seosite/02-keywords/frequency-tiers.md`](../../seosite/02-keywords/frequency-tiers.md) — explicit α | ✅ done |
| E | rename `chistka-krysh.md` → `uborka-snega-i-chistka-krysh.md` (`git mv`) | ✅ done |
| E | [`seosite/03-clusters/_wave3-update-2026-05-03.md`](../../seosite/03-clusters/_wave3-update-2026-05-03.md) — Wave 3 supplementary doc | ✅ done |
| E | [`seosite/03-clusters/landshaft/pillar.md`](../../seosite/03-clusters/landshaft/pillar.md) — skeleton 7 cluster | ✅ done |
| E | [`_clustering-decisions.md`](../../seosite/02-keywords/derived/_clustering-decisions.md) | ✅ done |
| F | [`seosite/strategy/seo-master-strategy-2026-05.md`](../../seosite/strategy/seo-master-strategy-2026-05.md) — главный artefact | ✅ done |
| F | [`seosite/strategy/whitespace-priority-A.md`](../../seosite/strategy/whitespace-priority-A.md) | ✅ done |
| F | 5 [`per-direction/*.md`](../../seosite/strategy/per-direction/) | ✅ done |

**Phase G (этот intake)** — финальный артефакт closing Wave 3.

---

## Скоп EPIC-SEO-OUTRANK

### Включаем (5 directions)

1. **Вывоз мусора** (P1) — расширение pillar 8→12 sub + 4 SD контейнеров
2. **Арбористика** (P1) — A1 «арборист» pillar-bridge + 4 sub
3. **Демонтаж в частном секторе** (**P0 — biggest gap**) — pillar 2→8 sub
4. **Уборка снега + чистка крыш** (P2 — closest to closure) — finishing
5. **Ландшафтный дизайн** (P1, blocked) — discovery + skeleton

### Не включаем

- Магазин саженцев (`apps/shop`) — отдельный track EPIC-SEO-SHOP (operator: «отдельно»)
- Промальп / фасады / клининг офисов — out of vertical
- B2B-программатика по districts — отложено (sustained от W14 ADR)

### DoD EPIC-SEO-OUTRANK

| AC | Critirion | Target |
|---|---|---|
| AC-1 | ≥4/5 axes confirmed sustained | 4/5 (vs 3/5 W14) |
| AC-2 | pagesInIndex наш ≥ liwood real-index | ≥150 |
| AC-3 | 5 per-direction strategy + Wave 3 cluster updates | published |
| AC-4 | Whitespace A1+A2 closure | 56/70 (80%) |
| AC-5 | Topvisor 200+ commercial ключей monitoring | active |
| AC-6 | All 5 directions covered % ≥ 30% | per direction |

### Out of scope для EPIC

- Регенерация Keys.so токена (operator action sustained)
- Я.ВебМастер / Topvisor creds (sustained pending от W3)
- Real-name + sameAs E-E-A-T (sustained pending W11)
- Полный Yandex crawl 211 sitemap (organic, ~2-4 недели)

---

## US декомпозиция (US-1..US-5)

### US-1 · Pull + intersect (Phase A-D — DONE 2026-05-03)

- **Status:** ✅ closed (выполнено в Phase A-D pre-EPIC)
- **Артефакты:** 33 raw JSON + 4 derived CSV + manifest + decisions logs
- **Закрывает:** AC-1 baseline + foundation для AC-3
- **Owner:** poseo + re

### US-2 · Cluster mapping 5 directions + Wave 3 sections — ✅ DONE 2026-05-04

- **Status:** ✅ closed
- **Owner:** poseo (autonomous, sustained iron rule #7)
- **Артефакты:**
  1. ✅ Footer pointer в 4 sustained cluster.md (vyvoz-musora / arboristika / demontazh / uborka-snega-i-chistka-krysh) → `_wave3-update-2026-05-03.md`
  2. ✅ Manual review top-30 false-negatives + top-20 false-positives + critical correction «короед штукатурка» (out of vertical, не наша вертикаль) — все в `_clustering-decisions.md`
  3. ✅ Override list (короед-жук → arboristika; селитра / измельчитель / валка леса / порубочный билет → arboristika; короед-штукатурка → exclude)
  4. ✅ Strategy doc + whitespace-priority + per-direction/arboristika.md обновлены с correction
- **Acceptance:** все met

### US-3 · Strategy doc + 5 per-direction (Phase F — DONE 2026-05-03)

- **Status:** ✅ closed
- **Артефакты:** master strategy + whitespace-priority + 5 per-direction
- **Закрывает:** AC-3
- **Owner:** poseo + seo-content

### US-4 · Per-direction content waves (sub-US US-4.1 .. US-4.5)

#### US-4.1 · Vyvoz-musora content waves

- **Priority:** P1
- **Effort:** 1 неделя
- **Status:** sa-seo ✅ ready 2026-05-04 → [`US-4-1-vyvoz-musora/sa-seo.md`](US-4-1-vyvoz-musora/sa-seo.md)
- **Deliverables:** 4 sub-services (КГМ / ТБО / контейнер / крупногаб) + 4 SD контейнеров (5/8/20/27 м³) + pillar расширение + 1 blog-bridge + FZ-89 docs
- **Owner:** seo-content + cw + cms
- **Cross-team:** podev для fe-site + tamd (ADR-uМ-19 4-level URL exception)
- **Detail:** [`strategy/per-direction/vyvoz-musora.md`](../../seosite/strategy/per-direction/vyvoz-musora.md)
- **Closes:** Wave 3 covered % с 9.7% → ≥30%

#### US-4.2 · Arboristika content waves

- **Priority:** P1
- **Effort:** 2 недели
- **Status:** sa-seo ✅ ready 2026-05-04 → [`US-4-2-arboristika/sa-seo.md`](US-4-2-arboristika/sa-seo.md)
- **Deliverables:** A1 pillar-bridge `/arboristika/arborist/` (priority-1) + 4 sub (опиловка / обработка от короеда-жука / аренда измельчителя / spil-tseny) + 3 blog-bridge
- **Important correction (US-2 output):** «короед штукатурка» — out of vertical, exclude. Target только «жук короед» (3 295) + «короед жук» (3 045) — 6 770 wsk semantic для `/arboristika/obrabotka-ot-koroeda/`
- **Owner:** seo-content + cw + cms + (cross-team) podev
- **Detail:** [`strategy/per-direction/arboristika.md`](../../seosite/strategy/per-direction/arboristika.md)
- **Closes:** AC-4 (A1 «арборист» — уникальный в pull)

#### US-4.3 · Demontazh-b2c content waves (P0 — biggest gap)

- **Priority:** **P0**
- **Effort:** 2 недели (29h team-time)
- **Status:** sa-seo ✅ ready 2026-05-04 → [`US-4-3-demontazh-b2c/sa-seo.md`](US-4-3-demontazh-b2c/sa-seo.md)
- **Proof-of-concept:** [`seosite/05-content-plan/drafts/demontazh-snos-doma.md`](../../seosite/05-content-plan/drafts/demontazh-snos-doma.md) — first sub-page draft (1 800-2 200 слов, full SEO + TOV + schema requirements + cross-link map)
- **Deliverables:** pillar расширение 2 → 8 sub (снос-дома / снос-дачи / снос-бани / демонтаж-забора / демонтаж-фундамента / снос-гаража) + 2 blog
- **Owner:** seo-content + cw + cms + podev
- **Detail:** [`strategy/per-direction/demontazh-b2c.md`](../../seosite/strategy/per-direction/demontazh-b2c.md)
- **Closes:** Wave 3 covered % 4% → 25% (biggest semantic gain per hour)

#### US-4.4 · Uborka-snega + chistka-krysh content waves

- **Priority:** P2 (closest to closure)
- **Effort:** 3 дня (24h team-time)
- **Status:** sa-seo ✅ ready 2026-05-04 → [`US-4-4-uborka-snega/sa-seo.md`](US-4-4-uborka-snega/sa-seo.md)
- **Deliverables:** 2 sub (`/chistka-krysh/chistka-krovli/` + `/chistka-krysh/uborka-snega/mehanizirovannaya/`) + parent `/chistka-krysh/uborka-snega/` + pillar обновление + ADR-uМ-19 (URL-структура — sub vs новый pillar решение)
- **Owner:** seo-content + cw + cms + tamd (для ADR)
- **Detail:** [`strategy/per-direction/uborka-snega.md`](../../seosite/strategy/per-direction/uborka-snega.md)
- **Closes:** Wave 3 covered % 53% → 75%+

#### US-4.5 · Landshaft pillar + 7 cluster (blocked)

- **Priority:** P1 (но blocked)
- **Effort:** 3 недели (после dependencies unlock)
- **Phase 1:** discovery dependencies (re Wave 2 deep + art brand-guide + Keys.so retrofit)
- **Phase 2:** pillar `/landshaftnyj-dizajn/` + 7 sub create
- **Phase 3:** Wave 4 retrofit pull для real numbers + content waves
- **Owner:** poseo + re + art + seo-content + cw + cms + podev + tamd
- **Detail:** [`strategy/per-direction/landshaft.md`](../../seosite/strategy/per-direction/landshaft.md)
- **Blocked by:** re Wave 2 deep, art brand-guide-landshaft.html

### US-5 · Monitoring update

- **Priority:** P1 (ongoing)
- **Effort:** 1 day/month
- **Deliverables:**
  1. Monthly Keys.so snapshot via `keysso_pull_competitors.py` (re-run этого pipeline)
  2. Diff vs последний snapshot — outline в `seosite/09-final-sweep/W3-month-N-diff.md`
  3. Topvisor expand до 200+ commercial ключей (когда creds получены)
  4. KPI report: pagesInIndex / closure % / position improvements / новые домены
- **Owner:** seo-tech + re-data + poseo
- **Sustained pattern:** template = artefacts US-1

---

## Sequencing (US dependencies)

```
US-1 ✅──┬─→ US-2 ──→ US-3 ✅
         │
         ├─→ US-4.1 (P1, 1 нед) ───┐
         ├─→ US-4.2 (P1, 2 нед) ───┤
         ├─→ US-4.3 (P0, 2 нед) ───┼─→ US-5 (monthly tracking, ongoing)
         ├─→ US-4.4 (P2, 3 дня)  ──┤
         └─→ US-4.5 (P1, blocked) ─┘ ← re Wave 2 + art + Keys.so retrofit
```

**Параллелизация:** US-4.1 / US-4.2 / US-4.3 / US-4.4 могут идти параллельно (разные content волны, разные cluster.md, не конфликтуют). US-4.5 ждёт unlock dependencies.

---

## Estimation summary

| US | Effort | Priority | Status |
|---|---|---|---|
| US-1 | done | P0 | ✅ |
| US-2 | 6h | P1 | dev |
| US-3 | done | P0 | ✅ |
| US-4.1 | 1 нед | P1 | sa-seo |
| US-4.2 | 2 нед | P1 | sa-seo |
| US-4.3 | 2 нед | **P0** | sa-seo (biggest impact) |
| US-4.4 | 3 дня | P2 | sa-seo |
| US-4.5 | 3 нед (blocked) | P1 | blocked |
| US-5 | 1d/мес ongoing | P1 | template ready |
| **Σ** | **5-8 weeks** | — | — |

---

## Состояние на 2026-05-04 (обновление poseo)

### Что выяснили в сессии 2026-05-04

**Пересмотр приоритетов** на основании анализа реальных URL-структур конкурентов через Keys.so:

- liwood.ru имеет **6 URL-путей** в трафике (78.5% — блог `/info/`), не geographic programmatic
- arboristik.ru имеет **59 URL** — все по типам работ, `/tsenyi/` = 35% трафика
- Наши 105 sub × district страниц (3-й уровень) конкуренты не строят → заморозить наполнение

**Новые P0-приоритеты** (из gap-матрицы `seosite/strategy/service-gap-matrix.md`):

| # | Страница | wsk | Whitespace | Конкурент |
|---|---|---:|---:|---|
| 1 | `/arboristika/obrezka-derevev/` + 4 sub | 44 387 | 34 | arboristik `/obrezka-derevev/` |
| 2 | `/uborka-territorii/vyravnivanie-uchastka/` | 544 | 0 | arboristik 73 ключа (их 2-й URL!) |
| 3 | `/uborka-territorii/raschistka-uchastka/` | 588 | 16 | arboristik 99 ключей |
| 4 | `/uborka-territorii/pokos-travy/` | 1 214 | 1 | arboristik + liwood |
| 5 | `/arboristika/udalenie-derevev/` расширение | 11 257 | 225 | крупнейший whitespace gap |

**Блокер P0:** `tamd` должен решить ADR — `/uborka-territorii/` как новый 5-й pillar или sub arboristika?
Без этого решения нельзя ставить задачи `podev` на роутинг и `sa-seo` на спеки.

### Артефакты созданы в сессии 2026-05-04

| Файл | Что |
|---|---|
| `seosite/01-competitors/url-structure-top3.md` | Реальные URL конкурентов с плотностью ключей |
| `seosite/03-clusters/services-commercial/` | 29 CSV по типам услуг (коммерческие ключи) |
| `seosite/03-clusters/services-commercial/_summary.md` | RICE-таблица кластеров |
| `seosite/05-content-plan/blog-semantic-clusters.md` | 13 тем блога с ключами |
| `seosite/strategy/service-gap-matrix.md` | **Главный документ: что создавать и в каком порядке** |
| `seosite/scripts/keysso_analyze_structure.py` | Скрипт анализа URL-структур |
| `seosite/scripts/keysso_cluster_services.py` | Скрипт коммерческих кластеров |
| `seosite/scripts/keysso_cluster_blog.py` | Скрипт кластеров для блога |

### Cleanup seosite/ выполнен

- Удалены 4 дублирующих файла (~1.7 MB)
- Заархивированы 6 устаревших скриптов + 11 justmagic raw-файлов → `seosite/_archive/`

---

## Hand-off log

- 2026-05-03 12:30 · operator → poseo: «вытащить по всем конкурентам... обыграем конкурентов»
- 2026-05-03 13:00 · poseo → operator: AskUserQuestion 4 решения collected
- 2026-05-03 13:30 · poseo: Phase A-F executed inline (pull + intersect + filter + tier + strategy)
- 2026-05-03 14:00 · poseo → seo-content: US-2 manual review top-100 × 5 + override list
- 2026-05-03 14:00 · poseo → cms (cross-team) + podev (cross-team) + cw: US-4.1 / 4.2 / 4.3 / 4.4 dev start parallel (P0 priority US-4.3 demontazh-b2c)
- 2026-05-03 14:00 · poseo → re + art: US-4.5 landshaft blocked, sustained dependencies pending
- 2026-05-04 · poseo: конкурентный анализ через Keys.so URL-структуры, пересмотр P0-приоритетов, gap-матрица, сleanup seosite/
- 2026-05-04 · poseo → tamd: **нужен ADR — `/uborka-territorii/` новый pillar или sub arboristika? Блокирует P0 спеки.**
- 2026-05-04 · poseo → sa-seo: ждём ADR от tamd, затем спеки для 5 P0-страниц по `service-gap-matrix.md`

---

## Дополнительный operator backlog (sustained pending от Wave 3)

1. **🔐 Регенерация Keys.so токена** — security flag (sustained от 12:30 2026-05-03; токен светился в чате)
2. **Probe-проект `_probe_liwood`** (id=135646) — удалить в UI Keys.so либо разрешить `POST /projects/delete`
3. **Topvisor creds** (sustained от W3, 2026-04-25) — нужны для US-5 expansion на 200+ ключей
4. **Я.ВебМастер access** (sustained) — для AC-2 monitoring crawl progress
5. **Real-name + VK/TG/MAX `sameAs`** (sustained от W11) — closes E-E-A-T axis в опережение
6. **Решение по landshaft 5 кандидатам TBD** — re Wave 2 deep
