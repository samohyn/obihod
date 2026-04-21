import type { GlobalConfig } from 'payload'

export const SeoSettings: GlobalConfig = {
  slug: 'seo-settings',
  label: 'SEO Settings',
  admin: {
    description: 'Глобальные SEO-настройки и реквизиты Обихода',
    group: 'SEO',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'organization',
      type: 'group',
      label: 'Реквизиты Organization (для JSON-LD)',
      fields: [
        {
          name: 'legalName',
          type: 'text',
          defaultValue: 'Общество с ограниченной ответственностью «Обиход»',
        },
        { name: 'name', type: 'text', defaultValue: 'Обиход' },
        {
          name: 'taxId',
          type: 'text',
          defaultValue: '7847729123',
          admin: { description: 'ИНН (текущий — СПб, временно)' },
        },
        { name: 'ogrn', type: 'text' },
        { name: 'addressRegion', type: 'text', defaultValue: 'Санкт-Петербург' },
        { name: 'addressLocality', type: 'text', defaultValue: 'Санкт-Петербург' },
        { name: 'streetAddress', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'telephone', type: 'text' },
        { name: 'foundingDate', type: 'date' },
      ],
    },
    {
      name: 'localBusiness',
      type: 'group',
      label: 'LocalBusiness глобально',
      fields: [
        { name: 'priceRange', type: 'text', defaultValue: '₽₽' },
        { name: 'geoRadiusKm', type: 'number', defaultValue: 150 },
        {
          name: 'openingHours',
          type: 'group',
          fields: [
            { name: 'opens', type: 'text', defaultValue: '08:00' },
            { name: 'closes', type: 'text', defaultValue: '21:00' },
          ],
        },
      ],
    },
    {
      name: 'sameAs',
      type: 'array',
      label: 'sameAs (соцсети)',
      fields: [{ name: 'url', type: 'text', required: true }],
    },
    {
      name: 'credentials',
      type: 'array',
      label: 'Лицензии и допуски (hasCredential)',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'issuer', type: 'text' },
        { name: 'documentUrl', type: 'text', admin: { description: 'PDF-скан в Media' } },
      ],
    },
    {
      name: 'verification',
      type: 'group',
      label: 'Verification codes',
      fields: [
        { name: 'yandexWebmaster', type: 'text' },
        { name: 'googleSearchConsole', type: 'text' },
        { name: 'mailRu', type: 'text' },
      ],
    },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    { name: 'organizationSchemaOverride', type: 'json' },
    {
      name: 'indexNowKey',
      type: 'text',
      admin: { description: '32-hex для IndexNow API' },
    },
    {
      name: 'robotsAdditional',
      type: 'textarea',
      admin: {
        description: 'Дополнительные правила для robots.txt (Clean-param и т.п.)',
      },
    },
  ],
}
