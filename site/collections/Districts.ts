import type { CollectionConfig } from 'payload'

export const Districts: CollectionConfig = {
  slug: 'districts',
  labels: { singular: 'Район', plural: 'Районы' },
  admin: {
    useAsTitle: 'nameNominative',
    defaultColumns: ['nameNominative', 'priority', 'distanceFromMkad'],
    group: 'Контент',
  },
  versions: { drafts: true },
  access: { read: () => true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'nameNominative',
      type: 'text',
      required: true,
      admin: { description: '«Раменское»' },
    },
    {
      name: 'namePrepositional',
      type: 'text',
      required: true,
      admin: { description: '«в Раменском»' },
    },
    {
      name: 'nameDative',
      type: 'text',
      required: true,
      admin: { description: '«по Раменскому»' },
    },
    {
      name: 'nameGenitive',
      type: 'text',
      required: true,
      admin: { description: '«из Раменского»' },
    },
    {
      name: 'coverageRadius',
      type: 'number',
      required: true,
      min: 1,
      max: 50,
      admin: { description: 'км — для GeoShape в schema.org' },
    },
    { name: 'distanceFromMkad', type: 'number', required: true, min: 0, max: 200 },
    {
      name: 'centerGeo',
      type: 'json',
      required: true,
      admin: { description: '[lon, lat] — центр района для GeoCoordinates JSON-LD' },
    },
    {
      name: 'landmarks',
      type: 'array',
      minRows: 0,
      maxRows: 12,
      labels: { singular: 'Landmark', plural: 'Landmarks (КП/мкр/СНТ)' },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: '«КП Барвиха Hills»' },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Коттеджный посёлок', value: 'kp' },
            { label: 'Микрорайон', value: 'mkr' },
            { label: 'СНТ', value: 'snt' },
            { label: 'Объект (школа/ТЦ/ЖК)', value: 'object' },
          ],
        },
      ],
    },
    {
      name: 'neighborDistricts',
      type: 'relationship',
      relationTo: 'districts',
      hasMany: true,
      maxRows: 3,
      admin: { description: '3 соседних района для sibling-блока' },
    },
    {
      name: 'courtsJurisdiction',
      type: 'text',
      admin: { description: 'Администрация района для порубочного билета' },
    },
    {
      name: 'photoGeo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Фото с EXIF geo (для schema contentLocation)' },
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'B',
      options: [
        { label: 'A — приоритетный', value: 'A' },
        { label: 'B — расширение', value: 'B' },
        { label: 'C — удалёнка', value: 'C' },
      ],
    },
    {
      name: 'localPriceAdjustment',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: -20,
      max: 20,
      admin: { description: '% от базовой цены услуги' },
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'metaTitle', type: 'text', maxLength: 60 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        const url = process.env.SITE_URL
        const secret = process.env.REVALIDATE_SECRET
        if (!url || !secret) return doc
        const tags = [
          'sitemap',
          `district-${doc.slug}`,
          ...['arboristika', 'ochistka-krysh', 'vyvoz-musora', 'demontazh'].map(
            (s) => `sd-${s}-${doc.slug}`,
          ),
        ]
        try {
          await Promise.all(
            tags.map((tag) =>
              fetch(`${url}/api/revalidate?tag=${tag}`, {
                headers: { 'x-revalidate-secret': secret },
              }),
            ),
          )
        } catch (e) {
          console.warn('[districts.afterChange] revalidate failed:', e)
        }
        return doc
      },
    ],
  },
}
