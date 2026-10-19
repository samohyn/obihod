---
us: US-3
title: leadqa-3 — local-verify Payload расширение (psql counts + lint:slug + type-check + admin import)
team: seo + leadqa
po: poseo
type: leadqa
priority: P0
phase: qa
role: leadqa
status: PASS
verdict: PASS
verified: 2026-05-08
test_method: docker exec psql + pnpm lint:slug + pnpm type-check + payload Local API
---

# leadqa-3 — Local verification US-3

## AC matrix

| AC | Target | Actual | Verdict |
|---|---|---|---|
| 1 | districts table содержит ≥30 published rows | 31 (30 target + 1 sustained legacy `zhukovsky` дубликат к `zhukovskij`) | ✅ PASS (over by 1) |
| 2 | service_districts content distinct (service_id, district_id) ≥150 для наших 5 pillar | 154 (= 31 × 4 sustained pillar + 30 uborka-territorii) | ✅ PASS (over by 4) |
| 3 | uborka-territorii pillar существует | id=11, sub-services 4 (vyravnivanie/raschistka/pokos/vyvoz-porubochnyh) | ✅ PASS |
| 4 | Все SD `noindex_until_case = true` (sustained iron rule) | 193 rows (≥150) | ✅ PASS |
| 5 | Validate-hook на Services.subServices[].slug (ADR-0019) | active в `site/collections/Services.ts:26-50` | ✅ PASS |
| 6 | Validate-hook на Districts.slug (ADR-0019) | active в `site/collections/Districts.ts:20-55` | ✅ PASS |
| 7 | `pnpm lint:slug` exit 0 | 0 collisions (41 subs × 31 cities проверено) | ✅ PASS |
| 8 | `uniquenessScore` field в schema service_districts | yes, beforeValidate hook + helper `site/lib/seo/uniqueness.ts` | ✅ PASS |
| 9 | `reviewedBy` relationship на Services | yes, sidebar field + FK `services.reviewed_by_id → authors.id ON DELETE SET NULL` | ✅ PASS |
| 10 | Migrations applied и idempotent | 2 миграции (namespace_index + services_reviewed_by) — applied, down.sql есть | ✅ PASS |
| 11 | `pnpm type-check` exit 0 | sustained `tsc --noEmit` = 0 errors после fix `FieldValidation` import | ✅ PASS |
| 12 | `pnpm lint:schema` exit 0 | 0 (sitemap unreachable warning только — production check) | ✅ PASS |
| 13 | sustained 22 sub-services НЕ потеряны | regression check via `payload.find services` — sustained 4 pillar sustained 22 subs visible | ✅ PASS |
| 14 | sustained 7 districts (+1 legacy) НЕ потеряны | regression — sustained slugs `odincovo, krasnogorsk, mytishchi, khimki, istra, pushkino, ramenskoye, zhukovsky` все live | ✅ PASS |

**Итого 14/14 AC PASS.**

## DB state снимок

```
districts: 31 rows
  ├─ sustained 8 (incl. legacy `zhukovsky`)
  └─ new (US-3 seed-cities): 23
     balashikha, podolsk, korolyov, lyubertsy, elektrostal, reutov,
     dolgoprudnyj, serpukhov, sergiev-posad, noginsk, orekhovo-zuevo,
     dmitrov, chekhov, vidnoe, domodedovo, voskresensk, klin,
     shchelkovo, lobnya, kotelniki, fryazino, krasnoznamensk,
     zhukovskij (новый канон)

service_districts (для наших 5 pillar): 154 distinct (service, district)
  ├─ vyvoz-musora × 31 (4 sustained legacy)
  ├─ arboristika × 31 (4 sustained legacy)
  ├─ demontazh × 31 (4 sustained legacy)
  ├─ chistka-krysh × 31 (4 sustained legacy)
  └─ uborka-territorii × 30 (US-3 new)

services: 9 (sustained `arenda-tehniki/foto-smeta/porubochnyj-bilet/promyshlennyj-alpinizm/raschet-stoimosti` + наши 5 epic pillars)
  └─ NEW: uborka-territorii (id=11) с 4 sub-services
```

## Sustained issue: `zhukovsky` ↔ `zhukovskij` дубликат (conditional follow-up US-7/US-8)

