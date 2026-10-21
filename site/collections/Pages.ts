import type { CollectionConfig } from 'payload'

import { v3Blocks } from '@/blocks/v3'
import { isAdmin, isAdminOrPublished } from '@/lib/auth/access'

/**
 * «Страницы» — универсальный тип контента из блоков (план 09, раздел 5: один путь рендера).
 * Первая страница — главная (slug «home»): пока она не опубликована, сайт показывает старую главную
 * из глобала «Главная страница» (expand → switch → contract).
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Страница', plural: 'Страницы' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: '02 · Контент',
    description:
      'Страницы из блоков. «home» — главная сайта: соберите блоки, сохраните черновик, проверьте предпросмотр и опубликуйте.',
  },
  versions: { drafts: { autosave: { interval: 3000 } }, maxPerDoc: 30 },
  access: {
    read: isAdminOrPublished,
    readVersions: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Публикация главной сразу видна на сайте, без ожидания ISR (10 минут).
        if (doc?._status !== 'published') return
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath(doc.slug === 'home' ? '/' : `/${doc.slug}/`)
        } catch (e) {
          // Вне запроса Next (скрипт seed:home) кеша страниц нет — сбрасывать нечего.
          const msg = (e as Error).message
          if (!msg.includes('static generation store missing')) {
            req.payload.logger.error(`[pages] revalidate failed: ${msg}`)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'previewPanel',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '@/components/admin/PagePreviewPanel' } },
    },
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', label: 'Название', required: true, admin: { width: '60%' } },
        {
          name: 'slug',
          type: 'text',
          label: 'Адрес',
          required: true,
          unique: true,
          index: true,
          admin: {
            width: '40%',
            description:
              '«home» — главная, иначе путь без слэшей по краям: «arboristika», «uslugi/tseny». Латиница, цифры, дефис.',
          },
          validate: (value: unknown) =>
            typeof value === 'string' && /^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(value)
              ? true
              : 'Латиница, цифры и дефис; части пути — через «/»',
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Блоки страницы',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: 'Блоки',
              labels: { singular: 'Блок', plural: 'Блоки' },
              blocks: v3Blocks,
              admin: { initCollapsed: true },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Title',
              admin: { description: 'До 60 символов' },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Description',
              admin: { description: 'До 160 символов' },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Картинка для соцсетей',
            },
          ],
        },
      ],
    },
  ],
}
