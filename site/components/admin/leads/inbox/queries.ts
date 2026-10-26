import type { Payload, Where } from 'payload'

import { normalizePhone } from '@/lib/leads/phone'
import { SOON_MS, compareQueue } from '@/lib/leads/sla'
import { CLOSED_STATUSES, isLeadStatus, type ContactResult } from '@/lib/leads/status'

import {
  INBOX_TABS,
  NO_SOURCE,
  QUEUE_LIMIT,
  isInboxTab,
  type InboxData,
  type InboxFilters,
  type InboxLead,
  type InboxLeadRow,
  type InboxOption,
  type InboxTab,
} from './types'

/**
 * Данные экрана «Заявки» (план 09, этап 5.2): очередь вкладки, числа на вкладках, выбранная
 * заявка (?lead=) и варианты фильтров. Только Local API на сервере; права проверяет вызывающий.
 */

type Doc = Record<string, unknown>
type SearchParams = Record<string, string | string[] | undefined>

const str = (v: unknown): string | null => (typeof v === 'string' && v !== '' ? v : null)
const one = (v: string | string[] | undefined): string =>
  Array.isArray(v) ? (v[0] ?? '') : (v ?? '')
const relId = (v: unknown): number | null => {
  if (typeof v === 'number') return v
  if (v && typeof v === 'object' && typeof (v as Doc).id === 'number')
    return (v as Doc).id as number
  return null
}

function tabWhere(tab: InboxTab, now: Date): Where {
  const base: Where[] = [{ archivedAt: { exists: false } }]
  if (tab === 'urgent') {
    base.push(
      { status: { not_in: [...CLOSED_STATUSES] } },
      { firstContactAt: { exists: false } },
      { replyDueAt: { less_than_equal: new Date(now.getTime() + SOON_MS).toISOString() } },
    )
  } else if (tab === 'new') {
    base.push({ status: { equals: 'new' } })
  } else if (tab === 'work') {
    base.push({ status: { in: ['contacted', 'smeta', 'brigade'] } })
  }
  return { and: base }
}

function filterWhere(f: InboxFilters): Where[] {
  const out: Where[] = []
  if (f.service) out.push({ service: { equals: Number(f.service) } })
  if (f.district) out.push({ district: { equals: Number(f.district) } })
  if (f.source === NO_SOURCE) out.push({ utmSource: { exists: false } })
  else if (f.source) out.push({ utmSource: { equals: f.source } })
  const q = f.q.trim()
  if (q) {
    const phone = normalizePhone(q)
    out.push({
      or: [
        { phone: phone ? { equals: phone } : { contains: q } },
        { name: { like: q } },
        { address: { like: q } },
      ],
    })
  }
  return out
}

function toRow(d: Doc, titles: { services: Map<number, string>; districts: Map<number, string> }) {
  const serviceId = relId(d.service)
  const districtId = relId(d.district)
  const photos = Array.isArray(d.photoFiles) ? d.photoFiles : []
  const row: InboxLeadRow = {
    id: d.id as number,
    phone: str(d.phone) ?? '',
    name: str(d.name),
    status: isLeadStatus(d.status) ? d.status : 'new',
    serviceTitle: serviceId !== null ? (titles.services.get(serviceId) ?? null) : null,
    districtTitle: districtId !== null ? (titles.districts.get(districtId) ?? null) : null,
    photoCount: photos.length,
    createdAt: str(d.createdAt) ?? new Date(0).toISOString(),
    replyDueAt: str(d.replyDueAt),
    firstContactAt: str(d.firstContactAt),
    closedAt: str(d.closedAt),
    contactResult: (str(d.contactResult) as ContactResult | null) ?? null,
    nextActionAt: str(d.nextActionAt),
  }
  return row
}

function toLead(d: Doc, titles: Parameters<typeof toRow>[1]): InboxLead {
  const photos = (Array.isArray(d.photoFiles) ? d.photoFiles : [])
    .filter((p): p is Doc => !!p && typeof p === 'object')
    .map((p) => {
      const url = str(p.url) ?? ''
      const thumb = str(((p.sizes as Doc | undefined)?.thumb as Doc | undefined)?.url)
      return { id: p.id as number, url, thumbUrl: thumb ?? url }
    })
    .filter((p) => p.url)
  return {
    ...toRow(d, titles),
    email: str(d.email),
    message: str(d.message),
    address: str(d.address),
    sourcePage: str(d.sourcePage),
    utmSource: str(d.utmSource),
    utmMedium: str(d.utmMedium),
    utmCampaign: str(d.utmCampaign),
    managerComment: str(d.managerComment),
    consentAt: str(d.consentAt),
    consentVersion: str(d.consentVersion),
    photosDeletedAt: str(d.photosDeletedAt),
    photos,
  }
}

