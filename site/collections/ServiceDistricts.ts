import type { CollectionConfig, CollectionBeforeValidateHook } from 'payload'

const requireGatesForPublish: CollectionBeforeValidateHook = async ({ data }) => {
  if (!data) return data
  if (data.publishStatus === 'published') {
    if (!data.miniCase) {
      throw new Error(
        'Нельзя публиковать programmatic без mini-кейса из района (Scaled Content Abuse risk).',
      )
    }
    if (!data.localFaq || data.localFaq.length < 2) {
      throw new Error('Минимум 2 локальных FAQ для публикации.')
    }
  }
  return data
}

export const ServiceDistricts: CollectionConfig = {
  slug: 'service-districts',
  labels: { singular: 'Услуга × район', plural: 'Услуги × районы' },
  admin: {
    useAsTitle: 'computedTitle',
    defaultColumns: ['computedTitle', 'publishStatus', 'uniquenessScore'],
    group: '02 · Контент',
    description: 'Programmatic-посадочные услуга × район. Без кейса — noindex.',
  },
  versions: { drafts: true },
  indexes: [{ fields: ['service', 'district'], unique: true }],
  access: { read: () => true },
  fields: [
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
      index: true,
    },
    {
      name: 'district',
      type: 'relationship',
      relationTo: 'districts',
      required: true,
      index: true,
    },
    {
      name: 'computedTitle',
      type: 'text',
      admin: { readOnly: true, description: 'Заполняется автоматически' },
    },
    {
      name: 'miniCase',
      type: 'relationship',
      relationTo: 'cases',
      admin: {
        description: 'ОБЯЗАТЕЛЬНО для publish — реальный кейс из района',
      },
    },
    {
      name: 'localFaq',
      type: 'array',
      maxRows: 5,
      labels: { singular: 'Локальный FAQ', plural: 'Локальные FAQ' },
      fields: [
        { name: 'question', type: 'text', required: true, maxLength: 160 },
        { name: 'answer', type: 'richText', required: true },
      ],
    },
    {
      name: 'localLandmarks',
      type: 'array',
      maxRows: 6,
      fields: [{ name: 'landmarkName', type: 'text', required: true }],
    },
    { name: 'localPriceNote', type: 'textarea', maxLength: 400 },
    {
      name: 'leadParagraph',
      type: 'richText',
      required: true,
      admin: {
        description: 'Lead 2-3 предложения с локальным фактом, answer-first для GEO',
      },
    },
    {
      name: 'uniquenessScore',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Auto: % уникального контента vs template-core (≥60% для publish)',
      },
    },
    {
      name: 'publishStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Review (SEO)', value: 'review' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'noindexUntilCase',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Если miniCase нет — рендерится с robots noindex' },
    },
    {
      name: 'isOrdMarked',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'ОРД: рекламная посадочная для Я.Директа' },
    },
    {
      name: 'eridToken',
      type: 'text',
      admin: { condition: (data) => Boolean(data?.isOrdMarked) },
    },
  ],
  hooks: {
    beforeValidate: [requireGatesForPublish],
    beforeChange: [
      async ({ data, req }) => {
        if (!data) return data
        try {
          const svc = await req.payload.findByID({
            collection: 'services',
            id: data.service,
          })
          const dst = await req.payload.findByID({
            collection: 'districts',
            id: data.district,
          })
          data.computedTitle = `${svc.title} — ${dst.nameNominative}`
        } catch (e) {
          console.warn('[service-districts.beforeChange] computedTitle skipped:', e)
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        const url = process.env.SITE_URL
        const secret = process.env.REVALIDATE_SECRET
        if (!url || !secret) return doc
        try {
          const svc = await req.payload.findByID({
            collection: 'services',
            id: doc.service,
          })
          const dst = await req.payload.findByID({
            collection: 'districts',
            id: doc.district,
          })
          const tag = `sd-${svc.slug}-${dst.slug}`
          await fetch(`${url}/api/revalidate?tag=${tag}`, {
            headers: { 'x-revalidate-secret': secret },
          })
          await fetch(`${url}/api/revalidate?tag=sitemap`, {
            headers: { 'x-revalidate-secret': secret },
          })
        } catch (e) {
          console.warn('[service-districts.afterChange] revalidate failed:', e)
        }
        return doc
      },
    ],
  },
}
