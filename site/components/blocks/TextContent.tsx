import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'

import type { TextContentBlock, TocItem } from './types'

/**
 * SEO-длинный текстовый блок.
 *
 * Поддерживает обе схемы (US-0 W3 Track B-3):
 *  - cw-схема: h2, body (markdown string), tocLabel, tocItems[]
 *  - legacy: heading, body (Lexical), columns, eyebrow
 *
 * Renderer-приоритет: h2 → heading; markdown body конвертируется в простой
 * paragraph если строка, иначе передаётся как Lexical в RichTextRenderer.
 */

function pickHeading(block: TextContentBlock): string | null {
  if (block.h2) return block.h2
  if (block.heading) return block.heading
  return null
}

function isMarkdownString(body: unknown): body is string {
  return typeof body === 'string'
}

/**
 * Минимальный markdown → JSX для cw-эталонов:
 *   ## заголовок → <h3>
 *   | таблица |   → <table>
 *   текст       → <p>
 *
 * Для production-корректного markdown — backlog (US-1+).
 * Здесь упрощённый парсер достаточно для cw fixtures.
 */
function renderMarkdown(text: string) {
  const blocks: React.ReactNode[] = []
  const lines = text.split('\n')
  let buf: string[] = []
  let inTable = false
  let tableRows: string[][] = []
  let key = 0

  const flushParagraph = () => {
    if (buf.length === 0) return
    const txt = buf.join(' ').trim()
    if (txt)
      blocks.push(
        <p key={key++} style={{ margin: '0 0 16px' }}>
          {txt}
        </p>,
      )
    buf = []
  }
  const flushTable = () => {
    if (tableRows.length === 0) return
    const [header, ...rows] = tableRows
    blocks.push(
      <table key={key++} style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0' }}>
        <thead>
          <tr>
            {header.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderBottom: '1px solid var(--c-line)',
                  fontWeight: 600,
                }}
              >
                {h.trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td
                  key={j}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid var(--c-line)',
                    verticalAlign: 'top',
                  }}
                >
                  {c.trim()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>,
    )
    tableRows = []
    inTable = false
  }

  for (const lineRaw of lines) {
    const line = lineRaw

    // table detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushParagraph()
      const cells = line.trim().slice(1, -1).split('|')
      // skip separator row | --- | --- |
      if (cells.every((c) => /^\s*-+\s*$/.test(c))) {
        inTable = true
        continue
      }
      tableRows.push(cells)
      inTable = true
      continue
    }
    if (inTable) flushTable()

    if (line.startsWith('## ')) {
      flushParagraph()
      blocks.push(
        <h3 key={key++} style={{ margin: '32px 0 12px', fontSize: '1.25em', fontWeight: 600 }}>
          {line.slice(3).trim()}
        </h3>,
      )
      continue
    }
    if (line.startsWith('- ')) {
      flushParagraph()
      // simple list grouping: collect consecutive lines starting with -
      const items = [line.slice(2).trim()]
      // We'll just inline render single-line each (good enough for cw fixtures)
      blocks.push(
        <ul key={key++} style={{ margin: '0 0 16px 20px', padding: 0 }}>
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>,
      )
      continue
    }
    if (line.trim() === '') {
      flushParagraph()
      continue
    }
    buf.push(line.trim())
  }
  flushParagraph()
  flushTable()

  return <>{blocks}</>
}

export function TextContent(block: TextContentBlock) {
  const isTwoCol = block.columns === '2'
  const heading = pickHeading(block)
  const tocItems: TocItem[] = block.tocItems ?? []
  const tocLabel = block.tocLabel ?? null

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
      <div className="wrap">
        {(block.eyebrow || heading) && (
          <header style={{ maxWidth: 760, marginBottom: 40 }}>
            {block.eyebrow && <span className="eyebrow">{block.eyebrow}</span>}
            {heading && (
              <h2 className="h-l" style={{ marginTop: block.eyebrow ? 12 : 0 }}>
                {heading}
              </h2>
            )}
          </header>
        )}

        {tocItems.length > 0 && (
          <nav
            aria-label={tocLabel ?? 'Содержание'}
            style={{
              maxWidth: 760,
              marginBottom: 32,
              padding: 'clamp(16px, 2vw, 24px)',
              borderLeft: '4px solid var(--c-primary)',
              background: 'var(--c-bg-alt)',
              borderRadius: 'var(--radius)',
            }}
          >
            {tocLabel && (
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--c-ink-soft)',
                  marginBottom: 8,
                }}
              >
                {tocLabel}
              </span>
            )}
            <ol style={{ margin: 0, padding: '0 0 0 20px', fontSize: 14 }}>
              {tocItems.map((it) => (
                <li key={it.id} style={{ marginBottom: 4 }}>
                  <a href={`#${it.id}`} style={{ color: 'var(--c-primary)' }}>
                    {it.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {block.body ? (
          <div
            style={{
              columnCount: isTwoCol ? 2 : 1,
              columnGap: 48,
              maxWidth: isTwoCol ? 1040 : 760,
              fontSize: 17,
              lineHeight: 1.6,
              color: 'var(--c-ink-soft)',
            }}
          >
            {isMarkdownString(block.body) ? (
              renderMarkdown(block.body)
            ) : (
              <RichTextRenderer data={block.body} className="text-ink-soft leading-relaxed" />
            )}
          </div>
        ) : null}
      </div>
    </section>
  )
}
