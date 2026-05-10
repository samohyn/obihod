import type { Block } from 'payload'

/**
 * PricingTable — 3 variants (tiers / list / per-district) per brand-guide v2.6
 * §pricing-table (line 1236+).
 *
 * EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10.
 *
 * Renderer: site/components/blocks/PricingTable.tsx.
 */
export const PricingTable: Block = {
  slug: 'pricing-table',
  labels: { singular: 'Pricing table', plural: 'Pricing tables' },
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
      defaultValue: 'pricing',
      admin: { description: 'Якорь для скролла. Без #.' },
    },
    {
      name: 'h2',
      type: 'text',
      maxLength: 160,
    },
    {
      name: 'helper',
      type: 'textarea',
      maxLength: 320,
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'tiers',
      options: [
        { label: '3-tier (Базовый / Стандарт / Под ключ)', value: 'tiers' },
        { label: 'Single-list (одна колонка)', value: 'list' },
        { label: 'Per-district adjustment', value: 'per-district' },
      ],
    },
    {
      name: 'tiers',
      type: 'array',
      labels: { singular: 'Тариф', plural: 'Тарифы' },
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'name', type: 'text', required: true, maxLength: 40 },
        {
          name: 'price',
          type: 'text',
          required: true,
          maxLength: 24,
          admin: { description: 'Цена «от» — например «3 500».' },
        },
        {
          name: 'unit',
          type: 'text',
          maxLength: 24,
          admin: { description: 'Единица измерения. Например «м³» или «час».' },
        },
        { name: 'tagline', type: 'text', maxLength: 160 },
        {
          name: 'features',
          type: 'array',
          labels: { singular: 'Фича', plural: 'Фичи' },
          fields: [{ name: 'value', type: 'text', required: true, maxLength: 120 }],
        },
        { name: 'highlighted', type: 'checkbox', defaultValue: false },
        {
          name: 'badge',
          type: 'text',
          maxLength: 24,
          defaultValue: 'Рекомендуем',
          admin: { description: 'Бейдж над highlighted-tier.' },
        },
        { name: 'ctaLabel', type: 'text', maxLength: 40, defaultValue: 'Выбрать тариф' },
        { name: 'ctaHref', type: 'text', defaultValue: '#calculator' },
      ],
    },
  ],
}
