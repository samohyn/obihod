import type { CollectionConfig, Validate } from 'payload'

import { v3Blocks } from '@/blocks/v3'
import { isAdmin, isAdminOrPublished } from '@/lib/auth/access'

/**
 * «Подуслуги» — страницы /направление/подуслуга/ из блоков библиотеки v3 (план 09, раздел 5:
 * подуслуги — отдельная коллекция со своими блоками, SEO и черновиками). Эталон — «Спил деревьев».
 * Пока документ не опубликован, сайт показывает старую страницу из массива подуслуг в «Услугах»
 * (expand → switch → contract).
 */

// Адрес уникален внутри направления: /arboristika/spil-derevev/ и /demontazh/spil-derevev/ — разные.
const validateSlug: Validate = async (value, { req, siblingData, id }) => {
  if (typeof value !== 'string' || !/^[a-z0-9-]+$/.test(value))
    return 'Только латиница, цифры и дефис'
  const service = (siblingData as { service?: unknown })?.service
  const serviceId =
    typeof service === 'object' && service ? (service as { id?: unknown }).id : service
  if (!req?.payload || !serviceId) return true
  const dup = await req.payload.find({
    collection: 'sub-services',
    where: {
      and: [
        { slug: { equals: value } },
        { service: { equals: serviceId } },
        ...(id ? [{ id: { not_equals: id } }] : []),
      ],
    },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })
  return dup.docs.length ? 'В этом направлении уже есть подуслуга с таким адресом' : true
}

export const SubServices: CollectionConfig = {
  slug: 'sub-services',
  labels: { singular: 'Подуслуга', plural: 'Подуслуги' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'service', 'slug', 'updatedAt'],
    group: '02 · Контент',
    description:
      'Страницы подуслуг из блоков: /направление/адрес/. Пока страница не опубликована, на сайте — прежняя версия.',
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
        // Публикация сразу видна на сайте, без ожидания ISR.
        if (doc?._status !== 'published') return
        try {
          const serviceId = typeof doc.service === 'object' ? doc.service?.id : doc.service
          const service = await req.payload.findByID({
            collection: 'services',
            id: serviceId,
            depth: 0,
          })
          const { revalidatePath } = await import('next/cache')
          revalidatePath(`/${(service as { slug?: string }).slug}/${doc.slug}/`)
        } catch (e) {
          // Вне запроса Next (скрипт наполнения) кеша страниц нет — сбрасывать нечего.
          const msg = (e as Error).message
          if (!msg.includes('static generation store missing')) {
            req.payload.logger.error(`[sub-services] revalidate failed: ${msg}`)
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
        { name: 'title', type: 'text', label: 'Название', required: true, admin: { width: '40%' } },
        {
          name: 'service',
          type: 'relationship',
          relationTo: 'services',
          label: 'Направление',
          required: true,
          index: true,
          admin: { width: '30%' },
        },
        {
          name: 'slug',
          type: 'text',
          label: 'Адрес',
          required: true,
          index: true,
          admin: { width: '30%', description: 'Латиница, цифры и дефис: spil-derevev' },
          validate: validateSlug,
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
