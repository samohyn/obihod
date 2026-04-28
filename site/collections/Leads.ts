import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Заявка', plural: 'Заявки' },
  admin: {
    useAsTitle: 'phone',
    defaultColumns: ['phone', 'name', 'service', 'district', 'status', 'createdAt'],
    group: '01 · Заявки',
    description: 'Входящие лиды с сайта — телефон, канал связи, черновик сметы.',
  },
  access: {
    read: ({ req }) =>
      Boolean(req.user) &&
      ['admin', 'manager'].includes((req.user as { role?: string })?.role ?? ''),
  },
  // Wave 4 (PAN-3) — UI tabs grouping (art-concept-v2 §5, brand-guide §12.4).
  // Unnamed tabs — БД schema не меняется, миграции не требуются.
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Контакт',
          description: 'Способ связи с клиентом и предпочтительный канал.',
          fields: [
            { name: 'phone', type: 'text', required: true, index: true },
            { name: 'name', type: 'text' },
            { name: 'email', type: 'email' },
            {
              name: 'preferredChannel',
              type: 'select',
              options: [
                { label: 'Telegram', value: 'telegram' },
                { label: 'MAX', value: 'max' },
                { label: 'WhatsApp', value: 'whatsapp' },
                { label: 'Телефон', value: 'phone' },
              ],
            },
          ],
        },
        {
          label: 'Запрос',
          description: 'Что заказывают и где. Фото и черновик сметы.',
          fields: [
            { name: 'service', type: 'relationship', relationTo: 'services' },
            { name: 'district', type: 'relationship', relationTo: 'districts' },
            {
              name: 'photos',
              type: 'array',
              fields: [
                { name: 's3Key', type: 'text' },
                { name: 'url', type: 'text' },
              ],
            },
            { name: 'estimateDraftJson', type: 'json' },
          ],
        },
        {
          label: 'Источник',
          description: 'Откуда пришёл лид: страница входа, UTM-метки, колтрекинг.',
          fields: [
            { name: 'sourcePage', type: 'text' },
            { name: 'utmSource', type: 'text' },
            { name: 'utmMedium', type: 'text' },
            { name: 'utmCampaign', type: 'text' },
            { name: 'callTrackingId', type: 'text' },
          ],
        },
        {
          label: 'Статус',
          description: 'Воронка обработки заявки и связь с amoCRM.',
          fields: [
            {
              name: 'status',
              type: 'select',
              defaultValue: 'new',
              options: [
                { label: 'Новый', value: 'new' },
                { label: 'В amoCRM', value: 'in_amocrm' },
                { label: 'Смета готова', value: 'estimated' },
                { label: 'Конвертирован', value: 'converted' },
                { label: 'Потерян', value: 'lost' },
                { label: 'Спам', value: 'spam' },
              ],
            },
            { name: 'amoCrmId', type: 'text' },
            { name: 'syncedAt', type: 'date' },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
