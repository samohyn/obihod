/**
 * Stage 1 W5 Track B Run 3 — batch генерация 3 static hero
 * (о компании, как мы работаем, гарантии).
 *
 * Читает `site/public/uploads/stage1-w5/prompts-batch-run3-static.json`,
 * прогоняет каждый item через fal.ai (flux/schnell), скачивает JPEG в outFile.
 * Идемпотентен: если файл уже есть — skip.
 *
 * Запуск:
 *   pnpm tsx --env-file=.env.local scripts/generate-stage1-w5-static.ts
 *   pnpm tsx --env-file=.env.local scripts/generate-stage1-w5-static.ts --force
 *
 * art consistency: object-focused still-life через `staticHeroPrompt`
 * (нет людей, нет читаемого текста, fail-fast §14).
 */
import { runBatch } from './_run-fal-batch'

void runBatch({
  batchPath: 'site/public/uploads/stage1-w5/prompts-batch-run3-static.json',
  label: 'Stage 1 W5 static-hero generation',
})
