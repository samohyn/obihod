---
title: Я.ВебМастер site verification + sitemap submission + tracking metrics
owner: sa-seo
co-owners: [seo-tech, aemd]
status: draft
created: 2026-05-03
us: US-4 (EPIC-SEO-CONTENT-FILL)
ac: [AC-4.2]
related:
  - "./gsc-setup.md"
  - "./yandex-metrika-goals.md"
  - "./topvisor-dashboard.md"
---

# Я.ВебМастер setup spec

> **Sustained iron rule (РФ-юрисдикция):** Я.ВебМастер = **primary** monitoring (sustained `contex/04_competitor_tech_stacks.md`), GSC = secondary. Я.Метрика — separate analytics tracking (см. `./yandex-metrika-goals.md`).

## 1. Site verification

### 1.1 · Метод verification (sa-seo recommendation: **meta-тег**)

**Two methods supported by Я.ВебМастер:**

1. **Meta-тег в `<head>`** — sa-seo recommendation
2. HTML-файл (`yandex_<hash>.html` в корне) — fallback

### 1.2 · Meta-тег implementation (recommendation)

В `site/app/layout.tsx` (root layout) add `<meta name="yandex-verification" content="<hash>" />`:

```tsx
// site/app/layout.tsx (excerpt)
export const metadata: Metadata = {
  // ...sustained metadata
  verification: {
    yandex: process.env.YANDEX_VERIFICATION_HASH,
    // google: process.env.GOOGLE_VERIFICATION_HASH (см. ./gsc-setup.md)
  },
}
```

**Env variable:** `YANDEX_VERIFICATION_HASH` в `.env` + GHA secrets (sustained `feedback_env_example_quoting`).

**Why meta-тег vs HTML-файл:**
- Maintain через Next.js `generateMetadata` API (centralized, no static `public/` files).
- Easier rotate (change env var → redeploy, без файловой системы).
- Cleaner public/ directory (нет «случайных» yandex_<hash>.html).

### 1.3 · DNS-verification (alternative — sa-seo defer)

DNS TXT record (`yandex-verification` тип TXT на корневом домене) — alternative но **deferred** на post-EPIC (требует Cloudflare DNS access от operator; sustainable iron rule meta-тег primary).

## 2. Sitemap submission

### 2.1 · URL

`https://obikhod.ru/sitemap.xml` — sustained от Stage 1 (Next.js dynamic route handler `site/app/sitemap.ts`).

### 2.2 · Submission flow (manual, через Я.ВебМастер UI)

1. Login Я.ВебМастер → выбор сайта `obikhod.ru`.
2. **Indexing → Sitemap files** → add `https://obikhod.ru/sitemap.xml`.
3. Submit → Я.ВебМастер crawls в течение 1-7 дней.
4. Statuses to monitor: `OK` / `Has errors` / `Not crawled`.

### 2.3 · Auto-resubmit on update

- Sustained Next.js sitemap.ts auto-regen on deploy.
- Я.ВебМастер crawls sitemap weekly automatically.
- **Manual resubmit:** только если major URL structure change (sustained — не ожидаем в US-4).

## 3. Tracking metrics — weekly review

### 3.1 · Indexing metrics (Я.ВебМастер «Индексирование»)

| Metric | Threshold | Action if breached |
|---|---|---|
| URL submitted (sitemap) | ~230 (sustained 211 + 19 admin/sitemap/etc → public 211) | n/a — informational |
| URL indexed | ≥ 90% submitted (≥ 190 of 211) | Investigate non-indexed URL via «Страницы в поиске» |
| URL with errors | ≤ 5% (≤ 11 of 211) | Investigate top-10 errors weekly |
| URL not crawled | ≤ 10% (≤ 21 of 211) | Submit individual URL via «Переобход» |

**W14 baseline (expected):**
- Submission latency: 7-14 days post-publish (sustained Yandex crawl behavior).
- Indexing latency: +7-14 days post-crawl (total ~14-28 days post-publish).
- US-4 W14 — *211 URL submitted; ~50-80% indexed by W14 day 7* (informational, не Hard AC).

