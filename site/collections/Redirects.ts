import type { CollectionConfig } from 'payload'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: { singular: 'Редирект', plural: 'Редиректы' },
  admin: { useAsTitle: 'from', group: 'SEO' },
  access: { read: () => true },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: '«/staraya-url/»' },
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      admin: { description: '«/novaya-url/» или абсолютный URL' },
    },
    {
      name: 'statusCode',
      type: 'select',
      defaultValue: '301',
      options: [
        { label: '301 — постоянный', value: '301' },
        { label: '302 — временный', value: '302' },
        { label: '410 — Gone', value: '410' },
      ],
    },
    { name: 'note', type: 'textarea', admin: { description: 'Зачем переезд' } },
  ],
}
