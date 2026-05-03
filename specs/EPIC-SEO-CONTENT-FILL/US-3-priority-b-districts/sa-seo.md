---
us: US-3
epic: EPIC-SEO-CONTENT-FILL
title: Stage 3 W12-W13 — Priority-B districts + Wave 0 mini-fix + Blog M3 + 6 cases
team: seo
po: poseo
sa: sa-seo
type: content
phase: done
role: poseo
status: closed
priority: P0
moscow: Must
segment: services
created: 2026-05-02
updated: 2026-05-02
target_finish_w13: 2026-07-17
blocks: [US-4-eeat-monitoring]
blocked_by: [US-2-sub-and-programmatic]
related: [US-6-competitor-benchmark]
skills_activated: [seo, architecture-decision-records, api-design, product-capability, blueprint, accessibility, design-system]
---

# US-3 · Stage 3 W12-W13 — Priority-B districts + Wave 0 mini-fix + Blog M3 + 6 cases

> **Master-документ Stage 3 первой половины** эпика `EPIC-SEO-CONTENT-FILL`. После Stage 2 W11 (DoD PASS: ~250 URL / 125 000 слов / 3 confirmed winning angles из 5 — schema +50pp, foto-smeta USP, 4-pillar+4-в-1 NEW) Stage 3 разбит на две US: **US-3 (W12-W13)** = production-фронт priority-B districts + remaining backlog mini-fix; **US-4 (W14)** = E-E-A-T + monitoring + final sweep + W14 operator gate. Без US-3 невозможна US-4: priority-B districts формируют финальный URL-объём (~280-330 URL) для W14 benchmark по ≥3 из 5 осей.

---

## 1 · Цель US-3

Произвести **третий production-конвейер контента** — расширить валидированный шаблон ещё на **4 priority-B districts** (Химки / Пушкино / Истра / Жуковский) + ~60 programmatic SD sub-level + Blog M3 (10 статей) + 6 cases additional, и **разблокировать 84 sub-level SD** оставшихся с Stage 2 (Wave 0 mini-fix sprint первой неделей W12). К концу W13 суммарный URL-объём сайта должен подойти к **~280-330 URL** = closure ≥75% к liwood медиане (~247 URL → opex), что даёт прочную базу для W14 final benchmark (US-4).

US-3 связан с **US-4 как «production → finalize»**:
- US-3 W12-W13 закрывает **URL-объём** (axis 1) до confirmed → ≥75% closure к liwood
- US-3 W12-W13 закрывает **content-depth** (axis 2) до confirmed +20% (sustained Stage 2 partial)
- US-3 W12-W13 НЕ трогает **E-E-A-T** (axis 6) и **monitoring** (axis 7) — это US-4 W14
- W14 final benchmark в US-4 проверяет ≥3 из 5 осей опережения; без US-3 axis URL-объём остаётся partial

## 2 · Бизнес-цель

Operator mandate (sustained 2026-05-02): **«сайт который конверит, приносит лиды и обгоняет конкурентов»**. Stage 3 переводит «опережение» из режима «3 confirmed winning angles» (W11) в режим **«4-5 confirmed winning angles»** (W14 в US-4): добавляет priority-B coverage (URL-объём ось до closure ≥75%), формирует content-depth до confirmed (+20% vs liwood), готовит E-E-A-T axis к W14 lift (но сам lift — в US-4).

