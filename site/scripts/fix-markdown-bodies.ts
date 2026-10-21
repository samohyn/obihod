/**
 * Тексты статей и кейсов, импортированные как markdown одним абзацем, → нормальный Lexical
 * (заголовки, абзацы, списки, жирный, ссылки) — чтобы и на сайте, и в админке был размеченный текст.
 *
 *   pnpm fix:markdown-bodies            — показать, сколько документов изменится (ничего не пишет)
 *   pnpm fix:markdown-bodies --apply    — перевести; в stdout — JSON-копия старых значений
 *
 * Таблиц в редакторе нет: строки markdown-таблиц становятся пунктами списка «Колонка: значение · …».
 * Повторный запуск безопасен: уже размеченные документы (больше одного блока) не трогаются.
 */
import { getPayload } from 'payload'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'

import config from '../payload.config.js'

const APPLY = process.argv.includes('--apply')
const TARGETS = [
  { collection: 'blog', field: 'body' },
  { collection: 'cases', field: 'description' },
] as const

type Lexical = { root?: { children?: { children?: { text?: string }[] }[] } }

/** Один абзац с markdown внутри — признак импорта «как есть». */
function markdownBlob(value: unknown): string | null {
  const children = (value as Lexical)?.root?.children
  if (!children || children.length !== 1) return null
  const text = (children[0].children ?? []).map((c) => c.text ?? '').join('')
  return /(^|\n)(#{2,3} |- |\d+\. |\|)|\*\*/.test(text) && text.includes('\n') ? text : null
}

/** Markdown-таблица → список: «Заголовок1: значение · Заголовок2: значение». */
function tablesToLists(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const row = lines[i].trim()
    const next = (lines[i + 1] ?? '').trim()
    if (row.startsWith('|') && /^\|[\s:|-]+\|$/.test(next)) {
      const head = row
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim())
      i += 2
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i]
          .trim()
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim())
        const [first, ...rest] = cells
        const tail = rest.map((c, k) => (head[k + 1] ? `${head[k + 1]}: ${c}` : c)).join(' · ')
        out.push(`- **${first}**${tail ? ` — ${tail}` : ''}`)
        i++
      }
      i--
      out.push('')
      continue
    }
    out.push(lines[i])
  }
  return out.join('\n')
}

async function main() {
  const payload = await getPayload({ config })
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const backup: unknown[] = []
  let n = 0
  for (const t of TARGETS) {
    const res = await payload.find({
      collection: t.collection,
      limit: 500,
      pagination: false,
      depth: 0,
    })
    for (const doc of res.docs as unknown as Record<string, unknown>[]) {
      const md = markdownBlob(doc[t.field])
      if (!md) continue
      backup.push({ collection: t.collection, id: doc.id, slug: doc.slug, [t.field]: doc[t.field] })
      n++
      if (!APPLY) continue
      const lexical = convertMarkdownToLexical({ editorConfig, markdown: tablesToLists(md) })
      await payload.update({
        collection: t.collection,
        id: doc.id as number,
        data: { [t.field]: lexical } as never,
        context: { skipMasterTemplateGate: true },
      })
    }
  }
  process.stdout.write(JSON.stringify(backup, null, 2) + '\n')
  console.error(
    `[fix:markdown-bodies] документов: ${n}${APPLY ? ', переведено' : ' (для записи — --apply)'}`,
  )
  process.exit(0)
}

main().catch((e) => {
  console.error('[fix:markdown-bodies] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
