# Architecture Research

**Domain:** SEO/CRO orchestration platform поверх Next.js 16 + Payload 3 + PostgreSQL 16 на Beget VPS — расширение существующей системы competitive-intelligence (benchmark + monitoring + roadmap unification) для Milestone v1.0 Overtake-3.
**Researched:** 2026-05-15
**Confidence:** HIGH (читаны все 11 целевых файлов, существующая архитектура измерена; 0 догадок по тех. стеку, оси гипотез — только в integration policy)

> Это **brownfield-research**: мы НЕ пере-исследуем Next 16 / Payload 3 / PostgreSQL — это immutable стек проекта (см. `CLAUDE.md`). Фокус — **как 5 новых features интегрировать в существующие компоненты** без нарушения 5 железных правил и архитектурных контрактов.

## Standard Architecture

### Существующая система (на 2026-05-15)

```
┌────────────────────────────────────────────────────────────────────────┐
│                  USER-FACING LAYER (obikhod.ru)                        │
├────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ T1 hub       │  │ T2 pillar×5  │  │ T3 sub×35    │  │ T4 SD×154+ │ │
│  │ /uslugi/     │  │ /<pillar>/   │  │ /<p>/<sub>/  │  │ /<p>/<d>/  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │
│         │                 │                  │                │         │
│         └─────────────────┴──────────────────┴────────────────┘         │
│                                  │                                       │
│                          buildJsonLdForTemplate(T1/T2/T3/T4, ctx)        │
│                              (composer.ts §62-122)                      │
├──────────────────────────────────┬──────────────────────────────────────┤
│                                  ▼                                       │
│                    NEXT.JS 16 APP ROUTER + RSC + Turbopack              │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ app/sitemap.ts     app/api/leads    app/api/rum     app/llms.txt │  │
│  │ app/robots.ts      app/api/revalidate (IndexNow)    llms-full.txt│  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                  │                                       │
├──────────────────────────────────┴──────────────────────────────────────┤
│                          PAYLOAD 3 (embedded)                            │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │ Services · Districts · ServiceDistricts · Cases · Blog · Authors   ││
│  │ Reviews · Leads · B2BPages · Redirects · Media · RumMetrics        ││
│  │ audit_log · (Globals: SiteChrome)                                  ││
│  └────────────────────────────────────────────────────────────────────┘│
│                                  │                                       │
├──────────────────────────────────┴──────────────────────────────────────┤
│                       PostgreSQL 16 (Beget VPS prod)                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────── EXTERNAL ORCHESTRATION (non-runtime) ────────────────────┐
│  .github/workflows/seo-monitor.yml (cron Mon 09:00 UTC + workflow_disp.)│
│       │                                                                  │
│       ▼                                                                  │
│  seosite/04-monitoring/watcher.ts (~470 строк, native fetch)            │
│       │                                                                  │
│       ├─► fetch 13 liwood URLs (extract title/h1/meta/JSON-LD/word_count)│
│       ├─► fetch obikhod sitemap.xml (T2/T3/T4 counts)                   │
│       ├─► diff vs latest snapshots/<YYYY-MM-DD>.json                    │
│       ├─► detectBreaches() → alerts/<date>-<type>.md                    │
│       └─► gh issue create --label seo-monitor (per breach)              │
│                                                                          │
│  seosite/01-competitors/                                                 │
│       ├── liwood-snapshot-2026-05-09.json   ← B1 baseline               │
│       ├── liwood-vs-obikhod-2026-05-W.md    ← B2+B3 8 осей benchmark   │
│       ├── liwood-page-anatomy-2026-05.md    ← C1.b UX layout            │
│       ├── liwood-services-passport-final.md ← lifetime IA passport      │
│       └── overtake-roadmap-2026-05.md       ← B5 RACI + Gantt 12 нед   │
└──────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities (что есть сейчас)

| Component | Responsibility | Где живёт |
|-----------|----------------|-----------|
| `composer.ts buildJsonLdForTemplate()` | Сборка 4-6 JSON-LD узлов на T1/T2/T3/T4 (Organization, Service, FAQPage, BreadcrumbList, LocalBusiness, Person) | `site/lib/seo/composer.ts` |
| `sitemap.ts` | Generation URL-карты из Payload (~211 entry: 5 T2 + ~30 T3 + 154 T4 + tseny hub + lead-infra + otzyvy + blog + b2b + cases + authors + districts) | `site/app/sitemap.ts` |
| `watcher.ts` | Weekly drift detection vs liwood: WebFetch 13 URL → JSON-LD count + word_count + lead-form heuristic → snapshot.json + alert.md | `seosite/04-monitoring/watcher.ts` |
| `seo-monitor.yml` | GH Actions: cron `0 9 * * MON` + `workflow_dispatch{force_alert,dry_run}` → run watcher → `find alerts/*.md` → `gh issue create --label seo-monitor` per breach + 90-day artifact retention | `.github/workflows/seo-monitor.yml` |
| `/api/rum` + RumMetrics | RUM beacon endpoint (anonymous create + admin read) — LCP/CLS/INP/FID/TTFB/FCP + PII-safe pageUrl/UA truncated | `site/app/api/rum/route.ts` + `site/collections/RumMetrics.ts` |
| `LeadForm` → `/api/leads` → Telegram | Лид-захват с fire-and-forget Telegram hook (sustained US-8 W15) | `site/components/blocks/LeadForm.tsx` + `site/app/api/leads/route.ts` |
| `seosite/01-competitors/*.md` | Long-form benchmark artefacts (один файл = один competitor, snapshot + 8-axes analysis + page-anatomy + IA passport) | `seosite/01-competitors/` |
| `specs/EPIC-*/intake.md + spec.md` | Execution-tracker: AC + Hand-off log + Phases + RACI | `specs/EPIC-*/`, `specs/TASK-*/` |
| `team/backlog.md` | Single-source-of-truth для приоритизации US/OVT/EPIC с RICE-formula | `team/backlog.md` |
| `.planning/PROJECT.md + STATE.md` | Стратегический GSD-layer: REQ-IDs (Active/Validated/Out-of-Scope) + milestone state | `.planning/` (new layer 2026-05-15) |

## Recommended Project Structure (after milestone)

```
obikhod/
├── .planning/                                          # NEW: GSD strategic layer
│   ├── PROJECT.md                                      # ✓ exists — Active REQ-IDs
│   ├── STATE.md                                        # ✓ exists — milestone state
│   ├── research/                                       # ✓ exists — this milestone
│   │   ├── SUMMARY.md  STACK.md  FEATURES.md
│   │   ├── ARCHITECTURE.md (this file)  PITFALLS.md
│   └── ROADMAP.md                                      # NEW: cross-competitor unified plan
│
├── seosite/                                            # SEO orchestration artifacts
│   ├── 01-competitors/                                 # EXTEND, no rewrite
│   │   ├── liwood-*.md/.json                           # ✓ existing (baseline)
│   │   ├── arboristik-snapshot-<date>.json             # NEW (BENCHMARK-ARB-01)
│   │   ├── arboristik-vs-obikhod-<date>.md             # NEW (8-axes benchmark)
│   │   ├── arboristik-page-anatomy-<date>.md           # NEW (UX C1.b-style)
│   │   ├── arborist-su-snapshot-<date>.json            # NEW (BENCHMARK-ARBSU-01)
│   │   ├── arborist-su-vs-obikhod-<date>.md            # NEW
│   │   ├── arborist-su-page-anatomy-<date>.md          # NEW
│   │   └── cross-overtake-roadmap-2026-05.md           # NEW (ROADMAP-CROSS-01)
│   │
│   └── 04-monitoring/                                  # EXTEND watcher
│       ├── watcher.ts                                  # MODIFY: 1 → 3 competitors
│       ├── targets.config.ts                          # NEW: per-competitor config
│       ├── snapshots/<YYYY-MM-DD>.json                 # ✓ git-tracked, схема growth
│       ├── alerts/<YYYY-MM-DD>-<type>.md               # ✓ git-tracked
│       └── README.md                                   # MODIFY: 3-competitor runbook
│
├── specs/                                              # Execution tracker (UNCHANGED)
│   ├── EPIC-LIWOOD-OVERTAKE/                           # ✓ active, OVT-1..7 backlog
│   ├── EPIC-SEO-COMPETE-3/                             # ✓ active, US-2..11 backlog
│   ├── EPIC-OVERTAKE-3-BENCHMARK/                      # NEW: BENCHMARK-ARB+ARBSU
│   │   ├── intake.md
│   │   ├── B1-arboristik/{spec.md, sa-seo.md}
│   │   ├── B2-arboristik/...
│   │   └── B1-arborist-su/...
│   ├── EPIC-OVERTAKE-3-ROADMAP/                        # NEW: ROADMAP-CROSS-01
│   └── EPIC-OVERTAKE-3-MONITOR-3X/                     # NEW: MONITOR-3X-01
│
└── site/                                               # Code (mostly UNCHANGED)
    ├── lib/seo/composer.ts                             # ✓ unchanged
    ├── app/sitemap.ts                                  # ✓ unchanged
    ├── app/api/rum/                                    # ✓ unchanged
    └── collections/                                    # MAYBE add CompetitorSnapshot (см. §Data Flow)
