import type { Block } from 'payload'

/**
 * ServiceHero — T2/T3/T4 service-page hero per brand-guide v2.6 §service-hero (line 858+).
 *
 * EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10.
 *
 * H1 + USP × 3 + dual-CTA + 4 trust-pills + photo BG (T2 only).
 *
 * Renderer: site/components/blocks/ServiceHero.tsx.
 */
export const ServiceHero: Block = {
  slug: 'service-hero',
  labels: { singular: 'Service Hero (v2.6)', plural: 'Service Hero блоки (v2.6)' },
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
      admin: { description: 'Якорь для ссылки. Без символа #.' },
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'T2_PILLAR',
      options: [
        { label: 'T2 Pillar (с фото справа, USP × 3)', value: 'T2_PILLAR' },
        { label: 'T3 Sub (без фото, единый column)', value: 'T3_SUB' },
        { label: 'T4 SD (district-specific, компактный)', value: 'T4_SD' },
      ],
      admin: { description: 'Layer-вариант: T2 pillar / T3 sub / T4 service × district.' },
    },
    {
      name: 'eyebrow',
      type: 'text',
      maxLength: 80,
      admin: { description: 'Мини-подпись над H1 (например, «Услуга в Москве и МО»).' },
    },
    {
      name: 'h1',
      type: 'text',
      required: true,
      maxLength: 160,
      admin: { description: 'Главный заголовок страницы. До 160 символов.' },
    },
    {
      name: 'strapline',
      type: 'textarea',
      maxLength: 320,
      admin: { description: 'Lead-параграф 2-3 строки под H1.' },
    },
    {
      name: 'usps',
      type: 'array',
      maxRows: 3,
      labels: { singular: 'USP', plural: 'USP × 3' },
      fields: [
        { name: 'num', type: 'text', maxLength: 4, admin: { description: 'Номер (01, 02, 03).' } },
        { name: 'text', type: 'text', required: true, maxLength: 120 },
      ],
    },
    {
      name: 'ctaPrimary',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          maxLength: 60,
          defaultValue: 'Загрузить фото — получить смету',
        },
        { name: 'href', type: 'text', defaultValue: '#calculator' },
      ],
    },
    {
      name: 'ctaSecondary',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', maxLength: 40 },
        { name: 'href', type: 'text', admin: { description: 'tel:+7... для мобильного диалера.' } },
      ],
    },
    {
      name: 'trust',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Trust pill', plural: 'Trust pills × 4' },
      fields: [{ name: 'value', type: 'text', required: true, maxLength: 60 }],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero photo (T2 only). 4:5 aspect, реальный объект, не сток.' },
    },
    {
      name: 'photoTag',
      type: 'text',
      maxLength: 80,
      admin: { description: 'Подпись на фото (например, «Реальный объект, Раменское»).' },
    },
  ],
}
