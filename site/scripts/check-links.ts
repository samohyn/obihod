/**
 * Краулер внутренних ссылок сайта (план 09: быстрые SEO-фиксы + будущая CI-проверка ссылок).
 *
 * Обходит сайт от главной и всех <loc> из /sitemap.xml, редиректы не проходит, и печатает:
 *   1. битые внутренние ссылки (4xx/5xx) — со страницами, где они стоят;
 *   2. внутренние ссылки на редиректы (лишний хоп, ссылку надо исправить на конечный URL);
 *   3. живые индексируемые страницы (200, без noindex в <meta robots>) вне sitemap;
 *   4. URL из sitemap, которые не 200 или закрыты noindex.
 *
 * Запуск:  pnpm check:links [baseUrl]      (по умолчанию http://localhost:3000)
 * Код выхода 1, если есть битые ссылки.
 */

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
// Basic auth для staging: SITE_AUTH="логин:пароль" (site-checks.yml).
const AUTH: Record<string, string> = process.env.SITE_AUTH
  ? { Authorization: `Basic ${Buffer.from(process.env.SITE_AUTH).toString('base64')}` }
  : {}
const CONCURRENCY = 4
const MAX_PAGES = 3000
const SKIP =
  /^\/(api|_next|admin)(\/|$)|\.(png|jpe?g|webp|avif|svg|gif|ico|css|js|pdf|zip|woff2?|mp4|txt|xml)$/i

type Page = { status: number; location?: string; noindex: boolean; links: string[] }

const pages = new Map<string, Page>()
const sources = new Map<string, Set<string>>()

function normalize(href: string, from: string): string | null {
  let url: URL
  try {
    url = new URL(href, BASE + from)
  } catch {
    return null
  }
  if (url.origin !== new URL(BASE).origin) return null
  if (SKIP.test(url.pathname)) return null
  return url.pathname
}

async function fetchPage(path: string): Promise<Page> {
  const res = await fetch(BASE + path, {
    redirect: 'manual',
    headers: { 'User-Agent': 'obikhod-link-check', ...AUTH },
  })
  const page: Page = { status: res.status, noindex: false, links: [] }
  if (res.status >= 300 && res.status < 400) {
    page.location = res.headers.get('location') ?? undefined
    return page
  }
  if (!(res.headers.get('content-type') ?? '').includes('text/html')) return page
  const html = await res.text()
  const robots = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]*)"/i)?.[1] ?? ''
  page.noindex = /noindex/i.test(robots)
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"#]+)/gi)) {
    const target = normalize(m[1].replace(/&amp;/g, '&'), path)
    if (target) page.links.push(target)
  }
  return page
}

async function sitemapPaths(): Promise<string[]> {
  const res = await fetch(`${BASE}/sitemap.xml`, { headers: AUTH })
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
}

async function main() {
  const inSitemap = new Set(await sitemapPaths())
  const queue = ['/', ...inSitemap]
  const seen = new Set(queue)

  async function worker() {
    while (queue.length && pages.size < MAX_PAGES) {
      const path = queue.shift()!
      let page: Page
      try {
        page = await fetchPage(path)
      } catch (e) {
        page = { status: 0, noindex: false, links: [] }
        console.error(`fetch failed ${path}:`, e instanceof Error ? e.message : e)
      }
      pages.set(path, page)
      for (const link of page.links) {
        if (!sources.has(link)) sources.set(link, new Set())
        sources.get(link)!.add(path)
        if (!seen.has(link)) {
          seen.add(link)
          queue.push(link)
        }
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  const from = (p: string) => [...(sources.get(p) ?? [])].sort()
  const broken = [...pages].filter(
    ([p, pg]) => (pg.status >= 400 || pg.status === 0) && sources.has(p),
  )
  const redirects = [...pages].filter(
    ([p, pg]) => pg.status >= 300 && pg.status < 400 && sources.has(p),
  )
  const outside = [...pages].filter(
    ([p, pg]) => pg.status === 200 && !pg.noindex && !inSitemap.has(p),
  )
  const badSitemap = [...inSitemap].filter((p) => {
    const pg = pages.get(p)
    return !pg || pg.status !== 200 || pg.noindex
  })

  console.log(`Обойдено страниц: ${pages.size} · в sitemap: ${inSitemap.size}\n`)
  console.log(`== Битые внутренние ссылки: ${broken.length}`)
  for (const [p, pg] of broken)
    console.log(
      `  ${pg.status} ${p}  ← ${from(p).slice(0, 5).join(', ')}${from(p).length > 5 ? ` (+${from(p).length - 5})` : ''}`,
    )
  console.log(`\n== Ссылки на редиректы: ${redirects.length}`)
  for (const [p, pg] of redirects)
    console.log(
      `  ${pg.status} ${p} → ${pg.location}  ← ${from(p).slice(0, 3).join(', ')}${from(p).length > 3 ? ` (+${from(p).length - 3})` : ''}`,
    )
  console.log(`\n== Живые индексируемые страницы вне sitemap: ${outside.length}`)
  for (const [p] of outside.sort()) console.log(`  ${p}`)
  console.log(`\n== URL из sitemap не 200 или noindex: ${badSitemap.length}`)
  for (const p of badSitemap)
    console.log(`  ${pages.get(p)?.status ?? '—'}${pages.get(p)?.noindex ? ' noindex' : ''} ${p}`)

  process.exit(broken.length ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
