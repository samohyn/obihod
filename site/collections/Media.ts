import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Медиа', plural: 'Медиа' },
  admin: {
    group: '03 · Медиа',
    description: 'Фото объектов, OG-картинки, сканы документов.',
  },
  access: { read: () => true },
  upload: {
    staticDir: 'media',
    adminThumbnail: 'card',
    imageSizes: [
      { name: 'thumb', width: 320, height: 240, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
    {
      name: 'geoLocation',
      type: 'json',
      admin: {
        description: 'EXIF GPS как [lon, lat] — для ImageObject contentLocation',
      },
    },
    {
      name: 'license',
      type: 'select',
      defaultValue: 'proprietary',
      options: [
        { label: 'Собственное', value: 'proprietary' },
        { label: 'CC-BY', value: 'cc-by' },
        { label: 'Public Domain', value: 'public-domain' },
      ],
    },
  ],
}
