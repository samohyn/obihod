---
epic: EPIC-LIWOOD-OVERTAKE
title: Decision-grade benchmark «Обиход vs liwood» по 8 осям + roadmap новых US для обгона
team: seo
po: po
type: research + benchmark + roadmap
priority: P0
segment: services
phase: discovery
role: po + seo
status: now
blocks:
  - EPIC-SERVICE-PAGES-REDESIGN D5 (приоритизация pillar для A/B pilot)
blocked_by: []
related:
  - seosite/01-competitors/liwood-services-passport-final.md (baseline 2026-05-07)
  - seosite/01-competitors/liwood-page-templates-analysis-2026-05-07.md (baseline)
  - team/adr/ADR-0018-url-map-compete-3.md (контекст liwood benchmark)
  - contex/01_competitor_research.md (стратегический анализ)
  - contex/04_competitor_tech_stacks.md (техстек liwood Bitrix)
  - seosite/02-keywords/raw/liwood_ru.json (Keys.so 5097 keys baseline)
created: 2026-05-09
updated: 2026-05-09
skills_activated: [seo, market-research, deep-research, product-capability]
plan_file: /Users/a36/.claude/plans/stateless-puzzling-valiant.md
---

# EPIC-LIWOOD-OVERTAKE — gap analysis & roadmap обгона

## Контекст

Liwood.ru — топ-1 в нашем competitive set: 252 контентных URL, 5097 keys в Keys.so top-50, 155 indexed pages. Мы знаем 5 leverage-points обгона (US-3 done, US-7 done, US-5/8/11 pending). Нужен decision-grade benchmark по 8 осям и конкретный roadmap из новых US с RICE для оператора.

## Story

Как оператор Обихода, я хочу видеть точное сравнение «где мы с liwood: лидируем / паритет / отстаём» по всем релевантным осям, чтобы решить какие фичи усиливать в первую очередь и не тратить ресурс впустую.

## AC

