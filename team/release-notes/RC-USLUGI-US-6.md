---
rc: USLUGI-US-6
target: US-6 final QA gate (regression check Playwright + axe-core + Web Vitals на live data)
epic: EPIC-SEO-USLUGI
branch: seo/epic-uslugi-6-final-qa
status: ready-for-operator-approve
created: 2026-05-08
author: release
---

# RC-USLUGI-US-6

**Status: ✅ READY for operator approve.**

leadqa-6 PASS 10/10 AC. **QA-only release** (no code changes — только artefacts + leadqa отчёт).

## Scope

- `specs/EPIC-SEO-USLUGI/US-6-final-qa/leadqa-6.md` — отчёт final QA
- `team/release-notes/RC-USLUGI-US-6.md` — этот gate
- `screen/us-6/` (16 PNG full-page screenshots, 4 templates × 4 viewports) — gitignored

## Verification gate

| # | Gate | Status |
|---|---|---|
| 1 | 4 templates HTTP 200 на live dev (Phase A контент seeded) | ✅ |
| 2 | 16 Playwright screenshots × 4 viewports | ✅ |
| 3 | axe-core 0 critical × 4 templates | ✅ |
| 4 | axe-core serious -82% vs US-2 (sustained 237 → 44 nodes после Phase A контента) | ✅ |
| 5 | Web Vitals LCP <2.5s (dev=296ms) | ✅ |
| 6 | Web Vitals CLS <0.1 (=0.0) | ✅ |
| 7 | JSON-LD coverage per template (T1=4, T2=5, T3=4, T4=6) | ✅ |
| 8 | T4 SD render Phase A контент visible (≥150 слов, 6 микрорайонов, 3 FAQ) | ✅ |
| 9 | Sustained regression (T1/T2/T3 HTTP 200) | ✅ |
| 10 | leadqa-6 verdict PASS | ✅ |

**10/10 PASS.**

## Risk

**NONE.** QA-only release — никакого исполняемого кода/data writes/deploy. Worst-case: `git revert` коммита (только specs + RC).

## Recommendation

**APPROVE.** US-7 deploy unblocked.

## Conditional follow-ups для US-7

1. color-contrast 22 nodes T1 (placeholder hub-cards) → US-5 Phase C content-extension
2. color-contrast 14 nodes T4 b2b-block (gradient) → minor CSS fix
3. Lighthouse CI mobile preset job (sustained desktop only) → optional
4. Production Web Vitals monitoring через week-1 Lighthouse CI + Я.Метрика

## Hand-off log

```
2026-05-08 · poseo: dispatch US-6 final QA gate
2026-05-08 · leadqa: 16 screenshots + 4 axe-core scan + Web Vitals LCP/CLS
2026-05-08 · leadqa: 10/10 AC PASS — Phase A контент валидирован, T4 рендерится
2026-05-08 · release → operator: APPROVE pending для US-7 deploy
```
