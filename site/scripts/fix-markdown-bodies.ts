/**
 * Тексты статей и кейсов, импортированные как markdown одним абзацем, → нормальный Lexical
 * (заголовки, абзацы, списки, жирный, ссылки) — чтобы и на сайте, и в админке был размеченный текст.
 *
 *   pnpm fix:markdown-bodies            — показать, сколько документов изменится (ничего не пишет)
 *   pnpm fix:markdown-bodies --apply    — перевести; в stdout — JSON-копия старых значений
 *
 * Таблиц в редакторе нет: строки markdown-таблиц становятся пунктами списка «Колонка: значение · …».
 * Заодно:
 *  - голые пути в тексте («Подробно — на /vyvoz-musora/krupnogabarit/») → ссылка с названием страницы;
 *  - поля, обрезанные импортом по maxLength посреди слова (lead статьи, description кейса), →
 *    до последнего целого предложения;
 *  - точечные правки текста из TEXT_FIXES (заглушки импорта вроде «<TODO operator>»).
 * Повторный запуск безопасен: уже размеченные документы (больше одного блока), ссылки и целые
 * поля не трогаются.
 *
 * ВНИМАНИЕ: Payload `update` берёт за основу последнюю версию документа — если она черновик, его поля
 * (в т. ч. старые блоки) попадут в опубликованную запись. 21.10.2026 на проде так изменились 4 строки
 * старых блоков блога — откатано из дампа. Перед `--apply` на проде — дамп `blog*`, `cases*` и сверка после.
 */
import { getPayload } from 'payload'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'

import config from '../payload.config.js'
import { requestSiteRevalidate } from './_site-revalidate'

const APPLY = process.argv.includes('--apply')
const TARGETS = [
  { collection: 'blog', field: 'body' },
  { collection: 'cases', field: 'description' },
] as const

type Lexical = { root?: { children?: { children?: { text?: string }[] }[] } }
type LexNode = {
  type?: string
  text?: string
  children?: LexNode[]
  root?: LexNode
  [k: string]: unknown
}

/** Обрезанные импортом поля: длина упёрлась в maxLength. */
const CUT_FIELDS = [
  { collection: 'blog', field: 'intro', max: 280 },
  { collection: 'cases', field: 'metaDescription', max: 160 },
] as const

/** Текст, обрезанный посреди слова, → до последнего целого предложения; целый — null. */
function cutToSentence(value: unknown, max: number): string | null {
  if (typeof value !== 'string' || value.length < max - 1) return null
  const text = value.trimEnd()
  if (/[.!?…»)]$/.test(text)) return null
  const end = Math.max(...['. ', '! ', '? ', '… '].map((m) => text.lastIndexOf(m)))
  if (end > 0) return text.slice(0, end + 1)
  // Первое предложение — длинное перечисление: оставляем то, что до двоеточия
  const colon = text.indexOf(': ')
  return colon > 0 ? `${text.slice(0, colon)}.` : null
}

/** Точечные правки текста: заглушки импорта и неподтверждённые документами обещания. */
const TEXT_FIXES: { collection: string; slug: string; from: string; to: string }[] = [
  {
    collection: 'blog',
    slug: 'snos-stareyshego-doma-na-dache',
    from: 'У Обихода действующее СРО-членство, лицензия Росприроднадзора на классы I–V, страховка ГО 10 млн ₽. Конкретный номер СРО — №<TODO operator> (по запросу через cms admin или на странице /o-nas/).',
    to: 'Номер СРО и полис страхования ответственности попросите у подрядчика до подписания договора, а номер проверьте в реестре на nostroy.ru.',
  },
]

/** Замена текста внутри текстовых узлов; возвращает число замен. */
function replaceText(node: LexNode, from: string, to: string): number {
  if (node.type === 'text' && node.text?.includes(from)) {
    node.text = node.text.replace(from, to)
    return 1
  }
  return (node.children ?? []).reduce((n, c) => n + replaceText(c, from, to), 0)
}

