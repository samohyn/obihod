# Project Research Summary

**Project:** Обиход — Milestone v1.0 Overtake-3 (obikhod.ru обгон liwood.ru + arboristik.ru + arborist.su)
**Domain:** Brownfield SEO/CRO competitive-intelligence layer поверх Next.js 16 + Payload 3 + PostgreSQL 16 на Beget VPS (РФ-юрисдикция, 152-ФЗ); лидогенерационный сайт «порядок под ключ» 5 pillar × B2C+B2B
**Researched:** 2026-05-15
**Confidence:** HIGH

## Executive Summary

Это **brownfield-милстоун**: 174+ URL уже в prod, JSON-LD 100%, photo→quote AI, RUM, watcher.ts, 4 автора с Person Schema — sustained. Цель Overtake-3 — не «новый сайт», а **синтез 3 benchmarks** (liwood B2 sustained + arboristik + arborist.su) в один cross-roadmap, расширение watcher на 3 цели и **закрытие** уже открытых OVT-1..7 + US-2..11. Никаких новых стеков, никакого UI-рерайта — точечные хирургические правки в `seosite/04-monitoring/watcher.ts`, артефакты в `seosite/01-competitors/` по sustained pattern, REQ-bridge через `.planning/`.

**Рекомендованный подход:** один EPIC `EPIC-OVERTAKE-3-RESEARCH` с 5 фазами (B1×2 parallel-safe → cross-roadmap → monitor-3x extension → exec-complete parallel) поверх sustained 9-ролевой Scrum-команды. Stack-additions минимальные: 3 npm libs (`fast-xml-parser` + `node-html-parser` + `p-limit`) + 6 правок `watcher.ts` + PSI API v5 для CWV. Артефакты остаются git-tracked JSON/Markdown (не мигрируем в Payload). Дедупликация vs existing 16 OVT/US — hard gate в B5; новых US в cross-roadmap **≤8**, RICE floor 1.5.

**Главные риски:** (1) **каннибализация** при добавлении «зеркальных» URL под кластеры конкурентов → откат 5 LEAD к PARITY; митигация — cannibalisation matrix в B5 + ADR-0018 §13 audit; (2) **watcher silent fail** на 3 целях (robots.txt / 429 / UTC-cron / null vs no-change) → false-negative недели без алертов; митигация — per-target config + liveness assertion + dry-run ≥7 дней; (3) **operator overload** ≥10 concurrent decision-gates → milestone застывает на 2-3 нед; митигация — batch 3 sessions (Day-0 / Wave-mid / Final) + budget envelope в Constraints.

## Key Findings

### Recommended Stack (compact)

Stack уже **sustained** (Next.js 16 + Payload 3 + PostgreSQL 16 + Beget VPS) — не переисследуется. Для Overtake-3 добавляем **минимальный pack**:

**Core новые technologies:**
- **fast-xml-parser ^5.8.0** — парсинг sitemap.xml 3 конкурентов; критично: текущий regex `<loc>` ломается на `sitemapindex` (known bug, fix в MONITOR-3X-01)
- **node-html-parser ^7.0.1** — title/h1/meta/JSON-LD вместо regex (50× быстрее JSDOM)
- **p-limit ^7.1.1** — concurrency-4 для 39 fetches (13 URL × 3 sites): ~5 мин sequential → ~30 сек concurrent
- **PageSpeed Insights API v5** — CWV bench mobile+desktop × 4 домена = 8 calls/week (<<25k/day). Operator action: PSI_API_KEY. Fallback: `npx lighthouse` при 429
- **structured-data-testing-tool ^4.5.0** (dev only) — JSON-LD coverage validation на competitor HTML в benchmark phase
- **Keys.so + Topvisor + Just-Magic** (sustained tokens 2026-05-06) — переиспользуются без изменений

**Anti-features (НЕ добавляем):** Vercel/Netlify/Cloudflare Workers (РФ), Ahrefs/Semrush/Moz (РФ payment), OpenAI/Gemini (РФ + дубль Claude), Strapi/Directus (дубль Payload), Puppeteer-stealth (юр-серая зона), Tilda/WP/Bitrix/Astro (ADR), Payload CompetitorSnapshots collection (overkill), SerpAPI/DataForSEO (Topvisor покрывает), Grafana/Prometheus/Notion (overkill).

