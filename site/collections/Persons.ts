import type { CollectionConfig } from 'payload'

export const Persons: CollectionConfig = {
  slug: 'persons',
  labels: { singular: 'Сотрудник', plural: 'Команда' },
  admin: {
    useAsTitle: 'lastName',
    defaultColumns: ['lastName', 'firstName', 'jobTitle'],
    group: '02 · Контент',
    description: 'Команда: арбористы, бригадиры, промальпинисты. E-E-A-T для SEO.',
  },
  access: { read: () => true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    {
      name: 'jobTitle',
      type: 'text',
      required: true,
      admin: {
        description: 'Например: Главный арборист / Бригадир арбо / Бригадир промальп',
      },
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'richText' },
    {
      name: 'knowsAbout',
      type: 'array',
      labels: { singular: 'Тема', plural: 'Темы (knowsAbout)' },
      fields: [{ name: 'topic', type: 'text', required: true }],
    },
    {
      name: 'sameAs',
      type: 'array',
      labels: { singular: 'Профиль', plural: 'Профили (TG/VK)' },
      fields: [{ name: 'url', type: 'text', required: true }],
    },
    {
      name: 'credentials',
      type: 'array',
      labels: { singular: 'Сертификат', plural: 'Сертификаты' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'issuer', type: 'text' },
        { name: 'year', type: 'number' },
      ],
    },
    {
      name: 'worksInDistricts',
      type: 'relationship',
      relationTo: 'districts',
      hasMany: true,
    },
  ],
}
