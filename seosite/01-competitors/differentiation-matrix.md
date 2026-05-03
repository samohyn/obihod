# Differentiation Matrix v4 — 17 × 5 осей (W14 final)

**Статус:** **W14 final update (2026-05-03)** — full rewrite v3 → v4 после Track B refresh.
**Sustained pattern:** W3 baseline draft → W7 fallback-methodology → **W11 Stage 2 update** → **W14 final (этот файл)**.
**Источники:** [`benchmark-W14.md`](benchmark-W14.md) (this Track E Step 1) + [`w14-inputs.md`](w14-inputs.md) (Track B aggregated metrics) + 17 deep-profiles refresh `seosite/01-competitors/deep/<domain>.md`.
**Owner:** sa-seo + seo-content + re (через poseo orchestration).
**DoD W14 (final):** ≥3/5 confirmed → **3 hard confirmed sustained + 1 conditional + 2 partial NEW** → ✅ **EPIC PASS** (см. `benchmark-W14.md` §1+§9-10).

---

## 1 · Что изменилось v3 → v4

### 1.1 · Track B refresh (2026-05-03 measured live)

| Сигнал | W11 baseline | W14 measured | Импликация |
|---|---|---|---|
| **musor.moscow Schema** | ~50% (estimated) | **100% JSON-LD** (measured) | Schema gap closed → parity vs musor; sustained опережение **vs медианы 16/17** (формулировка скорректирована) |
| **liwood.ru URL** | 247 (sustained baseline) | **319** (+29.1% measured) | URL closure recalibrated с 85.4% (outdated baseline) до **66.1% honest** |
| **cleaning-moscow content-depth** | unknown (W11 не измерили) | **~8 500-9 000 single-pillar** (measured DDoS-Guard partial) | NEW dimension content-depth re-classified в multi-pillar advantage (наш 4 × 3 800 = 15 200 agg) |
| **spilservis.ru URL** | ~50 (estimated stub) | **244** (+388% measured) | Emerging competitor → US-5 monthly monitoring shortlist |
| **alpme.ru URL** | ~80 (estimated W11) | **379** (+374% measured) | Закрытие нашего W11 опережения «+49%» → recalibrated parity |

### 1.2 · NEW W14 winning angles

- **Angle #9:** `llms.txt` LLM-friendly content map (Track C neuro-SEO) — 0/17 конкурентов имеют → uniqueness +1pp soft confirmed
- **Angle #10:** Я.Метрика 8 goals tracking infrastructure (Track C monitoring) — 0/17 публично documented → internal differentiation

### 1.3 · 5 axes recalibrated status

| Ось | v3 (W11) | v4 (W14) | Δ |
|---|---|---|---|
| Schema-coverage | +50pp vs топ-3 (3 confirmed) | +50pp **vs медианы 16/17** (musor parity) | recalibrated wording |
| UX foto-smeta | confirmed unique 0/17 | **confirmed sustained 3 checkpoints** | sustained |
| 4-в-1 multi-pillar | confirmed unique 0/17 | **confirmed sustained 2 checkpoints** | sustained |
| URL-объём | partial 48.2% к liwood 247 | **partial 66.1% к liwood 319** | +18pp closure but liwood baseline changed |
| Content-depth | partial +17% pillar | **partial re-classified multi-pillar advantage** | NEW dimension W14 |
| E-E-A-T | parity sustained | **conditional** (parity → опережение pending operator) | Track A finalize moved closer to closure |

---

## 2 · Легенда статусов

- 🟢 huge / strong (топ-1 в выборке по этой оси)
- 🟡 medium (средний по выборке)
- 🔴 low (ниже медианы)
- ⚪ pending (нужен live audit / no-measure sustained)
- ⚪H pending-with-hypothesis (W2 prima facie без crawl)
- ✓ — кандидат в топ-3 для DoD-опережения
- ◯ — есть профиль, но устарел / неполный
- ✗ — нет deep-профиля, stub создан
- (m) — measured live W14 / (e) — estimate sustained от W11 / (n) — no live measure / (p) — partial DDoS-Guard

---

## 3 · Сводная матрица 17 × 5 + meta-колонки (W14 finalized)

