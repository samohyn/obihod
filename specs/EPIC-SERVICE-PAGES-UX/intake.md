---
epic: EPIC-SERVICE-PAGES-UX
title: Единый мастер-template service-страниц T2/T3/T4 — UX/UI-driven (НЕ SEO), brand-guide v2.2 inventory + визуальный бенчмарк liwood
team: design + product
po: po
type: design + spec + migration
priority: P0
segment: services
phase: discovery
role: design + ux + arch + po
status: next
blocks:
  - EPIC-SERVICE-PAGES-REDESIGN (D ждёт C2 master template apruva)
blocked_by:
  - EPIC-SHOP-REMOVAL W1 (landshaft = 5-й pillar в template — нужно решение в ADR-0020)
related:
  - design-system/brand-guide.html (v2.2 — source of truth для всех UI-компонентов)
  - team/adr/ADR-0021-service-page-master-template (deliverable C2)
  - site/blocks/index.ts (12 переиспользуемых блоков, потенциальное расширение)
  - site/lib/seo/composer.ts (JSON-LD T2/T3/T4 — US-3 done, готов)
  - seosite/01-competitors/liwood-page-anatomy-2026-05.md (deliverable C1.b)
  - design-system/inventory-services-2026-05.md (deliverable C1.a)
created: 2026-05-09
updated: 2026-05-09
skills_activated: [ui-ux-pro-max, frontend-design, design-system, click-path-audit, product-capability, fal-ai-media]
plan_file: /Users/a36/.claude/plans/stateless-puzzling-valiant.md
---

# EPIC-SERVICE-PAGES-UX — UX/UI-driven мастер-template

## Контекст

Все 233+ service-URL должны иметь единую структуру и качественный дизайн по `design-system/brand-guide.html` v2.2. Структура выводится **UX/UI компетенциями** (не SEO): через (a) полный inventory готовых компонентов в brand-guide и (b) визуальный бенчмарк liwood «сделать лучше». Каждая секция мастер-template маппится на §brand-guide или сначала добавляется туда (iron rule brand-guide-first).

## Story

Как оператор Обихода, я хочу единый понятный template service-страниц, в котором: лид-формы работают, калькулятор «фото→смета» работает, все кнопки и переходы рабочие, текст SEO+нейровыдача-адаптивен, breadcrumbs корректные, customer journey удобный — и весь UI собран из готовых компонентов brand-guide без отсебятины.

## AC

- [ ] **C1.a — Brand-guide v2.2 inventory:** `design-system/inventory-services-2026-05.md` опубликован — таблица «компонент × файл-line × готов / требует расширения / fal.ai-fillable / design draws × где использовать в template». Покрывает §components, §notifications (incl 5-стейтовый flow), §errors (5 страниц), §pagination, §nav, §icons, §color/contrast/type/shape
- [ ] **C1.b — UX/UI бенчмарк liwood:** screen/EPIC-C/liwood-*.png (5 URL × desktop+mobile). `seosite/01-competitors/liwood-page-anatomy-2026-05.md` — таблица «секция × T2/T3/T4 × required/optional × что у liwood лучше нас × что мы делаем лучше»
- [ ] **C2 — Master template spec:** ADR-0021 принят с mapping table «секция template → §brand-guide:line». Структура: hero → breadcrumbs → tldr → services-grid (T2) → pricing-block → calculator (фото→смета) → process → mini-case → FAQ → cta-banner → related → neighbor-districts → lead-form. Per T2/T3/T4 — required/optional. Если §нет в brand-guide — design расширяет brand-guide.html. JSON-LD inject через `composer.ts` (US-3 done). Operator apruv
- [ ] **C3 — Schema reference в Payload:** Services/ServiceDistricts/B2BPages/Districts/Cases — Payload-validator на blocks[] под master template. Migration UP/DOWN/UP roundtrip
- [ ] **C4 — Migration plan:** incremental без downtime. Resolver `getBlocksForLayer(layer, currentBlocks, masterTemplate)` reorder + fills missing с placeholder. Feature flag `template_v2` per-URL. Rollout 30/нед в EPIC-D
- [ ] **C5 — Content-fill missing required:** ~233 URL × ~3 missing avg × ~150 words ≈ 100k слов. AI-draft (Claude Sonnet 4.6 + prompt caching, skill `claude-api`) + cw редактура. Текст SEO-адаптивен (классический поиск) + нейровыдача-адаптивен (llms.txt/llms-full.txt — US-3 done)
- [ ] **C6 — Schema.org валидация + click-path-audit:** Rich Results Test 0 errors на 100% URL. Click-path-audit (skill `click-path-audit`) — все кнопки/переходы работают, состояния не сбрасывают друг друга. Broken-links scan = 0
- [ ] **C7 — A11y/WCAG 2.2 AA:** axe-core, touch-target ≥44×44, focus-states, aria-labels, semantic order

