/**
 * Stage 2 W10 Track B Run 4 — batch генерация 20 SD hero для programmatic-sd.
 *
 * Cohesion: 4 pillar × 4 districts (16) + 4 avtovyshka × 4 districts (4) = 20
 * unique hero на 100 SD URL'ов. Hero шарится между sub'ами одного pillar в
 * пределах района (см. _manifest.json в `site/content/stage2-w10-sd-batch/`).
 *
 * mini-case.imageUrl в SD JSONs остаются TBD (defer to W14 cleanup,
 * cost-sensitive).
 *
 * Запуск:
 *   pnpm tsx --env-file=.env.local scripts/generate-stage2-w10-sd.ts
 *   pnpm tsx --env-file=.env.local scripts/generate-stage2-w10-sd.ts --force
 *   pnpm tsx --env-file=.env.local scripts/generate-stage2-w10-sd.ts --only=sd-arboristika-ramenskoye-hero
 *
 * Требует FAL_KEY в site/.env.local.
 *
 * art consistency:
 *   - 4 pillar (vyvoz-musora / arboristika / chistka-krysh / demontazh) →
 *     `sdHeroPrompt` (object-focused, no humans, anti-§14 встроены)
 *   - avtovyshka → `staticHeroPrompt` с per-district visualConcept
 *     (object-focused техника без людей в кадре).
 */
import { runBatch } from './_run-fal-batch'

void runBatch({
  batchPath: 'site/public/uploads/stage2-w10/prompts-batch.json',
  label: 'Stage 2 W10 SD-hero generation (20 unique × 100 URL cohesion)',
})
