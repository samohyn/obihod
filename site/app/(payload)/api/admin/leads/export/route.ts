import { headers as nextHeaders } from 'next/headers'

import { isAdminUser } from '@/lib/auth/access'
import { payloadClient } from '@/lib/payload'
import { CONTACT_RESULT_OPTIONS, LEAD_STATUS_LABELS, isLeadStatus } from '@/lib/leads/status'

/**
 * GET /api/admin/leads/export — выгрузка заявок в CSV (план 09, этап 5.4). Только администратор.
 *
 * По умолчанию без персональных данных: срок, итог звонка, «ответили в срок», источник.
 * Имя, телефон, почта и адрес — только по явному выбору (?pd=1).
 * Разделитель «;» и BOM — файл сразу открывается в Excel с русскими буквами.
 */

type Doc = Record<string, unknown>

const dt = (v: unknown) =>
  typeof v === 'string' && v
    ? new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Europe/Moscow',
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(v))
    : ''

const cell = (v: unknown) => {
  const s = v === null || v === undefined ? '' : String(v)
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function inTime(d: Doc): string {
  if (typeof d.replyDueAt !== 'string') return ''
  if (typeof d.firstContactAt !== 'string') return d.closedAt ? '' : 'нет итога'
  return new Date(d.firstContactAt) <= new Date(d.replyDueAt) ? 'да' : 'нет'
}

export async function GET(request: Request) {
  const h = await nextHeaders()
  const payload = await payloadClient()
  const { user } = await payload.auth({ headers: h })
  if (!isAdminUser(user, h)) return new Response('Нет доступа', { status: 403 })

  const withPd = new URL(request.url).searchParams.get('pd') === '1'
  const [leads, services, districts] = await Promise.all([
    payload.find({
      collection: 'leads',
      depth: 0,
      limit: 10000,
      pagination: false,
      overrideAccess: true,
      sort: '-createdAt',
      where: { archivedAt: { exists: false } },
    }),
    payload.find({ collection: 'services', depth: 0, pagination: false, overrideAccess: true }),
    payload.find({ collection: 'districts', depth: 0, pagination: false, overrideAccess: true }),
  ])
  const sName = new Map(services.docs.map((s) => [s.id, String((s as Doc).title ?? '')]))
  const dName = new Map(districts.docs.map((d) => [d.id, String((d as Doc).nameNominative ?? '')]))
  const results = new Map<string, string>(CONTACT_RESULT_OPTIONS.map((o) => [o.value, o.label]))

  const head = [
    '№',
    'Создана',
    'Статус',
    'Услуга',
    'Район',
    'Ответить до',
    'Итог звонка',
    'Итог отмечен',
    'Ответили в срок',
    'Закрыта',
    'Фото, шт.',
    'Рекламный канал',
    'Тип трафика',
    'Кампания',
    'Страница заявки',
    ...(withPd ? ['Имя', 'Телефон', 'Почта', 'Адрес'] : []),
  ]
  const rows = leads.docs.map((raw) => {
    const d = raw as Doc
    return [
      d.id,
      dt(d.createdAt),
      isLeadStatus(d.status) ? LEAD_STATUS_LABELS[d.status] : '',
      sName.get(d.service as number) ?? '',
      dName.get(d.district as number) ?? '',
      dt(d.replyDueAt),
      results.get(String(d.contactResult ?? '')) ?? '',
      dt(d.firstContactAt),
      inTime(d),
      dt(d.closedAt),
      Array.isArray(d.photoFiles) ? d.photoFiles.length : 0,
      d.utmSource ?? '',
      d.utmMedium ?? '',
      d.utmCampaign ?? '',
      d.sourcePage ?? '',
      ...(withPd ? [d.name ?? '', d.phone ?? '', d.email ?? '', d.address ?? ''] : []),
    ]
  })
  const csv = '﻿' + [head, ...rows].map((r) => r.map(cell).join(';')).join('\r\n')
  const day = new Date().toISOString().slice(0, 10)
  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="obikhod-zayavki-${day}${withPd ? '-pd' : ''}.csv"`,
      'cache-control': 'no-store',
    },
  })
}
