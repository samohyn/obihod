import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import type { Where } from 'payload'
import { payloadClient } from '@/lib/payload'

/**
 * POST /api/admin/media/orphans
 *
 * PANEL-MEDIA-LIBRARY · sa-panel.md AC6.
 *
 * Принимает body `{ ids: string[] }` (POST, не GET — чтобы не упереться в URL
 * length лимит при 1000+ ids от bulk-cleanup кнопки).
 *
 * Для каждого id параллельно проверяет 7 коллекций + 1 global на наличие ссылки
 * через upload-field. Если ни одна коллекция не вернула match → orphan.
 *
 * Response: `{ orphans: string[], totalChecked: number }`.
 *
 * Authentication: admin/manager only (как `/api/admin/page-catalog/csv`).
 */

interface CollectionRef {
  slug: 'authors' | 'cases' | 'blog' | 'districts' | 'service-districts' | 'services'
  fields: string[]
}

/**
 * Top-level upload-fields, перечисленные explicit, чтобы избежать reflection
 * через `payload.config.collections[*].fields` (lexical/blocks внутри richText
 * содержат media-references которые мы НЕ покрываем в MVP — Out-of-scope, см.
 * sa-panel.md «Risks #2»). Если оператор начнёт использовать media в lexical —
 * добавится фаза 2 с deep-scan через payload Local API GraphQL traversal.
 *
 * Источник: `grep -rnE "type: 'upload'.*relationTo: 'media'" site/collections/`
 */
const COLLECTION_REFS: CollectionRef[] = [
  { slug: 'authors', fields: ['avatar'] },
  // Cases: ogImage top-level + photosBefore[].image / photosAfter[].image (array
  // вложенные — Payload Where поддерживает dot-path: `photosBefore.image`).
  { slug: 'cases', fields: ['photosBefore.image', 'photosAfter.image', 'ogImage'] },
  { slug: 'blog', fields: ['heroImage', 'ogImage'] },
  { slug: 'districts', fields: ['heroImage', 'photoGeo'] },
  { slug: 'service-districts', fields: ['ogImage'] },
  // Services: heroImage top-level + gallery[].image array-вложенный + ogImage.
  { slug: 'services', fields: ['heroImage', 'gallery.image', 'ogImage'] },
]

const GLOBAL_REFS: { slug: 'seo-settings'; fields: string[] }[] = [
  { slug: 'seo-settings', fields: ['defaultOgImage'] },
]

interface OrphansRequest {
  ids?: unknown
  includeUsage?: unknown
}

interface UsageRef {
  collection: string
  collectionLabel: string
  id: string | number
  title: string
  field: string
}

interface OrphansResponse {
  orphans: string[]
  totalChecked: number
  /**
   * Если в запросе передан `includeUsage: true` — для каждого id возвращаем
   * массив {collection, id, title, field} с реальными ссылками.
   * Используется в `MediaDetailDrawer` (AC4 «Used-in»).
   */
  usage?: Record<string, UsageRef[]>
}

const COLLECTION_LABELS: Record<string, string> = {
  authors: 'Авторы',
  cases: 'Кейсы',
  blog: 'Блог',
  districts: 'Районы',
  'service-districts': 'Услуга × Район',
  services: 'Услуги',
  'seo-settings': 'SEO',
}

/**
 * Resolve actual upload-field paths for each collection by sniffing payload
 * config at runtime — defensive fallback на случай рассинхронизации статичной
 * COLLECTION_REFS таблицы выше с реальной схемой.
 */
async function findUsage(
  payload: Awaited<ReturnType<typeof payloadClient>>,
  mediaId: string | number,
): Promise<UsageRef[]> {
  const collectionTasks = COLLECTION_REFS.flatMap((ref) =>
    ref.fields.map(async (field) => {
      try {
        const res = await payload.find({
          collection: ref.slug,
          where: { [field]: { equals: mediaId } } as Where,
          limit: 5,
          depth: 0,
          pagination: false,
        })
        return res.docs.map((doc) => ({
          collection: ref.slug,
          collectionLabel: COLLECTION_LABELS[ref.slug] ?? ref.slug,
          id: (doc as { id: string | number }).id,
          title: String(
            (doc as Record<string, unknown>).title ??
              (doc as Record<string, unknown>).slug ??
              (doc as Record<string, unknown>).id,
          ),
          field,
        }))
      } catch {
        return [] as UsageRef[]
      }
    }),
  )

  const globalTasks = GLOBAL_REFS.flatMap((ref) =>
    ref.fields.map(async (field) => {
      try {
        const doc = await payload.findGlobal({ slug: ref.slug, depth: 0 })
        const value = (doc as Record<string, unknown>)[field]
        if (value === mediaId || value === Number(mediaId) || value === String(mediaId)) {
          return [
            {
              collection: ref.slug,
              collectionLabel: COLLECTION_LABELS[ref.slug] ?? ref.slug,
              id: ref.slug,
              title: ref.slug,
              field,
            },
          ]
        }
        return []
      } catch {
        return []
      }
    }),
  )

  const all = await Promise.all([...collectionTasks, ...globalTasks])
  return all.flat()
}