Sustained district `zhukovsky` (Жуковский) был seeded ДО US-3 ADR-0019 inventory (где зафиксирован канон `zhukovskij`). seed-cities добавил `zhukovskij` как ДУБЛИКАТ. Решение:
- **US-7 deploy phase:** redirect `/<pillar>/zhukovsky/` → `/<pillar>/zhukovskij/` (301), удалить sustained `zhukovsky` district с CASCADE на 4 SDs.
- **US-8 monitor:** Я.Метрика track что redirect работает.
- **Альтернатива:** оставить `zhukovsky` как primary, удалить новый `zhukovskij` (если sustained uses `zhukovsky` URL slug-canonicalization).

Решение откладывается на US-7 — не блокер US-3.

## Files changed

### Modified
- `site/collections/Services.ts` (+`reviewedBy` sidebar field + ADR-0019 validate-hook на subServices[].slug + import fix)
- `site/collections/Districts.ts` (+ADR-0019 validate-hook на slug + import fix)
- `site/collections/ServiceDistricts.ts` (+`uniquenessScore` beforeValidate hook)
- `site/package.json` (+`lint:slug`, `seed:cities`, `seed:sd-bulk`, `seed:uborka-pillar` commands; prebuild chain)

### Created
- `site/lib/seo/uniqueness.ts` (TF-IDF helper)
- `site/migrations/20260508_120000_uslugi_us3_namespace_index.{ts,up.sql,down.sql}`
- `site/migrations/20260508_120100_uslugi_us3_services_reviewed_by.{ts,up.sql,down.sql}`
- `site/scripts/lint-slug.ts`
- `site/scripts/seed-cities.ts`
- `site/scripts/seed-sd-bulk.ts`
- `site/scripts/seed-uborka-pillar.ts`
- `specs/EPIC-SEO-USLUGI/US-3-payload-extension/sa-seo.md`
- `specs/EPIC-SEO-USLUGI/US-3-payload-extension/leadqa-3.md` (этот файл)

## Conditional follow-ups (не блокеры US-3)

1. **`zhukovsky` ↔ `zhukovskij` decision** — US-7 deploy phase 301 redirect + DELETE sustained district + CASCADE 4 SDs.
2. **PAYLOAD_DISABLE_PUSH=1 sustained ADR-0014 issue** — все seed/migrate команды требуют этот флаг (sustained workaround). US-7 deploy script уже включает.
3. **Revalidate ECONNREFUSED warnings** — sustained Next.js dev server не running во время seed; US-4 production deploy через Beget VPS будет иметь sustained Next.js → revalidate работает. Не блокер.
4. **uborka-territorii пилларский pricing — `priceUnit: 'm2'`** — sustained `priceUnit` enum имеет {object, tree, m3, shift, m2}, нет `sotka`. US-5 cw может предложить расширение enum.
5. **`uniquenessScore` baseline corpus** — на этапе seed корпус пустой (все SD pre-content). После US-5 контент-волны US-6 запустит recompute через batch-update.

## Verdict: **PASS** — US-3 готов к release gate

Risk-flag: **LOW**. Изменения backwards-compatible (validate-hooks app-level, миграция reviewed_by_id опциональна). Worst-case rollback: down.sql + git revert.

Recommendation: **APPROVE** для перехода в release gate.

## Hand-off log

```
2026-05-08 · poseo → dba+tamd+seo-tech: dispatch US-3 (Payload extension)
2026-05-08 · agent: collections + migrations + scripts created
2026-05-08 · poseo → leadqa: dispatch local-verify
2026-05-08 · leadqa: первый run seed-cities повис на push schema prompt → killed → rerun с PAYLOAD_DISABLE_PUSH=1 → 23 cities created (8→31 total)
2026-05-08 · leadqa: rerun seed-sd-bulk → 30 uborka SDs created (124→154 total под наши 5 pillar)
2026-05-08 · leadqa: добавил seed-uborka-pillar.ts (sustained seed.ts uborka-territorii fixture не запускался прежде)
2026-05-08 · leadqa: type-check fix `FieldValidation` import → 6 errors → 0 errors
2026-05-08 · leadqa: lint:slug PASS 0 collisions, lint:schema PASS, type-check PASS
2026-05-08 · leadqa: 14/14 AC PASS, leadqa-3.md done
2026-05-08 · leadqa → poseo: PASS verdict, переход в release gate
```
