import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'

import type { TextContentBlock } from './types'

/**
 * SEO-длинный текстовый блок. Рендерит Lexical richText через RichTextRenderer.
 * columns === '2' — двухколоночная верстка на desktop.
 */
export function TextContent(block: TextContentBlock) {
  const isTwoCol = block.columns === '2'

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
      <div className="wrap">
        {(block.eyebrow || block.heading) && (
          <header style={{ maxWidth: 760, marginBottom: 40 }}>
            {block.eyebrow && <span className="eyebrow">{block.eyebrow}</span>}
            {block.heading && (
              <h2 className="h-l" style={{ marginTop: block.eyebrow ? 12 : 0 }}>
                {block.heading}
              </h2>
            )}
          </header>
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
            <RichTextRenderer data={block.body} className="text-ink-soft leading-relaxed" />
          </div>
        ) : null}
      </div>
    </section>
  )
}
