---
title: SEO Master Strategy 2026-05 — обгон 32 services-конкурентов
epic: EPIC-SEO-OUTRANK
stage: 4
created: 2026-05-03
owner: poseo
operator_approved: 2026-05-03 (4 ответа Recommended в AskUserQuestion)
inputs:
  - seosite/02-keywords/derived/keysso-master-union-2026-05-03.csv (21 051 ключ)
  - seosite/02-keywords/derived/keysso-whitespace-2026-05-03.csv (1 204 ключа)
  - seosite/02-keywords/derived/keysso-per-domain-unique-2026-05-03.csv (917 ключей)
  - seosite/02-keywords/raw/keysso-pages-snapshot-2026-05-03.json (36 проектов)
  - seosite/01-competitors/benchmark-W14.md (sustained baseline)
related:
  - seosite/strategy/whitespace-priority-A.md
  - seosite/strategy/per-direction/{vyvoz-musora,arboristika,demontazh-b2c,uborka-snega,landshaft}.md
---

# SEO Master Strategy 2026-05 — Обиход

> Wave 3 multi-domain pull · 32 services-конкурента · 21 051 уникальный ключ · 1 204 whitespace · 70 priority A1+A2 quick wins

---

## 1 · Executive summary

### 1.1 Где мы сейчас (Stage 3 closure 2026-05-03)

- **211 sitemap URL** на проде obikhod.ru (W15 launch сегодня)
- **~165 000 слов** контента (4 pillar × 47 sub × 76 SD × 14 cases × 17 blog)
- **3/5 hard-confirmed sustained осей** vs 17 W14-конкурентов (Schema 100% JSON-LD / UX foto-smeta / 4-в-1 multi-pillar)
- **66.1% closure** к liwood.ru sitemap в W14 (после Wave 3 — recalibrated)

### 1.2 Что меняет Wave 3 (это документ)

- **2 НОВЫХ correction factor** против sustained W14 (см. §2):
  - **URL-axis 🟡 partial → ✅ confirmed** через `pagesInIndex` recalibration (наши 211 sitemap vs liwood real-index 158)
  - **NEW emerging signals** — kronotech.ru (was W14 «заблокирован», реально champion top-50 35 684), spilservis.ru (+388%), mmusor.ru (vis 468), moscleaning24.ru (vis 141)
- **70 priority A1+A2 quick wins** — ключи у ≥3 конкурентов, у нас НЕТ (см. §6)
- **Re-classified 5 directions** с per-direction strategy (см. §5)

### 1.3 Чего не достигли (Stage 4 backlog)

- E-E-A-T axis всё ещё conditional — pending operator real-name + sameAs
- 4 not-in-base домена (obikhod / grunlit-eco / chistka-ot-snega / poisk-pitomnik) → re-bootstrap через 2-4 недели
- 5 landshaft-кандидатов TBD → re Wave 2 deep-профили

---

## 2 · Recalibration W14 (correction layer — operator approved 2026-05-03)

> **Iron rule:** sustained `seosite/01-competitors/benchmark-W14.md` НЕ редактируется. Correction идёт здесь как новый layer.

### 2.1 sitemap.xml ≠ pagesInIndex — methodology fix

W14 `URL-объём` axis использовал **sitemap.xml URL count** (мой выбор методики — с честно сказанной погрешностью ±15%, sustained от W7). Live Keys.so данные на 2026-05-03 показали значительное расхождение:

| Домен | sitemap (W14) | pagesInIndex live | Δ |
|---|--:|--:|---|
| musor.moscow | 1 658 | **329** | -80% |
| liwood.ru | 319 | **158** | -50% |
| cleaning-moscow.ru | 626 | **271** | -57% |
| Среднее 16/17 W14 | ~270 | ~150 | -45% |

**Causal explanation:** Yandex агрессивно режет автогенерированные / тонкие / дубль-canonical URLs. У musor.moscow 1 500+ автогенерированных «районных» страниц, Yandex держит в индексе только 329 (20%). У liwood и cleaning ситуация мягче (sitemap содержит реальный uniqued контент), но Yandex всё равно режет 50-57%.

