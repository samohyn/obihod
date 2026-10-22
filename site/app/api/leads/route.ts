/**
 * POST /api/leads — заявка с сайта (форма блока «Заявка», план 09, этапы 2 и 5).
 *
 * Принимает JSON или multipart/form-data (форма с фото): поля — lib/leads/schema.ts, фото —
 * `photos` (до 5, lib/leads/photos.ts). Обязательны телефон и согласие на обработку ПДн —
 * согласие проверяем здесь, а не только в браузере, и пишем в заявку время, редакцию документа
 * и отпечаток текста (lib/leads/consent.ts). Услугу и район, если их не прислали, берём из адреса
 * страницы: /arboristika/spil-derevev/istra/ → «Спил и уход за деревьями», «Истра».
 * Письмо менеджеру — в afterChange коллекции Leads (без фото: только ссылка в админку).
 *
 * Защита от спама: скрытое поле `email_url` (заполнено — тихий 200 без записи), не больше
 * 5 заявок в минуту с IP и 3 за 10 минут с одного телефона.
 *
 *   201 { ok, id }                                — заявка создана
 *   200 { ok }                                    — сработала ловушка для ботов
 *   400 { error: 'invalid_json' | 'invalid_form' }
 *   400 { error: 'validation_error', details: [{ field, message, index? }] }
 *   429 { error: 'rate_limit_exceeded' }
 *   500 { error: 'server_error' }
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { clientIp } from '@/lib/http/clientIp'
import { currentConsent } from '@/lib/leads/consent'
import { processPhotos } from '@/lib/leads/photos'
import { fieldErrors, leadSchema } from '@/lib/leads/schema'
import { payloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Payload = Awaited<ReturnType<typeof payloadClient>>

// ─── Лимиты (в памяти процесса: при рестарте окна обнуляются) ────────────────
const windows = new Map<string, number[]>()

function allow(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (windows.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= max) {
    windows.set(key, recent)
    return false
  }
  recent.push(now)
  windows.set(key, recent)
  return true
}

const invalid = (details: { field: string; message: string; index?: number }[]) =>
  NextResponse.json({ error: 'validation_error', details }, { status: 400 })

// ─── Разбор запроса ──────────────────────────────────────────────────────────
async function readBody(
  req: NextRequest,
): Promise<{ fields: Record<string, unknown>; files: File[] } | NextResponse> {
  const type = req.headers.get('content-type') ?? ''
  if (type.startsWith('multipart/form-data')) {
    let form: FormData
    try {
      form = await req.formData()
    } catch {
      return NextResponse.json({ error: 'invalid_form' }, { status: 400 })
    }
    const fields: Record<string, unknown> = {}
    const files: File[] = []
    for (const [key, value] of form.entries()) {
      if (typeof value === 'string') fields[key] = value
      else if (key === 'photos' || key === 'photo') files.push(value)
    }
    return { fields, files }
  }
  try {
    return { fields: (await req.json()) as Record<string, unknown>, files: [] }
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
}

// ─── Услуга и район: из полей формы или из адреса страницы ───────────────────
async function findId(
  payload: Payload,
  collection: 'services' | 'districts',
  slug: string | undefined,
): Promise<number | null> {
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return null
  const res = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return (res.docs[0]?.id as number | undefined) ?? null
}

async function placeFromPage(
  payload: Payload,
  service: string | undefined,
  district: string | undefined,
  sourcePage: string | undefined,
) {
  const parts = (sourcePage ?? '').split('?')[0].split('/').filter(Boolean)
  const serviceId =
    (await findId(payload, 'services', service)) ??
    (parts.length && parts[0] !== 'raiony' ? await findId(payload, 'services', parts[0]) : null)
  const districtId =
    (await findId(payload, 'districts', district)) ??
    (parts.length >= 2 ? await findId(payload, 'districts', parts[parts.length - 1]) : null)
  return { serviceId, districtId }
}

// ─── POST ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await readBody(req)
  if (body instanceof NextResponse) return body
  const { fields, files } = body

  // 1. Ловушка для ботов — тихий 200, чтобы бот не подстраивался
  if (typeof fields.email_url === 'string' && fields.email_url.trim() !== '') {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  // 2. Лимит по IP
  const ip = clientIp(req.headers) ?? 'unknown'
  if (!allow(`ip:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'rate_limit_exceeded' }, { status: 429 })
  }

  // 3. Поля и согласие
  const parsed = leadSchema.safeParse(fields)
  if (!parsed.success) return invalid(fieldErrors(parsed.error))
  const input = parsed.data
  if (!input.consent) {
    return invalid([
      { field: 'consent', message: 'Нужно согласие на обработку персональных данных' },
    ])
  }
  if (!allow(`phone:${input.phone}`, 3, 10 * 60_000)) {
    return NextResponse.json({ error: 'rate_limit_exceeded' }, { status: 429 })
  }

  // 4. Фото — до записи заявки: ошибка в фото не должна оставлять заявку без них
  const { photos, errors } = await processPhotos(files)
  if (errors.length) return invalid(errors)

  let photoIds: number[] = []
  let payload: Payload | null = null
  try {
    payload = await payloadClient()
    const [{ serviceId, districtId }, consent] = await Promise.all([
      placeFromPage(payload, input.service, input.district, input.sourcePage ?? input.source),
      currentConsent(payload),
    ])

    for (const photo of photos) {
      const doc = await payload.create({
        collection: 'lead-photos',
        data: {},
        file: photo,
        overrideAccess: true,
      })
      photoIds.push(doc.id as number)
    }

    const created = await payload.create({
      collection: 'leads',
      overrideAccess: true,
      data: {
        phone: input.phone,
        status: 'new',
        name: input.name,
        email: input.email,
        message: input.message,
        address: input.address,
        service: serviceId ?? undefined,
        district: districtId ?? undefined,
        photoFiles: photoIds.length ? photoIds : undefined,
        sourcePage: input.sourcePage ?? input.source,
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
        consentAt: new Date().toISOString(),
        consentVersion: consent.version,
        consentTextHash: consent.hash ?? undefined,
      } as never,
    })

    // обратная ссылка «фото → заявка» — чтобы в «Фото заявок» было видно, чьё фото
    await Promise.all(
      photoIds.map((id) =>
        payload!.update({
          collection: 'lead-photos',
          id,
          data: { lead: created.id } as never,
          overrideAccess: true,
        }),
      ),
    )

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 })
  } catch (err) {
    console.error('[api/leads] create failed:', err instanceof Error ? err.message : err)
    // заявка не сохранилась — загруженные фото не должны висеть без неё
    if (payload && photoIds.length) {
      await payload
        .delete({
          collection: 'lead-photos',
          where: { id: { in: photoIds } },
          overrideAccess: true,
        })
        .catch(() => undefined)
      photoIds = []
    }
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
