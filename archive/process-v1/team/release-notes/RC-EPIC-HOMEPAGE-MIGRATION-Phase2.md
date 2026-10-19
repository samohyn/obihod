---
rc: EPIC-HOMEPAGE-MIGRATION-Phase2
team: product
po: podev
date: 2026-05-06
phase: gate
status: passed
---

# RC — EPIC-HOMEPAGE-MIGRATION Phase 2 (admin enrichment foundation)

**Эпик:** Phase 2 admin enrichment — schema + getter + wire 2 секций как proof-of-concept.
Owner: podev. Cross-team prep: popanel + sa-panel (для миграции в Phase 3).

## 1. Что включено

| AC | Статус | Файл |
|---|---|---|
| Phase 2.0 — ADR-0017 (Homepage global vs SiteChrome) | ✅ | `team/adr/ADR-0017-homepage-content-source.md` |
| Phase 2.2 — `globals/Homepage.ts` (8 групп полей) | ✅ | `site/globals/Homepage.ts` (~280 строк) |
| Phase 2.2 — Регистрация в payload.config.ts | ✅ | `globals: [Homepage, SeoSettings, SiteChrome]` |
| Phase 2.3 — `lib/homepage.ts` getHomepage() с graceful fallback | ✅ | `react.cache` + try/catch returns null |
| Phase 2.3 — page.tsx async + getHomepage() + ISR `revalidate=600` | ✅ | передаёт `data` в Hero/FAQ |
| Phase 2.3 — Hero.tsx wired (props + FALLBACK constants) | ✅ | proof-of-concept паттерн |
| Phase 2.3 — FAQ.tsx wired (8 questions array) | ✅ | proof-of-concept паттерн |

## 2. Что осталось (backlog для Phase 3)

| Item | Owner | Severity | Why deferred |
|---|---|---|---|
| Migration `homepage_global` + `homepage_*` array tables | popanel + sa-panel | Critical | Требует cross-team coordination + interactive `payload migrate:create` через shim. Сейчас global graceful degrades. |
| Seed скрипт `scripts/seed/homepage.ts` | be-site | High | После migration |
| Wire остальных 5 секций (How/PricingTable/PhotoSmeta/Reviews/Documents/Gallery) | fe-site | Medium | Паттерн установлен в Hero/FAQ — копировать |
| Live collections wiring §02 Services / §06 Cases / §09 Districts | be-site + fe-site | High | Нужны хелперы `getServicesPillars()`, `getRecentCases()`, `getCoverageDistricts()` |
| JsonLdGraph reads SeoSettings + Homepage.faq | lp-site | Medium | После seed + миграции |
| `/api/revalidate` webhook от Payload `afterChange` Homepage | be-site | Low | ISR 600s покрывает в Phase 2 |
| SiteChrome.header.menu[].iconKey | popanel | Low | mega-menu иконки Header.tsx inline working — не критично |

## 3. Graceful degradation strategy

Phase 2 SHIPS WITHOUT MIGRATION:

```
page.tsx → getHomepage() → try/catch → null on error
         → каждая section: data?.<slice> ?? FALLBACK
         → если БД нет / global не существует / миграция не применена →
            section показывает hardcoded Phase 1 значения
         → ZERO визуальный drift по сравнению с Phase 1
```

Это значит:
- prod не падает после deploy
- Editing через admin будет работать ПОСЛЕ применения миграции в Phase 3
- Visual identical к Phase 1 пока admin не наполнен
- Per-section progressive enhancement: каждый wired section читает global, остальные fallback

## 4. CI green

```
$ pnpm type-check  → exit 0
$ pnpm lint        → 0 errors, 68 warnings (вне scope)
$ pnpm format:check → All matched files use Prettier code style
```

## 5. Local verify

- `PAYLOAD_DISABLE_PUSH=1 pnpm dev` → ready
- `curl http://localhost:3000/` → HTTP 200, title/H1/FAQ render correctly через FALLBACK (global yet seeded)
- Visual identical к Phase 1 — graceful fallback работает

## 6. Hand-off log

```
2026-05-06 · podev → tamd (in-session) · ADR-0017 written, Homepage global vs SiteChrome decided
2026-05-06 · podev → fe-site · globals/Homepage.ts created (8 field groups, defaultValues = Phase 1 values)
2026-05-06 · podev → fe-site · lib/homepage.ts getHomepage() helper with graceful try/catch
2026-05-06 · podev → fe-site · Hero.tsx + FAQ.tsx wired as proof-of-concept; pattern: data?.<slice> ?? FALLBACK
2026-05-06 · podev → backlog (popanel + sa-panel) · Phase 3: миграция + seed скрипт + остальные 5 секций wire + live collections + SEO bind
```

## 7. Recommendation

**Pass to deploy.** Phase 2 foundation готова: schema + getter + 2 секции wired без визуального drift. Phase 3 — миграция (cross-team blocker) + остальные wire.
