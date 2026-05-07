import type { CollectionConfig } from 'payload'

/**
 * Reviews — отзывы клиентов с привязкой к услуге / району / источнику.
 *
 * EPIC-SEO-COMPETE-3 US-9 — закрывает gap для AggregateRating + Review schema.
 *
 * Архитектура (после tamd-proxy review REC #6):
 *   - Sustained `Homepage.reviews` (embedded array в Globals.Homepage) остаётся
 *     до US-9 follow-up data-migration через dba.
 *   - Эта Collection — отдельный data-store; рендер на `/otzyvy/` (US-9 route).
 *   - Когда dba выполнит migration `homepage_reviews` → `reviews`, Homepage.tsx
 *     переключится на чтение из Reviews collection (US-9 follow-up).
 *
 * Page route: `/otzyvy/` (US-9).
 * JSON-LD: Review + AggregateRating через `lib/seo/jsonld.ts → reviewSchema()`.
 *
 * brand-guide §13: TOV «Caregiver+Ruler» — отзывы реальные, без хайпа.
 */
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Отзыв', plural: 'Отзывы' },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'rating', 'service', 'datePublished'],
    group: '02 · Контент',
    description:
      'Отзывы клиентов для /otzyvy/ + Review schema. Sustained homepage_reviews (Globals.Homepage) останется до dba data-migration.',
  },
  versions: { drafts: true },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основные',
          description: 'Автор, рейтинг, текст. Required-минимум для публикации.',
          fields: [
            {
              name: 'authorName',
              type: 'text',
              required: true,
              maxLength: 80,
              admin: {
                description: 'Имя или Имя+Фамилия. Sustained pattern Homepage.reviews.author',
              },
            },
            {
              name: 'rating',
              type: 'number',
              required: true,
              min: 1,
              max: 5,
              admin: { description: 'Звёзды 1-5. Влияет на AggregateRating per /otzyvy/' },
            },
            {
              name: 'text',
              type: 'textarea',
              required: true,
              maxLength: 2000,
              admin: { description: 'Тело отзыва — sustained pattern Homepage.reviews.text' },
            },
            {
              name: 'datePublished',
              type: 'date',
              required: true,
              admin: {
                description: 'Дата отзыва (ISO). Используется в Review schema.datePublished',
                date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' },
              },
            },
          ],
        },
        {
          label: 'Контекст',
          description: 'Привязки к услуге / району / источнику — для фильтров и schema.',
          fields: [
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'services',
              admin: { description: 'К какой услуге относится отзыв (опционально)' },
            },
            {
              name: 'district',
              type: 'relationship',
              relationTo: 'districts',
              admin: { description: 'В каком районе была работа (опционально)' },
            },
            {
              name: 'source',
              type: 'select',
              options: [
                { label: 'Я.Карты', value: 'yandex_maps' },
                { label: 'Я.Бизнес', value: 'yandex_business' },
                { label: '2ГИС', value: 'twogis' },
                { label: 'Авито', value: 'avito' },
                { label: 'Сайт (форма)', value: 'site_form' },
                { label: 'Личное обращение', value: 'direct' },
                { label: 'Другое', value: 'other' },
              ],
              admin: { description: 'Откуда пришёл отзыв' },
            },
            {
              name: 'sourceUrl',
              type: 'text',
              admin: { description: 'Прямая ссылка на источник (Я.Карты review URL и т.п.)' },
            },
          ],
        },
        {
          label: 'Verification',
          description: 'Опции верификации и модерации — для trust-сигнала.',
          fields: [
            {
              name: 'verified',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Отзыв подтверждён (есть скан / видео / фото от клиента)' },
            },
            {
              name: 'pinnedToHomepage',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Закрепить на главной (sustained до миграции homepage_reviews → этой collection)',
              },
            },
            {
              name: 'priority',
              type: 'number',
              defaultValue: 0,
              admin: { description: 'Сортировка на /otzyvy/ — выше = ближе к началу' },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Revalidate /otzyvy/ + sitemap при любом изменении.
        // Sustained pattern с Cases / Blog hooks — fire-and-forget, не блокируем save.
        const secret = process.env.REVALIDATE_SECRET
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
        if (!secret || !siteUrl) return doc
        const url = `${siteUrl}/api/revalidate?tag=reviews&url=/otzyvy/&url=/sitemap.xml`
        // fire-and-forget: 5s timeout, no await блока на UI
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 5_000)
        fetch(url, {
          method: 'GET',
          headers: { 'x-revalidate-secret': secret },
          signal: controller.signal,
        })
          .catch((e) => {
            req.payload.logger.warn(
              `[reviews.afterChange] revalidate failed (${operation}): ${e instanceof Error ? e.message : 'unknown'}`,
            )
          })
          .finally(() => clearTimeout(timer))
        return doc
      },
    ],
  },
}
