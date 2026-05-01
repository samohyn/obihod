import type { CollectionConfig } from 'payload'
import { Hero, TextContent, RelatedServices, CtaBanner, Breadcrumbs } from '@/blocks'

/**
 * Authors — E-E-A-T авторы и команда (бригадиры, арбористы, промальпинисты).
 *
 * Объединяет два контекста после PANEL-PERSONS-RENAME (variant b, 2026-05-01):
 *   - авторы статей блога / эксперты на услугах (Person JSON-LD на /avtory/<slug>/);
 *   - команда: кто работал на кейсе (Cases.brigade), кто верифицировал статью
 *     (Blog.reviewedBy, Cases.reviewedBy, ServiceDistricts.reviewedBy).
 *
 * Legal/contact entities (юрлицо, ИНН, телефон) живут в `globals/SiteChrome.requisites` —
 * к Authors не относятся.
 *
 * Page route: `/avtory/<slug>/` (см. sitemap-tree v0.4, ADR-uМ-10).
 * JSON-LD: Person schema через `lib/seo/jsonld.ts → personSchema()`.
 *
 * OBI-24 admin §12.4 — UI tabs grouping (unnamed tabs, без миграции БД).
 * brand-guide §13: TOV «Caregiver+Ruler» — спокойно, авторитетно, без хайпа.
 */
export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: { singular: 'Автор / Сотрудник', plural: 'Авторы / Команда' },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'jobTitle', 'slug'],
    group: '02 · Контент',
    description:
      'Авторы статей, эксперты услуг и команда (арбористы, бригадиры, промальпинисты). Person schema на /avtory/<slug>/ — основа E-E-A-T.',
  },
  versions: { drafts: true },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основные',
          description: 'ФИО, должность, slug. Required-минимум для публикации.',
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
                  : 'kebab-case латиницей, 3–40 символов (например: ivanov-petr)',
              admin: { description: 'URL-slug для /avtory/<slug>/. Транслит ФИО без отчества.' },
            },
            {
              name: 'firstName',
              type: 'text',
              required: true,
              maxLength: 60,
              admin: { description: 'Имя — для Person schema givenName' },
            },
            {
              name: 'lastName',
              type: 'text',
              required: true,
              maxLength: 60,
              admin: { description: 'Фамилия — для Person schema familyName' },
            },
            {
              name: 'fullName',
              type: 'text',
              admin: {
                readOnly: true,
                description: 'Автогенерится из firstName + lastName при сохранении',
              },
              hooks: {
                beforeChange: [
                  ({ siblingData }) => {
                    const fn = (siblingData?.firstName as string | undefined)?.trim()
                    const ln = (siblingData?.lastName as string | undefined)?.trim()
                    if (fn && ln) return `${fn} ${ln}`
                    return undefined
                  },
                ],
              },
            },
            {
              name: 'jobTitle',
              type: 'text',
              maxLength: 120,
              admin: {
                description:
                  'Должность/роль для Person.jobTitle. Например: «Старший арборист», «Бригадир B2B-сегмента», «Эксперт по договорам УК».',
              },
            },
          ],
        },
        {
          label: 'Био',
          description:
            'Биография, аватар, темы экспертизы — для Person.description и страницы автора.',
          fields: [
            {
              name: 'bio',
              type: 'textarea',
              maxLength: 600,
              admin: {
                description:
                  'Краткая биография — для Person.description + страница /avtory/<slug>/.',
              },
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Фото 1:1 (квадрат), для Person.image' },
            },
            {
              name: 'knowsAbout',
              type: 'array',
              maxRows: 12,
              labels: { singular: 'Тема', plural: 'Темы экспертизы' },
              fields: [{ name: 'topic', type: 'text', required: true, maxLength: 80 }],
              admin: {
                description:
                  'Темы экспертизы — для Person.knowsAbout. Например: «Аварийный спил», «Промальп», «Договоры УК».',
              },
            },
          ],
        },
        {
          label: 'Связи',
          description: 'Внешние профили и сертификаты — E-E-A-T сигналы.',
          fields: [
            {
              name: 'sameAs',
              type: 'array',
              maxRows: 8,
              labels: { singular: 'Профиль', plural: 'Внешние профили' },
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  validate: (v: unknown) =>
                    typeof v === 'string' && /^https?:\/\//.test(v)
                      ? true
                      : 'URL должен начинаться с http(s)://',
                },
              ],
              admin: {
                description:
                  'Профили в LinkedIn, Telegram-канал, специализированные сайты — для Person.sameAs (E-E-A-T сигнал).',
              },
            },
            {
              name: 'credentials',
              type: 'array',
              maxRows: 8,
              labels: { singular: 'Сертификат', plural: 'Сертификаты / лицензии' },
              fields: [
                { name: 'name', type: 'text', required: true, maxLength: 160 },
                { name: 'issuer', type: 'text', maxLength: 120 },
                {
                  name: 'issuedAt',
                  type: 'date',
                  admin: { date: { pickerAppearance: 'dayOnly' } },
                },
              ],
              admin: {
                description:
                  'СРО арбористов, сертификаты безопасности на высоте, профильное образование.',
              },
            },
            {
              name: 'worksInDistricts',
              type: 'relationship',
              relationTo: 'districts',
              hasMany: true,
              admin: {
                description:
                  'Районы, где работает сотрудник — для Cases.brigade и локальной E-E-A-T.',
              },
            },
          ],
        },
        {
          label: 'Контент страницы',
          description:
            'Блочный конструктор для страницы автора /avtory/<slug>/. Расширенный контент сверх bio.',
          fields: [
            // US-0 Track B-2 — blocks[] для author-страниц.
            // Whitelist: hero, text-content, related-services, cta-banner,
            // breadcrumbs.
            {
              name: 'blocks',
              type: 'blocks',
              blockReferences: [Hero, TextContent, RelatedServices, CtaBanner, Breadcrumbs],
              blocks: [],
              admin: {
                initCollapsed: true,
                description:
                  'Конструктор страницы автора: hero, текст (статьи / экспертиза), похожие услуги, CTA, breadcrumbs. bio в tab «Био» остаётся для Person.description schema.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Meta-теги для страницы автора.',
          fields: [
            { name: 'metaTitle', type: 'text', maxLength: 60 },
            { name: 'metaDescription', type: 'textarea', maxLength: 160 },
          ],
        },
      ],
    },
    // Sidebar fields — вне tabs.
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
  ],
}
