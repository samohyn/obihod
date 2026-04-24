import type { Block } from 'payload'

/**
 * Faq — блок вопрос-ответ с разметкой schema.org FAQPage.
 *
 * Sa-spec §3.7.
 */
export const Faq: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQ-блоки' },
  admin: {
    group: 'Контент',
    // Иконка для палитры блоков в admin. Визуал копирует FaqBlockIcon
    // из components/admin/icons.tsx (знак вопроса в круге).
    images: {
      icon: { url: '/admin/blocks/faq.svg', alt: 'FAQ' },
      thumbnail: { url: '/admin/blocks/faq.svg', alt: 'FAQ' },
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
        description: 'Якорь для ссылки. Например: faq. Без символа #.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      maxLength: 120,
      defaultValue: 'Частые вопросы',
      admin: {
        description: 'Заголовок секции FAQ. По умолчанию «Частые вопросы».',
      },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 12,
      labels: { singular: 'Вопрос-ответ', plural: 'Вопросы-ответы' },
      admin: {
        description: 'От 2 до 12 пар вопрос-ответ. Реальные вопросы клиентов из переписок.',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          maxLength: 160,
          admin: {
            description: 'Вопрос как формулирует клиент. До 160 символов.',
          },
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          admin: {
            description: 'Ответ. Можно списком, абзацами, со ссылками.',
          },
        },
      ],
    },
    {
      name: 'generateFaqPageSchema',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Включает разметку FAQPage для Яндекса и Google. Рекомендуем оставить включённой.',
      },
    },
  ],
}
