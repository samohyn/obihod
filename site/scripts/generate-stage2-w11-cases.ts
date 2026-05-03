/**
 * Stage 2 W11 Track B Run 4 — batch генерация 16 case images (8 cases × before/after).
 *
 * Использует `caseVizPrompt` через `generateByUseCase('case-viz', …)`.
 * Anti-§14: «no humans, no figures, no silhouettes» прокидывается через
 * `params.extra` (caseVizPrompt по умолчанию не включает анти-people, см.
 * site/lib/fal/prompts.ts L85-109 — мы делаем это per-item чтобы не трогать
 * shared prompt-функцию).
 *
 * Cases:
 *   01 vyvoz-stroymusora-odincovo-mart       → cluster: musor
 *   02 vyvoz-mkd-mytishchi-uk-podpis         → cluster: musor
 *   03 spil-avariynyy-krasnogorsk            → cluster: arboristika
 *   04 obrezka-fruktovogo-sada-ramenskoye    → cluster: arboristika
 *   05 chistka-naledi-mkd-odincovo           → cluster: krishi
 *   06 chistka-chastnyy-dom-mytishchi        → cluster: krishi
 *   07 demontazh-dachi-staraya-krasnogorsk   → cluster: demontazh
 *   08 snos-zabora-zastroyshchik-ramenskoye  → cluster: demontazh
 *
 * Case JSONs ссылаются только на `-after.jpg` (heroImageUrl + hero.image.src).
 * `-before.jpg` сохраняются в /uploads/stage2-w11-cases/ как media library.
 *
 * Запуск:
 *   pnpm tsx --env-file=.env.local scripts/generate-stage2-w11-cases.ts
 *   pnpm tsx --env-file=.env.local scripts/generate-stage2-w11-cases.ts --force
 *   pnpm tsx --env-file=.env.local scripts/generate-stage2-w11-cases.ts --only=case-spil-krasnogorsk-after
 */
import { runBatch } from './_run-fal-batch'

void runBatch({
  batchPath: 'site/public/uploads/stage2-w11-cases/prompts-batch.json',
  label: 'Stage 2 W11 case-viz generation (8 cases × before+after = 16)',
})