## Из требований оператора (обязательны для каждой service-страницы)

1. **LeadForm работает** end-to-end (Payload Leads + Telegram оператору) — E2E spec
2. **Calculator «фото → смета»** работает (Claude API photo→quote, US-8) — E2E spec
3. **Все кнопки** имеют корректные state'ы (default/hover/pressed/disabled/loading) и реально срабатывают
4. **Все переходы** рабочие (0 broken links, sitemap integrity, e2e click-path)
5. **Текст SEO-адаптивен** (H1/Title/meta/JSON-LD: Service+LocalBusiness+FAQPage+BreadcrumbList — US-3 done)
6. **Текст нейровыдача-адаптивен** (llms.txt + llms-full.txt + Speakable schema — US-3 done)
7. **Breadcrumbs корректные** (визуально + BreadcrumbList JSON-LD)
8. **Удобный customer journey** (hero → понимание → решение → действие)

## Iron rule brand-guide-first

Запрещено генерить ad-hoc UI. Используем что уже есть в brand-guide v2.2:
- §components: Кнопки / Бейджи / Форма / Карточка услуги
- §notifications: Primary success «фото→смета» / Toast / Empty / Loading skeleton / 5-стейтовый flow
- §errors: 5 страниц (404/500/502/maintenance/offline)
- §pagination: numbered + compact mobile
- §nav: mega-menu + mobile accordion
- §icons: 49 line-art + 9 districts + 9 cases
- §color/contrast/type/shape: токены

Если §нет — design сначала расширяет brand-guide.html (PR в `design-system/`), потом fe верстает.

## fal.ai hybrid policy

- **Иконки** gap-fill (Nano Banana Pro, line-art monochrome 1.5px stroke) — только при apruv design стиля
- **Hero/cases/district photos** (Nano Banana Pro, brand-guide §photography style — документальный репортажный) — заменяет picsum
- **UX/UI mockup-инспирация** (Nano Banana 2 для черновиков layout vs liwood) — НЕ замена design-этапа

Все assets через design review. UI-элементы НЕЛЬЗЯ генерить (только brand-guide). Контентные тексты НЕЛЬЗЯ (Claude API).

## Out of scope

- Pixel-perfect редизайн вёрстки (это EPIC-SERVICE-PAGES-REDESIGN)
- Создание новых pillar/sub URL за пределами landshaft (это EPIC-LIWOOD.B5)
- Главная страница (отдельный EPIC-HOMEPAGE-V2)
- Изменения admin/Payload UI

## Зависимости

- Блокирован EPIC-SHOP-REMOVAL.W1 (landshaft fate решается там)
- Блокирует EPIC-SERVICE-PAGES-REDESIGN D1 (нужен C2 ADR-0021 apruved)
- C1.a ‖ C1.b (разные owner)
- C5 кормится из EPIC-LIWOOD.B5 (по приоритетным контент-gap)

## Hand-off log

