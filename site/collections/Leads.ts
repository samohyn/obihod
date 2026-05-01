import type { CollectionConfig } from 'payload'

import { LEAD_STATUS_OPTIONS, isLeadStatus } from '@/lib/leads/status'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Заявка', plural: 'Заявки' },
  admin: {
    useAsTitle: 'phone',
    defaultColumns: ['phone', 'name', 'service', 'district', 'status', '_actions', 'createdAt'],
    listSearchableFields: ['phone', 'name', 'utmSource', 'utmCampaign'],
    group: '01 · Заявки',
    description: 'Входящие лиды с сайта — телефон, канал связи, черновик сметы.',
    components: {
      // PANEL-LEADS-INBOX § B.2 — quick-filter chips в header list-view.
      views: {
        list: {
          actions: ['@/components/admin/leads/LeadsQuickFilters#LeadsQuickFilters'],
        },
      },
    },
  },
  access: {
    read: ({ req }) =>
      Boolean(req.user) &&
      ['admin', 'manager'].includes((req.user as { role?: string })?.role ?? ''),
  },
  // PANEL-LEADS-INBOX § A.3 — audit log смен status (jsonb backed by migration
  // 20260501_140100_leads_status_history). Hook gar­antirovs invariant
  // «любая смена status → entry в statusHistory» включая API-direct calls.
  hooks: {
    beforeChange: [
      ({ data, originalDoc, req, operation }) => {
        if (operation !== 'update') return data
        if (!originalDoc) return data
        const next = data?.status
        const prev = originalDoc.status
        if (!isLeadStatus(next)) return data
        if (next === prev) return data

        const entry = {
          from: isLeadStatus(prev) ? prev : null,
          to: next,
          changedBy: (req.user as { id?: string | number } | null)?.id ?? null,
          changedAt: new Date().toISOString(),
        }

        const existing = Array.isArray(originalDoc.statusHistory) ? originalDoc.statusHistory : []
        // Cap at 50 entries (per ADR-0012 § Negative consequences) — truncate oldest.
        const merged = [...existing, entry]
        data.statusHistory = merged.length > 50 ? merged.slice(merged.length - 50) : merged
        return data
      },
    ],
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
              // PANEL-LEADS-INBOX § A.1 — canonical 7-status enum (brand-guide §32.4).
              // Old → new mapping выполнен миграцией 20260501_140000.
              // Cell renderer: pill + inline-update dropdown (per ADR-0012 Plan A).
              name: 'status',
              type: 'select',
              defaultValue: 'new',
              options: LEAD_STATUS_OPTIONS,
              admin: {
                description: 'Этап воронки: новая → на связи → смета → бригада → завершена.',
                components: {
                  Cell: '@/components/admin/leads/StatusPillCell#StatusPillCell',
                },
              },
            },
            {
              // § A.3 — audit log (jsonb backed by migration 20260501_140100).
              // Hook beforeChange (выше) — единственный writer; admin readOnly.
              name: 'statusHistory',
              type: 'json',
              defaultValue: [],
              admin: {
                readOnly: true,
                description: 'История смен статуса (read-only, append через beforeChange hook).',
                components: {
                  Field: '@/components/admin/leads/StatusHistoryField#StatusHistoryField',
                },
              },
            },
            {
              // § C.3 — soft-delete. Default-фильтр list-view скрывает archived.
              name: 'archivedAt',
              type: 'date',
              admin: {
                description:
                  'Если заполнено — заявка в архиве. Снять для возврата в активный inbox.',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
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
    {
      // § C.2 — virtual field для per-row «⋯» dropdown в list-view (ADR-0012 Plan A).
      // virtual: true = не пишется в БД (no migration needed). Cell получает rowData
      // и рендерит RowActionsCell в каждой строке.
      name: '_actions',
      type: 'text',
      virtual: true,
      label: 'Действия',
      admin: {
        readOnly: true,
        disableListColumn: false,
        // В edit-view это поле бесполезно — скрываем заголовок через CSS,
        // оставляя только list-view rendering (см. custom.scss
        // .field-type[data-field-name="_actions"]).
        description: 'Технические действия — отображаются только в списке заявок.',
        components: {
          Cell: '@/components/admin/leads/RowActionsCell#RowActionsCell',
        },
      },
    },
  ],
  timestamps: true,
}
