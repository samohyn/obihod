// brand-guide v2.6 §faq-accordion (line 1695+)
// EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10 · fe role
//
// Native <details>/<summary> — 0 JS для interactivity, only CSS rotation.
// 5-10 Q. JSON-LD FAQPage инжектится опционально.
// Server component (native HTML elements). Keyboard: Enter/Space toggle, Esc close.

import type { FaqAccordionBlock } from './types'

export function FaqAccordion(block: FaqAccordionBlock) {
  const items = (block.items ?? []).filter((i) => i?.question && i?.answer)
  if (items.length === 0) return null

  const heading = block.h2 ?? null

  const schema =
    block.generateFaqPageSchema && items.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((it) => ({
            '@type': 'Question',
            name: it.question,
            acceptedAnswer: { '@type': 'Answer', text: it.answer },
          })),
        }
      : null

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
      <div className="wrap">
        {heading && (
          <h2 className="h-l" style={{ marginBottom: 32, maxWidth: 760 }}>
            {heading}
          </h2>
        )}
        <div className="sp-faq-accordion">
          {items.map((it, i) => (
            <details key={`q-${i}`} className="sp-faq-item">
              <summary>
                <span className="sp-faq-q-num">№ {String(i + 1).padStart(2, '0')}</span>
                <span>{it.question}</span>
              </summary>
              <div className="sp-faq-answer">
                <p>{it.answer}</p>
              </div>
            </details>
          ))}
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
