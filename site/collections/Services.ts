import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Услуга', plural: 'Услуги' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'priceFrom', 'priceTo'],
    group: '02 · Контент',
    description: 'Четыре направления Обихода: арбористика, крыши, мусор, демонтаж.',
  },
  versions: { drafts: { autosave: { interval: 2000 } } },
  access: { read: () => true },
  // OBI-30 Wave 4 — UI tabs grouping (art-concept-v2 §5).
  // Unnamed tabs — БД schema не меняется, миграции не требуются.
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основные',
          description: 'Slug, заголовок, цена. Required-минимум для публикации.',
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
          ],
        },
        {
          label: 'Контент',
          description: 'Intro, hero-image, галерея.',
          fields: [
            { name: 'intro', type: 'richText', required: true },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            {
              name: 'gallery',
              type: 'array',
              maxRows: 12,
              fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
            },
          ],
        },
        {
          label: 'Sub-услуги',
          description:
            'Каждая sub-услуга получает публичный URL /<service>/<slug>/. Контент-поля (intro/body/meta) заполняются для отдельной страницы sub.',
          fields: [
            {
              name: 'subServices',
              type: 'array',
              labels: { singular: 'Sub-услуга', plural: 'Sub-услуги' },
              fields: [
                { name: 'slug', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'h1', type: 'text', required: true },
                { name: 'priceFrom', type: 'number' },
                {
                  name: 'intro',
                  type: 'textarea',
                  maxLength: 280,
                  admin: {
                    description:
                      'Answer-first 2-3 предложения для GEO-выдачи. Появляется как lead-параграф на странице sub.',
                  },
                },
                {
                  name: 'body',
                  type: 'richText',
                  admin: {
                    description:
                      'Полный контент sub-услуги ~600-800 слов: что включает, цены, документы, для кого, кейсы.',
                  },
                },
                { name: 'metaTitle', type: 'text', maxLength: 60 },
                { name: 'metaDescription', type: 'textarea', maxLength: 160 },
              ],
            },
          ],
        },
        {
          label: 'FAQ',
          description: 'Общие вопросы по услуге. Идут в FAQPage Schema на pillar-странице.',
          fields: [
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
          ],
        },
        {
          label: 'SEO',
          description: 'Meta-теги, OG, JSON-LD override.',
          fields: [
            { name: 'metaTitle', type: 'text', required: true, maxLength: 60 },
            {
              name: 'metaDescription',
              type: 'textarea',
              required: true,
              minLength: 140,
              maxLength: 160,
            },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
            { name: 'schemaJsonLdOverride', type: 'json' },
          ],
        },
        {
          label: 'Связи',
          description: 'Связанные услуги — для cross-link блока.',
          fields: [
            {
              name: 'relatedServices',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              maxRows: 3,
            },
          ],
        },
      ],
    },
    // ─── SEO override поля (US-5 REQ-5.7) — в sidebar, вне tabs ───
    // Используются точечно когда автогенерируемые metaTitle/metaDescription
    // или canonical нуждаются в корректировке без изменения main-полей.
    {
      name: 'canonicalOverride',
      type: 'text',
      admin: {
        position: 'sidebar',
        description:
          'URL canonical (override автогенерируемого). Редко — для cross-canonical или /lp/* страниц.',
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
      admin: {
        position: 'sidebar',
        description:
          'Robots директивы. Default: index,follow. Снять index перед публикацией черновика — noindex.',
      },
    },
    {
      name: 'breadcrumbLabel',
      type: 'text',
      maxLength: 40,
      admin: {
        position: 'sidebar',
        description: 'Короткий label для breadcrumbs если H1 длинный. Опционально.',
      },
    },
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
