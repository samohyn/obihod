import type { Block } from 'payload'

/**
 * DistrictChips — 30 city links pills grid per brand-guide v2.6 §district-chips (line 1964+).
 *
 * EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10.
 *
 * Renderer: site/components/blocks/DistrictChips.tsx.
 */
export const DistrictChips: Block = {
  slug: 'district-chips',
  labels: { singular: 'District chips', plural: 'District chips блоки' },
  admin: { group: 'Структура страницы' },
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
      name: 'title',
      type: 'text',
      maxLength: 160,
      defaultValue: 'Работаем по районам Москвы и МО',
    },
    {
      name: 'meta',
      type: 'text',
      maxLength: 60,
      admin: { description: 'Описание-тег (например «30 районов»).' },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 60,
      labels: { singular: 'Район', plural: 'Районы (до 60)' },
      fields: [
        { name: 'label', type: 'text', required: true, maxLength: 60 },
        { name: 'href', type: 'text', required: true },
        { name: 'priority', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
