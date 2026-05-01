import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'

import type { TldrBlock } from './types'

/**
 * Tldr — короткий «нейро-формат» блок для цитируемости (Perplexity / Алиса /
 * AI Overviews). 2-3 предложения с акцентом.
 *
 * Контракт: US-0 sa-seo AC-2.5 «нейро-формат: 2-3 предложения с акцентом,
 * eyebrow «Если коротко» / «TL;DR»; mark-up <aside aria-label="Краткий ответ">
 * для нейро-цитируемости».
 *
 * Стиль: акцент-рамка слева через --c-accent, светлый фон --c-bg-soft
 * (fallback на --c-bg-alt — токен `--c-bg-soft` пока не объявлен в globals.css,
 * fallback на родственный токен корректен).
 *
 * Server component. Принимает `text: string` (приоритетнее) или `body: Lexical`.
 */
export function Tldr(block: TldrBlock) {
  const eyebrow = block.eyebrow ?? 'Если коротко'
  const hasText = typeof block.text === 'string' && block.text.trim().length > 0
  const hasBody = block.body != null

  if (!hasText && !hasBody) return null

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
              {block.text}
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
              <RichTextRenderer data={block.body} />
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
