import type { CollectionConfig } from 'payload'

export const B2BPages: CollectionConfig = {
  slug: 'b2b-pages',
  labels: { singular: 'B2B-страница', plural: 'B2B-страницы' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'audience'],
    group: 'Контент',
  },
  versions: { drafts: true },
  access: { read: () => true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'h1', type: 'text', required: true },
    { name: 'metaTitle', type: 'text', maxLength: 60 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
    {
      name: 'audience',
      type: 'select',
      required: true,
      options: [
        { label: 'Управляющие компании', value: 'uk' },
        { label: 'ТСЖ', value: 'tszh' },
        { label: 'Facility Management', value: 'fm' },
        { label: 'Застройщики', value: 'zastroyshchik' },
        { label: 'Госзакупки 44/223-ФЗ', value: 'gostorgi' },
      ],
    },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'casesShowcase',
      type: 'relationship',
      relationTo: 'cases',
      hasMany: true,
    },
    { name: 'formConfig', type: 'json' },
    { name: 'contractTemplateUrl', type: 'text' },
    {
      name: 'krishaShtraf',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: '«Штрафы ГЖИ берём на себя по договору»' },
    },
  ],
}
