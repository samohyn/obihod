---
title: Liwood overtake roadmap — 8-12 нед
date: 2026-05-09
epic: EPIC-LIWOOD-OVERTAKE B5
owners: [seo, arch, po]
skills_activated: [seo, market-research, product-capability]
sources:
  - seosite/01-competitors/liwood-snapshot-2026-05-09.json (B1)
  - seosite/01-competitors/liwood-vs-obikhod-2026-05-W.md (B2 + B3 classification)
  - seosite/01-competitors/liwood-page-anatomy-2026-05.md (C1.b)
  - team/adr/ADR-0020-shop-sunset-landshaft-positioning.md
  - team/adr/ADR-0021-service-page-master-template.md
  - team/backlog.md (B4 — 9 OVT-* US)
status: draft (pending operator apruv)
---

# Liwood overtake roadmap — 8-12 нед

## Контекст

EPIC-LIWOOD-OVERTAKE B2 benchmark показал **5 LEAD / 1 PARITY / 1 LAG / 1 likely-LEAD pending** по 8 осям. B3 classification зафиксировал per-axis action class (marketing-angle / monitoring / US с RICE / enrichment). B4 разложил LAG-ось и enrichment-задачу в 9 новых US (OVT-1..7 + OVT-MONITOR + OVT-MKT) с covered-by check vs existing EPICs.

Этот документ — execution-roadmap на 8-12 недель: RACI, Gantt, dependencies, operator actions. После apruv'а оператора → рассасывается в backlog существующих и новых эпиков.

## Цели roadmap

1. **Закрыть LAG ось 8 (B2B/local)** — naполнение 6 B2B PDF + Я.Карты embed + Я.Бизнес owner setup за 4-6 нед
2. **Confirm LIKELY-LEAD ось 7 (CWV)** — RUM в проде + PSI bench liwood за 2 нед, чтобы verdict финализировался
3. **Maintain 5 LEAD axes** — weekly threshold monitoring (OVT-MONITOR) + marketing-angle assets (OVT-MKT) для PR/sales-deck/Я.Директ
4. **Extend программную мощь** — landshaft (5-й pillar) → +30 SD; sub × city для топ-3 sub в каждом pillar → +90 SD; uplift unique content 25-30% → 35-40% на топ-50 SD
5. **First-mover advantage** — видео-кейсы (никто из 17 конкурентов не делает) + photo→quote AI USP amplification

## RACI matrix

| US | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| **OVT-MONITOR** | seo + devops | po | seo-content | operator |
| **OVT-3** RUM | dev + devops | po + seo | qa | operator |
| **OVT-4** Я.Карты + Я.Бизнес | seo + dev + cw | po | design | **operator (owner Я.Бизнес setup)** |
| **OVT-2** B2B-trail content | cw + seo | po + poseo | design + dev | operator |
| **OVT-1** SD extension 154→250 | seo + cw + dev | po + poseo | dba + arch | operator |
| **OVT-7** Landshaft SD seed (sub OVT-1) | seo + cw + dev + dba | po + poseo | arch + design | operator |
| **OVT-5** Video case studies | art + cw + dev + design | po | qa | **operator (real footage coordination)** |
| **OVT-6** AggregateRating + reviews | cw + popanel + design | po | seo | operator |
| **OVT-MKT** Marketing-angle assets | cw + design | po | seo | operator |

**Conventions:**
- **R** = выполняет (может быть несколько)
- **A** = отвечает за результат (всегда один)
- **C** = консультируется (заранее)
- **I** = ставится в известность (после)

## Gantt — 8-12 недель

