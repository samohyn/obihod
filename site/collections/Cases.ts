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
  // OBI-30 Wave 4 — UI tabs grouping (art-concept-v2 §5).
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основные',
          description: 'Slug, заголовок, услуга, район, дата.',
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
          ],
        },
        {
          label: 'История',
          description: 'Описание объекта, видео, длительность работ.',
          fields: [
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
          ],
        },
        {
          label: 'Галерея',
          description: 'Фото «до» и «после» — минимум по одному.',
          fields: [
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
          ],
        },
        {
          label: 'SEO',
          description: 'Meta-теги, OG-картинка.',
          fields: [
            { name: 'metaTitle', type: 'text', maxLength: 60 },
            { name: 'metaDescription', type: 'textarea', maxLength: 160 },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
    // ─── SEO override + E-E-A-T поля (US-5 REQ-5.7) — sidebar ───
    {
      name: 'canonicalOverride',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'URL canonical override. Редко — для cross-canonical случаев.',
      },
    },
    {
      name: 'robotsDirectives',
      type: 'select',
      hasMany: true,
      defaultValue: ['index', 'follow'],
      options: [
        { label: 'index', value: 'index' },
        { label: 'noindex', value: 'noindex' },
        { label: 'follow', value: 'follow' },
        { label: 'nofollow', value: 'nofollow' },
        { label: 'noarchive', value: 'noarchive' },
        { label: 'nosnippet', value: 'nosnippet' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'breadcrumbLabel',
      type: 'text',
      maxLength: 40,
      admin: { position: 'sidebar', description: 'Короткий label для breadcrumbs.' },
    },
    // ─── E-E-A-T для Cases (Article schema) ───
    {
      name: 'lastReviewedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Дата последней проверки фактов. Сигнал «свежесть» для Я.Вебмастер.',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'reviewedBy',
      type: 'relationship',
      relationTo: 'persons',
      admin: {
        position: 'sidebar',
        description: 'Кто проверил факты — для E-E-A-T.',
      },
    },
  ],
}
