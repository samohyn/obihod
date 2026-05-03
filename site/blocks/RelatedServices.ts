import type { Block } from 'payload'

/**
 * RelatedServices — 3 карточки cross-link на pillar/sub-services.
 *
 * US-0 AC-2.5 «RelatedServices — 3 карточки cross-link (на соседние pillar/sub)».
 * 1..3 элемента; больше — обрезается рендерером.
 *
 * Renderer: site/components/blocks/RelatedServices.tsx.
 */
export const RelatedServices: Block = {
  slug: 'related-services',
  labels: { singular: 'Похожие услуги', plural: 'Похожие услуги' },
  admin: { group: 'Каталог' },
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
      name: 'heading',
      type: 'text',
      maxLength: 120,
      defaultValue: 'Похожие услуги',
      admin: { description: 'Заголовок секции. По умолчанию «Похожие услуги».' },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      labels: { singular: 'Карточка', plural: 'Карточки cross-link' },
      admin: { description: '1–3 карточки на соседние услуги.' },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          maxLength: 80,
          admin: { description: 'Название услуги.' },
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          admin: { description: 'URL услуги (например: arboristika).' },
        },
        {
          name: 'summary',
          type: 'textarea',
          maxLength: 200,
          admin: { description: 'Короткое описание под заголовком. До 200 символов.' },
        },
      ],
    },
  ],
}