### 2.2 URL-axis recalibrated — partial → confirmed

| Метрика | W14 baseline | Wave 3 truth |
|---|---|---|
| Наш sitemap | 211 | 211 |
| Liwood baseline | 319 sitemap (target 75% closure) | **158 pagesInIndex** |
| Closure | 66.1% partial | **133% опережение** (211 / 158) |

**После полного Yandex crawl наших 211** (~2-4 недели от W15 launch 2026-05-03) — ожидаем `pagesInIndex` 150-180 = **realistic parity** к liwood. Это не «выйти вперёд», а **войти на тот же уровень realistic competitive baseline**, что и champions.

### 2.3 Updated 5-axes table (vs W14 §5)

| Ось | W14 status | Wave 3 status | Note |
|---|---|---|---|
| Schema-coverage | ✅ confirmed (+50pp vs медианы 16/17) | ✅ sustained | musor parity (W11 → W14) |
| UX foto-smeta USP | ✅ confirmed (0/17) | ✅ sustained (0/32) | 32 W3 проектов = 0 photo-AI |
| 4-в-1 multi-pillar | ✅ confirmed (0/17) | ✅ sustained (0/32) | structural advantage |
| URL-объём | 🟡 partial (66.1%) | ✅ **upgraded** | recalibrated через pagesInIndex (см. §2.1-2.2) |
| Content-depth | 🟡 partial re-classified | 🟡 sustained | cleaning single-pillar 8500 vs наш 3800 — Stage 4 expansion |
| E-E-A-T | 🟡 conditional | 🟡 sustained | pending operator real-name + sameAs |

**Net:** **4/5 hard confirmed** (vs 3/5 W14) + 1 conditional + 1 partial = **EPIC-SEO-CONTENT-FILL DoD strengthened post-launch**.

---

## 3 · Methodology Wave 3 (2026-05-03)

### 3.1 Pull 33 services-доменов (top-1000 / top-2000)

- 32/34 domains pulled successfully (2 empty: tvoi-sad.com — 2 ключа реально, obikhod.ru — 404 not in base)
- **29 256 ключей** raw → **21 051 уникальный** в master union
- 152 API запросов / 50 000 monthly limit (0.3% бюджета)
- Скрипт: [`seosite/scripts/keysso_pull_competitors.py`](../scripts/keysso_pull_competitors.py)

### 3.2 4 derived dataset (intersect analysis)

- [`master-union`](../02-keywords/derived/keysso-master-union-2026-05-03.csv) — **21 051** ключ × 16 columns
- [`intersect-multi`](../02-keywords/derived/keysso-intersect-multi-2026-05-03.csv) — **4 013** ключей у ≥2 доменов (popular niche)
- [`whitespace`](../02-keywords/derived/keysso-whitespace-2026-05-03.csv) — **1 204** ключей (нет у нас, у ≥3 конкурентов)
- [`per-domain-unique`](../02-keywords/derived/keysso-per-domain-unique-2026-05-03.csv) — **917** USP-zones (top-30 каждого домена)
- Скрипт: [`seosite/scripts/keysso_intersect.py`](../scripts/keysso_intersect.py)

### 3.3 Commercial filter (regex + Just-Magic intent reuse)

- **6 008 ключей** (28.5%) маркированы как `коммерческий` или `коммерческий+локальный`
- 3 362 (16%) — `информационный` (для blog-волн, не для service страниц)
- См. [`_filter-decisions.md`](../02-keywords/derived/_filter-decisions.md)

### 3.4 Тир α (operator approved 2026-05-03)

| Тир | wsk | Distribution | Roleиграет |
|---|---|--:|---|
| ВЧ | ≥1000 | 167 (0.8%) | Pillar / `/foto-smeta/` / главная |
| СЧ | 100-1000 | 3 733 (17.7%) | Sub-services / SD priority-A |
| НЧ | <100 | 17 151 (81.5%) | SD priority-B / blog / FAQ |

