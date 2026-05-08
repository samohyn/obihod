---
epic: EPIC-SEO-USLUGI
title: Раздел /uslugi/ — обгон liwood.ru/services/ по 6 параметрам (191 URL, JSON-LD 100%, E-E-A-T, CWV, +13% объём)
team: seo
po: poseo
type: programmatic + content + tech-seo + research
priority: P0
segment: services
phase: discovery
role: poseo
status: active
blocks: []
blocked_by:
  - EPIC-SEO-COMPETE-3 W14 closure (sustained)
related:
  - ADR-0018-url-map-compete-3 (зеркальный, не конфликтует)
  - ADR-0019-uslugi-routing-resolver (deliverable US-1)
  - seosite/01-competitors/liwood-page-templates-analysis-2026-05-07.md (sustained, расширяется в US-1)
  - TASK-NEWUI-TEMPLATES-W1 (макеты T1-T11, не дублирует — наш US-2 делает 4 шаблона С НУЛЯ под /uslugi/)
created: 2026-05-07
updated: 2026-05-07
skills_activated: [seo, blueprint, market-research, product-capability, project-flow-ops, search-first, product-lens]
plan_file: /Users/a36/.claude/plans/team-seo-poseo-md-joyful-globe.md
---

# EPIC-SEO-USLUGI — раздел /uslugi/ объективно лучше liwood

## Контекст

Конкурент liwood.ru — 169 URL в `/services/` (4 шаблона: hub / pillar / sub / SD), нулевая JSON-LD-разметка, broken Title на T4, 47 city-страниц только под одной услугой `udalenie-derevev`, тонкий контент 4/10. Наш текущий /uslugi/ — 5 pillar + 35 sub + ~28 SD; **нет общей hub-страницы `/uslugi/`** + нет programmatic SD на 5 pillar.

Эпик решает 6 разрывов одновременно:
1. URL-объём → 191 (+13% над liwood 169)
2. Programmatic SD → 150 (5 pillar × 30 cities, vs liwood 47 под одной услугой)
3. JSON-LD coverage → 100% (vs liwood 0%)
4. E-E-A-T → Author Person + reviewedBy + lastReviewedAt (vs liwood — нет)
5. CWV → LCP <2.5s mobile p75
6. Lead-flow → ≥10 leads/нед на week-4 после indexing

## DoD W22

| # | Метрика | Target | Verification |
|---|---|---|---|
| 1 | URL-объём в /uslugi/ | 191 (1+5+35+150) | `curl /sitemap.xml \| xmllint count` |
| 2 | JSON-LD coverage | 100% URL × ≥4 schema-types | Playwright `jsonld-coverage.spec.ts` + schema.org validator |
| 3 | CWV LCP mobile p75 | <2.5s | Lighthouse CI gate в release |
| 4 | Top-10 keys (Я.Вебмастер) | ≥80 | week-4 после indexing snapshot |
| 5 | Lead-flow на новые URL | ≥10 leads/нед на week-4 | Я.Метрика goal per pillar+district |
| 6 | Mobile breakpoints | 375/414/768/1024 OK | Playwright visual diff <0.1% |
| 7 | A11y | 0 critical violations | axe-core scan |
| 8 | Slug-namespace integrity | 0 collisions | `pnpm lint:slug` prebuild gate |

## 8 User Stories

