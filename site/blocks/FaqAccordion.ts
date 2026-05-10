import type { Block } from 'payload'

/**
 * FaqAccordion — native <details>/<summary> per brand-guide v2.6 §faq-accordion (line 1695+).
 *
 * EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10.
 *
 * Renderer: site/components/blocks/FaqAccordion.tsx (server, no JS).
 */
export const FaqAccordion: Block = {
  slug: 'faq-accordion',
  labels: { singular: 'FAQ accordion (v2.6)', plural: 'FAQ accordions (v2.6)' },
  admin: { group: 'Контент' },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Выключите, чтобы скрыть блок без удаления.' },
    },
    {
      name: 'anchor',
      type: 'text',
      defaultValue: 'faq',
      admin: { description: 'Якорь. Без #.' },
    },
    {
      name: 'h2',
      type: 'text',
      maxLength: 160,
      defaultValue: 'Частые вопросы',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 5,
      maxRows: 10,
      labels: { singular: 'Q & A', plural: 'Q & A (5-10)' },
      fields: [
        { name: 'question', type: 'text', required: true, maxLength: 240 },
        { name: 'answer', type: 'textarea', required: true, maxLength: 2000 },
      ],
    },
    {
      name: 'generateFaqPageSchema',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Инжектить JSON-LD FAQPage (schema.org).' },
    },
  ],
}