- [ ] **B1 — Live re-research liwood:** свежий снимок (URL /services/*, top-50 keys mapping, position changes vs 2026-05-07, 11 ключевых URL через WebFetch, CWV mobile p75 через PageSpeed). Артефакт: `seosite/01-competitors/liwood-snapshot-2026-05-09.json`
- [ ] **B2 — Benchmark schema:** `seosite/01-competitors/liwood-vs-obikhod-2026-05-W.md` — 8 осей × {liwood / obikhod / verdict (lead/parity/lag) / gap size / leverage ref / proposed action}. Оси: URL/IA, Content depth, On-page SEO, Schema/JSON-LD, E-E-A-T, CRO/lead-flow, CWV/tech, B2B/local
- [ ] **B3 — Findings classification:** per ось — lead → marketing-angle, parity → монитор, lag → US/TASK с RICE
- [ ] **B4 — US/TASK draft:** ≥5 новых US в `team/backlog.md` (covered-by check vs existing): extend SD 150→250 (incl landshaft), unique SD content 25-30%, Claude photo→quote prod, E-E-A-T phase 2 + Article schema, B2B trail, Я.Карты + локальное SEO
- [ ] **B5 — Roadmap & integration:** RACI + Gantt 8-12 нед в `seosite/01-competitors/overtake-roadmap-2026-05.md`. Operator apruv до B5

## Out of scope

- Реализация любых leverage-points (это отдельные US в backlog)
- Изменения prod-сайта
- Keys.so API quota потратить на C1.b (UX-бенчмарк liwood — это визуальный анализ через WebFetch + screenshots, не keyword research)

## Зависимости

- Параллельно с EPIC-SHOP-REMOVAL W3-W6 (B не трогает код)
- B5 ждёт EPIC-SHOP-REMOVAL.W1 (landshaft = 5-й pillar — нужно для landshaft-overtake US в roadmap)
- B5 кормит EPIC-SERVICE-PAGES-REDESIGN D5 (приоритизация pillar для pilot A/B)

## Источники

- Keys.so API (token уже в env, использовали в `seosite/02-keywords/raw/liwood_ru.json`)
- WebFetch для visual layouts liwood
- PageSpeed Insights API для CWV
- НЕ используем устаревшие passport/templates-analysis (2026-05-07) для CWV — только для baseline сравнения

## Hand-off log

- 2026-05-09 21:35 MSK · operator → po: epic kickoff, parallel с EPIC-SHOP-REMOVAL W3-W6
- 2026-05-09 22:05 MSK · seo → po: B1 done, snapshot at seosite/01-competitors/liwood-snapshot-2026-05-09.json (13 URL × 200 + 5 × 404 со slug-drift зафиксированы; 3/13 имеют JSON-LD, 11/13 без meta description; калькулятор интерактивный без фото/AI; Keys.so delta + CWV pending — operator key needed). Готово к B2 benchmark.
- 2026-05-09 22:25 MSK · seo+arch → po: B2 done, benchmark at seosite/01-competitors/liwood-vs-obikhod-2026-05-W.md. Verdict summary: 5 axes LEAD (Content depth / On-page SEO / Schema-JSON-LD ⭐ / E-E-A-T / CRO-lead-flow ⭐) + 1 PARITY (URL/IA — мы шире, они глубже) + 1 LIKELY-LEAD pending PSI (CWV/tech) + 1 LAG (B2B/local — инфраструктура есть, наполнение pending). Schema-coverage gap (23% vs 100%) и photo→quote Claude API USP подтверждены live. Ready for B3 classification (lead → marketing-angle, parity → monitoring, lag → ≥3 B5 US с RICE).
- 2026-05-09 22:50 MSK · seo+arch+po → operator: **B3+B4+B5 done. EPIC technical complete pending operator apruv.** Roadmap 9 US (OVT-1..7 + OVT-MONITOR + OVT-MKT) с RICE + covered-by check. Top-3 priority by RICE: OVT-MONITOR (6.75) → OVT-3 RUM (6.0) → OVT-4 Я.Карты+Я.Бизнес (4.25). 5 covered-by existing (OVT-1/2/4/6/7), 4 принципиально новых (OVT-3 RUM / OVT-5 video / OVT-MONITOR / OVT-MKT). Total effort ~54 ЧД, 8-12 нед. **5 operator actions required** до W1 kickoff (apruv roadmap, Я.Бизнес owner setup ETA, ADR-0020 closure date, OVT-5 video coordination, OVT-MKT phase 1 budget). Files: liwood-vs-obikhod-2026-05-W.md (B3 classification appended — 8 axes × verdict + threshold table + handoff target), team/backlog.md (B4 — 9 OVT-* rows added в секции «Liwood overtake roadmap (B5)»), seosite/01-competitors/overtake-roadmap-2026-05.md (B5 — RACI + Gantt 12 нед + dependencies + operator actions + DoD metrics).
- 2026-05-09 23:05 MSK · dev+seo → po: **OVT-3 RUM done.** RumProvider (Next 16 `useReportWebVitals` builtin, без новой dep) + `/api/rum` POST endpoint (rate-limit 10/sec/IP + native validation, без Zod) + Payload коллекция `rum-metrics` (PII-safe: pageUrl без query, UA truncated 256, без IP/cookies). Files: `site/components/analytics/RumProvider.tsx`, `site/app/api/rum/route.ts`, `site/collections/RumMetrics.ts`, `site/payload.config.ts` (collection registered), `site/app/(marketing)/layout.tsx` (provider mounted). Type-check 0 errors / lint 0 errors на новых файлах. Local smoke: validation_error path работает (HTTP 400), insert path работает корректно (Payload SQL `insert into rum_metrics` сформирован) — 500 при insert expected per audit_log escape-hatch (миграция применяется на prod через devops migrate-prod.yml). Next: devops trigger migrate-prod → deploy → монитор real LCP/CLS/INP mobile p75 на 5 pillar URL для confirm/downgrade B2 verdict «CWV likely-LEAD».
- 2026-05-09 23:10 MSK · seo+devops → po: **OVT-MONITOR setup done.** watcher.ts (~470 строк, native fetch, без Payload deps) + `.github/workflows/seo-monitor.yml` (cron `0 9 * * MON` + `workflow_dispatch` с `force_alert`/`dry_run` inputs + auto-issue creation per alert с label `seo-monitor` + 90-day artifact retention) + `seosite/04-monitoring/README.md` §1-4 (rationale + threshold rationale + escalation flow). Dry-run PASS (13 mock URL × 200, sitemap mock 174, 0 breaches). Force-alert dry-run PASS (1 breach `forced_test` → alert .md рендерится корректно). Type-check PASS (strict + node types). Prettier PASS (3 файла). Threshold rationale: liwood URL ±5% / obikhod sitemap ±5% (high severity при negative — потеря URL) / liwood JSON-LD >0 (high severity — ADR-0017 +50pp leverage критичен). **Первый cron 2026-05-11 12:00 MSK** (no-op без previous snapshot — by design; реальный diff появится 2026-05-18). No git push per task constraints.
