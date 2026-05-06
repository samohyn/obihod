---
epic: EPIC-SEO-COMPETE-3
title: SEO + нейро-SEO стратегия обгона liwood.ru / arborist.su / arboristik.ru — 12 недель
team: seo
po: poseo
type: programmatic + content + research + tech-seo
priority: P0
segment: services
phase: discovery
role: poseo
status: active
blocks: []
blocked_by:
  - tamd ADR-0018 url-map (uborka-territorii как 5-й pillar)
  - operator NAP placeholder → real (телефон / адрес для footer + B2B PDF + Я.Карты)
  - operator real-name + фото 3-5 авторов (для US-11 E-E-A-T)
related:
  - ADR-0018-url-map-compete-3 (in draft)
  - team/seo/topvisor-project-setup.md (creds готовы к передаче)
created: 2026-05-06
updated: 2026-05-06
skills_activated: [seo, blueprint, market-research, product-capability, project-flow-ops, search-first, product-lens]
clean_start: true
deletes:
  - specs/EPIC-SEO-OUTRANK/
  - seosite/strategy/
  - seosite/02-keywords/raw/
  - seosite/02-keywords/derived/
  - seosite/03-clusters/
  - seosite/05-content-plan/
  - seosite/scripts/
preserves:
  - seosite/01-competitors/keysso-snapshot-2026-05-06.json
---

# EPIC-SEO-COMPETE-3 — обгон 3 конкурентов за 12 недель

**Автор intake:** poseo
**Дата:** 2026-05-06
**Источник:** запрос оператора 2026-05-06 «полноценная продуманная стратегия обгона 3 ключевых конкурентов: liwood.ru / arborist.su / arboristik.ru»
**Approved через AskUserQuestion 2026-05-06:**
1. `/uborka-territorii/` — новый 5-й pillar в этот EPIC
2. Реальные имена 3-5 авторов + фото + bio для E-E-A-T
3. Сервисы: Topvisor creds ✅ · Just-Magic ✅ · NAP placeholder · Я.Бизнес/Карты ❌ (отложено)
4. Старые SEO-артефакты — **удалить полностью** (clean start)

---

## Skill activation (iron rule)

`poseo` активирует на старте: **`seo`** (основной), **`market-research`** (3-конкурента deep dive), **`product-capability`** (5-pillar capability map), **`blueprint`** (12 US декомпозиция), **`project-flow-ops`** (sequencing W1-W12), **`search-first`** (Keys.so + Just-Magic + Topvisor reuse), **`product-lens`** (intent-фильтр на каждом ключе).

---

## Контекст

### Запрос оператора (точная цитата)

> «подготовить полноценную продуманную стратегию как нам обогнать 3 ключевых для нас конкурента: liwood.ru / arborist.su / arboristik.ru. наша задача сделать сайт на котором будут все необходимые страницы адаптированные под seo и нейроseo чтобы закрыть gap по конкуренции и привлекать орагнический трафик. … коммерческие запросы → страницы с лидформами, информационные → страницы с кейсами … в работе мы не используем старые артефакты, создаем стратегию с 0-нуля (новый EPIC)»

### Live Keys.so baseline (2026-05-06, msk)

| Домен | DR | pagesInIndex | keys в топ-50 | Стратегия |
|---|---:|---:|---:|---|
| liwood.ru | 21 | 155 | 5 097 | Контент-машина `/info/articles/` (82% трафика) |
| arborist.su | 24 | 74 | 1 355 | B2B-нормативка + PDF (порубочный билет, лесная декларация) |
| arboristik.ru | 26 | 65 | 1 365 | Mega-прайс `/tsenyi/` (33% трафика) + flat-структура |
| **obikhod.ru (нас)** | **TBD** | **0** | **0** | **новый сайт** |

Раw snapshot: `seosite/01-competitors/keysso-snapshot-2026-05-06.json` (сохранён).

### 5 ключевых insights (Phase 1 deep dive 2026-05-06)