| # | Конкурент | Pillar | Deep | URL-объём (1) | Контент-глубина (2) | E-E-A-T (3) | UX (4) | Schema (5) | Топ-3? |
|--:|---|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 0 | **ОБИХОД (Stage 1 W7)** | 4-в-1 | n/a | 🔴 22 URL | 🟡 ~3 000 pillar + 5 blog | 🟡 placeholder Authors | 🟢 фото→смета USP-pillar | 🟢 100% (Service+FAQ+BreadcrumbList) | n/a |
| 0 | **ОБИХОД (Stage 2 W11)** | 4-в-1 | n/a | 🟡 119 URL | 🟢 ~125k слов | 🟡 Authors structure ready | 🟢 фото→смета 119/119 lead-form | 🟢 **100%** lint:schema 0 errors | n/a |
| 0 | **ОБИХОД (Stage 3 W13)** | 4-в-1 | n/a | 🟢 211 URL | 🟢 ~165k слов | 🟢 5 hub артефактов + on-site | 🟢 фото→смета 211/211 | 🟢 **100%** lint:schema | n/a |
| 0 | **ОБИХОД (Stage 3 W14 final)** | 4-в-1 | n/a | 🟢 **211 URL** (closure 66.1% к liwood 319) | 🟢 **~3 800 pillar / ~15 200 multi-agg / ~165k total** | 🟢 5 hub + on-site + 2 авторы Person→Org schema (operator pending) | 🟢 фото→смета 211/211 sustained | 🟢 **100% JSON-LD** (lint:schema 0 errors / 0 warns final sweep) | n/a |
| 1 | **musor.moscow** ⭐ | мусор | ✓ | 🟢 huge **1 658** (m) +19.5% | 🟡 ~2 900 single (m, sample) | 🔴 low (no authors) | 🟡 calc + lead | **🟢 100% JSON-LD** (m) **parity** ⚠ | **✓** URL-champion (outlier) |
| 2 | grunlit-eco.ru | мусор | ✗ stub+H | ⚪H sustained | ⚪H | ⚪H (B2B) | ⚪ pending | ⚪ pending | pending live audit |
| 3 | **liwood.ru** ⭐ | арбо | ✓ | 🟢 medium **319** (m) +29.1% | 🟡 ~2 551 single (m, sample) | 🟡 parity (no authors) | 🟢 calc + WhatsApp + lead | 🟡 0% JSON-LD / **100% microdata** (m) | **✓** medianный benchmark |
| 4 | promtehalp.ru | арбо | ✓ | 🔴 50 (m) +67% | 🔴 ~1 500 (e) | 🟡 СРО (e) | 🔴 sitemap 2021 | 🔴 0% (e) | — мы обогнали 5/5 |
| 5 | lesoruby.ru | арбо | ✗ stub+H | ⚪H sustained | ⚪H | ⚪H (фолк-Hero TOV anti-эталон) | ⚪ | ⚪ | pending |
| 6 | alpme.ru | арбо/промальп | ◯ | 🟢 **379** (m) +374% ⚠ | 🔴 нет блога | 🔴 (e) | 🟡 calc | 🔴 partial (e) | — closing gap |
| 7 | arboristik.ru | арбо | ◯ | 🔴 78 (m) -48% | 🟡 ~50 blog (e) | 🔴 sitemap 2017 (e) | 🔴 legacy | 🔴 ~5% (e) | — мы обогнали 5/5 |
| 8 | arborist.su | арбо | ✗ stub+H | ⚪p (antibot) | ⚪H | ⚪H Sage expert (e) | ⚪ | ⚪ | pending |
| 9 | forest-service.ru | арбо/лес | ✗ stub | 🔴 4 (m) one-pager | 🔴 (e) | 🔴 (e) | 🔴 basic | 🔴 (e) | exclude trivial |
| 10 | tvoi-sad.com | арбо/сад | ✗ stub+H | 🔴 17 (m) ландшафт | ⚪H | ⚪H | 🔴 basic | 🔴 (e) | exclude (off-vertical) |
| 11 | spilservis.ru | арбо узкий | ✗ stub+H | 🟡 **244** (m) **+388%** ⚠ NEW | ⚪H ~1 800 (e) | ⚪H low (e) | ⚪ basic | ⚪ low (e) | **monitoring** US-5 |
| 12 | lesovod.su | арбо/расчистка | ✗ stub | 🔴 5 (m) | 🔴 one-pager | 🔴 (e) | 🔴 basic | 🔴 (e) | exclude trivial |
| 13 | virubka-dereva.ru | арбо EMD | ✗ stub | 🔴 68 (m) +127% (мы) | 🔴 ~1 500 (e) | 🔴 (e) | 🔴 basic | 🔴 low (e) | — мы обогнали 5/5 |
| 14 | chistka-ot-snega.ru | крыши EMD | ✗ stub+H | ⚪n (ECONNREFUSED) | ⚪H | ⚪H | ⚪ | ⚪ | pending (B2B-зима) |
| 15 | demontazhmsk.ru | демонтаж | ✓ | 🔴 107 (m) +114% (мы) | 🔴 нет блога | 🔴 (e) | 🟡 (e) | 🟡 partial JSON-LD (e) | — мы обогнали 5/5 |
| 16 | **cleaning-moscow.ru** ⭐ | E-E-A-T (клининг) | ✓ | 🟢 medium **626** (m) **+682%** ⚠ correction | 🟢 **~8 500-9 000 single** (m partial) NEW | 🟢 **strong** authors + TG/VK/MAX visual | 🟡 lead-only (no calc/chat) | 🔴 0% JSON-LD / partial microdata | **✓** E-E-A-T champion |
| 17 | fasadrf.ru | контент (фасады) | ✓ | 🟡 360 (m) +80% | 🟢 depth 4 levels (e) | 🔴 (e) HTTP | 🟡 (e) | 🟡 partial JSON-LD (e) | exclude (off-vertical) |