**РФ-юрисдикция safety:** все рекомендации прошли 152-ФЗ check. PSI требует non-RU GCP card (operator action). Никаких персональных данных в snapshot.

### Expected Features

3 живых WebFetch конкурентов 2026-05-15 показали: каждый силён по-своему (arboristik = 4-в-1 + 50+ гео + mega-прайс; arborist.su = ETW + 11 лет + 100+ госконтрактов + 5 соцсетей; liwood = vintage + 17 услуг). 5 LEAD у нас sustained (Schema 100% / photo→quote AI / RUM / Authors / clean nav). LAG — B2B-trail + vintage authority.

**Must have (table stakes) — все covered-by existing US:**
- СРО + лицензия Росприроднадзора + страховка ГО 10 млн PDF (OVT-2) — pending наполнение
- Допуски Минтруда 782н в hero (паттерн arboristik) — NEW P1
- Порубочный билет за наш счёт (C2 master-template) — выделить как USP
- Прайс таблицей Ø × метод × цена (паттерн arboristik) — NEW P2
- JSON-LD 100% — **LEAD vs все 3** ✓ sustained

**Should have / differentiators (first-mover в нише, никто из 3 — нет):**
- Photo→Quote Claude API — sustained moat ✓
- RUM threshold-alert — sustained moat ✓
- Authors с Person Schema — sustained LEAD ✓
- 6 PDF лендингов `/b2b/<doc>/` (OVT-2) — pending

**NEW US кандидаты (proposed через ROADMAP-CROSS-01) — WHITE SPACE:**
- **NEW OVT-8 B2B-абонентка «зима-лето»** — 3 тарифа (45k/120k/220-450k), `/b2b/abonement/`, договор-шаблон, страховка ГО 15 млн. **Только alpbond играет, наши 3 — нет.** RICE-high, P1.
- **NEW OVT-9 «Штрафы ГЖИ/ОАТИ берём на себя»** — flagship hero на `/b2b/`. First-mover. RICE-high, P1.
- **NEW OVT-10 «Снег выпал» dynamic creative** — Я.Погода API + Я.Директ. +35% CR (contex/02 §5.1). RICE-medium, P3.
- **NEW OVT-11 «Зимняя абонентка»** — auto-scheduler + Telegram bot reminder. Requires OVT-8. P3.
- **NEW LSI-блоки** «10 причин» + «сам vs специалист» в C2 — closes content-depth LAG vs liwood 3500w. P1.
- **NEW «Лицензии 782н + страховка 10 млн» в B2B hero** — паттерн arborist.su регуляторного языка. P1.

**Anti-features (НЕ копировать — anti-TOV):** «от 1000 ₽» демпинг (arboristik), 3 копии lead-form (liwood), «25 лет» когда 2024 (юр-риск ФЗ-38), латиница в бренде, sticky-header 88px, horizontal-scroll 440>375px, Shutterstock stock-photos, калькулятор-bait без расчёта.

### Architecture Approach

**Brownfield-extension:** один EPIC, 5 phases, артефакты-как-код, git-tracked JSON/Markdown, минимум изменений в `site/` (composer/sitemap/RUM/leads — **untouched**). Bridge `.planning/` ↔ `specs/` через REQ-ID → EPIC/US mapping.

