/**
 * Проверка title и description по всем страницам из sitemap (план 09, этап 7, пробел 7).
 *
 * Ошибка (код выхода 1): пустой title или description, одинаковый title у разных страниц.
 * Предупреждение: title длиннее 70 или короче 20 знаков, description длиннее 170 или короче 70,
 * одинаковый description. Страницы с noindex не проверяются — они не в поиске.
 *
 * Запуск:  pnpm check:meta [baseUrl]      (по умолчанию http://localhost:3000)
 * Staging — с паролем: SITE_AUTH="логин:пароль" (site-checks.yml).
 */
const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const AUTH: Record<string, string> = process.env.SITE_AUTH
  ? { Authorization: `Basic ${Buffer.from(process.env.SITE_AUTH).toString('base64')}` }
  : {}
const CONCURRENCY = 4

const TITLE = { min: 20, max: 70 }
const DESCRIPTION = { min: 70, max: 170 }

type Meta = { path: string; title: string; description: string }

function decode(s: string): string {
  return s
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim()
}

async function get(path: string): Promise<Response> {
  return fetch(BASE + path, { headers: { 'User-Agent': 'obikhod-meta-check', ...AUTH } })
}

async function sitemapPaths(): Promise<string[]> {
  const xml = await (await get('/sitemap.xml')).text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
}

async function readMeta(path: string): Promise<Meta | null> {
  const res = await get(path)
  if (res.status !== 200) return null
  const html = await res.text()
  const robots = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]*)"/i)?.[1] ?? ''
  if (/noindex/i.test(robots)) return null
  return {
    path,
    title: decode(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? ''),
    description: decode(
      html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1] ?? '',
    ),
  }
}

async function main() {
  const paths = await sitemapPaths()
  const metas: Meta[] = []
  for (let i = 0; i < paths.length; i += CONCURRENCY) {
    const batch = await Promise.all(paths.slice(i, i + CONCURRENCY).map(readMeta))
    for (const m of batch) if (m) metas.push(m)
  }

  const errors: string[] = []
  const warnings: string[] = []
  const len = (s: string) => Array.from(s).length
  for (const m of metas) {
    if (!m.title) errors.push(`${m.path}: нет title`)
    else if (len(m.title) > TITLE.max) warnings.push(`${m.path}: title ${len(m.title)} зн.`)
    else if (len(m.title) < TITLE.min) warnings.push(`${m.path}: title ${len(m.title)} зн.`)
    if (!m.description) errors.push(`${m.path}: нет description`)
    else if (len(m.description) > DESCRIPTION.max)
      warnings.push(`${m.path}: description ${len(m.description)} зн.`)
    else if (len(m.description) < DESCRIPTION.min)
      warnings.push(`${m.path}: description ${len(m.description)} зн.`)
  }
  const dupes = (key: 'title' | 'description') => {
    const by = new Map<string, string[]>()
    for (const m of metas) if (m[key]) by.set(m[key], [...(by.get(m[key]) ?? []), m.path])
    return [...by].filter(([, ps]) => ps.length > 1)
  }
  for (const [t, ps] of dupes('title')) errors.push(`одинаковый title «${t}»: ${ps.join(', ')}`)
  for (const [d, ps] of dupes('description'))
    warnings.push(`одинаковый description «${d.slice(0, 60)}…»: ${ps.join(', ')}`)

  console.log(
    `[check-meta] ${BASE}: страниц в индексе ${metas.length} из ${paths.length} в sitemap`,
  )
  for (const w of warnings) console.log(`  ⚠ ${w}`)
  for (const e of errors) console.log(`  ✗ ${e}`)
  console.log(`[check-meta] ошибок: ${errors.length}, предупреждений: ${warnings.length}`)
  if (errors.length) process.exit(1)
}

main().catch((err) => {
  console.error('[check-meta]', err)
  process.exit(1)
})
