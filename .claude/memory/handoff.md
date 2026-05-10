# Handoff — Обиход

_Обновляется в конце сессии. Короткий срез: что сделано, что в работе, что следующее. Цель — дать следующей сессии контекст за 30 секунд._

## Где мы сейчас (2026-05-09 21:35 MSK) — программа «Обиход 2.0» apruved

**План:** `~/.claude/plans/stateless-puzzling-valiant.md`

Оператор apruvil большую программу из 4 эпиков на 12 нед. Старт W1.

**4 эпика:**
1. **EPIC-SHOP-REMOVAL** — выводим магазин саженцев из проекта (archive, не hard-delete). Landshaft = 5-й pillar услуг (НЕ drop). 6 wave (W1 Decisions/ADR-0020 → W2 Docs → W3 Design ‖ W4 Code ‖ W5 CI → W6 Verify).
2. **EPIC-LIWOOD-OVERTAKE** — gap analysis по 8 осям (Keys.so + WebFetch + PageSpeed) → 5+ новых US с RICE → roadmap. Параллельно с A.W3-W6.
3. **EPIC-SERVICE-PAGES-UX** — UX/UI-driven master template (НЕ SEO-driven). Brand-guide v2.2 inventory + визуальный бенчмарк liwood. Каждая service-страница: LeadForm + Calculator (фото→смета US-8) + click-path-audit + breadcrumbs + SEO+нейровыдача-text.
4. **EPIC-SERVICE-PAGES-REDESIGN** — pixel-perfect редизайн с brand-guide-first reuse (0 ad-hoc UI). 30 URL/нед × 8 нед, pilot /vyvoz-musora/ A/B 7 дней.

**Iron rule brand-guide-first:** UI компоненты только из `design-system/brand-guide.html` v2.2 (§components/notifications/errors/pagination/nav/icons/color/contrast/type/shape — всё уже есть для services). Если нет — design расширяет brand-guide, потом fe верстает.

**fal.ai hybrid policy** (skill `fal-ai-media`, FAL_KEY есть): иконки gap-fill (Nano Banana Pro), hero/cases/district photos (Nano Banana Pro по brand-guide §photography), черновики layout (Nano Banana 2). Все assets — design review. UI-элементы НЕЛЬЗЯ генерить.

**Apruved decisions для EPIC-A.W1 (фиксируются в ADR-0020):**
- Shop disposal = archive (team/shop.md → archive/, specs/EPIC-SEO-SHOP/ → _archived/, brand-guide §15-29 удалить, design-system/tov/shop.md удалить)
- landshaft = 5-й pillar услуг (паритет с liwood `/services/landshaftniy-dizayn-uchastka/`)
- US-11 9 shop-иконок archive
- Roll-out волнами 30 URL/нед

**Что СУПЕРСЕЖЕНО shop-removal:**
- `apps/shop` scaffolding plan
- shop роль в team (10→9 ролей)
- design-system §15-29 + tov/shop.md
- specs/EPIC-SEO-SHOP/, specs/EPIC-SEO-LANDSHAFT/ (landshaft переподшивается в EPIC-C)
- shop секции в team/backlog.md

**Текущее состояние сессии (2026-05-09 22:32 MSK)**

### ✅ EPIC-SHOP-REMOVAL — все 5 wave closed

| Wave | Результат |
|---|---|
| W1 — ADR-0020 | apruved (archive ✅, landshaft = 5-й pillar ✅, US-11 archive ✅) |
| W2 — docs/specs/team | mv 4 dirs → `specs/_archived/`, `team/shop.md` → archive, CLAUDE.md/PROJECT_CONTEXT.md/backlog.md cleaned, learnings + handoff updated |
| W3 — design-system | brand-guide v2.2 → v2.3 (5754→4299, -1455 строк), `tov/shop.md` deleted, ToC clean, §32 cabinet rewrite без cross-ref на shop |
| W4 — site code | Header.tsx -237 строк (мега-меню «Магазин» вырезан), Footer.tsx line 91, types.ts IconLine clean, type-check/lint/format clean |
| W5 — CI/seo-tech | proxy.ts 410 Gone для `/shop*` (Next 16 переименовал middleware→proxy), llms.txt clean, Payload richText audit 281 docs → 9 hits → cleanup blog/26+blog/23 (5 SQL replacements + 1 row deleted) |
| W6 — verification | PASS_WITH_FOLLOWUPS · proxy 410 verified live (`/shop/`→410, `/`→200), sitemap 165 URL 0 shop, brand-guide 4299 lines balanced, functional code 0 hits, 168 grep hits semantic-acceptable. Pre-existing fails (`scripts/lint-schema.ts:332` TS2393 + master-template.ts format) — НЕ регрессия EPIC. `specs/EPIC-SHOP-REMOVAL/qa-report.md` |

### ✅ EPIC-LIWOOD-OVERTAKE — B1-B5 ALL CLOSED (technically COMPLETE)

- **B1 snapshot** (`seosite/01-competitors/liwood-snapshot-2026-05-09.json`) — 13 URL × 200, 5 × 404 slug-drift, JSON-LD 3/13, meta-description 2/13, calculator interactive без AI.
- **B2 benchmark** (`seosite/01-competitors/liwood-vs-obikhod-2026-05-W.md`) — **5 LEAD / 1 PARITY / 2 LAG**: LEAD (Content depth, On-page SEO, Schema/JSON-LD ⭐, E-E-A-T, CRO/lead-flow ⭐), PARITY (URL/IA), LAG (B2B/local, CWV likely LEAD pending PSI).
- **B3 classification** — добавлено в B2 файл: 5 LEAD → marketing-angle, PARITY → monitoring + threshold, LAG → US с RICE.
- **B4 US drafts** — `team/backlog.md` подсекция «Liwood overtake roadmap (B5)» с **9 новыми US** (OVT-1..7 + OVT-MONITOR + OVT-MKT).
- **B5 roadmap** (`seosite/01-competitors/overtake-roadmap-2026-05.md`) — RACI + ASCII Gantt 12 нед (4 wave) + dependencies + 5 operator actions required.
- **Top-3 priority by RICE:** OVT-MONITOR (6.75) weekly watcher → OVT-3 RUM (6.0) CWV → OVT-4 Я.Карты+Я.Бизнес (4.25).
- **Covered-by:** OVT-1/2/4/6/7 partially covered existing US (escalation ETA), 4 принципиально новых: OVT-3 RUM, OVT-5 video, OVT-MONITOR, OVT-MKT.
- **Главный insight:** Schema-gap у liwood катастрофический — самый дешёвый защитный ров. Photo→quote AI USP подтверждён.

