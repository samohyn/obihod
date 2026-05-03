/**
 * Stage 3 W13 Wave 1 Run 3 — batch генерация 6 case hero (priority-B + cross-pillar).
 *
 * Тонкий runner поверх shared `runBatch` ядра (`scripts/_run-fal-batch.ts`).
 * Все промпты и метаданные — в prompts-batch.json рядом с output dir.
 *
 * Sustained Stage 2 W11 pattern:
 *   - case-viz use case (`generateByUseCase('case-viz', …)`)
 *   - flux/schnell unified
 *   - object-focused after-only (cw fixtures имеют только after-image ref)
 *   - anti-§14 prokidyvaem через `params.extra` (no humans / no creatures /
 *     no aggressive tools / no readable text)
 *
 * Cases (6):
 *   09 vyvoz-konteyner-27m3-khimki-aviasklad      → cluster: musor       (B2B)
 *   10 spil-8-derevev-snt-pushkino                → cluster: arboristika (СНТ B2C)
 *   11 chistka-livnevyh-krysh-istra               → cluster: krishi      (B2B ВД-зона)
 *   12 demontazh-aviasklada-zhukovskij            → cluster: demontazh   (B2B индустриал)
 *   13 4v1-dacha-istra-cross-pillar               → cluster: demontazh   (cross-pillar 4-в-1)
 *   14 sezon-chistka-vpp-spil-zhukovskij          → cluster: krishi      (cross-pillar krishi+arbo)
 *
 * Запуск:
 *   pnpm tsx --env-file=.env.local scripts/generate-stage3-w13-cases.ts
 *   pnpm tsx --env-file=.env.local scripts/generate-stage3-w13-cases.ts --force
 *   pnpm tsx --env-file=.env.local scripts/generate-stage3-w13-cases.ts --only=case-09-khimki-aviasklad-after
 */
import { runBatch } from './_run-fal-batch'

void runBatch({
  batchPath: 'site/public/uploads/stage3-w13-cases/prompts-batch.json',
  label: 'Stage 3 W13 case-viz generation (6 hero priority-B + cross-pillar)',
})
