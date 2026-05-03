import type { CollectionConfig } from 'payload'
import {
  Hero,
  TextContent,
  ServicesGrid,
  LeadForm,
  MiniCase,
  NeighborDistricts,
  Tldr,
  Breadcrumbs,
} from '@/blocks'

export const Districts: CollectionConfig = {
  slug: 'districts',
  labels: { singular: 'Район', plural: 'Районы' },
  admin: {
    useAsTitle: 'nameNominative',
    defaultColumns: ['nameNominative', 'priority', 'distanceFromMkad'],
    group: '02 · Контент',
    description: 'Районы Москвы и МО. Падежи заполняем для programmatic-страниц.',
  },
  versions: { drafts: true },
  access: { read: () => true },
  // OBI-24 admin §12.4 — UI tabs grouping.
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основные',
          description: 'Slug, падежи названия, приоритет покрытия.',
          fields: [
            { name: 'slug', type: 'text', required: true, unique: true, index: true },
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
            // US-0 Track B-2 — blocks[] для District Hub /raiony/<district>/.
            // Whitelist: hero, text-content, services-grid, lead-form, mini-case,
            // neighbor-districts, tldr, breadcrumbs.
            //
            // NOTE по naming: sa-seo (US-0 §AC-3.3) упоминает «relatedDistricts»,
            // но в текущей schema поле уже называется `neighborDistricts` (выше,
            // в tab «Программа SEO»). NeighborDistricts блок использует именно
            // его. Переименование сломает downstream (блок NeighborDistricts
            // в Track B-1 + sd.md wireframes) — оставляем существующее имя.
            {
              name: 'blocks',
              type: 'blocks',
              blockReferences: [
                Hero,
                TextContent,
                ServicesGrid,
                LeadForm,
                MiniCase,
                NeighborDistricts,
                Tldr,
                Breadcrumbs,
              ],
              blocks: [],
              admin: {
                initCollapsed: true,
                description:
                  'Конструктор District Hub: hero, текст, сетка услуг, форма, мини-кейсы, соседние районы, TL;DR, breadcrumbs. Используется для /raiony/<district>/.',
              },
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
    afterChange: [
      async ({ doc }) => {
        const url = process.env.SITE_URL
        const secret = process.env.REVALIDATE_SECRET
        if (!url || !secret) return doc
        const tags = [
          'sitemap',
          `district-${doc.slug}`,
          ...['arboristika', 'chistka-krysh', 'vyvoz-musora', 'demontazh'].map(
            (s) => `sd-${s}-${doc.slug}`,
          ),
        ]
        try {
          await Promise.all(
            tags.map((tag) =>
              fetch(`${url}/api/revalidate?tag=${tag}`, {
                headers: { 'x-revalidate-secret': secret },
              }),
            ),
          )
        } catch (e) {
          console.warn('[districts.afterChange] revalidate failed:', e)
        }
        return doc
      },
    ],
  },
}