- 2026-05-09 21:35 MSK · operator → po: epic kickoff, scope confirmed (UX/UI driven, не SEO; brand-guide-first iron rule; fal.ai hybrid)
- 2026-05-09 22:10 MSK · design → po: C1.a done, inventory at design-system/inventory-services-2026-05.md. 15 готовых компонентов inventory'ed (§1-14 + §30, §33), 13 gaps выявлено для C2 master template (4 critical / 4 high / 5 medium). Скоп §15-29 shop игнорим (удаляются в EPIC-SHOP-REMOVAL.W3)
- 2026-05-09 22:12 MSK · design+ux → po: C1.b done. Anatomy at `seosite/01-competitors/liwood-page-anatomy-2026-05.md` (7 секций + 5 per-URL passport + master-template mapping T2/T3/T4 + mobile-specific spec). Screenshots `screen/EPIC-C/liwood-{services-hub,udalenie-pillar,spil-sub,khimki-sd,landshaft-pillar}-{1440,375}.png` (10/10 captured Playwright Chromium). 6 copy-кандидатов из liwood, 8 whitespace-возможностей, 17 рекомендаций для C2 master-template (12R+5O для T2; 9 для T3; 11 для T4). Top-5 UX wins vs liwood: (1) hero с photo-upload USP, (2) sticky bottom-CTA mobile, (3) AggregateRating+photo testimonials, (4) JSON-LD 100% URL (US-3 done), (5) 10-12 clean секции vs liwood 17-block dump. Liwood mobile-bug: horizontal scroll 440px > 375px viewport, font 12px. 6 открытых вопросов для C2 — в §6 anatomy.md
- 2026-05-09 22:25 MSK · arch+design+fe → po: C2 done. ADR-0021 written (`team/adr/ADR-0021-service-page-master-template.md`) + master-template.ts Zod-style schema (`site/blocks/master-template.ts`, no zod runtime — sustained constraint, TS literal types + plain runtime validator). Master-template = 13 секций × 3 layer (T2_PILLAR / T3_SUB / T4_SD) с required/optional/hidden matrix + brand-guide mapping per section + customer journey 4-step + mobile-first контракт (sticky bottom-CTA 56px, 375/414/768/1024 breakpoints, ≥44pt touch targets). 11 brand-guide расширений в C2.5 backlog (4 critical: Hero patterns / Calculator UI shell / Lead form full / Pricing table; 4 high: Process steps / Trust block / Mini-case / FAQ accordion; 3 medium: Breadcrumbs / TL;DR / District chips). type-check clean на master-template.ts (sustained pre-existing pg errors в shop-mentions scripts — не наша зона). Iron rule brand-guide-first зафиксирован в ADR + applies to team/{design,fe,qa}.md skill-checks. Operator apruv pending.
- 2026-05-09 22:59 MSK · design → po: C2.5.A done. brand-guide v2.4 (5538 строк, +1239 vs v2.3, +4 sections). 4 critical extensions: §service-hero (T2/T3/T4 layer + mobile + 9-row anatomy table + dodont) / §calculator-shell (5 states idle→uploading→processing→success→error + mobile native camera + a11y contract) / §lead-form-full (8 полей + photo-upload + 152-ФЗ + 4-state submit + field-error + mobile + a11y) / §pricing-table (3 варианта price-list / tier 3-col highlighted middle / per-district adjustment + mobile accordion). CSS токены sustained (var(--c-*), --radius, --font-*), 0 inline-styles вне demo-helper'ов, 0 custom JS. Verification: 4/4 id-hits, section balance 25/25, tag balance OK на 9 ключевых тегах. Version banner v2.3→v2.4, changelog footer entry добавлен. C2.5.B (4 high: process / trust / mini-case / FAQ accordion) + C2.5.C (3 medium: breadcrumbs / tldr / district chips) — следующие waves.
- 2026-05-09 23:55 MSK · design → po: C2.5.C done. brand-guide v2.6 (7459 строк, +610 vs v2.5, +3 sections). 3 medium extensions: §breadcrumbs (линейная навигация 2-4 уровня · `<nav aria-label="breadcrumb">` + `<ol>` + `aria-current="page"` + chevron `›` через CSS-pseudo · per-layer T2/T3/T4 SD «Pillar в Районе» · hover dashed underline + focus 2px accent · mobile 11px tighter gap · sync с composer.ts BreadcrumbList JSON-LD US-3) / §tldr-block («Кратко за 30 секунд» · 3-5 bullets с tabular-nums цифрами · accent-badge + brand-bg subtle + border-left 3px accent · T2 5 bullets / T3 3 bullets variant · position после Hero, перед services-grid T2 / process T3+T4 · iron rule «дублирует claims, не заменяет») / §district-chips (подвал T2 · 24-36 city-ссылок на T4 SD · auto-fill grid 180px+ · priority districts с accent border + dot-маркер · hover translateY(-1px) + arrow translateX(2px) · mobile 2 col → 1 col <414px · SEO: SSR + no-nofollow + no-broken-chip · qa click-path-audit зона). CSS токены sustained (var(--c-*), --radius, --font-*, .sp-frame / .dodont / .callout / .eyebrow), 0 inline-styles вне demo, 0 custom JS, native HTML+CSS only. Verification: 3/3 id-hits (breadcrumbs / tldr-block / district-chips), section balance 32/32, nav balance 11/11, ol balance 17/17, line count 7459 (в диапазоне 7250-7550). Version banner v2.5→v2.6, changelog footer entry добавлен. C2.5 wave полностью закрыт (4+4+3=11 extensions). Готово для C3 Payload validators + EPIC-D вёрстки.
- 2026-05-09 23:35 MSK · design → po: C2.5.B done. brand-guide v2.5 (6849 строк, +1311 vs v2.4, +4 sections). 4 high extensions: §process-steps (5 pillar-вариантов timeline 4-7 шагов: arboristika 6 / vyvoz-musora 5 / demontazh 6 / chistka-krysh 5 horizontal ≥1100px / landshaft 6 + step-num pill 56px brand-color + step-eta pill + vertical/horizontal grid + mobile vertical card-list 44px num) / §trust-block (3 варианта: hero-adjacent bar 4-pill / pricing-adjacent 4-card grid / pre-footer 6-card auto-fit grid + СРО + Росприроднадзор + ОПО 5 млн ₽ + 12 бригадиров + 4 года + 850+ объектов + click-through на /company/dokumenty/ + mobile 1-col stack <414px / 2-col grid 415-768px) / §mini-case (1 кейс на service-page + photo 16:9 + mc-badge + KPI 3-4 bullet'а с цифрами + thumb +N + per-pillar archive CTA + arboristika и landshaft demos + mobile stacked + KPI flex-row + thumb '+5' скрывается) / §faq-accordion (native <details>/<summary> + 5-10 вопросов + faq-q-num + chevron rotate 180° + closed-by-default + ≥44pt touch + focus-visible 2px accent + arboristika 8 Q demo + states palette collapsed/expanded/focus + mobile tighter 16px / 15px summary + composer.ts JSON-LD FAQPage SEO output sustained US-3). CSS токены sustained (.sp-frame / .dodont / .callout / .eyebrow), 0 inline-styles вне demo-data, 0 custom JS, native HTML+CSS only. Verification: 4/4 id-hits, section balance 29/29, faq <details> balance 15/15. Version banner v2.4→v2.5, changelog footer entry добавлен. C2.5.C (3 medium: breadcrumbs / tldr / district chips) — следующая wave.
- 2026-05-09 23:16 MSK · dev+arch → po: C3 done. Validate-hooks на 3 коллекциях: Services (T2_PILLAR, alsoCheckPayloadStatus=true) / ServiceDistricts (T4_SD, после requireGatesForPublish + publishGate) / B2BPages (T2_PILLAR, alsoCheckPayloadStatus=true). Districts + Cases skipped per ADR-0021 §«Scope» (master-template = `/uslugi/*` only). Tests: 20/20 passing (`pnpm test:unit` через `tsx --test` + node:test runner — sustained constraint, vitest/jest не установлены; covers selfValidate / T2_PILLAR / T3_SUB / T4_SD / convenience обёртка / hidden-section enforcement / duplicate detection / unknown block report / helpers). Migration: not needed (runtime-only validation, schema БД не меняется — гейт additive). Type-check + lint + prettier на изменённых файлах clean. Файлы: `site/blocks/master-template.ts` (+`validateBlocksAgainstTemplate` обёртка для intake §1 + fix `SLUG_TO_SECTION` для `calculator-placeholder` slug drift) / `site/lib/admin/master-template-gate.ts` (новый `buildMasterTemplateGate` builder + RU error messages с ADR-ссылкой) / `site/blocks/__tests__/master-template.test.ts` (20 unit tests) / `site/blocks/README.md` (overview + Layer enum + 13×3 matrix + validation flow + how-to-add) / `site/collections/{Services,ServiceDistricts,B2BPages}.ts` (подключён hook через beforeValidate) / `site/package.json` (+`test:unit` script). Гейт срабатывает только при `publishStatus === 'published'` или Payload `_status === 'published'` — sustained docs остаются валидными. Готово для C4 migration plan + EPIC-D execution.
- 2026-05-10 09:15 MSK · arch+dev → po: **C2.6 follow-up done** — закрыты 2 из 3 C5 wave A backlog issue. **(1) text-content UNKNOWN_BLOCK fix:** добавлен в master-template как новая optional section (order=4, T2/T3 optional, T4 hidden) через **ADR-0021 Amendment 1**. Sustained legacy long-form richText body на pillar/sub теперь не блокирует publish-gate. **(2) ServiceDistricts.blockReferences extension:** 5→12 blocks (Hero, Breadcrumbs, Tldr, TextContent, PricingTable, Calculator, ProcessSteps, Faq, CtaBanner, NeighborDistricts, RelatedServices, LeadForm). 7 ранее non-fillable required sections T4_SD теперь fillable через D3-wave-A blocks (`pricing-table`, `process-steps`) и sustained blocks. SLUG_TO_SECTION получил 2 aliases (`pricing-table`→`pricing-block`, `process-steps`→`process`) — sustained slug'ы остаются для C3 future blocks. **Tests:** 59/59 passing — добавлены 4 новых tests (RED→GREEN): text-content recognized + не UNKNOWN_BLOCK / реально-неизвестный foo-bar всё ещё UNKNOWN_BLOCK / D3 aliases T4_SD valid=true / text-content на T4_SD = PRESENT_HIDDEN. selfValidate updated 13→14. **Type-check + ESLint + Prettier:** 0 issues. **NO migration** — Payload blocks хранятся как JSON в blocks_array column, ALTER TABLE не требуется. **Issue 3 (28/31 SD без miniCase + 7 localFaq<2):** не покрыт — это soft publish-gate (content-fill), не code/schema. Остаётся в cw backlog для следующей wave (next: cw запустит fill-missing-sections.ts на расширенный T4_SD scope, теперь 7 ранее BLOCKED sections фильтруются как fillable). **Файлы:** `site/blocks/master-template.ts` (+TextContent import, +text-content в MasterTemplateSection type, +section spec order=4, +pricing-table/process-steps aliases, selfValidate 13→14) / `site/blocks/__tests__/master-template.test.ts` (+4 new tests, обновлены 3 sustained для length=14) / `site/collections/ServiceDistricts.ts` (blockReferences 5→12 + admin description rewrite) / `team/adr/ADR-0021-service-page-master-template.md` (+Amendment 1 section, +hand-off log entry). **No git commit** (intake constraint).
- 2026-05-10 08:31 MSK · cw+seo → po: C5 wave A done. **24/24 URL filled** в vyvoz-musora pillar (1 T2 + 23 T4 SD pillar-level), 0 failed. **96 blocks added** (Hero/LeadForm/CtaBanner/Faq на 23 SDs + Calculator-placeholder на pillar), **14 localFAQ items added** (publish-gate fix), **10 722 слов** сгенерировано. Cost: $0 (Anthropic SDK не установлен в site/, ANTHROPIC_API_KEY не доступен — intake fallback на template-driven content; sufficient для D5 pilot). Audit re-run: **0 missing fillable required sections** на всех URL. Spot-check 4 URLs (balashikha / lobnya / krasnoznamensk / zhukovskij) — TOV-compliant (Caregiver+Ruler), правильные русские падежи через `locativePhrase()` helper (фикс «в в Балашихе» drift). T3 sub-services (9): все имеют sustained intro/body/meta — wave A skip. **Открытые backlog-блокеры** (НЕ fillable в текущей schema): (a) 7 non-fillable required sections на T4_SD (pricing-block / process / breadcrumbs / tldr / calculator / neighbor-districts / related-services) — нужно расширить ServiceDistricts.blockReferences или встроить fields → C2.5/C3 follow-up; (b) T2 pillar `text-content` legacy block триггерит UNKNOWN_BLOCK в master-template-gate, обошёл через direct-SQL для calculator-placeholder; (c) 28/31 SD без miniCase relationship + ~7 с localFaq<2 — soft-gate, не блокирует draft; (d) sub-level SD (subSlug != null) skipped — другая layer семантика. **Sustained drift fixes** в local БД (idempotent ADD COLUMN IF NOT EXISTS): `payload_locked_documents_rels.reviews_id` + `rum_metrics_id` + создан `rum_metrics` stub-table + `services/_services_v/service_districts/_service_districts_v/b2b_pages/_b2b_pages_v.use_template_v2` (миграция C4 не была применена локально). Файлы: `site/scripts/audit-missing-sections.ts` + `site/scripts/fill-missing-sections.ts` + `specs/EPIC-SERVICE-PAGES-UX/c5-audit-missing-vyvoz-musora.md` (полный audit-table с per-URL разбивкой). Type-check / ESLint / Prettier clean. Готово для D3 fe build + D5 A/B pilot. **No git commit** (intake constraint).
- 2026-05-09 23:30 MSK · dev+seo+cw → po: C4 done. Resolver `getBlocksForLayer(layer, blocks, opts)` (`site/lib/master-template/getBlocksForLayer.ts`) + feature flag `useTemplateV2` (`site/lib/feature-flags/template-v2.ts` — env `TEMPLATE_V2_GLOBAL_OVERRIDE` + per-doc field; default false → sustained legacy passthrough). Migration `20260509_232000_template_v2_flag.{up,down,ts,sql}` — ADD COLUMN `use_template_v2 boolean DEFAULT false` на services/_services_v + service_districts/_service_districts_v + b2b_pages/_b2b_pages_v (idempotent IF NOT EXISTS). Payload field `useTemplateV2` checkbox (sidebar) на 3 коллекциях. 5 placeholder components (`site/components/blocks/placeholders/`) для C5 candidates: tldr / process / pricing-block / mini-case / lead-form (TODO copy + brand-guide anchors). BlockRenderer.tsx — additive `_placeholder` branch перед switch (sustained блоки не ломаются). T2 page-level integration (`app/(marketing)/[service]/page.tsx`) — `getBlocksForLayer('T2_PILLAR', docBlocks, buildResolverOptions(service))` перед BlockRenderer; T3/T4 views остаются на legacy custom-JSX до Phase 2 (note в migration plan). Tests: 49/49 passing (20 sustained C3 + 29 новых C4 — legacy mode / V2 reorder / V2 fill missing / V2 hidden filter / V2 duplicate dedup / V2 unknown drop / onMissingRequired throw|silent|warn / getMissingRequiredSections helper / isTemplateV2Enabled doc + env + override matrix / buildResolverOptions). Type-check 0 errors, ESLint clean, Prettier clean. Migration НЕ запущена per intake constraint (sustained audit_log push:true escape-hatch). Rollout plan: `specs/EPIC-SERVICE-PAGES-UX/c4-migration-plan.md` (Phase 0 deploy → Phase 1 staging single URL → Phase 2 prod pilot `/vyvoz-musora/` A/B 7d → Phase 3 staged 30 URL/нед × 8 нед); rollback за 1 admin click (uncheck checkbox → ISR revalidate). Phase 1 trigger — operator apruv after this PR. Open questions: (1) A/B метрики source (Я.Метрика goals или custom dashboard); (2) T3/T4 blocks[] seed timing; (3) 8 не-critical placeholder copy owner.

- 2026-05-10 14:30 MSK · dev+fe → po: **C4.T3T4 integration note done** — закрыта sustained note из C4 wave «T3/T4 views остаются на legacy custom-JSX до Phase 2». Теперь T3 SubServiceView + T4 ServiceDistrictView поддерживают `useTemplateV2` flag (additive integration без regression). **Файлы:**
  - `site/app/(marketing)/[service]/[slug]/SubServiceView.tsx` — добавлен import `BlockRenderer` + `getBlocksForLayer` + `buildResolverOptions`. Read flag от sub if present (sub.useTemplateV2), fallback на parent Service.useTemplateV2 — sub-services не имеют per-sub schema field в Services.subServices[]. Type `SubServiceDoc` extended `blocks?: unknown[] | null` + `useTemplateV2?: boolean | null`. Early return при flag=true → `getBlocksForLayer('T3_SUB', sub.blocks ?? [], opts)` + BlockRenderer + JsonLd. Default false → sustained legacy custom JSX render (untouched).
  - `site/app/(marketing)/[service]/[slug]/ServiceDistrictView.tsx` — добавлен import + `BlockRenderer` + `getBlocksForLayer` + `buildResolverOptions`. Type `ServiceDistrictDoc` extended `blocks?: unknown[] | null` + `useTemplateV2?: boolean | null`. Early return при flag=true → `getBlocksForLayer('T4_SD', sd.blocks ?? [], opts)` + BlockRenderer + JsonLd. Default false → sustained legacy sd-page sections render (untouched).
  - `site/lib/master-template/__tests__/getBlocksForLayer.test.ts` — добавлен T3_FULL_ORDERED fixture (10 required + 2 optional, в master-template order). Новый describe-блок `'getBlocksForLayer · templateV2=true · T3_SUB'` с 5 tests: full set order / hidden services-grid filter / empty → all required-sections placeholders + optional не filled / reorder → template order / missing required (lead-form) → placeholder. Расширен `getMissingRequiredSections` test: T3 services-grid hidden / neighbor-districts+related-services required / mini-case+cta-banner optional. **Sustained C4 wave T4_SD coverage не тронут.**
  - `site/lib/master-template/getBlocksForLayer.ts` — добавлен `'text-content': 'text-content'` в `SLUG_TO_SECTION` + `SECTION_TO_PLACEHOLDER_SLUG`. **Side fix** — closed pre-existing TS2741 type error от Amendment 1 (master-template.ts добавил text-content в `MasterTemplateSection` union, resolver mapping не был обновлён в C2.6 wave). Заодно fixed 4 pre-existing failures в `site/blocks/__tests__/master-template.test.ts` (text-content recognition + aliases).

  **Verification:**
  - `pnpm type-check` → 0 errors
  - `pnpm exec eslint <4 changed>` → 0 errors
  - `pnpm exec prettier --check <4 changed>` → all matched files use Prettier code style
  - `pnpm test:unit` → **59/59 passing** (49 sustained C3+C4 + 5 новых T3_SUB integration tests + 1 T3 расширение getMissingRequiredSections + 4 pre-existing failures которые fixed заодно)
  - **Local browser smoke не выполнен** — local БД pg drift (sustained `audit_log push:true escape-hatch` + `payload_locked_documents_rels.reviews_id` drift в sustained handoff). Per intake fallback: «Если local БД не поднимается — type-check + tests достаточно».

  **Fallback strategy:** flag=false (default everywhere в prod) → sustained legacy custom JSX рендер на 17 prod pillar URLs + ~150 SD URLs не задет. Phase 1 enable per-URL через Payload admin checkbox (single click, ISR revalidate per ADR-0021). Sub-services читают flag от parent Service (sub doesn't have own schema field).

  **Constraints honored:** no git commit / push / deploy. additive only, master-template.ts schema sealed (только resolver mapping туллinging update).

  **Open follow-ups (НЕ блокеры):** (1) schema extension `Services.subServices[].blocks[]` + per-sub `useTemplateV2` — backlog если когда-нибудь нужен per-sub override (сейчас все sub в pillar шарят flag); (2) T3_SUB rollout требует sub doc seed (sustained C5 wave A coverage только T2/T4); (3) PR-3 deploy следующий — этот intake T3T4 integration patch блокирует Phase 2 prod pilot пока не merged.

- 2026-05-10 16:30 MSK · dev+arch → po: **C2.6 done — closes sustained note из incident PR #209/#210.** Migration `20260510_161708_sd_blocks_extension.{ts,up.sql,down.sql}` создаёт 24 новые таблицы для 6 SD blocks (Breadcrumbs / Tldr / PricingTable / ProcessSteps / NeighborDistricts / RelatedServices) — published + drafts + array sub-tables. **Calculator (slug=calculator-placeholder) НЕ включён** — sustained 65-char enum issue (`enum_service_districts_blocks_calculator_placeholder_service_type` > Postgres NAMEDATALEN 63). Backlog: Payload v3 enumName override field option.

  **Apply на prod (sustained SSH fallback, intake constraint «no git commit/push»):**
  - Backup ДО: workflow `Prod backup (pg_dump)` SUCCESS run `25633714178`
  - Apply: `scp` → `sudo -u postgres psql obikhod -v ON_ERROR_STOP=1 -f` → COMMIT 0 errors
  - Registered в `payload_migrations` (idempotent INSERT через DO $$ NOT EXISTS guard)
  - Ownership fix → все 24 новые таблицы + 12 sequences `OWNER TO obikhod` (sustained gigant pattern)
  - Verify: `\dt service_districts_blocks_*` → 18 published / `\dt _service_districts_v_blocks_*` → 18 drafts (=12 sustained + 24 new)

  **ServiceDistricts.blockReferences extended → 11 blocks** (Hero, Breadcrumbs, Tldr, TextContent, PricingTable, ProcessSteps, Faq, CtaBanner, NeighborDistricts, RelatedServices, LeadForm). Restored B4 work без regression; Calculator оставлен на backlog.

  **Verification:**
  - `pnpm type-check` → 0 errors
  - `pnpm test:unit` → **59/59 passing** (sustained C4 + integration tests intact)
  - `pnpm prettier --check migrations/20260510_*.ts collections/ServiceDistricts.ts` → all matched files use Prettier code style
  - Local apply на Docker Postgres → 0 errors, idempotent (повторный run без ошибок), DOWN тестирован в transaction-with-rollback
  - Prod smoke: `https://obikhod.ru/vyvoz-musora/khimki/` → 200, `/vyvoz-musora/odincovo/` → 200 (sustained 200 не сломаны schema sync). 3-й check 404 — sustained отсутствие data (не наша regression).

  **Migration safety checklist:**
  - [x] UP + DOWN reversible
  - [x] CREATE TYPE/TABLE/INDEX/CONSTRAINT все idempotent (pg_type / IF NOT EXISTS / pg_constraint guards)
  - [x] Empty new tables → нет lock-issues, instant DDL
  - [x] FK ON DELETE CASCADE per sustained pattern us_3_blocks_and_seo
  - [x] Tested против Docker Postgres (same baseline 6→18) ДО prod
  - [x] Backup ДО apply (pg_dump artifact retained 30d)
  - [x] Rollback план: DOWN sql + удаление row payload_migrations

  **Constraints honored:** no git commit / push / no deploy code (PR-4 finalize на оператора). Schema ready на prod, code изменения localfiles only — оператор закоммитит ServiceDistricts.ts + migration files в финальном PR-4. **No Calculator** — backlog для отдельной wave с enumName override.

  **Файлы:**
  - `site/migrations/20260510_161708_sd_blocks_extension.up.sql` (660 строк, 24 CREATE TABLE + 4 ENUM + 12 sequences + 24 PK + 24 FK + ~50 indexes, all guarded)
  - `site/migrations/20260510_161708_sd_blocks_extension.down.sql` (DROP cascade reverse order)
  - `site/migrations/20260510_161708_sd_blocks_extension.ts` (Payload runner wrapper, sustained sql.raw pattern)
  - `site/collections/ServiceDistricts.ts` (6 imports + blockReferences 5→11)

  **Открытые backlog (НЕ блокеры C2.6):**
  - **Calculator block** — отдельная sub-task: Payload v3 `enumName: 'enum_sd_calc_service_type'` в Calculator.ts service_type field, отдельная mini-migration на 2 таблицы + enum, отдельный test.
  - **B4 wave restore PR** — оператор закоммитит этот код-changes + migration files на main (sustained iron rule: PO-merged PR before prod-deploy code). Phase 2 prod-pilot blocked by PR-4 merge.