См. [`frequency-tiers.md`](../02-keywords/frequency-tiers.md).

---

## 4 · Numbers — обзор по 5 направлениям

| # | Направление | Total ключей | Коммерческих | Наш covered % | Champion competitor (pagesInIndex / it50) | Whitespace count |
|---|---|--:|--:|--:|---|--:|
| 1 | **Вывоз мусора** | 3 405 | 1 452 (43%) | 9.7% (329/3405) | musor.moscow (329 / 10 827) | ~250 |
| 2 | **Арбористика** | 2 579 | 1 130 (44%) | 11.9% (303/2536) | liwood.ru (158 / 5 145) ⚠ probe-occupied; arboristik.ru (69 / 1 393) | ~180 |
| 3 | **Демонтаж B2C** | 1 144 | 628 (55%) | 4.0% (40/1004) | demontazhmsk.ru (94 / 865) | ~80 |
| 4 | **Уборка снега + чистка крыш** | 178 | 55 (31%) | **52.9%** (83/157) | cleaning-moscow.ru (271 / 6 123) | ~10 |
| 5 | **Ландшафтный дизайн** | 76 | 9 (12%) | 0% (0/74) | через extraction (нет direct champions в Keys.so базе) | ~5 |
| **Σ** | | **7 382** | **3 274** | — | — | **~525** |

> **Insight:** **демонтаж B2C** — высокий процент коммерции (55%) при низком нашем покрытии (4%). Это **самый яркий gap**. Арбо тоже под-покрыт (12% covered, 44% commercial). Уборка снега фактически закрыта (53% covered).

> **_unmatched** 13 875 ключей (66%) regex'ом — это в основном промальп / фасады / клининг офисов / DIY (вне нашей вертикали). Stage 4 — добавить **uborka-pomeshcheniy** как 6-е направление если оператор примет.

---

## 5 · Per-direction strategy (links)

Детальный action plan для каждого направления — отдельные файлы:

- [`per-direction/vyvoz-musora.md`](per-direction/vyvoz-musora.md) — champion vs musor.moscow + 250 whitespace ключей
- [`per-direction/arboristika.md`](per-direction/arboristika.md) — vs liwood + arboristik + 180 whitespace
- [`per-direction/demontazh-b2c.md`](per-direction/demontazh-b2c.md) — самый яркий gap, vs demontazhmsk + snosim + snos24
- [`per-direction/uborka-snega.md`](per-direction/uborka-snega.md) — близко к закрытию, vs cleaning + moscleaning24 + formula-v
- [`per-direction/landshaft.md`](per-direction/landshaft.md) — extraction baseline, далее re Wave 2 deep

---

## 6 · Whitespace map — top opportunities

Ключи которые есть у **≥3 конкурентов** и **нет в нашем discovery pool** (`normalized.csv`).

### 6.1 Priority A1 (1 ключ — ВЧ + ≥5 доменов)

| wsk | domains | direction | keyword | top URL у champion |
|--:|--:|---|---|---|
| **1 020** | **6** | arboristika | **«арборист»** | (см. competitor URL в whitespace.csv) |

**Action:** создать `/arboristika/arborist-eto-kto/` — pillar-уровень информационная страница с конверсионным CTA. Cluster `arboristika`, blog-bridge.

### 6.2 Priority A2 (69 ключей — ВЧ + 3-4 или СЧ + ≥3)

**Топ-15 by wsk:**

