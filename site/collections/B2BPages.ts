import type { CollectionConfig } from 'payload'
import {
  Hero,
  TextContent,
  LeadForm,
  ServicesGrid,
  MiniCase,
  Faq,
  CtaBanner,
  Tldr,
  Breadcrumbs,
} from '@/blocks'
import { buildMasterTemplateGate } from '@/lib/admin/master-template-gate'

export const B2BPages: CollectionConfig = {
  slug: 'b2b-pages',
  labels: { singular: 'B2B-страница', plural: 'B2B-страницы' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'audience'],
    group: '02 · Контент',
    description: 'Посадочные для УК, ТСЖ, FM, застройщиков и госзаказа.',
  },
  versions: { drafts: true },
  access: { read: () => true },
  // OBI-24 admin §12.4 — UI tabs grouping.
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основные',
          description: 'Slug, заголовок, целевая аудитория.',
          fields: [
            { name: 'slug', type: 'text', required: true, unique: true, index: true },
            { name: 'title', type: 'text', required: true },
            { name: 'h1', type: 'text', required: true },
            {
              name: 'audience',
              type: 'select',
              required: true,
              options: [
                { label: 'Управляющие компании', value: 'uk' },
                { label: 'ТСЖ', value: 'tszh' },
                { label: 'УК + ТСЖ (общий сегмент)', value: 'uk-tszh' },
                { label: 'Facility Management', value: 'fm' },
                { label: 'Застройщики', value: 'zastroyshchik' },
                { label: 'Госзакупки 44/223-ФЗ', value: 'gostorgi' },
              ],
            },
          ],
        },
        {
          label: 'Контент',
          description:
            'Тело страницы, кейсы, форма, договорные оферты. Для расширенной структуры используйте блочный конструктор ниже.',
          fields: [
            { name: 'body', type: 'richText', required: true },
            {
              name: 'casesShowcase',
              type: 'relationship',
              relationTo: 'cases',
              hasMany: true,
            },
            { name: 'formConfig', type: 'json' },
            { name: 'contractTemplateUrl', type: 'text' },
            {
              name: 'krishaShtraf',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: '«Штрафы ГЖИ берём на себя по договору»' },
            },
            // US-0 Track B-2 — blocks[] для B2B-страниц (/b2b/<slug>/).
            // Whitelist: hero, text-content, lead-form, services-grid, mini-case,
            // faq, cta-banner, tldr, breadcrumbs.
            {
              name: 'blocks',
              type: 'blocks',
              blockReferences: [
                Hero,
                TextContent,
                LeadForm,
                ServicesGrid,
                MiniCase,
                Faq,
                CtaBanner,
                Tldr,
                Breadcrumbs,
              ],
              blocks: [],
              admin: {
                initCollapsed: true,
                description:
                  'Конструктор B2B-страницы: hero, текст, форма, сетка услуг, мини-кейсы, FAQ, CTA, TL;DR, breadcrumbs. Legacy body выше остаётся для обратной совместимости.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Meta-теги для поисковиков.',
          fields: [
            { name: 'metaTitle', type: 'text', maxLength: 60 },
            { name: 'metaDescription', type: 'textarea', maxLength: 160 },
          ],
        },
      ],
    },
    // ─── SEO override (sidebar, вне tabs) ───
    {
      name: 'canonicalOverride',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'robotsDirectives',
      type: 'select',
      hasMany: true,
      defaultValue: ['index', 'follow'],
      options: [
        { label: 'index', value: 'index' },
        { label: 'noindex', value: 'noindex' },
        { label: 'follow', value: 'follow' },
        { label: 'nofollow', value: 'nofollow' },
        { label: 'noarchive', value: 'noarchive' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'breadcrumbLabel',
      type: 'text',
      maxLength: 40,
      admin: { position: 'sidebar' },
    },
    {
      // EPIC-SERVICE-PAGES-UX C4 — feature flag template_v2 per-URL.
      // Default false → sustained legacy rendering. Per-URL rollout через
      // Payload admin (specs/EPIC-SERVICE-PAGES-UX/c4-migration-plan.md).
      // Resolver: lib/master-template/getBlocksForLayer.ts (T2_PILLAR layer).
      name: 'useTemplateV2',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Master-template v2 (ADR-0021): reorder + filter + fill placeholders. Default false — legacy. Включать per-URL.',
      },
    },
  ],
  hooks: {
    // EPIC-SERVICE-PAGES-UX C3 — master-template enforcement (ADR-0021).
    // B2B-страницы — pillar-уровень landing (T2_PILLAR). UK/ТСЖ/FM/застройщики/
    // госзакупки получают тот же master-template без T3/T4 доп. секций.
    // alsoCheckPayloadStatus=true — B2BPages использует Payload drafts.
    beforeValidate: [
      buildMasterTemplateGate({
        layerResolver: () => 'T2_PILLAR',
        alsoCheckPayloadStatus: true,
      }),
    ],
  },
}
