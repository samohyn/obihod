import type { CollectionConfig } from 'payload'

/**
 * Authors — E-E-A-T авторы статей и услуг.
 *
 * Отличие от `Persons`:
 *   - `Persons` — для legal/contact entities (юрлицо, ИНН, телефон) →
 *     используется в Organization JSON-LD (SiteChrome.requisites).
 *   - `Authors` — для контентных авторов: подписи статей блога, владелец
 *     services-страниц (E-E-A-T), reviewedBy в Cases/Blog.
 *
 * Page route: `/avtory/<slug>/` (см. sitemap-tree v0.4, ADR-uМ-10).
 * JSON-LD: Person schema через `lib/seo/jsonld.ts → personSchema()`.
 *
 * US-5 REQ-5.5 follow-up. Создание заранее — `cw` сможет в US-6 ссылаться
 * на authors при производстве контента блога.
 */
export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: { singular: 'Автор', plural: 'Авторы' },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'jobTitle', 'slug'],
    group: '02 · Контент',
    description: 'Авторы статей и эксперты для E-E-A-T (Person schema на /avtory/<slug>/).',
  },
  versions: { drafts: true },
  access: { read: () => true },
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
    {
      name: 'bio',
      type: 'textarea',
      maxLength: 600,
      admin: {
        description: 'Краткая биография — для Person.description + страница /avtory/<slug>/.',
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
    // Trust-сигналы (опционально для E-E-A-T)
    {
      name: 'credentials',
      type: 'array',
      maxRows: 8,
      labels: { singular: 'Сертификат', plural: 'Сертификаты / лицензии' },
      fields: [
        { name: 'name', type: 'text', required: true, maxLength: 160 },
        { name: 'issuer', type: 'text', maxLength: 120 },
        { name: 'issuedAt', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
      ],
      admin: {
        description: 'СРО арбористов, сертификаты безопасности на высоте, профильное образование.',
      },
    },
    // Page meta
    { name: 'metaTitle', type: 'text', maxLength: 60 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
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
