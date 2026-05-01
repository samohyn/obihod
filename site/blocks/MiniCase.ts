import type { Block } from 'payload'

/**
 * MiniCase — карточка кейса (фото + 3-4 факта + ссылка).
 *
 * US-0 AC-2.5 «MiniCase — фото + 3-4 факта (срок, бригада, объём, цена) +
 * ссылка на /kejsy/<slug>/».
 *
 * Контракт: либо `caseRef` (relationship to Cases — резолвится на странице),
 * либо `inline` (mock-данные). Минимум один из них.
 *
 * Renderer: site/components/blocks/MiniCase.tsx.
 */
export const MiniCase: Block = {
  slug: 'mini-case',
  labels: { singular: 'Мини-кейс', plural: 'Мини-кейсы' },
  admin: { group: 'Соц. proof' },
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
      name: 'caseRef',
      type: 'relationship',
      relationTo: 'cases',
      admin: {
        description: 'Связь с реальным кейсом из коллекции «Кейсы». Приоритет — над inline.',
      },
    },
    {
      name: 'inline',
      type: 'group',
      admin: {
        description: 'Заполняется вручную, если кейс пока не оформлен в коллекции «Кейсы».',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          maxLength: 140,
          admin: { description: 'Название кейса.' },
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Фото объекта (до или после). 4:3 предпочтительно.' },
        },
        {
          name: 'facts',
          type: 'array',
          maxRows: 4,
          labels: { singular: 'Факт', plural: 'Факты (срок / объём / бригада / цена)' },
          admin: {
            description: 'До 4 фактов. Например: «Срок» → «3 часа», «Цена» → «12 800 ₽».',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              maxLength: 40,
              admin: { description: 'Что замеряем (срок / объём / цена).' },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              maxLength: 80,
              admin: { description: 'Значение (3 часа / 12 м³ / 12 800 ₽).' },
            },
          ],
        },
        {
          name: 'link',
          type: 'text',
          admin: { description: 'Внешняя ссылка на полный кейс. Опционально.' },
        },
      ],
    },
  ],
}
