/**
 * Stage 2 W11 Track B — seed Stage 2 hero/case images в Payload Media collection.
 *
 * Источники (2 batches):
 *   - public/uploads/stage2-w10/prompts-batch.json   — 20 SD heroes (4 pillar × 4 districts + 4 avtovyshka)
 *   - public/uploads/stage2-w11-cases/prompts-batch.json — 16 case images (8 cases × {before, after})
 *
 * Total: 36 Stage 2 images.
 *
 * Идемпотентен: для каждого item ищем по `filename`, skip если уже есть.
 *
 * Запуск:
 *   pnpm seed:stage2-media                                  # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm seed:stage2-media:prod    # prod
 *
 * Safety-gate: на prod без OBIKHOD_SEED_CONFIRM=yes — exit без изменений.
 *
 * Spec: specs/EPIC-SEO-CONTENT-FILL/US-2-sub-and-programmatic/sa-seo.md AC-7.
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { getPayload } from 'payload'
import config from '../payload.config.js'

const REPO_ROOT = resolve(__dirname, '..')
const BATCH_PATHS = [
  resolve(REPO_ROOT, 'public/uploads/stage2-w10/prompts-batch.json'),
  resolve(REPO_ROOT, 'public/uploads/stage2-w11-cases/prompts-batch.json'),
]

type BatchItem = {
  id: string
  page?: string
  fixture?: string
  outFile: string
  publicPath?: string
  alt: string
  useCase?: string
}

type Batch = { items: BatchItem[]; _meta?: Record<string, unknown> }

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
  // outFile может быть `site/public/uploads/stage2-w10/...` или относительным;
  // поддерживаем оба.
  const cleaned = item.outFile.replace(/^site\//, '')
  const absPath = resolve(REPO_ROOT, cleaned)
  if (!existsSync(absPath)) {
    return { id: item.id, status: 'error', message: `file not found: ${absPath}` }
  }
  const filename = `${item.id}.jpg`

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
        caption: `Stage 2 ${stageHint} — ${item.page ?? item.id}`,
        // fal.ai → license=proprietary
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

async function main() {
  gateProd()
  const payload = await getPayload({ config })

  const allItems: { item: BatchItem; stage: string }[] = []
  for (const batchPath of BATCH_PATHS) {
    if (!existsSync(batchPath)) {
      console.warn(`⚠ batch не найден: ${batchPath} — пропускаем`)
      continue
    }
    const raw = readFileSync(batchPath, 'utf-8')
    const batch: Batch = JSON.parse(raw)
    const stage = String(batch._meta?.stage ?? 'stage2')
    for (const item of batch.items) {
      allItems.push({ item, stage })
    }
  }

  console.log(`Stage 2 media seed: ${allItems.length} items в обработке`)

  const started = Date.now()
  const results: SeedResult[] = []
  for (const { item, stage } of allItems) {
    const r = await seedItem(payload, item, stage)
    const icon = r.status === 'created' ? '✓' : r.status === 'skipped' ? '•' : '✗'
    console.log(`${icon} [${r.status.padEnd(8)}] ${item.id.padEnd(50)} ${r.message}`)
    results.push(r)
  }

  const duration = ((Date.now() - started) / 1000).toFixed(1)
  const created = results.filter((r) => r.status === 'created').length
  const skipped = results.filter((r) => r.status === 'skipped').length
  const errors = results.filter((r) => r.status === 'error').length

  console.log('')
  console.log('================ STAGE 2 MEDIA SUMMARY ================')
  console.log(`created ${created} · skipped ${skipped} · errors ${errors} · ${duration}s`)
  console.log('=======================================================')

  if (errors > 0) {
    for (const r of results.filter((rr) => rr.status === 'error')) {
      console.log(`  ✗ ${r.id} → ${r.message}`)
    }
  }

  process.exit(errors === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('seed-stage2-media failed:', err)
  process.exit(1)
})