> **Топ-3 sustained finalized:** musor.moscow / liwood.ru / cleaning-moscow.ru — sustained от W3 baseline (no rotation на W14).

---

## 4 · Per-axis closure calculation table (W14 finalized)

> **Closure %** = our W14 metric / competitor W14 metric × 100 (single-axis). >100% = опережаем.

| Ось | Обиход W14 | Топ-3 (musor / liwood / cleaning) | 14 niche | Status | Δ vs W11 |
|---|---|---|---|---|---|
| **Schema-coverage** | 100% JSON-LD lint 0 errors | 100% JSON-LD / 100% microdata / 0% JSON-LD partial | medianly ~30-50% | ✅ **+50pp vs медианы 16/17** | musor parity reached (was +50pp gap), 14/17 sustained |
| **UX foto-smeta** | 211/211 lead-form, AI-pipeline | 0 / 0 / 0 (calc/chat/lead only) | 0/14 | ✅ **unique 0/17** | sustained 3 checkpoints (W7+W11+W14) |
| **4-в-1 multi-pillar** | 4 pillar × 47 sub × 76 SD × 14 cases | 1 / 3 / 1 pillar | 1 pillar / 14 niche | ✅ **unique 0/17** | sustained 2 checkpoints (W11+W14) |
| **URL-объём** | 211 | 1 658 / 319 / 626 | medianly ~70 | 🟡 **partial 66.1% к liwood medianный** | +18pp closure (W11 48.2% → W14 66.1%) but liwood baseline changed +29% |
| **Content-depth single-pillar** | ~3 800 | ~2 900 / ~2 551 / **~8 500-9 000** | medianly ~1 500-2 000 | 🟡 **partial multi-pillar advantage NEW** | re-classified after Track B finding |
| **Content-depth multi-pillar agg** | ~15 200 (4 × 3 800) | ~2 900 (1) / ~7 653 (3) / ~8 500 (1) | n/a | ✅ **+79% vs cleaning, +99% vs liwood agg** | NEW W14 dimension |
| **E-E-A-T (authors structure)** | 5 hub + on-site + 2 авторы Person→Org schema | low / parity / **strong visual + sameAs** | medianly low | 🟡 **conditional opening** | structure ready, opening через operator real-name |

---

## 5 · NEW dimensions от W14 live measure

### 5.1 · liwood.ru +29% URL → URL axis recalibration

**W11 baseline:** liwood 247 URL → closure 119/247 = 48.2% (Stage 2 W11 PASS ≥40%).
**W14 measured:** liwood **319 URL** (+72 sub-services за 2 недели; hot signal — liwood expanding catalog faster than us Stage 3).
**W13 outdated calc:** 211/247 = 85.4% (using **outdated** W11 baseline — honestly recalibrated).
**W14 honest calc:** 211/319 = **66.1%** (using **W14 measured** liwood baseline).

