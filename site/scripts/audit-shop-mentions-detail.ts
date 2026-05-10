/**
 * Детальный read-only аудит — для каждого hit-doc показать конкретное поле +
 * snippet текста с матчем (±60 символов контекста).
 *
 * EPIC-SHOP-REMOVAL W5 — runs after audit-shop-mentions.ts findings, чтобы
 * cw мог решить per-doc: cleanup or keep.
 *
 * Запуск:
 *   PAYLOAD_DISABLE_PUSH=1 pnpm tsx --require=./scripts/_payload-cjs-shim.cjs --env-file=.env.local scripts/audit-shop-mentions-detail.ts
 */
import { getPayload } from 'payload'
import config from '../payload.config.js'

const SHOP_REGEX = /(\/shop(?:[/"'\s]|$)|магазин|саженц|питомник)/i

interface Target {
  collection: string
  ids: number[]
}

const TARGETS: Target[] = [
  { collection: 'services', ids: [5, 3] },
  { collection: 'blog', ids: [26, 23, 15] },
  { collection: 'service-districts', ids: [14, 10, 9, 8] },
]

function findMatchesInText(text: string, fieldPath: string): string[] {
  const out: string[] = []
  const re = new RegExp(SHOP_REGEX.source, 'gi')
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const start = Math.max(0, m.index - 60)
    const end = Math.min(text.length, m.index + m[0].length + 60)
    const snippet = text.slice(start, end).replace(/\s+/g, ' ').trim()
    out.push(`[${fieldPath}] …${snippet}…`)
  }
  return out
}

function walk(value: unknown, path: string, hits: string[]): void {
  if (value == null) return
  if (typeof value === 'string') {
    if (SHOP_REGEX.test(value)) {
      hits.push(...findMatchesInText(value, path))
    }
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`, hits))
    return
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      walk(v, path ? `${path}.${k}` : k, hits)
    }
  }
}

async function main(): Promise<void> {
  console.log('[audit-detail] Подключение к Payload Local API…')
  const payload = await getPayload({ config })
  console.log('[audit-detail] OK\n')

  for (const target of TARGETS) {
    for (const id of target.ids) {
      try {
        const doc = (await payload.findByID({
          collection: target.collection,
          id,
          depth: 0,
          draft: true,
        })) as Record<string, unknown>

        console.log(`\n=== [${target.collection}] id=${id} slug=${(doc.slug as string) ?? '—'} ===`)
        console.log(`title: ${(doc.title as string) ?? '—'}`)

        const hits: string[] = []
        walk(doc, '', hits)

        if (hits.length === 0) {
          console.log('  (no hits — possibly already cleaned)')
          continue
        }
        for (const h of hits) {
          console.log(`  ${h}`)
        }
      } catch (err) {
        console.error(`[${target.collection}/${id}] FAIL: ${(err as Error).message}`)
      }
    }
  }

  console.log('\n[audit-detail] DONE')
  process.exit(0)
}

main().catch((err) => {
  console.error('[audit-detail] FATAL:', err)
  process.exit(2)
})
