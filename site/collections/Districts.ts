import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrPublished } from '@/lib/auth/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/lib/admin/revalidateSite'

/**
 * ADR-0019: адрес района не должен совпадать с адресом подуслуги — иначе маршрут
 * /<направление>/<адрес>/ не поймёт, подуслуга это или «услуга в районе».
 */
const validateDistrictSlug = async (value: unknown, args: unknown): Promise<true | string> => {
  if (typeof value !== 'string' || value === '') return true
  if (!/^[a-z0-9-]+$/.test(value)) {
    return 'Slug должен быть kebab-case (a-z, 0-9, -)'
  }
  const req = (args as { req?: { payload?: unknown } }).req
  const payload = req?.payload as
    | {
        find: (a: unknown) => Promise<{
          docs: { slug?: string; service?: { slug?: string } | null }[]
        }>
      }
    | undefined
  if (!payload) return true
  try {
    const subs = await payload.find({
      collection: 'sub-services',
      where: { slug: { equals: value } },
      limit: 1,
      depth: 1,
    })
    const sub = subs.docs[0]
    if (sub) {
      return `Адрес «${value}» уже занят подуслугой «${sub.service?.slug ?? '?'}/${value}». Адреса районов и подуслуг не должны совпадать (ADR-0019).`
    }
  } catch {
    // до миграций и наполнения — пропускаем
  }
  return true
}

export const Districts: CollectionConfig = {
  slug: 'districts',
  // корзина: удалённое можно вернуть (план 09, этап 4.5)
  trash: true,
  labels: { singular: 'Район', plural: 'Районы' },
  admin: {
    useAsTitle: 'nameNominative',
    defaultColumns: ['nameNominative', 'priority', 'distanceFromMkad'],
    group: '02 · Контент',
    description: 'Районы Москвы и МО. Падежи заполняем для programmatic-страниц.',
  },
  versions: { drafts: true },
  access: {
    read: isAdminOrPublished,
    readVersions: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  // OBI-24 admin §12.4 — UI tabs grouping.
  fields: [
    {
      name: 'previewPanel',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '@/components/admin/PagePreviewPanel' } },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основные',
          description: 'Slug, падежи названия, приоритет покрытия.',
          fields: [
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              validate: validateDistrictSlug,
              admin: {
                description:
                  'Часть адреса /<направление>/<адрес>/. Не должен совпадать с адресом подуслуги (ADR-0019).',
              },
            },
            {
              name: 'nameNominative',
              type: 'text',
              required: true,
              admin: { description: '«Раменское»' },
            },
            {
              name: 'namePrepositional',
              type: 'text',
              required: true,
              admin: { description: '«в Раменском»' },
            },
            {
              name: 'nameDative',
              type: 'text',
              required: true,
              admin: { description: '«по Раменскому»' },
            },
            {
              name: 'nameGenitive',
              type: 'text',
              required: true,
              admin: { description: '«из Раменского»' },
            },
            {
              name: 'priority',
              type: 'select',
              required: true,
              defaultValue: 'B',
              options: [
                { label: 'A — приоритетный', value: 'A' },
                { label: 'B — расширение', value: 'B' },
                { label: 'C — удалёнка', value: 'C' },
              ],
            },
          ],
        },
        {
          label: 'Программа SEO',
          description: 'Гео-данные, landmarks, ценообразование. Для programmatic-страниц.',
          fields: [
            {
              name: 'coverageRadius',
              type: 'number',
              required: true,
              min: 1,
              max: 50,
              admin: { description: 'км — для GeoShape в schema.org' },
            },
            { name: 'distanceFromMkad', type: 'number', required: true, min: 0, max: 200 },
            {
              name: 'centerGeo',
              type: 'json',
              required: true,
              admin: { description: '[lon, lat] — центр района для GeoCoordinates JSON-LD' },
            },
            {
              name: 'landmarks',
              type: 'array',
              minRows: 0,
              maxRows: 12,
              labels: { singular: 'Landmark', plural: 'Landmarks (КП/мкр/СНТ)' },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: { description: '«КП Барвиха Hills»' },
                },
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Коттеджный посёлок', value: 'kp' },
                    { label: 'Микрорайон', value: 'mkr' },
                    { label: 'СНТ', value: 'snt' },
                    { label: 'Объект (школа/ТЦ/ЖК)', value: 'object' },
                  ],
                },
              ],
            },
            {
              name: 'neighborDistricts',
              type: 'relationship',
              relationTo: 'districts',
              hasMany: true,
              maxRows: 3,
              admin: { description: '3 соседних района для sibling-блока' },
            },
            {
              name: 'courtsJurisdiction',
              type: 'text',
              admin: { description: 'Администрация района для порубочного билета' },
            },
            {
              name: 'localPriceAdjustment',
              type: 'number',
              required: true,
              defaultValue: 0,
              min: -20,
              max: 20,
              admin: { description: '% от базовой цены услуги' },
            },
          ],
        },
        {
          label: 'Контент',
          description:
            'Hero-картинка, фото с EXIF geo, блочный конструктор для District Hub /raiony/<district>/.',
          fields: [
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            {
              name: 'photoGeo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Фото с EXIF geo (для schema contentLocation)' },
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Meta-теги для страницы района.',
          fields: [
            { name: 'metaTitle', type: 'text', maxLength: 60 },
            { name: 'metaDescription', type: 'textarea', maxLength: 160 },
          ],
        },
      ],
    },
    // Sidebar fields.
    {
      name: 'canonicalOverride',
      type: 'text',
      admin: { position: 'sidebar' },
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
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'breadcrumbLabel',
      type: 'text',
      maxLength: 40,
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
}
