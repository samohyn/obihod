import type { CollectionConfig } from 'payload'

import {
  buildAfterChangeAuditHook,
  buildAfterDeleteAuditHook,
} from '@/lib/admin/audit/captureHooks'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: { singular: 'Редирект', plural: 'Редиректы' },
  admin: {
    useAsTitle: 'from',
    group: '04 · SEO',
    description: 'Редиректы 301/302/410 — переезды URL, устаревшие посадочные.',
  },
  access: { read: () => true },
  // PANEL-AUDIT-LOG (ADR-0014): Redirects НЕ versioned (простая schema
  // from/to/code), audit через audit_log table. Полные diffs (без PII).
  hooks: {
    afterChange: [
      buildAfterChangeAuditHook('redirects', (doc) =>
        typeof doc?.from === 'string' ? doc.from : null,
      ),
    ],
    afterDelete: [
      buildAfterDeleteAuditHook('redirects', (doc) =>
        typeof doc?.from === 'string' ? doc.from : null,
      ),
    ],
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: '«/staraya-url/»' },
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      admin: { description: '«/novaya-url/» или абсолютный URL' },
    },
    {
      name: 'statusCode',
      type: 'select',
      defaultValue: '301',
      options: [
        { label: '301 — постоянный', value: '301' },
        { label: '302 — временный', value: '302' },
        { label: '410 — Gone', value: '410' },
      ],
    },
    { name: 'note', type: 'textarea', admin: { description: 'Зачем переезд' } },
  ],
}
