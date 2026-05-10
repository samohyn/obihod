import type { CollectionConfig } from 'payload'
import {
  Hero,
  TextContent,
  LeadForm,
  CtaBanner,
  Faq,
  Breadcrumbs,
  Tldr,
  ServicesGrid,
  MiniCase,
  RelatedServices,
  Calculator,
} from '@/blocks'
import { buildMasterTemplateGate } from '@/lib/admin/master-template-gate'

/**
 * US-3 ADR-0019 namespace-disjoint guard.
 *
 * Sub-service slug должен:
 *   1) быть kebab-case [a-z0-9-]+
 *   2) НЕ совпадать ни с одним districts.slug (иначе collision T3↔T4 в
 *      `[service]/[slug]/page.tsx` resolver).
 *
 * Проверка выполняется на app-level (validate-hook) + CI-level (lint:slug).
 */
const validateSubServiceSlug = async (value: unknown, args: unknown): Promise<true | string> => {
  if (typeof value !== 'string' || value === '') return true
  if (!/^[a-z0-9-]+$/.test(value)) {
    return 'Slug должен быть kebab-case (a-z, 0-9, -)'
  }
  const req = (args as { req?: { payload?: unknown } }).req
  const payload = req?.payload as { find: (a: unknown) => Promise<{ docs: unknown[] }> } | undefined
  if (!payload) return true
  try {
    const collision = await payload.find({
      collection: 'districts',
      where: { slug: { equals: value } },
      limit: 1,
      depth: 0,
    })
    if (collision.docs.length > 0) {
      return `Slug «${value}» уже используется в Districts. Sub-service slugs должны быть disjoint от city slugs (ADR-0019).`
    }
  } catch {
    // payload.find недоступен (миграции/seed без полного req) — gracefully пропускаем.
  }
  return true
}

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Услуга', plural: 'Услуги' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'priceFrom', 'priceTo'],
    group: '02 · Контент',
    description: 'Четыре направления Обихода: арбористика, крыши, мусор, демонтаж.',
  },
  versions: { drafts: { autosave: { interval: 2000 } } },
  access: { read: () => true },
  // OBI-30 Wave 4 — UI tabs grouping (art-concept-v2 §5).
  // Unnamed tabs — БД schema не меняется, миграции не требуются.
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основные',
          description: 'Slug, заголовок, цена. Required-минимум для публикации.',
          fields: [
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              validate: (v: unknown) =>
                typeof v === 'string' && /^[a-z][a-z0-9-]{2,40}$/.test(v)
                  ? true
                  : 'kebab-case латиницей, 3–40 символов',
              admin: {
                description: 'Часть URL: /<slug>/. Меняешь — старый URL умрёт, нужен redirect.',
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              maxLength: 80,
              admin: {
                description: 'Название в каталоге услуг и breadcrumbs. До 80 символов.',
              },
            },
            {
              name: 'h1',
              type: 'text',
              required: true,
              maxLength: 90,
              admin: { description: 'Заголовок на странице услуги. Длиннее title — как H1.' },
            },
            {
              name: 'priceFrom',
              type: 'number',
              required: true,
              min: 0,
              admin: { description: 'Минимальная цена для отображения «от X ₽».' },
            },
            {
              name: 'priceTo',
              type: 'number',
              required: true,
              min: 0,
              admin: { description: 'Верхняя граница для расчёта средней цены и фильтров.' },
            },
            {
              name: 'priceUnit',
              type: 'select',
              required: true,
              options: [
                { label: 'за объект', value: 'object' },
                { label: 'за дерево', value: 'tree' },
                { label: 'за м³', value: 'm3' },
                { label: 'за смену', value: 'shift' },
                { label: 'за м²', value: 'm2' },
              ],
              admin: {
                description: 'Единица цены — что считаем (объект, дерево, м³, смена).',
              },
            },
          ],
        },
        {
          label: 'Контент',
          description: 'Intro, hero-image, галерея + блочный конструктор страницы.',
          fields: [
            {
              name: 'intro',
              type: 'richText',
              required: true,
              admin: {
                description: 'Lead-параграф на странице услуги — answer-first, 2-3 фразы.',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Главное фото услуги — наш реальный объект, не сток.',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              maxRows: 12,
              admin: { description: 'Галерея до 12 фото. Реальные кейсы, не stock.' },
              fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
            },
            // US-0 Track B-2 — blocks[] для pillar/sub Service-страниц.
            // Whitelist: hero, text-content, lead-form, cta-banner, faq, services-grid,
            // mini-case, related-services, tldr, breadcrumbs, calculator-placeholder.
            // before-after — opt-in в US-3 (sa-spec AC-3.4).
            {
              name: 'blocks',
              type: 'blocks',
              blockReferences: [
                Hero,
                TextContent,
                LeadForm,
                CtaBanner,
                Faq,
                ServicesGrid,
                MiniCase,
                RelatedServices,
                Tldr,
                Breadcrumbs,
                Calculator,
              ],
              blocks: [],
              admin: {
                initCollapsed: true,
                description:
                  'Конструктор страницы услуги: hero, текст, FAQ, CTA, сетка sub-услуг, мини-кейс, похожие услуги, TL;DR, breadcrumbs, калькулятор. Legacy intro выше остаётся для обратной совместимости.',
              },
            },
          ],
        },
        {
          label: 'Sub-услуги',
          description:
            'Каждая sub-услуга получает публичный URL /<service>/<slug>/. Контент-поля (intro/body/meta) заполняются для отдельной страницы sub. Связанные услуги — для cross-link блока «Похожие» (до 3).',
          fields: [
            {
              name: 'subServices',
              type: 'array',
              labels: { singular: 'Sub-услуга', plural: 'Sub-услуги' },
              fields: [
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  validate: validateSubServiceSlug,
                  admin: {
                    description:
                      'Часть URL: /<service>/<slug>/. Должен быть disjoint от districts.slug (ADR-0019).',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: { description: 'Название sub-услуги в каталоге внутри pillar.' },
                },
                {
                  name: 'h1',
                  type: 'text',
                  required: true,
                  admin: { description: 'H1 на отдельной странице sub-услуги.' },
                },
                {
                  name: 'priceFrom',
                  type: 'number',
                  admin: { description: 'Цена «от» для конкретной sub-услуги.' },
                },
                {
                  name: 'intro',
                  type: 'textarea',
                  maxLength: 280,
                  admin: {
                    description:
                      'Answer-first 2-3 предложения для GEO-выдачи. Появляется как lead-параграф на странице sub.',
                  },
                },
                {
                  name: 'body',
                  type: 'richText',
                  admin: {
                    description:
                      'Полный контент sub-услуги ~600-800 слов: что включает, цены, документы, для кого, кейсы.',
                  },
                },
                {
                  name: 'metaTitle',
                  type: 'text',
                  maxLength: 60,
                  admin: { description: 'Title в SERP для sub-страницы. До 60 символов.' },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                  admin: { description: 'Description в SERP. 140-160 символов оптимум.' },
                },
              ],
            },
            // PANEL-SERVICES-PREVIEW-TAB · merge tab «Связи» → «Sub-услуги».
            // Field `relatedServices` переехал из бывшего отдельного tab «Связи»,
            // потому что cross-link блок логически принадлежит pillar-группе
            // под-услуг. Schema БД не меняется (named field остался прежним).
            {
              name: 'relatedServices',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              maxRows: 3,
              admin: {
                description: 'До 3 связанных услуг для блока «Похожие» на странице.',
              },
            },
          ],
        },
        {
          label: 'FAQ',
          description: 'Общие вопросы по услуге. Идут в FAQPage Schema на pillar-странице.',
          fields: [
            {
              name: 'faqGlobal',
              type: 'array',
              minRows: 0,
              maxRows: 12,
              labels: { singular: 'FAQ', plural: 'Общие FAQ' },
              admin: {
                description: 'FAQ на pillar-странице. Идёт в FAQPage Schema для GEO.',
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  maxLength: 160,
                  admin: { description: 'Вопрос так, как формулирует клиент в Яндексе.' },
                },
                {
                  name: 'answer',
                  type: 'richText',
                  required: true,
                  admin: { description: 'Прямой ответ — без воды, 2-4 предложения.' },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Meta-теги, OG, JSON-LD override.',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              required: true,
              maxLength: 60,
              admin: { description: 'Title в SERP. Оптимум 50-60 символов с услугой и регионом.' },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              required: true,
              minLength: 140,
              maxLength: 160,
              admin: {
                description: 'Description в SERP. 140-160 символов с УТП и call-to-action.',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Картинка в шаринге (Telegram/VK/WA). 1200×630.' },
            },
            {
              name: 'schemaJsonLdOverride',
              type: 'json',
              admin: {
                description: 'JSON-LD override — только если автогенерируемая schema плохая.',
              },
            },
          ],
        },
        {
          // PANEL-SERVICES-PREVIEW-TAB · brand-guide §12.4 mockup line 3086.
          // Phase 1: tab-контейнер для card с primary-button «Открыть на сайте».
          // Phase 2 (отдельный US): inline iframe preview (требует ADR от tamd).
          label: 'Превью',
          description: 'Открыть страницу услуги на публичном сайте в новой вкладке.',
          fields: [
            {
              name: 'previewPanel',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/admin/ServicePreviewPanel',
                },
              },
            },
          ],
        },
      ],
    },
    // ─── SEO override поля (US-5 REQ-5.7) — в sidebar, вне tabs ───
    // Используются точечно когда автогенерируемые metaTitle/metaDescription
    // или canonical нуждаются в корректировке без изменения main-полей.
    // US-3: reviewedBy — E-E-A-T leverage для T2/T3 (sa-seo §контракт).
    {
      name: 'reviewedBy',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: false,
      admin: {
        position: 'sidebar',
        description:
          'Автор-эксперт, проверивший контент (E-E-A-T). Попадает в Article.author / reviewedBy для schema.org.',
      },
    },
    {
      name: 'canonicalOverride',
      type: 'text',
      admin: {
        position: 'sidebar',
        description:
          'URL canonical (override автогенерируемого). Редко — для cross-canonical или /lp/* страниц.',
      },
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
        { label: 'nosnippet', value: 'nosnippet' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Robots директивы. Default: index,follow. Снять index перед публикацией черновика — noindex.',
      },
    },
    {
      name: 'breadcrumbLabel',
      type: 'text',
      maxLength: 40,
      admin: {
        position: 'sidebar',
        description: 'Короткий label для breadcrumbs если H1 длинный. Опционально.',
      },
    },
    {
      // EPIC-SERVICE-PAGES-UX C4 — feature flag template_v2 per-URL.
      // Default false → sustained legacy rendering. Per-URL rollout через
      // Payload admin (specs/EPIC-SERVICE-PAGES-UX/c4-migration-plan.md).
      // Resolver: lib/master-template/getBlocksForLayer.ts.
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
    // Services коллекция содержит pillar-страницы (T2_PILLAR layer).
    // alsoCheckPayloadStatus=true — Services использует Payload drafts API
    // (`versions.drafts.autosave`), нет custom publishStatus поля.
    beforeValidate: [
      buildMasterTemplateGate({
        layerResolver: () => 'T2_PILLAR',
        alsoCheckPayloadStatus: true,
      }),
    ],
    afterChange: [
      async ({ doc }) => {
        const url = process.env.SITE_URL
        const secret = process.env.REVALIDATE_SECRET
        if (!url || !secret) return doc
        try {
          await fetch(`${url}/api/revalidate?tag=service-${doc.slug}`, {
            headers: { 'x-revalidate-secret': secret },
          })
          await fetch(`${url}/api/revalidate?tag=sitemap`, {
            headers: { 'x-revalidate-secret': secret },
          })
        } catch (e) {
          console.warn('[services.afterChange] revalidate failed:', e)
        }
        return doc
      },
    ],
  },
}
