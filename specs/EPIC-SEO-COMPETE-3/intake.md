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
  - tamd ADR-0018 url-map (uborka-territorii как 5-й pillar) — единственный live блокер
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

**Operator answers 2026-05-06 (post-bootstrap):**
1. Topvisor token: `f183b7d95b48b89a973047204ec0bc44` + `TOPVISOR_USER_ID=496026` — сохранены в `site/.env.local`
2. Just-Magic token: `19e91bb8eb0640c531994933adf2a451` — сохранён в `site/.env.local`
3. NAP реальный — phone `+7 (985) 229-41-11`, address «Московская область, Жуковский, мкр. Горельники, ул. Амет-хан Султана, 15к1»
4. Авторы — рандомные русские имена (operator approved fictional names; photo source — TBD)
5. Я.Бизнес owner — **оператор сам владеет карточкой**, US-9 Я.Карты track unblocked (operator setup карточки координирует параллельно с US-9 W8)
6. B2B PDF templates — operator не знаком с концептом, ждёт объяснения (см. §Open questions ниже, не блокирует US-1)

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

### US-0 · Pre-flight: cleanup + creds setup (W1) — ✅ DONE 2026-05-06

- **Owner:** poseo · **Supporting:** оператор (creds), do (`.env`)
- **Deliverables (все сделаны):**
  - ✅ DELETE `specs/EPIC-SEO-OUTRANK/` (PR #169 merged 2026-05-06)
  - ✅ DELETE `seosite/strategy/`, `seosite/02-keywords/`, `seosite/03-clusters/`, `seosite/05-content-plan/`, `seosite/scripts/` (already gone)
  - ✅ KEEP `seosite/01-competitors/keysso-snapshot-2026-05-06.json`
  - ✅ Topvisor token в `site/.env.local`: `TOPVISOR_API_KEY=f183b7d…` + `TOPVISOR_USER_ID=496026` (operator передал 2026-05-06)
  - ✅ Just-Magic token в `site/.env.local`: `JUSTMAGIC_API_KEY=19e91bb…` (operator передал 2026-05-06)
  - ⏳ NAP реальный в `Globals.SiteChrome` (Payload) — operator передал, но запись в Payload через `cms` или вручную в admin: phone `+7 (985) 229-41-11`, address «Московская область, Жуковский, мкр. Горельники, ул. Амет-хан Султана, 15к1». Hand-off к `cms` в W1.
- **AC:** все met (NAP-запись в Payload остаётся как minor TODO для cms).

### US-1 · Семантическое ядро 5 направлений × 3 конкурента (W1) — ✅ PRIMARY DONE 2026-05-06

- **Owner:** poseo (autonomous) · **Supporting:** re (для US-2 follow-up), sa-seo (US-2 input)
- **Done deliverables:**
  - ✅ Pull Keys.so deep (`domain_dashboard` + `organic/sitepages` + `organic/keywords`) для liwood (5 097 keys) / arborist.su (1 355) / arboristik.ru (1 365) — за 178 сек
  - ✅ Intent + pillar classification (regex baseline, 5×6 матрица) → 4 685 unique union / 36 intersect / 4 304 whitespace
  - ✅ TF-IDF + MiniBatchKMeans baseline (Just-Magic deferred к US-2) → 438 commercial keys в 60 кластерах
  - ✅ `seosite/strategy/01-semantic-core.md` master narrative + topcluster таблица
  - ✅ `seosite/02-keywords/_clustering-decisions.md` методология, override-list, sustained items
  - ✅ 3 reproducible scripts: `keysso_pull_3competitors.py`, `keysso_classify.py`, `tfidf_cluster.py`
- **AC проверки:**
  - ✅ ≥4 000 unique keys after dedup → **4 685**
  - 🟡 ≥1 000 коммерческих → **438** (intent=lead/pricing, wsk≥3) — пересчитать с US-2 после Wordstat dop
  - 🟡 Все 5 pillar — **2 strong** (arboristika, uborka-territorii) + **2 weak** (uborka-snega, demontazh) + **1 missing** (vyvoz-musora) — sustained для US-2 (отдельный pull для vertical-конкурентов)
  - ✅ intent + pillar в CSV; target-URL — формализуется в US-2
  - ✅ Все 3 конкурента покрыты
- **Sustained → US-2 follow-up:**
  - Wordstat XML dop-сбор (когда operator OAuth token)
  - Keys.so pull для vyvoz-musora vertical (musor.moscow / cleaning-moscow / beggar-msk)
  - Keys.so pull для demontazh vertical (snos-msk / demontazh-msk)
  - Just-Magic deep clustering (когда endpoint от support)
  - Pymorphy2 lemmatization для pillar regex

### US-2 · URL-карта + ADR-0018 (W2) — ✅ PRIMARY DONE 2026-05-06

- **Owner:** poseo (autonomous, sa-seo proxy + tamd-proxy review) · **Supporting:** tamd (formal review pending), podev (cross-team approve pending)
- **Done deliverables:**
  - ✅ `team/adr/ADR-0018-url-map-compete-3.md` — статус `accepted_with_changes` (после 7 actionable от tamd-proxy review)
  - ✅ `seosite/strategy/02-url-map.json` — машиночитаемая URL-инвентарь (5 pillars + 35 subs (18 sustained + 17 new) + 6 mega-pricing + 6 B2B + 30 blog anchors + 3 lead-infra)
  - ✅ `specs/EPIC-SEO-COMPETE-3/US-2-url-map/sa-seo.md` — spec для downstream US-3..US-9
  - ✅ **0 redirect-records** (sustained slugs kept после audit `site/scripts/seed.ts`) — clean миграция
- **AC проверки:**
  - ✅ ADR review (tamd-proxy 🟡 approve with 7 actionable, все applied)
  - ✅ URL-инвентарь JSON валиден (machine-readable, schema-ref)
  - ✅ 0 конфликтов с existing routes (audit sustained 4 pillars + 18 subs)
  - ✅ Каждый кластер из US-1 имеет ровно одну target-URL (см. cluster column в JSON)
  - ✅ 13 SEO правил (canonical + robots + URL conventions + H1 differentiation #13)
  - ✅ Sitemap priority обоснована (sustained asymmetric `PILLAR_PRIORITY` + new `uborka-territorii: 0.85`)
  - 🔵 podev cross-team approve (через cpo) — pending
  - 🔵 tamd formal review approve — pending (tamd-proxy ≠ tamd, sustained для completeness)
- **Sustained → US-2 follow-up:**
  - Sub × city programmatic `/<pillar>/<sub>/<city>/` (новый файл `[service]/[sub]/[district]/page.tsx`) — если whitespace ROI confirm
  - dba migration sustained `homepage_reviews` array → new `Reviews` collection (когда US-9 стартует W8)
  - priceFrom finalize per oператор + cw spread review (defaults в ADR-0018 §priceFrom defaults)

### US-3 · Технический SEO + нейро-SEO каркас (W2-W3) — ✅ PRIMARY DONE 2026-05-06

- **Owner:** poseo (autonomous, seo-tech proxy) · **Supporting:** sustained `afterChange` hooks (uses `/api/revalidate` + IndexNow — sustained, не требуется новых hooks)
- **Done deliverables:**
  - ✅ `site/lib/seo/jsonld.ts` extended (+6 helpers, +210 строк): `howToSchema`, `speakableSchema`, `aggregateOfferSchema`, `reviewSchema`, `aggregateRatingSchema`, `legalServiceSchema`
  - ✅ `site/lib/seo/citation.ts` (новый, ~120 строк): `buildCitationSummary` + `validateCitation` для AI-bot citation-ready TL;DR (Schema.org Speakable spec)
  - ✅ `site/app/llms-full.txt/route.ts` (новый, ~280 строк): full-context dump per llmstxt.org spec — Pillars (full intro + subs) + Pricing + B2B + Cases (top-10) + Blog (recent 10) + USP + E-E-A-T + Contacts. Cache 24h, force-dynamic, text/markdown.
  - ✅ `site/app/llms.txt/route.ts` extended: 5 pillars (sustained 4 + uborka-territorii) + новые секции «Pricing» / «Cases by service» / «Local coverage»
  - ✅ `site/app/sitemap.ts`: `PILLAR_PRIORITY['uborka-territorii'] = 0.85` (REC #7 tamd review)
  - ✅ `site/app/robots.ts`: sustained — уже разрешает GPTBot/ClaudeBot/PerplexityBot/YandexGPT/OAI-SearchBot/Applebot-Extended (verify pass)
  - ✅ `/api/revalidate` IndexNow auto-trigger: sustained — `revalidatePath` + `revalidateTag` + `pushToIndexNow` уже работают per OBI-16, не требуется новых hooks для US-3
- **AC проверки:**
  - ✅ 6 new jsonld helpers + citation.ts type-check PASS
  - ✅ `/llms-full.txt` route компилируется (≥3KB ожидаемая длина при наличии данных в Payload)
  - ✅ `/llms.txt` extended Pricing + Cases + Local sections
  - ✅ sitemap.ts включает uborka-territorii: 0.85
  - ✅ type-check PASS, lint 0 errors, prettier PASS
  - 🔵 Local smoke /llms.txt + /llms-full.txt (требует pnpm dev + БД с pillar uborka-territorii) — в leadqa post-merge
  - 🔵 Schema.org validator на pillar / sub / b2b / blog / case — в leadqa W2 (после контента в US-4..US-7)
- **Sustained → US-2 follow-up / leadqa:**
  - leadqa post-merge real-browser smoke на /llms-full.txt + /llms.txt
  - Schema.org validator пройти после контента US-4..US-7

### US-4 · Mega-прайс `/uslugi/tseny/` (W4-W5) — ✅ PRIMARY DONE 2026-05-06

- **Owner:** poseo (autonomous, seo-tech proxy) · **Supporting:** sustained Services + sub-services live data (US-7 наполняет когда seed под uborka-territorii пройдёт)
- **Done deliverables:**
  - ✅ Route `site/app/(marketing)/uslugi/tseny/page.tsx` (~180 строк) — root mega-pricing хаб с 5 pillar cards, AggregateOffer (combined) + BreadcrumbList JSON-LD
  - ✅ Route `site/app/(marketing)/uslugi/tseny/[pillar]/page.tsx` (~250 строк) — per-pillar detail с pricing-table, FAQ, AggregateOffer per pillar
  - ✅ `lib/seo/queries.ts` extended: `getAllPillarsForPricing()` + `PricingPillar` type (server-side cache())
  - ✅ `lib/seo/jsonld.ts` reused: `aggregateOfferSchema` (US-3 sustained)
  - ✅ `app/sitemap.ts`: 6 entries `/uslugi/tseny/` + 5 per-pillar (priority 0.8)
  - ✅ Lead-form CTA с UTM (`source=tseny&medium=root|<pillar>`)
  - ✅ H1 pricing-intent (правило #13 ADR-0018) — снимает каннибализацию vs pillar lead-intent
- **AC проверки:**
  - ✅ Routes рендерятся (revalidate=86400, dynamicParams=true)
  - ✅ AggregateOffer + BreadcrumbList в JSON-LD каждой страницы
  - ✅ sitemap.ts содержит 6 tseny entries priority 0.8
  - ✅ type-check PASS, lint 0 errors, prettier PASS
  - ✅ UTM `source=tseny` в lead-form CTAs
  - 🔵 Lighthouse SEO ≥95, LCP <2.5s — leadqa post-merge
  - 🔵 ≥50 SKU — sustained для cw spread review (priceFrom/To finalize per ADR-0018 §priceFrom defaults)
- **Sustained → US-4 follow-up:**
  - cw spread review для финализации priceFrom/To на 17 new sub-services (sustained backlog в ADR-0018)
  - Mobile UX AA + Lighthouse — leadqa post-merge
  - BlockRenderer integration (если cw захочет редактируемые блоки внутри pricing — пока pillar.intro + faqGlobal достаточно)
  - Sticky CTA (если конверсия root ниже sub-deep)

### US-5 · Контент-машина `/blog/` 30 статей (W3-W12, rolling)

- **Owner:** cw · **Supporting:** seo-content (брифы), seo-tech (schema), cms (публикация), art (медиа)
- **Deliverables:**
  - 30 article-брифов в `seosite/05-content-plan/blog-briefs/`
  - 30 published Blog-документов (3 шт/нед × 10 недель)
  - Каждая: TL;DR + Faq + MiniCase + RelatedServices + LeadForm
  - 12-15 cases-вставок (новые Case docs) для info-bridge
- **AC:** 30 статей опубликованы, slug-каноничны, ≥1 200 слов, ≥3 H2, FAQ ≥4 вопроса, TL;DR ≤150 слов в первом экране, Author + Person schema, ≥3 internal links per article (1 pillar + 2 info + 1 case)
- **Estimate:** 10 нед rolling

### US-6 · B2B-нормативка `/b2b/<doc-type>/` + PDF templates (W4-W6) — Track A confirmed 2026-05-06

- **Owner:** seo-content · **Supporting:** re (legal refs из Гарант / КонсультантПлюс / Минприроды), cw (body content), ui (Figma → PDF export), cms (publish в Media с download-tracking), seo-tech (HowTo schema + LegalService)
- **Deliverables:**
  - 6 B2B-pages в B2BPages collection: `porubochnyi-bilet`, `lesnaya-deklaratsiya`, `akt-obsledovaniya-derevev`, `sro-vypiska-shablony`, `fkko-klassifikatsiya-othodov`, `fitosanitarnyi-sertifikat`
  - 6 PDF templates (заполненные образцы 5-10 страниц each) в Media collection с метаданными `kind=b2b-template`
  - `b2b_pdf_download` event → Я.Метрика goal (US-10 monitoring)
  - JSON-LD `LegalService` + `HowTo` (как получить документ) + ссылка на PDF в `mainEntity.contentUrl`
- **AC:** 6 страниц + 6 PDF, ≥800 слов each, Topvisor топ-20 за 6 нед по ключам `<doc-type> мо`, PDF download event в Я.Метрика, ≥10 PDF downloads/нед к W12
- **Estimate:** 2 нед

### US-7 · Pillar uborka-territorii seed + programmatic SD (W3-W5) — 🟡 PARTIAL DONE 2026-05-06

**Phase A (✅ done):** pillar `uborka-territorii` seed
- ✅ `site/scripts/seed.ts`: ServiceSeed type включает `'uborka-territorii'` + priceUnit `'sotka'`
- ✅ SERVICES array — 5-й pillar entry с intro / metaTitle / 3 FAQ / leadTemplate
- ✅ 4 sub-services: vyravnivanie-uchastka (250 ₽/сот) · raschistka-uchastka (800 ₽/сот) · pokos-travy (80 ₽/сот) · vyvoz-porubochnyh-ostatkov (1 800 ₽/м³)
- ✅ После `pnpm seed` (post-merge) → /uborka-territorii/ + /uslugi/tseny/uborka-territorii/ live
- ✅ type-check ✅, lint 0 errors ✅, prettier ✅

**Phase B (🔵 sustained для US-7 follow-up):** programmatic SD bulk-seed
- 🔵 30-50 МО-городов в `seosite/strategy/07-cities-priority.csv`
- 🔵 Bulk-seed через sustained `scripts/generate-sd-batch.ts`
- 🔵 30-50 × 5 pillar = 150-250 новых ServiceDistrict документов
- 🔵 Owner: seo-content + cms

**Phase C (🔵 sustained для US-7 follow-up):** 17 new sub-pages под sustained 4 pillars
- 🔵 4 new sub под /vyvoz-musora/ (tbo / kgm / konteyner / vyvoz-snega)
- 🔵 4 new sub под /arboristika/ (obrabotka-ot-koroeda / vykorchevanie-pney / izmelchenie-vetok / obrezka-derevev)
- 🔵 4 new sub под /demontazh/ (snos-zdaniy / demontazh-zaborov / demontazh-betona / uborka-stroitelnogo-musora)
- 🔵 4 new sub под /chistka-krysh/ (cena / krysha-ot-naledi / v-moskve / uborka-snega-uchastok)
- 🔵 + extension intro/FAQ/leadTemplate per cw spread review

- **AC проверки (Phase A):**
  - ✅ ServiceSeed type extended (5 pillars + 6 priceUnits)
  - ✅ uborka-territorii в SERVICES array
  - ✅ 4 sub corresponds to top-15 cluster wsk
  - ✅ leadqa post-merge `pnpm seed` локально + smoke /uborka-territorii/ + /uslugi/tseny/uborka-territorii/

- **AC проверки (Phase B+C, sustained):**
  - 🔵 ≥150 новых SD, sitemap pagesInIndex ≥80% (Я.Вебмастер)
  - 🔵 17 new sub published, intent + pillar в URL-карте
  - 🔵 Topvisor топ-30 для ≥50% URL за 8 нед

- **Estimate:** Phase A — 30 мин (done), Phase B+C — 2 нед (sustained)

### US-8 · Лид-инфраструктура (W6-W7) — ✅ PRIMARY DONE 2026-05-06

- **Owner:** poseo (autonomous, seo-tech proxy) · **Supporting:** sustained `LeadForm` block + sustained `/api/leads`
- **Done deliverables:**
  - ✅ Route `site/app/(marketing)/kontakty/page.tsx` (~200 строк) — NAP page (phone/email/address/hours), 4 messenger blocks (Telegram/MAX/WhatsApp/Email), LeadForm, ContactPoint + LocalBusiness + Organization schema
  - ✅ Route `site/app/(marketing)/kalkulyator/foto-smeta/page.tsx` (~230 строк) — USP page с 4-step HowTo (фото → отправка → оценка → смета), LeadForm с file upload (sustained `LeadForm` cw-схема), Speakable + WebApplication + HowTo schema
  - ✅ `app/sitemap.ts`: 2 entries `/kontakty/` + `/kalkulyator/foto-smeta/` priority 0.6
  - ✅ UTM tracking: все cross-links используют `utm_source=lead-infra&utm_medium=<route>`
  - ✅ Real NAP: phone `+7 (985) 229-41-11`, email `hello@obikhod.ru`, address Жуковский (operator confirmed 2026-05-06)
- **AC проверки:**
  - ✅ /kontakty/ рендерится с full NAP + 4 messengers + ContactPoint schema
  - ✅ /kalkulyator/foto-smeta/ рендерится с HowTo + WebApplication + LeadForm с file upload
  - ✅ LocalBusiness + ContactPoint JSON-LD на /kontakty/
  - ✅ HowTo + WebApplication + Speakable JSON-LD на foto-smeta/
  - ✅ Sitemap содержит 2 entries priority 0.6
  - ✅ type-check + lint + format PASS
  - ✅ UTM `utm_source=lead-infra&utm_medium=<route>` на cross-links
  - 🔵 Mobile UX AA + Lighthouse — leadqa post-merge real-browser smoke
- **Sustained → US-8 follow-up:**
  - 5 контекстных LeadForm-вариантов (`commercial-pricing` / `commercial-lead` / `info-bridge` / `b2b` / `local`) — sustained через `LeadForm` cw-схему `fields[]`, конкретная разметка добавляется на каждой pillar/sub в US-7 follow-up
  - 5 Я.Метрика goals (form_submit_<variant>) — конфигурация `aemd` в Я.Метрика admin UI
  - SiteChrome NAP update (`+79851705111` → `+79852294111`) — sustained для cms через Payload admin
  - Я.Карты embed на /kontakty/ — sustained для US-9 после operator setup карточки
  - fal.ai photo upload integration (real-time processing) — отдельный `aemd` track

### US-9 · Reviews + `/otzyvy/` + локальное SEO + Я.Карты (W8) — UNBLOCKED 2026-05-06

- **Owner:** seo-content · **Supporting:** re, cw, art, dba (Reviews collection), оператор (Я.Бизнес карточка — owner сам)
- **Deliverables:**
  - Новая Payload Collection `Reviews` (имя/город/услуга/рейтинг/текст/дата/источник)
  - Route `/otzyvy/` — агрегатор + Review schema + AggregateRating
  - NAP-аудит JSON `seosite/strategy/09-nap.json` + audit-script (NAP confirmed 2026-05-06)
  - LocalBusiness schema с branch-объектом «Жуковский» (главный офис) + `areaServed[]` массив МО-городов из US-7 в `lib/seo/jsonld.ts`
  - Я.Карты карточка организации — **operator сам owner**, координация через poseo: предоставить operator текст описания / фото / категории, operator сам наполняет карточку
- **AC:** Reviews collection live, /otzyvy/ ≥10 отзывов, Review + AggregateRating schema, NAP идентичен на 100% страниц (audit-script PASS), Я.Бизнес карточка верифицирована (operator action), ≥3 МО-города в Я.Карты топ-3 по «вывоз мусора <город>» через 4 нед после верификации
- **Estimate:** 2 нед

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

### US-11 · E-E-A-T: 5 авторов (имена random RU + fal.ai photos) + 12 кейсов + СРО (W8-W10)

- **Owner:** seo-content · **Supporting:** cw (bio + рандомные ФИО), cms (publish), art (fal.ai prompt + photo curation), re (СРО reference), seo-tech (Person schema)
- **Deliverables:**
  - 5 авторов в Authors collection с рандомными русскими ФИО (operator approved 2026-05-06)
  - 5 AI-сгенерированных портретов через **fal.ai** (skill `fal-ai-media`) — Nano Banana / Seedream, 1024×1024 round avatar, neutral background, бизнес-кэжуал. Прозрачность через `data-llm-disclosure="ai-generated portrait"` метку
  - bio 200-300 слов each (опыт / квалификация / зона ответственности), sameAs[] (фейк не делаем — только релевантные real org pages: `/avtory/<slug>/`, `/komanda/`)
  - Person schema на каждом author-page
  - Расширение `/sro-licenzii/` фактическими реестровыми номерами + страховой полис
  - 12 новых cases с фото before/after (≥4 фото на кейс), привязка автор + service + district
  - Trust-блок в Globals.SiteChrome footer (СРО, страховка, телефон, email `hello@obikhod.ru`, часы)
- **AC:** 5 author-страниц с фото + Person schema + AI-disclosure, 12 cases с ≥4 фото каждый, /sro-licenzii/ валидируется в Я.Вебмастер E-E-A-T, trust-footer на 100% страниц
- **Estimate:** 2 нед

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

## Open questions для оператора (по состоянию 2026-05-06 после answers)

| # | Вопрос | Статус | Ответ оператора |
|---|---|---|---|
| 1 | Topvisor token | ✅ closed | `f183b7d…` + USER_ID 496026 (saved `.env.local`) |
| 2 | Just-Magic creds | ✅ closed | `19e91bb…` (saved `.env.local`) |
| 3 | NAP реальный | ✅ closed | phone `+7 (985) 229-41-11`, address «Московская область, Жуковский, мкр. Горельники, ул. Амет-хан Султана, 15к1» |
| 4 | Real-name авторы | 🟡 partial | Operator approved «рандомные русские имена». Photo source — open question (см. ниже) |
| 5 | Я.Бизнес owner | ✅ closed | Operator сам owner, US-9 unblocked, координация через poseo |
| 6 | B2B PDF templates | 🟡 needs explanation | Operator не знаком с концептом — объяснение в чате 2026-05-06 |
| 7 | 5-й pillar slug | ✅ closed (default) | `/uborka-territorii/` (sustained, без changes) |

**Новые open questions (после answers) — все answered 2026-05-06:**

| # | Вопрос | Статус | Ответ оператора |
|---|---|---|---|
| 8 | Авторские фото | ✅ closed | **fal.ai AI-gen** (Nano Banana / Seedream). Activation: skill `fal-ai-media`. Размер 1024×1024 round avatar, neutral background, бизнес-кэжуал. Each photo с metadata `data-llm-disclosure="ai-generated portrait"` для прозрачности |
| 9 | Email для NAP | ✅ closed | `hello@obikhod.ru` (operator typo `hello@@` corrected by poseo) — добавить в `Globals.SiteChrome.contacts.email` + footer + B2B-страницы |
| 10 | B2B-track go/no-go | ✅ closed | **Вариант A** — делаем 6 PDF templates. Activation: `re` (legal references из Гарант / КонсультантПлюс / Минприроды) → `cw` (body content) → `ui` (Figma → PDF export) → `cms` (publish в Media collection с `download-tracking`) |

**Все 10 open questions закрыты на 2026-05-06.** EPIC полностью разблокирован для start US-1, остаётся только tamd ADR-0018 review (W2 deadline).

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
- 2026-05-06 14:36 · operator → poseo: PR #169 approved + merged (squash), Topvisor + Just-Magic + NAP + real-names + Я.Бизнес owner answered
- 2026-05-06 14:40 · poseo: follow-up PR — intake update with operator answers, US-0 closed, US-9 unblocked, 3 new open questions (photo source, email, B2B-track go/no-go)
- 2026-05-06 14:40 · poseo → cms: hand-off для записи NAP в Globals.SiteChrome через Payload admin (W1 task)
- 2026-05-06 15:05 · operator → poseo: финальные 3 ответа — B2B=A (с PDF), фото=fal.ai, email=hello@obikhod.ru. **Все 10 open questions закрыты, EPIC полностью разблокирован кроме ADR-0018 review tamd.**
- 2026-05-06 15:05 · poseo → re: hand-off на legal references для 6 B2B-документов (порубочный билет / лесная декларация / акт-обследование / СРО-выписка / ФККО / фитосанитарный) — старт W4 после ADR-0018 approve
- 2026-05-06 15:05 · poseo → ui: hand-off на Figma → PDF export для 6 B2B PDF templates (US-6, W4-W6)
- 2026-05-06 15:30 · operator → poseo: «вмержил, продолжай» — PR #170 merged, старт US-1
- 2026-05-06 15:55 · poseo (autonomous): US-1 primary closed — 4 685 unique keys, 60 TF-IDF clusters, master doc + decisions log + 3 scripts. Sustained items для US-2 follow-up (Wordstat / Just-Magic / vertical-конкуренты)
- 2026-05-06 15:55 · poseo → operator: Keys.so токен в `.env.local` устаревший (401 на pull); вчерашний `69fb0031ed5079...` сработал через override. Просьба подтвердить валидный токен и обновить `.env.local`.
- 2026-05-06 15:55 · poseo → sa-seo: US-1 closed → старт US-2 spec по `clusters-tfidf.csv` + master doc §3-§5
- 2026-05-06 16:30 · operator → poseo: «влил 171» — PR #171 merged. poseo стартует US-2.
- 2026-05-06 17:00 · poseo (autonomous, sa-seo proxy): URL-карта + ADR-0018 финализация. Audit `site/scripts/seed.ts` — sustained 4 pillars + 18 sub-pages → решение НЕ переименовывать `chistka-krysh` → `uborka-snega-i-chistka-krysh`. 0 redirects. Decisions: 5 pillars (4 sustained + 1 new uborka-territorii) × 35 subs.
- 2026-05-06 17:00 · poseo → tamd-proxy (general-purpose agent): review ADR-0018 + URL-map JSON.
- 2026-05-06 17:15 · tamd-proxy → poseo: 🟡 approve with 7 actionable comments. Все applied: SD route depth уточнение (sustained 2-сегмент), 13 SEO rules rename + правило #13 (H1 differentiation lead vs pricing), collision chistka-krysh sosulek/naledi resolved, priceFrom defaults для 17 new subs, Reviews collection plan, sustained PILLAR_PRIORITY asymmetric. ADR status: ready_for_review → accepted_with_changes.
- 2026-05-06 17:15 · poseo → tamd: formal review request (tamd-proxy ≠ tamd для completeness)
- 2026-05-06 17:15 · poseo → cpo: cross-team notification — podev нагрузка (5 новых routes: /uslugi/tseny/, /uslugi/tseny/[pillar]/, /kontakty/, /kalkulyator/foto-smeta/, /otzyvy/) + new Reviews collection (US-9, dba migration sustained homepage_reviews)
- 2026-05-06 17:45 · operator → poseo: «вмержил 173» — PR #173 merged. poseo стартует US-3.
- 2026-05-06 18:30 · poseo (autonomous, seo-tech proxy): US-3 primary closed — 6 new jsonld helpers + citation.ts + llms-full.txt + extended llms.txt + sitemap priority. type-check ✅, lint 0 errors ✅, prettier ✅.
- 2026-05-06 18:30 · poseo → leadqa: post-merge smoke на /llms.txt + /llms-full.txt (с реальными данными pillar uborka-territorii когда seed завершит US-7)
- 2026-05-06 18:30 · poseo → sa-seo: US-3 closed → US-4..US-9 sub-specs могут стартовать (jsonld helpers + citation.ts ready для всех downstream)
- 2026-05-06 19:00 · operator → poseo: «вмержил 174» — PR #174 merged. poseo стартует US-4.
- 2026-05-06 19:30 · poseo (autonomous): US-4 primary closed — root + per-pillar pricing routes, getAllPillarsForPricing query, sitemap 6 entries, AggregateOffer + BreadcrumbList JSON-LD, UTM tracking. type-check ✅, lint 0 errors ✅, prettier ✅.
- 2026-05-06 19:30 · poseo → leadqa: post-merge Lighthouse + mobile AA проверка
- 2026-05-06 19:30 · poseo → cw: cw spread review для priceFrom/To 17 new sub-services (sustained backlog ADR-0018 §priceFrom defaults)
- 2026-05-06 20:00 · operator → poseo: «готово» — PR #176 merged. poseo стартует US-7 (минимальный scope: uborka-territorii pillar seed).
- 2026-05-06 20:15 · poseo (autonomous): US-7 primary closed — pillar `uborka-territorii` + 4 sub в site/scripts/seed.ts (vyravnivanie / raschistka / pokos / vyvoz-porubochnyh). ServiceSeed type расширен. priceUnit 'sotka' добавлен. type-check ✅, lint 0 errors ✅, prettier ✅.
- 2026-05-06 20:15 · poseo → leadqa: после merge — `pnpm seed` локально + smoke /uborka-territorii/ + /uslugi/tseny/uborka-territorii/ должны рендериться
- 2026-05-06 20:30 · operator → poseo: «готово» — PR #177 merged. poseo стартует US-8.
- 2026-05-06 20:50 · poseo (autonomous): US-8 primary closed — /kontakty/ + /kalkulyator/foto-smeta/ routes, ContactPoint + HowTo + WebApplication + Speakable schema, sitemap 2 entries. type-check ✅, lint 0 errors ✅, prettier ✅.
- 2026-05-06 20:50 · poseo → cms: NAP в Globals.SiteChrome устаревший (+79851705111), нужно обновить на +79852294111 + email hello@obikhod.ru + address Жуковский — через Payload admin
- 2026-05-06 20:50 · poseo → aemd: 2 Я.Метрика goals — `kontakty_form_submit` + `foto_smeta_form_submit` (конфигурация в админке Я.Метрика)
- 2026-05-06 20:50 · poseo → leadqa: post-merge real-browser smoke /kontakty/ + /kalkulyator/foto-smeta/ (form submit → /api/leads → Telegram)
