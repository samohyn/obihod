import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Услуга', plural: 'Услуги' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'priceFrom', 'priceTo'],
    group: 'Контент',
  },
  versions: { drafts: { autosave: { interval: 2000 } } },
  access: { read: () => true },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (v: unknown) =>
        typeof v === 'string' && /^[a-z][a-z0-9-]{2,40}$/.test(v)
          ? true
          : 'kebab-case латиницей, 3–40 символов',
    },
    { name: 'title', type: 'text', required: true, maxLength: 80 },
    { name: 'h1', type: 'text', required: true, maxLength: 90 },
    { name: 'metaTitle', type: 'text', required: true, maxLength: 60 },
    {
      name: 'metaDescription',
      type: 'textarea',
      required: true,
      minLength: 140,
      maxLength: 160,
    },
    { name: 'intro', type: 'richText', required: true },
    { name: 'priceFrom', type: 'number', required: true, min: 0 },
    { name: 'priceTo', type: 'number', required: true, min: 0 },
    {
      name: 'priceUnit',
      type: 'select',
      required: true,
      options: [
        { label: 'за объект', value: 'object' },
        { label: 'за дерево', value: 'tree' },
        { label: 'за м³', value: 'm3' },
        { label: 'за смену', value: 'shift' },
        { label: 'за м²', value: 'm2' },
      ],
    },
    {
      name: 'faqGlobal',
      type: 'array',
      minRows: 0,
      maxRows: 12,
      labels: { singular: 'FAQ', plural: 'Общие FAQ' },
      fields: [
        { name: 'question', type: 'text', required: true, maxLength: 160 },
        { name: 'answer', type: 'richText', required: true },
      ],
    },
    {
      name: 'subServices',
      type: 'array',
      labels: { singular: 'Sub-услуга', plural: 'Sub-услуги' },
      fields: [
        { name: 'slug', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'h1', type: 'text', required: true },
        { name: 'priceFrom', type: 'number' },
      ],
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      maxRows: 3,
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'array',
      maxRows: 12,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
    { name: 'schemaJsonLdOverride', type: 'json' },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        const url = process.env.SITE_URL
        const secret = process.env.REVALIDATE_SECRET
        if (!url || !secret) return doc
        try {
          await fetch(`${url}/api/revalidate?tag=service-${doc.slug}`, {
            headers: { 'x-revalidate-secret': secret },
          })
          await fetch(`${url}/api/revalidate?tag=sitemap`, {
            headers: { 'x-revalidate-secret': secret },
          })
        } catch (e) {
          console.warn('[services.afterChange] revalidate failed:', e)
        }
        return doc
      },
    ],
  },
}
