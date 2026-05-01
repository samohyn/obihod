import type { CollectionBeforeDeleteHook, CollectionConfig, Where } from 'payload'
import { APIError } from 'payload'

import {
  buildAfterChangeAuditHook,
  buildAfterDeleteAuditHook,
} from '@/lib/admin/audit/captureHooks'

/**
 * PANEL-MEDIA-LIBRARY · sa-panel.md «Risks #1» (race condition).
 *
 * Между orphan-check (на client/в endpoint) и фактическим DELETE оператор мог
 * успеть привязать media к новому документу в другой вкладке. Без re-check
 * bulk-delete стёр бы живой файл. Hook повторяет orphan-проверку на момент
 * удаления и бросает 409, если media уже используется.
 *
 * Источник правды по upload-полям — единый с `app/(payload)/api/admin/media/
 * orphans/route.ts` (manual sync, см. Out-of-scope «reflection»). Если в
 * Cases/Services добавится новое upload-поле — обе таблицы надо обновить.
 */
const MEDIA_REFS: { slug: string; fields: string[]; isGlobal?: boolean }[] = [
  { slug: 'authors', fields: ['avatar'] },
  { slug: 'cases', fields: ['photosBefore.image', 'photosAfter.image', 'ogImage'] },
  { slug: 'blog', fields: ['heroImage', 'ogImage'] },
  { slug: 'districts', fields: ['heroImage', 'photoGeo'] },
  { slug: 'service-districts', fields: ['ogImage'] },
  { slug: 'services', fields: ['heroImage', 'gallery.image', 'ogImage'] },
  { slug: 'seo-settings', fields: ['defaultOgImage'], isGlobal: true },
]

const beforeDeleteRaceGuard: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const { payload } = req
  // Для каждой коллекции/global — параллель fast index lookups. Если хоть
  // один match → блокируем delete с 409 Conflict.
  const checks = MEDIA_REFS.flatMap((ref) =>
    ref.fields.map(async (field) => {
      try {
        if (ref.isGlobal) {
          const doc = await payload.findGlobal({ slug: ref.slug as 'seo-settings', depth: 0 })
          const value = (doc as Record<string, unknown>)[field]
          return value === id || value === Number(id) || value === String(id)
        }
        const res = await payload.find({
          collection: ref.slug as 'authors' | 'cases' | 'blog' | 'districts',
          where: { [field]: { equals: id } } as Where,
          limit: 1,
          depth: 0,
          pagination: false,
        })
        return res.docs.length > 0
      } catch {
        return false
      }
    }),
  )

  const anyUsed = (await Promise.all(checks)).some(Boolean)
  if (anyUsed) {
    // 409 Conflict — публичное сообщение для оператора, не утечка stacktrace.
    throw new APIError(
      'Файл используется в одном из документов и не может быть удалён. Обновите список.',
      409,
      undefined,
      true,
    )
  }
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Медиа', plural: 'Медиа' },
  admin: {
    group: '03 · Медиа',
    description: 'Фото объектов, OG-картинки, сканы документов.',
    // PANEL-MEDIA-LIBRARY · sa-panel.md AC1: переопределяем native list-view
    // на grid-вид с thumbnails + filters + orphan detection + bulk cleanup.
    // Sort/pagination/bulk-delete — наши, через client-side fetch к Payload
    // REST API (`/api/media`). См. ADR-0010 — это единственный поддерживаемый
    // механизм override list-view в Payload 3.84.
    components: {
      views: {
        list: {
          Component: '@/components/admin/media/MediaListView#default',
        },
      },
    },
  },
  access: { read: () => true },
  hooks: {
    beforeDelete: [beforeDeleteRaceGuard],
    // PANEL-AUDIT-LOG (ADR-0014): Media НЕ versioned (большой бинарь, только
    // metadata changes). audit_log capture upload/edit/delete events.
    afterChange: [
      buildAfterChangeAuditHook('media', (doc) => {
        const filename = typeof doc?.filename === 'string' ? doc.filename : null
        const alt = typeof doc?.alt === 'string' ? doc.alt : null
        return filename ?? alt
      }),
    ],
    afterDelete: [
      buildAfterDeleteAuditHook('media', (doc) =>
        typeof doc?.filename === 'string' ? doc.filename : null,
      ),
    ],
  },
  upload: {
    staticDir: 'media',
    adminThumbnail: 'card',
    imageSizes: [
      { name: 'thumb', width: 320, height: 240, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  },
  // Wave 4 (PAN-3) — UI tabs grouping (art-concept-v2 §5, brand-guide §12.4).
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основные',
          description: 'Подпись для SEO и человека.',
          fields: [
            { name: 'alt', type: 'text', required: true },
            { name: 'caption', type: 'text' },
          ],
        },
        {
          label: 'Метаданные',
          description: 'Геолокация (EXIF GPS) и лицензия использования.',
          fields: [
            {
              name: 'geoLocation',
              type: 'json',
              admin: {
                description: 'EXIF GPS как [lon, lat] — для ImageObject contentLocation',
              },
            },
            {
              name: 'license',
              type: 'select',
              defaultValue: 'proprietary',
              options: [
                { label: 'Собственное', value: 'proprietary' },
                { label: 'CC-BY', value: 'cc-by' },
                { label: 'Public Domain', value: 'public-domain' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
