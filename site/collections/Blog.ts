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
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              admin: { description: 'Часть URL: /blog/<slug>/. Меняешь — нужен redirect.' },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              maxLength: 120,
              admin: { description: 'Заголовок статьи в каталоге блога и в карточке.' },
            },
            {
              name: 'h1',
              type: 'text',
              required: true,
              maxLength: 120,
              admin: { description: 'H1 на странице — может отличаться от title для SEO.' },
            },
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'persons',
              required: true,
              admin: { description: 'Автор статьи — для E-E-A-T и authoritativeness.' },
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
              admin: { description: 'Раздел блога — для фильтра и breadcrumbs.' },
            },
            {
              name: 'publishedAt',
              type: 'date',
              required: true,
              admin: { description: 'Дата первой публикации — для сортировки и schema.' },
            },
            {
              name: 'modifiedAt',
              type: 'date',
              required: true,
              admin: { description: 'Последнее обновление — сигнал свежести для GEO.' },
            },
          ],
        },
        {
          label: 'Контент',
          description: 'Lead-параграф (intro), основное тело статьи, hero и OG-изображения.',
          fields: [
            {
              name: 'intro',
              type: 'textarea',
              required: true,
              maxLength: 280,
              admin: {
                description: 'Lead-параграф — answer-first 2-3 фразы для GEO-выдачи.',
              },
            },
            {
              name: 'body',
              type: 'richText',
              required: true,
              admin: {
                description: 'Тело статьи — структурированный текст с подзаголовками.',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Главное фото статьи — наше реальное, не сток.' },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Картинка для шаринга (Telegram/VK). 1200×630.' },
            },
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
              admin: {
                description: 'Включить HowTo schema — для пошаговых инструкций в SERP.',
              },
            },
            {
              name: 'howToSteps',
              type: 'array',
              admin: {
                condition: (data) => Boolean(data?.isHowTo),
                description: 'Пошаговые шаги для HowTo schema (видны при isHowTo=true).',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: { description: 'Название шага — короткое, действие.' },
                },
                {
                  name: 'text',
                  type: 'richText',
                  required: true,
                  admin: { description: 'Описание шага — детально, с примерами.' },
                },
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
              admin: {
                description: 'FAQ для FAQPage schema. До 8 пар вопрос-ответ.',
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  maxLength: 160,
                  admin: { description: 'Вопрос так, как формулирует читатель.' },
                },
                {
                  name: 'answer',
                  type: 'richText',
                  required: true,
                  admin: { description: 'Прямой ответ — без воды, 2-4 предложения.' },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Meta-теги, теги услуг и районов для cross-link.',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              maxLength: 60,
              admin: { description: 'Title в SERP. До 60 символов с темой и регионом.' },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              maxLength: 160,
              admin: { description: 'Description в SERP. 140-160 символов с УТП.' },
            },
            {
              name: 'tagsServices',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              admin: { description: 'Услуги, упомянутые в статье — для cross-link блока.' },
            },
            {
              name: 'tagsDistricts',
              type: 'relationship',
              relationTo: 'districts',
              hasMany: true,
              admin: { description: 'Районы, упомянутые в статье — для cross-link блока.' },
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