```
Wave 1 (W1-W2) — Quick wins + monitoring foundation
─────────────────────────────────────────────────────
W1  ████ OVT-MONITOR (cron + Topvisor + sitemap watcher)         [seo+devops]
W1  ████ OVT-3 RUM instrumentation (web-vitals lib + endpoint)   [dev+devops]
W2  ████ OVT-3 PSI bench liwood (3 URL × mobile/desktop)         [seo]
W2  ████ OVT-3 verdict confirm/downgrade ось 7                    [seo+po]

Wave 2 (W3-W6) — LAG closure (B2B/local)
─────────────────────────────────────────────────────
W3  ████ OVT-4 LocalBusiness JSON-LD enrich на 100% T4           [dev+seo]
W3  ████ OVT-4 Я.Карты embed lazy-load на топ-10 SD              [dev+seo]
W3-4 ███ OVT-4 Я.Бизнес owner setup [BLOCKED: operator action]   [operator]
W4-6 ████████ OVT-2 B2B-trail 6 PDF lendings (covered-by US-6)   [cw+seo+design]
     ── parallel ──
W3-4 ████ OVT-MKT marketing-angle assets phase 1 (PR + sales)     [cw+design]

Wave 3 (W6-W8) — Programmatic extension Phase A
─────────────────────────────────────────────────────
W6  ████ EPIC-SHOP-REMOVAL.W1 closure → ADR-0020 confirmed       [arch+po]
W6  ████ EPIC-SERVICE-PAGES-UX C2 master-template apruv           [design+po]
W6-8 ████████ OVT-7/OVT-1 Phase A landshaft × 30 city SD seed    [seo+cw+dev+dba]
W7-8 ████ OVT-6 AggregateRating + reviews uplift (≥30 reviews)   [cw+popanel]

Wave 4 (W9-W12) — Programmatic extension Phase B + Video
─────────────────────────────────────────────────────
W9-10 ████████ OVT-1 Phase B sub × city для топ-3 sub × pillar   [seo+cw+dev]
W9-10 ████ OVT-1 Phase C unique content uplift 25-30% → 35-40%   [cw+seo]
W10-12 ████████████ OVT-5 Video case studies 4-5 видео           [art+cw+dev]
W11-12 ████ OVT-MKT marketing-angle assets phase 2 (Я.Директ)    [cw+design]

Continuous (W1-W12) — Background monitoring
─────────────────────────────────────────────────────
W1-12 ░░░░░░░░░░░░ OVT-MONITOR weekly tracker + threshold alerts [seo]
```

### Сводка по неделям

| Неделя | US active | Deliverables |
|---|---|---|
| W1 | OVT-MONITOR + OVT-3 (RUM) | Cron weekly tracker live, RUM web-vitals в проде |
| W2 | OVT-3 finish | PSI bench done, ось 7 verdict финализирован (LEAD/PARITY/LAG) |
| W3 | OVT-4 (Я.Карты + LocalBusiness) + OVT-MKT phase 1 | Я.Карты embed live на 10 SD, sales deck v2 draft |
| W4 | OVT-4 + OVT-2 (B2B start) + OVT-MKT phase 1 | Я.Бизнес owner setup confirmed, 2/6 B2B PDF черновика |
| W5 | OVT-2 (B2B middle) | 4/6 B2B PDF + content draft |
| W6 | OVT-2 finish + OVT-7/OVT-1 Phase A start | 6/6 B2B published, landshaft 5-й pillar T2 seeded |
| W7 | OVT-7/OVT-1 Phase A + OVT-6 | 30 landshaft SD seeded, 15 reviews собрано |
| W8 | OVT-7/OVT-1 Phase A finish + OVT-6 | 30 landshaft SD published + AggregateRating live на 100% T2, 30 reviews |
| W9 | OVT-1 Phase B start + OVT-5 (video brief) | sub × city scaffold (90 URL), video brief + storyboard 4-5 |
| W10 | OVT-1 Phase B + OVT-1 Phase C + OVT-5 (filming) | 60/90 sub × city published, 35-40% unique top-50, 2-3 видео сняты |
| W11 | OVT-1 Phase B finish + OVT-5 (post-prod) + OVT-MKT phase 2 | 90/90 sub × city published, 4-5 видео в монтаже, Я.Директ rich-snippet preview |
| W12 | OVT-5 finish + final audit | 4-5 видео embed на T2/T4, Lighthouse + Topvisor full audit |

## Зависимости

### Блокирующие (hard dependencies)

1. **OVT-1 Phase A + OVT-7 ждут EPIC-SHOP-REMOVAL.W1 closure** — landshaft = 5-й pillar fixed в ADR-0020. ETA: ~W6.
2. **OVT-7 ждёт EPIC-SERVICE-PAGES-UX C2 apruva** — master-template для landshaft SD layer. ETA: ~W6.
3. **OVT-4 ждёт operator Я.Бизнес owner setup** — карточка верифицирована. ETA: blocked, operator action required ASAP.
4. **OVT-5 ждёт EPIC-HOMEPAGE-V2 US-17 photo production** — реальные кадры для видео. ETA: external, operator-driven.
5. **OVT-2 covered-by EPIC-SEO-COMPETE-3 US-6 Track A** — operator approved 2026-05-06. ETA: эскалация в active с W4.

### Soft dependencies (parallel-ok)

- **OVT-MONITOR** ↔ OVT-3 — оба используют `web-vitals` lib, можно поделить endpoint
- **OVT-4** ↔ OVT-2 — оба обогащают B2B/local trail, share design (ClientLogos block, JSON-LD pattern)
- **OVT-6** ↔ OVT-9 (covered-by US-9 Phase 2) — Reviews collection UI iteration shared
- **OVT-MKT** phase 2 ↔ OVT-1 Phase B — marketing-angle для landshaft pillar после Phase A confirm

### Зависимости от existing programs

