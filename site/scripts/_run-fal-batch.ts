/**
 * Shared fal.ai batch runner — DRY-ядро для всех `generate-stage1-*.ts` Run 3+.
 *
 * Контракт идентичен Run 1+2 (см. generate-stage1-w5-heroes.ts):
 *   - читает prompts-batch JSON (схема: { _meta, items: BatchItem[] })
 *   - идемпотентно прогоняет каждый item через generateByUseCase
 *   - auto-detect MIME через magic bytes (flux/schnell отдаёт JPEG даже если
 *     запрошено .png — мы переименовываем под факт)
 *   - --force / --only= флаги
 *
 * Зачем shared: Run 3 — 3 batch'а (SD, authors, static), копировать ~150 строк
 * в каждый раннер — нарушение CLAUDE.md «Простота прежде всего» / «не плодить
 * абстракции». Один общий ядро + 3 тонких runner'а.
 */
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import { generateByUseCase, type UseCase } from '../lib/fal/generators'

export type BatchItem = {
  id: string
  page: string
  fixture: string
  useCase: UseCase
  params: Record<string, unknown>
  outFile: string
  publicPath: string
  alt: string
}

export type Batch = {
  _meta: Record<string, unknown>
  items: BatchItem[]
}

const REPO_ROOT = resolve(__dirname, '..', '..')

function parseFlags(argv: string[]): { force: boolean; only: string | null } {
  const force = argv.includes('--force')
  const onlyArg = argv.find((a) => a.startsWith('--only='))
  const only = onlyArg ? onlyArg.slice('--only='.length) : null
  return { force, only }
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

// flux/schnell часто возвращает JPEG-байты по `.png` extension. Подменяем
// расширение на основе magic bytes — файл на диске должен быть truthful
// относительно MIME (важно для Payload Media: mimeTypes white-list).
function detectExt(buf: Buffer): 'jpg' | 'png' | 'webp' | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg'
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return 'png'
  }
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return 'webp'
  }
  return null
}

function withExt(file: string, ext: string): string {
  return file.replace(/\.(png|jpg|jpeg|webp)$/i, `.${ext}`)
}

async function downloadImage(
  url: string,
  outFile: string,
): Promise<{ bytes: number; finalPath: string }> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Download failed for ${url}: HTTP ${res.status} ${res.statusText}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  const realExt = detectExt(buf)
  const finalPath = realExt ? withExt(outFile, realExt) : outFile
  await mkdir(dirname(finalPath), { recursive: true })
  await writeFile(finalPath, buf)
  return { bytes: buf.byteLength, finalPath }
}

async function processItem(item: BatchItem, force: boolean): Promise<void> {
  const outAbs = resolve(REPO_ROOT, item.outFile)
  const candidates = ['png', 'jpg', 'jpeg', 'webp'].map((ext) => withExt(outAbs, ext))
  const existing = (await Promise.all(candidates.map(fileExists))).some(Boolean)
  if (!force && existing) {
    console.log(`  ⏭  skip (exists): ${item.outFile}`)
    return
  }
  console.log(`→ ${item.id} · ${item.useCase}`)
  const t0 = Date.now()
  const result = await generateByUseCase(item.useCase, item.params)
  const ms = Date.now() - t0
  const img = result.images?.[0]
  if (!img?.url) {
    throw new Error(`No image in response for ${item.id}`)
  }
  const { bytes, finalPath } = await downloadImage(img.url, outAbs)
  const rel = finalPath.replace(`${REPO_ROOT}/`, '')
  console.log(`  ✓ ${item.id} · ${ms}ms · ${(bytes / 1024).toFixed(1)} KB → ${rel}`)
}

export async function runBatch(opts: { batchPath: string; label: string }): Promise<void> {
  const { force, only } = parseFlags(process.argv.slice(2))

  if (!process.env.FAL_KEY) {
    console.error('✗ FAL_KEY is not set. Add to site/.env.local.')
    process.exit(1)
  }

  const batchAbs = resolve(REPO_ROOT, opts.batchPath)
  const raw = await readFile(batchAbs, 'utf-8')
  const batch = JSON.parse(raw) as Batch
  const items = only ? batch.items.filter((i) => i.id === only) : batch.items
  if (items.length === 0) {
    console.error(only ? `✗ No item with id="${only}"` : '✗ No items in batch')
    process.exit(1)
  }
  console.log(`${opts.label}: ${items.length} item(s), force=${force}`)

  const errors: { id: string; error: string }[] = []
  for (const item of items) {
    try {
      await processItem(item, force)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error(`  ✗ ${item.id}: ${msg}`)
      errors.push({ id: item.id, error: msg })
    }
  }

  console.log('')
  if (errors.length === 0) {
    console.log(`✓ Done · ${items.length}/${items.length} OK`)
    return
  }
  console.error(`✗ Done with errors · ${items.length - errors.length}/${items.length} OK`)
  for (const e of errors) console.error(`  - ${e.id}: ${e.error}`)
  process.exit(1)
}
