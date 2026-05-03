/**
 * Stage 1 W6 Track B Run 3 — batch генерация 2 author avatars.
 *
 * Читает `site/public/uploads/stage1-w6/prompts-batch-run3-authors.json`,
 * прогоняет каждый item через fal.ai (flux/schnell), скачивает JPEG в outFile.
 * Идемпотентен: если файл уже есть — skip.
 *
 * Запуск:
 *   pnpm tsx --env-file=.env.local scripts/generate-stage1-w6-authors.ts
 *   pnpm tsx --env-file=.env.local scripts/generate-stage1-w6-authors.ts --force
 *
 * art consistency: silhouette + symbol варианты `companyAuthorAvatarPrompt`
 * (нет лиц, privacy-first, brand voice Caregiver+Ruler).
 */
import { runBatch } from './_run-fal-batch'

void runBatch({
  batchPath: 'site/public/uploads/stage1-w6/prompts-batch-run3-authors.json',
  label: 'Stage 1 W6 author-avatar generation',
})