**Major components:**
1. **`seosite/01-competitors/` (file-per-competitor parallel)** — `<comp>-{snapshot,vs-obikhod,page-anatomy}-<date>.{json,md}` × 3 + `cross-overtake-roadmap-2026-05.md` + one-time `_TEMPLATE-vs-obikhod.md`
2. **`seosite/04-monitoring/watcher.ts` (modify, не rewrite)** — extract URLs в `targets.config.ts`, schema `{competitors: {liwood, arboristik, arborist_su}, obikhod}`, `detectBreaches()` per-competitor, `p-limit(4)`. Backwards-compatible legacy snapshot adapter.
3. **`.github/workflows/seo-monitor.yml`** — `timeout 10→15min`, alert filename `${DATE}-${COMP}-${TYPE}.md`, `gh issue create --label competitor:${KEY}`
4. **`.planning/` strategic layer** — PROJECT.md (5 REQ-IDs) + ROADMAP.md mapping + research/*.md. View-separation от executable `specs/`
5. **`specs/EPIC-OVERTAKE-3-RESEARCH/`** — один EPIC, 5 phase-folders с `spec.md` + `sa-seo.md` — sustained pattern из EPIC-LIWOOD-OVERTAKE B1-B5

**Key patterns:**
- **Pattern 1 — Phase 1 parallel-safe:** разные URL, разные файлы, нет shared state → **НЕ требуют git-worktree** (read-only artifacts) → comply с memory `parallel_dev_agents_worktree`
- **Pattern 2 — snapshots git-tracked JSON, НЕ Payload:** GH Actions без DB credentials, diff в PR, ~4 MB/year приемлемо
- **Pattern 3 — REQ-ID ↔ EPIC/US bridge:** stable identifier через всю историю; PO держит consistency в одной сессии с backlog

### Watch Out For (top-3 critical)

1. **Каннибализация (P1)** — добавление новых URL «зеркально под arboristik/arborist.su» → откат 5 LEAD к PARITY через 4-8 нед, recovery 3-6 мес. **Prevention:** subtraction-rule в B1 (дополняет LEAD / закрывает LAG / cannibalisation check), **cannibalisation matrix как hard gate в B5**, manual SERP intent overlap + ADR-0018 §13 audit per new URL. Warning sign: «зеркальный/копируем структуру» в description.

2. **Watcher эфемерность (P2)** — multi-target silent fail по 5 причинам: robots.txt allowlist, 429/CloudFlare, **UTC vs MSK cron-confusion**, null vs no-change, false-positive HTML re-render (Bitrix cache). **Prevention:** per-target config block (UA, throttle rps, retry, robots allowlist, expected min content size), cron `'0 5 * * 1'  # 08:00 МСК Mon` explicit comment, **liveness assertion** (`null` или `<50% baseline` → immediate Telegram alert), diff на normalized content, **`--dry-run ≥7 дней`** перед prod cron-enable.

3. **Operator overload (P6)** — ≥10 concurrent decision-gates (5 sustained + 5 new) при оператор throughput 1-2/day → milestone застывает 2-3 нед, команда работает unaligned. **Prevention:** **batch 3 operator sessions** — Day-0 kickoff (roadmap + RICE + budget envelope + Я.Бизнес ETA, 30 мин), Wave-mid (продолжаем/меняем), Final-gate (release + DoD). Decision-tree pre-fill (A/B/C + recommendation + risk). `blocked_by_operator: yes/no` flag в каждой US. Budget envelope в Constraints («до X₽ маркетинг auto-apruv»).

Secondary: **P3 snapshot drift** (B1→B5 gap 2-3 нед → roadmap на устаревших данных; митигация — `as_of` stamp + WebFetch>Keys.so>PSI priority + drift gate >14d); **P4 RICE-инфляция** (15-20 новых US с RICE<1.5; митигация — floor 1.5 + cap-8 + dedup vs 16 open); **P5 подражание плохим практикам** (копирование демпинга/Bitrix-баггов; митигация — «what NOT to copy» секция + mobile-first qa gate 375/414/768/1024).

## Implications for Roadmap

Структура «один EPIC, 5 phases» — sustained pattern. Phase 1 параллель-safe; Phase 4 fully parallel.

### Phase 0: SETUP (0.5 ЧД, PO)
**Rationale:** Без template + intake + ROADMAP mapping Phase 1 в вакууме; 0.5 ЧД окупится 10× clarity.
**Delivers:** `.planning/ROADMAP.md` (REQ-ID → EPIC/US mapping), `specs/EPIC-OVERTAKE-3-RESEARCH/intake.md`, `seosite/01-competitors/_TEMPLATE-vs-obikhod.md`, **Day-0 operator batch** (≥5 gates: roadmap + RICE + budget envelope + Я.Бизнес ETA + 4 NEW OVT decision).
**Avoids:** P6 (Day-0 batch), P5 (template enforces «what NOT to copy»).

### Phase 1: BENCHMARK ARB + ARBSU (parallel, ~4 ЧД, 2 seo agents)
**Rationale:** Hard prerequisite для cross-roadmap. arboristik + arborist.su независимы → parallel-safe **без git-worktree** (read-only артефакты).
**Delivers:** 2× `<comp>-snapshot-<date>.json` (B1), 2× `<comp>-vs-obikhod-<date>.md` 8 осей (B2+B3), опц. 2× page-anatomy.
**Addresses:** BENCHMARK-ARB-01, BENCHMARK-ARBSU-01.
**Uses:** sustained WebFetch + Keys.so + PSI v5 (optional `node-html-parser` для B1).
**Avoids:** P5 (fresh evidence-driven, не copy-from-liwood), P3 (`as_of` stamp).

### Phase 2: ROADMAP CROSS (sequential after Phase 1, ~1 ЧД, seo+arch+po)
**Rationale:** Cross-roadmap невозможен пока обе benchmark.md не существуют. Hard dependency.
**Delivers:** `seosite/01-competitors/cross-overtake-roadmap-2026-05.md` (leverage matrix 3-way + RICE recompute + RACI), diff в `team/backlog.md` (≤8 new US, RICE ≥1.5), update `.planning/ROADMAP.md`.
**Addresses:** ROADMAP-CROSS-01.
**Avoids:** P1 cannibalisation (matrix hard gate), P4 dilution (floor + cap-8 + dedup + «done before new»).

### Phase 3: MONITOR 3X (sequential after Phase 2, ~1.5 ЧД, dev+seo+devops)
**Rationale:** Phase 2 cross-roadmap может выявить per-competitor threshold tweaks → один PR с config.
**Delivers:** `targets.config.ts` (new) + **6 правок watcher.ts** (extract URLs / schema migration / p-limit / per-target loop / detectBreaches per-competitor / legacy+new snapshot reader) + yml update + README + `--dry-run` ≥7d.
**Addresses:** MONITOR-3X-01.
**Uses:** `fast-xml-parser` + `node-html-parser` + `p-limit` + PSI v5.
**Avoids:** P2 watcher эфемерность (config + liveness + UTC comment + dry-run gate).

### Phase 4: EXEC COMPLETE (fully parallel to Phase 1+2+3)
**Rationale:** OVT-1..7 + US-2..11 — sustained operationalization. Файлы НЕ пересекаются с research stream (`site/` vs `seosite/+.planning/`).
**Delivers:** Закрытие 9 OVT + 10 US до DoD.
**Addresses:** EXEC-COMPLETE-01.
**Avoids:** P4 «done before new» (≥2 OVT в done/final-qa перед new), P6 (batched sessions).

### Phase Ordering Rationale

- **Hard deps:** Phase 0 → Phase 1 → Phase 2 → Phase 3
- **Parallel zones:** (a) Phase 1 ARB ⊕ ARBSU; (b) Phase 4 fully parallel to all
- **Soft dep Phase 3 ← Phase 2:** теоретически parallel, но риск pre-mature thresholds → false alerts; PO держит sequential
- **Iron rule compliance:** каждая фаза = PR, type-check+lint+format ДО PR, qa real-browser smoke только Phase 3 (если меняет публичные endpoints — НЕ должен)

### Research Flags

**Skip research-phase (standard patterns, well-documented):**
- Phase 0 SETUP — PO sustained, template fill
- Phase 1 BENCHMARK — research уже сделан (WebFetch 3 конкурентов 2026-05-15), execution = применение
- Phase 2 ROADMAP — sustained B5 RACI + Gantt pattern из `overtake-roadmap-2026-05.md`
- Phase 3 MONITOR-3X — sustained pattern из liwood watcher, refactor очевиден
- Phase 4 EXEC — каждый OVT/US имеет sustained spec

**Один research-need во время planning:** operator validation 4 NEW US (OVT-8/9/10/11) — RICE pre-computed, но business decision → Day-0 batch gate.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | **HIGH** | 5/6 HIGH (sustained Keys.so/Topvisor/Just-Magic + npm libs production-proven); PSI quota MEDIUM (эмпирически). РФ-safety pass. |
| Features | **HIGH** | 3 конкурента живо WebFetch'ались 2026-05-15. 4 NEW OVT кандидата опираются на contex/02 §3+§5+§6 (validated persona 1-7 + KPI tree). |
| Architecture | **HIGH** | 11 целевых файлов прочитаны полностью (watcher.ts 595 строк, seo-monitor.yml, composer/sitemap, ADR 17/18/20/21, WORKFLOW, intakes). 0 догадок. |
| Pitfalls | **HIGH** | 90% на внутренних артефактах (B2 + roadmap + ADR + WORKFLOW + 15 memory feedback*); 10% — industry Bitrix-2018 mistakes. |

**Overall confidence:** HIGH (brownfield extension, sustained foundation, без green-field guesswork).

### Gaps to Address

- **PSI API key** — operator action (GCP `obikhod-prod` PSI enable + GH secret). Если не выдан к W1 — watcher без PSI, ось 7 для arboristik/arborist.su `pending`. Day-0 batch.
- **Я.Бизнес owner verified ETA** — sustained hard blocker для OVT-4 + AggregateRating LEAD. Не блокирует Phase 1-3, блокирует Phase 4 OVT-4. Day-0 batch.
- **Just-Magic deep clustering endpoint** — pending operator clarification из US-1, не блокирует Overtake-3 (TF-IDF fallback).
- **Operator decision на 4 NEW US (OVT-8/9/10/11)** — какие в milestone, какие в v1.1+. Recommended P1 = OVT-8 + OVT-9 + LSI + лицензии 782н; P3 = OVT-10/11. Day-0 batch gate.
- **`/gsd-transition` workflow validation** — `.planning/` layer добавлен 2026-05-15, pattern не sustained-tested. PO обновляет mapping в одной сессии с `team/backlog.md`.

## Sources

### Primary (HIGH confidence)
- `/Users/a36/obikhod/.planning/PROJECT.md` — milestone REQ-IDs, Constraints
- `/Users/a36/obikhod/CLAUDE.md` — iron rules, Immutable, Karpathy-derived
- `/Users/a36/obikhod/team/WORKFLOW.md` §5 — sustained iron rules
- `/Users/a36/obikhod/seosite/01-competitors/liwood-vs-obikhod-2026-05-W.md` — 8 осей verdict
- `/Users/a36/obikhod/seosite/01-competitors/overtake-roadmap-2026-05.md` — B5 RACI + Gantt
- `/Users/a36/obikhod/seosite/04-monitoring/watcher.ts` — 595 строк прочитаны полностью
- `/Users/a36/obikhod/.github/workflows/seo-monitor.yml` — cron + concurrency
- `/Users/a36/obikhod/site/lib/seo/composer.ts` §62-122 — JSON-LD switch
- `/Users/a36/obikhod/team/adr/ADR-0017,18,20,21.md` — sustained constraints
- `/Users/a36/obikhod/contex/01,02,03_*.md` — anti-patterns, B2B-абонентка, TOV
- WebFetch arboristik.ru / arborist.su (5 URL) 2026-05-15

### Secondary (MEDIUM confidence)
- npm `fast-xml-parser@5.8.0` (release 2026-05-12), `node-html-parser@7.0.1`, `p-limit@7.1.1`
- PSI API v5 docs — endpoint HIGH, quota MEDIUM (эмпирически)
- 15+ CLAUDE.md memory artefacts (sustained team learnings 2026-04-21 → 2026-05-13)

### Tertiary (LOW confidence)
- Эмпирические rate-limit оценки (Bitrix-2018 429 при >5 req/s) — validate в Phase 3 dry-run
- Just-Magic endpoint — pending US-1 resolution

---
*Research completed: 2026-05-15*
*Ready for roadmap: yes*
*Detailed: STACK.md 197 / FEATURES.md 356 / ARCHITECTURE.md 469 / PITFALLS.md 431 lines*