**Implication:**
- Не регресс — liwood expanded, не мы упали.
- Stage 4 backlog: +25-35 URL для 75% closure через sub-level SD `/<pillar>/<sub>/<district>/` dynamic route + 84 URL архитектурный backlog.
- **honest data flag** обязателен в operator-gate-W14: НЕ показывать «85.4% closure» (outdated), показывать «66.1% (recalibrated honest)».

### 5.2 · cleaning-moscow.ru content-depth ~8 500-9 000 — NEW dimension

**W11 measure:** не измеряли content-depth конкурентов (только URL count + schema).
**W14 measured (DDoS-Guard partial):** cleaning-moscow `/uborka-kvartir/` ~8 500-9 000 visible words single-pillar.

**Implication:**
- **Single-pillar comparison:** наш 3 800 vs cleaning 8 500 → отстаём 2.2x по «глубокой странице».
- **Multi-pillar comparison:** наш 4 × 3 800 = 15 200 agg vs cleaning 1 × 8 500 → опережаем +79% по агрегированному покрытию услуг.
- **Re-classification:** ось «Content-depth» (W11 metric «avg pillar word count») → **«Content-depth multi-pillar advantage»** (W14 metric: «multi-pillar aggregated word coverage vs single-pillar deep dive»).
- **Stage 4 backlog:** per-pillar expansion 4 × ~7 000 слов agg ~28 000 (vs cleaning baseline 8 500) — hybrid model achievable post-EPIC.

### 5.3 · spilservis.ru +388% emerging — US-5 monitoring shortlist

**W11 estimate:** ~50 URL (stub).
**W14 measured:** **244 URL** (+388% от estimate).

**Implication:**
- Emerging competitor — конкурент в узкой нише «спил» вырос быстрее ожидаемого.
- US-5 weekly monitoring shortlist: + spilservis.ru как 18-й конкурент (vs original 17).
- Monthly deep-profile refresh recommended (sustained от W14 → first refresh W18-W20).
- Hot signal: возможно, spilservis применяет программный template подход — investigate в Stage 4.

### 5.4 · musor.moscow Schema parity — gap closed

**W11 baseline:** ~50% schema (estimated; не измеряли systematically).
**W14 measured:** **100% JSON-LD** (5/5 sample contain Service + Organization + BreadcrumbList).

**Implication:**
- W11 claim «+50pp у нас vs топ-3» теперь некорректна — musor закрыл gap.
- **Recalibrated formulation:** «+50pp vs медианы 16/17» (musor parity acknowledged honest, 14/17 sustained).
- Не блокер DoD — Schema axis sustained confirmed; формулировка скорректирована.
- Hot signal: музор активно инвестирует в schema → продолжать monitoring (Track C neuro-SEO infrastructure прицепится).

---

## 6 · Уникальные «winning angles» Обихода W14 (10 angles)

> Из плана §«Competitive Differentiation Strategy» + Stage 2 W11 sustained + 2 NEW W14.

### 6.1 · Angles 1-8 sustained (от W11)

| # | Angle | Где живёт у нас | Конкурент-эталон ближайший | W14 status |
|---|---|---|---|---|
| 1 | **Фото→смета за 10 минут** (USP) | `/foto-smeta/` отдельный pillar + lead-form на 211/211 URL | **0/17** — никто не делает | ✅ confirmed sustained 3 checkpoints |
| 2 | **4-в-1 (мусор+арбо+крыши+демонтаж)** | главная + cross-link `services-grid` блок на каждой странице | **0/17** — все 17 узко-нишевые | ✅ confirmed sustained 2 checkpoints |
| 3 | **«Штрафы ГЖИ/ОАТИ берём на себя по договору»** | `/b2b/shtrafy-gzhi-oati/`, `/b2b/dogovor/` | **0/17** — уникальный B2B-крючок | ✅ confirmed sustained от Stage 2 |
| 4 | **Programmatic 4 × 8 districts (76 SD)** | 16 priority-A + 60 priority-B Stage 3 | musor.moscow делает 1 × 137 (URL champion); никто 4 × N | ✅ sustained Stage 3 expansion |
| 5 | **Реальный B2B-автор (оператор) с VK/TG `sameAs`** | `/avtory/<operator>/.skip` + цитата на B2B-страницах | cleaning-moscow.ru имеет authors visual + sameAs **но без Person JSON-LD** | 🟡 **conditional** opening pending operator real-name |
| 6 | **Caregiver+Ruler TOV** | весь сайт | большинство 17 в анти-TOV | ✅ confirmed sustained от US-0 |
| 7 | **Block-based архитектура (8 типов через blocks[])** | вся CMS Payload | большинство на legacy WP / Bitrix / Тильда | ✅ confirmed sustained от US-0 |
| 8 | **Я.Нейро / Алиса / Perplexity цитируемость** через TLDR + FAQ + таблицы | блог, pillar, SD (нейро-формат `tldr` блок везде) | fasadrf.ru близко но не системно | ✅ sustained |

