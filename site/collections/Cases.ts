import type { CollectionConfig } from 'payload'

export const Cases: CollectionConfig = {
  slug: 'cases',
  labels: { singular: 'Кейс', plural: 'Кейсы' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'service', 'district', 'dateCompleted'],
    group: '02 · Контент',
    description: 'Реальные объекты Обихода: фото до/после, бригада, район.',
  },
  versions: { drafts: true },
  access: { read: () => true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text', required: true, maxLength: 120 },
    { name: 'h1', type: 'text', maxLength: 120 },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
    },
    {
      name: 'district',
      type: 'relationship',
      relationTo: 'districts',
      required: true,
    },
    { name: 'dateCompleted', type: 'date', required: true },
    {
      name: 'brigade',
      type: 'relationship',
      relationTo: 'persons',
      hasMany: true,
    },
    {
      name: 'photosBefore',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Фото «до»', plural: 'Фото «до»' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'photosAfter',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Фото «после»', plural: 'Фото «после»' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    { name: 'description', type: 'richText', required: true },
    { name: 'videoUrl', type: 'text', admin: { description: 'RuTube / YouTube' } },
    {
      name: 'videoTranscript',
      type: 'textarea',
      admin: { description: 'Для GEO + VideoObject schema' },
    },
    { name: 'durationHours', type: 'number' },
    {
      name: 'finalPrice',
      type: 'number',
      admin: { description: 'Только для аналитики, не публичное' },
    },
    { name: 'metaTitle', type: 'text', maxLength: 60 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
}