1. **Копировать «контент-машину liwood»** — 30+ info-articles на vis-чемпионы (обрезка персика осенью 731 vis, удаление пней селитрой 479, кронирование 235).
2. **Копировать «mega-прайс arboristik»** — единый `/uslugi/tseny/` с матрицей цен → ключ «спил деревьев» (ws 78 316).
3. **Закрыть B2B-gap arborist.su** — 6 лендингов нормативных документов (порубочный билет / лесная декларация / акт-обследование / СРО-выписка / ФККО / фитосанитарный).
4. **Whitespace `<service> × <city МО>`** — НИ один из 3 не делает programmatic geo. Это окно.
5. **URL-эталон:** `/<pillar>/<sub>/`, `/<pillar>/<sub>/<city>/`, `/blog/<slug>/`, `/uslugi/tseny/`, `/b2b/<doc>/`, `/kalkulyator/foto-smeta/`, `/otzyvy/`, `/kontakty/`.

### Что готово в site/ (re-use, не трогаем)

- App router: `/[service]/`, `/[service]/[district]/` (ServiceDistricts), `/kejsy/`, `/blog/`, `/raiony/`, `/komanda/`, `/avtory/`, `/sro-licenzii/`, `/b2b/` list
- Payload 11 collections: Services, Districts, ServiceDistricts, Cases, Blog, Authors, Leads, B2BPages, Redirects, Users, Media
- 14 blocks (Hero, LeadForm, Faq, Tldr, MiniCase, Calculator, RelatedServices…) + 20 marketing sections
- SEO infra: `lib/seo/{metadata,jsonld,canonical,indexnow}.ts`, `app/sitemap.ts`, `app/robots.ts` (уже разрешает GPTBot/ClaudeBot/PerplexityBot/YandexGPT/OAI-SearchBot/Applebot-Extended)
- Lead-form: `/api/leads` + Telegram notification (US-8 W15 done)
- llms.txt route уже есть

### Gaps (создаём в EPIC)

| Gap | US |
|---|---|
| FAQ standalone collection | US-3 (часть jsonld) |
| Reviews collection (data-driven) | US-9 (Reviews + `/otzyvy/`) |
| `/uslugi/tseny/` mega-прайс хаб | US-4 |
| `/kontakty/` | US-8 |
| `/kalkulyator/foto-smeta/` | US-8 |
| `/otzyvy/` | US-9 |
| `/uborka-territorii/` pillar + 4 sub | US-2 ADR + US-7 content |
| 6 B2B нормативных лендингов + PDF | US-6 |
| 30 info-articles в `/blog/` | US-5 |
| `lib/seo/citation.ts` (нейро-SEO TL;DR) | US-3 |
| `app/llms-full.txt/route.ts` | US-3 |
| IndexNow auto-trigger через afterChange | US-3 |

---

## Скоп EPIC

### Включаем (5 pillar)

1. **Вывоз мусора** (`/vyvoz-musora/`) — расширение pillar + sub + SD контейнеров
2. **Арбористика** (`/arboristika/`) — pillar + 4-6 sub (включая `obrezka-derevev`, `obrabotka-ot-koroeda`, `kronirovanie`)
3. **Демонтаж в частном секторе** (`/demontazh/`) — pillar + 6-8 sub
4. **Уборка снега и чистка крыш** (`/uborka-snega-i-chistka-krysh/`) — pillar + 4 sub
5. **Уборка территории** (`/uborka-territorii/`) — **новый 5-й pillar** (decision 2026-05-06) + 4 sub: `vyravnivanie-uchastka` / `raschistka-uchastka` / `pokos-travy` / `vyvoz-porubochnyh-ostatkov`

### Не включаем (out of scope)

