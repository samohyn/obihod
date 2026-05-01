import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'

import type { TldrBlock } from './types'

/**
 * Tldr — короткий «нейро-формат» блок.
 *
 * Поддерживает обе схемы (US-0 W3 Track B-3):
 *  - cw-схема: body — plain-string («Если коротко: ...»)
 *  - legacy:    text — plain-string (приоритет), body — Lexical fallback
 *
 * Renderer-приоритет: text → body.string → body.Lexical.
 *
 * Server component. mark-up <aside aria-label="Краткий ответ"> для
 * нейро-цитируемости.
 */
function isPlainString(v: unknown): v is string {
  return typeof v === 'string'
}

export function Tldr(block: TldrBlock) {
  const eyebrow = block.eyebrow ?? 'Если коротко'
  const text = block.text ?? null
  const body = block.body
  const hasText = isPlainString(text) && text.trim().length > 0
  const bodyAsString = isPlainString(body) ? body : null
  const hasBodyString = bodyAsString !== null && bodyAsString.trim().length > 0
  const hasBodyLexical = body != null && !isPlainString(body)

  if (!hasText && !hasBodyString && !hasBodyLexical) return null

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(24px, 4vw, 40px) 0' }}>
      <div className="wrap">
        <aside
          aria-label="Краткий ответ"
          style={{
            background: 'var(--c-bg-alt)',
            borderLeft: '4px solid var(--c-accent)',
            borderRadius: 'var(--radius)',
            padding: 'clamp(20px, 3vw, 28px) clamp(20px, 3vw, 32px)',
            maxWidth: 760,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--c-accent-ink)',
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            {eyebrow}
          </span>

          {hasText ? (
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(16px, 1.6vw, 18px)',
                lineHeight: 1.55,
                color: 'var(--c-ink)',
                fontWeight: 500,
              }}
            >
              {text}
            </p>
          ) : hasBodyString ? (
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(16px, 1.6vw, 18px)',
                lineHeight: 1.55,
                color: 'var(--c-ink)',
                fontWeight: 500,
              }}
            >
              {bodyAsString}
            </p>
          ) : (
            <div
              style={{
                fontSize: 'clamp(16px, 1.6vw, 18px)',
                lineHeight: 1.55,
                color: 'var(--c-ink)',
                fontWeight: 500,
              }}
            >
              <RichTextRenderer data={body} />
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