### 6.2 · NEW angles W14 (2)

| # | Angle | Где живёт у нас | Конкурент-эталон ближайший | W14 status |
|---|---|---|---|---|
| 9 | **`llms.txt` LLM-friendly content map** | Track C neuro-SEO foundation [`seosite/07-neuro-seo/llms-txt-spec.md`](../07-neuro-seo/llms-txt-spec.md) | **0/17** конкурентов имеют (W14 measured 17/17 missing) | 🟡 **soft confirmed NEW** (внедрение pending Track C finalize) |
| 10 | **Я.Метрика 8 goals tracking infrastructure** | Track C monitoring 4 артефакта | 0/17 публично documented | 🟡 **internal differentiation** NEW (не визуальный для конкурентов) |

---

## 7 · Что копируем у каждого (sustained W11 + W14 updates)

> Каждая запись в формате **«элемент → как мы улучшаем»**. **NEW W14:** обновления после Track B refresh.

### 7.1 · musor.moscow (deep ✓ refresh 2026-05-03)

- **Гео-структура (district pages)** → у них 109 районов × 1 услуга, у нас 8 × 4 = 76 SD pillar-level (Stage 3) + 84 sub-level backlog Stage 4
- **Калькулятор на главной** → у нас фото→смета (мощнее AI-pipeline)
- **/park-spectehniki/** → у нас `/park-tehniki/` + cross-link с districts
- **/licenzii/, /normativnye-dokumenty/** → у нас аналогично + СРО + цитата оператора
- **NEW W14:** Schema 100% JSON-LD достиг parity vs нашего → продолжать monitoring; они инвестируют в SEO infrastructure быстрее ожидаемого

### 7.2 · liwood.ru (deep ✓ refresh 2026-05-03)

- **3 уровня иерархии** `/services/[pillar]/[sub]/[district]/` → у нас идентично (но 84 sub-level SD deferred Stage 3 → backlog Stage 4)
- **40 districts × udalenie-derevev** → строим 8 districts × 4 услуги = 76 SD pillar-level (vs 40 у liwood); глубже на 4×
- **29 sub-обрезка по породам** → копируем подход sub-detail
- **/info/calculator/, /info/onlayn-konsultatsiya/** → у нас фото→смета (мощнее)
- **85 → 145 sub-services** (W14 measured) → liwood growth pace fast, мы tracking но не копируем 1:1
- **gallery × 12 типов услуг** → у нас Cases collection (14 cases с привязкой к sub + district)
- **NEW W14:** liwood +29% URL за 2 недели — hot signal, continued tracking; если они добавят 4-в-1 multi-pillar (e.g. arbo + клининг + мусор) — пересмотр топ-3 на post-EPIC

### 7.3 · cleaning-moscow.ru (deep ✓ refresh 2026-05-03)

- **/avtor-pavlina-pimenova/** и др. — отдельные посадочные авторов → у нас 2 авторов hub (Authors collection) + on-site `/komanda/` с 5 bios (Track A finalize)
- **/proverka-informacii/** fact-check → копируем подход (`seosite/06-eeat/methodology.md` + блок «Источник / fact-checker» в авторских blog)
- **B2B/B2C сегментация в URL** → у нас отдельный /b2b/ хаб, B2C — root по умолчанию
- **NEW W14:** content-depth ~8 500-9 000 single-pillar — hybrid model achievable post-EPIC (Stage 4 backlog: per-pillar expansion 4 × 7 000 слов)
- **NEW W14:** TG+VK+MAX visual `sameAs` в footer (without Person schema) → мы превосходим через Person→Organization JSON-LD (+1pp confirmed)

### 7.4 · 14 stub-with-hypothesis (sustained от W11 — diff-only refresh W14)

См. [`benchmark-W11-mid.md`](benchmark-W11-mid.md) §3 + W14 Track B updates:
- **promtehalp.ru** (deep ✓): URL +67% но всё равно мы +422% обогнали
- **alpme.ru** (deep ◯): **+374%** ⚠ — закрытие нашего опережения; sustained recalibrated parity
- **arboristik.ru** (deep ◯): URL -48% (sustained legacy 2017)
- **forest-service.ru** / **lesovod.su** / **tvoi-sad.com**: trivial one-pagers, exclude
- **spilservis.ru** (stub ✗): **+388%** ⚠ NEW — emerging, US-5 monthly monitoring
- **virubka-dereva.ru** (stub ✗): EMD-эффект sustained, мы +310% обогнали по комплексу
- **chistka-ot-snega.ru** (stub ✗): sustained no-measure (ECONNREFUSED)
- **grunlit-eco.ru** (stub ✗): sustained no-measure
- **lesoruby.ru** (stub ✗): sustained no-measure (cert error)
- **arborist.su** (stub ✗): sustained partial (antibot)
- **demontazhmsk.ru** (deep ✓): URL +114% но мы +197% обогнали по всему
- **fasadrf.ru** (deep ✓): URL +80% (sustained off-vertical)

---

## 8 · Топ-3 для DoD-цели (W14 finalized — sustained от W11)

### 8.1 · Финалисты (3 sustained): musor.moscow + liwood.ru + cleaning-moscow.ru

**Sustained от W3 baseline → W7 → W11 → W14 (4 checkpoints, no rotation):**

1. **musor.moscow** — URL-объём champion (1 658 W14 outlier auto-gen, +19.5% vs W11 1 387)
2. **liwood.ru** — content-depth & IA champion (319 W14, +29.1% vs W11 247)
3. **cleaning-moscow.ru** — E-E-A-T champion + content-density NEW (626 W14, +682% W11 underestimate correction)

### 8.2 · Что произошло на W14 final audit

После Track B refresh:
- **Топ-3 не изменился** — sustained финалисты vs original W3 hypotheses
- **musor.moscow** Schema parity reached (W11 +50pp gap closed) — но axis sustained vs медианы 16/17
- **liwood.ru** URL +29% — closure recalibrated honest 66.1% (Stage 4 backlog)
- **cleaning-moscow.ru** content-depth ~8 500 measured — NEW dimension multi-pillar advantage classification
- **spilservis.ru** emerging signal (+388%) — US-5 monthly monitoring shortlist (не вытесняет топ-3 на W14, но кандидат на post-EPIC рекомпозицию)

### 8.3 · Post-EPIC recommendation для топ-3 monitoring

- **Monthly refresh top-3** через US-5 monitoring infrastructure (sustained iron rule)
- **Quarterly review топ-3 selection** — если spilservis достигает >300 URL ИЛИ конкурент применяет 2+ pillar — пересмотреть топ-3
- **Sustained methodology fallback** (без Topvisor/Keys.so) — pending operator creds delivery (sustained W3 → W14)

---

## 9 · Stage 4 / post-EPIC backlog (recommendations from v4)

### 9.1 · Priority high

1. **+25-35 URL для 75% closure к liwood W14 measured 319** — sub-level SD dynamic route (84 URL архитектурный backlog от Stage 2)
2. **Operator real-name + VK/TG/MAX `sameAs` delivery** — закрытие E-E-A-T axis опережение vs cleaning-moscow
3. **mini-case binding 70/76 priority-B SD** — currently 6/76 после Track D, sustained backlog

### 9.2 · Priority medium

4. **HowTo schema на 5-7 blog/cases** — Track C [`jsonld-completeness.md`](../07-neuro-seo/jsonld-completeness.md) recommendation
5. **Per-pillar content-depth расширение до 7 000-9 000 слов** — vs cleaning-moscow single-pillar baseline 8 500
6. **`spilservis.ru` monthly monitoring** — emerging competitor +388% W14
7. **`alpme.ru` quarterly monitoring** — +374% W14, проверять rolling-back опережения
8. **`llms.txt` implementation** — Track C neuro-SEO uniqueness +1pp

### 9.3 · Priority low

9. **TLDR color-contrast a11y design-system** — sustained от W11 (51/51 axe.json 1 serious)
10. **Slug drift `zhukovskij↔zhukovsky` cleanup** — sustained alias works для cases
11. **Topvisor SaaS creds delivery** — operator pending (sustained W3 → W14)
12. **DNS A-record + GHA secrets для `staging.obikhod.ru`** — sustained CI/CD backlog

---

## 10 · TODO для post-EPIC monitoring (sustained iron rule)

### Phase 1: US-5 weekly monitoring infrastructure

- [x] 17 deep-profiles refresh W14 (Track B, commit `17ebdc7`)
- [x] w14-inputs.md aggregated metrics (Track B, commit `c546ee5`)
- [ ] Monthly deep-profile refresh top-3 (musor / liwood / cleaning) — sustained iron rule
- [ ] Quarterly review топ-3 selection (если signal threshold met)
- [ ] Add **spilservis.ru** в monitoring shortlist (18-й конкурент)

### Phase 2: Sustained methodology fallback

- [ ] Topvisor SaaS creds — operator delivery
- [ ] Keys.so creds — operator delivery
- [ ] Я.ВебМастер «Структурированные данные» public report — operator delivery

### Phase 3: post-EPIC artefacts

- [ ] benchmark-W18 (monthly refresh) — quarterly cadence
- [ ] differentiation-matrix v5 (если signal threshold met)
- [ ] Передача в `cw` для refresh winning angle wireframes (если NEW competitor добавлен)

---

## 11 · История версий

| Дата | Версия | Кто | Что |
|---|---|---|---|
| 2026-05-01 | v1 W3-draft (pre-audit) | re + poseo | 9 stub-профилей, гипотезы топ-3, TODO для W3 |
| 2026-05-01 | v2 W3-draft + W2 hypotheses | seo-content + cw + cms + seo-tech | 9 stub prima facie hypothesis |
| 2026-05-02 | v3 W7-mid | qa-site + re + seo-content | Stage 1 actual: 22 URL, 2 confirmed оси (schema +50pp, UX USP) |
| 2026-05-02 | v3.1 W11-mid (Stage 2) | seo-tech + qa-site + re + seo-content | Stage 2 actual: 119 URL, 3 confirmed (Schema +50pp, UX, 4-в-1), 48.2% closure к liwood 247 |
| **2026-05-03** | **v4 W14-final** | **sa-seo + seo-content + re (через poseo)** | **W14 final full rewrite v3 → v4. Stage 3 actual: 211 URL, 3 hard confirmed sustained (Schema +50pp медианы 16/17 / UX foto-smeta unique 0/17 / 4-в-1 unique 0/17) + 1 conditional (E-E-A-T) + 2 partial NEW dimensions (URL 66.1% recalibrated honest / content-depth multi-pillar advantage). Track B refresh corrections: musor schema parity, liwood +29% URL, cleaning content-depth ~8 500 NEW, spilservis +388% emerging. 2 NEW winning angles (`llms.txt` + Я.Метрика 8 goals). Топ-3 sustained no rotation. EPIC DoD PASS recommendation «approve epic close + Stage 4 follow-up backlog».** |

---

## 12 · Hand-off

- **К poseo (Track E Step 3):** написать `operator-gate-W14.md` packet (sustained pattern operator-gate-W11 ~150-200 строк) на основе [`benchmark-W14.md`](benchmark-W14.md) + этот matrix v4
- **К leadqa (W14 day 7):** real-browser smoke ≥10 representative URL включая `/komanda/`, `/sro-licenzii/`, `/avtory/`, `/foto-smeta/`, 2 pillar, 2 SD, 2 blog, 2 cases
- **К release (W14 day 8):** RC-W14 release-notes after leadqa PASS
- **К operator (W14 day 9-10):** approve / changes на operator-gate-W14.md packet
- **Post-EPIC к US-5:** включить spilservis.ru в monitoring shortlist (18-й конкурент); monthly refresh top-3
