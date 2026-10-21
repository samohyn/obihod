/**
 * Снимок всего сайта — проверка «ничего не потерялось» (план 09, этап 4): перенос текста из кода
 * в админку, цифры оффера из «Компании и контактов», удаление старых путей рендера не должны
 * менять то, что видят посетитель и поисковик.
 *
 * Обходит сайт от главной и всех <loc> из /sitemap.xml по внутренним ссылкам и для каждой страницы
 * пишет: статус (и куда редирект), title, description, canonical, robots, og:title, og:description,
 * H1, видимый текст и JSON-LD.
 *
 *   pnpm snapshot:pages <снимок.json> [baseUrl]     (по умолчанию http://localhost:3000)
 *   pnpm snapshot:diff <до.json> <после.json>       — разница; код выхода 1, если она есть
 */
import { readFileSync, writeFileSync } from 'node:fs'

type Snap = {
  status: number
  location?: string
  title?: string
  description?: string
  canonical?: string
  robots?: string
  ogTitle?: string
  ogDescription?: string
  h1?: string
  text?: string
  jsonld?: string[]
}

const SKIP =
  /^\/(api|_next|admin|dev)(\/|$)|\.(png|jpe?g|webp|avif|svg|gif|ico|css|js|pdf|zip|woff2?|mp4|txt|xml)$/i
const CONCURRENCY = 4
const MAX_PAGES = 3000

function decode(s: string): string {
  return s
    .replace(/&nbsp;|&#160;|&#xa0;/gi, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

const squash = (s: string) =>
  decode(s.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()

function meta(html: string, name: string, attr = 'name'): string | undefined {
  const tag = html.match(new RegExp(`<meta[^>]+${attr}="${name}"[^>]*>`, 'i'))?.[0]
  const v = tag?.match(/content="([^"]*)"/i)?.[1]
  return v === undefined ? undefined : decode(v)
}

/** JSON-LD с отсортированными ключами — порядок ключей не считается разницей. */
function stable(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(stable)
  if (v && typeof v === 'object')
    return Object.fromEntries(
      Object.keys(v as object)
        .sort()
        .map((k) => [k, stable((v as Record<string, unknown>)[k])]),
    )
  return v
}

function parse(html: string): Omit<Snap, 'status'> {
  const jsonld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => {
      try {
        return JSON.stringify(stable(JSON.parse(m[1])))
      } catch {
        return m[1].trim()
      }
    })
    .sort()
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html)
    .replace(/<(script|style|noscript|template|svg)\b[\s\S]*?<\/\1>/gi, ' ')
    // <!-- --> — разделитель текстовых узлов React, не пробел
    .replace(/<!--[\s\S]*?-->/g, '')
  return {
    title: squash(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ''),
    description: meta(html, 'description'),
    canonical: html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)?.[1],
    robots: meta(html, 'robots'),
    ogTitle: meta(html, 'og:title', 'property'),
    ogDescription: meta(html, 'og:description', 'property'),
    h1: squash(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? ''),
    text: squash(body),
    jsonld,
  }
}

async function snapshot(out: string, base: string) {
  const norm = (href: string, from: string): string | null => {
    try {
      const u = new URL(decode(href), base + from)
      if (u.origin !== new URL(base).origin || SKIP.test(u.pathname)) return null
      return u.pathname
    } catch {
      return null
    }
  }
  const xml = await (await fetch(`${base}/sitemap.xml`)).text()
  const queue = [
    '/',
    ...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname),
  ]
  const seen = new Set(queue)
  const pages: Record<string, Snap> = {}

  async function worker() {
    while (queue.length && Object.keys(pages).length < MAX_PAGES) {
      const path = queue.shift()!
      const res = await fetch(base + path, { redirect: 'manual' })
      if (res.status >= 300 && res.status < 400) {
        pages[path] = { status: res.status, location: res.headers.get('location') ?? undefined }
        continue
      }
      const html = (res.headers.get('content-type') ?? '').includes('text/html')
        ? await res.text()
        : ''
      pages[path] = { status: res.status, ...(html ? parse(html) : {}) }
      for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"#]+)/gi)) {
        const link = norm(m[1], path)
        if (link && !seen.has(link)) {
          seen.add(link)
          queue.push(link)
        }
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  const sorted = Object.fromEntries(
    Object.keys(pages)
      .sort()
      .map((k) => [k, pages[k]]),
  )
  writeFileSync(out, JSON.stringify(sorted, null, 1))
  console.log(`[snapshot] ${Object.keys(sorted).length} страниц → ${out}`)
}

/** Первое расхождение текста — с контекстом по 8 слов. */
function textDelta(a = '', b = ''): string {
  const wa = a.split(' ')
  const wb = b.split(' ')
  let i = 0
  while (i < wa.length && i < wb.length && wa[i] === wb[i]) i++
  let j = 0
  while (j < wa.length - i && j < wb.length - i && wa[wa.length - 1 - j] === wb[wb.length - 1 - j])
    j++
  const ctx = (w: string[]) => w.slice(Math.max(0, i - 8), w.length - j + 8).join(' ')
  return `\n      было:  …${ctx(wa)}…\n      стало: …${ctx(wb)}…`
}

function diff(aPath: string, bPath: string) {
  const a: Record<string, Snap> = JSON.parse(readFileSync(aPath, 'utf8'))
  const b: Record<string, Snap> = JSON.parse(readFileSync(bPath, 'utf8'))
  const fields = [
    'status',
    'location',
    'title',
    'description',
    'canonical',
    'robots',
    'ogTitle',
    'ogDescription',
    'h1',
  ] as const
  let changes = 0
  for (const p of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()) {
    const x = a[p]
    const y = b[p]
    if (!x || !y) {
      console.log(`${x ? '−' : '+'} ${p} (${(x ?? y).status})`)
      changes++
      continue
    }
    const lines: string[] = []
    // неразрывный пробел вместо обычного — не разница: на экране и для поисковика одно и то же
    const ws = (v: unknown) => (typeof v === 'string' ? v.replace(/\s+/gu, ' ').trim() : v)
    for (const f of fields)
      if (ws(x[f]) !== ws(y[f])) lines.push(`  ${f}: «${x[f] ?? ''}» → «${y[f] ?? ''}»`)
    if (x.text !== y.text) lines.push(`  текст:${textDelta(x.text, y.text)}`)
    if (ws(JSON.stringify(x.jsonld)) !== ws(JSON.stringify(y.jsonld))) {
      const gone = (x.jsonld ?? []).filter((s) => !(y.jsonld ?? []).includes(s))
      const added = (y.jsonld ?? []).filter((s) => !(x.jsonld ?? []).includes(s))
      lines.push(`  JSON-LD:${textDelta(gone.join(' '), added.join(' '))}`)
    }
    if (lines.length) {
      console.log(`~ ${p}\n${lines.join('\n')}`)
      changes++
    }
  }
  console.log(
    `\n[snapshot:diff] страниц: было ${Object.keys(a).length}, стало ${Object.keys(b).length}; с разницей: ${changes}`,
  )
  process.exit(changes ? 1 : 0)
}

const [mode, x, y] = process.argv.slice(2)
if (mode === 'diff' && x && y) diff(x, y)
else if (mode === 'snap' && x) snapshot(x, (y || 'http://localhost:3000').replace(/\/$/, ''))
else {
  console.error(
    'pnpm snapshot:pages <снимок.json> [baseUrl] | pnpm snapshot:diff <до.json> <после.json>',
  )
  process.exit(2)
}
