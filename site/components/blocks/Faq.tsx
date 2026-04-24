'use client'

import { useState } from 'react'

import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'

import type { FaqBlock } from './types'

/**
 * FAQ-аккордеон с schema.org FAQPage разметкой (если generateFaqPageSchema=true).
 *
 * Извлечение текста ответа для JSON-LD — плоская свёртка Lexical-дерева
 * (достаточно для большинства ответов; be4 может подвезти формальный
 * сериалайзер позже).
 */
function extractText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join(' ')
  if (typeof node === 'object') {
    const n = node as Record<string, unknown>
    if (typeof n.text === 'string') return n.text
    if (n.children) return extractText(n.children)
    if (n.root) return extractText(n.root)
  }
  return ''
}

export function Faq(block: FaqBlock) {
  const items = (block.items ?? []).filter((i) => i?.question)
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const schema =
    block.generateFaqPageSchema && items.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((it) => ({
            '@type': 'Question',
            name: it.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: extractText(it.answer),
            },
          })),
        }
      : null

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
      <div className="wrap">
        {block.heading && (
          <h2 className="h-l" style={{ marginBottom: 32, maxWidth: 760 }}>
            {block.heading}
          </h2>
        )}

        <div className="faq-list">
          {items.map((it, i) => {
            const isOpen = openIdx === i
            return (
              <div key={i} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                >
                  <span>{it.question}</span>
                  <span className="ic" aria-hidden>
                    +
                  </span>
                </button>
                <div className="faq-a" role="region">
                  {it.answer ? <RichTextRenderer data={it.answer} /> : null}
                </div>
              </div>
            )
          })}
        </div>

        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )}
      </div>
    </section>
  )
}
