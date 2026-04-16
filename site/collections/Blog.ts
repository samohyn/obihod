import type { CollectionConfig } from 'payload'

export const Blog: CollectionConfig = {
  slug: 'blog',
  labels: { singular: 'Статья', plural: 'Блог' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'modifiedAt'],
    group: 'Контент',
  },
  versions: { drafts: { autosave: true } },
  access: { read: () => true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text', required: true, maxLength: 120 },
    { name: 'h1', type: 'text', required: true, maxLength: 120 },
    { name: 'intro', type: 'textarea', required: true, maxLength: 280 },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'persons',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Арбористика', value: 'arbo' },
        { label: 'Снегоуборка', value: 'sneg' },
        { label: 'Вывоз мусора', value: 'musor' },
        { label: 'Демонтаж', value: 'demontazh' },
        { label: 'B2B / УК', value: 'b2b' },
        { label: 'Регуляторика', value: 'regulyatorika' },
        { label: 'Evergreen', value: 'evergreen' },
      ],
    },
    {
      name: 'tagsServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'tagsDistricts',
      type: 'relationship',
      relationTo: 'districts',
      hasMany: true,
    },
    { name: 'publishedAt', type: 'date', required: true },
    { name: 'modifiedAt', type: 'date', required: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
    { name: 'metaTitle', type: 'text', maxLength: 60 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
    {
      name: 'faqBlock',
      type: 'array',
      maxRows: 8,
      fields: [
        { name: 'question', type: 'text', required: true, maxLength: 160 },
        { name: 'answer', type: 'richText', required: true },
      ],
    },
    {
      name: 'isHowTo',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Для HowTo schema' },
    },
    {
      name: 'howToSteps',
      type: 'array',
      admin: { condition: (data) => Boolean(data?.isHowTo) },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'text', type: 'richText', required: true },
      ],
    },
  ],
}
