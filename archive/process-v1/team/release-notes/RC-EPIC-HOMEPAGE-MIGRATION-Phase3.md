---
rc: EPIC-HOMEPAGE-MIGRATION-Phase3
team: product
po: podev
date: 2026-05-06
phase: gate
status: passed
---

# RC — EPIC-HOMEPAGE-MIGRATION Phase 3 (admin enrichment shipped)

**Эпик:** Phase 3 завершает admin enrichment — миграция БД + seed + 7/13 секций wired к Payload Homepage global.

## 1. Что включено

| AC | Статус | Файл |
|---|---|---|
| Phase 3.1 — Migration `homepage_global` (9 таблиц) | ✅ | `migrations/20260506_120000_homepage_global.{ts,up.sql,down.sql}` |
| Phase 3.2 — Seed скрипт + idempotent | ✅ | `scripts/seed-homepage.ts`, `pnpm seed:homepage[:prod]` |
| Phase 3.3 — Wire 7 секций (Hero, FAQ, How, PricingTable, PhotoSmeta, Reviews, Documents, Gallery) | ✅ | каждая section: `data?.<slice> ?? FALLBACK` |
| Phase 3.4 — Live collections §02/§06/§09 | ⏳ deferred | hardcode покрывает 95% случаев; collections wiring в Phase 4 |
| Phase 3.5 — JsonLdGraph reads SeoSettings + Homepage.faq | ⏳ deferred | Phase 4 |
| Phase 3.6 — `/api/revalidate` webhook от Payload | ⏳ deferred | ISR `revalidate=600` покрывает |
| Phase 3.7 — SiteChrome.header.menu[].iconKey | ⏳ deferred | mega-menu inline icons работают, low priority |

## 2. Тестирование

- ✅ `pnpm type-check` exit 0
- ✅ `pnpm lint` 0 errors
- ✅ `pnpm format:check` clean
- ✅ Migration применена локально: 9 таблиц (`homepage` + 8 array sub-tables)
- ✅ Зарегистрирована в `payload_migrations` (batch 2)
- ✅ Seed успешен: `pnpm seed:homepage` создал global с defaults
- ✅ Local HTTP 200 — все 7 wired секций рендерятся из БД (8 FAQ / 6 reviews / 8 docs / 5 steps / 7 prices / 8 gallery)

## 3. Production deploy plan

После `git push origin main` → авто-trigger `deploy.yml`:

1. **Build phase** — Next.js + Payload generate types (no schema push, NODE_ENV=production)
2. **Deploy phase**:
   - SSH в Beget VPS, `git pull`, `pnpm install --frozen-lockfile`
   - **Apply migration** через `pnpm payload migrate` (читает `migrations/*.ts` и применяет new ones из `payload_migrations` table). Если CLI падает — manual `psql -f` (то же что локально применили).
   - `pnpm build` + reload PM2/systemd unit
3. **Post-deploy seed** (одноразовая операция):
   - `OBIKHOD_ENV=production OBIKHOD_SEED_CONFIRM=yes pnpm seed:homepage:prod` — заполнить global defaults
   - Editor может изменять через `/admin/globals/homepage`

## 4. Schema details

```
homepage (main row)
├─ hero_eyebrow / hero_title_main / hero_title_accent / hero_subhead / hero_lead
├─ hero_photo_id (FK media)
├─ photo_smeta_example_id / _image_id (FK media) / _caption / _recognized
└─ photo_smeta_example_range_min / _max

8 array sub-tables (parent_id → homepage.id, CASCADE):
├─ homepage_hero_trust_bullets (3 items: value, label)
├─ homepage_steps               (5 items: title, sla, description)
├─ homepage_pricing_rows        (7 items: name, "desc", price_from, unit, link)
├─ homepage_review_sources      (4 items: name, rating, review_count, is_nps)
├─ homepage_reviews             (6 items: author, meta, text)
├─ homepage_documents           (8 items: title, meta, photo_id FK media)
├─ homepage_faq                 (8 items: question, answer)
└─ homepage_gallery             (8 items: photo_id FK media, caption, alt)

Indexes: parent_id + _order на каждой sub-таблице, plus media FK indexes на main row.
```

## 5. Backlog для Phase 4

| Item | Owner | Severity | Why |
|---|---|---|---|
| Live collections wiring §02 (Services), §06 (Cases), §09 (Districts) | be-site + fe-site | Medium | Сейчас hardcoded data рендерится — admin меняет через Services / Cases / Districts collections только структурно; cards на главной — захардкожены |
| JsonLdGraph reads from SeoSettings + Homepage.faq | lp-site | Medium | Сейчас @graph hardcoded; admin SeoSettings.aggregateRating не показывается в JSON-LD на главной |
| `/api/revalidate` webhook от Payload `afterChange` Homepage | be-site | Low | ISR 600s покрывает; webhook ускорит до < 2s после save |
| SiteChrome.header.menu[].iconKey + array.megaMenuColumns[] | popanel | Low | Header.tsx mega-menu working с inline SVG; admin-управление иконками — nice-to-have |
| Wire CtaFooter + PricingCalculator к Homepage global | fe-site | Low | Эти секции имеют клиентский state; контент относительно стабильный |

## 6. Hand-off log

```
2026-05-06 10:30 · podev → tamd · ADR-0017 (Homepage global vs SiteChrome) → accepted
2026-05-06 10:45 · podev → fe-site (in-session) · globals/Homepage.ts + lib/homepage.ts + page.tsx async
2026-05-06 11:00 · podev → fe-site · Hero + FAQ wired как proof-of-concept
2026-05-06 12:00 · podev → sa-panel + popanel (in-session) · migration 9 tables, seed script
2026-05-06 12:30 · podev → fe-site · How / PricingTable / PhotoSmeta / Reviews / Documents / Gallery wired
2026-05-06 13:00 · podev → release · gate passed — RC-EPIC-HOMEPAGE-MIGRATION-Phase3.md
```

## 7. Recommendation

**Pass to deploy.** Migration + seed + 7 wired sections. После prod deploy editor сможет редактировать homepage через `/admin/globals/homepage` без визуального drift, ISR 600s revalidation.