```

### Structure Rationale

- **`.planning/` strategic, `specs/` execution:** `.planning/` хранит **REQ-IDs** (BENCHMARK-ARB-01 etc.) и **roadmap unification**. `specs/EPIC-*/` остаётся единственным executable-tracker'ом (CLAUDE.md constraint). Mapping → §Integration Points.
- **`seosite/01-competitors/` extension, не rewrite:** liwood-* файлы — baseline, не трогаем. Каждый новый competitor получает 3 файла того же типа: `<comp>-snapshot-*.json` + `<comp>-vs-obikhod-*.md` + `<comp>-page-anatomy-*.md`. Cross-competitor выводы — **отдельный** файл `cross-overtake-roadmap-2026-05.md` рядом с `overtake-roadmap-2026-05.md` (не заменяет его).
- **`watcher.ts` modify, не rewrite:** добавляем `targets.config.ts` (per-competitor URL list + threshold override), `LIWOOD_KEY_URLS` становится `TARGETS[0].urls`. Структура snapshot — `{competitors: {liwood: {...}, arboristik: {...}, arborist_su: {...}}, obikhod: {...}}` (backwards-compatible через migration адаптер при чтении старых snapshot'ов).
- **Snapshots остаются git-tracked JSON, не Payload collection:** rationale в §Pattern 2.

## Architectural Patterns

### Pattern 1: «Артефакты-как-код» в `seosite/01-competitors/` — file-per-competitor parallel

**What:** Каждый competitor получает идентичный набор файлов того же формата. Cross-competitor синтез делается **отдельным файлом**, который ссылается на per-competitor primaries.

**When to use:** Когда вам нужно сравнивать N конкурентов по тем же осям, и каждый артефакт должен быть инспектируем независимо (operator/PO/seo читают «liwood passport» как один документ, а не вытаскивают liwood-кусок из общей таблицы).

**Trade-offs:**
- ✅ Параллельная работа (seo может одновременно копать arboristik, пока другой копает arborist.su)
- ✅ git-history per competitor — видно когда liwood passport обновлялся
- ✅ WebFetch + ручной анализ удобны на отдельном файле, а не общей таблице
- ❌ Дублирование структуры (8 осей × 3 competitor = 3 файла одинакового шаблона). **Митигация:** template file `seosite/01-competitors/_TEMPLATE-vs-obikhod.md` (нет в repo — нужно создать в фазе SETUP).

**Example layout:**
```
seosite/01-competitors/
├── _TEMPLATE-vs-obikhod.md            # NEW — общий шаблон 8 осей
├── liwood-snapshot-2026-05-09.json    # ✓ existing
├── liwood-vs-obikhod-2026-05-W.md     # ✓ existing
├── arboristik-snapshot-2026-05-15.json # NEW
├── arboristik-vs-obikhod-2026-05-W.md  # NEW (создан из _TEMPLATE)
├── arborist-su-snapshot-2026-05-15.json # NEW
└── arborist-su-vs-obikhod-2026-05-W.md  # NEW
```

### Pattern 2: Snapshots — git-tracked JSON, НЕ Payload collection

**What:** `seosite/04-monitoring/snapshots/<YYYY-MM-DD>.json` — каждую неделю один файл, append-only, читаемый watcher'ом из FS и человеком в IDE.

**When to use:** Для time-series snapshot'ов которые (а) нужны для diff в watcher'е, (б) не отдаются клиенту/админу, (в) генерируются вне runtime приложения.

**Trade-offs:**
- ✅ **GH Actions friendly:** workflow коммитит snapshot обратно (или хранит как artifact 90 days — sustained), не нужен DB connection из CI
- ✅ **Diff в PR:** видно что изменилось vs previous week
- ✅ **No Beget runtime cost:** не нагружает prod DB и не требует cron на VPS
- ❌ **Не запросишь из админки:** для дашборда нужен parsing FS или UI парсит JSON
- ❌ **Git repo grows:** 52 snapshot/year × 3 competitors × ~25 KB ≈ 4 MB/year — приемлемо

**Verdict (HIGH confidence):** ОСТАВЛЯЕМ git-tracked JSON. Не мигрировать в Payload collection до момента, когда понадобится cross-snapshot SQL-query или admin UI поверх snapshots. На текущей шкале (3 competitor × 1 snapshot/week × 1 year = 156 файлов) — overkill.

**Альтернатива rejected:** Payload `CompetitorSnapshots` collection. Не делаем потому что:
1. Нарушает «GH Actions без DB» pattern — потребует прокладывать prod DB credentials в watcher или вызывать `/api/competitor-snapshot` endpoint
2. На Beget VPS лишний write traffic на DB
3. Если когда-то понадобится — миграция тривиальна: `snapshots/*.json → INSERT INTO competitor_snapshots`

### Pattern 3: `.planning/` ↔ `specs/` bridge через **REQ-ID → EPIC/US** mapping

**What:** `.planning/PROJECT.md` хранит REQ-IDs (BENCHMARK-ARB-01, ROADMAP-CROSS-01, ...) — это **милстоун-уровень требования**. Каждый REQ-ID разворачивается в один или несколько `specs/EPIC-*/` или дополняет существующий EPIC. Mapping table — **в `.planning/ROADMAP.md`**.

**When to use:** Когда у вас есть стратегический layer (operator/PO планирует milestone) и tactical layer (роли исполняют через `specs/`). Bridge нужен чтобы:
1. Operator не читает 9 OVT-* строк в backlog'е — он видит 5 REQ-IDs в PROJECT.md
2. PO не пишет стратегию в `specs/intake.md` — он пишет AC и Hand-off log
3. После milestone closure — REQ-IDs мигрируют в Validated с reference на EPIC

**Trade-offs:**
- ✅ Operator/PO view-separation (strategic vs execution)
- ✅ REQ-ID stable identifier через всю историю (даже если EPIC переименуется)
- ✅ `/gsd-transition` обновляет PROJECT.md (validated ⇄ active ⇄ out-of-scope) без трогания `specs/`
- ❌ Двойная запись (REQ-ID в PROJECT.md + AC в spec.md). **Митигация:** REQ-ID в PROJECT.md остаётся one-liner; детали — в spec.md. PROJECT.md обновляется только при phase transition (нечасто).
- ❌ Риск drift между layers. **Митигация:** mapping table в `.planning/ROADMAP.md` обновляется PO в той же сессии что и `team/backlog.md`.

**REQ-ID → EPIC/US mapping (для этого milestone):**

| REQ-ID | Phase | EPIC / US | Existing or NEW |
|--------|-------|-----------|-----------------|
| `BENCHMARK-ARB-01` | Phase 1 | `specs/EPIC-OVERTAKE-3-BENCHMARK/B1-arboristik/` + B2 + B3 | NEW EPIC |
| `BENCHMARK-ARBSU-01` | Phase 1 | `specs/EPIC-OVERTAKE-3-BENCHMARK/B1-arborist-su/` + B2 + B3 | (same EPIC) |
| `ROADMAP-CROSS-01` | Phase 2 | `specs/EPIC-OVERTAKE-3-ROADMAP/` или приложение к `seosite/01-competitors/cross-overtake-roadmap-2026-05.md` + diff в `team/backlog.md` | NEW EPIC (lightweight, может быть один TASK-*) |
| `MONITOR-3X-01` | Phase 3 | `specs/EPIC-OVERTAKE-3-MONITOR-3X/` — extends `seosite/04-monitoring/watcher.ts` + `seo-monitor.yml` | NEW EPIC (extension) |
| `EXEC-COMPLETE-01` | Phase 4 (parallel) | `specs/EPIC-LIWOOD-OVERTAKE/` (OVT-1..7) + `specs/EPIC-SEO-COMPETE-3/` (US-2..11 sustained) | EXISTING (just close) |

## Data Flow

### Request Flow — Benchmark execution (BENCHMARK-ARB-01 / BENCHMARK-ARBSU-01)

```
[PO/operator request milestone v1.0]
    ↓
