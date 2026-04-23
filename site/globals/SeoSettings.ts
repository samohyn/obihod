import type { GlobalConfig } from 'payload'

/**
 * SeoSettings — SEO-only global. После ADR-0002 часть полей, которые
 * одновременно редактируются оператором и попадают в UI / JSON-LD,
 * переехала в `SiteChrome` (см. site/globals/SiteChrome.ts):
 *   - organization.telephone → SiteChrome.contacts.phoneE164 / phoneDisplay
 *   - organization.legalName / taxId / ogrn → SiteChrome.requisites.*
 *   - organization.addressRegion/Locality/streetAddress/postalCode
 *     → SiteChrome.requisites.*
 *   - organization.foundingDate → удалено (не используется)
 *   - sameAs[] → SiteChrome.social[]
 *
 * Здесь остаются только «техно-SEO» поля: verification, credentials,
 * defaultOgImage, IndexNow, robots, organizationSchemaOverride,
 * localBusiness.* и organization.name (используется как Organization.name
 * в JSON-LD, в UI не рендерится).
 */
export const SeoSettings: GlobalConfig = {
  slug: 'seo-settings',
  label: 'SEO Settings',
  admin: {
    description: 'Глобальные SEO-настройки Обихода (verification, credentials, OG)',
    group: 'SEO',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'organization',
      type: 'group',
      label: 'Organization (JSON-LD)',
      admin: {
        description:
          'Юридическое имя для Organization JSON-LD. Телефон, ИНН, адрес и соцсети редактируйте в SiteChrome.',
      },
      fields: [{ name: 'name', type: 'text', defaultValue: 'Обиход' }],
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
