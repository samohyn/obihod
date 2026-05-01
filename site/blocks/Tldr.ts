import type { Block } from 'payload'

/**
 * Tldr — короткий «нейро-формат» для цитируемости (Perplexity / Алиса /
 * AI Overviews). 2-3 предложения с акцентом.
 *
 * US-0 AC-2.5 «нейро-формат: 2-3 предложения с акцентом, eyebrow «Если коротко» /
 * «TL;DR»; mark-up <aside aria-label="Краткий ответ">».
 *
 * Renderer: site/components/blocks/Tldr.tsx (text приоритетнее body).
 */
export const Tldr: Block = {
  slug: 'tldr',
  labels: { singular: 'Краткий ответ (TL;DR)', plural: 'Краткие ответы (TL;DR)' },
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
      admin: { description: 'Якорь для ссылки. Без символа #.' },
    },
    {
      name: 'eyebrow',
      type: 'text',
      maxLength: 40,
      defaultValue: 'Если коротко',
      admin: {
        description: 'Мини-подпись над ответом. По умолчанию «Если коротко».',
      },
    },
    {
      name: 'text',
      type: 'textarea',
      maxLength: 500,
      admin: {
        description:
          'Plain-текст 2-3 предложения. Приоритетнее richText body. Используется для нейро-цитируемости.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      admin: {
        description:
          'Структурированный вариант (если нужно форматирование). Игнорируется при заполненном text.',
      },
    },
  ],
}