[.planning/PROJECT.md] adds BENCHMARK-ARB-01, BENCHMARK-ARBSU-01 to Active
    ↓
[/gsd-research] runs (this phase) → .planning/research/*.md
    ↓
[/gsd-roadmap] runs → .planning/ROADMAP.md + maps REQ-IDs → specs/EPIC-*
    ↓
[po] creates specs/EPIC-OVERTAKE-3-BENCHMARK/intake.md (skill: blueprint)
    ↓
[seo agent] (skill: market-research + deep-research + search-first):
    ├─► WebFetch 11+ arboristik.ru URLs → seosite/01-competitors/arboristik-snapshot-<date>.json (B1)
    ├─► 8-axes table → arboristik-vs-obikhod-<date>.md (B2)
    ├─► classification lead/parity/lag → same file (B3)
    └─► same flow for arborist.su
    ↓
[po] reviews, escalates verdict to operator (acceptance)
    ↓
[/gsd-transition] PROJECT.md: BENCHMARK-ARB-01 → Validated
```

### Request Flow — Monitor 3x extension (MONITOR-3X-01)

```
[user PR opens specs/EPIC-OVERTAKE-3-MONITOR-3X/]
    ↓
[dev/seo] modify seosite/04-monitoring/watcher.ts:
    ├─► Extract LIWOOD_KEY_URLS → seosite/04-monitoring/targets.config.ts
    │   export const TARGETS = [
    │     {key:'liwood',     baseUrl:'https://liwood.ru', urls:[...], thresholds:{...}},
    │     {key:'arboristik', baseUrl:'https://arboristik.ru', urls:[...], thresholds:{...}},
    │     {key:'arborist_su',baseUrl:'https://arborist.su', urls:[...], thresholds:{...}},
    │   ];
    ├─► main() loops over TARGETS → один общий snapshot
    └─► detectBreaches() сравнивает per-competitor (3× больше потенциальных breach)
    ↓
[snapshot schema migration]
    BEFORE: {liwood: {...}, obikhod: {...}}
    AFTER:  {competitors: {liwood:{...}, arboristik:{...}, arborist_su:{...}}, obikhod: {...}}
    ├─► читалка findPreviousSnapshot() поддерживает обе схемы (legacy + new) для clean diff
    └─► или: rebuild snapshots/ с zero baseline в первую неделю — sustained
    ↓
[GH Actions cron Mon 09:00 UTC]
    ↓ runs watcher with 3 targets
    ↓
[seosite/04-monitoring/snapshots/<date>.json] commit-back или artifact
    ↓
[per-competitor breach] → seosite/04-monitoring/alerts/<date>-<comp>-<type>.md
    ↓
[gh issue create --label seo-monitor --label competitor:<key>]
    ↓
[po triages] → escalate to seo / arch / ack-and-monitor
```

### State Management

- **No client-side store change.** Все новые features (benchmark + roadmap + monitor) — это backend/CI/artifact работа. SiteChrome / Services / Districts / Reviews — без новых полей.
- **Payload as ОПЦИОНАЛЬНЫЙ admin view:** если PO/operator захочет видеть alerts в `/admin`, добавляем lightweight `CompetitorAlerts` collection (read-only, populated при `gh issue create` через optional `/api/competitor-alert` webhook). **Не делать на старте** — over-engineering. YAGNI применим.

### Key Data Flows

1. **Benchmark write-flow:** Operator → PO → seo agent → `seosite/01-competitors/<comp>-*.{json,md}` (git artifacts, PR + qa approve + po approve + CI green → merge).
2. **Cross-roadmap unification:** Все 3 benchmark.md → seo агент синтезирует `cross-overtake-roadmap-2026-05.md` + diff'ит `team/backlog.md` (новые OVT-CROSS-* строки если cross-leverage найден; иначе только cross-doc). **Дедупликация:** не плодим новые US, эскалируем existing OVT-* / US-* приоритет через RICE recompute. Mapping каждого new US ↔ existing covered-by — обязательно (sustained pattern из B4 `team/backlog.md`).
3. **3x monitor weekly:** GH Actions → watcher → snapshots/*.json + alerts/*.md → `gh issue create`. Diff vs current liwood-only: **+3× HTTP load per run** (но всё ещё <10 min timeout), **+~75 KB git per week** (3× snapshot size).
4. **`.planning/` ↔ `specs/`:** unidirectional при создании (PROJECT.md REQ → spec.md AC), bidirectional при closure (spec.md done → PROJECT.md validated via `/gsd-transition`).

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **3 competitors** (текущая цель) | Текущая архитектура ОК. watcher.ts loops over `TARGETS` array, GH Actions cron 1×/week × 10 min, git snapshots ~75 KB/week. |
| **5-10 competitors** (если operator решит расширить за пределы 3) | Sequential fetch перестанет помещаться в 10 min timeout. Решение: `Promise.allSettled` за competitor (вместе ~3 min на 13 URL каждый), per-target артефакты разделены. |
| **10+ competitors + per-URL fetch расширение** | Время вышло: split на per-competitor GH Actions job (matrix strategy), общий aggregator job. До этой точки ~3-6 месяцев — не оптимизируем сейчас. |
| **Snapshots > 500 файлов** | `find seosite/04-monitoring/alerts/<DATE>-*.md` будет медленный (но всё ещё <1s). Архивировать в `snapshots/archive/<year>/`. Не сейчас. |
| **Если admin захочет дашборд alerts** | Добавить `CompetitorAlerts` Payload collection + `/api/competitor-alert` POST endpoint, вызываемый из GH Actions через obikhod.ru auth-token (sustained Telegram bot pattern). |

### Scaling Priorities

1. **First bottleneck:** GH Actions 10 min timeout при 3 competitors × 13 URL = 39 fetches sequential. Текущий watcher делает sequential для safety (rate-limit liwood). **Решение:** Если станет проблемой, ввести concurrent fetch **внутри одного competitor** (через `Promise.allSettled`) — за seosite уже разделены rate-limit-wise. Кросс-competitor оставить sequential.
2. **Second bottleneck:** Git repo growth от snapshots. **Решение:** `git lfs` для `seosite/04-monitoring/snapshots/` если приближаемся к 100 MB. Не сейчас (4 MB/year прогноз).

## Anti-Patterns

### Anti-Pattern 1: Создавать новый `specs/EPIC-*/` за каждый mini-research

**What people do:** За каждый `arboristik`-benchmark.md создавать отдельный EPIC-OVERTAKE-3-BENCHMARK-ARB / EPIC-OVERTAKE-3-BENCHMARK-ARBSU / EPIC-OVERTAKE-3-ROADMAP / EPIC-OVERTAKE-3-MONITOR.
**Why it's wrong:** Загромождение `specs/`, +4 intake.md +4 Hand-off logs. PO теряет общую картину. Команда не понимает что приоритетнее.
**Do this instead:** **ОДИН EPIC `EPIC-OVERTAKE-3-RESEARCH`** с 5 фазами (B1-arb / B1-arbsu / cross-roadmap / monitor-3x / exec-complete). Каждая фаза — отдельная папка `specs/EPIC-OVERTAKE-3-RESEARCH/Bxx-<slug>/{spec.md,sa-seo.md}`. Sustained pattern из `EPIC-LIWOOD-OVERTAKE/` (B1-B5 в одном intake).

### Anti-Pattern 2: Переносить liwood-strict-knowledge на arboristik/arborist.su без переразметки

**What people do:** Копируют `liwood-vs-obikhod-2026-05-W.md` → `arboristik-vs-obikhod-*.md` и оставляют те же 8 axes verdicts (LEAD/PARITY/LAG) без переоценки. Например, нашё CWV LEAD vs liwood ≠ автоматически LEAD vs arboristik.
**Why it's wrong:** Гипотеза подменяется фактом. Roadmap строится на воздухе. arboristik и arborist.su — разные ниши (arboristik = mega-прайс flat-IA, arborist.su = B2B-нормативка). Их strong axes ≠ liwood strong axes.
**Do this instead:** Каждый benchmark делается **with raw WebFetch + per-competitor analysis**. Reuse только template-структуру (8 осей, verdict-схема), но verdict per ось — fresh evidence-driven.

### Anti-Pattern 3: «Расширим watcher.ts на 3 competitor завтра, а схему snapshot.json потом отрефакторим»

**What people do:** Хардкодят второго и третьего competitor в watcher.ts как `LIWOOD_KEY_URLS_2 = [...]; LIWOOD_KEY_URLS_3 = [...]`. Сохраняют 3 файла-snapshot вместо одного с {competitors}.
**Why it's wrong:** Через месяц никто не помнит, что 3 — это arboristik, а что 2 — arborist.su. Diff-логика дублируется 3 раза. Adding 4-го competitor = ещё одна копипаста.
**Do this instead:** **Phase 0 шага MONITOR-3X-01 — refactor to `TARGETS[]`-config.** Только потом добавляем 2 competitor. Snapshot schema migration в один PR с extension. (См. §Pattern 3 Pitfalls).

### Anti-Pattern 4: Делать roadmap unification в виде «таблица из 3 benchmark.md»

**What people do:** В `cross-overtake-roadmap-2026-05.md` копируют 3 × 8 = 24 строки таблицы и оставляют PO разбираться.
**Why it's wrong:** Это agregation, не synthesis. Operator не получит решения.
**Do this instead:** Roadmap пишет **leverage matrix**: для каждой нашей оси показать (а) против кого мы LEAD/PARITY/LAG, (б) какой combined gap размер, (в) **один** proposed action (with RICE) который закрывает gap против максимума competitor'ов. Обязательно covered-by reference на existing OVT-* / US-*.

### Anti-Pattern 5: Создание UI компонентов вне brand-guide.html для admin alerts dashboard

**What people do:** «Ой, давайте сделаем красивую страницу /admin/competitors с графиками» → дизайнер делает в Figma, fe рисует — а brand-guide не обновлён.
**Why it's wrong:** Нарушает iron rule «brand-guide-first» (CLAUDE.md). Любой UI требует §в brand-guide.
**Do this instead:** Для milestone v1.0 Overtake-3 **не делаем admin UI** для benchmark/monitor — артефакты остаются файловыми (md+json). Если PO/operator потом захотят dashboard — design сначала PR в brand-guide §SEO Admin, потом fe верстает.

## Integration Points

### Existing files — MODIFY (точечные хирургические правки)

| File | Что меняем | Зачем |
|------|-----------|-------|
| `seosite/04-monitoring/watcher.ts` | Extract URLs → `targets.config.ts`; `main()` loops; snapshot schema `{competitors: {...}}`; `detectBreaches()` per-competitor | MONITOR-3X-01 |
| `seosite/04-monitoring/README.md` | 3-competitor runbook, troubleshoot per target | MONITOR-3X-01 |
| `.github/workflows/seo-monitor.yml` | Alert filename pattern: `${DATE}-${COMP}-${TYPE}.md` (sustained `gh issue create --label seo-monitor --label competitor:${COMP}`) | MONITOR-3X-01 |
| `team/backlog.md` | Append (не replace) cross-leverage US в секцию «Cross-competitor overtake roadmap (cross-3)»; recompute RICE для OVT-* если cross-evidence escalates priority | ROADMAP-CROSS-01 |
| `.planning/PROJECT.md` | Phase transition: BENCHMARK-ARB-01 → Validated после Phase 1 done | `/gsd-transition` |
| `.planning/ROADMAP.md` (создать) | REQ-ID ↔ EPIC/US mapping table; cross-references на seosite/01-competitors/ | ROADMAP-CROSS-01 |

### New files — ADD (без модификации existing)

| File | Содержит | Owner |
|------|----------|-------|
| `seosite/01-competitors/_TEMPLATE-vs-obikhod.md` | 8 осей × verdict-схема template | seo (one-time setup) |
| `seosite/01-competitors/arboristik-snapshot-<date>.json` | Raw WebFetch результаты + JSON-LD count + word_count | seo (BENCHMARK-ARB-01 B1) |
| `seosite/01-competitors/arboristik-vs-obikhod-<date>.md` | 8 осей analysis + B3 classification | seo + arch (B2+B3) |
| `seosite/01-competitors/arboristik-page-anatomy-<date>.md` | UX layout анализ топ-5 URL (опционально, если operator approve) | seo + design |
| `seosite/01-competitors/arborist-su-snapshot-<date>.json` | (то же для arborist.su) | seo (BENCHMARK-ARBSU-01 B1) |
| `seosite/01-competitors/arborist-su-vs-obikhod-<date>.md` | (то же) | seo + arch (B2+B3) |
| `seosite/01-competitors/cross-overtake-roadmap-2026-05.md` | Leverage matrix 3-way + RICE recompute + RACI | seo + arch + po (ROADMAP-CROSS-01) |
| `seosite/04-monitoring/targets.config.ts` | `export const TARGETS = [...]` + per-competitor thresholds | dev (MONITOR-3X-01) |
| `specs/EPIC-OVERTAKE-3-RESEARCH/intake.md` | Story + AC для всех 5 phases | po (Phase 0 setup) |
| `specs/EPIC-OVERTAKE-3-RESEARCH/B1-arboristik/spec.md` + `sa-seo.md` | AC + Hand-off log B1 для arboristik | po + seo |
| ... (другие phase folders по аналогии) | | |
| `.planning/ROADMAP.md` | REQ-ID ↔ EPIC mapping + phase dependencies + build order | po (Phase 0 setup, до research) |

### Untouched — DO NOT modify

| File / module | Почему |
|---------------|-------|
| `site/lib/seo/composer.ts` | JSON-LD coverage уже LEAD; никаких ось 4 actions в этом milestone. Trigger для пересмотра — только если breach `liwood_jsonld_added` или эквивалент для другого competitor. |
| `site/app/sitemap.ts` | URL-объём — уже задача EXEC-COMPLETE-01 (OVT-1 Phase A/B). Не трогаем структуру в этом milestone, только заполнение. |
| `site/collections/RumMetrics.ts` | RUM-инфра shipped 2026-05-09. Используем существующий endpoint, новых полей не нужно. |
| `site/app/api/leads/route.ts` | Lead-захват прод-stable. Не трогаем. |
| `site/app/api/rum/route.ts` | Same. |
| `design-system/brand-guide.html` | UI для admin dashboard НЕ делаем в этом milestone. Trigger для PR — отдельный operator-mandate. |
| Все Payload collections (Services, Districts, Reviews, Leads, B2BPages, audit_log) | Бенчмарк/монитор — внешняя orchestration, не runtime UI. |

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| arboristik.ru / arborist.su (target sites) | `fetch()` без auth, native node fetch, custom UA `ObikhodSEOMonitor/1.0` | Sustained pattern из liwood watcher. Rate-limit safety: sequential per-target (HIGH confidence: WebFetch на 13 URL × 3 targets за 10 min — реалистично). |
| GitHub Actions | `gh issue create --label seo-monitor --label competitor:${COMP}` | Sustained. Issue body — content `alerts/<file>.md`. |
| Telegram bot (operator alerts) | Sustained fire-and-forget hook `/api/leads` pattern — НЕ переиспользуется здесь. GH issue → email/notification от GitHub оператору достаточно. | Можно расширить позже (skill `messages-ops`). |
| amoCRM / Я.Метрика / Я.Бизнес | Не интегрируем в этом milestone (вне scope). | |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `.planning/` ↔ `specs/` | One-way: PROJECT.md REQ-ID → spec.md AC (at creation). Two-way at closure: spec.md done → PROJECT.md validated через `/gsd-transition`. | См. Pattern 3. **PO** держит mapping consistency. |
| `.planning/ROADMAP.md` ↔ `team/backlog.md` | One-way: ROADMAP содержит REQ-ID + maps to OVT-*/US-* in backlog. backlog.md остаётся **executable single-source-of-truth** (CLAUDE.md). | ROADMAP — *обзорный* документ; backlog — *операционный*. |
| `seosite/04-monitoring/` ↔ `seosite/01-competitors/` | watcher.ts генерирует snapshots/, но **не** обновляет `01-competitors/*-snapshot-*.json` автоматически. 01-competitors/ — manual analysis artifacts. | Не сшивать автоматически: B1 baseline ≠ watcher weekly snapshot. Baseline обновляется руками через PR. |
| `seosite/` ↔ `site/` | Не сообщаются runtime. `site/` читает Payload (БД); `seosite/` читает only files. | Sustained brownfield separation. |
| GH Actions ↔ Beget VPS | Не общаются. Watcher работает в CI, не на VPS. | Beget VPS остаётся stateless с точки зрения monitoring. |

## Build Order (5 features with dependencies)

Sequential build с одной параллельной зоной:

```
Phase 0 (SETUP) — 0.5 ЧД ───────────────────────────────────────────
    ├─► .planning/ROADMAP.md (PO writes REQ-ID → EPIC mapping)
    ├─► specs/EPIC-OVERTAKE-3-RESEARCH/intake.md (PO + AC)
    └─► seosite/01-competitors/_TEMPLATE-vs-obikhod.md (one-time)

Phase 1 (BENCHMARK) — parallel ─────────────────────────────────────
    ├─► [seo agent #1] BENCHMARK-ARB-01    (B1+B2+B3 для arboristik)   ~2 ЧД
    └─► [seo agent #2] BENCHMARK-ARBSU-01  (B1+B2+B3 для arborist.su)  ~2 ЧД
        ── parallel safe (separate files, separate web fetches, no shared state)
        ── pre-condition: НЕ требуют git-worktree (read-only artefacts)
        ── каждый agent делает свой PR; qa+po+CI gate per PR

Phase 2 (ROADMAP UNIFICATION) — sequential after Phase 1 ─────────────
    └─► ROADMAP-CROSS-01    (seo+arch+po synthesis)   ~1 ЧД
        ├─► Reads все 3 benchmark.md (liwood + arboristik + arborist.su)
        ├─► Generates seosite/01-competitors/cross-overtake-roadmap-2026-05.md
        ├─► Updates team/backlog.md (RICE recompute, cross-leverage US)
        └─► Updates .planning/ROADMAP.md (mapping table)

Phase 3 (MONITOR 3X) — sequential after Phase 2 ─────────────────────
    └─► MONITOR-3X-01       (dev+seo+devops)   ~1.5 ЧД
        Sub-phases inside (one PR):
          3a. Refactor watcher.ts to TARGETS[] config (no behavior change)
          3b. Migrate snapshot schema to {competitors: {...}}
          3c. Add arboristik + arborist.su to TARGETS
          3d. Update seo-monitor.yml (alert filename pattern + labels)
          3e. Update README.md (3-target runbook)
          3f. Dry-run + force-alert smoke
          3g. First real cron run validates
        ── pre-condition: Phase 2 done. Если параллельно с Phase 2 — diff конфликты в backlog.md и watcher не пересекутся (разные файлы), но операционно неудобно для PO ревью.

Phase 4 (EXEC COMPLETE) — fully parallel to Phase 1+2+3 ──────────────
    └─► EXEC-COMPLETE-01    (cw + seo + dev + dba sustained)   ~до конца milestone
        ├─► OVT-1..7 sustained execution (sustained EPIC-LIWOOD-OVERTAKE/intake.md)
        ├─► US-2..11 sustained execution (sustained EPIC-SEO-COMPETE-3/intake.md)
        └─► Никакой архитектурной интеграции не требует — это «doing the work»
```

### Build Order Rationale

- **Phase 0 first:** ROADMAP.md + intake.md + template — без этого Phase 1 seo agent работает в вакууме. 0.5 ЧД на PO — окупится 10× exit-criteria clarity.
- **Phase 1 parallel:** arboristik и arborist.su — независимые таргеты, разные файлы, нет общего state. PARALLEL-SAFE pattern (sustained learning из CLAUDE.md memory `parallel_dev_agents_worktree`: **read-only артефакты** в `seosite/01-competitors/` НЕ требуют git-worktree).
- **Phase 2 after Phase 1:** Cross-roadmap unification невозможен до того как обе benchmark.md существуют. Hard dependency.
- **Phase 3 after Phase 2:** ROADMAP-CROSS-01 может выявить **необходимость менять threshold** для одного из 2 новых competitor (например, arboristik не делает SD, threshold URL delta ≠ liwood). MONITOR-3X-01 ловит этот updated threshold-pack из cross-roadmap. **Soft dependency**: можно делать 2+3 параллельно если PO решит, но риск pre-mature thresholds → false alerts в первую неделю.
- **Phase 4 параллельно всему:** EXEC-COMPLETE-01 (sustained OVT-1..7 + US-2..11) — это **operationalization**, идёт independently от research/monitor stream. Workflow и agents разные (cw/dev/dba vs seo). Зависимостей по файлам **нет** (OVT touch site/, research/monitor touch seosite/+.planning/).

### Sequencing match с iron rules

| Iron Rule | Compliance |
|-----------|------------|
| **Skill-check first** | Каждая фаза начинается со skill activation в Hand-off log spec.md. Phase 1 → `seo, market-research, deep-research, search-first`. Phase 2 → `seo, blueprint, product-capability`. Phase 3 → `backend-patterns, github-ops, deployment-patterns`. Phase 4 → sustained per-OVT/US. |
| **Design-system awareness / brand-guide-first** | **Не применим** — нет UI работы. Подтверждено явно в Anti-Pattern 5. |
| **Green CI before merge** | Каждая фаза = PR. Phase 1 PR-ы (×2) проходят type-check + lint + format даже для markdown/json (markdown linter если в repo). Phase 3 PR ОБЯЗАТЕЛЬНО запускает type-check + lint на watcher.ts + targets.config.ts (TS strict). |
| **Real-browser smoke before merge** | **Не применим к Phase 1/2** (нет UI). **Применим к Phase 3** только если коробка изменит публичные endpoints (НЕ должна). Phase 3 smoke = `pnpm tsx seosite/04-monitoring/watcher.ts --dry-run` + `--force-alert` validation + локальный `gh issue create --dry-run`. |
| **Merge = qa+po+CI green** | Sustained. PO для всех. qa проверяет artifact integrity (snapshot.json validates against schema; benchmark.md имеет все 8 axes). |

## Sources

- `CLAUDE.md` (project root) — immutable стек, iron rules, 9 ролей, запреты
- `.planning/PROJECT.md` — milestone v1.0 REQ-IDs Active/Validated/Out-of-Scope (на 2026-05-15)
- `team/WORKFLOW.md` — Scrum-цикл, merge gate
- `specs/EPIC-LIWOOD-OVERTAKE/intake.md` (B1-B5 architecture, OVT-MONITOR rationale)
- `specs/EPIC-SEO-COMPETE-3/intake.md` (US-2..11 architecture, 5-pillar context)
- `seosite/04-monitoring/watcher.ts` (полностью прочитан, ~470 строк)
- `.github/workflows/seo-monitor.yml` (полностью прочитан)
- `site/collections/RumMetrics.ts` (Payload collection ref)
- `site/lib/seo/composer.ts` §1-140 (JSON-LD switch T1/T2/T3/T4)
- `site/app/sitemap.ts` §1-325 (URL generation)
- `seosite/01-competitors/overtake-roadmap-2026-05.md` (B5 RACI + Gantt)
- `seosite/01-competitors/` directory listing (5 файлов liwood-* для понимания pattern)
- CLAUDE.md memory: `parallel_dev_agents_worktree` (учёт race conditions при параллельных агентах)
- CLAUDE.md memory: `release_cycle_v2`, `po_iron_rule_local_verify_and_cross_agents`, `delegate_checks_to_roles`

---
*Architecture research for: Milestone v1.0 Overtake-3 — cross-competitor benchmark/monitoring/roadmap-execution extension поверх существующего obikhod.ru.*
*Researched: 2026-05-15*