| US | Title | Owner | blocked_by | ETA |
|---|---|---|---|---|
| **US-1** | Research+Spec — liwood-паспорт finalize, ADR-0019 routing-resolver, namespace-audit, 191-URL inventory.json, target-keys-191.csv | poseo + sa-seo | EPIC-SEO-COMPETE-3 W14 closure | 3 дня |
| **US-2** | newui/ макеты × 4 — T1 hub, T2 pillar, T3 sub, T4 SD, mobile-first 375/414/768/1024, brand-guide v2.2 | art + ux + ui | US-1 | 7 дней |
| **US-3** | Payload расширение — Districts +23 city seed, ServiceDistricts bulk-seed 150, namespace validate-hook, uniquenessScore impl, reviewedBy relationship на Services | dba + tamd + popanel | US-1 | 4 дня |
| **US-4** | Tech — slug-resolver page.tsx, 4 page-template, JSON-LD composer.ts, 2 helpers в jsonld.ts | seo-tech + podev | US-2, US-3 | 6 дней |
| **US-5** | Контент-волна 191 URL — 60 SD Class-A manual + 90 SD Class-B AI+manual review + 35 sub + 5 pillar + 1 hub | cw + seo-content | US-4 | 18 дней |
| **US-6** | QA — leadqa real-browser smoke 4 templates × 3 viewport, axe-core, Lighthouse CI | leadqa + qa-site | US-5 | 4 дня |
| **US-7** | Release — deploy, sitemap regen 191 URL, IndexNow ping, Я.Вебмастер upload, 7-day monitor | seo-tech + poseo + do | US-6 | 3 дня + 7 days monitor |
| **US-8** | Post-launch tuning — top-10 gap-fix, thin-page noindex review, CTR A/B на priority-30 SD | poseo | US-7 monitor data | 5 дней |

**Total ETA:** ~30 рабочих дней = 4-5 нед с overlap (US-2 || US-3, US-5 last 30% || US-6 первые дни). **Без параллели US** (iron rule этого эпика).

## Релиз-цикл per US (iron rule)

Каждый US закрывается отдельным релизом. **US-N+1 не стартует** пока US-N не задеплоен в прод и принят оператором.

```
[poseo] dispatch → [executors] dev complete (phase: dev)
  → [poseo] передача в QA (phase: qa)
  → [qa-site] internal QA (если код)
  → [leadqa] real-browser smoke ЛОКАЛЬНО → leadqa-N.md (PASS/BLOCK/CONDITIONAL)
  → [poseo] передача в release gate (phase: gate)
  → [operator] approve
  → [do] push → CI green → merge → deploy → post-deploy smoke
  → [poseo] phase: done → handoff в US-N+1
```

**poseo управляет**: оркестрирует фазы, подключает агентов, держит DoD каждого US.
**leadqa**: real-browser smoke ДО push, пишет leadqa-N.md.
**operator**: бизнес-апрув на основе leadqa-N.md.
**do**: зелёный CI ДО push, deploy после operator approve.

## Win-condition vs liwood

| Параметр | Liwood (sustained) | Обиход (target) | Δ |
|---|---|---|---|
| URL-объём в /services/-разделе | 169 | 191 | +13% |
| Programmatic SD pillar coverage | 1/15 (только удаление деревьев) | 5/5 (все pillar) | +400% pillar |
| Programmatic SD URL count | 47 | 150 | +220% |
| JSON-LD coverage | 0% | 100% | +∞ |
| E-E-A-T (Author + Modified date) | нет | да | + |
| AggregateRating везде | нет | да | + |
| CWV LCP mobile p75 | unknown (вероятно >3s) | <2.5s | + |
| Шаблоны под brand-guide | 1С-Битрикс старый | brand-guide v2.2 | + |

## Hand-off log

```
2026-05-07 · operator → poseo: дано добро, scope полный (191 URL), 30 cities × 5 pillar, 4 шаблона с нуля
2026-05-07 · operator → poseo: правило per-US release (leadqa local-verify → operator approve → do push → следующий US). poseo управляет, без параллели US.
2026-05-07 · poseo: skill seo активирован, plan записан в /Users/a36/.claude/plans/team-seo-poseo-md-joyful-globe.md, US-1 dispatch
2026-05-08 · US-1 closed: 9 deliverables + 1 modified, leadqa PASS 8/8 + RC ready 10/10, PR #183 → main `acef7311` merged operator. phase: done. → готов dispatch US-2 (newui/ макеты × 4 шаблона T1/T2/T3/T4 под brand-guide v2.2 mobile-first)
```