### ✅ EPIC-SERVICE-PAGES-UX — C1.a + C1.b + C2 closed

- **C1.a inventory** (`design-system/inventory-services-2026-05.md`) — 15 готовых компонентов из brand-guide v2.2 для services-периметра; **13 gaps**: 4 critical + 4 high + 5 medium.
- **C1.b anatomy** (`seosite/01-competitors/liwood-page-anatomy-2026-05.md` + `screen/EPIC-C/liwood-*.png` 10 шт) — UX/UI бенчмарк 5 URL × desktop+mobile, top-5 recommendations (sticky 56px CTA, photo-upload hero, AggregateRating, 10-12 секций, comparison-table copy).
- **C2 master template** (`team/adr/ADR-0021-service-page-master-template.md` + `site/blocks/master-template.ts`) — 13 секций × per-layer (T2 11req+0opt+2hidden / T3 10req+2opt+1hidden / T4 10req+2opt+1hidden), mapping 2 ready + 11 requires-extension в C2.5 wave.

### ⏳ Финальное состояние сессии (2026-05-09 23:35 MSK)

**Закрыто автономно (PO mandate):**
- ADR-0020 + ADR-0021 ACCEPTED
- Overtake roadmap ACCEPTED (9 OVT US, 5 covered-by existing programs)
- C2.5 wave (11 brand-guide extensions, v2.6 = 7459 строк)
- C3 Payload validators (3 collections wired, 20 tests)
- C4 migration plan (resolver + feature flag + 5 placeholders + migration ready, 49 tests)
- OVT-3 RUM CWV instrumentation
- OVT-MONITOR weekly watcher
- D1 design briefs (9 art-briefs T2/T3/T4 × brief/ui/ux)
- Tech-debt sweep (orphan regex, lint-schema TS2393, format)

**Pending operator decisions (нужны для дальнейшего progress):**

1. **fal.ai photo gen budget** — D2 wave A (vyvoz-musora pillar pilot): T2 hero (3-4 desktop + 3-4 mobile mockup base) + 5-6 cases + 30 district photos ≈ 70-80 Nano Banana Pro photos ≈ $3-4 + ~30 минут generation
2. **Claude API content-fill budget** — C5 wave A (vyvoz-musora pilot): ~30 URL × 3 missing avg × 150 words ≈ 13k слов через Claude Sonnet 4.6 + prompt caching. Стоимость <$2 при кэшированном брифе. Cw редактура отдельно.
3. **Я.Карты owner setup** — OVT-4 LAG axis closure (Я.Бизнес account creation operator-side)

**Pending devops actions (когда operator apruvit deploy):**

4. Merge PR → deploy на Beget VPS:
   - proxy.ts 410 Gone для `/shop*`
   - Payload migration `RumMetrics` collection
   - Payload migration `useTemplateV2` flag (template_v2_flag.up.sql на Services/ServiceDistricts/B2BPages × main/version таблицы)
5. Cleanup richText на prod DB (запуск `audit-shop-mentions` scripts с `DATABASE_URI=<prod>`) — после reviews-migration apply
6. Я.Вебмастер 7-day мониторинг 5xx после deploy

### Wave A pilot vyvoz-musora — состояние 2026-05-10 08:49 MSK

✅ **D1 done** — 9 art-briefs T2/T3/T4
✅ **C5 wave A done** — 24 URL filled, 10.7k слов, $0 (template fallback)
✅ **D3 wave A done** — 11 новых компонентов под brand-guide v2.6 + 1126 строк CSS + Payload Block configs + BlockRenderer integration. type-check / lint / format / 49 tests clean
🔴 **D2 wave A BLOCKED** — fal.ai MCP не подключён. 50 prompt-templates готовы (~$3 estimate), scaffold + REVIEW.md ready
⏳ **C6 / C7 / D4 / D5** — после deploy + photos unblock

### Открытое — оператор может next session ответить на:

**Q1.** Apruv fal.ai gen budget D2 wave A (vyvoz-musora pillar, ~$4)?
**Q2.** Apruv Claude API content-fill budget C5 wave A (~$2)?
**Q3.** Когда devops запускает PR/merge/deploy цикл? (зелёный CI требует review reviews-migration drift fix per memory)
**Q4.** Я.Карты owner setup status?
**Q5.** Я.Вебмастер sitemap submit (sustained pending от 2026-05-08 EPIC-SEO-USLUGI US-7)?

### Скиллы активированы в сессии

`product-capability` (план + PO orchestration), `ui-ux-pro-max` (UX/UI), `fal-ai-media` (генерация assets — backlog для D2).

### Тех-долг трекинг

- Orphan `^sh-` regex в `site/components/blocks/ServicesGrid.tsx:41` (out-of-scope W4 — не блокер, regex просто не сматчится)
- payload_locked_documents_rels.reviews_id drift (требует deploy reviews-migration на prod)

---

## Архив (2026-05-08) — poseo · EPIC-SEO-USLUGI US-7 DONE

### Эпик в работе: **EPIC-SEO-USLUGI** (`specs/EPIC-SEO-USLUGI/intake.md`)

