import type { Block } from 'payload'

/**
 * TrustBlock — 3 variants (bar / cards-4 / cards-6) per brand-guide v2.6
 * §trust-block (line 1445+).
 *
 * EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10.
 *
 * Renderer: site/components/blocks/TrustBlock.tsx.
 */
export const TrustBlock: Block = {
  slug: 'trust-block',
  labels: { singular: 'Trust-блок', plural: 'Trust-блоки' },
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
      admin: { description: 'Якорь. Без #.' },
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'cards-4',
      options: [
        { label: 'Bar (4 pill горизонтально, hero-adjacent)', value: 'bar' },
        { label: 'Cards × 4 (pricing-adjacent)', value: 'cards-4' },
        { label: 'Cards × 6 (pre-footer)', value: 'cards-6' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      maxLength: 80,
      admin: { description: 'Подзаголовок (mono uppercase). Например «Лицензии и страховка».' },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 4,
      maxRows: 6,
      labels: { singular: 'Trust-item', plural: 'Trust-items' },
      fields: [
        {
          name: 'icon',
          type: 'text',
          maxLength: 40,
          admin: { description: 'Иконка-ID (sustained brand-guide §icons). Опционально.' },
        },
        { name: 'label', type: 'text', required: true, maxLength: 80 },
        { name: 'sub', type: 'text', maxLength: 80 },
        { name: 'href', type: 'text', admin: { description: 'Ссылка на документ (опционально).' } },
      ],
    },
  ],
}
