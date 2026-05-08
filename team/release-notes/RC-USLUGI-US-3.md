---
rc: USLUGI-US-3
target: US-3 Payload расширение (collections + migrations + scripts + seeds + validate-hooks)
epic: EPIC-SEO-USLUGI
branch: seo/epic-uslugi-3-payload-extension
status: ready-for-operator-approve
created: 2026-05-08
author: release
---

# RC-USLUGI-US-3

**Status: ✅ READY for operator approve.**

leadqa-3 PASS 14/14 AC. Sustained iron rule per-US release cycle.

## Scope

- **Modified:** `Services.ts`, `Districts.ts`, `ServiceDistricts.ts`, `package.json`
- **Created:**
  - 2 миграции (namespace_index + services_reviewed_by)
  - 4 scripts (lint-slug, seed-cities, seed-sd-bulk, seed-uborka-pillar)
  - 1 helper (`site/lib/seo/uniqueness.ts`)
  - sa-seo.md + leadqa-3.md

## Verification gate

| # | Gate | Status |
|---|---|---|
| 1 | districts ≥30 | ✅ 31 |
| 2 | service_districts ≥150 для 5 pillar | ✅ 154 |
| 3 | uborka-territorii pillar exists | ✅ id=11 |
| 4 | All SDs noindex_until_case=true | ✅ 193 |
| 5 | Validate-hooks Services + Districts | ✅ active |
| 6 | `pnpm lint:slug` exit 0 | ✅ 0 collisions |
| 7 | `uniquenessScore` beforeValidate | ✅ + uniqueness.ts |
| 8 | `reviewedBy` relationship | ✅ FK on authors |
| 9 | Migrations applied + idempotent | ✅ 2 миграции |
| 10 | `pnpm type-check` exit 0 | ✅ |
| 11 | `pnpm lint:schema` exit 0 | ✅ |
| 12 | sustained 22 sub-services intact | ✅ regression OK |
| 13 | sustained 7 districts intact | ✅ regression OK |
| 14 | leadqa-3 verdict PASS | ✅ |

**14/14 PASS.**

## Risk

**LOW.** Backwards-compatible изменения (app-level validate-hooks + опциональная FK reviewed_by_id). Worst-case rollback: down.sql + git revert.

Conditional follow-ups (не блокеры):
1. zhukovsky ↔ zhukovskij дубликат → US-7 redirect cleanup
2. PAYLOAD_DISABLE_PUSH=1 sustained ADR-0014 — US-7 deploy script
3. Revalidate ECONNREFUSED во время seed — non-issue в production (Next.js up)
4. uniquenessScore baseline пустой при seed → US-6 batch-recompute

## Recommendation

**APPROVE.** Без US-3 US-4 не сможет запустить slug-resolver (нет 30 cities + 150 SD в БД).

## Hand-off log

```
2026-05-08 · poseo → dba+tamd+seo-tech: dispatch US-3
2026-05-08 · agent: imp 9 файлов
2026-05-08 · leadqa: 2 fix (PAYLOAD_DISABLE_PUSH + uborka pillar seed + FieldValidation type fix), затем 14/14 AC PASS
2026-05-08 · release → operator: APPROVE pending
```