- Магазин саженцев (`apps/shop/`) — отдельный EPIC-SEO-SHOP
- Услуга «Дизайн ландшафта» — отдельный EPIC-SEO-LANDSHAFT (blocked by `art` brand-guide-landshaft)
- Платный трафик / контекст / SMM — `aemd` / `pa`
- amoCRM / Calltouch / Sentry интеграции — отдельные US в panel/product
- Полный редизайн homepage — отдельный EPIC-HOMEPAGE-V2
- Конструктор лендингов — отдельный panel-track
- Я.Карты карточка организации (US-9 Я.Карты часть) — отложено до получения owner-доступа от оператора

### DoD EPIC (метрика на W14)

| AC | Метрика | Источник | Baseline | Target | Stretch |
|---|---|---|---:|---:|---:|
| AC-1 | pagesInIndex | Keys.so + Я.Вебмастер | 0 | **≥160** (паритет с liwood 155) | ≥220 |
| AC-2 | Topvisor visibility | Topvisor | 0 | **≥15** | ≥25 |
| AC-3 | Keys в топ-10 | Topvisor | 0 | **≥80** | ≥150 |
| AC-4 | Organic sessions/нед | Я.Метрика 108715562 | ~0 | **≥800/нед** | ≥2 000/нед |
| AC-5 | Lead submissions/нед | `/api/leads` + Я.Метрика | ~0 | **≥15/нед** | ≥40/нед |
| AC-6 | Pricing-cluster top-10 share | Topvisor | 0% | **≥30%** | ≥50% |
| AC-7 | AI-citation rate (10 prompts) | Manual prompt-tests YandexGPT/SearchGPT/Perplexity | 0/10 | **≥4/10** | ≥7/10 |

Non-metric DoD:
- ADR-0018 url-map merged (tamd approved)
- llms.txt + llms-full.txt валидны
- Topvisor weekly snapshot работает 8 недель подряд
- 5 авторов с реальными именами + Person schema
- NAP-аудит PASS (после получения реальных contacts от оператора)

---

## US декомпозиция (12 user stories)

### US-0 · Pre-flight: cleanup + creds setup (W1)

- **Owner:** poseo · **Supporting:** оператор (creds), do (`.env`)
- **Deliverables:**
  - ✅ DELETE `specs/EPIC-SEO-OUTRANK/` (done в этом PR)
  - ✅ DELETE `seosite/strategy/`, `seosite/02-keywords/`, `seosite/03-clusters/`, `seosite/05-content-plan/`, `seosite/scripts/` (already gone)
  - ✅ KEEP `seosite/01-competitors/keysso-snapshot-2026-05-06.json`
  - Принять Topvisor token в `.env.production` (operator передаст)
  - Принять Just-Magic creds (operator передаст)
  - NAP placeholder в `Globals.SiteChrome` (`+7 999 000-00-00`, «Москва, МО») с TODO-comment «replace when operator provides real»
- **AC:** креды в `.env`, footer показывает placeholder NAP, dev сервер up

### US-1 · Семантическое ядро 5 направлений × 3 конкурента (W1-W2)

- **Owner:** seo-content · **Supporting:** re, sa-seo, poseo (gate)
- **Deliverables:**
  - Pull Keys.so endpoints `domain_dashboard` + `organic_pages` + `organic_keywords` для liwood / arborist.su / arboristik.ru
  - Wordstat XML дозабор по 5 pillar
  - Just-Magic кластеризация → 4 интент-класса: `lead` / `pricing` / `info` / `local`
  - Output: `seosite/02-keywords/clusters.csv` (≥4 000 unique keys, intent + pillar + target-URL)
  - `seosite/strategy/01-semantic-core.md` (master narrative)
  - `seosite/02-keywords/_decisions.md` (методология, override-list, false-positive correction)
- **AC:**
  - ≥4 000 unique keys after dedup
  - ≥1 000 коммерческих с CPC > 50 ₽ или vis > 5
  - Каждый ключ имеет intent + pillar + target-URL
  - Все 5 pillar покрыты (включая uborka-territorii)
- **Estimate:** 1.5 нед · **Blocks:** US-2..US-7

### US-2 · URL-карта + ADR-0018 (W2)

