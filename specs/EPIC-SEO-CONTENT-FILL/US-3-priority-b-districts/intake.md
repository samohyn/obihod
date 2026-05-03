---
us: US-3
epic: EPIC-SEO-CONTENT-FILL
title: Stage 3 W12-W13 — 4 priority-B districts + ~60 SD batch + Blog M3 + 6 cases + Wave 0 mini-fix
team: seo
po: poseo
type: content
phase: spec
role: poseo
status: open
priority: P0
moscow: Must
segment: services
created: 2026-05-02
updated: 2026-05-02
target_finish_w13: 2026-07-17
blocks: [US-4-eeat-monitoring]
blocked_by: [US-2-sub-and-programmatic]
related: [US-6-competitor-benchmark]
skills_activated: [seo, blueprint, product-capability, project-flow-ops]
---

# US-3 · Stage 3 W12-W13 — Priority-B districts + Wave 0 mini-fix + Blog M3 + 6 cases

> **Master-документ Stage 3 первой половины** эпика `EPIC-SEO-CONTENT-FILL`.
> После Stage 2 W11 (DoD PASS: 119 URL / 125k слов / 3 confirmed winning angles)
> Stage 3 разбит на две US: **US-3 (W12-W13) production-фронт priority-B
> districts + remaining backlog mini-fix** и **US-4 (W14) E-E-A-T + monitoring +
> final sweep + W14 operator gate**. Без US-3 невозможна US-4: priority-B
> districts формируют финальный URL-объём (~280 URL), на котором W14 benchmark
> измеряется.

---

## 1 · Цель US-3

Произвести **третий production-конвейер** — расширить валидированный шаблон
ещё на **4 priority-B districts** (Khimki / Pushkino / Istra / Zhukovskij) + ~60
programmatic SD + Blog M3 + 6 cases, и **разблокировать 84 sub-level SD**
оставшихся с Stage 2 (Wave 0 mini-fix sprint первой неделей W12). К концу W13
суммарный URL-объём сайта должен подойти к **~280 URL** = closure ≥75% к
liwood медиане (247 URL → opex), что даёт прочную базу для W14 final benchmark
по ≥3 из 5 осей.

## 2 · Бизнес-цель

Operator mandate (sustained 2026-05-02): **«сайт который конверит, приносит
лиды и обгоняет конкурентов»**. Stage 3 переводит «опережение» из режима
«3 confirmed winning angles» (W11) в режим **«4-5 confirmed winning angles»**
(W14): добавляет priority-B coverage (URL-объём ось до closure ≥75%), формирует
content-depth до confirmed (+20% vs liwood), готовит E-E-A-T axis к W14 lift.

