import type { Block } from 'payload'

/**
 * BreadcrumbsV2 — mono uppercase крошки + chevron CSS pseudo per brand-guide v2.6
 * §breadcrumbs (line 1826+).
 *
 * EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10.
 *
 * Renderer: site/components/blocks/BreadcrumbsV2.tsx.
 */
export const BreadcrumbsV2: Block = {
  slug: 'breadcrumbs-v2',
  labels: { singular: 'Breadcrumbs (v2.6)', plural: 'Breadcrumbs (v2.6)' },
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
      name: 'items',
      type: 'array',
      minRows: 2,
      labels: { singular: 'Уровень', plural: 'Уровни (2-4)' },
      fields: [
        { name: 'label', type: 'text', required: true, maxLength: 80 },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'generateSchema',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Инжектить JSON-LD BreadcrumbList.' },
    },
  ],
}