| OVT | Зависит от | EPIC | Текущий статус |
|---|---|---|---|
| OVT-1 | landshaft = 5-й pillar | EPIC-SHOP-REMOVAL.W1 + ADR-0020 | active 2026-05-09 |
| OVT-1 | master-template для T4 SD | EPIC-SERVICE-PAGES-UX C2 (ADR-0021) | accepted 2026-05-09 |
| OVT-2 | B2B PDF templates legal | EPIC-SEO-COMPETE-3 US-6 Track A | dev-ready, blocked-by ADR-0018 review |
| OVT-4 | Я.Бизнес карточка | EPIC-SEO-COMPETE-3 US-9 Phase 2 | operator owner |
| OVT-5 | photo production | EPIC-HOMEPAGE-V2 US-17 | external |
| OVT-6 | Reviews collection UI | EPIC-SEO-COMPETE-3 US-9 Phase 1 done | sustained |
| OVT-7 | landshaft pillar route | EPIC-SHOP-REMOVAL.W2 + ADR-0020 | sequential after OVT-1 Phase A |

## Operator actions required

Roadmap pending operator apruv по этим пунктам ДО W1 kickoff:

1. **Apruv общего roadmap** — confirm 9 OVT-* US в `team/backlog.md` секции «Liwood overtake roadmap (B5)»
2. **Я.Бизнес owner setup ETA** — operator-driven (OVT-4 hard blocker). Sustained: «owner сам, координация через poseo». Решение по W3-W4 setup window.
3. **OVT-5 video footage** — operator coordination с EPIC-HOMEPAGE-V2 US-17 photo production. Видео нужно отдельно от фото, либо совмещать съёмочный день. Решение к W8.
4. **OVT-MKT phase 1 budget** — Я.Директ rich-snippet preview screenshots требуют test-кампании (~5-10k₽). PR-история — без budget (cw + design делают своими руками).
5. **Confirm `operator-driven` дата ADR-0020 closure** — критично для OVT-1 Phase A старта

## Operator actions optional (nice-to-have)

- Решение по 6-му pillar (например `klining` если operator примет business case за пределами landshaft) — расширит OVT-1 ROI
- Я.Директ A/B бюджет для photo→quote AI promo (OVT-MKT amplification)
- 2GIS / Google Business Profile parity setup (если operator-driven, расширит OVT-4 trail)

## Метрики успеха (DoD roadmap)

После W12 (12 нед от kickoff):

| Метрика | Baseline 2026-05-09 | Target W12 | Source |
|---|---|---|---|
| Total `/uslugi/` URL | 211 | ≥250 | sitemap.ts count |
| Schema coverage T2/T3/T4 | 100% (4-6 nodes) | maintain 100% | composer.ts + Rich Results Test |
| Я.Карты embed coverage T4 | 0/154 | ≥10 топ SD | manual audit |
| Я.Бизнес карточка | unknown | verified + AggregateRating | operator confirm |
| B2B PDF lendings | 0/6 | 6/6 published | sitemap.ts /b2b/ count |
| Video кейсы | 0 | ≥4 embed на T2/T4 | manual + VideoObject schema |
| AggregateRating | 0 reviews | ≥30 reviews + ratingValue | Reviews collection count |
| RUM LCP mobile p75 | unknown | <2.5s | RUM dashboard |
| RUM CLS p75 | unknown | <0.1 | RUM dashboard |
| RUM INP p75 | unknown | <200ms | RUM dashboard |
| Liwood overtake confirm | 5 LEAD / 1 PARITY / 1 LAG / 1 pending | 6 LEAD / 1 PARITY / 1 LEAD-confirmed | post-W12 benchmark refresh |
| Top-50 keys count Обиход | ~2300 (estimated W3 closure) | ≥3500 | Topvisor weekly |
| Leads/нед | sustained baseline (US-8) | +30% over baseline | amoCRM/Telegram count |

## Что следующее (after W12)

После закрытия roadmap (~W12, 2026-08-01):

- **Re-benchmark liwood** через свежий B1 snapshot — measure overtake delta
- **A/B test photo→quote AI** на pilot pillar (OVT-MKT phase 2 confirm)
- **Wave 5 candidates** — расширение в смежные ниши (klining как 6-й pillar? landshaft sub × city × district?)
- **EPIC-LIWOOD-OVERTAKE closure ADR** — фиксация результатов overtake для будущих benchmark циклов

## Hand-off log

- 2026-05-09 22:50 MSK · seo+arch+po → operator: B5 roadmap drafted. 9 OVT-* US с RICE и covered-by. RACI + Gantt 8-12 нед + dependencies + 5 operator actions required. **Pending operator apruv** до W1 kickoff. После apruva → распределение в backlog существующих эпиков и новые `specs/OVT-*/` artefacts.