const PATH_RE = /(^|[\s(«])(\/[a-z0-9][a-z0-9-]*(?:\/[a-z0-9-]+)*\/)(\?[a-z0-9=&_-]+)?/g
const QUERY_RE = /^\?[a-z0-9=&_-]+/
const shortTitle = (title: string) => title.split(':')[0].trim()
const newId = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('')

/** Голые пути в тексте → ссылки «Название страницы»; неизвестные пути — в missing. */
function linkPaths(node: LexNode, titles: Map<string, string>, missing: Set<string>): number {
  if (!node.children || node.type === 'link') return 0
  let n = 0
  const out: LexNode[] = []
  for (const child of node.children) {
    // «/kalkulyator/foto-smeta/?service=…» из прошлого прогона: хвост остался текстом после ссылки
    const prev = out[out.length - 1] as (LexNode & { fields?: { url?: string } }) | undefined
    const query = child.type === 'text' && child.text?.match(QUERY_RE)?.[0]
    if (query && prev?.type === 'link' && prev.fields?.url && !prev.fields.url.includes('?')) {
      prev.fields.url += query
      child.text = child.text!.slice(query.length)
      n++
      if (!child.text) continue
    }
    if (child.type !== 'text' || !child.text || !child.text.match(PATH_RE)) {
      n += linkPaths(child, titles, missing)
      out.push(child)
      continue
    }
    let last = 0
    for (const m of child.text.matchAll(PATH_RE)) {
      const path = m[2]
      const title = titles.get(path)
      if (!title) {
        missing.add(path)
        continue
      }
      const start = (m.index ?? 0) + m[1].length
      if (start > last) out.push({ ...child, text: child.text.slice(last, start) })
      out.push({
        id: newId(),
        type: 'link',
        fields: { url: path + (m[3] ?? ''), newTab: false, linkType: 'custom' },
        format: '',
        indent: 0,
        version: 3,
        direction: null,
        children: [{ ...child, text: `«${shortTitle(title)}»` }],
      })
      last = start + path.length + (m[3]?.length ?? 0)
      n++
    }
    const rest = child.text.slice(last)
    if (rest) out.push({ ...child, text: rest })
  }
  node.children = out
  return n
}

/** Путь страницы → её название: документы «Страницы», направления, подуслуги, услуга×район, статьи, кейсы. */
type TitleDoc = {
  slug: string
  title: string
  service?: { slug?: string; title?: string } | null
  district?: { slug?: string; namePrepositional?: string } | null
}

async function pageTitles(payload: Awaited<ReturnType<typeof getPayload>>) {
  const titles = new Map<string, string>()
  const all = async (collection: string, depth = 0) =>
    (
      await payload.find({
        collection: collection as 'pages',
        limit: 1000,
        pagination: false,
        depth,
      })
    ).docs as unknown as TitleDoc[]
  for (const d of await all('services')) titles.set(`/${d.slug}/`, d.title)
  for (const d of await all('pages')) titles.set(`/${d.slug}/`, d.title)
  for (const d of await all('sub-services', 1))
    if (d.service?.slug) titles.set(`/${d.service.slug}/${d.slug}/`, d.title)
  for (const d of await all('service-districts', 1))
    if (d.service?.slug && d.district?.slug && d.district.namePrepositional)
      titles.set(
        `/${d.service.slug}/${d.district.slug}/`,
        `${titles.get(`/${d.service.slug}/`) ?? d.service.title} ${d.district.namePrepositional}`,
      )
  for (const d of await all('blog')) titles.set(`/blog/${d.slug}/`, d.title)
  for (const d of await all('cases')) titles.set(`/kejsy/${d.slug}/`, d.title)
  return titles
}

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
  const titles = await pageTitles(payload)
  const missing = new Set<string>()
  let n = 0
  let links = 0
  let cut = 0
  for (const t of TARGETS) {
    const res = await payload.find({
      collection: t.collection,
      limit: 500,
      pagination: false,
      depth: 0,
      // метки оффера ({перезвон}) — как есть, иначе запись затрёт их цифрами
      context: { rawOffer: true },
    })
    for (const doc of res.docs as unknown as Record<string, unknown>[]) {
      const md = markdownBlob(doc[t.field])
      const lexical = md
        ? (convertMarkdownToLexical({ editorConfig, markdown: tablesToLists(md) }) as LexNode)
        : (structuredClone(doc[t.field]) as LexNode | null)
      const fixed = TEXT_FIXES.filter(
        (f) => f.collection === t.collection && f.slug === doc.slug && lexical?.root,
      ).reduce((n, f) => n + replaceText(lexical!.root as LexNode, f.from, f.to), 0)
      const linked = lexical?.root ? linkPaths(lexical.root as LexNode, titles, missing) : 0
      const data: Record<string, unknown> = md || linked || fixed ? { [t.field]: lexical } : {}
      for (const c of CUT_FIELDS.filter((f) => f.collection === t.collection)) {
        const fixed = cutToSentence(doc[c.field], c.max)
        if (fixed) data[c.field] = fixed
      }
      if (!Object.keys(data).length) continue
      backup.push({
        collection: t.collection,
        id: doc.id,
        slug: doc.slug,
        ...Object.fromEntries(Object.keys(data).map((k) => [k, doc[k]])),
      })
      n += md ? 1 : 0
      links += linked
      cut += CUT_FIELDS.filter((c) => c.collection === t.collection && c.field in data).length
      if (!APPLY) continue
      await payload.update({
        collection: t.collection,
        id: doc.id as number,
        data: data as never,
        context: { skipMasterTemplateGate: true },
      })
    }
  }
  if (missing.size)
    console.error(`[fix:markdown-bodies] пути без страницы: ${[...missing].join(' ')}`)
  process.stdout.write(JSON.stringify(backup, null, 2) + '\n')
  console.error(
    `[fix:markdown-bodies] markdown: ${n}, ссылок из путей: ${links}, обрезанных полей: ${cut}` +
      (APPLY ? ' — записано' : ' (для записи — --apply)'),
  )
  if (APPLY) await requestSiteRevalidate('fix:markdown-bodies')
  process.exit(0)
}

main().catch((e) => {
  console.error('[fix:markdown-bodies] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
