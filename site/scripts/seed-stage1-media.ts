/**
 * Stage 1 Track B — seed hero images в Payload Media collection.
 *
 * Идемпотентен: для каждого item ищем по `filename`, если уже есть — skip
 * (Payload UI / админ оператора не перезатираем). Если нет — создаём с
 * filePath (Payload сам прогонит через sharp + создаст thumb/card/hero/og
 * variants per Media.ts upload.imageSizes config).
 *
 * Run 1 (W4 default): 5 hero × 4 pillar + foto-smeta.
 * --all (W7 Track D): 24 hero across Run 1+2+3 — pillar 5 + districts 4 +
 *   home 1 + static 3 + SD 4 + blog 5 + author 2 = 24.
 *
 * Запуск:
 *   pnpm seed:stage1-media          — Run 1 only (5 hero W4)
 *   pnpm seed:stage1-media:all      — все 24 hero (W4+W5+W6)
 *   OBIKHOD_SEED_CONFIRM=yes pnpm seed:stage1-media:all:prod   # prod
 *
 * Safety-gate: на prod без OBIKHOD_SEED_CONFIRM=yes — exit без изменений.
 *
 * Spec: specs/EPIC-SEO-CONTENT-FILL/US-1-pillars-pilot/intake.md (Track B Run 1+2+3).
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { getPayload } from 'payload'
import config from '../payload.config.js'

const REPO_ROOT = resolve(__dirname, '..')
const RUN1_BATCH_PATH = resolve(REPO_ROOT, 'public/uploads/stage1-w4/prompts-batch.json')
const ALL_BATCH_PATHS = [
  resolve(REPO_ROOT, 'public/uploads/stage1-w4/prompts-batch.json'),
  resolve(REPO_ROOT, 'public/uploads/stage1-w5/prompts-batch.json'),
  resolve(REPO_ROOT, 'public/uploads/stage1-w5/prompts-batch-run3-static.json'),
  resolve(REPO_ROOT, 'public/uploads/stage1-w6/prompts-batch.json'),
  resolve(REPO_ROOT, 'public/uploads/stage1-w6/prompts-batch-run3-sd.json'),
  resolve(REPO_ROOT, 'public/uploads/stage1-w6/prompts-batch-run3-authors.json'),
]

type BatchItem = {
  id: string
  page?: string
  fixture?: string
  outFile: string
  publicPath?: string
  alt: string
}

type Batch = { items: BatchItem[] }

type SeedStatus = 'created' | 'skipped' | 'error'
type SeedResult = { id: string; status: SeedStatus; message: string }

function isProdHost(): boolean {
  const uri = process.env.DATABASE_URI ?? ''
  return /45\.153\.190\.107|obikhod\.ru/.test(uri) || process.env.OBIKHOD_ENV === 'production'
}

function gateProd(): void {
  if (!isProdHost()) return
  if (process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('✗ prod-host detected; require OBIKHOD_SEED_CONFIRM=yes to proceed.')
    process.exit(1)
  }
}

async function seedItem(
  payload: Awaited<ReturnType<typeof getPayload>>,
  item: BatchItem,
  stageHint: string,
): Promise<SeedResult> {
  // outFile может быть либо абсолютным от репо ('site/public/...'), либо относительным
  // от REPO_ROOT (run3 batches уже без 'site/' префикса). Поддерживаем оба варианта.
  const cleaned = item.outFile.replace(/^site\//, '')
  const absPath = resolve(REPO_ROOT, cleaned)
  if (!existsSync(absPath)) {
    return { id: item.id, status: 'error', message: `file not found: ${absPath}` }
  }
  const filename = `${item.id}.jpg`

  // Idempotent: skip если media с таким filename уже есть.
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    return {
      id: item.id,
      status: 'skipped',
      message: `already in Media (id=${(existing.docs[0] as { id: string | number }).id})`,
    }
  }

  try {
    const buffer = readFileSync(absPath)
    const created = await payload.create({
      collection: 'media',
      data: {
        alt: item.alt,
        caption: `Stage 1 ${stageHint} hero — ${item.page ?? item.id}`,
        // fal.ai → license=proprietary (наша модель).
        license: 'proprietary',
        geoLocation: null,
      },
      file: {
        data: buffer,
        mimetype: 'image/jpeg',
        name: filename,
        size: buffer.byteLength,
      },
      overrideAccess: true,
    })
    return {
      id: item.id,
      status: 'created',
      message: `Media id=${(created as { id: string | number }).id}, filename=${filename}`,
    }
  } catch (e) {
    return {
      id: item.id,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

async function main(): Promise<void> {
  gateProd()
  const all = process.argv.includes('--all')
  const batchPaths = all ? ALL_BATCH_PATHS : [RUN1_BATCH_PATH]

  const items: { item: BatchItem; stage: string }[] = []
  for (const bp of batchPaths) {
    if (!existsSync(bp)) {
      console.warn(`⚠ batch json missing: ${bp} — skip`)
      continue
    }
    const batch = JSON.parse(readFileSync(bp, 'utf-8')) as Batch
    const stage = bp.includes('stage1-w4')
      ? 'W4'
      : bp.includes('stage1-w5')
        ? 'W5'
        : bp.includes('stage1-w6')
          ? 'W6'
          : 'W?'
    for (const item of batch.items) items.push({ item, stage })
  }

  console.log(
    `Stage 1 media seed: ${items.length} item(s) ${all ? '(--all: W4+W5+W6)' : '(W4 only)'}`,
  )
  const payload = await getPayload({ config })

  const results: SeedResult[] = []
  for (const { item, stage } of items) {
    const r = await seedItem(payload, item, stage)
    const icon = r.status === 'created' ? '✓' : r.status === 'skipped' ? '⏭' : '✗'
    console.log(`  ${icon} ${r.id} · ${r.status} · ${r.message}`)
    results.push(r)
  }

  const errors = results.filter((r) => r.status === 'error')
  console.log('')
  if (errors.length === 0) {
    console.log(
      `✓ Done · created=${results.filter((r) => r.status === 'created').length}, skipped=${results.filter((r) => r.status === 'skipped').length}`,
    )
    process.exit(0)
  }
  console.error(`✗ Done with errors · ${errors.length}/${results.length}`)
  process.exit(1)
}

main().catch((err) => {
  console.error('✗ Fatal:', err)
  process.exit(1)
})
