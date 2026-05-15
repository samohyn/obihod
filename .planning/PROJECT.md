# Обиход

## What This Is

«Обиход» — комплексный подрядчик «порядок под ключ» для Москвы и МО: 5 сервисных pillar (вывоз мусора, арбористика и уход за садом, чистка крыш от снега, демонтаж, дизайн ландшафта) для B2C (частные дома, дачи) и B2B (УК, ТСЖ, FM, застройщики, госзаказ). Сайт — главный канал лидогенерации; цель — приносить квалифицированные заявки на услуги.

## Core Value

**Один лид через сайт стоит дешевле, чем у любого из 3 ключевых конкурентов (liwood.ru / arboristik.ru / arborist.su), потому что мы выигрываем по SEO/Schema/CRO/B2B-trail и закрываем фото→смета за 10 минут через Claude API.**

## Current Milestone: v1.0 Overtake-3

**Goal:** Сделать сайт «Обиход» измеримо лучше 3 ключевых конкурентов (liwood.ru, arboristik.ru, arborist.su) одновременно по 8 SEO/UX/B2B-осям и получить устойчивое лидерство в Москве/МО.

**Target features:**
- Live decision-grade benchmark arboristik.ru (8 осей × verdict × gap × proposed action)
- Live decision-grade benchmark arborist.su (8 осей × verdict × gap × proposed action)
- Cross-competitor roadmap: объединённые leverage-points 3 benchmarks → новые US с RICE, без дублирования existing OVT-1..7 / US-2..11
- Расширение weekly monitoring 1 → 3 конкурентов (OVT-MONITOR watcher.ts: sitemaps + URL-counts + JSON-LD coverage по arboristik.ru и arborist.su)
- Завершение open execution: OVT-1..7 + EPIC-SEO-COMPETE-3 US-2..11 до DoD в окне milestone

## Requirements

### Validated

<!-- Shipped и подтверждено в prod на 2026-05-15 -->

- ✓ Programmatic SD по 5 pillar × ~40 districts = ~211 URL в sitemap (EPIC-SEO-CONTENT-FILL deployed 2026-05-03)
- ✓ JSON-LD coverage 100% (Service / FAQPage / LocalBusiness / BreadcrumbList / Article на blog) — composer.ts
- ✓ Лид-захват E2E: LeadForm → Payload Leads → Telegram оператору (US-8 W15 launch 2026-05-03)
- ✓ RUM в проде: useReportWebVitals + /api/rum endpoint + Payload RumMetrics (OVT-3 shipped 2026-05-09)
- ✓ Weekly monitoring liwood: watcher.ts + .github/workflows/seo-monitor.yml (OVT-MONITOR shipped 2026-05-09)
- ✓ E-E-A-T baseline: 4 авторов с Person schema + reviewedBy + lastReviewedAt (US-11)
- ✓ Service-page master-template v2.3 (T2_PILLAR) + rollout 5 pillar (EPIC-SERVICE-PAGES-REDESIGN D3/D5 2026-05-11)
- ✓ Brand: design-system/brand-guide.html v2.3 как единый source of truth (§1-14 services + §30-32 auth + §33 chrome)

### Active (Milestone v1.0 — Overtake-3)

- [ ] **BENCHMARK-ARB-01**: Live decision-grade benchmark arboristik.ru по 8 осям (URL/IA, Content depth, On-page SEO, Schema/JSON-LD, E-E-A-T, CRO/lead-flow, CWV/tech, B2B/local)
- [ ] **BENCHMARK-ARBSU-01**: Live decision-grade benchmark arborist.su по 8 осям
- [ ] **ROADMAP-CROSS-01**: Cross-competitor roadmap — объединённые leverage-points 3 benchmarks → новые US с RICE
- [ ] **MONITOR-3X-01**: Расширить OVT-MONITOR с 1 → 3 конкурентов (sitemaps + URL-counts + JSON-LD)
- [ ] **EXEC-COMPLETE-01**: Завершить open OVT-1..7 + US-2..11 (status `now`/`next`) до DoD

### Out of Scope

- **Магазин саженцев и растений** — dropped 2026-05-09 (ADR-0020). Landshaft переподшит как 5-й pillar услуг.
- **Tilda / WordPress / Bitrix / Astro** — отвергнуто в `contex/04_competitor_tech_stacks.md`; сохраняем Next 16 + Payload 3.
- **Vercel / Strapi / Directus** — РФ-юрисдикция 152-ФЗ; используем Beget VPS.
- **Финтех-следы в агентах** — не упоминать банк, брокер, ЦБ РФ, KYC, AML (запрет CLAUDE.md).
- **Замена brand/TOV/оффера** — Immutable по `contex/03_brand_naming.md` и `design-system/brand-guide.html` v2.3.
- **Параллельные эпики execution-level вне `specs/EPIC-*`** — `.planning/` хранит стратегию + REQ-IDs, исполнение остаётся в `specs/` (CLAUDE.md task tracker).

