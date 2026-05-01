import type { CollectionConfig } from 'payload'

export const Cases: CollectionConfig = {
  slug: 'cases',
  labels: { singular: 'Кейс', plural: 'Кейсы' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'service', 'district', 'dateCompleted'],
    group: '02 · Контент',
    description: 'Реальные объекты Обихода: фото до/после, бригада, район.',
    // PANEL-EMPTY-LIST-WIRING (sa-panel.md AC2): custom list-view wrapper
    // подменяет native пустой Payload-table на §12.6 EmptyState с CTA при
    // global empty (totalDocs === 0). Filtered-empty оставляем native.
    components: {
      views: {
        list: {
          Component: {
            path: '@/components/admin/CollectionListWithEmpty#default',
            clientProps: {
              emptyConfig: {
                title: 'Кейсов пока нет',
                text: 'Добавьте первый кейс — он появится в портфолио сайта и в SEO landing-pages.',
                actionLabel: '+ Добавить кейс',
                actionHref: '/admin/collections/cases/create',
              },
            },
          },
        },
      },
    },
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
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              admin: { description: 'Часть URL: /kejsy/<slug>/. Меняешь — нужен redirect.' },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              maxLength: 120,
              admin: { description: 'Название кейса в каталоге и breadcrumbs.' },
            },
            {
              name: 'h1',
              type: 'text',
              maxLength: 120,
              admin: { description: 'H1 на странице кейса — может быть длиннее title.' },
            },
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'services',
              required: true,
              admin: { description: 'Какая услуга — связывает кейс с pillar страницей.' },
            },
            {
              name: 'district',
              type: 'relationship',
              relationTo: 'districts',
              required: true,
              admin: { description: 'Район объекта — для local SEO и фильтра по карте.' },
            },
            {
              name: 'dateCompleted',
              type: 'date',
              required: true,
              admin: { description: 'Когда завершили работу — сигнал свежести для GEO.' },
            },
            {
              name: 'brigade',
              type: 'relationship',
              relationTo: 'persons',
              hasMany: true,
              admin: { description: 'Кто работал — для E-E-A-T и связи с командой.' },
            },
          ],
        },
        {
          label: 'История',
          description: 'Описание объекта, видео, длительность работ.',
          fields: [
            {
              name: 'description',
              type: 'richText',
              required: true,
              admin: { description: 'История объекта — что было, что сделали, как заняло.' },
            },
            {
              name: 'videoUrl',
              type: 'text',
              admin: { description: 'RuTube/YouTube ссылка — основа VideoObject schema.' },
            },
            {
              name: 'videoTranscript',
              type: 'textarea',
              admin: { description: 'Транскрипт видео — для GEO + VideoObject schema.' },
            },
            {
              name: 'durationHours',
              type: 'number',
              admin: { description: 'Сколько часов заняла работа — для соц. proof.' },
            },
            {
              name: 'finalPrice',
              type: 'number',
              admin: { description: 'Финальная цена — только для аналитики, не публикуется.' },
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
              admin: {
                description: 'Фото объекта ДО работ — основа эффекта «до/после».',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: { description: 'Реальное фото объекта (не сток).' },
                },
                {
                  name: 'caption',
                  type: 'text',
                  admin: { description: 'Краткая подпись — что показано на фото.' },
                },
              ],
            },
            {
              name: 'photosAfter',
              type: 'array',
              minRows: 1,
              labels: { singular: 'Фото «после»', plural: 'Фото «после»' },
              admin: { description: 'Фото объекта ПОСЛЕ работ — результат бригады.' },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: { description: 'Реальное фото объекта (не сток).' },
                },
                {
                  name: 'caption',
                  type: 'text',
                  admin: { description: 'Краткая подпись — что изменилось.' },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Meta-теги, OG-картинка.',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              maxLength: 60,
              admin: { description: 'Title в SERP. До 60 символов с услугой и районом.' },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              maxLength: 160,
              admin: { description: 'Description в SERP. 140-160 символов с УТП.' },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Картинка для шаринга (Telegram/VK/WA). 1200×630.' },
            },
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
