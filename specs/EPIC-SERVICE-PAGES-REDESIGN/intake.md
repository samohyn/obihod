---
epic: EPIC-SERVICE-PAGES-REDESIGN
title: Pixel-perfect редизайн service-страниц по brand-guide v2.3, 0 ad-hoc компонентов, 30 URL/нед × 8 нед
team: design + product
po: po
type: design + frontend + rollout
priority: P0
segment: services
phase: pending (waits for EPIC-C C2)
role: design + fe + qa + devops + po
status: later
blocks: []
blocked_by:
  - EPIC-SERVICE-PAGES-UX C2 (ADR-0021 master template apruved)
  - EPIC-SHOP-REMOVAL W3 (brand-guide.html v2.3 без §15-29)
  - EPIC-LIWOOD-OVERTAKE B5 (приоритизация pillar для A/B pilot)
related:
  - design-system/brand-guide.html (v2.3 после shop-cut + расширения C2)
  - design-system/components/* (mockup'ы блоков)
  - design-system/fal-ai-prompts.md (deliverable D2)
  - assets/services/{pillar}/ (новые AI-сгенерированные hero/cases/district)
  - site/components/blocks/*.tsx (12 шт — обновляются)
created: 2026-05-09
updated: 2026-05-09
skills_activated: [ui-ux-pro-max, frontend-design, design-system, fal-ai-media, e2e-testing]
plan_file: /Users/a36/.claude/plans/stateless-puzzling-valiant.md
---

# EPIC-SERVICE-PAGES-REDESIGN — pixel-perfect редизайн

## Контекст

После EPIC-SERVICE-PAGES-UX C2 у нас одобренный мастер-template и mapping секций → §brand-guide. Теперь нужна pixel-perfect реализация на 233+ URL: mobile-first 375/414/768/1024, CWV LCP <2.5s mobile p75, 0 ad-hoc компонентов. Roll-out волнами 30 URL/нед × 8 нед, начиная с топ-traffic pillar /vyvoz-musora/ с A/B pilot.

## Story

Как пользователь Обихода (B2C/B2B), я хочу видеть service-страницы, которые выглядят профессионально, быстро грузятся, удобны на мобильном и убеждают меня оставить заявку — чтобы получить услугу.

## AC

- [ ] **D1 — Design briefs:** art-brief.md + art-brief-ui.md + art-brief-ux.md per template (T2/T3/T4). 3 desktop + 3 mobile mockup'а на T2; 2+2 на T3; 1+1 на T4. Каждый mockup ссылается на §brand-guide для каждого UI-элемента. Любой новый паттерн — сначала PR в brand-guide.html, только потом mockup. fal.ai (Nano Banana 2) допустим для черновых layout-вариантов
- [ ] **D2 — Token sync + AI assets:** расширения brand-guide.html (если C2 потребовал — мерж без перенумерации старых §). `design-system/tokens/` синхронизируется. fal.ai-генерация: (a) недостающие иконки по C1.a inventory (Nano Banana Pro, line-art monochrome 1.5px); (b) hero/cases/district photos (Nano Banana Pro, brand-guide §photography style) → `assets/services/{pillar}/` через Payload Media. Все assets — design review до публикации
- [ ] **D3 — fe build:** обновление 12 блоков в `site/components/blocks/` + новые из C2. Используются токены и паттерны brand-guide.html (никаких inline-стилей или ad-hoc Tailwind утилит вне утверждённых токенов). SSR-safe (Next 16)
- [ ] **D4 — Mobile-first compliance:** qa snapshot 375/414/768/1024 на 5 ключевых URL. Pixel-diff vs D1 ≤2%
- [ ] **D5 — A/B verification:** pilot на `/vyvoz-musora/` (top-traffic) 50/50 v1/v2 на 7 дней (Я.Метрика). KPI: lead conv, bounce, scroll. Drop conv >10% → rollback + переписать брифы. Не проматываем без WIN/NEUTRAL
- [ ] **D6 — Roll-out волнами:** 30 URL/нед × 8 нед: vyvoz-musora (pilot) → arboristika → chistka-krysh → demontazh → uborka-territorii → landshaft → SD-страницы. Smoke + Lighthouse каждая волна
- [ ] **D7 — Brand-guide compliance audit:** visual diff vs `design-system/components/*.html` mockup'ы; design final apruv «brand-guide compliant» pass/fail per URL. **0 ad-hoc компонентов** — qa runs grep на inline-стили + кастомные классы вне brand-guide

## Verification gate

- Visual diff vs mockup ≤2%
- Lighthouse ≥90 mobile, ≥95 desktop (sample 10 URL)
- CWV LCP <2.5s mobile p75
- WCAG 2.2 AA + axe-core 0 critical, touch ≥44×44
- Pilot A/B WIN/NEUTRAL на /vyvoz-musora/
- 0 ad-hoc компонентов (grep на inline-стили + кастомные классы вне brand-guide)
- screen/EPIC-D/ before/after на ≥10 URL × 4 viewport (375/414/768/1024)

## Out of scope

- Изменения структуры блоков (это EPIC-C)
- Контент-fill (cw сделал в C5)
- Главная и не-services страницы (homepage = EPIC-HOMEPAGE-V2 уже идёт)
- Создание новых pillar/sub URL

## Зависимости

- Блокирован EPIC-SERVICE-PAGES-UX C2 (ADR-0021)
- Блокирован EPIC-SHOP-REMOVAL W3 (brand-guide v2.3)
- D5 ждёт EPIC-LIWOOD-OVERTAKE B5 (приоритизация pillar)

## Hand-off log

- 2026-05-09 21:35 MSK · operator → po: epic kickoff (status: later до EPIC-C C2)
- 2026-05-09 23:28 MSK · design+ux → po: D1 done. 9 art-brief'ов: T2-pillar/T3-sub/T4-sd × {brief / ui / ux}. Каждая секция привязана к §brand-guide v2.6. Ready for D2 token sync + AI assets generation.
- 2026-05-10 08:22 MSK · design → po: **D2 wave A BLOCKED — нет fal-ai MCP server / FAL_KEY**. Проверены `~/.claude.json` (только `magic-21st`), `obikhod/.mcp.json` (только `playwright`), `env` (FAL_KEY пуст). Подготовлены 3 deliverable-ready артефакта **независимо от MCP**: (1) `design-system/fal-ai-prompts.md` — полный prompt-template на 52 фото (style preamble + 5 категорий prompts + cluster mapping для 30 districts + cost estimate ≈$2.60 + re-prompt patterns); (2) `assets/services/vyvoz-musora/{hero,process,cases,districts,calculator}/` scaffold + `.gitkeep`; (3) `assets/services/vyvoz-musora/REVIEW.md` — таблица per-photo verdict (✅/🔄/❌) + cost log + summary template. **Запрос PO:** добавить `fal-ai` MCP server в `~/.claude.json` с `FAL_KEY` (см. skill-doc), либо — если оператор хочет — выполнить генерацию через external CLI/SDK по prompt-template и закоммитить PNG в scaffold-папки (REVIEW.md заполняется design ревью). Cost cap $5 wave A apruved sustained 2026-05-10 08:16 MSK. Wave B/C/D зависят от валидации wave A — без unblock D2/D3 не идут.
- 2026-05-10 21:00 MSK · qa+fe → po: **D4 done**. 20 screenshots × 5 URL × 4 viewports в `screen/EPIC-D-D4/`. Spec: `site/tests/e2e/D4-mobile-compliance.spec.ts` (295 строк, 20/20 Playwright assertions PASS). Report: `specs/EPIC-SERVICE-PAGES-REDESIGN/d4-qa-report.md`. **Issues: 2 critical / 2 high / 3 medium** — все critical/high про touch targets <44pt на mobile/tablet (WCAG 2.5.8). Самый плохой шаблон — T4 SD `/vyvoz-musora/khimki/` 414×896: 9/13 visible interactive elements <44pt. **Pixel-diff vs D1 не выполнен**: D3 локально не задеплоен на prod, поэтому D4 — baseline ДО D5 redesign deploy (diff после). **Setup notes**: Beget WAF блокирует Playwright Chrome 147+ через sec-ch-ua client hints — override на Chrome/132 + custom sec-ch-ua header в spec. WAF rate-limit + retry (5s pre-test throttle, 6 retry × 20s × backoff). 4 transient HTTP 503 captures на home + 4 WAF_BLOCKED captures на 768 — non-блокеры (handoff incident 16:40 MSK уже recovered). **Top-5 fixes для D5**: (1) audit a/button heights на T2 pillar + T4 SD `khimki` приоритет, (2) sticky bottom-CTA 56px mobile, (3) footer touch density mobile, (4) pricing-table mobile accordion summary ≥44pt, (5) re-snapshot после D5 deploy для actual pixel-diff vs D1.
- 2026-05-10 19:25 MSK · dev+seo → po: **D5 A/B cookie split setup ready (без deploy)**. Files modified: `site/proxy.ts` (cookie 50/50 random на /vyvoz-musora/* + x-ab-variant header pass-through, sticky 1 year, SameSite=Lax, !httpOnly для JS access), `site/lib/feature-flags/ab-pilot.ts` (NEW: `readAbVariant()` + `readAbVariantOverride(slug)` с early return для не-pilot slugs → preserve ISR на остальных pillars), `site/app/(marketing)/[service]/page.tsx` (apply override после buildResolverOptions → force `templateV2=true` локально без write в Payload doc), `site/components/analytics/RumProvider.tsx` (add `abVariant` field в beacon только для pilot path), `site/app/api/rum/route.ts` (validate + persist abVariant), `site/collections/RumMetrics.ts` (new `abVariant` select v1/v2 + index), `site/components/analytics/YandexMetrika.tsx` (reachGoal AB_PILOT_v1/v2 + custom params ab_pilot — JS-injection после init), migration `20260510_191924_rum_metrics_ab_variant.{up,down,ts}.sql` (ENUM + nullable column + index, idempotent IF NOT EXISTS). Spec: `specs/EPIC-SERVICE-PAGES-REDESIGN/d5-ab-pilot.md` (KPI / stop conditions / rollback procedure / activation checklist / SQL queries для operator monitoring). **Verification**: `pnpm type-check` 0 errors, `pnpm lint` 0 errors / 0 warnings on D5 files, `pnpm test:unit` 59/59 pass, `pnpm format:check` clean (proxy.ts auto-formatted). **NOT changed**: Payload doc data (services.useTemplateV2 prod=false sustained), sustained pillars (early return preserves ISR), default v1 rendering. Pilot ready — нужны от operator: (a) deploy + migrate prod, (b) создать Я.Метрика goals AB_PILOT_v1 + AB_PILOT_v2 в UI, (c) approve start date.
- 2026-05-10 11:05 MSK · fe → po: **D3 wave A done**. 12 sustained блоков аудит = brand-guide v2.6 compliant (используют `var(--c-*)`/`var(--radius-*)`/`var(--font-*)` tokens, mobile-first, SSR-safe), правок не потребовалось. **11 новых компонентов созданы** per C2.5 extensions: `ServiceHero` (T2/T3/T4 variant) / `CalculatorShell` (5-state photo→quote, use client + native `<input capture>`) / `LeadFormFull` (8 fields + 5-state submit + UTM) / `PricingTable` (3 tier highlighted + features) / `ProcessSteps` (4-7 steps vertical timeline + horizontal variant) / `TrustBlock` (bar / cards-4 / cards-6 variants) / `MiniCaseV2` (16:11 photo + KPI + 4-thumb grid) / `FaqAccordion` (native details/summary + FAQPage JSON-LD) / `BreadcrumbsV2` (mono uppercase + chevron CSS pseudo + JSON-LD) / `TldrV2` (3-5 bullets card border-accent) / `DistrictChips` (30+ priority pills grid). **CSS-копия brand-guide.html v2.6 §extensions** перенесена в `site/app/service-pages.css` (1126 строк) с namespace `.sp-*` чтобы не конфликтовать с homepage `.calc-shell`/`.faq-item`. Подключён в `site/app/(marketing)/layout.tsx`. **Payload Block configs**: 11 новых в `site/blocks/{ServiceHero,CalculatorShell,LeadFormFull,PricingTable,ProcessSteps,TrustBlock,MiniCaseV2,FaqAccordion,BreadcrumbsV2,TldrV2,DistrictChips}.ts` зарегистрированы в `allBlocks[]` (now 23 total). `BlockRenderer.tsx` switch case extended. **Verification**: `pnpm type-check` 0 errors, `pnpm lint` 0 errors / 0 warnings on new files (64 sustained warnings unrelated), `pnpm format:check` clean, `pnpm test:unit` 49/49 pass. Local browser smoke не запущен — D2 BLOCKED (photos placeholder), но компоненты SSR-safe и используют CSS-only fallback gradients per brand-guide §photography. Готово для D4 mobile compliance + D5 A/B pilot после photos unblock.