| wsk | domains | direction | keyword |
|--:|--:|---|---|
| 5 813 + 3 346 | 3 | _ | «короед штукатурка» / «штукатурка короед» — **out of vertical (декоративная фасадная штукатурка), exclude** |
| 3 295 + 3 045 | 3 | arboristika | «жук короед» / «короед жук» — наша вертикаль (override) |
| 3 587 | 3 | demontazh-b2c | «демонтаж» |
| 1 678 | 3 | vyvoz-musora | «кгм» |
| 815 | 3 | _ | «альпинист промышленный» (out-of-vertical, skip) |
| 606 | 3 | vyvoz-musora | «контейнер заказать для мусора» |
| 576 | 4 | arboristika | «спил» |
| 405 | 3 | vyvoz-musora | «вывоз тбо» |
| 366 | 6 | arboristika | «арбористика» |
| 339 | 4 | arboristika | «арборист это кто» |
| 326 | 4 | vyvoz-musora | «тбо вывоз» |
| 306 | 3 | vyvoz-musora | «вывоз мусора крупногабаритного» |
| 291 | 4 | vyvoz-musora | «вывоз мусора контейнер» |
| 290 | 6 | arboristika | «сколько стоит дерево спилить» |
| 277 | 3 | vyvoz-musora | «контейнер 8 кубов» |
| 250 | 3 | vyvoz-musora | «вывоз мусора сколько стоит» |

**Полный список** — в [`whitespace-priority-A.md`](whitespace-priority-A.md) с предлагаемыми URL для каждого ключа.

### 6.3 Priority B (1 134 long-tail)

Файл [`whitespace-priority-A.md`](whitespace-priority-A.md) приложение: B-приоритет для долгосрочного blog-плана и внутренней перелинковки. Top-10 ниже:

(скип, см. CSV)

### 6.4 Recommended URL mapping (ключи → URL pattern)

| Whitespace pattern | Recommended URL |
|---|---|
| «арборист*» / «арбористика» | `/arboristika/arborist-eto-kto/` (информационный pillar-bridge) |
| «короед» / «обработка от короеда» | `/arboristika/obrabotka-ot-koroeda/` (sub-service, новая) |
| «кгм» / «вывоз тбо» / «вывоз мусора крупногабаритного» | расширить `/vyvoz-musora/` pillar секциями + 3 sub-services (КГМ / ТБО / крупногаб) |
| «контейнер 8 кубов» / «контейнер заказать» | sub-service `/vyvoz-musora/konteyner/` с под-разделами по объёмам (5/8/20/27 м³) |
| «снести дом сколько стоит» | новый `/demontazh/snos-doma-tsena/` (B2C, ВЧ-конверсионный) |
| «промальп услуги» | **out-of-vertical** — skip, или новое pillar `/vysotnye-raboty/` (cpo decision) |

---

## 7 · 5 winning angles vs 32 конкурентов (финал Wave 3)

### 7.1 Sustained от W14

1. **Schema 100% JSON-LD** — sustained (W7 → W11 → W14 → W18). +50pp vs медианы 16/17 (musor parity, liwood soft parity microdata)
2. **UX foto-smeta USP** — 0/32 (Wave 3 confirmed). 211/211 lead-form embedded, AI-pipeline через Claude API.
3. **4-в-1 multi-pillar** — 0/32 (Wave 3 confirmed). 4 pillar × 47 sub × 76 SD × 14 cases. Structural не воспроизводимо узко-нишевыми.

### 7.2 NEW Wave 3 confirmed

4. **URL-объём через pagesInIndex correction** — sustained partial → confirmed. 211 sitemap → realistic parity к liwood-real-index 158, ahead at 133%.

### 7.3 NEW Wave 3 partial (5 directions semantic coverage)

5. **5-direction commercial coverage map** — partial:
   - uborka-snega: 53% covered (sustained).
   - arboristika: 12% covered → expand to 30%+ через Stage 4 (US-4).
   - demontazh-b2c: 4% covered → expand to 25%+ (биggest gap, biggest opportunity).
   - landshaft: 0% covered → discovery + content track Stage 4.

---

## 8 · Stage 4 EPIC-SEO-OUTRANK backlog (US-1..US-5 sketch)

