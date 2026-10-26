import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/lib/auth/access'
import { replyDueAt, slaRuleFrom } from '@/lib/leads/sla'
import {
  CONTACT_RESULT_OPTIONS,
  LEAD_STATUS_OPTIONS,
  isClosedStatus,
  isLeadStatus,
} from '@/lib/leads/status'
import {
  buildAfterChangeAuditHook,
  buildAfterDeleteAuditHook,
} from '@/lib/admin/audit/captureHooks'
import { emailManagerAboutLead, type LeadEmailDoc } from '@/lib/leads/notifyEmail'
import { notifyOperatorAboutLead, type LeadDocLike } from '@/lib/telegram/sendMessage'

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
      // План 09, этап 5.2: очередь и карточка заявки вместо штатной таблицы.
      views: {
        list: {
          Component: '@/components/admin/leads/inbox/LeadsInboxView#LeadsInboxView',
        },
      },
    },
  },
  access: {
    // Заявки с сайта идут только через /api/leads/route.ts (rate-limit + honeypot),
    // он пишет Local API без проверки прав. Публичный create открывал обход через
    // REST/GraphQL — спам в админку и Telegram. Вручную заявку создаёт админ.
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
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
      // План 09, этап 5.1: срок ответа ставит сервер при создании; итог первого звонка и закрытие
      // заявки фиксируют время. Только итог звонка останавливает таймер.
      async ({ data, originalDoc, req, operation }) => {
        if (!data) return data
        const now = new Date()
        if (operation === 'create') {
          if (!data.replyDueAt && !isClosedStatus(data.status)) {
            const company = await req.payload
              .findGlobal({ slug: 'company', depth: 0, req })
              .catch(() => null)
            data.replyDueAt = replyDueAt(now, slaRuleFrom(company)).toISOString()
          }
          if (data.contactResult && !data.firstContactAt) data.firstContactAt = now.toISOString()
          if (isClosedStatus(data.status)) data.closedAt = now.toISOString()
          return data
        }
        if (data.contactResult && !originalDoc?.firstContactAt && !data.firstContactAt) {
          data.firstContactAt = now.toISOString()
        }
        const status = data.status ?? originalDoc?.status
        if (isClosedStatus(status)) {
          if (!originalDoc?.closedAt && !data.closedAt) data.closedAt = now.toISOString()
        } else if (originalDoc?.closedAt) {
          data.closedAt = null
        }
        return data
      },
    ],
    // PANEL-AUDIT-LOG (ADR-0014): capture в audit_log с PII masking write-time.
    // Leads НЕ имеют versions: true (PII safety) — единственный audit-trail
    // через эти хуки + maskPII.ts strip phone/email/name перед jsonb insert.
    afterChange: [
      buildAfterChangeAuditHook('leads', (doc) => {
        const phone = typeof doc?.phone === 'string' ? doc.phone : null
        return phone ? `Заявка ${phone.slice(-4)}` : null
      }),
      // US-8 hot-fix (PAN-9): Telegram уведомление оператору о новом лиде.
      // Sustained fire-and-forget pattern (incident 2026-05-01 sync await
      // → pg pool starvation deadlock в audit_log hook). 5s timeout — щадящий,
      // оператор получит сообщение или log-warn если Telegram недоступен.
      ({ doc, operation }) => {
        if (operation !== 'create') return doc
        setImmediate(() => {
          Promise.race([
            notifyOperatorAboutLead(doc as LeadDocLike),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('5s timeout')), 5000),
            ),
          ]).catch((e: unknown) => {
            const msg = e instanceof Error ? e.message : String(e)
            console.error('[lead-telegram-notify]', msg)
          })
        })
        return doc
      },
      // Письмо менеджеру (план 09, этап 1): Telegram с VPS недоступен — почта основной канал.
      // Тот же fire-and-forget: заявка сохраняется, даже если SMTP недоступен.
      ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        setImmediate(() => {
          Promise.race([
            emailManagerAboutLead(doc as LeadEmailDoc, req.payload),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('20s timeout')), 20000),
            ),
          ]).catch((e: unknown) => {
            const msg = e instanceof Error ? e.message : String(e)
            console.error('[lead-email-notify]', msg)
          })
        })
        return doc
      },
    ],
    afterDelete: [
      buildAfterDeleteAuditHook('leads', (doc) => {
        const phone = typeof doc?.phone === 'string' ? doc.phone : null
        return phone ? `Заявка ${phone.slice(-4)}` : null
      }),
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
              label: 'Телефон',
              required: true,
              index: true,
              admin: { description: 'Главный канал связи — звоним сюда первым делом.' },
            },
            {
              name: 'name',
              type: 'text',
              label: 'Имя',
              admin: { description: 'Как обращаться к клиенту. Если пусто — узнаешь при звонке.' },
            },
            {
              name: 'email',
              type: 'email',
              label: 'Почта',
              admin: { description: 'Для отправки сметы и подтверждений. Опционально.' },
            },
            {
              name: 'preferredChannel',
              type: 'select',
              label: 'Удобный канал',
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
              label: 'Услуга',
              relationTo: 'services',
              admin: {
                description: 'Услуга из заявки — нужна для роутинга бригаде и расчёта.',
              },
            },
            {
              name: 'district',
              type: 'relationship',
              label: 'Район',
              relationTo: 'districts',
              admin: {
                description: 'Район объекта — определяет логистику и стоимость выезда.',
              },
            },
            {
              name: 'message',
              type: 'textarea',
              label: 'Что нужно сделать',
              admin: { description: 'Описание задачи от клиента из формы заявки.' },
            },
            {
              name: 'address',
              type: 'text',
              label: 'Адрес или район',
              admin: { description: 'Как клиент указал место работ — свободным текстом.' },
            },
            {
              name: 'photoFiles',
              type: 'upload',
              relationTo: 'lead-photos',
              hasMany: true,
              label: 'Фото объекта',
              admin: {
                description:
                  'Фото, которые клиент прикрепил к заявке (до 5). Метаданные и координаты сняты при загрузке.',
              },
            },
            {
              name: 'photos',
              type: 'array',
              admin: {
                // прежнее поле под S3 — не заполнялось; удалить вторым релизом (expand → contract)
                hidden: true,
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
              label: 'Черновик сметы',
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
              label: 'Страница заявки',
              admin: { description: 'URL страницы, с которой пришла заявка.' },
            },
            {
              name: 'utmSource',
              type: 'text',
              label: 'Рекламный канал (utm_source)',
              admin: { description: 'UTM source — рекламный канал (yandex, google, vk).' },
            },
            {
              name: 'utmMedium',
              type: 'text',
              label: 'Тип трафика (utm_medium)',
              admin: { description: 'UTM medium — тип трафика (cpc, cpm, organic).' },
            },
            {
              name: 'utmCampaign',
              type: 'text',
              label: 'Кампания (utm_campaign)',
              admin: { description: 'UTM campaign — название рекламной кампании.' },
            },
            {
              type: 'collapsible',
              label: 'Согласие на обработку персональных данных',
              admin: {
                initCollapsed: true,
                description:
                  'Подтверждение для 152-ФЗ: когда клиент отметил согласие и какую редакцию документа видел.',
              },
              fields: [
                {
                  name: 'consentAt',
                  type: 'date',
                  label: 'Согласие дано',
                  admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
                },
                {
                  name: 'consentVersion',
                  type: 'text',
                  label: 'Редакция согласия',
                  admin: {
                    readOnly: true,
                    description:
                      'Документ «Согласие на обработку персональных данных»: редакция и номер версии в «Страницах».',
                  },
                },
                {
                  name: 'consentTextHash',
                  type: 'text',
                  label: 'Отпечаток текста (SHA-256)',
                  admin: {
                    readOnly: true,
                    description: 'По нему видно, что текст согласия с тех пор не менялся.',
                  },
                },
              ],
            },
            {
              name: 'callTrackingId',
              type: 'text',
              label: 'ID звонка',
              admin: { description: 'ID звонка из Calltouch/CoMagic — связь с записью разговора.' },
            },
          ],
        },
        {
          label: 'Статус',
          description: 'Воронка обработки заявки и связь с amoCRM.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'replyDueAt',
                  type: 'date',
                  label: 'Ответить до',
                  index: true,
                  admin: {
                    readOnly: true,
                    width: '50%',
                    date: { pickerAppearance: 'dayAndTime' },
                    description:
                      'Ставится автоматически: время заявки плюс «Перезвоним за» из «Компания и контакты».',
                  },
                },
                {
                  name: 'firstContactAt',
                  type: 'date',
                  label: 'Итог первого звонка',
                  admin: {
                    readOnly: true,
                    width: '50%',
                    date: { pickerAppearance: 'dayAndTime' },
                    description: 'Когда менеджер отметил «Связались» или «Не ответил».',
                  },
                },
              ],
            },
            {
              name: 'contactResult',
              type: 'radio',
              label: 'Первый звонок',
              options: [...CONTACT_RESULT_OPTIONS],
              admin: {
                layout: 'horizontal',
                description: 'Только итог звонка останавливает таймер «Ответить до».',
              },
            },
            {
              name: 'nextActionAt',
              type: 'date',
              label: 'Напомнить',
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
                description: 'Например, «перезвонить завтра в 16:00». Срок ответа не меняет.',
              },
            },
            {
              name: 'managerComment',
              type: 'textarea',
              label: 'Комментарий менеджера',
              admin: { description: 'Что договорились, что уточнить. Клиент не видит.' },
            },
            {
              name: 'closedAt',
              type: 'date',
              label: 'Заявка закрыта',
              admin: {
                readOnly: true,
                date: { pickerAppearance: 'dayAndTime' },
                description: 'Ставится при статусе «Завершена», «Отменена» или «Спам».',
              },
            },
            {
              // PANEL-LEADS-INBOX § A.1 — canonical 7-status enum (brand-guide §32 #lead-status).
              // Old → new mapping выполнен миграцией 20260501_140000.
              // Cell renderer: pill + inline-update dropdown (per ADR-0012 Plan A).
              name: 'status',
              type: 'select',
              label: 'Статус',
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
              label: 'История статусов',
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
              label: 'В архиве с',
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
              label: 'ID сделки в amoCRM',
              admin: { description: 'ID сделки в amoCRM — для двусторонней синхронизации.' },
            },
            {
              name: 'syncedAt',
              type: 'date',
              label: 'Синхронизировано с amoCRM',
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
        // оставляя только list-view rendering (см. custom.scss §F).
        description: 'Технические действия — отображаются только в списке заявок.',
        components: {
          Cell: '@/components/admin/leads/RowActionsCell#RowActionsCell',
        },
      },
    },
  ],
  timestamps: true,
}
