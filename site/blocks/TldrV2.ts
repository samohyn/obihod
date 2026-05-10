import type { Block } from 'payload'

/**
 * TldrV2 — 3-5 bullets card + badge per brand-guide v2.6 §tldr-block (line 1889+).
 *
 * EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10.
 *
 * Renderer: site/components/blocks/TldrV2.tsx.
 */
export const TldrV2: Block = {
  slug: 'tldr-v2',
  labels: { singular: 'TL;DR (v2.6)', plural: 'TL;DR блоки (v2.6)' },
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
      name: 'badge',
      type: 'text',
      defaultValue: 'Кратко',
      maxLength: 24,
    },
    {
      name: 'title',
      type: 'text',
      maxLength: 240,
      admin: { description: 'Title рядом с badge (опционально).' },
    },
    {
      name: 'bullets',
      type: 'array',
      minRows: 3,
      maxRows: 5,
      labels: { singular: 'Пункт', plural: 'Пункты (3-5)' },
      fields: [{ name: 'value', type: 'textarea', required: true, maxLength: 320 }],
    },
  ],
}
