import type { CollectionConfig } from 'payload'

/**
 * RumMetrics — Real User Monitoring sample storage (OVT-3, EPIC-LIWOOD-OVERTAKE).
 *
 * Хранит «сырые» сэмплы Core Web Vitals (LCP / CLS / INP / FID / TTFB / FCP),
 * собираемые с реальных устройств посетителей через `navigator.sendBeacon` →
 * `POST /api/rum`. Цель — confirm/downgrade B2 verdict «CWV likely-LEAD pending
 * PSI»: измерить mobile p75 на наших pillar URL и сравнить с liwood.ru.
 *
 * GDPR / 152-ФЗ: коллекция НЕ хранит PII — нет IP, нет cookies, нет userId.
 * Только: имя метрики, числовое значение, rating, page_url (без query-string),
 * user_agent (truncated), viewport_width, timestamp. UA храним для быстрого
 * mobile/desktop split (без полного парсинга — этого достаточно для p75).
 *
 * Read access — admin only (raw данные не нужны контент-менеджерам).
 * Create — anonymous (это RUM-собиратель; защита через rate-limit в route.ts).
 * Update / delete — закрыты (immutable telemetry, чистка через TTL job).
 */
export const RumMetrics: CollectionConfig = {
  slug: 'rum-metrics',
  labels: { singular: 'RUM сэмпл', plural: 'RUM сэмплы' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'value', 'rating', 'pageUrl', 'viewportWidth', 'createdAt'],
    listSearchableFields: ['name', 'pageUrl'],
    group: '04 · SEO',
    description:
      'Real User Monitoring сэмплы Core Web Vitals (LCP / CLS / INP / FID / TTFB / FCP) ' +
      'с реальных посетителей. PII не хранится. См. OVT-3 / EPIC-LIWOOD-OVERTAKE.',
  },
  access: {
    // Anonymous create — публичный RUM beacon из браузера. Защита через rate-limit
    // в /api/rum/route.ts (10 req/sec per IP) + payload-validation там же.
    create: () => true,
    read: ({ req }) =>
      Boolean(req.user) &&
      ['admin', 'manager'].includes((req.user as { role?: string })?.role ?? ''),
    update: () => false,
    delete: ({ req }) => (req.user as { role?: string } | null)?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'select',
      required: true,
      options: [
        { label: 'LCP — Largest Contentful Paint', value: 'LCP' },
        { label: 'CLS — Cumulative Layout Shift', value: 'CLS' },
        { label: 'INP — Interaction to Next Paint', value: 'INP' },
        { label: 'FID — First Input Delay', value: 'FID' },
        { label: 'TTFB — Time to First Byte', value: 'TTFB' },
        { label: 'FCP — First Contentful Paint', value: 'FCP' },
      ],
      index: true,
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      admin: { description: 'Значение метрики в ms (CLS — unitless × 1000 для удобства sort).' },
    },
    {
      name: 'rating',
      type: 'select',
      required: true,
      options: [
        { label: 'good', value: 'good' },
        { label: 'needs-improvement', value: 'needs-improvement' },
        { label: 'poor', value: 'poor' },
      ],
      index: true,
    },
    {
      name: 'pageUrl',
      type: 'text',
      required: true,
      admin: {
        description:
          'Pathname без query-string (PII-safe; query может содержать utm_*, email и т.п.).',
      },
      index: true,
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'UA truncated до 256 символов — нужно только для mobile/desktop split.',
      },
    },
    {
      name: 'viewportWidth',
      type: 'number',
      admin: { description: 'window.innerWidth — для mobile (<768) / tablet / desktop split.' },
    },
    {
      name: 'navigationType',
      type: 'select',
      options: [
        { label: 'navigate', value: 'navigate' },
        { label: 'reload', value: 'reload' },
        { label: 'back-forward', value: 'back-forward' },
        { label: 'back-forward-cache', value: 'back-forward-cache' },
        { label: 'prerender', value: 'prerender' },
      ],
      admin: {
        description: 'PerformanceNavigationTiming.type — фильтр bf-cache от первого визита.',
      },
    },
    {
      name: 'abVariant',
      type: 'select',
      options: [
        { label: 'v1 — control (sustained legacy)', value: 'v1' },
        { label: 'v2 — pilot (master-template)', value: 'v2' },
      ],
      index: true,
      admin: {
        description:
          'EPIC-SERVICE-PAGES-REDESIGN D5 — A/B pilot variant. Set ТОЛЬКО на сэмплах с pilot URL ' +
          '(/vyvoz-musora/*). Aggregation: GROUP BY abVariant для conv/perf comparison.',
      },
    },
  ],
  timestamps: true,
}