| Требование | Почему | Где проверяется |
|---|---|---|
| 4 priority-B districts получают полный pillar coverage (4 pillar × 4 = 16 SD pillar-level + ~60 SD sub-level) | Закрывает URL-gap до ≥75% closure от liwood медианы | AC-1.x priority-B coverage |
| 84 sub-level SD из Stage 2 backlog получают рабочий route (`/[service]/[sub]/[district]/`) | Блокер W11: 84/100 SD в sitemap, но 404 на dispatch | AC-Wave0.x route fix |
| 3 missing routes (`/sro-licenzii/`, `/komanda/`, `/park-tehniki/`) — fixtures Stage 1 готовы, нужны только страницы | Stage 1 backlog hangover | AC-Wave0.4-6 |
| Blog M3 (10 статей #22-#31) — info-cluster наполнение | Закрывает content-depth ось до confirmed +20% | AC-2.x blog M3 |
| 6 cases additional (priority-B districts + сложные кейсы) | E-E-A-T binding для priority-B SD (publish-gate strict mode) | AC-3.x cases |
| Programmatic SD проходит publish-gate (50/50 + mini-case + ≥2 localFaq + sustainable spec) | Anti Scaled Content Abuse demote | AC-4.x publish-gate |
| Design-system §1-14 + §33 site-chrome compliance | Iron rule sustained | AC-5.x design-system |
| TOV-checker exit 0 на 100% pillar/B2B/cases + 20% sampling SD/sub | Iron rule sustained | AC-5.1 |

## 3 · Scope (~76 текстов + ~76 SD pages = ~152 страниц / ~50 000 слов)

### 3.0 · Wave 0 mini-fix sprint (W12 первая неделя — критический blocker)

| Объект | Owner | Описание | AC |
|---|---|---|---|
| **84 sub-level SD route** | be-panel (cross-team) + fe-site через podev | Реализация dynamic route `/[service]/[sub]/[district]/page.tsx` + Payload coverage SD по `(service, sub, district)` | AC-Wave0.1 / AC-Wave0.2 |
| **3 missing routes** | fe-site через podev | `/sro-licenzii/`, `/komanda/`, `/park-tehniki/` — fixtures Stage 1 готовы, нужны страницы + Storybook + JSON-LD | AC-Wave0.3 |
| **HomeAndConstructionBusiness url warns (31)** | seo-tech | Quick fix `lib/seo/jsonld.ts` — добавить `url` field в LocalBusiness emitter | AC-Wave0.4 |
| **vyvoz-musora-kontejner-krasnogorsk metaDescription Unicode slice issue** | seo-tech | Bug fix slice() с Unicode codepoints | AC-Wave0.5 |
| **DrizzleQueryError в service-districts.afterChange** | be-panel + dba | Audit follow-up Stage 2 — fix Payload hook в коллекции ServiceDistricts | AC-Wave0.6 |

**Wave 0 DoD:** 84 sub-level SD ответ HTTP 200 + lint:schema 0 warns + 3 missing
routes в sitemap.xml + Playwright smoke 5 representative URL.

### 3.1 · 4 priority-B districts — основные данные

| District | Население | Приоритет ключи | Pillar coverage |
|---|--:|---|---|
| **Химки** (Khimki) | 257k | вывоз мусора (12k/мес) + спил деревьев (4k/мес) + чистка крыш (2k/мес) + демонтаж (1.5k/мес) | 4 pillar × 4 SD pillar + ~15 sub priority |
| **Пушкино** (Pushkino) | 105k | вывоз (5k/мес) + спил (2.5k/мес) + чистка (1k/мес) + демонтаж (700/мес) | 4 pillar × 4 SD pillar + ~15 sub priority |
| **Истра** (Istra) | 35k + дачи 200k+ | спил (3.5k/мес) + вывоз (4k/мес — большие дачные участки) + чистка (1.2k/мес) + демонтаж (500/мес) | 4 pillar × 4 SD pillar + ~15 sub priority |
| **Жуковский** (Zhukovskij) | 105k | вывоз (5k/мес) + чистка крыш ВПП (4k/мес — спец) + спил (2k/мес) + демонтаж (700/мес) | 4 pillar × 4 SD pillar + ~15 sub priority |

**Финальные ключи priority-B** — sa-seo собирает на W12 первой неделе через
Wordstat XML (skill-set sustained от Stage 1+2: Keys.so + Key Collector +
Just-Magic + Wordstat XML, без Ahrefs/SEMrush per memory `project_seo_stack`).

### 3.2 · Programmatic SD batch ~60 (W13 production)

- 4 priority-B districts × ~15 priority sub (по итогу keyword research W12) = **~60 SD**
- Через `scripts/generate-sd-batch.ts` (sustained pattern Stage 2: 50/50
  shared/specific, anti-Scaled Content Abuse compliant)
- Каждый SD: hero photo (fal.ai flux/schnell unified, art self-review style
  guide sustained от Stage 2) + mini-case ref (Cases pack Stage 1+2+3) + ≥2
  localFaq + Lead-form embed
- Cross-pillar referencing: priority-B SD ссылается на priority-A SD (4-в-1
  multi-pillar winning angle sustained)

### 3.3 · Blog M3 (10 статей #22-#31, темник `seosite/05-content-plan/blog-topics.md`)

- 10 info-кластерных статей (sustained pattern Stage 2 M2 — 10 статей #12-#21
  done): `vyvoz-musora` info / `arboristika` сезонность / `chistka-krysh`
  технологии / `demontazh` юр-аспект / cross-pillar связки
- Каждая статья: 1500-2200 слов / 1 hero (fal.ai) / Author = company-page
  «Бригада вывоза Обихода» / Article+Person→Organization JSON-LD
- TOV-checker pre-filter exit 0 + cw 100% review

### 3.4 · 6 cases additional

- 6 кейсов с фокусом на priority-B districts (1 на district + 2 cross-pillar
  сложных multi-pillar)
- Перед / после fal.ai (16 images = 6 cases × 2 + 4 reroll buffer)
- Cases binding в priority-B SD pages (publish-gate strict mode)
- Author = company-page «Бригада вывоза Обихода»

## 4 · Out-of-scope (US-3)

- ~~E-E-A-T артефакты `seosite/06-eeat/`, `07-neuro-seo/`, `08-monitoring/`~~
  — US-4 W14 scope
- ~~Topvisor / GSC / Я.ВебМастер мониторинг setup~~ — US-4 W14
- ~~W14 Competitor Benchmark Final~~ — US-6 sustained scope, US-4 финализация
- ~~Operator real-name + VK/TG sameAs~~ — pending operator action, US-4
- ~~SEO-tech sweep финальный (sitemap zero warns)~~ — US-4 финализация
- ~~staging.obikhod.ru deploy~~ — pending operator DNS A-record + GHA secrets

## 5 · Cross-team зависимости

| Команда / агент | Что нужно | Когда |
|---|---|---|
| **be-panel** + **dba** | dynamic route `/[service]/[sub]/[district]/page.tsx` + Payload SD coverage by `(service, sub, district)` | Wave 0 W12 day 1-3 |
| **fe-site** (через podev) | 84 sub-level SD page generation + 3 missing routes (`/sro-licenzii/`, `/komanda/`, `/park-tehniki/`) | Wave 0 W12 day 1-5 |
| **art** | Style guide sustainability check для priority-B district hero (4 districts × 4 pillar = 16 hero + 6 cases × 2 = 28 fal.ai prompts) | W13 day 1-2 |
| **fe-site** | BlockRenderer ext для 6 cases binding на priority-B SD pages | W13 day 3-4 |
| **qa-site** | Playwright smoke + axe на ~80 representative priority-B URL | W13 day 5 |
| **cr-site** | Code review Wave 0 route fix PR + content PR | W12-W13 на каждом merge |

## 6 · DoD US-3

| AC | Описание | Hard / Soft |
|---|---|---|
| AC-Wave0 | 84 sub-level SD HTTP 200 + 3 missing routes в sitemap + lint:schema 0 warns | **Hard** |
| AC-1 | 16 priority-B SD pillar-level published + 100% schema (Service / FAQPage / BreadcrumbList / LocalBusiness) | **Hard** |
| AC-2 | ~60 priority-B SD sub-level published, publish-gate PASS (mini-case ref + ≥2 localFaq + 50/50 spec) | **Hard** |
| AC-3 | 10 Blog M3 published, Article+Person→Organization JSON-LD audit PASS | Hard |
| AC-4 | 6 Cases published with hero+after fal.ai images, binding на priority-B SD | Hard |
| AC-5 | TOV-checker exit 0 + 20% sampling SD/sub | Hard |
| AC-6 | URL closure ≥75% к liwood медиане (~280 URL vs liwood 247) | Hard |
| AC-7 | Content-depth +20% vs liwood (sustained от W11 partial) | Soft (US-4 финализирует) |
| AC-8 | Stage 3 W13 mid-check report `screen/stage3-W13/` (60 PNG + 30 axe.json) | Hard |
| AC-9 | Hand-off log в US-3 + EPIC intake актуален | Hard |

**Hard gate W13:** AC-Wave0 / AC-1 / AC-2 / AC-3 / AC-4 / AC-5 / AC-6 / AC-8 /
AC-9 PASS — autonomous (operator W14 review только финальный gate).

## 7 · Risk register

| Риск | Митигация |
|---|---|
| Wave 0 84 sub-level route fix занимает > 5 days (be-panel/fe-site coordination) | Sequential: route fix W12 day 1-3 → SD batch testing W12 day 4-5 → keyword research priority-B parallel |
| Programmatic SD batch ~60 ловит Scaled Content Abuse demote | Sustained pattern Stage 2 (50/50 + mini-case + localFaq) уже валидирован W11 — низкий риск |
| fal.ai style drift на priority-B districts (28 images) | art self-review style guide sustained от Stage 2 (re-roll loop) |
| Topvisor creds pending → нет real benchmark на W14 | Fallback methodology (Я.ВебМастер + Just-Magic + Wordstat XML) sustained от Stage 2 |
| operator real-name + VK/TG sameAs pending → E-E-A-T axis 6 не выйдет в опережение | US-4 deferred AC + operator gate W14 explicit follow-up |

## 8 · Hand-off log

- **`2026-05-02 · poseo`**: создан intake US-3 на основе approved EPIC
  intake.md + Stage 2 W11 closure + memory `project_seo_stage2`. Передаю
  `sa-seo` на написание `sa-seo.md` для US-3 (включая Wave 0 mini-fix sprint
  AC + ~60 SD batch + Blog M3 + 6 cases + cross-team coordination be-panel/
  fe-site/art).
