---
title: Google Search Console (GSC) fallback setup
owner: sa-seo
co-owners: [seo-tech, aemd]
status: draft
created: 2026-05-03
us: US-4 (EPIC-SEO-CONTENT-FILL)
ac: [AC-4.3, AC-4.7]
related:
  - "./yandex-webmaster.md"
  - "./yandex-metrika-goals.md"
---

# Google Search Console (GSC) fallback setup

> **Sustained iron rule (РФ-юрисдикция):** Я.ВебМастер = **primary** monitoring (sustained `contex/04_competitor_tech_stacks.md` + `./yandex-webmaster.md`); GSC = **secondary** fallback. Useful для cross-engine technical SEO health (Core Web Vitals via PageSpeed Insights / Mobile Usability / AI-Overviews trend).

## 1. Why GSC despite РФ-primary stack

### 1.1 · Sustained context

- РФ-юрисдикция: основная аудитория — Я.Поиск + Я.AI (sustained).
- Google остаётся source rune-traffic (~20-30% от total search visits in 2025).
- AI-Overviews от Google — emerging traffic source (cross-link `../07-neuro-seo/sge-readiness.md`).
- Core Web Vitals — **только GSC + PageSpeed Insights** дают granular per-URL data (Я.ВебМастер показывает aggregate).

### 1.2 · GSC role в monitoring stack

| Use case | Tool | Coverage |
|---|---|---|
| Russian search index tracking | Я.ВебМастер | primary (~70-80% traffic) |
| Google search index tracking | GSC | secondary (~20-30% traffic) |
| AI Overviews / SGE trend | GSC «Search Appearance» | only GSC |
| Core Web Vitals per-URL | GSC «Core Web Vitals» | only GSC |
| Mobile usability per-URL | GSC «Mobile Usability» | dual (GSC + Я.ВебМастер) |
| International visitors | GSC | only GSC (Я.Поиск рунет-only) |

## 2. Verification setup

### 2.1 · Recommended method — DNS TXT record (Cloudflare)

**Pros:**
- Verifies all subdomains (sustainable, future-proof).
- One-time setup.
- Cleaner than HTML-файл / meta-тег.

**Steps:**
1. GSC UI → Add Property → **Domain** option (не URL prefix).
2. GSC выдаёт TXT record (e.g. `google-site-verification=<hash>`).
3. **operator action** (Cloudflare DNS access pending W14 day 1 escalation):
   - Login Cloudflare → DNS → `obikhod.ru` zone.
   - Add TXT record: name = `@` (root), value = `google-site-verification=<hash>`, TTL = auto.
4. GSC → Verify (latency: 5 min - 1 hour for DNS propagation).

### 2.2 · Fallback method — meta-тег / HTML-файл

**Если operator DNS access pending к W14 day 7:**

- **Meta-тег** (sa-seo recommendation, sustained `./yandex-webmaster.md` §1.2 pattern):

```tsx
// site/app/layout.tsx (excerpt)
export const metadata: Metadata = {
  verification: {
    yandex: process.env.YANDEX_VERIFICATION_HASH,
    google: process.env.GOOGLE_VERIFICATION_HASH,
  },
}
```

- **HTML-файл** (legacy fallback, defer): `site/public/google<hash>.html` — НЕ recommendation.

### 2.3 · Sa-seo recommendation

**DNS-verification primary** (sustainable, future-proof) → если operator DNS pending → **meta-тег fallback** (deploy сразу, без DNS dependency).

## 3. Sitemap submission

### 3.1 · URL

`https://obikhod.ru/sitemap.xml` (sustained от Stage 1 — Next.js dynamic route handler).

### 3.2 · Submission flow

1. GSC UI → Sitemaps section.
2. Add `https://obikhod.ru/sitemap.xml`.
3. Submit → GSC crawls в течение 1-7 дней.
4. Statuses: `Success` / `Has errors` / `Not crawled yet`.

### 3.3 · Auto-resubmit

- Sustained Next.js sitemap.ts auto-regen on deploy.
- GSC crawls sitemap weekly automatically.
- Manual resubmit только если major URL structure change.

