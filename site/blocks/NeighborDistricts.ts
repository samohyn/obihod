import type { Block } from 'payload'

/**
 * NeighborDistricts — 3 ближайших района из District.neighborDistricts.
 *
 * US-0 AC-2.5 «NeighborDistricts — 3 ближайших района из
 * District.relatedDistricts» (поле в Districts.ts называется `neighborDistricts`).
 *
 * Используется на /raiony/<district>/ и /<service>/<district>/. Если задан
 * serviceSlug — ссылки уходят на /<service>/<district>/, иначе — на
 * /raiony/<district>/.
 *
 * Renderer: site/components/blocks/NeighborDistricts.tsx.
 */
export const NeighborDistricts: Block = {
  slug: 'neighbor-districts',
  labels: { singular: 'Соседние районы', plural: 'Соседние районы' },
  admin: { group: 'Навигация' },
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
      defaultValue: 'Соседние районы',
      admin: { description: 'Заголовок секции. По умолчанию «Соседние районы».' },
    },
    {
      name: 'serviceSlug',
      type: 'text',
      admin: {
        description:
          'Опционально. Если задан — ссылки на /<service>/<district>/, иначе на /raiony/<district>/.',
      },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      labels: { singular: 'Район', plural: 'Карточки соседних районов' },
      admin: { description: '1–3 ближайших района.' },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          maxLength: 80,
          admin: { description: 'Название района (именительный падеж).' },
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          admin: { description: 'URL-slug района (например: odincovo).' },
        },
        {
          name: 'distance',
          type: 'text',
          maxLength: 40,
          admin: {
            description: 'Расстояние от текущего района (например: «12 км»). Опционально.',
          },
        },
      ],
    },
  ],
}