### 3.2 · «Страницы в поиске» (Pages in search)

- Tracks реально проиндексированные URL.
- Filter: `Tab → Структурированные данные` для validation.

### 3.3 · «Поисковые запросы» (Search queries)

- Real-traffic queries → page mappings.
- Export CSV weekly → cross-link с `../03-clusters/` clusters.
- **Alert trigger:** если query НЕ совпадает с intended cluster (cannibalization signal).

### 3.4 · «Структурированные данные» (Structured data)

- W14 baseline: **0 errors** (sustained Stage 2 AC-8 + Stage 3 W13 closure).
- **Alert trigger:** ≥ 5 errors → investigate immediately (sa-seo + cms cross-team).
- Tracking: weekly manual check via UI.

### 3.5 · «Достоверная информация» (Trustworthy info, optional)

- Submit company info: ИНН + ОГРН + СРО + лицензии Росприроднадзора.
- **Pending operator** (W14 day 1 escalation): real-name юр.лицо + СРО.
- **Sa-seo recommendation:** defer на post-EPIC если operator pending; не блокер EPIC close.

### 3.6 · «Мобильная версия» (Mobile-friendly)

- W14 baseline: 100% mobile-friendly (sustained Stage 2 W11 axe.json + Stage 3 mid-check).
- **Alert trigger:** any non-mobile-friendly URL.

## 4. Связка с Я.Метрика (cross-link)

- Я.Метрика goals — отдельный monitoring layer (analytics, не SEO health). См. `./yandex-metrika-goals.md`.
- Я.ВебМастер ↔ Я.Метрика — **NOT auto-linked** (нужен manual binding в Я.ВебМастер UI):
  - Я.ВебМастер UI → «Привязка к Я.Метрика» → выбор счётчика.
  - Connecting позволяет Я.ВебМастер показывать traffic stats from Я.Метрика inside Я.ВебМастер UI.
- **Sa-seo recommendation:** bind после aemd cross-team setup Я.Метрика goals (W14 day 5).

## 5. Tripwire — operator DNS access pending

**Conditional fallback:**

- **Branch A (default):** meta-тег verification (sustained §1.2) — НЕ требует DNS access. Можно verify сразу после deploy.
- **Branch B (если DNS access нужен для других целей, e.g. Cloudflare records):** **fallback HTML meta tag verify** (sustained §1.2 default).
- DNS TXT record verification — defer post-EPIC (sustained §1.3).

## 6. Screenshots placeholder (manual после Я.ВебМастер access)

После operator передачи Я.ВебМастер creds → aemd cross-team:
- [ ] `screen/yandex-webmaster-verification.png` — verification confirmation
- [ ] `screen/yandex-webmaster-sitemap.png` — sitemap submission status
- [ ] `screen/yandex-webmaster-indexing.png` — indexing dashboard W14 baseline
- [ ] `screen/yandex-webmaster-structured-data.png` — 0 errors confirm

## 7. Acceptance & Hand-off

| AC | Что | Owner | Hard/Soft |
|---|---|---|---|
| AC-4.2.a | yandex-webmaster.md spec written | sa-seo | Hard |
| AC-4.2.b | meta-тег verification deployed (env var) | seo-tech | Hard |
| AC-4.2.c | Я.ВебМастер site added + sitemap submitted | aemd cross-team | Hard |
| AC-4.2.d | Tracking metrics dashboard baseline (W14 day 6) | sa-seo + aemd | Hard |
| AC-4.2.e | Я.ВебМастер ↔ Я.Метрика bind (after goals setup) | aemd | Soft |
| AC-4.2.f | «Достоверная информация» submission | poseo escalation operator | Soft (defer) |

**Hand-off:**
- sa-seo → seo-tech (W14 day 4): meta-тег implementation + env var в `site/.env.example`.
- seo-tech → do (W14 day 5): GHA secret `YANDEX_VERIFICATION_HASH` setup.
- sa-seo → aemd cross-team (W14 day 5): Я.ВебМастер site verification + sitemap submission.
- aemd → sa-seo (W14 day 6): screenshots + indexing baseline.