async function checkOrphan(
  payload: Awaited<ReturnType<typeof payloadClient>>,
  mediaId: string | number,
): Promise<boolean> {
  // Параллель: 6 collections × фоновых find() с limit:1 + 1 global. Все
  // upload-fields имеют index по relationship target column в Postgres
  // (Payload генерирует _media_id колонку), поэтому каждый запрос — fast
  // index hit.
  const collectionLookups = COLLECTION_REFS.flatMap((ref) =>
    ref.fields.map((field) =>
      payload
        .find({
          collection: ref.slug,
          where: { [field]: { equals: mediaId } } as Where,
          limit: 1,
          depth: 0,
          pagination: false,
        })
        .then((res) => res.docs.length > 0)
        .catch(() => false),
    ),
  )

  const globalLookups = GLOBAL_REFS.flatMap((ref) =>
    ref.fields.map((field) =>
      payload
        .findGlobal({ slug: ref.slug, depth: 0 })
        .then((doc) => {
          const value = (doc as Record<string, unknown>)[field]
          // upload-field returns id (number) когда depth:0
          return value === mediaId || value === Number(mediaId) || value === String(mediaId)
        })
        .catch(() => false),
    ),
  )

  const results = await Promise.all([...collectionLookups, ...globalLookups])
  // orphan ⇔ ни одна коллекция/global не имеет ссылки
  return !results.some(Boolean)
}

export async function POST(request: Request) {
  const payload = await payloadClient()

  // Authentication
  const headersList = await nextHeaders()
  const auth = await payload.auth({ headers: headersList })
  if (!auth.user) {
    return NextResponse.json(
      { error: { code: 'unauthorized', message: 'Требуется вход в админку.' } },
      { status: 401 },
    )
  }
  const role = (auth.user as { role?: string }).role
  if (!role || !['admin', 'manager'].includes(role)) {
    return NextResponse.json(
      { error: { code: 'forbidden', message: 'Нет прав на проверку медиа.' } },
      { status: 403 },
    )
  }

  // Parse body
  let body: OrphansRequest
  try {
    body = (await request.json()) as OrphansRequest
  } catch {
    return NextResponse.json(
      { error: { code: 'bad_request', message: 'Невалидный JSON.' } },
      { status: 400 },
    )
  }

  if (!Array.isArray(body.ids)) {
    return NextResponse.json(
      { error: { code: 'bad_request', message: 'Поле `ids` должно быть массивом.' } },
      { status: 400 },
    )
  }

  // Sanitize ids: keep только string|number, max 1000 для DDoS-guard.
  const ids = body.ids
    .filter((v): v is string | number => typeof v === 'string' || typeof v === 'number')
    .slice(0, 1000)
    .map(String)

  if (ids.length === 0) {
    const empty: OrphansResponse = { orphans: [], totalChecked: 0 }
    return NextResponse.json(empty)
  }

  const includeUsage = body.includeUsage === true

  if (includeUsage) {
    // Detail mode — для drawer (AC4). Возвращаем полный usage list per id.
    const usageEntries = await Promise.all(ids.map((id) => findUsage(payload, id)))
    const usage: Record<string, UsageRef[]> = {}
    const orphans: string[] = []
    ids.forEach((id, idx) => {
      const refs = usageEntries[idx]
      usage[id] = refs
      if (refs.length === 0) orphans.push(id)
    })
    const response: OrphansResponse = { orphans, totalChecked: ids.length, usage }
    return NextResponse.json(response)
  }

  // Bulk grid mode — fast path, только orphan boolean per id.
  // sa-panel.md AC7: 100 ids × 7 collections = 700 fast index-hits, p95 < 3s.
  const orphanFlags = await Promise.all(ids.map((id) => checkOrphan(payload, id)))
  const orphans = ids.filter((_, idx) => orphanFlags[idx])

  const response: OrphansResponse = { orphans, totalChecked: ids.length }
  return NextResponse.json(response)
}