async function titleMaps(payload: Payload) {
  const [services, districts] = await Promise.all([
    payload.find({
      collection: 'services',
      depth: 0,
      limit: 200,
      pagination: false,
      overrideAccess: true,
      select: { title: true },
      sort: 'title',
    }),
    payload.find({
      collection: 'districts',
      depth: 0,
      limit: 500,
      pagination: false,
      overrideAccess: true,
      select: { nameNominative: true },
      sort: 'nameNominative',
    }),
  ])
  return {
    services: new Map(services.docs.map((s) => [s.id as number, String((s as Doc).title ?? '')])),
    districts: new Map(
      districts.docs.map((d) => [d.id as number, String((d as Doc).nameNominative ?? '')]),
    ),
  }
}

async function sourceOptions(payload: Payload): Promise<InboxOption[]> {
  const res = await payload.find({
    collection: 'leads',
    depth: 0,
    limit: 1000,
    pagination: false,
    overrideAccess: true,
    select: { utmSource: true },
    where: { utmSource: { exists: true } },
  })
  const values = [...new Set(res.docs.map((d) => str((d as Doc).utmSource)).filter(Boolean))]
  return [
    ...values.sort().map((v) => ({ value: v as string, label: v as string })),
    { value: NO_SOURCE, label: 'Не указано' },
  ]
}

export async function loadInbox(payload: Payload, searchParams: SearchParams): Promise<InboxData> {
  const now = new Date()
  const filters: InboxFilters = {
    q: one(searchParams.q).slice(0, 100),
    service: /^\d+$/.test(one(searchParams.service)) ? one(searchParams.service) : '',
    district: /^\d+$/.test(one(searchParams.district)) ? one(searchParams.district) : '',
    source: one(searchParams.source).slice(0, 100),
  }
  const extra = filterWhere(filters)
  const where = (tab: InboxTab): Where => ({ and: [tabWhere(tab, now), ...extra] })

  const [titles, sources, ...countResults] = await Promise.all([
    titleMaps(payload),
    sourceOptions(payload),
    ...INBOX_TABS.map((t) =>
      payload.count({ collection: 'leads', overrideAccess: true, where: where(t.id) }),
    ),
  ])
  const counts = Object.fromEntries(
    INBOX_TABS.map((t, i) => [t.id, countResults[i].totalDocs]),
  ) as Record<InboxTab, number>

  const asked = one(searchParams.tab)
  const tab: InboxTab = isInboxTab(asked) ? asked : counts.urgent > 0 ? 'urgent' : 'new'

  const list = await payload.find({
    collection: 'leads',
    depth: 0,
    limit: QUEUE_LIMIT,
    overrideAccess: true,
    where: where(tab),
    sort: tab === 'all' ? '-createdAt' : 'replyDueAt',
    select: {
      phone: true,
      name: true,
      status: true,
      service: true,
      district: true,
      photoFiles: true,
      createdAt: true,
      replyDueAt: true,
      firstContactAt: true,
      closedAt: true,
      contactResult: true,
      nextActionAt: true,
    },
  })
  const rows = list.docs.map((d) => toRow(d as Doc, titles))
  if (tab !== 'all') rows.sort(compareQueue(now))

  let selected: InboxLead | null = null
  const leadId = one(searchParams.lead)
  if (/^\d+$/.test(leadId)) {
    const doc = await payload
      .findByID({ collection: 'leads', id: Number(leadId), depth: 1, overrideAccess: true })
      .catch(() => null)
    if (doc) selected = toLead(doc as Doc, titles)
  }

  return {
    tab,
    counts,
    rows,
    total: list.totalDocs,
    selected,
    filters,
    options: {
      services: [...titles.services].map(([id, title]) => ({ value: String(id), label: title })),
      districts: [...titles.districts].map(([id, title]) => ({ value: String(id), label: title })),
      sources,
    },
    serverNow: now.getTime(),
  }
}