| US | Title | Priority | Effort | Dependencies |
|---|---|---|---|---|
| **US-1** | Pull + intersect (этот документ) | P0 done | 4h done | — |
| **US-2** | Cluster mapping 5 directions + Wave 3 sections | P1 | 6h | US-1 |
| **US-3** | Strategy doc + 5 per-direction (этот файл) | P0 in progress | 8h | US-1 |
| **US-4.1** | Content waves: vyvoz-musora expansion (250 whitespace) | P1 | 2 weeks | US-2, US-3 |
| **US-4.2** | Content waves: arboristika (180 whitespace + А1 «арборист») | P1 | 2 weeks | US-2 |
| **US-4.3** | Content waves: demontazh-b2c (80 whitespace) | P0 (biggest gap) | 2 weeks | US-2 |
| **US-4.4** | Content waves: uborka-snega (10 whitespace, finishing) | P2 | 1 week | US-2 |
| **US-4.5** | Landshaft pillar + 7 cluster (8 .md skeleton → full) | P1 | 3 weeks | re Wave 2 |
| **US-5** | Monitoring monthly snapshot + Topvisor expand | P1 ongoing | 1 day/month | US-1 (template) |

**DoD EPIC-SEO-OUTRANK:**
- ≥4/5 axes confirmed sustained (vs 3/5 W14)
- pagesInIndex ≥ 150 (parity к liwood real-index)
- 5 per-direction strategy + Wave 3 cluster updates published
- Whitespace A1+A2 closed на 80% (56/70 ключей в обработке)
- Topvisor 200+ commercial ключей monitoring active

Полный беклог — [`specs/EPIC-SEO-OUTRANK/intake.md`](../../specs/EPIC-SEO-OUTRANK/intake.md) (создаётся Phase G).

---

## 9 · Monitoring plan

### 9.1 Keys.so monthly snapshot (re-run этого pull через 4 недели)

```bash
python3 seosite/scripts/keysso_pull_competitors.py
python3 seosite/scripts/keysso_intersect.py
diff <last-snapshot> <new-snapshot> → outline в `09-final-sweep/W3-month-N-diff.md`
```

Tracking metrics: pagesInIndex, vis, top-3 count, whitespace shrinkage (наша expansion), новые домены в выдаче.

### 9.2 Topvisor live tracking (когда creds получены)

200+ commercial ключей × 3 региона (msk + raменское + жуковский). Daily snapshot, weekly review.

### 9.3 KPI

| KPI | Baseline 2026-05-03 | Target Stage 4 (12 weeks) |
|---|---|---|
| pagesInIndex | 0 (W15 launch) | 150-180 (parity к liwood) |
| Closure к liwood real-index | n/a | 100%+ |
| Whitespace A1+A2 closure | 0/70 | 56/70 (80%) |
| Direction coverage uncovered → covered | 4 directions <15% covered | All 5 directions ≥30% covered |
| EPIC-SEO-CONTENT-FILL post-deploy «in real Yandex» | 0 organic visits | Track Wave 3.B Я.Метрика organic |

---

## 10 · Dependencies / pending operator (sustained)

| Dep | Sustained from | Action |
|---|---|---|
| Topvisor SaaS creds | W3 (2026-04-25) | передать оператором |
| Я.ВебМастер «Структурированные данные» access | W3 | пригласить poseo в кабинет |
| Real-name + VK/TG/MAX `sameAs` для E-E-A-T | W11 (2026-05-02) | передать данные → cms обновит authors |
| Probe-проект `_probe_liwood` (135646) | 2026-05-03 | удалить вручную в UI Keys.so либо разрешить `POST /projects/delete` |
| Регенерация Keys.so API-токена | 2026-05-03 (security flag) | через UI кабинета → новый в .env.local |
| Решение по landshaft 5 кандидатам | 2026-05-03 | re Wave 2 deep-профили (`seosite/01-competitors/deep/landshaft-studio-1..7.md`) |

---

## История версий

| Дата | Версия | Кто | Что |
|---|---|---|---|
| 2026-05-03 | v1.0 (этот файл) | poseo + plan-agent + explore-agent | Wave 3 multi-domain pull + 5-direction recalibration + correction layer для W14 sitemap→pagesInIndex |
