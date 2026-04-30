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
            {
              name: 'phone',
              type: 'text',
              required: true,
              index: true,
              admin: { description: 'Главный канал связи — звоним сюда первым делом.' },
            },
            {
              name: 'name',
              type: 'text',
              admin: { description: 'Как обращаться к клиенту. Если пусто — узнаешь при звонке.' },
            },
            {
              name: 'email',
              type: 'email',
              admin: { description: 'Для отправки сметы и подтверждений. Опционально.' },
            },
            {
              name: 'preferredChannel',
              type: 'select',
              options: [
                { label: 'Telegram', value: 'telegram' },
                { label: 'MAX', value: 'max' },
                { label: 'WhatsApp', value: 'whatsapp' },
                { label: 'Телефон', value: 'phone' },
              ],
              admin: {
                description: 'Куда писать вместо звонка — клиент сам выбрал на сайте.',
              },
            },
          ],
        },
        {
          label: 'Запрос',
          description: 'Что заказывают и где. Фото и черновик сметы.',
          fields: [
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'services',
              admin: {
                description: 'Услуга из заявки — нужна для роутинга бригаде и расчёта.',
              },
            },
            {
              name: 'district',
              type: 'relationship',
              relationTo: 'districts',
              admin: {
                description: 'Район объекта — определяет логистику и стоимость выезда.',
              },
            },
            {
              name: 'photos',
              type: 'array',
              admin: {
                description: 'Фото объекта от клиента — основа для AI-черновика сметы.',
              },
              fields: [
                {
                  name: 's3Key',
                  type: 'text',
                  admin: { description: 'Ключ объекта в S3 — внутреннее, не редактировать.' },
                },
                {
                  name: 'url',
                  type: 'text',
                  admin: { description: 'Публичный URL фото — для предпросмотра.' },
                },
              ],
            },
            {
              name: 'estimateDraftJson',
              type: 'json',
              admin: {
                description: 'AI-черновик сметы по фото. Финальную утверждает оператор.',
              },
            },
          ],
        },
        {
          label: 'Источник',
          description: 'Откуда пришёл лид: страница входа, UTM-метки, колтрекинг.',
          fields: [
            {
              name: 'sourcePage',
              type: 'text',
              admin: { description: 'URL страницы, с которой пришла заявка.' },
            },
            {
              name: 'utmSource',
              type: 'text',
              admin: { description: 'UTM source — рекламный канал (yandex, google, vk).' },
            },
            {
              name: 'utmMedium',
              type: 'text',
              admin: { description: 'UTM medium — тип трафика (cpc, cpm, organic).' },
            },
            {
              name: 'utmCampaign',
              type: 'text',
              admin: { description: 'UTM campaign — название рекламной кампании.' },
            },
            {
              name: 'callTrackingId',
              type: 'text',
              admin: { description: 'ID звонка из Calltouch/CoMagic — связь с записью разговора.' },
            },
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
              admin: {
                description: 'Этап воронки. Новый → перезвонил → смета → договор/потеря.',
              },
            },
            {
              name: 'amoCrmId',
              type: 'text',
              admin: { description: 'ID сделки в amoCRM — для двусторонней синхронизации.' },
            },
            {
              name: 'syncedAt',
              type: 'date',
              admin: { description: 'Когда последний раз синхронизировалось с amoCRM.' },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
