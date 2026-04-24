import type { Block } from 'payload'

/**
 * TextContent — основной SEO-текст с richText.
 *
 * Publish-gate ServiceDistricts: ≥ 1 text-content с body ≥ 300 слов.
 * Sa-spec §3.2.
 */
export const TextContent: Block = {
  slug: 'text-content',
  labels: { singular: 'Текст-контент', plural: 'Текст-контент' },
  admin: {
    group: 'Контент',
    // Иконка для палитры блоков в admin. Визуал копирует TextContentBlockIcon
    // из components/admin/icons.tsx (4 строки разной длины).
    images: {
      icon: { url: '/admin/blocks/text-content.svg', alt: 'Текст-контент' },
      thumbnail: { url: '/admin/blocks/text-content.svg', alt: 'Текст-контент' },
    },
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Выключите, чтобы скрыть блок на сайте без удаления.',
      },
    },
    {
      name: 'anchor',
      type: 'text',
      admin: {
        description: 'Якорь для ссылки на блок. Без символа #.',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      maxLength: 60,
      admin: {
        description: 'Мини-подпись над заголовком. Опционально.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      maxLength: 140,
      admin: {
        description: 'Заголовок секции. Рендерится как h2.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      admin: {
        description:
          'Основной текст. Для публикации programmatic-страницы — от 300 слов локального контекста.',
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '1',
      options: [
        { label: 'Одна колонка', value: '1' },
        { label: 'Две колонки', value: '2' },
      ],
      admin: {
        description: '1 — одна колонка на всю ширину, 2 — две для длинного текста.',
      },
    },
  ],
}