- **Owner:** sa-seo · **Supporting:** tamd (ADR), seo-tech
- **Deliverables:**
  - `team/adr/ADR-0018-url-map-compete-3.md` — финальная схема (skeleton создан в этом PR, tamd approve в W2)
  - URL-инвентарь `seosite/strategy/02-url-map.json`
  - Redirects collection импорт CSV (если миграция старых slugs)
- **AC:** ADR approved tamd + operator, 0 конфликтов с existing routes, каждый кластер из US-1 имеет ровно одну target-URL
- **Estimate:** 0.5 нед · **Blocks:** US-3..US-9

### US-3 · Технический SEO + нейро-SEO каркас (W2-W3)

- **Owner:** seo-tech · **Supporting:** podev (afterChange hooks), sa-seo
- **Deliverables:**
  - `lib/seo/jsonld.ts` — добавить FAQPage, HowTo, Speakable, расширенный LocalBusiness с `areaServed[]`, Offer, AggregateOffer, Review, BreadcrumbList
  - `lib/seo/citation.ts` (новый) — Citation-ready TL;DR generator (3-предложений в `<aside data-llm-citation>` + Speakable cssSelector)
  - `app/llms-full.txt/route.ts` (новый) — full markdown по llmstxt.org spec
  - `app/llms.txt/route.ts` — расширить разделами Pricing / Cases / Local coverage
  - Payload `afterChange` hooks → `/api/revalidate?tag=...&url=...` → IndexNow ping для Services, ServiceDistricts, Cases, Blog, B2BPages, Authors
  - `robots.ts` — финальный аудит AI-bots discrimination
- **AC:**
  - 100% routes из US-2 имеют canonical + JSON-LD (Playwright snapshot)
  - afterChange любой коллекции → revalidate + IndexNow за <2 сек (smoke)
  - llms.txt + llms-full.txt валидны по llmstxt.org
  - Schema.org validator PASS на pillar / sub / b2b / blog / case
- **Estimate:** 1 нед · **Blocks:** US-4..US-9

### US-4 · Mega-прайс `/uslugi/tseny/` (W4-W5)

- **Owner:** seo-content · **Supporting:** cw, seo-tech, cms, art (UX-таблица §8 brand-guide), podev (route)
- **Deliverables:**
  - Route `app/(marketing)/uslugi/tseny/page.tsx` (статичный + revalidate)
  - Globals.PriceCatalog или Collection `PricingTiers` (DB-driven)
  - 50-80 SKU с диапазонами цен «от-до», unit, pillar-tag
  - 5 поддиректорий `/uslugi/tseny/<pillar>/` для углублённой матрицы
  - JSON-LD `Offer` + `AggregateOffer` per pillar
- **AC:** ≥50 SKU, mobile+desktop AA, lead-form + sticky CTA, Lighthouse SEO ≥95, LCP <2.5s
- **Estimate:** 1.5 нед

### US-5 · Контент-машина `/blog/` 30 статей (W3-W12, rolling)

- **Owner:** cw · **Supporting:** seo-content (брифы), seo-tech (schema), cms (публикация), art (медиа)
- **Deliverables:**
  - 30 article-брифов в `seosite/05-content-plan/blog-briefs/`
  - 30 published Blog-документов (3 шт/нед × 10 недель)
  - Каждая: TL;DR + Faq + MiniCase + RelatedServices + LeadForm
  - 12-15 cases-вставок (новые Case docs) для info-bridge
- **AC:** 30 статей опубликованы, slug-каноничны, ≥1 200 слов, ≥3 H2, FAQ ≥4 вопроса, TL;DR ≤150 слов в первом экране, Author + Person schema, ≥3 internal links per article (1 pillar + 2 info + 1 case)
- **Estimate:** 10 нед rolling

### US-6 · B2B-нормативка `/b2b/<doc-type>/` (W4-W6)

