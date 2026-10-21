import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrPublished } from '@/lib/auth/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/lib/admin/revalidateSite'

export const Services: CollectionConfig = {
  slug: 'services',
  // корзина: удалённое можно вернуть (план 09, этап 4.5)
  trash: true,
  labels: { singular: 'Услуга', plural: 'Услуги' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'priceFrom', 'priceTo'],
    group: '02 · Контент',
    description: 'Четыре направления Обихода: арбористика, крыши, мусор, демонтаж.',
  },
  versions: { drafts: { autosave: { interval: 2000 } } },
  access: {
    read: isAdminOrPublished,
    readVersions: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
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
              admin: {
                description: 'Часть URL: /<slug>/. Меняешь — старый URL умрёт, нужен redirect.',
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              maxLength: 80,
              admin: {
                description: 'Название в каталоге услуг и breadcrumbs. До 80 символов.',
              },
            },
            {
              name: 'h1',
              type: 'text',
              required: true,
              maxLength: 90,
              admin: { description: 'Заголовок на странице услуги. Длиннее title — как H1.' },
            },
            {
              name: 'priceFrom',
              type: 'number',
              required: true,
              min: 0,
              admin: { description: 'Минимальная цена для отображения «от X ₽».' },
            },
            {
              name: 'priceTo',
              type: 'number',
              required: true,
              min: 0,
              admin: { description: 'Верхняя граница для расчёта средней цены и фильтров.' },
            },
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
              admin: {
                description: 'Единица цены — что считаем (объект, дерево, м³, смена).',
              },
            },
          ],
        },
        {
          label: 'Контент',
          description: 'Intro, hero-image, галерея + блочный конструктор страницы.',
          fields: [
            {
              name: 'intro',
              type: 'richText',
              required: true,
              admin: {
                description: 'Lead-параграф на странице услуги — answer-first, 2-3 фразы.',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Главное фото услуги — наш реальный объект, не сток.',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              maxRows: 12,
              admin: { description: 'Галерея до 12 фото. Реальные кейсы, не stock.' },
              fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
            },
          ],
        },
        {
          label: 'Sub-услуги',
          description:
            'Каждая sub-услуга получает публичный URL /<service>/<slug>/. Контент-поля (intro/body/meta) заполняются для отдельной страницы sub. Связанные услуги — для cross-link блока «Похожие» (до 3).',
          fields: [
            // PANEL-SERVICES-PREVIEW-TAB · merge tab «Связи» → «Sub-услуги».
            // Field `relatedServices` переехал из бывшего отдельного tab «Связи»,
            // потому что cross-link блок логически принадлежит pillar-группе
            // под-услуг. Schema БД не меняется (named field остался прежним).
            {
              name: 'relatedServices',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              maxRows: 3,
              admin: {
                description: 'До 3 связанных услуг для блока «Похожие» на странице.',
              },
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
              admin: {
                description: 'FAQ на pillar-странице. Идёт в FAQPage Schema для GEO.',
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  maxLength: 160,
                  admin: { description: 'Вопрос так, как формулирует клиент в Яндексе.' },
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
          description: 'Meta-теги, OG, JSON-LD override.',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              required: true,
              maxLength: 60,
              admin: { description: 'Title в SERP. Оптимум 50-60 символов с услугой и регионом.' },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              required: true,
              minLength: 140,
              maxLength: 160,
              admin: {
                description: 'Description в SERP. 140-160 символов с УТП и call-to-action.',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Картинка в шаринге (Telegram/VK/WA). 1200×630.' },
            },
            {
              name: 'schemaJsonLdOverride',
              type: 'json',
              admin: {
                description: 'JSON-LD override — только если автогенерируемая schema плохая.',
              },
            },
          ],
        },
        {
          // Страница направления собирается в «Страницах» — панель ведёт туда и на сайт.
          label: 'Страница',
          fields: [
            {
              name: 'previewPanel',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/admin/PagePreviewPanel',
                },
              },
            },
          ],
        },
      ],
    },
    // ─── SEO override поля (US-5 REQ-5.7) — в sidebar, вне tabs ───
    // Используются точечно когда автогенерируемые metaTitle/metaDescription
    // или canonical нуждаются в корректировке без изменения main-полей.
    // US-3: reviewedBy — E-E-A-T leverage для T2/T3 (sa-seo §контракт).
    {
      name: 'reviewedBy',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: false,
      admin: {
        position: 'sidebar',
        description:
          'Автор-эксперт, проверивший контент (E-E-A-T). Попадает в Article.author / reviewedBy для schema.org.',
      },
    },
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
    // Проверки старых `blocks` (ADR-0021) сняты 21.10.2026: страница собирается из «Страниц» —
    // старые блоки не рисуются, а проверка не давала сохранить документ (план 09, этап 4).
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
}
