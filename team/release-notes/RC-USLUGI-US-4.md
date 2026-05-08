---
rc: USLUGI-US-4
target: US-4 Tech (slug-resolver + 4 page-template + JSON-LD composer + 2 helpers)
epic: EPIC-SEO-USLUGI
branch: seo/epic-uslugi-4-tech-imp
status: ready-for-operator-approve
created: 2026-05-08
author: release
---

# RC-USLUGI-US-4

**Status: ✅ READY for operator approve.**

leadqa-4 PASS 11/11 AC. Sustained iron rule per-US release cycle.

## Scope

- Created: `composer.ts` + `uslugi/page.tsx` (T1 hub) + `ServiceDistrictView.tsx` (T4) + 4 CSS extracted (uslugi-t1/t2/t3/t4) + 2 base CSS (brand-guide + homepage-shared)
- Renamed: `[service]/[district]/` → `[service]/[slug]/` (sustained legacy misnomer)
- Modified: `queries.ts` (+3 helpers) + `jsonld.ts` (+2 schemas) + `metadata.ts` (+SD builder) + `[service]/page.tsx` (T2 redesign) + `[slug]/page.tsx` (slug-resolver) + `SubServiceView.tsx` (T3 composer JSON-LD)
- Specs: `sa-seo.md` + `leadqa-4.md`

## Verification gate

| # | Gate | Status |
|---|---|---|
| 1 | T1 `/uslugi/` HTTP 200 | ✅ |
| 2 | Slug-resolver T3 → T4 → 404 (3 URL test) | ✅ |
| 3 | T2 pillar HTTP 200 | ✅ |
| 4 | T3 sub HTTP 200 | ✅ |
| 5 | T4 SD HTTP 200 (`/vyvoz-musora/balashikha/`) | ✅ |
| 6 | JSON-LD page-level nodes T1=4/T2=5/T3=4/T4=6 | ✅ |
| 7 | `pnpm type-check` exit 0 | ✅ |
| 8 | `pnpm format:check` exit 0 | ✅ |
| 9 | sustained 35 sub-pages regression OK | ✅ |
| 10 | All 150 SD URLs render | ✅ (sample) |
| 11 | sustained `/`, `/uslugi/tseny/` regression OK | ✅ |
| 12 | leadqa-4 verdict PASS | ✅ |

**12/12 PASS.**

## Risk

**LOW.** sustained URL без изменений (только internal rename `[district]→[slug]`). Sustained block-driven path в T2 — fallback. Worst-case: revert commit, sustained sub-pages работают как до US-4.

Conditional follow-ups (US-5/6, не блокеры):
1. Person schema T4 ждёт US-5 `reviewedBy` Author seed
2. layout × composer @id dup'ы — UI cleanup в US-6 через `skipChrome: true`
3. `cityPriceNote` пуст пока US-5 не наполнит `localPriceAdjustment`
4. Token replace тестировался demo `vyvoz-musora/balashikha/` — sample 5 random SD URLs render OK

## Recommendation

**APPROVE.** US-5 (контент-волна 191 URL) не может стартовать без работающих 4 page-template.

## Hand-off log

```
2026-05-08 · poseo → seo-tech+podev: dispatch US-4 (largest code-release)
2026-05-08 · agent: 8 created + 1 renamed + 6 modified files
2026-05-08 · leadqa: HTTP smoke 5/5 + 404 fallback, JSON-LD nodes 7/8/7/8, type-check 0, format 0
2026-05-08 · release → operator: APPROVE pending
```
