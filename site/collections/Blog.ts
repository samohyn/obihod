import type { CollectionConfig } from 'payload'

export const Blog: CollectionConfig = {
  slug: 'blog',
  labels: { singular: 'Статья', plural: 'Блог' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'modifiedAt'],
    group: '02 · Контент',
    description: 'Статьи и гайды по четырём направлениям + B2B/регуляторика.',
  },
  versions: { drafts: { autosave: true } },
  access: { read: () => true },
  // OBI-30 Wave 4 — UI tabs grouping (art-concept-v2 §5).
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основные',
          description: 'Slug, заголовок, автор, категория, даты.',
          fields: [
            { name: 'slug', type: 'text', required: true, unique: true, index: true },
            { name: 'title', type: 'text', required: true, maxLength: 120 },
            { name: 'h1', type: 'text', required: true, maxLength: 120 },
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
            { name: 'publishedAt', type: 'date', required: true },
            { name: 'modifiedAt', type: 'date', required: true },
          ],
        },
        {
          label: 'Контент',
          description: 'Lead-параграф (intro), основное тело статьи, hero и OG-изображения.',
          fields: [
            { name: 'intro', type: 'textarea', required: true, maxLength: 280 },
            { name: 'body', type: 'richText', required: true },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'How-to',
          description:
            'HowTo schema (опционально). Включить чекбокс «isHowTo» — появятся пошаговые шаги.',
          fields: [
            {
              name: 'isHowTo',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Включить HowTo schema' },
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
        },
        {
          label: 'FAQ',
          description: 'FAQPage schema. Вопросы-ответы по теме статьи.',
          fields: [
            {
              name: 'faqBlock',
              type: 'array',
              maxRows: 8,
              fields: [
                { name: 'question', type: 'text', required: true, maxLength: 160 },
                { name: 'answer', type: 'richText', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Meta-теги, теги услуг и районов для cross-link.',
          fields: [
            { name: 'metaTitle', type: 'text', maxLength: 60 },
            { name: 'metaDescription', type: 'textarea', maxLength: 160 },
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
          ],
        },
      ],
    },
    // ─── SEO override + E-E-A-T поля (US-5 REQ-5.7 follow-up) — sidebar ───
    {
      name: 'canonicalOverride',
      type: 'text',
      admin: { position: 'sidebar', description: 'Canonical URL override.' },
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
    {
      name: 'lastReviewedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Последняя проверка фактов — E-E-A-T сигнал «свежесть».',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'reviewedBy',
      type: 'relationship',
      relationTo: 'persons',
      admin: {
        position: 'sidebar',
        description: 'Эксперт, проверивший статью (E-E-A-T).',
      },
    },
  ],
}