- **Owner:** seo-content · **Supporting:** cw, cms, seo-tech, re (legal references)
- **Deliverables:** 6 B2B-pages в B2BPages collection: `porubochnyi-bilet`, `lesnaya-deklaratsiya`, `akt-obsledovaniya-derevev`, `sro-vypiska-shablony`, `fkko-klassifikatsiya-othodov`, `fitosanitarnyi-sertifikat` + 6 PDF templates в Media с download-tracking
- **AC:** 6 страниц + 6 PDF, ≥800 слов each, JSON-LD LegalService + HowTo, Topvisor топ-20 за 6 нед по ключам `<doc-type> мо`, PDF download event в Я.Метрика
- **Estimate:** 2 нед

### US-7 · Programmatic `<service> × <city>` (W3-W5)

- **Owner:** seo-content · **Supporting:** cms (bulk seed), seo-tech (sitemap), dba (если миграции)
- **Deliverables:**
  - 30-50 МО-городов в `seosite/strategy/07-cities-priority.csv` (priority по wsfreq + население + расстояние)
  - Bulk-seed `scripts/seed-service-districts-compete-3.ts` (Local API Payload)
  - 30-50 × 5 pillar = 150-250 новых ServiceDistrict документов
  - Уникальный intro 200-300 слов на каждую SD, NeighborDistricts блок, MiniCase из Cases
- **AC:** ≥150 новых SD, sitemap pagesInIndex ≥80% от submitted (Я.Вебмастер), 0 thin-content, Topvisor топ-30 для ≥50% URL за 8 нед
- **Estimate:** 2.5 нед

### US-8 · Лид-инфраструктура (W6-W7)

- **Owner:** seo-tech · **Supporting:** podev, cms, art, aemd (events)
- **Deliverables:**
  - Route `/kontakty/` — NAP, карта, мессенджеры (Telegram/MAX), org schema
  - Route `/kalkulyator/foto-smeta/` — форма загрузки 2-3 фото + контакты, лид с медиа в Telegram (re-use lib/leads + lib/telegram + fal-ai upload в Media)
  - Расширение `blocks/LeadForm.ts` — 5 контекстных вариантов: `commercial-pricing`, `commercial-lead`, `info-bridge`, `b2b`, `local`
  - 5 целей в Я.Метрика (form_submit_<variant>) — aemd track
- **AC:** 5 LeadForm-вариантов работают, /kontakty/ топ-10 по «обиход контакты» за 4 нед, /kalkulyator/foto-smeta/ принимает фото, Telegram-нотификация работает, mobile UX AA, формы <60 сек
- **Estimate:** 1.5 нед

### US-9 · Reviews + `/otzyvy/` + локальное SEO (W8, blocked Я.Карты)

- **Owner:** seo-content · **Supporting:** re (Я.Бизнес статус), cw, art, dba (Reviews collection)
- **Deliverables:**
  - Новая Payload Collection `Reviews` (название/город/услуга/рейтинг/текст/дата/источник)
  - Route `/otzyvy/` — агрегатор + Review schema + AggregateRating
  - NAP-аудит JSON `seosite/strategy/09-nap.json` + audit-script
  - LocalBusiness schema с массивом branch-объектов в lib/seo/jsonld.ts
  - Я.Карты track — заблокирован до получения owner-доступа от оператора (sustained)
- **AC:** Reviews collection live, /otzyvy/ ≥10 отзывов, Review + AggregateRating schema, NAP идентичен на 100% страниц (audit-script PASS), local-intent кластер из US-1 ранжируется
- **Estimate:** 2 нед (без Я.Карт track)

### US-10 · Monitoring: Topvisor + Я.Метрика + Keys.so weekly (W7-W12)

- **Owner:** seo-tech · **Supporting:** aemd, da, pa, re
- **Deliverables:**
  - Topvisor проект с ≥2 300 ключей (1 601 baseline + 200 csv + ≥500 новых из US-1)
  - Скрипт `scripts/seo-weekly-snapshot.ts` — pull Keys.so для нашего + 3 конкурентов, save в `seosite/04-monitoring/<date>/`
  - Дашборд `seosite/04-monitoring/dashboard.md` (markdown weekly)
  - 12 Я.Метрика целей (5 lead-variants + 6 PDF-download + 1 calc)
  - Telegram-bot алерт при дроп позиции > 5 пунктов или index-удаление