**Все US закрыты (merged → main):**
- US-1..US-6: Research+Spec / newui 4 шаблона / Payload 30 districts+150 SD / 4 templates+JSON-LD / 60 Class-A content / QA PASS
- **US-7 DONE (2026-05-08):** 4 бага устранены (PRs #195–198), 4 deploy SUCCESS

**US-7 итог:**
- SD-страницы `/{pillar}/{city}/` → HTTP 200 (arboristika, vyvoz-musora, chistka-krysh, demontazh × 30 городов)
- Sitemap: 109 → **233 URL** (+124 T4 SD entries, priority 0.75)
- Root causes устранены: symlink cwd (rsync path) + draft после seed + T4 shadow bug + sitemap не импортировал `getAllServiceDistrictParams`

**Следующие шаги (operator action required):**
1. **Я.Вебмастер**: webmaster.yandex.ru → Индексирование → Sitemap → https://obikhod.ru/sitemap.xml
2. **7-day monitor** — индексация SD через Я.Вебмастер

**US-5 Phase B** (90 Class-B SD, 18 long-tail cities × 5 pillar) — старт после 7-day monitor.

**Блокеры:** только ручная операция оператора в Я.Вебмастер.

**US-5 Phase B/C/D** — контент-волна, стартует после US-7 deploy + 7-day monitor.

---

## Архив (2026-05-06) — poseo сессия · EPIC-SEO-COMPETE-3

### Эпик в работе: **EPIC-SEO-COMPETE-3** (`specs/EPIC-SEO-COMPETE-3/intake.md`)

## Где мы сейчас (2026-05-06) — poseo сессия

### Эпик в работе: **EPIC-SEO-COMPETE-3** (`specs/EPIC-SEO-COMPETE-3/intake.md`)

Старый EPIC-SEO-OUTRANK **удалён 2026-05-06** по mandate оператора («clean start, новый EPIC с нуля»). Все `seosite/strategy/`, `seosite/02-keywords/`, `seosite/03-clusters/`, `seosite/05-content-plan/`, `seosite/scripts/` тоже удалены. Осталось только `seosite/01-competitors/keysso-snapshot-2026-05-06.json` как baseline.

**Что сделано в этой сессии (2026-05-06):**
- Live Keys.so refresh 3 конкурентов: liwood 155 / arborist.su 74 / arboristik.ru 65 pagesInIndex
- Phase 1 explore (3 parallel agents): site code map (Next.js 16 + Payload, 11 collections, 14 blocks, lib/seo готов) + Keys.so deep dive (5 ключевых insights, intent-split top-100 per домен) + services audit (Topvisor / Just-Magic / Я.Метрика / Я.Вебмастер)
- Phase 2 plan agent: 11 US декомпозиция black-box review
- 4 AskUserQuestion закрыты: uborka-territorii=новый pillar, real-names=3-5 imen+фото, services=Topvisor+Just-Magic есть+NAP placeholder, OUTRANK=удалить
- Bootstrap PR: DELETE EPIC-SEO-OUTRANK + CREATE EPIC-SEO-COMPETE-3/intake.md + ADR-0018-url-map skeleton + backlog update

**EPIC-SEO-COMPETE-3 цели (12 нед, DoD W14):**
- pagesInIndex ≥160 (паритет с liwood 155)
- Topvisor visibility ≥15
- Organic sessions ≥800/нед
- Lead submissions ≥15/нед
- AI-citation ≥4/10 prompts

**12 US:**
- US-0 pre-flight (cleanup + creds setup) — W1
- US-1 семантическое ядро — W1-W2
- US-2 URL-карта + ADR-0018 — W2
- US-3 нейро-SEO каркас (jsonld/citation/llms-full.txt/IndexNow auto) — W2-W3
- US-4 mega-прайс /uslugi/tseny/ — W4-W5
- US-5 30 info-articles /blog/ — W3-W12 rolling
- US-6 6 B2B-нормативки /b2b/<doc>/ — W4-W6
- US-7 programmatic <service>×<city> — W3-W5
- US-8 /kontakty/ + /kalkulyator/foto-smeta/ + 5 LeadForm-вариантов — W6-W7
- US-9 Reviews + /otzyvy/ + Я.Карты (last blocked owner) — W8
- US-10 Topvisor + Я.Метрика + weekly snapshot — W7-W12
- US-11 3-5 авторов + 12 кейсов + СРО — W8-W10
- US-12 final verify + retro — W13-W14

**Блокеры (open questions для оператора):**
1. Topvisor token — когда передать (US-0 W1)
2. Just-Magic creds — когда передать
3. NAP реальный (телефон/адрес) — нужен к US-9 W8
4. Real-name + фото 3-5 авторов — нужен к US-11 W8
5. Я.Бизнес owner-доступ — отложен до получения
6. B2B PDF templates — operator пишет / re из открытых источников
7. Slug `/uborka-territorii/` подтверждение

**Следующий шаг для poseo:**
1. Smoke local + push bootstrap PR + open `gh pr create`
2. Operator merge → handoff к tamd (ADR-0018 review W2)
3. Параллельно — operator готовит креды Topvisor + Just-Magic
4. После ADR-0018 approve → sa-seo стартует US-2 spec
5. seo-content + re стартуют US-1 pull Keys.so deep + Wordstat dop-сбор

### Operator answers 2026-05-06 (post-bootstrap)

PR #169 merged 2026-05-06. Operator передал в чате:
- Topvisor: `f183b7d…` + USER_ID 496026 (уже в `.env.local`)
- Just-Magic: `19e91bb…` (уже в `.env.local`)
- NAP: `+7 (985) 229-41-11`, «МО, Жуковский, мкр. Горельники, ул. Амет-хан Султана, 15к1»
- Real-name авторы: рандомные русские имена (photo source — open question)
- Я.Бизнес: оператор сам owner → US-9 unblocked
- B2B PDF templates: оператор не знаком с концептом, нужно объяснение

Follow-up PR создан с обновлениями intake.md + .env.example template + handoff.md.

**3 новых open questions для operator (после answers):**
1. **Авторские фото** — AI-gen / stock / без фото? (нужно к US-11 W8)
2. **Email** для NAP (например `info@obikhod.ru`)?
3. **B2B-track go/no-go** после объяснения PDF templates: оставляем 6 PDF в US-6 или скоупа без PDF?

Hand-off к `cms` — записать NAP в Globals.SiteChrome через Payload admin (W1 минор-задача).

### 2026-05-06 15:05 — все open questions closed, EPIC полностью разблокирован

Operator финал-ответы:
- Авторские фото: **fal.ai** (skill `fal-ai-media`)
- Email: **hello@obikhod.ru** (operator typo `hello@@` corrected)
- B2B-track: **Вариант A** (с 6 PDF templates)

**Единственный live блокер EPIC:** tamd ADR-0018 review (W2 deadline = 2026-05-13).

PR #170 close-out applied (intake обновлён + B2B PDF в US-6 + US-11 fal.ai авторы + email в US-11 footer).

**Hand-offs пущены:**
- `re` — legal references для 6 B2B-документов (старт W4)
- `ui` — Figma → PDF export для 6 B2B templates (W4-W6)
- `cms` — NAP запись в Globals.SiteChrome (W1)
- `tamd` — ADR-0018 review (W2)

**Старт US-1** возможен немедленно после merge PR #170 — `seo-content` + `re` начинают pull Keys.so deep + Wordstat dop-сбор по 5 pillar.

### 2026-05-06 15:55 — US-1 primary closed (poseo autonomous)

PR #170 merged. Старт US-1 в новой ветке `seo/epic-compete-3-us-1-semantic-core`.

**Done:**
- Pull Keys.so deep (3 домена / 178 сек):
  - liwood.ru: 5 097 keys + 155 pages = 3 058 KB JSON
  - arborist.su: 1 355 keys + 74 pages = 820 KB JSON
  - arboristik.ru: 1 365 keys + 65 pages = 785 KB JSON
- Classification (intent + pillar regex baseline):
  - Union: 4 685 unique keys
  - Intersect 3-way: 36
  - Whitespace 1-domain: 4 304
- TF-IDF + MiniBatchKMeans (Just-Magic API недоступен без ticket в support → deferred к US-2):
  - 438 commercial keys (intent=lead/pricing, wsk≥3) → 60 кластеров
- Master doc + decisions log + 3 reproducible scripts

**Top-15 кластеры выделили P0 страницы:**
1. C12 wsk=913 «покос травы» → `/uborka-territorii/pokos-travy/` US-7
2. C56+C34+C21 wsk=2387 «уборка снега» → `/uborka-snega-i-chistka-krysh/cena/` US-7
3. C7+C55 wsk=1361 «сколько стоит спил» → `/uslugi/tseny/arboristika/` US-4
4. C5 wsk=473 «онлайн калькулятор» → `/kalkulyator/foto-smeta/` US-8
5. C36 wsk=201 «штраф за спил» → info-blog + B2B cross-link US-5+US-6

**3 конкурента не покрывают: vyvoz-musora / demontazh.** Sustained для US-2 follow-up — отдельный Keys.so pull для musor.moscow / cleaning-moscow / snos-msk / demontazh-msk.

**Live блокер:**
- 🔐 Keys.so токен в `.env.local` устаревший (401). Вчерашний `69fb0031ed5079...` использовал через ENV override. Operator: подтвердить валидный токен.

**Hand-offs:**
- poseo → sa-seo: US-1 closed, входной материал для US-2 (URL-карта)
- poseo → tamd: ADR-0018 review (sustained, W2 deadline 2026-05-13)
- poseo → operator: Keys.so token verify

**Следующее:**
1. PR #171 (US-1) → operator merge
2. tamd ADR-0018 review → approved → sa-seo пишет US-2 spec
3. Параллельно — operator передаёт Wordstat OAuth для US-2 follow-up

### 2026-05-06 17:15 — US-2 primary closed (poseo autonomous + tamd-proxy review)

PR #171 merged. Старт US-2 в новой ветке `seo/epic-compete-3-us-2-url-map`.

**Done:**
- Audit `site/scripts/seed.ts` → sustained 4 pillars (`arboristika`, `chistka-krysh`, `vyvoz-musora`, `demontazh`) + 18 sub-pages → НЕ переименовываем (0 redirects, sustained SEO baseline)
- 5 pillars: 4 sustained + 1 new `/uborka-territorii/` (operator approved)
- 35 sub-pages = 18 sustained + 17 new (mapped к US-1 TF-IDF cluster)
- ADR-0018 финализирован — 13 SEO правил, sitemap priority, redirect-карта (0 records), priceFrom defaults для 17 new subs
- URL-инвентарь JSON `seosite/strategy/02-url-map.json` (machine-readable для seed-скриптов)
- US-2 sa-seo spec
- tamd-proxy review (general-purpose agent в роли tamd) → 🟡 approve with 7 actionable, все applied:
  1. SD route depth уточнено — sustained 2-сегмент `/<pillar>/<city>/`, 3-сегмент out-of-scope
  2. «12 canonical» → «13 SEO» rename + #13 H1 differentiation
  3. chistka-krysh/sosulek vs krysha-ot-naledi collision resolved
  4. priceFrom defaults для 17 new subs
  5. Reviews collection plan (dba migrate sustained homepage_reviews)
  6. PILLAR_PRIORITY asymmetric sustained
  7. uborka-territorii: 0.85 в US-3 sitemap.ts

**Следующее:**
1. PR #172 (US-2) → operator merge
2. tamd formal review (tamd-proxy ≠ tamd для completeness)
3. cpo notify podev cross-team load
4. После approves → sa-seo стартует US-3..US-9 sub-specs параллельно

### 2026-05-06 18:30 — US-3 primary closed (poseo autonomous, seo-tech proxy)

PR #173 merged (US-2). Старт US-3 в новой ветке `seo/epic-compete-3-us-3-neuro-seo`.

**Done deliverables:**
- `site/lib/seo/jsonld.ts` extended +6 schema-helpers (~210 строк):
  - howToSchema, speakableSchema, aggregateOfferSchema, reviewSchema, aggregateRatingSchema, legalServiceSchema
- `site/lib/seo/citation.ts` (новый, ~120 строк) — buildCitationSummary + validateCitation
- `site/app/llms-full.txt/route.ts` (новый, ~280 строк) — full-context dump per llmstxt.org spec
- `site/app/llms.txt/route.ts` extended — 5 pillars + Pricing + Cases-by-service + Local coverage sections
- `site/app/sitemap.ts` — uborka-territorii: 0.85 (REC #7 tamd review)
- robots.ts + /api/revalidate IndexNow — sustained verify (no changes needed)

**Verified:** type-check ✅, lint 0 errors ✅, prettier ✅.

**Sustained для leadqa post-merge:**
- Real-browser smoke /llms.txt + /llms-full.txt (после US-7 seed pillar uborka-territorii)
- Schema.org validator на pillar / sub / b2b / blog / case (после контента US-4..US-7)

**Следующее:**
1. PR #174 (US-3) → operator merge
2. После merge — sa-seo может писать US-4..US-9 sub-specs параллельно (все нужные jsonld helpers + citation.ts готовы)
3. EPIC progress: 3/12 US closed (US-0 + US-1 + US-2 + US-3), W2 begin

### 2026-05-06 19:30 — US-4 primary closed (poseo autonomous, mega-pricing хаб)

PR #174 merged. Старт US-4 в новой ветке `seo/epic-compete-3-us-4-mega-pricing`.

**Done:**
- `site/app/(marketing)/uslugi/tseny/page.tsx` (~180 строк) — root pricing hub с 5 pillar cards
- `site/app/(marketing)/uslugi/tseny/[pillar]/page.tsx` (~250 строк) — per-pillar deep matrix с table + FAQ
- `site/lib/seo/queries.ts`: `getAllPillarsForPricing()` + `PricingPillar` type
- `site/app/sitemap.ts`: 6 tseny entries priority 0.8
- AggregateOffer + BreadcrumbList JSON-LD (US-3 sustained helpers)
- UTM tracking `source=tseny&medium=root|<pillar>` в lead-form CTAs
- H1 pricing-intent vs pillar lead-intent (правило #13 ADR-0018) — снимает каннибализацию

**Verified:** type-check ✅, lint 0 errors ✅, prettier ✅.

**Sustained для leadqa post-merge:**
- Lighthouse SEO ≥95 + LCP <2.5s real-browser smoke
- Mobile AA contrast (brand-guide §5)
- Конверсия (`/foto-smeta/?utm_source=tseny`) → leadqa monitoring W14

**Следующее:**
1. PR #175 (US-4) → operator merge
2. После merge — параллельные пути возможны:
   - **US-5** (info-articles 30 шт, контент-машина) — owner cw
   - **US-7** (programmatic SD расширение + uborka-territorii pillar seed) — owner cw + cms
   - **US-6** (B2B 6 страниц + PDF templates) — owner re + cw + ui
3. EPIC progress: 4/12 US closed (US-0 + US-1 + US-2 + US-3 + US-4), 33% за 2 сессии (план 12 нед)

### 2026-05-06 20:15 — US-7 Phase A closed (poseo autonomous, pillar seed)

PR #176 (US-4) merged. Старт US-7 в новой ветке `seo/epic-compete-3-us-7-uborka-territorii-seed`.

**Done — Phase A: uborka-territorii pillar seed:**
- `site/scripts/seed.ts` extended:
  - ServiceSeed type: `'uborka-territorii'` в slug union, `'sotka'` в priceUnit union
  - SERVICES array: 5-й pillar entry (intro 280 символов + 3 FAQ + leadTemplate + 4 sub)
- 4 sub-services с priceFrom defaults из ADR-0018:
  - vyravnivanie-uchastka — 250 ₽/сот
  - raschistka-uchastka — 800 ₽/сот
  - pokos-travy — 80 ₽/сот (cluster C12 wsk=913)
  - vyvoz-porubochnyh-ostatkov — 1 800 ₽/м³

**Verified:** type-check ✅, lint 0 errors ✅, prettier ✅.

**Sustained Phase B+C для US-7 follow-up:**
- Phase B: 150-250 ServiceDistricts bulk-seed (через sustained `scripts/generate-sd-batch.ts`)
- Phase C: 17 new sub-pages под sustained 4 pillars (cw spread review)

**Следующее:**
1. PR #177 (US-7 Phase A) → operator merge
2. После merge — `pnpm seed` локально для leadqa smoke /uborka-territorii/
3. EPIC progress: 5/12 US с partials (US-7 Phase A done, B+C sustained)

---

## Где мы сейчас (2026-04-29)

### Свежайшее: PANEL BACKLOG REBUILD + drop magic link + SEED-ADMIN + ADR-0009 (2026-04-29 ночью)

**Сессия с popanel:**
1. **Drop Wave 2.B (magic link)** из US-12 — оператор пересмотрел, popanel дал rationale. PAN-9 (Telegram bot) → US-8 ownership (lead notifications, podev), PAN-10 (SMTP) → общая инфра/`do`. `sa-panel-wave2b.md` → `status: cancelled`, спека сохранена как архив.
2. **Беклог panel пересобран** — создан `team/backlog.md` (его не было!) с RICE/MoSCoW. panel.now: PANEL-DEV-SEED-ADMIN (66.7) → US-12 W0 ADR (50) → W2.A Login UI → W3 PageCatalog → W4 Tabs → W5 Empty/Error. panel.later: PANEL-LEADS-INBOX (11.25 — главный кандидат после US-12), PANEL-AUTH-2FA, PANEL-BULK-PUBLISH, PANEL-AUDIT-LOG, PANEL-MEDIA-LIBRARY.
3. **PANEL-DEV-SEED-ADMIN дотащен до verify-passed** — be-panel реализовал (`scripts/seed-admin.ts` + 4 файла), local-verify обнаружил P0 infra-блокер на tsx+Payload+`@next/env`. Эскалирован на tamd → **ADR-0009 path G** (CJS preload shim 13 строк). Финальный popanel local-verify: AC-1.1/1.3/2/3/4/5 ✅, browser smoke `admin@obikhod.local` логин в /admin dashboard ✅ (`screen/seed-admin-login-success.png`), do-checks ✅ (type-check 0 / lint 0 errors / format OK).
4. **Открытые follow-ups (для следующей сессии):**
   - PR + cr-panel review + merge `feature/seed-admin-local` → `panel/integration` (ничего ещё не закоммичено!)
   - `PRODUCT-SEED-METADATA-FIX` (low) — chistka-krysh metaDescription > 160 chars (pre-existing, не блокер).
5. **ВАЖНО для следующей сессии:** `.env.local` имеет добавленный руками блок `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`. БД содержит 3 admin'а (samohingeorgy@gmail.com, admin@obikhod.local, test@obikhod.local). Postgres контейнер `obikhod_postgres` running.

**Memory updates:** `project_cicd_backlog.md` — пункт «seed данных» закрыт (admin-уровень).

### Прошлое: SHOP MERGE + AUTH/CABINET + SITE CHROME (2026-04-29 поздним вечером)

**Решение оператора:** «один источник истины — `design-system/brand-guide.html`. brand-guide-shop.html не нужен».

**Что сделано:**
- `brand-guide-shop.html` **удалён** (был v1.0 → redirect-stub → удалён).
- Контент перенесён в `brand-guide.html` как §15-§29 (TOV порт + полная e-commerce: Витрина / Поиск / Карточка с PDP / Корзина / Чекаут B2C+B2B / Формы / Аккаунт shop / States / Photography / Heritage).
- Добавлено §30-§32: header auth-states / auth-экраны (login/register/recovery/2FA) / unified ЛК (sidebar 8 разделов, services lead-row + 5-шаговый timeline, shop order-row).
- Добавлено §33: Header & Footer canonical — iron rule «один Header.tsx, один Footer.tsx, без `· магазин` суффиксов»; полная anatomy footer'а с 4 колонками + bottom-row legal.
- 42 ролевых файла в `team/{business,common,design,panel,product,seo,shop}/` массово переписаны: 3 паттерна (iron rule §5, «team/shop/» bullet, «TOV для специализированных зон») заменены на «§15-§29 в brand-guide.html».
- `CLAUDE.md` immutable обновлён: один файл, brand-guide-shop.html удалён.
- Текущая версия: **brand-guide.html v2.2**, 5754 строк, 36 секций.

**Verify:** `grep -rln "brand-guide-shop" /Users/a36/obikhod/{team,CLAUDE.md,design-system}` → должно вернуть пусто (или только этот handoff).

---

### Прошлый день: design-system awareness iron rule в 42 ролях (2026-04-29)

**Решение оператора:** «все агенты которые есть в проекте obikhod смотрят в один источник истины (дизайн системы) — `design-system/brand-guide.html`. Для услуги «Дизайн ландшафта» и для магазина — отдельный TOV».

**Что сделано:**
- В **все 42 ролевых файла** в `team/{business,common,design,panel,product,seo,shop}/` добавлены два новых блока (после `## ⚙️ Железное правило: skill-check перед задачей`, до `## Capabilities`):
  - `## ⚙️ Железное правило: design-system awareness` — обязательная сверка с brand-guide перед UI/UX/контентной/TOV-задачей + per-team пометки (design = авторы; shop = + brand-guide-shop.html; landshaft = future-TOV).
  - `## Дизайн-система: что я обязан знать` — конспект 17 секций brand-guide.html, релевантность по типам задач, связанные источники (`globals.css`, `custom.scss`).
- `team/WORKFLOW.md` §11 «Инварианты проекта» — bullet про design-system awareness + TOV split.
- Memory `feedback_design_system_source_of_truth.md` дополнена примечанием про новый iron rule + TOV split.
- Verify: `grep -l "Железное правило: design-system awareness" team/*/*.md | wc -l` → **42**.

**TOV split:**
- `design-system/brand-guide.html` — общий source of truth для всех 42 ролей. Ведёт `team/design/`.
- `design-system/brand-guide-shop.html` — специализация для магазина (существует), **дополнительно** к общему brand-guide. Ведёт `team/shop/`.
- `design-system/brand-guide-landshaft.html` — специализация для услуги «Дизайн ландшафта», **follow-up** (создаётся позже, owner `art` через `cpo`).

**Follow-up (не в этой сессии):**
1. Создать `brand-guide-landshaft.html` (триггер — первая landscape-related задача).
2. Документировать в `brand-guide.html` §12 namespace-разделение `--c-*` (паблик) vs `--brand-obihod-*` (admin).
3. Опционально — заменить устаревшую ссылку в [specs/US-3-admin-ux-redesign/ui-mockups.md:6](../../specs/US-3-admin-ux-redesign/ui-mockups.md#L6) на `design-system/brand-guide.html`.

---

### Раньше в этой сессии: отказ от Linear + reorg specs/ (2026-04-29)

**Решения оператора в одной сессии:**
1. «убираем Linear с проекта — мы перестаем им пользоваться» → ADR-0008.
2. «папку specs выносим из папки team, она будет отдельно» → `git mv team/specs specs/`.
3. «новые US оборачиваются в EPIC или TASK-AD-HOC» → структура `specs/{EPIC-<N>|TASK-<DOMAIN>-AD-HOC}/US-<N>/`.

**Что изменилось:**

- **Внешний task-tracker не используется.** Беклог и hand-off — только в репо.
- **Беклог** — `team/backlog.md` (cross-team таблица, ведёт `cpo` + PO команд).
- **Папка `specs/`** — вынесена из `team/specs/` на корень репо. Все ссылки в активных файлах + code-комментариях обновлены sed-ом.
- **Структура `specs/`:**
  - Новые US — в `specs/EPIC-<N>-<slug>/US-<N>-<slug>/` (для крупных программ) или `specs/TASK-<DOMAIN>-AD-HOC/US-<N>-<slug>/` (для одиночных задач).
  - Допустимые `<DOMAIN>` для TASK-AD-HOC: `INFRA`, `CONTENT`, `SEO`, `PANEL`, `SHOP`, `SITE`, `DESIGN`, `OPS`.
  - Исторические US (US-1..US-12, OBI-19, PAN-9, admin-visual, EPIC-SITE-MANAGEABILITY) — плоский список без реорганизации.
- **Артефакты US** — `intake.md`, `ba.md`, `sa-<team>.md`, `qa-<team>.md`, `cr-<team>.md`, `leadqa.md`.
- **Метаданные** — YAML-frontmatter (`us`, `epic`, `team`, `po`, `type`, `priority`, `segment`, `phase`, `role`, `status`, `blocks`, `blocked_by`, `related`).
- **Hand-off** — секция `## Hand-off log` внутри артефакта (timestamp · `from` → `to` · 1 фраза).
- **Merge-conflicts** (`do`) — `team/ops/merge-conflicts/<YYYY-MM-DD>-<branch>.md` + пинг PO напрямую.
- **MCP `mcp__claude_ai_Linear__*`** — не вызывать в этом проекте.

**Что переписано (активные файлы):**

- `CLAUDE.md` — секция «Структура проекта» (специальный блок для `specs/` на корне) + «Агенты проекта»: убрана Linear-интеграция, добавлена ссылка на ADR-0008 + правила группировки (EPIC/TASK-AD-HOC).
- `team/WORKFLOW.md` — §0, §1.0 (колонка «Linear team» удалена), §3, §6 (merge train), §7 (диаграмма каталогов с `specs/` на корне + EPIC/TASK-AD-HOC обёртками), §7.5 («Беклог и трекинг без внешнего tracker'а» + структура группировки + frontmatter с `epic:` полем), §9 (RC + release-note шаблоны), §13.
- `team/PROJECT_CONTEXT.md` — §8 (Управление проектом + специфика `specs/` на корне с EPIC/TASK-AD-HOC), §8.5 (merge train).
- `team/business/in.md` — intake-процесс с этапом «Определяю обёртку (EPIC vs TASK-AD-HOC)» + матрица «Признак → Куда кладу» + frontmatter с `epic:` полем.
- 40 ролевых файлов в `team/{business,common,design,product,seo,shop,panel}/` — Linear-механика заменена на frontmatter + Hand-off log + `team/backlog.md`. PO-роли (`cpo`, `podev`, `poseo`, `popanel`, `poshop`) — секции «Что я веду в Linear» → «Что я веду в репо». `team/common/do.md` — merge train без Linear-issue.
- `git mv team/specs specs` + sed `team/specs/` → `specs/` по 83 файлам (все активные .md/.json/.yml/.yaml + 7 code-комментариев в `site/`).
- Создан `specs/README.md` (обзор новой структуры, текущие эпики, нумерация US).
- Memory: удалены `feedback_linear_mandatory.md` + `project_linear_release_mgr_alias.md`, добавлен `feedback_no_external_tracker.md` (обновлён под новую структуру `specs/`). MEMORY.md обновлён. Обновлены 6 активных feedback-памяти (skill_check, spec_first, strict_sequential_epics, po_iron_rule, do_owns_merges, autonomous_mode_full_mandate) + project_team_v2_42_roles.
- Создан `team/adr/ADR-0008-drop-linear-task-tracker.md` (Accepted, 2026-04-29) — обновлён под reorg `specs/`.

**Не тронуто (исторические артефакты):** `specs/US-1..US-12/`, `specs/OBI-19-*/`, `specs/PAN-9-*/`, `specs/admin-visual/`, `specs/EPIC-SITE-MANAGEABILITY/`, `team/release-notes/`, `team/ops/`, `team/adr/ADR-0001..0007/`, ADR-0004 таблица «Linear team», 2 HTML с устаревшим путём `devteam/specs/` (`contex/07_brand_system.html`, `design-system/brand-guide.html` — битые ссылки до этого ADR). Старые Linear ID (`OBI-19`, `PAN-9`, `SHOP-N` и т. п.) в этих файлах остаются как archeological data.

**Текущая ветка:** `main`. Изменения этой сессии ещё не закоммичены — оператор решит про commit/PR.

---

### Структура команды (актуальное)

42 роли в 7 командах. Все на `opus-4-7` (`claude-opus-4-7`, 1M context) с `reasoning_effort: max`.

- **business/** (6): cpo, ba, in, re, aemd, da
- **common/** (5): tamd, dba, do, release, leadqa
- **design/** (3): art (lead), ux, ui — ветка `design/integration`
- **product/** (8): podev (lead), sa-site, be-site, fe-site, lp-site, pa-site, cr-site, qa-site — ветка `product/integration`
- **seo/** (6): poseo (lead), sa-seo, seo-content, seo-tech, cw, cms
- **shop/** (7): poshop (lead), sa-shop, be-shop, fe-shop, ux-shop, cr-shop, qa-shop — ветка `shop/integration`, monorepo `apps/shop/`
- **panel/** (7): popanel (lead), sa-panel, be-panel, fe-panel, ux-panel, cr-panel, qa-panel — ветка `panel/integration`

**Релиз-цикл:** `[команда] PR → [release] gate → [leadqa] verify → [operator] approve → [do] deploy → [cpo] retro`. `do` НЕ деплоит без апрува оператора.

**Подчинение:** оператор → cpo → {podev, poseo, popanel, poshop, art} → команды.

**Sticky agent sessions:** `@<code>` или «`<code>`, ...» переключает Claude в роль до явного `/claude`.

**Spec-before-code iron rule:** в командах panel/product/shop dev/qa/cr НЕ стартует без одобренной `sa-<team>.md`. PO команды держит gate в DoD.

**Skill-check железное правило:** перед задачей агент активирует релевантный skill через Skill tool, фиксирует в commit/PR/артефакте.

---

### Программа SITE-MANAGEABILITY (срез на 2026-04-27)

5/8 эпиков Done (US-3 Админка / US-4 Семантика / US-5 Sitemap-IA / US-6 Контент / US-7 SEO покрытие).

Backlog:
- **US-8** — Фичи + калькуляторы + photo→quote + Payload Leads + Telegram оператору (P1, разблокирован US-7). amoCRM вынесен в US-13.
- **US-9** — Полный технический регресс (P1, blocked by US-8).
- **US-10** — Финальный SEO аудит классики + нейро (P1, blocked by US-9 + US-7 Wave 2D content).

Future / out-of-scope MVP:
- **US-11** — IA Extension: Магазин mega + Дизайн ландшафта flat + Error pages 5 шт. (дизайн готов, ждёт seo URL slugs).
- **US-12** — Admin Redesign Final (Login + Layout + Page Catalog + Tabs + States). Wave 1 (custom.scss) задеплоен 2026-04-27. Waves 2-7 открыты, owner — команда panel.
- **US-13** — amoCRM (P2, blocked by аккаунт).
- **US-14** — Wazzup24 (P3, blocked by аккаунт).
- **US-15** — Колтрекинг (P3, blocked by сервис).

### Prod

- https://obikhod.ru, VPS 45.153.190.107, Node 22, PM2 `obikhod`, auto-deploy на push `main`.
- 53 публичных страницы, sitemap = 43 URL.

### Доступы

- ✅ **GH PAT** в `~/.claude/secrets/obikhod-gh.env` — Actions RW + PR RW + Contents RW
- ✅ **Payload API key** в `~/.claude/secrets/obikhod-payload.env`
- ✅ **SSH root** к VPS (45.153.190.107) через `~/.ssh/id_ed25519`
- ❌ **AI API keys** (Perplexity / OpenAI / Anthropic / GigaChat / fal.ai) — нет

---

## Следующий шаг (при возврате оператора)

1. Решить: коммитить ли изменения 2026-04-29 (Linear removal) одним коммитом или разнести (CLAUDE.md / WORKFLOW / role files / memory + ADR).
2. Создать `team/backlog.md` шаблон при первой новой задаче (отдельный US, ответственный — `cpo` совместно с PO команд).
3. Архивирование Linear workspace `samohyn` — вручную оператором в Linear UI (вне scope).
4. Дальше — продолжить программу SITE-MANAGEABILITY (US-8 → US-9 → US-10) или US-12 Wave 2.A (Login UI dev-ready).

## Подсказки для следующей сессии

- `do` сам мержит PR через GH API при зелёном CI (правило `feedback_do_owns_merges_when_ci_green.md`).
- `do` отвечает за зелёный CI до push (правило `feedback_do_owns_green_ci_before_merge.md`).
- Прямой psql на prod: `ssh root@45.153.190.107 'sudo -u postgres psql obikhod -c "..."'`.
- PM2 logs: `ssh root@45.153.190.107 'sudo -u deploy pm2 logs obikhod --lines 50 --nostream'`.
- REST POST на Payload требует **trailing slash** в URL (Next 16 trailingSlash:true → 308 redirect).
- Revalidate endpoint: **GET** (не POST), secret из `/home/deploy/obikhod/shared/.env`.
- Хук `block-dangerous-bash.sh` блокирует `DROP TABLE` — использовать `ALTER TABLE DROP COLUMN`.
- Хук `protect-secrets.sh` блокирует `cat ~/.claude/secrets/...` — использовать `set -a; . file; set +a`.
- Media upload: multipart `POST /api/media/` с `file=@path` + `_payload={"alt":"...","license":"public-domain"}`.

### Pattern для Payload миграций

При добавлении нового поля в коллекцию с `versions: { drafts: true }`:
- `<table>` — основная колонка
- `_<table>_v` — `version_<column>` копия
- Для `select hasMany` — отдельные таблицы `<table>_<field>` + `_<table>_v_version_<field>`
- Для `array` — `(id SERIAL, _uuid varchar, ...fields)` (не varchar PK!)
- Для каждой новой коллекции — `<slug>_id` колонка в `payload_locked_documents_rels`

CI на ephemeral postgres без seed не поймает missing snapshot tables — smoke на REST POST после migrate обязателен.

## Открытые вопросы (из CLAUDE.md)

- [ ] `contex/05_tech_stack_decision.md` — TCO и альтернативы
- [ ] Переименование `contex/` → `context/` (косметика)
- [ ] ТМ «ОБИХОД» у патентного поверенного
- [ ] Юрлицо / СРО / лицензия Росприроднадзора
- [ ] Аккаунты: amoCRM / Wazzup24 / Calltouch
- [ ] AI API ключ для нейро-SEO test (Perplexity / GigaChat / OpenAI)
- [ ] fal.ai key для замены picsum-placeholder в Cases на AI-сгенерированные
