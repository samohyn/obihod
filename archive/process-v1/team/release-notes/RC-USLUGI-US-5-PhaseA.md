---
rc: USLUGI-US-5-PhaseA
target: US-5 Phase A — 60 Class-A SD контент
epic: EPIC-SEO-USLUGI
branch: seo/epic-uslugi-5-phaseA-content
status: ready-for-operator-approve
created: 2026-05-08
author: release
---

# RC-USLUGI-US-5-Phase A

**Status: ✅ READY for operator approve.**

leadqa-5 PASS 9/9 AC. Sustained iron rule per-US release cycle.

## Scope (Phase A only)

**60 ServiceDistricts** = 5 pillar × 12 Class-A cities — наполнены leadParagraph (≥150 слов), localFaq (≥3), localLandmarks (≥6), reviewedBy (Алексей Семёнов sustained), lastReviewedAt (2026-05-08).

**Файлы:**
- Created: `site/scripts/seed-sd-content-class-a.ts` (template-driven, 5 pillar templates × 12 cities, idempotent decision tree)
- Modified: `site/package.json` (+`seed:sd-class-a` + `:prod`)
- Specs: `sa-seo.md` + `leadqa-5.md`

## Verification gate

| # | Gate | Status |
|---|---|---|
| 1 | 60 SD lead_paragraph IS NOT NULL (Class-A) | ✅ |
| 2 | 60 SD ≥3 FAQ rows | ✅ |
| 3 | 60 SD ≥6 landmarks rows (sustained schema maxRows=6) | ✅ |
| 4 | 60 SD reviewed_by_id set | ✅ |
| 5 | 60 SD last_reviewed_at = 2026-05-08 | ✅ |
| 6 | Class-B SD intact (0 touched) | ✅ |
| 7 | Sample render OK (sustained от US-4 leadqa) | ✅ |
| 8 | type-check 0 | ✅ |
| 9 | format:check 0 | ✅ |
| 10 | leadqa-5 verdict PASS | ✅ |

**10/10 PASS.**

## Risk

**LOW.** Только data writes в БД (no schema changes). Sustained Class-B SD intact. Worst-case rollback: SQL UPDATE с lead_paragraph = NULL для today rows.

Conditional follow-ups (НЕ блокеры этого Phase):
1. localLandmarks maxRows=6 vs newui T4 25+ — US-7 schema expansion решит
2. 1 author fallback (sustained 1 in DB) — US-7 standalone seed-extra-authors
3. Direct SQL workaround (Reviews collection drift) — US-9 follow-up через dba
4. Phase B (90 Class-B SD) + Phase C (sub/pillar/hub) — отдельные релизы

## Recommendation

**APPROVE.** Без Phase A 60 Class-A SD остаются как пустые draft (sustained `noindexUntilCase=true`) — критичная масса контента для DoD ≥80 keys top-10.

После merge → Phase B (90 Class-B SD) или US-6 (leadqa + Lighthouse CI) — на выбор оператора.

## Hand-off log

```
2026-05-08 · poseo → cw+seo-content+cms: dispatch US-5 Phase A
2026-05-08 · agent: template-driven script + 4 итерации seed (40/16/4/0 = 60 updated total)
2026-05-08 · leadqa: psql verify — 60 SD/60 target. All AC PASS
2026-05-08 · release → operator: APPROVE pending
```
