import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Заявка', plural: 'Заявки' },
  admin: {
    useAsTitle: 'phone',
    defaultColumns: ['phone', 'name', 'service', 'district', 'status', 'createdAt'],
    group: 'CRM',
  },
  access: {
    read: ({ req }) =>
      Boolean(req.user) && ['admin', 'manager'].includes((req.user as { role?: string })?.role ?? ''),
  },
  fields: [
    { name: 'phone', type: 'text', required: true, index: true },
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'sourcePage', type: 'text' },
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
    { name: 'estimateDraftJson', type: 'json' },
    { name: 'amoCrmId', type: 'text' },
    { name: 'utmSource', type: 'text' },
    { name: 'utmMedium', type: 'text' },
    { name: 'utmCampaign', type: 'text' },
    { name: 'callTrackingId', type: 'text' },
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
    { name: 'syncedAt', type: 'date' },
  ],
  timestamps: true,
}
