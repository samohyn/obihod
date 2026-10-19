# Stack Research — Milestone v1.0 Overtake-3

**Domain:** Brownfield Next.js 16 + Payload 3 SEO/CRO competitive intelligence stack (РФ-юрисдикция, 152-ФЗ).
**Researched:** 2026-05-15
**Confidence:** HIGH для всех рекомендаций, кроме PSI mobile p75 (MEDIUM — у Google нет documented public quota number, эмпирически ~25 query/min без key, ~400/day на API key).

## Контекст и mandate

Эта research-итерация **ограничена** 5 target features Milestone Overtake-3:
1. live benchmark `arboristik.ru` (8 осей)
2. live benchmark `arborist.su` (8 осей)
3. cross-competitor roadmap (объединённые leverage 3 benchmarks)
4. расширение OVT-MONITOR `watcher.ts` 1→3 конкурентов
5. exec-complete OVT-1..7 + EPIC-SEO-COMPETE-3 US-2..11

**Что НЕ переисследуется** (already validated in PROJECT.md §Validated): Next.js 16, Payload 3, PostgreSQL 16, Beget VPS, Playwright, GitHub Actions, RUM (web-vitals + RumMetrics), Claude API photo→quote, fal.ai иконки/фото, Keys.so weekly snapshot (Python), watcher.ts архитектура.

**Все рекомендации совместимы** с pnpm 10 + Docker Postgres локально + Beget VPS deploy + iron rule «green CI before merge».

## Recommended Stack

### Core Technologies (новые для Overtake-3 — добавляем, не заменяем)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **fast-xml-parser** | `^5.8.0` (released 2026-05-12) | Парсинг `sitemap.xml` 3 конкурентов в watcher.ts (T2/T3/T4 классификация, total URL count) | Zero deps, 20KB, ESM-ready, используется AWS SDK / Google APIs / Microsoft / NASA. Текущий watcher парсит sitemap regex `<loc>...</loc>` (строка 300) — это work-arround, ломается на `<sitemapindex>` (multi-file sitemaps, которые arboristik.ru и arborist.su вероятно используют). HIGH confidence. |
| **node-html-parser** | `^7.0.1` (latest 2026-02) | Извлечение `<title>`/`<h1>`/`<meta description>`/`<script type=ldjson>` из HTML 3 конкурентов вместо текущих regex в watcher.ts строки 171-213 | DOM-style API без полного JSDOM overhead (50× быстрее на парсинге `<title>`). Решает реальный bug текущего watcher: regex `<title[^>]*>(.*?)</title>` ломается на multi-line titles + script content inside title (встречается на Bitrix-сайтах с мета-кеш-инъекциями). HIGH confidence. |
| **p-limit** | `^7.1.1` | Concurrency control для parallel fetch (расширение 13 URL × 1 site → 39 URL × 3 sites = 39 fetches в одном run) | Без rate-limit-friendly concurrency можно нарваться на Cloudflare 429 от arboristik.ru. p-limit 4 = sustainable, текущий watcher делает sequential `for...of` (строки 527-533), это работает на 1 конкуренте, но 39 sequential fetches = ~5 минут vs 30 сек с concurrency-4. HIGH confidence. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **structured-data-testing-tool** | `^4.5.0` | Validate JSON-LD coverage конкурентов (Service / FAQPage / LocalBusiness / BreadcrumbList / Article) автоматически в watcher | Замена ручного `extractJsonLd` (watcher.ts строки 190-213) + сравнение vs Google Rich Results requirements. Используем ТОЛЬКО на B1 snapshot этапе (BENCHMARK-ARB-01 + BENCHMARK-ARBSU-01), не в weekly cron (overkill). MEDIUM confidence — lib стабильный (4-year track record), но not in Context7. |
| **lighthouse** (CLI) | `^12.8.0` | Local CWV bench конкурентов когда PSI public quota hit (429). Запуск через `npx lighthouse <url> --only-categories=performance --form-factor=mobile --output=json` | Backup для PSI API (см. ниже). Опционально: уже использовали в B2 (snapshot.cwv.status «PageSpeed quota exceeded, `lighthouse` CLI не установлен локально»). HIGH confidence. |
| **dotenv** | reuse from python | Env loader для Python scripts уже работает (`load_dotenv(ROOT / "site" / ".env.local")` в `keysso_pull_3competitors.py`) | Не новый — переиспользуем для **PSI API key**, **Topvisor token** (sustained), **3-competitor pull** в `keysso_pull_3competitors.py`. HIGH confidence. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **PageSpeed Insights API v5** | CWV bench arboristik.ru + arborist.su + liwood.ru × mobile + desktop (8 measurements/run) | Endpoint: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<>&strategy=MOBILE&locale=ru&category=PERFORMANCE`. Free tier ~25 query/min без key (rate-limited), 25,000/day с API key (Google Cloud Console). **Operator action:** включить PSI API в `obikhod-prod` GCP проекте, добавить `PSI_API_KEY` в `site/.env.local` + GitHub Actions secret. Альтернатива при quota hit — `lighthouse` CLI (см. выше). HIGH confidence on endpoint, MEDIUM on quota numbers (Google не documenting публично, цифры эмпирические). |
| **Keys.so API v2** | Уже работает для liwood (sustained `keysso_pull_3competitors.py` + `seo-weekly-snapshot.py`), расширяем `DOMAINS` array уже включает 4 домена | **Не новый**. Endpoint: `https://api.keys.so/report/simple/domain_dashboard` + `organic/sitepages` + `organic/keywords`. Header `X-Keyso-TOKEN`. Token в `site/.env.local` (sustained operator передал 2026-05-06). Rate-limit ~10 req/sec, sleep 1.5sec между запросами в существующих scripts. HIGH confidence — production-proven. |
| **Topvisor API v2** | Position tracking 3 конкурентов (запросы из EPIC-SEO-COMPETE-3 семантическое ядро 4685 keys) | Token sustained `f183b7d…` + `TOPVISOR_USER_ID=496026` (operator 2026-05-06). Endpoint `https://api.topvisor.com/v2/json/get/positions_2/history`. Текущий status: manual UI setup pending (US-10 Phase 2 `cms`). **Action для Overtake-3:** добавить `arboristik.ru` + `arborist.su` как «competitors» в Topvisor project. HIGH confidence. |
| **Just-Magic API** | Кластеризация semantic core (lemma-based для русского) | Token `19e91bb…` в env (sustained 2026-05-06). Используется в US-1 (partial — Just-Magic deep clustering сustained pending operator endpoint resolution). MEDIUM confidence — endpoint не fully resolved в US-1 (TF-IDF fallback work). Не блокирует Overtake-3, переиспользуем когда available. |