## Context

**Brownfield состояние** (на 2026-05-15):
- Prod live на Beget VPS (`45.153.190.107`), домен obikhod.ru, 174+ URL в sitemap
- Стек: Next.js 16 (App Router + RSC + Turbopack), Payload 3 embed, PostgreSQL 16, pnpm + Docker Postgres локально
- CI/CD: GitHub Actions ci.yml + deploy.yml, Dependabot weekly, Playwright E2E
- Команда: 9 ролей Scrum (po, dev, fe, seo, cw, design, qa, devops, arch) на `claude-opus-4-7`
- Иконки/фото генерим через fal.ai (Nano Banana Pro); UI компоненты — только из brand-guide.html (iron rule «brand-guide-first»)
- Активные параллельные программы: «Обиход 2.0» (4 эпика, apruved 2026-05-09) — EPIC-SHOP-REMOVAL (now), EPIC-LIWOOD-OVERTAKE (now, B5 done), EPIC-SERVICE-PAGES-UX (next), EPIC-SERVICE-PAGES-REDESIGN (later)
- Конкурентный snapshot (2026-04-15 + 2026-05-09): рынок фрагментирован, лидер по комплексности — arboristik.ru (4 ниши); эталон сезонного сглаживания — liwood.ru; B2B-вход — alpbond.org / promtehalp.ru; нишевые мастера — ~16 доменов

**Bench vs liwood (2026-05-09):** 5 LEAD / 1 PARITY / 2 LAG. Pending для milestone Overtake-3: аналогичные benchmark по arboristik.ru и arborist.su + кросс-сопоставление.

## Constraints

- **Tech stack:** Next.js 16 + Payload 3 + PostgreSQL 16 — не менять без оператор-approve (`contex/04_competitor_tech_stacks.md`)
- **Hosting:** Beget VPS на старте; YC/Selectel только при росте B2B-SLA — РФ-юрисдикция 152-ФЗ обязательна
- **Task tracker:** `specs/EPIC-*` + `team/backlog.md` остаются единственным execution-tracker'ом. `.planning/` — стратегический layer **поверх**, не замена
- **Brand-guide-first:** UI компоненты ТОЛЬКО из `design-system/brand-guide.html` v2.3; если секции нет — design сначала PR в brand-guide, потом fe верстает
- **Iron rules:** skill-check (frontmatter.skills) · green CI before merge · qa real-browser smoke before approve · merge = qa+po approve + CI green
- **AI: Claude API only for backend AI** (photo→quote calculator); fal.ai — иконки/фото/моки; UI/copy — не AI-generated
- **Prompt caching обязательно** для Claude API вызовов (skill `claude-api`)
- **Хуки:** `protect-secrets`, `block-dangerous-bash`, `protect-immutable`, `session-bootstrap` — не обходить

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Стек Next 16 + Payload 3 (не Tilda/WP/Bitrix) | Headless CMS + RSC + СВО на Beget; кастомные коллекции под Districts/Services/Leads | ✓ Good — prod stable |
| Beget VPS на старте | РФ-юрисдикция, 152-ФЗ, бюджет ≤ 5k₽/мес | ✓ Good |
| ADR-0017: 4-6 JSON-LD узлов на каждой service-странице | liwood не делает Service/FAQPage/BreadcrumbList на T2/T3/T4 → +50pp rich-results window | ✓ Good — confirmed live 2026-05-09 |
| ADR-0018: URL-map compete-3 (5 pillar + 35 sub + ~211 SD) | программная глубина под Москву/МО, переплюнуть liwood по объёму | ✓ Good — 174+ URL live |
| ADR-0020 (2026-05-09): магазин саженцев вне проекта, landshaft = 5-й pillar | фокус 100% на сервисах; remove shop role (10→9) | ✓ Good — EPIC-SHOP-REMOVAL active |
| ADR-0021: T2 master-template для всех 5 pillar | устранить ad-hoc вёрстку, mobile-first; pixel-perfect по brand-guide v2.3 | ✓ Good — D3/D5 done 2026-05-11 |
| Brand v2.3 Caregiver+Ruler (без Sage shop) | services-only фокус после ADR-0020 | ✓ Good |
| `.planning/` как стратегический layer поверх `specs/` (2026-05-15) | оператор apruved для GSD-milestone Overtake-3 | — Pending evaluation |
| photo→quote Claude API USP | никто из 17 конкурентов в нише не делает; differentiator | ✓ Good — confirmed live |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-15 after Milestone v1.0 Overtake-3 initialization*