## 4. Tracking metrics — weekly review

### 4.1 · Coverage (sustained core)

| Metric | Target | Action if breached |
|---|---|---|
| Pages indexed | ≥ 70% of submitted (latency higher than Я.Поиск) | Investigate via «Page indexing» report |
| Pages with errors | ≤ 10% | Top-10 errors weekly investigate |
| Soft 404 | 0 | Inspect URL, fix canonical / content |
| 4xx errors | 0 | Cross-team seo-tech investigate |
| 5xx errors | 0 | Cross-team do (deployment health) |

### 4.2 · Mobile usability

- Sustained 100% mobile-friendly (sustained Stage 2 axe.json + Stage 3 mid-check).
- Tracking: weekly check via «Mobile Usability» report.
- **Alert trigger:** any non-mobile-friendly URL.

### 4.3 · Core Web Vitals (per-URL granular)

- **Required thresholds (sustained `seo` skill §1.3):**
  - LCP < 2.5s
  - INP < 200ms
  - CLS < 0.1
- **GSC reports:** «Core Web Vitals» (Mobile + Desktop tabs) — aggregate per URL group.
- **Granular tool:** PageSpeed Insights API → per-URL real-data.
- **W14 baseline expected:** sustained passing (Stage 2 W11 + Stage 3 W13 confirmed in mid-check).

### 4.4 · Search Appearance — AI Overviews trend

- GSC «Search Appearance» tracking (новая фича 2024-2025).
- Reports if our content cited в Google AI Overviews / SGE.
- **Cross-link:** `../07-neuro-seo/sge-readiness.md` — neuro-citation tracking.
- **Sa-seo recommendation:** monthly check (low-frequency for trend).

## 5. Iron rule — Я.ВебМастер primary, GSC secondary

> **«Я.Поиск + Я.ВебМастер — primary monitoring; Google + GSC — secondary fallback»**

### 5.1 · Why iron rule

- РФ-юрисдикция (sustained `contex/04_competitor_tech_stacks.md` + `project_seo_stack`).
- ~70-80% search traffic from Я.Поиск (sustained competitor analysis).
- Google ranking matters but not primary KPI.
- Sustainability: GSC может быть unavailable (sanctions risk, sustained).

### 5.2 · Reverse iron rule (НЕ iron rule)

- НЕ переключать primary на GSC даже если Google traffic растёт post-EPIC.
- GSC всегда secondary — fallback / supplement, не replacement.

## 6. Tripwire — operator DNS access pending

**Conditional plan:**

- **Branch A (default if DNS available к W14 day 5):** DNS TXT record verification.
- **Branch B (если operator DNS pending):** **fallback meta-тег verification** через `site/app/layout.tsx` (sustained `./yandex-webmaster.md` §1.2 pattern).
- Either branch — GSC verification deployed by W14 day 6.

## 7. Acceptance & Hand-off

| AC | Что | Owner | Hard/Soft |
|---|---|---|---|
| AC-4.3.a | gsc-setup.md spec written + iron rule | sa-seo | Hard |
| AC-4.3.b | DNS TXT verification deployed | aemd cross-team + operator DNS access | Soft |
| AC-4.3.c | Meta-тег fallback verification (если DNS pending) | seo-tech | Hard |
| AC-4.3.d | Sitemap submitted to GSC | aemd cross-team | Soft |
| AC-4.3.e | Coverage / Mobile / CWV dashboard baseline (W14 day 7) | sa-seo + aemd | Soft |
| AC-4.7 | GSC fallback setup full flow | aemd cross-team | Soft |

**Hand-off:**
- sa-seo → seo-tech (W14 day 4): meta-тег fallback implementation в `site/app/layout.tsx` + env var.
- sa-seo → poseo (W14 day 1): escalation operator на Cloudflare DNS access (для DNS-verification primary).
- sa-seo → aemd cross-team (W14 day 6 if DNS available): GSC verification + sitemap submit.
- aemd → sa-seo (W14 day 7): screenshots + initial coverage baseline.