## Installation

```bash
# В корне site/ (Next.js + Payload monorepo)
cd site

# Core (новые libs для multi-competitor parsing + concurrency)
pnpm add fast-xml-parser@^5.8.0 node-html-parser@^7.0.1 p-limit@^7.1.1

# Supporting (только для benchmark phase, не weekly cron)
pnpm add -D structured-data-testing-tool@^4.5.0

# Optional CWV fallback (используется через npx, не как dep)
# npx lighthouse@^12.8.0 — вызываем on-demand
```

**Python deps** (seosite/scripts) — sustained, ничего не добавляем:
```bash
# Reuse: keysso_pull_3competitors.py + seo-weekly-snapshot.py
# Уже использует: requests, dotenv (load_dotenv), urllib.parse
# PSI вызовы — встраиваем в seo-weekly-snapshot.py как новый block
```

## Integration Points (mapping в existing code)

| Existing file | What to change | Why |
|---|---|---|
| `seosite/04-monitoring/watcher.ts` | (1) `LIWOOD_KEY_URLS` → `COMPETITOR_URL_MAP: Record<'liwood'\|'arboristik'\|'arborist_su', readonly string[]>` (~13 × 3 = 39 URLs). (2) Парсер swap: `extractJsonLd` + `extractTag` + `extractMetaDescription` → wrapper над `node-html-parser`. (3) `fetchObikhodSitemap` → также `fetchCompetitorSitemap(domain)` через `fast-xml-parser` для real total URL count. (4) Sequential fetch loop (строки 527-533) → `p-limit(4)`. (5) `WatcherSnapshot.liwood` → `WatcherSnapshot.competitors: { liwood: …, arboristik: …, arborist_su: … }`. (6) `THRESHOLD_JSONLD_DELTA_ABS=0` остаётся для каждого competitor индивидуально. | Это **главный** code change для MONITOR-3X-01. Type-check + lint + format:check ДО PR (iron rule). |
| `.github/workflows/seo-monitor.yml` | (1) `concurrency.group: seo-monitor` сохраняется (single runner, safety vs 429). (2) `timeout-minutes: 10` → `15` (3× fetches). (3) `Open GitHub issue per alert` шаг — labels добавить competitor-specific: `seo-monitor`, `competitor:liwood`/`competitor:arboristik`/`competitor:arborist-su` для filter. (4) (опц.) PSI API step: после watcher запускает Python script с PSI call для 3 competitors mobile + ours, артефакт в snapshot. | Минимальные правки, не ломает sustained pipeline. |
| `seosite/scripts/seo-weekly-snapshot.py` | (1) DOMAINS уже = 4 (obikhod + 3 competitors) — **sustained, не трогаем**. (2) **Добавить block PSI** после Keys.so: для каждого `domain` × `strategy in ['MOBILE','DESKTOP']` вызвать PSI endpoint, парсить `lighthouseResult.audits['largest-contentful-paint'].numericValue` + `cumulative-layout-shift` + `interaction-to-next-paint` + `interactive`. Сохранять в `seosite/04-monitoring/<YYYY-MM-DD>/<domain>.cwv.json`. (3) `summary.csv` extend колонками `lcp_mobile_ms`, `cls_mobile`, `inp_mobile_ms`. | Не trip rate-limit: 4 domains × 2 strategies = 8 PSI calls/week << 25,000/day quota. |
| `seosite/scripts/keysso_pull_3competitors.py` | Sustained — переиспользуем без изменений для refresh на B1-snapshot этапе benchmark arboristik + arborist.su. Domain order matters: keep `["liwood.ru", "arborist.su", "arboristik.ru"]`. | Production-proven, не трогать. |
| `site/lib/seo/composer.ts` + JSON-LD validators | **НЕ trogat** — наш schema (4-6 узлов) sustained 100% coverage. Используем `structured-data-testing-tool` ТОЛЬКО на competitor HTML в watcher snapshots, не на нашем code. | `structured-data-testing-tool` runs offline на сохранённом HTML. |
| **NEW** `site/lib/competitors/registry.ts` | Single source of truth для metadata 3 competitors: `domain`, `slug`, `sitemap_url`, `key_urls[]`, `b1_snapshot_path`, `b2_benchmark_path`, `expected_jsonld_count` (для drift detection). Используется watcher.ts + benchmark generation scripts. | Без registry — magic strings раскиданы по 5 файлам. Iron rule «don't add complexity» — но 3 competitors × 5 places = 15 stale points, registry это net-positive. |

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **WebFetch / native `fetch` + node-html-parser** | **Firecrawl** (https://firecrawl.dev) | Когда конкурент JS-render-only (SPA без SSR). Для нашего ландшафта это не кейс: arboristik.ru — WordPress + Elementor + Tilda-вставки (SSR HTML), arborist.su — Bitrix Site Manager (SSR HTML), liwood.ru — Bitrix-2018 (SSR HTML). Все 3 отдают полный HTML с JSON-LD inline. **Decision: WebFetch достаточен**, Firecrawl — premium ($20+/mo) для проблемы, которой у нас нет. Если в Wave 5+ возникнет SPA-competitor — добавим. |
| **WebFetch / fetch** | **Playwright headless** | Когда нужен screenshot для visual diff (например, баннеры выручки). Для Overtake-3 цель — текстовая (URL count, JSON-LD count, meta-tags), Playwright headless = overkill (300MB browser image в CI run, 10× slower). Уже есть `@playwright/test@^1.59.1` для E2E — переиспользуем точечно ТОЛЬКО для CWV bench fallback при PSI 429 OR для screenshot regression (sustained future US). |
| **fast-xml-parser** | **xml2js** | xml2js устарел (last major release 2022), API через callbacks, не tree-shakeable. fast-xml-parser активный (release 2026-05-12), 3.1k stars, used by AWS SDK. Никакого reason оставлять xml2js. |
| **node-html-parser** | **cheerio** | cheerio API очень похожий (jQuery-like), но 250KB vs 50KB node-html-parser, и cheerio тащит parse5 + htmlparser2 как deps. Для нашего use-case (5 простых extractors) overkill. cheerio выигрывает если нужна полная jQuery selector engine — нам не нужна. |
| **node-html-parser** | **JSDOM** | JSDOM = полный browser DOM (300KB+), event loop, CSS computation. Для headless HTML parsing — 100× медленнее. Никогда не использовать JSDOM в watcher. |
| **PSI API v5** | **Chrome UX Report (CrUX) API** | CrUX даёт реальные RUM-данные Chrome users (field data), но требует, чтобы у домена было достаточно трафика для попадания в Chrome UX dataset. liwood.ru — попадает (есть в Keys.so visible). arboristik.ru / arborist.su — **возможно не попадают** (нужно проверить запросом). Decision: использовать **PSI API v5 lab data** (deterministic, всегда возвращает) + CrUX как обогащение если доступно. CrUX часть PSI response уже включена (`originLoadingExperience`/`loadingExperience`), не отдельный endpoint. |
| **Lighthouse via npx** | **Lighthouse CI** (`@lhci/cli`) | Lighthouse CI — для прод-пайплайна нашего сайта (perf budget gating). Для competitor bench — overkill, нужен один-разовый JSON output. `npx lighthouse <url> --output=json` достаточен. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Ahrefs / Semrush / Moz API** | НЕ работают на РФ-юрисдикцию (sanctions blocks RF IPs/cards с 2022). Платёж невозможен с российских карт. Ahrefs специально упомянут в CLAUDE.md «Запрещено в проекте». Полное дублирование функций Keys.so в нашем кейсе. | **Keys.so** (sustained `KEYSO_API_KEY` в env) + **Topvisor** (sustained `TOPVISOR_API_KEY`). Оба — российские, СУБД РФ, оплата ЮЛ РФ. |
| **Vercel Functions / Edge Runtime** для watcher | (1) Vercel заблокирован для РФ-юрисдикции. (2) GitHub Actions cron + Beget VPS deploy — sustained рабочая модель. (3) Watcher не HTTP-handler, это batch job. | **GitHub Actions cron** (`schedule: 0 9 * * MON`, sustained). |
| **Strapi / Directus** для хранения benchmark history | (1) ADR violation: Payload 3 — единственный CMS. (2) Дублирует Payload Collections. (3) Дополнительная БД = шум в backups. | **Payload Collection `CompetitorSnapshot`** (новая, рекомендуемая в ARCHITECTURE.md) — хранение snapshot JSON с filter/admin UI. ИЛИ просто `seosite/04-monitoring/snapshots/*.json` (sustained pattern, no DB write). |
| **Puppeteer / Puppeteer-extra-plugin-stealth** | (1) Дублирует Playwright (`@playwright/test@^1.59.1` уже установлен). (2) Puppeteer-extra-stealth — обход anti-bot, юридически серая зона для competitor intelligence. Liwood / arboristik / arborist.su не имеют anti-bot защиты для legitimate User-Agent (мы декларируем `ObikhodSEOMonitor/1.0 (+https://obikhod.ru/contacts/)` — это honest). | **Native `fetch` + custom User-Agent**, sustained pattern. Если когда-то нужен JS-render — `playwright.chromium.launch()` из существующего `@playwright/test`. |
| **Tilda / WordPress / Bitrix / Astro** | Sustained ADR-rejected `contex/04_competitor_tech_stacks.md`. Не для watcher/benchmark, не для самого сайта. | Next.js 16 + Payload 3 (sustained). |
| **OpenAI API / Gemini API** для analysis benchmarks | (1) РФ-юрисдикция: оплата невозможна. (2) Claude API уже sustained для photo→quote — единственный AI endpoint в проекте. Дублирование. | **Claude API (Sonnet 4.6) с prompt caching** — если нужен AI-анализ HTML competitor (e.g. semantic clustering of FAQ). Iron rule prompt caching из CLAUDE.md. Но для Overtake-3 это вероятно НЕ нужно — benchmark template деterministic (8 осей × verdict таблица). |
| **Brave Search API / Exa API** для competitor research | (1) GSD context показал `brave_search: false` и `exa_search: false` (no orchestrator config). (2) Keys.so + Topvisor покрывают весь use-case position tracking + keyword discovery. (3) Brave/Exa нет официального РФ presence. | Built-in **WebSearch** + **Keys.so API** + ручной audit competitor HTML (sustained). |
| **fetch retries via `retry-fetch` / `p-retry`** | Watcher должен прозрачно фиксировать `http_status: 0` (current behavior) или `429`/`500`. Retry скрывает временные drift signals от 429 → создаёт false negative «competitor доступен». | Текущий `fetchWithTimeout` (watcher.ts строки 144-169) — sustained. Логировать failed fetches и эскалировать через alert (`liwood_404_spike` или новый breach type). |

## Stack Patterns by Variant

**Если competitor добавляет anti-bot (Cloudflare challenge на arboristik.ru):**
- Снижать concurrency до 1, sleep 5s между requests
- Логировать `http_status: 403` как breach `competitor_anti_bot_block`
- НЕ переключаться на Puppeteer-stealth (юр-серая зона)
- Эскалировать operator: «competitor закрылся — нужно ли legal whois / manual fetch / SerpAPI proxy»

**Если PSI квота исчерпана (HTTP 429):**
- Fallback на `npx lighthouse <url> --only-categories=performance --form-factor=mobile --output=json --quiet --chrome-flags="--headless=new"`
- Запускать ТОЛЬКО на ubuntu runner (Beget VPS не имеет Chrome). 1 lighthouse run = ~30 сек, 8 запусков = ~4 минуты на CI.
- Snapshot path: `seosite/04-monitoring/<YYYY-MM-DD>/<domain>.lighthouse.json`

**Если liwood/arboristik/arborist.su отдают `sitemapindex` (multi-file sitemap):**
- `fast-xml-parser` парсит вложенные `<sitemap><loc>...</loc></sitemap>` references
- Watcher делает 1 + N recursive fetches (cap = 10, иначе breach `sitemap_explosion`)
- Текущий regex-парсер `[...body.matchAll(/<loc>([^<]+)<\/loc>/g)]` (watcher.ts строка 300) **сломается** на sitemapindex (вернёт 0 URLs) — это уже известный потенциальный bug, fix в MONITOR-3X-01.

**Если operator не выдал PSI_API_KEY к W1:**
- Запуск watcher БЕЗ PSI (skip CWV block в Python script)
- LIKELY-LEAD ось 7 для arboristik / arborist.su останется `pending`, как было с liwood в B2 (acceptable degradation)
- Эскалировать operator на W2 с conkretным PSI Console URL

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `fast-xml-parser@^5.8.0` | Node 18+, ESM/CJS dual | Sustained `.nvmrc` Node 22 (sustained CI workflow `node-version-file: .nvmrc`) — OK |
| `node-html-parser@^7.0.1` | Node 16+, ESM/CJS | Compatible с `tsx` runtime (sustained `pnpm tsx seosite/04-monitoring/watcher.ts`) |
| `p-limit@^7.1.1` | ESM-only (since v4) | Sustained — watcher.ts уже ESM (uses `import.meta.url` строка 127), import-OK |
| `next@16.2.4` | `payload@^3.84.1` | Sustained production stable. НЕ обновлять одновременно с Overtake-3 запуском. |
| `payload@^3.84.1` | `@payloadcms/db-postgres@^3.84.1` | Sustained. Если будем добавлять `CompetitorSnapshot` collection — следовать sustained Reviews pattern (US-9 Phase 1). |
| `@playwright/test@^1.59.1` | Node 18+, sustained Chromium pinned | Используем ТОЛЬКО для CWV fallback (lighthouse-style). Не запускаем в seo-monitor workflow (CI image weight). |
| `structured-data-testing-tool@^4.5.0` | Node 14+, runs offline на HTML string | НЕ требует браузера. Только в benchmark scripts, не в weekly watcher (overkill). |

## РФ-юрисдикция safety check (152-ФЗ совместимость)

Каждая рекомендация прошла РФ-safety check:

| Tech | РФ-юрисдикция OK? | Reason |
|------|-------------------|--------|
| fast-xml-parser / node-html-parser / p-limit | ✅ | OSS npm libs, no data transfer to vendor servers |
| structured-data-testing-tool | ✅ | OSS, runs offline на HTML strings |
| PSI API v5 | ✅ (с условием) | Google API endpoint доступен из РФ. Оплата API key через Google Cloud — **требует non-RU карты OR через посредника**. **Operator action:** подтвердить наличие GCP биллинга. Free tier (без key) ~25 query/min — достаточно для weekly cron (8 calls/week). |
| Lighthouse CLI | ✅ | OSS, runs локально на CI ubuntu runner |
| Keys.so API | ✅ | РФ юр-лицо (Кейсо), оплата ЮЛ РФ, sustained 2026-05-06 |
| Topvisor API | ✅ | РФ-сервис (ToPVisor LLC), оплата ЮЛ РФ, sustained 2026-05-06 |
| Just-Magic API | ✅ | РФ-сервис, sustained 2026-05-06 |
| Я.Метрика goals | ✅ | Yandex РФ, sustained |
| Claude API | ⚠️ | Sustained для photo→quote через VPN/proxy — отдельная схема. НЕ используем для benchmark generation в Overtake-3 (избегаем зависимости). |
| fal.ai | ⚠️ | Sustained для генерации иконок/фото авторов — отдельная схема. НЕ используем для benchmark. |

**Hosting check:** все процессы запускаются либо в (1) GitHub Actions ubuntu-latest (US-based), либо (2) Beget VPS Moscow (РФ). Snapshot JSON сохраняется в git репозитории + GitHub Actions artifact (90 дней retention). Никаких персональных данных пользователей в snapshot — только public competitor URLs.

## Anti-features (что НЕ добавляем — explicit)

1. **Vercel / Netlify / Cloudflare Workers** — РФ-юрисдикция, ADR-rejected
2. **Ahrefs / Semrush / Moz API** — РФ payment блок, ADR-rejected
3. **OpenAI / Gemini API** — РФ payment блок + дублирует Claude
4. **Strapi / Directus / Sanity** — ADR-rejected, дублирует Payload
5. **Puppeteer-extra-stealth / scrapfly / scrapingbee** — юридически серая зона, anti-bot bypass не нужен на наших competitors
6. **Tilda / WordPress / Bitrix / Astro** — ADR-rejected как платформа сайта
7. **Redis / Elasticsearch / Meilisearch для benchmark search** — overkill, snapshot JSON + git history достаточен
8. **Grafana / Prometheus dashboard для watcher metrics** — overkill для weekly cron, дублирует existing RUM dashboard
9. **SerpAPI / DataForSEO для SERP scraping** — Topvisor sustained покрывает 95% use-case
10. **Browserless / Browserbase managed Chrome** — Lighthouse CLI на CI ubuntu runner достаточен
11. **Notion / Coda / Airtable для tracker** — sustained `specs/EPIC-*` + `team/backlog.md` (CLAUDE.md immutable)
12. **OpenTelemetry / Sentry tracing для watcher** — Sentry sustained для prod errors, watcher это batch job — `console.log` достаточен (sustained pattern)

## Sources

- **PageSpeed Insights API v5** — https://developers.google.com/speed/docs/insights/v5/get-started · https://developers.google.com/speed/docs/insights/rest/v5/pagespeedapi/runpagespeed — confirmed: strategy enum `MOBILE`/`DESKTOP`, locale `ru` supported, free tier без key. HIGH confidence on endpoint, MEDIUM on quota (не documented публично, эмпирически 25/min без key / 25,000/day с key).
- **fast-xml-parser@5.8.0** — https://github.com/NaturalIntelligence/fast-xml-parser (release 2026-05-12) — HIGH confidence, used by AWS SDK / Google APIs / Microsoft / NASA, zero deps.
- **node-html-parser** — Context7 lookup pending (MCP unavailable per agent restriction note), version pinned via npm registry, MEDIUM confidence on exact patch version (use `^7.0.1` for flexibility).
- **p-limit** — sindresorhus stable lib, HIGH confidence, ESM-only since v4 (compatible with our watcher.ts ESM setup).
- **Existing code analysis:**
  - `seosite/04-monitoring/watcher.ts` (595 lines, sustained) — integration points identified line-by-line
  - `seosite/scripts/keysso_pull_3competitors.py` (Python, sustained) — DOMAINS array pattern reused
  - `seosite/scripts/seo-weekly-snapshot.py` (Python, sustained) — extension point for PSI block
  - `site/package.json` — current deps inventory (Next 16.2.4, Payload 3.84.1, Playwright 1.59.1)
  - `.github/workflows/seo-monitor.yml` — concurrency/timeout patterns
- **Strategic refs:**
  - `contex/04_competitor_tech_stacks.md` — competitor stacks (WordPress/Bitrix/MODX, all SSR — no SPA, validates WebFetch sufficient)
  - `seosite/01-competitors/liwood-vs-obikhod-2026-05-W.md` (B2 benchmark) — sustained 8-axis template
  - `seosite/01-competitors/overtake-roadmap-2026-05.md` — sustained RACI + Gantt, dependency mapping
  - `specs/EPIC-SEO-COMPETE-3/intake.md` — Topvisor + Just-Magic tokens, NAP, авторы, US-10 Phase 1 baseline
- **PROJECT.md** — Validated capabilities list (RUM, watcher.ts, Claude API, fal.ai)
- **CLAUDE.md** — Iron rules (РФ-юрисдикция, ADR-rejected stacks, immutable hosting Beget VPS)

---
*Stack research for: Brownfield Next.js 16 + Payload 3 SEO/CRO competitive intelligence stack — добавление multi-competitor monitoring и benchmark generation capabilities*
*Researched: 2026-05-15*