- **AC:** Topvisor visibility >0 на нашем домене + тренд up к W12, weekly snapshot 8 нед подряд, 12 целей конфигурированы, dashboard обновляется, smoke-alert сработал
- **Estimate:** 1 нед setup + rolling

### US-11 · E-E-A-T: 3-5 авторов + 12 кейсов + СРО (W8-W10)

- **Owner:** seo-content · **Supporting:** cw, cms, art, re, оператор (real-name approval)
- **Deliverables:**
  - 3-5 реальных авторов в Authors collection: фото, bio, sameAs (LinkedIn / VK / Дзен / Telegram), Person schema
  - Расширение `/sro-licenzii/` фактическими реестровыми номерами + страховой полис
  - 12 новых cases с фото before/after (≥4 фото на кейс), привязка автор + service + district
  - Trust-блок в Globals.SiteChrome footer (СРО, страховка, телефон, часы)
- **AC:** ≥3 author-страниц с реальными именами + Person schema, 12 cases с ≥4 фото каждый, /sro-licenzii/ валидируется в Я.Вебмастер E-E-A-T, trust-footer на 100% страниц
- **Estimate:** 2 нед · **Blocked by:** оператор real-name + фото approval

### US-12 · Final EPIC verify + retro (W13-W14)

- **Owner:** poseo · **Supporting:** leadqa, cpo, da
- **Deliverables:**
  - W14 финальный замер 7 AC метрик
  - leadqa отчёт `team/release-notes/leadqa-EPIC-COMPETE-3.md`
  - Retro doc `team/cpo-syncs/2026-XX-XX-epic-compete-3-retro.md`
  - Backlog для phase 2 (Я.Карты, конструктор LP, etc.)
- **AC:** все 7 EPIC AC замерены, retro обсуждён с cpo, follow-up backlog оформлен

---

## Phasing — 12 недель

| Wk | US активные | Milestones |
|---|---|---|
| W1 | US-0, US-1 (start), US-2 (start) | Cleanup PR merged, Topvisor creds, Keys.so pull complete |
| W2 | US-1 (finish), US-2 (finish ADR-0018), US-3 (start) | ADR-0018 approved, semantic core merged |
| W3 | US-3 (finish), US-5 (3 articles), US-7 (cities priority) | IndexNow auto-trigger live, llms-full.txt live |
| W4 | US-4 (start), US-5 (3 articles), US-6 (start: 2 b2b), US-7 (seed first 60 SD) | Mega-прайс черновик, 6 articles |
| W5 | US-4 (finish), US-5 (3 articles), US-6 (3 b2b), US-7 (seed remaining) | `/uslugi/tseny/` live, 9 articles, 5 b2b |
| W6 | US-5 (3 articles), US-6 (finish), US-8 (start) | 12 articles, 6 b2b, /kontakty/ черновик |
| W7 | US-5 (3 articles), US-8 (finish), US-10 (start) | 15 articles, /kalkulyator/foto-smeta/ live, monitoring запущен |
| W8 | US-5 (3 articles), US-9 (start), US-11 (start) | 18 articles, 3 author-pages, /otzyvy/ live |
| W9 | US-5 (3 articles), US-11 (cases batch) | 21 articles, 6 cases |
| W10 | US-5 (3 articles), US-11 (finish) | 24 articles, 12 cases, /sro-licenzii/ updated |
| W11 | US-5 (3 articles), US-9 (finish), US-10 (mid-snapshot) | 27 articles, dashboard W11 |
| W12 | US-5 (finish: 3 articles), US-10 (final) | 30 articles, EPIC DoD замер #1 |
| W13-W14 | US-12 (verify + retro) | 7 AC замерены, retro выпущен |

