/**
 * Stage 1 W6 Track B Run 3 — batch генерация 4 SD hero (Одинцово × 4 услуги).
 *
 * Читает `site/public/uploads/stage1-w6/prompts-batch-run3-sd.json`, прогоняет
 * каждый item через fal.ai (flux/schnell), скачивает JPEG в outFile.
 * Идемпотентен: если файл уже есть — skip (use --force чтобы перегенерировать).
 *
 * Запуск:
 *   pnpm tsx --env-file=.env.local scripts/generate-stage1-w6-sd-hero.ts
 *   pnpm tsx --env-file=.env.local scripts/generate-stage1-w6-sd-hero.ts --force
 *   pnpm tsx --env-file=.env.local scripts/generate-stage1-w6-sd-hero.ts --only=sd-arboristika-odincovo-hero
 *
 * Требует FAL_KEY в site/.env.local.
 *
 * art consistency: все prompts через `sdHeroPrompt` (см. prompts.ts §Stage 1 W6 Run 3).
 */
import { runBatch } from './_run-fal-batch'

void runBatch({
  batchPath: 'site/public/uploads/stage1-w6/prompts-batch-run3-sd.json',
  label: 'Stage 1 W6 SD-hero generation',
})
