import type { CollectionConfig } from 'payload'

import { v3Blocks } from '@/blocks/v3'
import { isAdmin, isAdminOrPublished } from '@/lib/auth/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/lib/admin/revalidateSite'
import { fillOfferAfterRead, validateOfferTokens } from '@/lib/admin/offerTokens'

/**
 * «Страницы» — универсальный тип контента из блоков (план 09, раздел 5: один путь рендера).
 * Первая страница — главная (slug «home»): пока она не опубликована, сайт показывает старую главную
 * из глобала «Главная страница» (expand → switch → contract).
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  // корзина: удалённое можно вернуть (план 09, этап 4.5)
  trash: true,
  labels: { singular: 'Страница', plural: 'Страницы' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: '02 · Контент',
    description:
      'Страницы из блоков. «home» — главная сайта: соберите блоки, сохраните черновик, проверьте предпросмотр и опубликуйте.',
  },
  // maxPerDoc: 0 — история всех редакций (политика и согласие ПДн: какая редакция действовала когда)
  versions: { drafts: { autosave: { interval: 3000 } }, maxPerDoc: 0 },
  access: {
    read: isAdminOrPublished,
    readVersions: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterRead: [fillOfferAfterRead],
    beforeValidate: [validateOfferTokens],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
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
              admin: {
                initCollapsed: true,
                description:
                  'Цифры оффера в текстах — метками: {перезвон}, {смета по фото}, {аварийный выезд}… Сайт подставит значения из «Компания и контакты» → «Оффер» (там же полный список).',
              },
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