**Контрольные milestones:**
- **MS-1 (W2):** semantic core + ADR-0018 — go/no-go gate
- **MS-2 (W5):** mega-прайс + первая волна B2B + 60 SD — first IndexNow batch
- **MS-3 (W7):** лид-инфраструктура — гипотеза «трафик → лиды» проверяется
- **MS-4 (W12):** контент-волна закрыта — DoD замер
- **MS-5 (W14):** EPIC retro

---

## Risks + mitigations

| # | Риск | P×I | Mitigation |
|---|---|---|---|
| 1 | Cw не успевает 30 статей × 3/нед | High×High | seo-content + cw двойная команда, AI-draft + редакторский pass, fallback 24 шт |
| 2 | ADR-0018 застревает у tamd | Med×High | poseo escalate cpo через 3 дня |
| 3 | Я.Карты owner-доступа нет → US-9 неполная | Med×Med | Сейчас отложено в backlog, разблокируем как только operator передаст |
| 4 | Конкуренты публикуют ответную волну (arborist.su +19% YoY) | Med×Med | US-10 weekly snapshot → быстрая реакция, whitespace-уникальные кластеры |
| 5 | Real-name authors заблокированы оператором | Low×Med | Brand-pseudonym fallback (метрика #7 ослабнет) |
| 6 | Iron rule local-verify удлиняет каждый PR | Med×Low | +20% estimate, Playwright fixtures для regression |
| 7 | Mega-прайс канибализует pillar traffic | Med×Med | canonical карта в US-2, разные cluster-intent (lead vs pricing) |
| 8 | Just-Magic API нестабилен в момент US-1 | Low×Med | TF-IDF fallback задокументирован, Topvisor cluster API alternative |
| 9 | NAP-замена в проде (placeholder → real) ломает кеш Я.Метрики | Low×Low | revalidate всех страниц после operator передаёт NAP |

---

## Open questions для оператора

1. **Topvisor token** — когда передашь? (US-0 W1 блокирует start US-1)
2. **Just-Magic creds** — когда передашь?
3. **NAP реальный** — телефон + адрес + email для footer + B2B PDF (placeholder используем сейчас, нужны реальные к US-9 W8)
4. **Real-name авторы** — 3-5 человек с фото / bio / sameAs (нужно к US-11 W8). Ты сам предоставишь или интервью с командой?
5. **Я.Бизнес owner** — кто авторизован публиковать карточку организации? (US-9 локальное-SEO часть, отложено до твоего ответа)
6. **B2B PDF templates** — содержимое 6 PDF (порубочный билет образец, лесная декларация, etc.) — оператор пишет / re берёт из открытых источников?
7. **5-й pillar slug подтверждение** — `/uborka-territorii/` или другой вариант? (предполагаю по умолчанию)

---

## Команда

- **Lead:** poseo (orchestrator, autonomous mandate per iron rule #7)
- **SEO team:** sa-seo, seo-content, seo-tech, cw, cms
- **Cross-team:** tamd (ADR-0018), dba (Reviews/PricingTiers collections), re (legal references B2B + Я.Бизнес status), aemd (events), podev (новые routes), do (deploy), leadqa (verify), art (UX Reviews / Pricing table)

---

## Hand-off log

- 2026-05-06 11:54 · poseo: Keys.so refresh для арборист-вертикали (3 домена) → snapshot saved
- 2026-05-06 13:05 · poseo: Phase 1 explore (3 агента parallel) — site code map + Keys.so deep dive + services audit
- 2026-05-06 13:30 · poseo: Phase 2 plan agent — 11 US декомпозиция black-box review
- 2026-05-06 13:55 · poseo → operator: 4 AskUserQuestion answered (uborka-territorii pillar / real-names / topvisor+just-magic creds / clean start)
- 2026-05-06 14:00 · poseo: bootstrap PR — DELETE EPIC-SEO-OUTRANK + CREATE EPIC-SEO-COMPETE-3 intake + ADR-0018 skeleton
- 2026-05-06 14:00 · poseo → tamd: handoff ADR-0018 url-map для review + approve (W2 deadline)