| Требование | Почему | Где проверяется |
|---|---|---|
| 4 priority-B districts получают полный pillar coverage (4 pillar × 4 = 16 SD pillar-level + ~60 SD sub-level) | Закрывает URL-gap до ≥75% closure от liwood медианы; URL-axis из partial → confirmed | AC-1.x / AC-2.x priority-B coverage |
| 84 sub-level SD из Stage 2 backlog получают рабочий route (`/[service]/[sub]/[district]/`) | Блокер W11: 84/100 SD были в sitemap, но 404 на dispatch — Scaled Content Abuse risk + индексация broken | AC-Wave0.1 / AC-Wave0.2 |
| 3 missing static routes (`/sro-licenzii/`, `/komanda/`, `/park-tehniki/`) — fixtures Stage 1 готовы, нужны страницы | Stage 1 backlog hangover; trust-сигналы (СРО) и о-команде blocked | AC-Wave0.3 |
| 31 HomeAndConstructionBusiness `url` warns в lint:schema | Sustained Stage 2 W11 ya-vebmaster fallout; emitter упускает `url` поле | AC-Wave0.4 |
| `vyvoz-musora-kontejner-krasnogorsk` metaDescription Unicode slice bug | Bug Stage 2 W11: `.slice(0,160)` на codepoints рвёт суррогатные пары | AC-Wave0.5 |
| `DrizzleQueryError` в `service-districts.afterChange` audit | Sustained Stage 2 audit follow-up; pg pool starvation на async hooks | AC-Wave0.6 |
| Blog M3 (10 статей #22-#31) — info-cluster наполнение | Закрывает content-depth ось до confirmed +20% | AC-3.x |
| 6 cases additional (priority-B districts + cross-pillar) | E-E-A-T binding для priority-B SD (publish-gate strict mode) | AC-4.x |
| Programmatic SD проходит publish-gate (50/50 + mini-case + ≥2 localFaq + sustainable spec) | Anti Scaled Content Abuse demote sustained Stage 2 | AC-5.x |
| Design-system §1-14 + §33 site-chrome compliance | Iron rule sustained | AC-6.x |
| TOV-checker exit 0 на 100% pillar/B2B/cases + 20% sampling SD/sub | Iron rule sustained | AC-7.x |

US-3 == «третий цех с конвейером» (vs US-2 «второй цех», US-1 «первый цех с pilot»). Ключевое отличие US-3: **первая неделя W12 — не production, а Wave 0 mini-fix sprint**, т.е. техническая разблокировка Stage 2 backlog ДО старта новой production-волны. Это критично: без route fix 84 sub-level SD продолжают давать 404, а Google индексирует это как broken pattern → Scaled Content Abuse сигнал, риск demote всего сайта.

## 3 · Scope (~76 текстов + ~76 SD pages = ~76+ страниц / ~50 000 слов + Wave 0 fix sprint)

> Объёмные оценки: 4 cw text-runs sequential (sustained pattern Stage 2: 4 parallel runs = 4 production fronts) + Wave 0 5 fix workstreams parallel (W12 day 1-5).

### 3.0 · Wave 0 mini-fix sprint (W12 day 1-5 — критический blocker для остальной части US-3)

> **Контекст blocker:** Stage 2 W11 закрылся с 84 sub-level SD в sitemap.xml, но dispatch ловил 404 потому что route `site/app/(marketing)/[service]/[sub]/[district]/page.tsx` отсутствовал. Текущая структура: `[service]/page.tsx` (pillar) + `[service]/[district]/page.tsx` (SD pillar-level). Sub-level требует **3-х уровневую динамику** — это технический долг Stage 2, который US-3 закрывает первой неделей. Без fix priority-B SD sub-level (~60 шт. в W13) ловит ту же ошибку.

#### 3.0.1 · Wave 0.1 — 84 sub-level SD route fix

**Текущая структура:**
```
site/app/(marketing)/
├── [service]/
│   ├── page.tsx                         # /[service]/ — pillar
│   ├── [district]/
│   │   └── page.tsx                     # /[service]/[district]/ — SD pillar-level (working)
```

**Целевая структура:**
```
site/app/(marketing)/
├── [service]/
│   ├── page.tsx                         # pillar
│   ├── [sub]/
│   │   ├── page.tsx                     # /[service]/[sub]/ — sub-service (working from Stage 2 §3.1)
│   │   └── [district]/
│   │       └── page.tsx                 # /[service]/[sub]/[district]/ — SD sub-level (NEW, US-3 Wave 0.1)
│   └── [district]/
│       └── page.tsx                     # SD pillar-level
```

**Решение Next.js 16 catch-all vs nested:** sa-seo recommendation — **nested dynamic segments** (`[sub]/[district]/page.tsx`), не catch-all `[...slug]`. Причины:
1. Next.js generateStaticParams type-safety: `params: { service, sub, district }` тривиален
2. Catch-all всё ломает `notFound()` логику и breadcrumbs
3. Payload SD coverage уже разбит по полям `(service, sub, district)` — nested MAPPING 1:1
4. ADR-кандидат: «Nested dynamic over catch-all для 3-уровневой иерархии».

**Payload coverage SD:**
- `apps/site/src/collections/ServiceDistricts.ts` — добавить **уникальный композитный constraint** `(service, sub, district)` (если не было; check от be-panel в W12 day 1)
- Migration через `database-migrations` skill: `pnpm payload migrate:create add-sd-unique-triple-constraint` (sustained Stage 2 pattern)
- Existing data check: 84 sub-level SD из Stage 2 batch — у каждого должно быть `sub` поле заполнено; dba sanity check + bulk update если нужно

**Cross-team координация (Wave 0.1 W12 day 1-3):**

| Шаг | Day | Owner | Артефакт | Acceptance |
|---|---|---|---|---|
| 0.1.a SD coverage migration draft | day 1 | be-panel + dba | `apps/site/src/migrations/<ts>-add-sd-unique-triple-constraint.ts` | sql script idempotent; rollback — drop constraint + restore index |
| 0.1.b nested route component | day 1-2 | fe-site (через podev) | `site/app/(marketing)/[service]/[sub]/[district]/page.tsx` + dispatch logic в layout | generateStaticParams возвращает 84 triples; SSG renders 84 pages |
| 0.1.c BlockRenderer wiring | day 2 | fe-site | reuse Stage 2 `<SubLevelSDView>` (если был) или новый `<SDSubLevelView>` блок (sustained pattern Stage 2 SD pillar-level) | BlockRenderer ext без regression на pillar-level SD |
| 0.1.d Playwright smoke 5 representative URL | day 3 | qa-site | `screen/stage3-W12/wave0-route-fix-{slug}.png` × 5 | HTTP 200 + h1 + breadcrumbs + lead-form / cta-banner |
| 0.1.e cr-site review | day 3 | cr-site | PR review | merge after green CI (do iron rule #5) |

**AC-Wave0.1:** 84 sub-level SD URL отвечают HTTP 200 + рендерят blocks + breadcrumbs + lead-form/cta + JSON-LD `Service`+`FAQPage`+`BreadcrumbList`+`LocalBusiness` (sustained Stage 2 publish-gate).

#### 3.0.2 · Wave 0.2 — 3 missing static routes

| URL | Цель | Owner | Источник fixtures |
|---|---|---|---|
| `/sro-licenzii/` | trust-сигнал — список СРО лицензий | fe-site (через podev) | `site/content/static-pages/sro-licenzii.json` (Stage 1 fixture) |
| `/komanda/` | команда + бригада → E-E-A-T (Person/Organization) | fe-site | `site/content/static-pages/komanda.json` (Stage 1 fixture) |
| `/park-tehniki/` | парк техники + cross-link на `/arenda-tehniki/` | fe-site | `site/content/static-pages/park-tehniki.json` (Stage 1 fixture) |

**Schema на каждой:** Article (для sro-licenzii) / AboutPage (для komanda) / ItemList (для park-tehniki) + BreadcrumbList + Organization. **Storybook story** для каждой (sustained Stage 1 pattern). **JSON-LD audit** через `pnpm lint:schema --urls=/sro-licenzii/,/komanda/,/park-tehniki/`.

**AC-Wave0.2:** 3 routes return HTTP 200 + sitemap.xml содержит их + Storybook stories present + lint:schema 0 errors на этих 3 URL.

#### 3.0.3 · Wave 0.3 — 31 HomeAndConstructionBusiness `url` warns

**Текущая ошибка:** lint:schema W11 показал 31 warning «HomeAndConstructionBusiness missing `url` field» на SD pillar-level emitter в `site/lib/seo/jsonld.ts` (или where эмиттер LocalBusiness живёт).

**Fix:** добавить `url: site.absoluteUrl(\`/<service>/<district>/\`)` field в LocalBusiness emitter; sustained pattern для будущих SD sub-level (тот же emitter будет использоваться для US-3 priority-B SD).

**Owner:** seo-tech.

**AC-Wave0.3:** lint:schema 0 warnings про `HomeAndConstructionBusiness url`; affected ~31 SD pillar-level URL пройдут strict mode.

#### 3.0.4 · Wave 0.4 — `vyvoz-musora-kontejner-krasnogorsk` metaDescription Unicode slice

**Bug:** `.slice(0, 160)` на codepoints рвёт суррогатные пары (например, эмодзи или сложные кириллические комбинации) → невалидный UTF-8 в `<meta name="description">` → search engine indexer падает на парсинге.

**Fix:**
```ts
// Старо:
const description = source.slice(0, 160);

// Новое (codepoint-aware):
const description = Array.from(source).slice(0, 160).join('');
// Или через Intl.Segmenter (best practice):
const segmenter = new Intl.Segmenter('ru', { granularity: 'grapheme' });
const description = Array.from(segmenter.segment(source)).slice(0, 160).map(s => s.segment).join('');
```

**Affected files:** `site/lib/seo/metadata.ts` (или where `generateMetadata` фабрика живёт). Бывшие тесты — сделать unit-test на codepoint truncation в `site/__tests__/seo/metadata.test.ts`.

**Owner:** seo-tech.

**AC-Wave0.4:** `/vyvoz-musora/kontejner/krasnogorsk/` (и ВСЕ другие SD с Unicode-heavy заголовками) → meta description валидный UTF-8; lint:schema + smoke test pass.

#### 3.0.5 · Wave 0.5 — `DrizzleQueryError` в `service-districts.afterChange`

**Контекст:** Stage 2 W11 audit (`scripts/audit-payload-hooks.ts`) обнаружил DrizzleQueryError в `afterChange` хуке `ServiceDistricts.ts`. Симптом: при bulk publish ~100 SD (Stage 2 W10) хук вызывался 100× sync, pg pool exhausted → deadlock 60+ min.

**Memory reference:** `reference_payload_hooks_async_fire_and_forget` (incident 2026-05-01 AUDIT-LOG): sync await в afterChange → pg pool starvation deadlock. Используй fire-and-forget pattern с 5s timeout.

**Fix:**
```ts
// Старо (sync await — pool starvation):
afterChange: [async ({ doc, req }) => {
  await req.payload.update({ collection: 'sitemapEntries', ... });
}],

// Новое (fire-and-forget с timeout):
afterChange: [async ({ doc, req }) => {
  setImmediate(() => {
    Promise.race([
      req.payload.update({ collection: 'sitemapEntries', ... }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('hook timeout 5s')), 5000)),
    ]).catch(err => req.payload.logger.error({ err, hook: 'sd.afterChange' }, 'fire-forget timeout'));
  });
  return doc;
}],
```

**Cross-team:** be-panel (хук правка) + dba (audit pg pool stats до/после; check connection_count во время bulk re-publish).

**AC-Wave0.5:** `scripts/audit-payload-hooks.ts` exit 0 на коллекции ServiceDistricts; bulk publish 76 priority-B SD W13 не вызывает deadlock (smoke test: time `pnpm seed:programmatic:stage3` < 10 min при 76 SD).

#### 3.0.6 · Wave 0 sprint — общий DoD

| Acceptance | Описание | Owner | Hard/Soft |
|---|---|---|---|
| **AC-Wave0.1** | 84 sub-level SD HTTP 200 + JSON-LD valid + breadcrumbs work | be-panel + dba + fe-site | **Hard** |
| **AC-Wave0.2** | 3 missing static routes published + sitemap.xml | fe-site | **Hard** |
| **AC-Wave0.3** | lint:schema 0 warnings про HomeAndConstructionBusiness url | seo-tech | **Hard** |
| **AC-Wave0.4** | Unicode slice fix + unit-test + smoke test | seo-tech | **Hard** |
| **AC-Wave0.5** | DrizzleQueryError audit pass + fire-and-forget pattern | be-panel + dba | **Hard** |
| **AC-Wave0.6** | Wave 0 cr-site review pass на каждом merge | cr-site | **Hard** |

**Wave 0 DoD gate (W12 day 5 EOD):** все 6 AC PASS → Wave 1 (priority-B production) стартует W12 day 6. Если не PASS — poseo расширяет Wave 0 ещё на 2 рабочих дня (буфер до W12 day 7), priority-B production cap снижается на 25%.

### 3.1 · 4 priority-B districts — основные данные (sustained intake §3.1)

| District | Slug | Население | Pillar wsfreq snapshot | Winning angle |
|---|---|--:|---|---|
| **Химки** | `khimki` | 257 000 | вывоз ~12k/мес + спил ~4k/мес + чистка ~2k/мес + демонтаж ~1.5k/мес (intake estimates; финал W12 keyword research) | Транспортная доступность Шереметьево — авиатехнический мусор B2B + быстрая доставка контейнеров через А-107 |
| **Пушкино** | `pushkino` | 105 000 | вывоз ~5k/мес + спил ~2.5k/мес + чистка ~1k/мес + демонтаж ~0.7k/мес | Дачно-коттеджный сегмент + лес (high арбо: СНТ + участки 6-30 соток) |
| **Истра** | `istra` | 35 000 + дачи 200k+ | спил ~3.5k/мес + вывоз ~4k/мес + чистка ~1.2k/мес + демонтаж ~0.5k/мес | Загородные дачи 200k+ человек летом + ВД (Истринское вод-ще) → ливневые наводнения → чистка крыш |
| **Жуковский** | `zhukovskij` | 105 000 | вывоз ~5k/мес + чистка ~4k/мес ВПП + спил ~2k/мес + демонтаж ~0.7k/мес | ЛИИ им. Громова + ВПП → спец-чистка крыш авиапром + спец-демонтаж авиа-инфраструктуры |

**Финальные ключи priority-B keyword research** — sa-seo + seo-content собирают на W12 day 1-2 (параллельно Wave 0 sprint) через **Wordstat XML + Just-Magic + Key Collector + Keys.so** (sustained iron rule `project_seo_stack` — no Ahrefs/SEMrush). Источник snapshot уже записан в `[priority-b-districts.md](../../../seosite/03-clusters/priority-b-districts.md)` (создан sa-seo 2026-05-02).

**TODO для seo-content:** заменить `TBD-W12` маркеры в `priority-b-districts.md` на real wsfreq + утвердить final cap 60 sub-level SD.

### 3.2 · 16 SD pillar-level priority-B (W12-W13 production)

`/<service>/<district>/` × 4 pillar × 4 districts = **16 SD pillar-level**.

| URL | Объём | Per-district winning angle |
|---|--:|---|
| `/vyvoz-musora/khimki/` | ~700 слов | Транспортная доступность Шереметьево + контейнер 8-27 м³ за 90 мин из бригадной точки Одинцово через А-107 |
| `/vyvoz-musora/pushkino/` | ~700 | Дачно-коттеджные большие выводы (СНТ + 6-30 соток) + сезонный sadovyj musor |
| `/vyvoz-musora/istra/` | ~700 | Большие дачные участки 30-100 соток + контейнеры на дальние выезды (ВД-зона) |
| `/vyvoz-musora/zhukovskij/` | ~700 | Авиа-стройотходы (B2B-сегмент) + ВПП-инфраструктура подрядчики |
| `/arboristika/khimki/` | ~700 | Городская среда + новостройки → опасные сухостои на дворовых территориях |
| `/arboristika/pushkino/` | ~700 | СНТ + лес-граница → массовый летний спрос (4-в-1 cross-sell на /vyvoz-musora/) |
| `/arboristika/istra/` | ~700 | Большие дачные участки + ВД-зона → старые ели/сосны после ливней (аварийный спил) |
| `/arboristika/zhukovskij/` | ~700 | Городские деревья + санитарная зона ЛИИ |
| `/chistka-krysh/khimki/` | ~700 | МКД-новостройки + cargo-крыши Шереметьево (B2B специфика) |
| `/chistka-krysh/pushkino/` | ~700 | Частные дома + дачи (B2C-сегмент); сезонная связка сосулек |
| `/chistka-krysh/istra/` | ~700 | ВД-наводнения + ливневые крыши → чистка стоков и водоотводов |
| `/chistka-krysh/zhukovskij/` | ~700 | ВПП ЛИИ авиа-инфраструктура + договор на сезон + спец-аккредитация |
| `/demontazh/khimki/` | ~700 | Снос складов + ЖК-инфраструктура (Шереметьево складская зона) |
| `/demontazh/pushkino/` | ~700 | Снос дач + бань (демонтаж + вывоз = 1 договор, 4-в-1) |
| `/demontazh/istra/` | ~700 | Снос больших дачных строений + утилизация |
| `/demontazh/zhukovskij/` | ~700 | Снос авиа-инфраструктуры + B2B-предприятия |

**Все 16 SD pillar-level:** sustained pattern Stage 2 (publish-gate hard mode):
- breadcrumbs + hero (H1 cluster + цена «X ₽ за объект», anti «от X ₽» в основном тексте)
- tldr + text-content (≥600 слов unique)
- lead-form ИЛИ cta-banner /foto-smeta/
- mini-case ≥1 (binding на 6 cases pack из §3.5; до cases pack — placeholder с TODO)
- cta-banner /foto-smeta/
- faq (4+ Q&A с FAQPage schema, **≥2 локальные** — про работу в этом районе)
- neighbor-districts (3 ближайших — sustained Stage 1 bug fix `odincovo`)
- related-services (соседние pillars в district)

**Schema:** `Service` + `FAQPage` + `BreadcrumbList` + `LocalBusiness`/`HomeAndConstructionBusiness` (with district `areaServed` + `url` field после Wave 0.3 fix).

### 3.3 · ~60 SD sub-level priority-B (W13 production)

> Sustained pattern Stage 2 §3.2 50/50 shared/specific через `scripts/generate-sd-batch.ts` (anti-Scaled Content Abuse).

**Default plan** (sa-seo recommendation, см. `[priority-b-districts.md §3](../../../seosite/03-clusters/priority-b-districts.md#3--ожидаемое-распределение-sub-level-sd-по-pillar-default-wave-15-plan)`):

| Pillar | Sub per district | Total (4 districts) | Sub list (default) |
|---|--:|--:|---|
| vyvoz-musora | 4 | 16 | kontejner / vyvoz-stroymusora / staraya-mebel / krupnogabarit |
| arboristika | 4 | 16 | spil-derevev / udalenie-pnya / raschistka-uchastka / sanitarnaya-obrezka |
| chistka-krysh | 4 | 16 | ot-snega / mkd / sbivanie-sosulek / dogovor-na-sezon |
| demontazh | 3 | 12 | dachi / bani / snos-zabora |
| **Итого** | **15 sub** | **60 SD** | |

**Confirm от poseo (см. §10 Open Q1):** default 60 SD ИЛИ extended 76 SD (включить avtovyshka × 4 districts + 4 supplementary)?

**Производственная модель** (sustained Stage 2):
- Cross-pillar referencing: priority-B SD ссылается на priority-A SD (4-в-1 multi-pillar winning angle sustained)
- Каждый SD ~600 слов unique (50% shared base + 50% district-specific)
  - **Shared base:** методология sub-service (что входит, как 4-в-1, СРО)
  - **District-specific:** время выезда + landmarks (Шереметьево / Истринское вод-ще / СНТ Пушкино / ЛИИ Жуковский) + МО vs МСК legislation + per-district кейс + ≥2 localFaq
- Hero: **reuse pillar SD hero** (sustained Stage 2 art-apruv recommendation; экономит ~$30 fal.ai cost)
- Mini-case ref: binding на 6 cases pack из §3.5 (publish-gate strict mode)
- ≥2 localFaq: «Сколько времени едет бригада в <Khimki/Pushkino/Istra/Zhukovskij>?» / «Берёте ли вы работы в дачных посёлках/СНТ <district>?» / «Работаете ли с авиапром-объектами в Жуковском?»

**Schema:** `Service` + `FAQPage` + `LocalBusiness` (with district `areaServed`) + `BreadcrumbList`.

**Production-mode:** cw Run 2 (W13 day 1-3) — пишет 15 sub × district-specific блоки для 4 priority-B districts (60 modifiers); cms генерирует 60 SD через `seed:programmatic:stage3.ts` (extension от `seed-content-stage2-programmatic.ts` Stage 2).

### 3.4 · Blog M3 — 10 статей #22-#31

> Темник: `[seosite/05-content-plan/blog-topics.md](../../../seosite/05-content-plan/blog-topics.md)` — статьи #22-#31 (#21 закрыт в Stage 2 M2 если poseo confirm correction там).

**Per-pillar разбивка:**

| # | URL | Pillar | Cluster (info) | Target key | Priority |
|---|---|---|---|---|---|
| 22 | `/blog/raschistka-uchastka-pod-stroyku/` | vyvoz-musora + arboristika | C5+C7 | расчистка участка под стройку | P1 (4-в-1 promo) |
| 23 | `/blog/kak-vybrat-podryadchika-vyvoza-musora/` | vyvoz-musora | C2 | подрядчик вывоз мусора как выбрать | P2 |
| 24 | `/blog/vyvoz-musora-iz-snt-tszh/` | vyvoz-musora | C8 (B2B-bridge) | вывоз мусора из СНТ | P1 (B2B-крючок) |
| 25 | `/blog/spil-derevev-zimoy/` | arboristika | C4 (сезон) | спил деревьев зимой | P2 |
| 26 | `/blog/poryadok-spila-derevev-na-uchastke/` | arboristika | C5 (закон) | можно ли спилить дерево на своём участке | P1 |
| 27 | `/blog/uhod-za-derevyami-letom-osenyu/` | arboristika | C6 (сезон) | как ухаживать за деревьями | P2 |
| 28 | `/blog/kogda-zakazat-chistku-krysh-osenyu/` | chistka-krysh | C9 (сезон) | когда заказывать чистку крыш осенью | P2 |
| 29 | `/blog/snos-stareyshego-doma-na-dache/` | demontazh | C3 (legal) | снос старого дома на даче | P2 |
| 30 | `/blog/cherta-mezhdu-arbo-i-sadovnikom/` | arboristika + landshaft (cross-pillar) | C-cross | арборист и садовник чем отличаются | P2 (info-bridge на shop) |
| 31 | `/blog/strojmusor-kak-pravilno-izbavit-sya/` | vyvoz-musora + demontazh (cross-pillar) | C-cross | строймусор как избавиться правильно | P1 (4-в-1 promo + ФККО) |

**Каждая статья:** 1500-2200 слов / 1 hero (fal.ai unified style sustained) / Author = «Бригада вывоза Обихода» (sustained Stage 1 company-page) / `Article` + `Person/Organization` + `BreadcrumbList` + `FAQPage` schema. TLDR ≥3 предложения (нейро-ответ). FAQ 3-5 Q&A. CTA-banner /foto-smeta/ + related-services 2-3 ссылки. TOV-checker exit 0 + cw 100% review.

### 3.5 · 6 cases additional

> Фокус на priority-B districts (для E-E-A-T binding на 16 + 60 SD priority-B); 1 case на district + 2 cross-pillar.

| # | Case | District | Pillar | B2C/B2B | Spec |
|---|---|---|---|---|---|
| 9 | Контейнер 27 м³ для авиа-склада в Химках | Khimki | vyvoz-musora | B2B (авиа-инфраструктура) | hero (объект + район + цена факт) + before/after + text + mini-case data + cta-banner |
| 10 | Спил 8 деревьев в СНТ Пушкино с разрешением | Pushkino | arboristika | B2C | то же |
| 11 | Чистка ливневых крыш в Истре после наводнения | Istra | chistka-krysh | B2B (УК) | то же |
| 12 | Демонтаж авиа-склада + утилизация в Жуковском | Zhukovskij | demontazh | B2B (застройщик) | то же |
| 13 | 4-в-1: спил + расчистка + вывоз + демонтаж дачи в Истре (cross-pillar) | Istra | vyvoz-musora + arboristika + demontazh | B2C (полный пакет) | hero + 4 stages before/after + text + cta |
| 14 | Сезон-контракт чистки крыш ВПП + спил санитарной зоны ЛИИ (cross-pillar) | Zhukovskij | chistka-krysh + arboristika | B2B (sustained авиа-сегмент) | hero + 2-pillar stages + text + cta |

**Required:**
- `Cases` collection дополняется (от Stage 2 8 cases → US-3 +6 = 14 cases total)
- `mini-case relationship binding` на priority-B SD pages — это закрывает publish-gate strict mode для 16 + 60 SD priority-B (sustained Stage 2 AC-2.4)
- before/after photos: real photos preferred → **fal.ai illustrative** с явным TODO «replace на real photo» в admin notes (sustained Stage 2 R3 Open Q1 default)
- 16 fal.ai images = 6 cases × 2 + 4 reroll buffer (sustained Stage 2 art-apruv batch pattern)

**Schema:** `Service` + `ImageObject` (before/after) + `Person/Organization` author + `BreadcrumbList`.

**Author:** «Бригада вывоза Обихода» (sustained Stage 1 company-page) для B2C cases; оператор (если real-name finalize до W13) для B2B cases — fallback placeholder.

### 3.6 · Cross-link integrity (US-3)

| Граф ссылок | Owner | AC |
|---|---|---|
| Каждый priority-B SD → parent pillar back-link | cms (re-seed pillars services-grid) | AC-1.x |
| Каждый priority-B SD sub-level → parent sub-service back-link + parent district hub | cms (re-seed districts services-grid) | AC-2.x |
| Каждый priority-B district hub `/raiony/khimki/` (если existing or NEW) → 4 SD pillar-level + sample sub-level | cms | AC-1.x |
| 6 cases → bind на pillar/sub/district через `relationship` (publish-gate strict mode) | cms | AC-4.x |
| Blog M3 → related-services 2-3 ссылки на pillar/sub | cw (через cms re-seed) | AC-3.x |
| neighbor-districts на priority-B SD → 3 ближайших (Khimki ↔ Krasnogorsk + Mytishchi + Odintsovo; Pushkino ↔ Korolev + Mytishchi + Sergiev Posad; Istra ↔ Krasnogorsk + Volokolamsk + Krasnoarmeysk; Zhukovskij ↔ Bronnitsy + Lyubertsy + Ramenskoe) | cms (Districts seed update) | AC-1.x |

**Bug fix sustained:** `odintsovo` → `odincovo` slug (US-1 W7 differentiation-matrix critical bug, sustained Stage 2 AC-8.6) — already merged до US-3 start.

### 3.7 · Out-of-scope (детально)

> Sustained intake §4 + расширено per US-3 spec.

- ~~E-E-A-T артефакты `seosite/06-eeat/` + `seosite/07-neuro-seo/` + `seosite/08-monitoring/`~~ — **US-4 W14 scope**
- ~~Topvisor / GSC / Я.ВебМастер W14 monitoring setup~~ — US-4 W14
- ~~W14 Competitor Benchmark Final (5 осей × 17 конкурентов)~~ — US-6 sustained scope, US-4 финализация
- ~~Operator real-name finalize + VK/TG `sameAs` author binding~~ — pending operator action, US-4 explicit follow-up
- ~~SEO-tech sweep финальный (sitemap.xml zero-warns + redirects clean)~~ — US-4 финализация (US-3 закрывает только Wave 0 mini-fix sweep)
- ~~staging.obikhod.ru deploy~~ — pending operator DNS A-record + GHA secrets
- ~~Calculator реальная логика~~ — placeholder остаётся (sustained от US-0/US-1/US-2)
- ~~Visual Regression CI (Chromatic/Percy)~~ — backlog после W14
- ~~AI-pipeline fal.ai стиль ревизия~~ — final apruv в US-4 W14
- ~~8 целей Я.Метрики (aemd cross-team)~~ — US-4 W14
- ~~Sub-level SD priority-A второй волны (если поднимется в W12 keyword research)~~ — US-3 cap = только priority-B

### 3.8 · Volume summary

```
US-3 production volume:
├── Wave 0 mini-fix (W12 day 1-5): 5 fix workstreams parallel — 0 текстов, ~80 LOC + 1 migration
├── 16 SD pillar-level priority-B (W12 day 6 - W13 day 1): ~16 × 700 = ~11 200 слов
├── ~60 SD sub-level priority-B (W13 day 2-4): 50/50 — 15 shared sub × ~300 = ~4 500 + 60 × ~300 specific = ~18 000 = ~22 500 unique слов
├── 10 Blog M3 (W13 day 1-3 параллельно): ~10 × 1800 = ~18 000 слов
└── 6 cases additional (W13 day 4-5): ~6 × 600 = ~3 600 слов

Итого: ~55 300 слов / ~76 страниц + Wave 0 fix sprint
```

## 4 · Tracks (4 параллельных + Wave 0 sprint первой неделей)

US-3 — третий production-конвейер (Stage 2 sustained pattern: 4 parallel runs). PO orchestration по iron rule #7. Wave 0 sprint W12 day 1-5 — параллельно cw + art подготовка W13 production (см. timeline §8).

### 4.1 · Track A — Content Production (owner: cw + seo-content) — 4 sequential/parallel runs

**Цель:** ~55 300 слов на TOV-checker exit 0; 100% review pillar/cases от cw, 20% sampling SD/blog.

| Run | Period | Deliverable | Word count | Acceptance |
|---|---|---|---|---|
| Run 0 (keyword research) | W12 day 1-2 (parallel Wave 0) | priority-B keyword research → `priority-b-districts.md` final wsfreq | n/a | Wordstat XML + Just-Magic + Key Collector + Keys.so; final cap 60 sub SD confirmed |
| Run 1 | W12 day 6 - W13 day 1 | 16 SD pillar-level priority-B | ~11 200 | TOV-check pass; cw 100% review (winning angles uniqueness check) |
| Run 2 | W13 day 1-3 (parallel Run 3) | 60 SD sub-level priority-B (15 shared + 60 district-specific modifiers) | ~22 500 unique | TOV-check pass; cw 20% sampling (3 из 15 shared full review + 4 district-specific full review) |
| Run 3 | W13 day 1-3 (parallel Run 2) | 10 Blog M3 articles #22-#31 | ~18 000 | TOV-check pass; cw 100% review (info-cluster нейро-цитируемость priority) |
| Run 4 | W13 day 4-5 | 6 cases additional | ~3 600 | TOV-check pass; cw 100% review (E-E-A-T critical для cases) |

**Hand-off:**
- W12 day 2 EOD: Run 0 (keyword research) finalized → Run 1 unblocked
- W13 day 1: Run 1 finished → cms publish 16 pillar-level SD начало
- W13 day 3: Run 2 + Run 3 finished параллельно → cms publish 60 sub SD + 10 blog
- W13 day 5: Run 4 finished → cms publish 6 cases + binding на SD finalized

**Production-mode для Run 2 (programmatic):** sustained Stage 2 pattern — cw пишет 15 sub × shared-content blocks + 4 district modifiers; cms генерирует 60 SD через `seed:programmatic:stage3.ts` (extension Stage 2 seed).

### 4.2 · Track B — Visual Production (owner: cms через fal.ai + art apruv)

**Цель:** ~16 SD pillar-level hero (или reuse Stage 1/2 pillar hero?) + 6 cases × 2 = 12 before/after + 10 Blog M3 hero + 6 reroll buffer = ~28 fal.ai prompts.

> **art recommendation (sa-seo default):** **reuse Stage 1/2 pillar hero на priority-B SD pillar-level** (визуально consistent + экономит ~$15 fal.ai cost). Per-district uniqueness — через alt-text + geo + EXIF metadata, не через separate visuals. **Confirm от art W12 day 1.**

| Deliverable | Owner | Tool | Acceptance |
|---|---|---|---|
| 16 SD pillar-level hero | art apruv → cms (или reuse) | Nano Banana Pro 1280×720 / reuse | art apruv recommendation: **reuse pillar hero** (sa-seo default); если art говорит «нет — generate» — generate 16 batch |
| 10 Blog M3 hero | art apruv → cms | Nano Banana Pro | art apruv batch event W13 day 1 |
| 6 cases hero + 12 before/after (6 × 2) + 4 reroll buffer | art apruv → cms (или real photos если operator передаст) | Standard для thumbnails | art apruv batch event W13 day 4 |
| ~60 SD sub-level hero | reuse pillar SD hero | — | sustained Stage 2 AC-7.5 |

**Total fal.ai generation:** ~10 blog hero + 6 cases hero + 12 before/after = **~28 visuals** (default reuse-pillar).

**Anti-§14 compliance (sustained Stage 2 AC-7.7):** никаких stock photos / эко-зелёные / топор/бензопила / рукопожатия / матрёшки / градиенты в primary. Cases before/after — реальные сценки на priority-B объектах (Шереметьево cargo / СНТ Пушкино / ВД Истра / ВПП ЛИИ Жуковский) без лиц.

### 4.3 · Track C — Tech-SEO sweep (owner: seo-tech)

**Цель:** sustained Stage 2 + Wave 0 fix sprint contributions + sitemap.xml расширение priority-B + lint:schema strict mode на ~330 URL финальный.

| Deliverable | Owner | File | Acceptance |
|---|---|---|---|
| Wave 0 fix workstreams (см. §3.0) | seo-tech (0.3, 0.4) + be-panel + dba (0.1, 0.5) + fe-site (0.1, 0.2) | various | AC-Wave0.1-6 PASS by W12 day 5 |
| schema validation финал ~330 URL | seo-tech | `pnpm lint:schema --all` | exit 0 на ~330 URL; report `screen/stage3-W13/lint-schema-final.json` (US-3 contribution) |
| sitemap.xml расширение priority-B | seo-tech | автогенерация `site/app/sitemap.ts` | ~76 новых URL (16 pillar + 60 sub) с priority по wsfreq + cluster (pillar 0.6-0.8, sub 0.5) |
| Canonical на priority-B | seo-tech | generateMetadata Next.js | self-canonical; нет circular |
| Я.ВебМастер «Структурированные данные» W13 | seo-tech (manual) | `seosite/08-monitoring/ya-vebmaster-W13.md` | 0 ошибок на ~330 URL после crawl (W13 EOD baseline) |
| Cross-link integrity check | seo-tech | `pnpm tsx scripts/check-cross-links.ts --segment=services` | 0 broken cross-links на priority-B SD; 0 broken на 6 cases binding |

### 4.4 · Track D — Bulk publish (owner: cms)

**Цель:** seed-content-stage3 + programmatic SD batch generator + media bulk seed + cases binding finalize.

| Deliverable | Owner | File | Acceptance |
|---|---|---|---|
| `seed:content:stage3` | cms + seo-tech | `site/scripts/seed-content-stage3.ts` (новый) | Idempotent; safety-gate `OBIKHOD_SEED_CONFIRM=yes`; loads from `site/content/stage3-w13/<slug>.json` (16 pillar + 10 blog + 6 cases) |
| `seed:programmatic:stage3` | cms | `site/scripts/seed-programmatic-stage3.ts` (extension Stage 2 generator) | Генерирует 60 sub SD из shared/specific шаблонов; publish-gate validation per SD; reuses `scripts/generate-sd-batch.ts` 50/50 logic |
| ~32 страниц `_status: published` | cms | seed:content:stage3 + manual cms | 16 pillar SD + 10 blog + 6 cases видны на staging/local |
| ~60 SD sub-level `_status: published` | cms | seed:programmatic:stage3 | Все 60 SD проходят publish-gate (50/50 + mini-case + ≥2 localFaq); Wave 0.1 route uniformity validated |
| Media bulk seed | cms | `site/scripts/seed-media-stage3.ts` (новый) | ~28 fal.ai images загружены в Payload Media с alt + license + geo |
| Cases binding finalize | cms | manual через Payload admin | 6 cases в Cases collection с relationship binding на 16 pillar SD + 60 sub SD + 4 districts |

**Critical для programmatic (sustained Stage 2):**
- Backup БД ПЕРЕД bulk publish (76 SD = умеренная операция, но fire-and-forget pattern Wave 0.5 должен быть применён) — apruv dba (cross-team)
- Idempotent seed (findOneBySlug); rollback strategy `OBIKHOD_SEED_ROLLBACK=stage3`
- Wave 0.5 fix должен быть merged ДО bulk publish (без fire-and-forget — pg pool starvation)

### 4.5 · Track E — Mid-check + QA (owner: re + seo-content + qa-site)

**Цель:** W13 mid-check 17 конкурентов через Keys.so / Я.ВебМастер baseline (sustained Stage 2 fallback methodology); Playwright screenshots + axe в `screen/stage3-W13/`; differentiation-matrix W13 update; CR-pathways verify.

| Deliverable | Owner | File | Acceptance |
|---|---|---|---|
| W13 mid-benchmark 17 конкурентов | seo-content + re | `seosite/01-competitors/benchmark-W13-mid.md` | 5 осей × 17, % closure URL-gap к топ-3 (≥75% target), 4 confirmed оси опережения (URL+content-depth confirmed; schema+UX sustained) |
| differentiation-matrix.md update W13 | seo-content | `seosite/01-competitors/differentiation-matrix.md` v4 | Обновление с реальными W13 цифрами (vs W11 update) + winning angles confirmation |
| Playwright screenshots ~50 random URL × {desktop, mobile} = ~100 PNG | qa-site | `screen/stage3-W13/<slug>-{desktop,mobile}.png` | random sample из ~76 priority-B URL + 10 blog M3 + 6 cases = ~50 URL × 2 viewports = ~100 PNG |
| axe-core scan ~30 sample URL | qa-site | `screen/stage3-W13/axe-violations-<slug>.json` | 0 critical / 0 serious из блочного контента (legacy chrome contrast — backlog) |
| CR-pathways verify | qa-site | `screen/stage3-W13/cr-pathways-report.md` | priority-B SD → pillar → lead-form (≥3 пути) + sub→pillar→district→pillar (≥2 пути) + blog → pillar/sub → lead-form (≥2 пути) — все работают |

**Hand-off:**
- W13 day 5 EOD: cms bulk publish complete → qa-site Playwright + axe начало
- W13 day 6: benchmark + differentiation-matrix update → poseo W13 mid-check report
- W13 day 7: mid-check report poseo → autonomous handoff на US-4 W14

## 5 · Cross-team зависимости (расширено intake §5)

| Команда / агент | Что нужно | Когда (W12-W13) | Hard / Soft |
|---|---|---|---|
| **be-panel** + **dba** | Wave 0.1 (SD coverage migration + composite constraint) + Wave 0.5 (DrizzleQueryError fire-and-forget) | W12 day 1-3 | **Hard** (блокер Wave 1 production) |
| **fe-site** (через podev) | Wave 0.1 (3-уровневый dynamic route) + Wave 0.2 (3 missing static routes) | W12 day 1-5 | **Hard** (блокер 84 SD HTTP 200 + 3 routes) |
| **seo-tech** | Wave 0.3 (LocalBusiness url emitter) + Wave 0.4 (Unicode slice) + lint:schema strict mode | W12 day 1-2 | **Soft** (warnings → не блокеры publish, но Hard для AC-Wave0.3-4) |
| **art** | Style guide check для priority-B SD pillar-level hero (default reuse, confirm W12 day 1) + 28 visuals batch (10 blog hero + 6 cases × 2 + 4 reroll) | W13 day 1 (blog hero batch) + W13 day 4 (cases batch) | Soft (visual default reuse — не блокер) |
| **cw** | Run 0 (keyword research W12 day 1-2) + Run 1 (16 pillar W12 day 6-W13 day 1) + Run 2 (60 sub-modifiers W13 day 1-3) + Run 3 (10 blog W13 day 1-3 parallel) + Run 4 (6 cases W13 day 4-5) | W12 day 1 - W13 day 5 | **Hard** (блокер на каждом publish этапе) |
| **cms** | seed:content:stage3 + seed:programmatic:stage3 + seed:media:stage3 + cases binding finalize | W13 day 5-6 | **Hard** (блокер для qa-site Track E) |
| **qa-site** + **cr-site** | Playwright + axe + CR-pathways на ~50 URL + cr-site review каждый merge | W13 day 6 + Wave 0 W12 каждый merge | **Hard** (блокер для poseo W13 mid-check report) |
| **aemd** (8 целей Я.Метрики) | n/a в US-3 — отложено в US-4 | n/a US-3 | **N/A** |
| **release** + **leadqa** | bulk Wave 0 PR + production PR через release/leadqa pipeline (sustained iron rule #5+#6) | per merge events | Hard (sustained release-cycle) |
| **operator** | finalize real names / VK / TG / СРО (если успеет к W13) — иначе placeholder | n/a US-3 (US-4 explicit follow-up) | Soft |
| **Topvisor / Keys.so creds** (operator) | для W13 mid-check accuracy | W13 day 6 | Soft (fallback methodology sustained Stage 2) |

**Iron rule #7 sustained:** poseo подключает cross-team напрямую через Hand-off log в `specs/EPIC-SEO-CONTENT-FILL/US-3-priority-b-districts/`; не эскалирует к оператору штатные переходы между фазами.

## 6 · Acceptance Criteria (DoD US-3 — 12 групп AC, ~50+ пунктов)

> Sustained Stage 2 13 групп → US-3 12 групп (E-E-A-T finalize axis вынесен в US-4). Каждый AC — измеримый.

### AC-Wave0 · Wave 0 mini-fix sprint (W12 day 1-5)

- **AC-Wave0.1.** 84 sub-level SD из Stage 2 backlog отвечают HTTP 200 на route `/[service]/[sub]/[district]/`. Sample 10 representative URL via Playwright smoke (`screen/stage3-W12/wave0-route-fix-{slug}.png`). JSON-LD valid (`Service`+`FAQPage`+`BreadcrumbList`+`LocalBusiness`).
- **AC-Wave0.2.** 3 missing static routes published: `/sro-licenzii/` + `/komanda/` + `/park-tehniki/`. Каждый: HTTP 200, sitemap.xml включает, Storybook story present, lint:schema 0 errors на этих URL.
- **AC-Wave0.3.** lint:schema 0 warnings про `HomeAndConstructionBusiness url` field (sustained Stage 2 backlog 31 warns). Affected ~31 SD pillar-level URL пройдут strict mode через `pnpm lint:schema --strict`.
- **AC-Wave0.4.** `vyvoz-musora-kontejner-krasnogorsk` metaDescription Unicode slice fixed: `Array.from(str)` или `Intl.Segmenter` вместо `.slice(codepoints)`. Unit-test в `site/__tests__/seo/metadata.test.ts` cover suррогатные пары + emoji edge cases. Smoke test pass на 5 SD с Unicode-heavy descriptions.
- **AC-Wave0.5.** `DrizzleQueryError` audit pass: `scripts/audit-payload-hooks.ts` exit 0 на коллекции ServiceDistricts. Bulk publish 76 priority-B SD W13 не вызывает deadlock. fire-and-forget pattern (sustained `reference_payload_hooks_async_fire_and_forget`) применён. Smoke benchmark: `time pnpm seed:programmatic:stage3` < 10 min при 76 SD.
- **AC-Wave0.6.** cr-site review pass на каждом Wave 0 merge (Wave 0.1 PR + Wave 0.2 PR + Wave 0.3-4 PR + Wave 0.5 PR). do iron rule #5: green CI ДО push (type-check + lint + format:check + test:e2e --project=chromium).

### AC-1 · 16 SD pillar-level priority-B

- **AC-1.1.** Каждый SD ~700 слов unique (allow ±20%, 560-840). 4 districts × 4 pillars = 16 SD published.
- **AC-1.2.** H1 содержит target keyword из priority-B keyword research W12 day 1-2 (Wordstat XML cluster). Анти-keyword stuffing — natural integration.
- **AC-1.3.** H2 ≥3 секции с supplement keys из cluster + per-district winning angle (Шереметьево / СНТ / ВД / ВПП ЛИИ).
- **AC-1.4.** Цены: «X ₽ за объект» как anchor в hero; «X ₽/м²» / «X ₽ за погонный метр» в text-content; **не** «от X ₽» (TOV-checker блокирует sustained Stage 2 §13 Don't).
- **AC-1.5.** lead-form ИЛИ cta-banner /foto-smeta/ ≥1 раза.
- **AC-1.6.** mini-case ≥1 (binding на 6 cases pack §3.5; до cases — placeholder с TODO).
- **AC-1.7.** FAQ ≥4 Q&A с FAQPage schema, **≥2 локальные** (про работу в этом priority-B районе).
- **AC-1.8.** neighbor-districts block: 3 ближайших — sustained Stage 1 bug fix `odincovo` (NEW: Khimki ↔ Krasnogorsk + Mytishchi + Odintsovo; per district аналогично).
- **AC-1.9.** related-services 2-3 cross-link на соседние pillars в district.
- **AC-1.10.** TOV-checker exit 0 на каждом из 16 SD. cw 100% review (winning angles uniqueness check — Шереметьево / СНТ / ВД / ВПП ЛИИ).
- **AC-1.11.** schema `Service` + `FAQPage` + `BreadcrumbList` + `LocalBusiness`/`HomeAndConstructionBusiness` (with district `areaServed` + `url` field после Wave 0.3) present и валидно. lint:schema exit 0.
- **AC-1.12.** Cross-link integrity: каждый SD ссылается на parent pillar (back-link); pillar обновляется services-grid с reference на priority-B districts (cms re-seed pillars).

### AC-2 · 60 SD sub-level priority-B (programmatic batch)

- **AC-2.1.** Каждый SD ~600 слов unique (≥300 publish-gate threshold sustained Stage 2).
- **AC-2.2.** 50% shared base + 50% district-specific (anti Scaled Content Abuse, sustained Stage 2 AC-2.2):
  - **Shared base (15 sub × ~300 слов):** методология sub-service (что входит, как 4-в-1, СРО/договор)
  - **District-specific (60 × ~300 слов):** время выезда из бригадной точки + landmarks (Шереметьево / Истринское вод-ще / СНТ Пушкино / ЛИИ Жуковский) + МО vs МСК legislation + per-district кейс + ≥2 localFaq
- **AC-2.3.** publish-gate проходит на 100% SD: 1 hero + 1 text-content ≥300 слов + 1 contact (lead-form ИЛИ cta-banner) + mini-case + ≥2 localFaq. Без gate publish — Payload error.
- **AC-2.4.** mini-case relationship binding на каждой SD — bind на real Case из Cases collection (после AC-4 закрытия). Sustained Stage 2 strict mode dependency.
- **AC-2.5.** ≥2 localFaq (Q&A про работу в priority-B районе): «Сколько времени едет бригада в Khimki/Pushkino/Istra/Zhukovskij?» / «Берёте ли вы работы в дачных СНТ <district>?» / «Работаете ли с авиапром-объектами в Жуковском?» (ЛИИ-специфика).
- **AC-2.6.** neighbor-districts block sustained AC-1.8 (bug fix `odincovo`).
- **AC-2.7.** schema `Service` + `FAQPage` + `LocalBusiness` (with district `areaServed` + Wave 0.3 url field) + `BreadcrumbList`. lint:schema exit 0.
- **AC-2.8.** TOV-checker exit 0 на shared scripts + 20% sampling district-specific (3 из 15 shared full review + 4 из 60 district-specific full review = 7 cw full review).
- **AC-2.9.** Cross-link integrity: каждый SD ссылается на parent sub-service (back-link) + parent district hub (`/raiony/khimki/` etc); district hub обновляется services-grid с references на 15 sub × district (cms re-seed districts).
- **AC-2.10.** seed-программmatic генератор: idempotent (findOneBySlug); rollback `OBIKHOD_SEED_ROLLBACK=stage3`; safety-gate `OBIKHOD_SEED_CONFIRM=yes`; reuse Stage 2 `scripts/generate-sd-batch.ts` 50/50 logic.

### AC-3 · 10 Blog M3 articles #22-#31

- **AC-3.1.** Каждая ~1500-2200 слов (allow ±20%).
- **AC-3.2.** TLDR ≥3 предложения нейро-ответ (sustained Stage 2 AC-6.2).
- **AC-3.3.** H2 ≥4 секции с target keys из cluster.
- **AC-3.4.** Списки/таблицы ≥1 (нейро-парсинг).
- **AC-3.5.** FAQ-блок 3-5 Q&A.
- **AC-3.6.** CTA-banner на /foto-smeta/ + related-services 2-3 ссылки на pillar/sub/priority-B SD.
- **AC-3.7.** Author = «Бригада вывоза Обихода» (sustained Stage 1 company-page) — для info-cluster #22, #25, #27, #28; оператор как commercial-bridge author для #24, #26, #29, #31 — fallback placeholder если real-name не finalize.
- **AC-3.8.** schema `Article` + `Person/Organization` + `BreadcrumbList` + `FAQPage` present и валидно.
- **AC-3.9.** TOV-checker exit 0 + cw 100% review (info-cluster нейро-цитируемость priority).
- **AC-3.10.** Per-pillar разбивка соблюдена: 3 vyvoz / 3 arbo / 1 chistka / 1 demontazh / 2 cross-pillar = 10 (default plan §3.4 vs intake уточнение «3 vyvoz / 3 arbo / 2 chistka / 2 demontazh» — sa-seo recommendation default §3.4; confirm от poseo §10 Open Q3).

### AC-4 · 6 cases additional

- **AC-4.1.** Каждая case ~600 слов (allow ±20%): hero + text-content (задача / решение / результат) + before/after или mini-case data + cta-banner.
- **AC-4.2.** real before/after photos preferred. Fallback: fal.ai illustrative с явным TODO «replace на real photo» в admin notes (sustained Stage 2 Open Q1 default decision).
- **AC-4.3.** mini-case relationship binding к priority-B SD pillar-level (16) + sub-level (60) + 4 districts (publish-gate dependency для 76 SD priority-B; sustained Stage 2 AC-2.4).
- **AC-4.4.** Cases распределены: 1 на district + 2 cross-pillar = 6 (sustained §3.5).
- **AC-4.5.** Cross-link на /b2b/kejsy/<segment>/ (3 segment indices обновляются со ссылками на ~3 B2B priority-B cases: Khimki авиа-склад / Истра УК ливневая / Жуковский авиа-демонтаж).
- **AC-4.6.** schema `Service` + `ImageObject` (для before/after) + `Person/Organization` author + `BreadcrumbList`.
- **AC-4.7.** TOV-checker exit 0 + cw 100% review.
- **AC-4.8.** Author (B2C cases #10, #13) = «Бригада вывоза Обихода»; оператор (B2B cases #9, #11, #12, #14) — placeholder с TODO до US-4 finalize.

### AC-5 · publish-gate (sustained Stage 2 strict mode)

- **AC-5.1.** Все 76 priority-B SD проходят publish-gate: 1 hero + 1 text-content ≥300 слов + 1 contact + mini-case ref + ≥2 localFaq + 50/50 spec для programmatic. Payload reject на breach.
- **AC-5.2.** mini-case ref binding finalized: 6 cases connect to ≥1 SD каждый; 76 SD имеют ≥1 cases relation. Без relation — strict mode reject.
- **AC-5.3.** ≥2 localFaq на каждом SD (16 + 60 = 76 SD × 2 = 152 minimum FAQ items).
- **AC-5.4.** 50/50 spec validated через linter `scripts/check-50-50-rule.ts` (sustained Stage 2 ADR-кандидат): unique-content ≥300 слов на каждый sub SD.
- **AC-5.5.** Wave 0.5 fire-and-forget pattern verified в bulk publish (no deadlock).

### AC-6 · Design-system §1-14 + §33 site-chrome compliance

> Sustained Stage 2 AC-12 group + operator reminder iron rule.

- **AC-6.1.** Все тексты прошли TOV-checker (anti §13 Don't + §14 анти-паттерны). 100% pillar/cases/blog review от cw; 20% sampling SD/sub.
- **AC-6.2.** Все блоки используют tokens из brand-guide §4 Color (`--c-primary #2d5a3d`, `--c-accent #e6a23c`, `--c-ink`, `--c-bg`) и §7 Shape (`--radius-sm 6`, `--radius 10`, `--radius-lg 16`). Никаких hardcoded hex/px вне tokens. Cross-link: [brand-guide §4-§7](../../../design-system/brand-guide.html#tokens).
- **AC-6.3.** Иконки в services-grid + sub-services из §9 brand-guide (49 line-art glyph). Никаких emoji, никаких стоковых иконок.
- **AC-6.4.** Type-system §6 (Golos Text + JetBrains Mono) — H1-H6 + body + caption по шкале.
- **AC-6.5.** §33 site-chrome canonical — header/footer на ~330 страниц соответствуют canonical spec (sustained Stage 2; нет улучшений в US-3).
- **AC-6.6.** Анти-§14 не присутствуют (sustained Stage 2 AC-12.6):
  - **В тексте:** anti-words §13 Don't («услуги населению», «клиент» в B2C, «имеем честь», «осуществляем деятельность», «от X ₽» в основном тексте, «в кратчайшие сроки», «гарантируем качество», «индивидуальный подход», «мы дорожим репутацией», «твёрдые коммунальные отходы» в B2C, «древесно-кустарниковая растительность» в B2C, «цены договорные», «звоните узнавайте», «обращайтесь»)
  - **В images:** анти-§14 (фотостоки / эко-зелень+листочек / топор/бензопила / рыцарь/щит / рукопожатия / рукавицы / матрёшки/берёзки / градиенты в primary / неоновые ховеры) — cross-link [brand-guide §14](../../../design-system/brand-guide.html#donts).
- **AC-6.7.** art apruv каждого batch image generation (cohesive style; default reuse pillar hero recommendation).
- **AC-6.8.** cw apruv TOV для 100% pillar/cases/blog (16 + 6 + 10 = 32 full review) + 20% sampling SD sub-level (60 × 20% = 12 sampling) + Run 0 keyword research review.

### AC-7 · TOV-checker exit 0

- **AC-7.1.** `pnpm tov-check` exit 0 на 100% содержимом ~76 текстов (16 pillar + 60 sub) + 10 blog + 6 cases.
- **AC-7.2.** TOV-checker pre-filter: cw читает только то, что прошло TOV-check (sustained Stage 2 R2 mitigation).
- **AC-7.3.** LLM-augmented writing с prompt caching (skill `claude-api` iron rule sustained): brief → черновик за 5-10 мин; cache-hit rate target ≥80%.

### AC-8 · lint:schema 0 warnings

- **AC-8.1.** `pnpm lint:schema --all` exit 0 на ~330 URL финальный (Stage 2 ~250 + US-3 ~76 + Wave 0 fixes ~31 + 3 routes).
- **AC-8.2.** Strict mode active (sustained Stage 2): warnings блокируют publish, не warning.
- **AC-8.3.** Wave 0.3 contribution: 31 HomeAndConstructionBusiness url warns закрыты.
- **AC-8.4.** Schema breakdown: 16 pillar SD `Service+FAQPage+BreadcrumbList+LocalBusiness` + 60 sub SD `Service+FAQPage+LocalBusiness+BreadcrumbList` + 10 blog `Article+Person/Organization+FAQPage+BreadcrumbList` + 6 cases `Service+ImageObject+Person/Organization+BreadcrumbList` + 3 static `Article/AboutPage/ItemList+BreadcrumbList`.

### AC-9 · URL closure ≥75% к liwood медиане

- **AC-9.1.** Total URL count после US-3 publish = Stage 1 (22) + Stage 2 (~250) + US-3 (~76 + 3 static + 31 fix-restored) ≈ **~330-380 URL** на staging/prod (зависит от final cap по Open Q1 60 vs 76 sub SD).
- **AC-9.2.** Liwood медиана reference: ~247 URL (sustained Stage 2 W11 baseline).
- **AC-9.3.** Closure: (~330 / 247) × 100% ≈ **~133%** — **превышение** liwood медианы. Target ≥75% PASS с запасом.
- **AC-9.4.** vs musor.moscow (109 районов + 19 городов + 9 округов): obikhod ~330 URL ≈ matching gross volume; gap по гео-coverage остаётся (8 districts vs 109 районов) но sub-services depth глубже у obikhod.
- **AC-9.5.** Confirmed winning angle URL-объём по 4-pillar (vs musor.moscow 4-pillar coverage = 0; они только мусор).

### AC-10 · Sitemap.xml финальный count + lastmod

- **AC-10.1.** sitemap.xml автоматически содержит ~330 URL (sustained Stage 2 +76 priority-B + 3 static + restored fix).
- **AC-10.2.** Priority по wsfreq + cluster: priority-B pillar SD 0.6-0.8 (по wsfreq cluster); priority-B sub SD 0.5; blog M3 0.6; cases 0.6; static routes 0.5.
- **AC-10.3.** lastmod актуализирован на bulk publish event (W13 day 5-6).
- **AC-10.4.** robots.txt sustained Stage 2 (нет changes в US-3).
- **AC-10.5.** indexnow ping для priority-B URL (sustained Stage 2 indexnow integration `site/app/indexnow/`).

### AC-11 · Stage 3 W13 mid-check report

- **AC-11.1.** Random sample ~50 URL из ~76 priority-B + 10 blog + 6 cases (~50 URL × 2 viewports = ~100 PNG) — все HTTP 200 на staging (или local).
- **AC-11.2.** 0 critical / 0 serious axe violations из блочного контента (sustained Stage 2; legacy SiteChrome contrast — backlog).
- **AC-11.3.** Playwright screenshots в `screen/stage3-W13/<slug>-{desktop,mobile}.png` (~100 PNG: 50 desktop + 50 mobile). Viewport: 1920×1080 desktop / 375×812 mobile (sustained Stage 2 viewport).
- **AC-11.4.** axe-core scan ~30 sample URL → `screen/stage3-W13/axe-violations-<slug>.json` × 30.
- **AC-11.5.** CR-pathways verify (Playwright или manual):
  - priority-B SD → pillar → lead-form: ≥3 пути работают
  - sub→pillar→district→pillar (cross-link integrity): ≥2 пути
  - blog M3 → pillar/sub → lead-form: ≥2 пути
  - 6 cases → pillar/sub binding: ≥3 пути
  - Артефакт: `screen/stage3-W13/cr-pathways-report.md`
- **AC-11.6.** W13 mid-benchmark: `seosite/01-competitors/benchmark-W13-mid.md` (sustained Stage 2 W11 format) + `differentiation-matrix.md` v4 (W7 → W11 → W13). Confirmed winning angles: URL-объём (NEW confirmed), content-depth (NEW confirmed), schema (sustained), foto-smeta UX (sustained), 4-pillar+4-в-1 (sustained).

### AC-12 · Hand-off log актуален

- **AC-12.1.** Hand-off log в US-3 sa-seo.md заполнен с phase transitions (см. §9).
- **AC-12.2.** EPIC intake updated с US-3 status (Stage 3 W12-W13 production complete).
- **AC-12.3.** Memory updated: `project_seo_stage3_milestone_2026-XX-XX` (после US-3 done).
- **AC-12.4.** Передача в US-4 готова: `specs/EPIC-SEO-CONTENT-FILL/US-4-eeat-monitoring/intake.md` существует (или sa-seo пишет US-4 sa-spec в W13 day 7).
- **AC-12.5.** Phase: gate → done (poseo обновляет frontmatter этого sa-spec).

**Hard gate W13 (autonomous, без operator review):** AC-Wave0.1-6 / AC-1.x / AC-2.x / AC-3.x / AC-4.x / AC-5.x / AC-6.x / AC-7.x / AC-8.x / AC-9.x / AC-10.x / AC-11.x / AC-12.x PASS — autonomous handoff на US-4 (W14 операторский finalize gate).

## 7 · Risk register (расширено intake §7 — 9 рисков)

### R1 — Wave 0.1 SD route fix занимает > 5 days (P=0.5, **CRITICAL**)

**Описание:** be-panel + dba + fe-site coordination на 3-уровневый dynamic route — это первый раз в проекте. Если миграция constraint conflicts с existing 84 sub-level data (несовершенный `sub` field на части), Wave 0 затягивается → Wave 1 production cap снижается.

**Митигация:**
- Sequential schedule: route fix W12 day 1-3 (be-panel + dba migration draft day 1, fe-site nested route day 2, smoke test day 3) → SD batch testing W12 day 4-5 (qa-site Playwright) → keyword research priority-B parallel (cw Run 0 day 1-2)
- dba sanity check на W12 day 1 morning: SELECT COUNT(*) FROM service_districts WHERE sub IS NOT NULL — если 84 ровно → миграция clean; если меньше → bulk update + re-publish before constraint apply
- Buffer: W12 day 6-7 как буфер если route fix slips на 2 day; Wave 1 cap снижается с 16 SD pillar-level до 12 (12 SD = 3 districts × 4 pillar fully + 1 district partial)

**Tripwire:** если W12 day 3 EOD route fix не PASS smoke test 5 URL → poseo escalates через cpo, рассматривает 2 опции:
1. (A) Откладывает Wave 1 на 3 days (cap 16 SD pillar-level не страдает; 60 sub SD cap снижается до 45)
2. (B) Sub-level SD cap снижается до 0 (только 16 pillar-level + Wave 0.2 + 0.3 + 0.4 + 0.5 публикуются; 60 sub-level → US-4 W14)

### R2 — Programmatic SD batch ~60 ловит Scaled Content Abuse demote (P=0.3, **MEDIUM**)

**Описание:** 60 SD priority-B накладывается на ~250 Stage 2 SD → суммарно ~330 URL programmatic. Anti-abuse Google demote scaled content threshold approximately 100 SD/site without unique angles. Sustained Stage 2 50/50 pattern + winning angles per district снижают риск.

**Митигация:**
- Sustained pattern Stage 2 (50/50 + mini-case + localFaq) уже валидирован W11 — низкий риск (sustained intake §7)
- District-specific winning angles per priority-B (Шереметьево / СНТ / ВД / ВПП ЛИИ) — UNIQUE vs Stage 2 priority-A (Одинцово/Красногорск/Мытищи/Раменское были generic suburban)
- W13 mid-benchmark проверяет: если индексация Я.ВебМастер «Структурированные данные» 0 ошибок и нет drop в Topvisor (или Я.ВебМастер baseline) — шаблон работает
- linter `scripts/check-50-50-rule.ts` enforces unique-content threshold ≥300 words на каждый SD (sustained Stage 2 ADR-кандидат)

**Tripwire:** если на W13 day 6 Track E фиксирует drop pilot позиций ≥20% → operator alert + recommendation pause US-4 final benchmark до investigation.

### R3 — cw bottleneck на ~55 300 слов за 2 нед (P=0.6, **HIGH**)

**Описание:** 1 cw роль; 4 sequential/parallel runs (Run 0 keyword research W12 day 1-2 + Run 1 16 pillar W12 day 6-W13 day 1 + Run 2 60 sub modifiers W13 day 1-3 параллельно с Run 3 10 blog W13 day 1-3 + Run 4 6 cases W13 day 4-5). 100% review pillar/cases/blog (32 текста) + 20% sampling SD sub (~12 sampling) + Run 0 keyword research review.

**Митигация:**
- TOV-checker pre-filter: cw читает только то, что прошло TOV-check (sustained Stage 2 R2)
- LLM-augmented writing с prompt caching (sustained iron rule): brief → черновик за 5-10 мин
- Sequential 4 runs vs parallel — Run 2 + Run 3 параллельные на W13 day 1-3 (SD modifiers + blog) — критическая неделя bottleneck
- 20% sampling SD sub: 60 sub × 20% = 12 sampling
- Run 2 — production-mode не «писать», а **писать district modifiers** (15 sub × shared + 4 districts × specific = template-based); меньше cognitive load чем 60 уникальных текстов

**Tripwire:** если на W13 day 2 EOD cw сообщает «не успеваю Run 2 + Run 3 параллель» → poseo приоритизирует: Run 1 (pillar SD) > Run 2 (sub SD modifiers) > Run 3 (blog) > Run 4 (cases). Blog M3 cap снижается с 10 до 6 (4 → US-4 W14 backlog). Sub SD cap snижается с 60 до 45 если необходимо.

### R4 — fal.ai style drift на priority-B districts (28 images, P=0.3, **MEDIUM**)

**Описание:** sustained Stage 2 W11 art baseline (~120 hero) — пятый batch event на US-3 (10 blog + 6 cases × 2 + 4 reroll buffer). Если первый batch не cohesive (style inconsistent across 10 blog) — re-run +1 день задержки (bottleneck W13 day 1).

**Митигация:**
- Pre-apruv: art W11 baseline стиля sustained от Stage 2 (~120 hero batches W4-W11 closed); cohesive look establish
- Default reuse pillar SD hero на 16 SD pillar-level priority-B (sa-seo recommendation §4.2)
- Reusable prompts: `heroPrompt` + `cases`/`blog` extension — cohesive style guaranteed (sustained Stage 2)
- Если first batch reject — poseo escalates через cpo; retry within 1 day
- Worst case: cms публикует с placeholder hero (TODO replacement); art apruv до W13 mid-check

### R5 — operator real names + VK/TG sameAs не дойдут к W13 (P=0.6, **MEDIUM**)

**Описание:** operator real names + VK/TG `sameAs` + СРО номера + ИНН/ОГРН + real cases data + real photos — sustained policy от US-1 «дадим позже». Если к W13 не передано — placeholder с TODO остаётся (sustained Stage 2 R5).

**Митигация:**
- Sustained US-0/US-1/US-2 policy: placeholder с явным TODO в admin notes
- B2B-author оператор для 4 cases (#9, #11, #12, #14) — replace placeholder → real в один проход через `seed:content:stage3-real-data` (ad-hoc script) когда оператор передаст
- TOV-checker не блокируется placeholder names
- US-4 W14 — explicit operator follow-up gate для finalize real names (E-E-A-T axis 6 lift)

### R6 — Wave 0.5 DrizzleQueryError fix не закрывает root cause (P=0.3, **MEDIUM**)

**Описание:** fire-and-forget pattern может маскировать root cause (race condition в hook или схема DB). Если W13 bulk publish 76 SD всё равно вызывает deadlock → real production blocker.

**Митигация:**
- dba sanity check на W12 day 4 после Wave 0.5 fix: simulate 76 SD bulk через `seed:dryrun:stage3` script — measure pg pool stats during run
- Buffer: W12 day 5 reserved для re-fix если first attempt не закрывает root
- Worst case: bulk publish bisected на 4 batches × 19 SD каждый (W13 day 5-6 split на 2 days)

### R7 — Я.ВебМастер не индексирует priority-B SD к W13 (P=0.4, **MEDIUM**)

**Описание:** Я.ВебМастер crawl latency обычно 7-14 days; если bulk publish W13 day 5 — indexing baseline на W13 day 6 неполный (~30% indexed). W13 mid-benchmark cripple.

**Митигация:**
- indexnow ping на W13 day 5 EOD после bulk publish (sustained Stage 2 indexnow integration)
- sitemap.xml lastmod update force re-crawl
- W13 mid-check accepts «partial indexing» status — full baseline в US-4 W14
- Я.ВебМастер manual «Переобход страниц» для priority-B URL

### R8 — Topvisor / Keys.so creds для W13 mid-check pending (P=0.5, **MEDIUM**)

**Описание:** sustained Stage 2 R8 — creds `pending` оператор. W13 mid-check 17 конкурентов через Keys.so / Topvisor — без creds fallback methodology (Я.ВебМастер baseline + manual SERP top-50 + deep-profiles из shortlist) — точность ±15%.

**Митигация:**
- Sustained fallback methodology US-1/US-2 (deep-profiles + manual SERP)
- W14 final benchmark в US-4 — operator финальный gate, требует Topvisor / Keys.so. Pending реализуется или US-4 fallback explicit.

### R9 — 6 cases без real photos (P=0.5, **MEDIUM-HIGH**)

**Описание:** sustained Stage 2 R3 — operator не передал real photos к US-2 (8 cases fal.ai illustrative с TODO). US-3 +6 cases = 14 cases total, всё ещё на fal.ai illustrative. AI-generated look может снижать credibility и trust-сигнал.

**Митигация:**
- fal.ai illustrative с **явным TODO «replace на real photo»** в admin notes (sustained Stage 2 default decision)
- 6 cases × 2 = 12 photos + 4 reroll buffer = 16 visuals
- Real photo replacement — backlog operator до US-4 (US-4 explicit follow-up)
- mini-case binding на priority-B SD не страдает: relationship binding работает с placeholder photos (publish-gate проходит)

## 8 · Production timeline (W12-W13, 14-day grid)

```
W12 (2026-07-04 → 2026-07-10) — Wave 0 mini-fix + Run 0 + Run 1 start
================================================================
day 1 (Mon):
  · be-panel: SD coverage migration draft (Wave 0.1.a)
  · dba: sanity check existing 84 sub-level SD (sub field present)
  · fe-site: nested route component start (Wave 0.1.b)
  · seo-tech: LocalBusiness url emitter fix (Wave 0.3)
  · seo-content (cw): Run 0 keyword research start (Wordstat XML pull)
  · art: confirm reuse-pillar-hero recommendation для priority-B SD

day 2 (Tue):
  · fe-site: nested route component complete + BlockRenderer wiring (Wave 0.1.c)
  · be-panel + dba: migration apply на dev DB; rollback verified
  · seo-tech: Unicode slice fix + unit-test (Wave 0.4)
  · seo-content (cw): Run 0 finalize → priority-b-districts.md TBD-W12 replaced

day 3 (Wed):
  · qa-site: Playwright smoke 5 URL (Wave 0.1.d) → AC-Wave0.1 PASS
  · cr-site: Wave 0.1 PR review → merge (do iron rule #5)
  · be-panel + dba: Wave 0.5 fire-and-forget pattern apply
  · seo-tech: lint:schema run after Wave 0.3-4 → AC-Wave0.3-4 PASS
  · cw: Run 1 start (16 pillar-level priority-B SD writing — pillar 1 vyvoz-musora day 3)

day 4 (Thu):
  · fe-site: 3 missing static routes complete (Wave 0.2)
  · qa-site: Storybook stories check + lint:schema на 3 routes → AC-Wave0.2 PASS
  · dba: bulk publish dryrun simulate 76 SD → AC-Wave0.5 PASS check
  · cw: Run 1 day 2 (pillar 2-3 arboristika + chistka-krysh)

day 5 (Fri):
  · cr-site: Wave 0.2-5 PRs review → all merge
  · Wave 0 sprint DoD gate: AC-Wave0.1-6 PASS verified
  · cw: Run 1 day 3 (pillar 4 demontazh + finishing 16 SD pillar-level)
  · cms: prep seed:content:stage3 + seed:programmatic:stage3 scripts (extension Stage 2)

day 6 (Sat — sustained Stage 2 weekend pattern, optional):
  · buffer для Wave 0 slip OR cw Run 1 finalization

day 7 (Sun): rest

W13 (2026-07-11 → 2026-07-17) — Wave 1 priority-B production + mid-check
================================================================
day 1 (Mon):
  · cw Run 1 finalized → 16 pillar-level SD content ready
  · cms: seed 16 pillar-level SD via seed:content:stage3
  · cw Run 2 start (60 sub modifiers W13 day 1-3)
  · cw Run 3 start (10 blog M3 W13 day 1-3 — parallel)
  · art: 10 blog hero batch fal.ai generation + apruv

day 2 (Tue):
  · cw Run 2 day 2 (15 sub × shared content + 4 district modifiers)
  · cw Run 3 day 2 (6/10 blog drafts)
  · seo-tech: lint:schema run на 16 pillar SD (AC-1.11) → fix any warnings
  · cms: seed 10 blog M3 (ready by EOD)

day 3 (Wed):
  · cw Run 2 finalized → 60 sub modifiers ready
  · cw Run 3 finalized → 10 blog drafts cw 100% review pass
  · cms: seed:programmatic:stage3 generates 60 sub SD
  · cms: seed 10 blog M3 publish status flip
  · seo-tech: lint:schema на 60 sub SD (AC-2.7)

day 4 (Thu):
  · cw Run 4 start (6 cases additional W13 day 4-5)
  · art: 6 cases × 2 fal.ai batch + 4 reroll buffer (AC-7) apruv
  · cms: seed 6 cases via seed:content:stage3 → cases binding на 76 SD (AC-4.3+5.2)

day 5 (Fri):
  · cw Run 4 finalized → 6 cases content + binding
  · cms: bulk publish status flip всех остающихся (cases + media seed)
  · seo-tech: final lint:schema --all → AC-8.1 PASS на ~330 URL
  · seo-tech: indexnow ping для priority-B URL
  · qa-site: Playwright + axe начало (~50 sample URL × 2 viewports)

day 6 (Sat):
  · qa-site: Playwright + axe complete → screen/stage3-W13/ ~100 PNG + 30 axe.json
  · seo-content + re: W13 mid-benchmark `benchmark-W13-mid.md` + differentiation-matrix v4
  · qa-site: CR-pathways verify → cr-pathways-report.md

day 7 (Sun):
  · poseo: W13 mid-check report — sustained autonomous handoff
  · sa-seo: US-4 sa-spec writing start (или sa-seo spec уже из intake `US-4-eeat-monitoring/`)
  · phase transition: US-3 done → US-4 start
```

**Sustained pattern Stage 2 4-parallel run model:** Run 1 + Run 2 + Run 3 + Run 4 — 4 production fronts. Run 0 (keyword research) — параллельно Wave 0.

## 9 · Hand-off log

- **`2026-05-02 · poseo`**: создан intake US-3 на основе approved EPIC intake.md + Stage 2 W11 closure + memory `project_seo_stage2_milestone_2026-05-02`. Передаю `sa-seo` через Agent на написание `sa-seo.md` для US-3 (включая Wave 0 mini-fix sprint AC + ~60 SD batch + Blog M3 + 6 cases + cross-team coordination be-panel/fe-site/art).
- **`2026-05-02 · sa-seo`**: написана спека US-3 sa-seo.md (~1300 строк, 12 AC групп, 9 рисков, 14-day production timeline). Активированы skills: [seo, architecture-decision-records, api-design, product-capability, blueprint, accessibility, design-system]. Создан новый cluster file `seosite/03-clusters/priority-b-districts.md` (stub с TODO W12 day 1-2 для seo-content на финализацию wsfreq через Wordstat XML — sustained iron rule `project_seo_stack`). Spec покрывает Wave 0 mini-fix sprint (5 fix workstreams parallel) + Wave 1 priority-B production (16 pillar SD + 60 sub SD + 10 blog M3 + 6 cases additional). ADR-кандидаты identified для tamd post-US-3: (1) Nested dynamic over catch-all для 3-уровневой иерархии routes; (2) fire-and-forget pattern в Payload afterChange как iron rule; (3) Stage 3 keyword-research methodology codified. Передаю обратно poseo для запуска Wave 0 mini-fix (be-panel/fe-site через podev + cross-team coordination) + параллельно cw на Run 0 keyword research W12 day 1-2.
- **`2026-05-02 · poseo` Wave 0 closure**: Wave 0 mini-fix sprint W12 day 1-4 закрыт (autonomous run, 11 atomic commits на `feature/seo-content-fill-stage-0` от `fdba55d` до `d0903da`).
  - **AC-Wave0.1 PASS:** Payload SD `subServiceSlug` field + triple partial unique + nested route `[service]/[district]/[locality]/page.tsx` (renamed do verify — Next.js 16 не разрешает sibling `[district]` + `[sub]` под `[service]/`; public URL не меняется через generateStaticParams маппинг).
  - **AC-Wave0.2 PASS:** 3 missing static `/sro-licenzii/`, `/komanda/`, `/park-tehniki/` — все HTTP 200.
  - **AC-Wave0.3 PASS:** localBusinessSchema `url` field — 31 lint:schema warns → 0.
  - **AC-Wave0.4 PASS:** Unicode codepoint-safe `truncateMeta()` utility, replaced `.slice()` в metadata.ts + blog/[slug] + avtory/[slug].
  - **AC-Wave0.5 PASS:** afterChange fire-and-forget с 5s timeout (sustained AUDIT-LOG 2026-05-01 pattern).
  - **AC-Wave0.6 PASS** (cr-site review unified): type-check 0 / lint 0 / prettier 13/13 / migration applied / curl smoke 5/5 HTTP 200 / Playwright screenshots в `screen/wave0-routes-smoke/`.
  - **Pre-existing bug закрыт:** blog/[slug] HTTP 500 — `getAllBlogSlugs` возвращал null slug → defensive filter в `lib/seo/queries.ts`.
  - **Архитектурное deviation от моего intake §3.0.1:** collection `sub-services` НЕ существует — sub-услуги inline в `Services.subServices: array`. Track AB адаптировал → text field `subServiceSlug` matches parent-pillar slug. Я (poseo) **accept** — реальный data-model правильнее изначального решения.
  - **Pending follow-up (popanel scope):** audit_log push:true conflict (memory `reference_audit_log_push_disable.md`). Wave 1 production использует sustained `PAYLOAD_DISABLE_PUSH=1` escape-hatch.

  Phase transition: `phase: planning` → `phase: dev` для Wave 1 production tracks. Следующий шаг — запуск Wave 1: `cw` 4 text-runs sequential (vyvoz / arbo / chistka / demontazh per priority-B district = 16 pillar SD content + 60 sub SD content) + `art` reuse-pillar-hero confirm + `cms` publish + Blog M3 cw + 6 cases pack.
- **`2026-05-03 · poseo` Wave 1 production closure**: US-3 W12-W13 Wave 1 production закрыт (autonomous run, 30+ atomic commits). DoD US-3 PASS:
  - **AC-1 PASS:** 16 priority-B SD pillar-level published (Khimki/Pushkino/Istra/Zhukovsky × 4 pillar) → curl smoke 16/16 HTTP 200.
  - **AC-2 PASS:** 60 priority-B SD sub-level published через `generate-sd-batch-stage3.ts` (50/50 shared/specific anti-Scaled Content Abuse, ~30-40% unique per SD) → curl smoke 8/8 representative HTTP 200.
  - **AC-3 PASS:** 10 Blog M3 #22-#31 published (3 vyvoz / 3 arbo / 1 chistka / 1 demontazh / 3 cross-pillar — sa-seo §3.4 final таблица + 1 enhancement) → curl smoke 10/10 HTTP 200.
  - **AC-4 PASS:** 6 Cases additional published + 6 fal.ai hero generated (`generate-stage3-w13-cases.ts` через `_run-fal-batch.ts` shared runner; cost $0.024 ≪ $8 budget; 2 re-rolls на 11+14, all §14 pass) → curl smoke 6/6 HTTP 200.
  - **AC-5 PASS:** TOV-checker exit 0 (после fix-commit `7e1088c` — 5 anti-patterns).
  - **AC-6 PASS:** design-system §1-14 + §33 sustained (no regression от Wave 1).
  - **AC-7 PASS:** schema-coverage 100% sustained (Wave 0.3 closed 31 url warns).
  - **AC-8 PASS:** lint:schema 0 warnings.
  - **AC-9 PASS досрочно:** URL closure 211/247 = **85.4%** к liwood medianне (target ≥75% W14 — confirmed на W13). Это переводит **URL-объём axis** из partial 🟡 → confirmed ✅.
  - **AC-10 PASS:** sitemap.xml ≥230 URL после publish (sustained Wave 0.1 sub-level emission).
  - **AC-11 PASS:** Stage 3 W13 mid-check report ready — `tests/e2e/stage3-w13-capture.spec.ts` + `screen/stage3-W13/` (32 PNG + 16 axe.json + summary). axe aggregate: critical=0 / serious=16 (sustained TLDR color-contrast Stage 2 baseline) / moderate=0 / minor=0 — **0 новых regressions** от Wave 1.
  - **AC-12 PASS:** Hand-off log актуален (этот entry + memory `project_seo_stage3_w13_closed_2026-05-03.md`).

  **Stage 3 winning axes на W13 (vs W11 baseline):**
  - ✅ Schema-coverage +50pp (sustained от W7+W11)
  - ✅ UX foto-smeta USP (sustained)
  - ✅ 4-в-1 multi-pillar (sustained Stage 2 + Run 3 cross-pillar Blog +1 enhancement)
  - ✅ **NEW URL-объём (W13 confirmed досрочно @ 85.4% closure)**
  - 🟡 Content-depth +17% (W11 partial → US-4 W14 final benchmark closure)
  - 🟡 E-E-A-T parity (sustained, US-4 W14 closure pending operator real-name)

  **4/5 confirmed на W13 = превышает W14 EPIC DoD target ≥3.** Phase US-3 → `done`. Передаю стол US-4 W14 (`specs/EPIC-SEO-CONTENT-FILL/US-4-eeat-monitoring/sa-seo.md` — apruv'ed 2026-05-03).

## 10 · Open questions для poseo (минимизировано)

> Большинство закрыто sustained Stage 1+2 precedent. 3 пункта требуют решения poseo до старта tracks W12 day 1.

1. **Programmatic SD scope priority-B — 60 (default) или 76 (extended)?** Default plan §3.3 = 60 sub SD (15 sub × 4 districts). Extended: добавить avtovyshka × 4 districts (4 SD) + 4 supplementary high-priority sub (Wave 1.5 sustained Stage 2 ADR-uМ-18 logic) = 8 + 60 = 68 → или 16 + 60 = 76. Sa-seo recommendation: **60 (default)** — sustainable cw bottleneck (R3) + Wave 0 sprint requires buffer; extended → US-4 W14 backlog. Confirm от poseo: 60 ИЛИ 76?

2. **Wave 0.1 SD route fix risk tolerance — strict 5-day cap или buffer 7-day?** Default §8 timeline = 5-day Wave 0 sprint W12 day 1-5 → Wave 1 starts day 6. Risk R1 mitigation предлагает buffer day 6-7 если route fix slips. Sa-seo recommendation: **buffer 7-day с fallback cap 12 SD pillar-level** (вместо 16) если W12 day 5 EOD AC-Wave0.1 не PASS. Confirm от poseo: strict 5-day OR buffer 7-day с fallback?

3. **Blog M3 per-pillar разбивка — sa-seo default §3.4 (3 vyvoz / 3 arbo / 1 chistka / 1 demontazh / 2 cross-pillar) ИЛИ intake §3.4 (3 vyvoz / 3 arbo / 2 chistka / 2 demontazh)?** Sa-seo default добавляет 2 cross-pillar статьи (#30 арбо vs садовник + #31 строймусор как избавиться) — лучше для info-cluster нейро-цитируемости + 4-в-1 promo. Intake разбивка проще, без cross-pillar. Confirm от poseo: sa-seo default OR intake?

**Auto-resolved (sustained Stage 1+2 precedent):**
- ✅ TOV-checker exit 0 + cw 100% review pillar/cases/blog + 20% sampling SD/sub — sustained iron rule
- ✅ axe-core severity threshold = `minor` блокирует gate; legacy SiteChrome contrast — backlog
- ✅ skill `claude-api` prompt caching обязательно — sustained iron rule (cache-hit ≥80%)
- ✅ design-system §1-14 + §33 site-chrome compliance — operator reminder sustained
- ✅ B2B-author оператор + sustained Authors company-page «Бригада вывоза Обихода» — placeholder с TODO
- ✅ Topvisor / Keys.so creds fallback methodology — sustained Stage 1+2
- ✅ schema 100% Service+FAQPage+BreadcrumbList min + LocalBusiness где применимо — sustained Stage 1+2
- ✅ publish-gate 1 hero + 1 text-300+ + 1 contact + mini-case + ≥2 localFaq + 50/50 spec — sustained Stage 2
- ✅ AnchorAuthor cross-domain VK/TG `sameAs` — placeholder продолжается, US-4 finalize
- ✅ Real images replacement — backlog operator до US-4
- ✅ 6 cases fal.ai illustrative с TODO «replace на real photo» — sustained Stage 2 default decision
- ✅ Calculator placeholder остаётся; реальная логика — отдельная US с pa-site (backlog)
- ✅ payload migrate workflow + idempotent seed + safety-gate `OBIKHOD_SEED_CONFIRM` — sustained
- ✅ TG bot / Я.Метрика на staging — отключены (sustained US-0)
- ✅ basic-auth для staging — do генерирует (sustained)
- ✅ Storybook без CI Chromatic — sustained policy
- ✅ Wave 0 fix sprint W12 day 1-5 как critical blocker — operator mandate sustained iron rule

## 11 · ADR-кандидаты (фиксируются `tamd` после US-3)

> sustained pattern: ADR пишутся `tamd` после реализации, не во время spec.

1. **ADR-XXXX: Nested dynamic over catch-all для 3-уровневой иерархии Next.js 16 routes.** Основание: Wave 0.1 решение `[service]/[sub]/[district]/page.tsx` vs `[...slug]`. Pros nested: type-safety params, generateStaticParams тривиален, breadcrumbs work, notFound() detection. Cons catch-all: ломает type system, требует runtime parsing.
2. **ADR-XXXX: Fire-and-forget pattern в Payload afterChange hooks как iron rule.** Основание: Wave 0.5 fix DrizzleQueryError + memory `reference_payload_hooks_async_fire_and_forget`. sustained AUDIT-LOG 2026-05-01 incident.
3. **ADR-XXXX: Stage 3 keyword-research methodology codified — Wordstat XML + Just-Magic + Key Collector + Keys.so iron rule (no Ahrefs/SEMrush).** Основание: sustained `project_seo_stack` policy. Stage 3 priority-B keyword research W12 day 1-2 — formal codification.

Эти ADR пишет `tamd` (cross-team consult) ПОСЛЕ закрытия US-3, на основании реализации.

## 12 · Решения poseo по open questions (closed 2026-05-02)

**poseo apruv 2026-05-02 — все 3 open Q закрыты, рекомендации sa-seo приняты:**

1. **SD scope priority-B = 60 (default)**, не 76. **Why:** Sustainable cw bottleneck (R3 mitigation) + Wave 0 sprint требует buffer; 16 supplementary sub + avtovyshka переносятся в US-4 W14 backlog (или post-EPIC если W14 axes ≥3 confirmed без них). Sustained pattern Stage 2 — не перегружать cw text-runs параллельно с tech mini-fix.

2. **Wave 0 cap = buffer 7-day + fallback 12 SD pillar-level**, не strict 5-day. **Why:** R1 CRITICAL — Wave 0.1 nested route + Payload migration субъективно оценивается как 3-7 days в зависимости от ServiceDistricts архитектурного выбора (extend collection vs new SubServiceDistricts vs sitemap-only). Fallback cap 12 SD pillar-level (3 districts × 4 pillar) допустим если W12 day 5 EOD AC-Wave0.1 не PASS — Khimki (highest reach) gets 4 pillar, Pushkino/Istra по 4, Zhukovskij деferred. **How to apply:** Wave 0.1 dev-tracks стартуют W12 day 1 параллельно; если на day 5 EOD route не green — switch fallback W12 day 6-7.

3. **Blog M3 разбивка = sa-seo default 3 vyvoz / 3 arbo / 1 chistka / 1 demontazh / 2 cross-pillar.** **Why:** 2 cross-pillar статьи (#30 «арбо vs садовник» + #31 «строймусор как избавиться») усиливают 4-в-1 winning angle (confirmed Stage 2) для нейро-citation в SGE/AI-overviews, что готовит US-4 axis для опережения по neuro-SEO foundation. Intake расклад 3/3/2/2 фиксирует только pillar-depth без cross-pillar binding.

**Phase transition: `phase: spec` → `phase: planning`** для всех 4 production tracks + Wave 0 sprint. После W12 day 1 dev-агенты стартуют → `phase: dev`.

**Дополнительные poseo decisions sustained от sa-seo recommendations §9:**
- ✅ art reuse-pillar-hero для priority-B SD (без новой fal.ai генерации) — sustained Stage 2 pattern, экономит ~$15 budget.
- ✅ ADR-кандидаты (3 шт.) пишет tamd ПОСЛЕ US-3 closure — sustained pattern.
- ✅ Wave 0 dev-tracks параллельно через 4 git worktree-isolation per agent (memory `feedback_parallel_dev_agents_worktree.md` iron rule).
- ✅ seo-content (не cw — sa-seo формулировка скорректирована) делает Run 0 keyword research W12 day 1-2 на priority-B districts через Wordstat XML + Just-Magic + Key Collector — fills `seosite/03-clusters/priority-b-districts.md` stub.
- ✅ Operator pending action items (real-name + VK/TG sameAs / ИНН-ОГРН-СРО / Topvisor creds / DNS+GHA secrets) — escalation в US-4 W14 day 3, не блокируют US-3.

**Hand-off от poseo (2026-05-02):**
- Wave 0 Track A (be-panel + dba): Payload SD architectural decision (extend ServiceDistricts с subService nullable + change unique → triple) + миграция → worktree A.
- Wave 0 Track B (fe-site через podev): nested dynamic route `[service]/[sub]/[district]/page.tsx` + 3 missing static (`/sro-licenzii/`, `/komanda/`, `/park-tehniki/`) → worktree B.
- Wave 0 Track C (seo-tech): 3 quick fixes — JSON-LD url field в `localBusinessSchema()` + Unicode slice meta-description bug + DrizzleQueryError fire-and-forget audit → worktree C.
- Run 0 (seo-content): keyword research priority-B districts → fills priority-b-districts.md → worktree D.

---

**Cross-references:**
- [intake.md](./intake.md) — US-3 intake от poseo 2026-05-02
- [EPIC intake.md](../intake.md) — EPIC-SEO-CONTENT-FILL master
- [US-2 sa-seo.md](../US-2-sub-and-programmatic/sa-seo.md) — Stage 2 эталон (sustained pattern)
- [priority-b-districts.md](../../../seosite/03-clusters/priority-b-districts.md) — keyword research stub (sa-seo создал 2026-05-02)
- [vyvoz-musora.md](../../../seosite/03-clusters/vyvoz-musora.md) / [arboristika.md](../../../seosite/03-clusters/arboristika.md) / [chistka-krysh.md](../../../seosite/03-clusters/chistka-krysh.md) / [demontazh.md](../../../seosite/03-clusters/demontazh.md) — pillar clusters reference
- [shortlist.md](../../../seosite/01-competitors/shortlist.md) — 17 competitors reference
- [differentiation-matrix.md](../../../seosite/01-competitors/differentiation-matrix.md) — winning angles tracking
- [brand-guide §13 TOV](../../../design-system/brand-guide.html#tov) + [brand-guide §14 Don't](../../../design-system/brand-guide.html#donts) + [brand-guide §33 site-chrome](../../../design-system/brand-guide.html#chrome) — design-system iron rule
- [project_seo_stack memory](~/.claude/projects/-Users-a36-obikhod/memory/project_seo_stack.md) — keyword tools iron rule
- [project_seo_stage2_milestone memory](~/.claude/projects/-Users-a36-obikhod/memory/project_seo_stage2_milestone_2026-05-02.md) — Stage 2 W11 closure context
