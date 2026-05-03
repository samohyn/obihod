import type { Block } from 'payload'

/**
 * ServicesGrid — сетка карточек услуг (sub-services под pillar).
 *
 * US-0 AC-2.5 «список карточек sub-services под pillar (4-9 шт), иконки из
 * реестра §9 brand-guide (services line: 22 иконки), заголовок + ссылка».
 *
 * Renderer: site/components/blocks/ServicesGrid.tsx.
 */
export const ServicesGrid: Block = {
  slug: 'services-grid',
  labels: { singular: 'Сетка услуг', plural: 'Сетки услуг' },
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
      name: 'eyebrow',
      type: 'text',
      maxLength: 60,
      admin: { description: 'Мини-подпись над заголовком. Опционально.' },
    },
    {
      name: 'heading',
      type: 'text',
      maxLength: 140,
      admin: { description: 'Заголовок секции. Рендерится как h2.' },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 9,
      labels: { singular: 'Карточка', plural: 'Карточки услуг' },
      admin: {
        description:
          '4–9 карточек. Sub-услуги под pillar или связанные услуги. Иконки — ключи из реестра brand-guide §9 (например: s-musor, s-spil).',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          maxLength: 80,
          admin: { description: 'Название услуги в карточке.' },
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          admin: {
            description: 'URL-путь услуги (например: vyvoz-musora/staraya-mebel).',
          },
        },
        {
          name: 'icon',
          type: 'text',
          maxLength: 40,
          admin: {
            description:
              'Ключ иконки из brand-guide §9 (s-musor / s-spil / s-krysha / s-demontazh / s-…). Опционально.',
          },
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
