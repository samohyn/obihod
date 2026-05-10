import type { Block } from 'payload'

/**
 * MiniCaseV2 — 1 кейс с photo 16:11 + KPI + thumbs + CTA per brand-guide v2.6
 * §mini-case (line 1554+).
 *
 * EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10.
 *
 * Renderer: site/components/blocks/MiniCaseV2.tsx.
 */
export const MiniCaseV2: Block = {
  slug: 'mini-case-v2',
  labels: { singular: 'Mini-case (v2.6)', plural: 'Mini-cases (v2.6)' },
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
      defaultValue: 'Кейс',
      maxLength: 24,
    },
    {
      name: 'meta',
      type: 'array',
      labels: { singular: 'Meta', plural: 'Meta строки' },
      maxRows: 4,
      fields: [{ name: 'value', type: 'text', required: true, maxLength: 60 }],
      admin: { description: 'Мини-метки сверху карточки (например «Раменское · 12 м³ · 2 часа»).' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 160,
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: { description: 'URL фото 16:11 aspect. Опционально (fallback — gradient).' },
    },
    {
      name: 'imageAlt',
      type: 'text',
      maxLength: 160,
    },
    {
      name: 'photoLabel',
      type: 'text',
      maxLength: 80,
      admin: { description: 'Подпись на фото (например «До / После»).' },
    },
    {
      name: 'kpis',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'KPI', plural: 'KPI bullets' },
      fields: [
        { name: 'k', type: 'text', required: true, maxLength: 40 },
        { name: 'v', type: 'text', required: true, maxLength: 40 },
      ],
    },
    {
      name: 'thumbs',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Thumbnail', plural: 'Thumbnails (4 max)' },
      fields: [{ name: 'url', type: 'text', required: true }],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Полный кейс',
      maxLength: 40,
    },
    {
      name: 'ctaHref',
      type: 'text',
      admin: { description: 'Ссылка на /kejsy/<slug>/.' },
    },
  ],
}
