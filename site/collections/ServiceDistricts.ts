import type { CollectionConfig, CollectionBeforeValidateHook } from 'payload'
import { revalidateTag } from 'next/cache'
import { Hero } from '@/blocks/Hero'
import { TextContent } from '@/blocks/TextContent'
import { LeadForm } from '@/blocks/LeadForm'
import { CtaBanner } from '@/blocks/CtaBanner'
import { Faq } from '@/blocks/Faq'
// C2.6 (2026-05-10): re-add 6 SD blocks после CREATE TABLE migration
// `20260510_161708_sd_blocks_extension`. Закрывает sustained note из incident
// PR #209 / hotfix #210 — теперь schema sync применён proper migration runner,
// queries вида SELECT * FROM service_districts_blocks_breadcrumbs не падают.
//
// Calculator (slug=calculator-placeholder) НЕ добавлен — sustained Postgres
// 63-char enum limit (`enum_service_districts_blocks_calculator_placeholder_
// service_type` = 65 chars). Backlog: separate fix через Payload v3 enumName
// override field option.
import { Breadcrumbs } from '@/blocks/Breadcrumbs'
import { Tldr } from '@/blocks/Tldr'
import { PricingTable } from '@/blocks/PricingTable'
import { ProcessSteps } from '@/blocks/ProcessSteps'
import { NeighborDistricts } from '@/blocks/NeighborDistricts'
import { RelatedServices } from '@/blocks/RelatedServices'
import { buildPublishGate } from '@/lib/admin/publish-gate'
import { buildMasterTemplateGate } from '@/lib/admin/master-template-gate'
import { tfIdfUniqueness, lexicalToPlainText } from '@/lib/seo/uniqueness'

/**
 * ServiceDistricts-специфичный publish-gate (legacy-правила из R&D M1):
 *  — mini-case из района обязателен для publishStatus=published
 *  — минимум 2 локальных FAQ
 *
 * Запускается ДО общего buildPublishGate (sa.md §5.2 п.5).
 */
const requireGatesForPublish: CollectionBeforeValidateHook = async ({ data }) => {
  if (!data) return data
  if (data.publishStatus === 'published') {
    if (!data.miniCase) {
      throw new Error(
        'Нельзя публиковать programmatic без mini-кейса из района (Scaled Content Abuse risk).',
      )
    }
    if (!data.localFaq || data.localFaq.length < 2) {
      throw new Error('Минимум 2 локальных FAQ для публикации.')
    }
  }
  return data
}

/**
 * US-3 §контракт — TF-IDF uniqueness scoring против шаблонного ядра.
 *
 * Локальный текст SD (leadParagraph + localFaq + landmarks) сравниваем с
 * baseline корпусом — другие SD того же pillar с заполненным leadParagraph.
 * Получаем 0..100, пишем в `data.uniquenessScore` (read-only sidebar field).
 *
 * Запускается ВТОРЫМ в beforeValidate (после requireGatesForPublish и до
 * buildPublishGate), чтобы downstream-gates могли читать свежий score.
 *
 * Failure-mode: при ошибке payload.find или пустом локальном тексте — score=0,
 * не throw'аем (uniqueness — soft gate, не блокирует save для draft).
 */
const computeUniquenessScore: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  if (!data) return data
  const localTextParts: string[] = []
  // leadParagraph (richText / Lexical)
  if (data.leadParagraph) {
    const root = (data.leadParagraph as { root?: unknown }).root
    if (root) localTextParts.push(lexicalToPlainText(root))
  }
  // localFaq[]
  if (Array.isArray(data.localFaq)) {
    for (const f of data.localFaq) {
      if (f && typeof f === 'object') {
        const item = f as { question?: string; answer?: { root?: unknown } }
        if (item.question) localTextParts.push(item.question)
        if (item.answer?.root) localTextParts.push(lexicalToPlainText(item.answer.root))
      }
    }
  }
  // localLandmarks[]
  if (Array.isArray(data.localLandmarks)) {
    for (const l of data.localLandmarks) {
      if (l && typeof l === 'object') {
        const lm = (l as { landmarkName?: string }).landmarkName
        if (lm) localTextParts.push(lm)
      }
    }
  }
  if (data.localPriceNote) localTextParts.push(String(data.localPriceNote))

  const localText = localTextParts.join(' ').trim()
  if (!localText) {
    data.uniquenessScore = 0
    return data
  }

  // Загружаем baseline: до 50 других SD с заполненным leadParagraph.
  let baseline: string[] = []
  try {
    const currentId = (originalDoc as { id?: number | string } | null | undefined)?.id
    const others = await req.payload.find({
      collection: 'service-districts',
      limit: 50,
      depth: 0,
      pagination: false,
      where: currentId ? { id: { not_equals: currentId } } : {},
    })
    for (const doc of others.docs) {
      const d = doc as {
        leadParagraph?: { root?: unknown } | null
        localFaq?: { question?: string; answer?: { root?: unknown } | null }[] | null
      }
      const parts: string[] = []
      if (d.leadParagraph?.root) parts.push(lexicalToPlainText(d.leadParagraph.root))
      if (Array.isArray(d.localFaq)) {
        for (const f of d.localFaq) {
          if (f?.question) parts.push(f.question)
          if (f?.answer?.root) parts.push(lexicalToPlainText(f.answer.root))
        }
      }
      const txt = parts.join(' ').trim()
      if (txt) baseline.push(txt)
    }
  } catch (e) {
    console.warn('[service-districts.computeUniqueness] baseline load failed:', e)
    baseline = []
  }

  data.uniquenessScore = tfIdfUniqueness(localText, baseline)
  return data
}

export const ServiceDistricts: CollectionConfig = {
  slug: 'service-districts',
  labels: { singular: 'Услуга × район', plural: 'Услуги × районы' },
  admin: {
    useAsTitle: 'computedTitle',
    defaultColumns: ['computedTitle', 'publishStatus', 'uniquenessScore'],
    group: '02 · Контент',
    description: 'Programmatic-посадочные услуга × район. Без кейса — noindex.',
  },
  versions: { drafts: true },
  // US-3 Wave 0.1: композитный индекс для быстрых lookup'ов
  // (service, district, subServiceSlug). UNIQUE-семантика реализована
  // НЕ здесь — Payload `unique: true` не работает корректно с NULL в
  // Postgres (NULL != NULL → дубликаты pillar-level pairs). Вместо этого
  // используются партиальные unique indexes из migration
  // `20260502_120000_sd_subservice_extend`:
  //   • pillar-level (subServiceSlug IS NULL): UNIQUE(service, district)
  //   • sub-level    (subServiceSlug IS NOT NULL): UNIQUE(service, district, subServiceSlug)
  indexes: [{ fields: ['service', 'district', 'subServiceSlug'] }],
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Контент',
          description: 'Связь с каталогом, блоки страницы и локальные факты района.',
          fields: [
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'services',
              required: true,
              index: true,
              admin: {
                description:
                  'Какая услуга из каталога. Часть programmatic-связки «услуга × район».',
              },
            },
            {
              name: 'district',
              type: 'relationship',
              relationTo: 'districts',
              required: true,
              index: true,
              admin: {
                description: 'Какой район из каталога. Часть programmatic-связки «услуга × район».',
              },
            },
            {
              name: 'subServiceSlug',
              type: 'text',
              required: false,
              index: true,
              admin: {
                description:
                  'Sub-service slug для 4-уровневой иерархии URL `/<service>/<sub>/<district>/`. ' +
                  'Должен совпадать с одним из `services.subServices[].slug` parent-pillar. ' +
                  'Пусто — pillar-level SD `/<service>/<district>/` (sustained Stage 2 default).',
              },
            },
            {
              name: 'computedTitle',
              type: 'text',
              admin: {
                readOnly: true,
                description: 'Считается автоматически из услуги и района. Не редактируется.',
              },
            },
            {
              name: 'blocks',
              type: 'blocks',
              // Amendment 1 ADR-0021: T4_SD master-template — fillable
              // полный набор required + optional. TextContent остаётся для
              // backward-compat (legacy SD имеют text-content), но он
              // hidden на T4 в master-template — gate выкинет PRESENT_HIDDEN
              // если редактор добавит его на T4_SD при publish. Sustained
              // draft без публикации остаётся валидным.
              blockReferences: [
                Hero,
                Breadcrumbs,
                Tldr,
                TextContent,
                PricingTable,
                ProcessSteps,
                Faq,
                CtaBanner,
                NeighborDistricts,
                RelatedServices,
                LeadForm,
              ],
              blocks: [],
              admin: {
                initCollapsed: true,
                description:
                  'Соберите страницу из блоков master-template T4_SD: Hero, breadcrumbs, TL;DR, прайсинг, калькулятор, процесс, FAQ, CTA, соседние районы, форма. Для публикации нужен Hero, форма или CTA, mini-case relationship и ≥2 локальных FAQ.',
              },
            },
            {
              name: 'miniCase',
              type: 'relationship',
              relationTo: 'cases',
              admin: {
                description:
                  'Нужно для публикации. Без реального кейса из района страницу публиковать нельзя — Яндекс считает такую страницу шаблонной.',
              },
            },
            {
              name: 'localFaq',
              type: 'array',
              maxRows: 5,
              labels: { singular: 'Локальный FAQ', plural: 'Локальные FAQ' },
              admin: {
                description: 'Нужно для публикации. Минимум 2 локальных FAQ про конкретный район.',
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  maxLength: 160,
                  admin: { description: 'Вопрос как формулирует клиент. До 160 символов.' },
                },
                {
                  name: 'answer',
                  type: 'richText',
                  required: true,
                  admin: { description: 'Ответ с локальной спецификой района.' },
                },
              ],
            },
            {
              name: 'localLandmarks',
              type: 'array',
              maxRows: 6,
              admin: {
                description:
                  'Ориентиры района: микрорайоны, СНТ, шоссе. До 6 штук. Даёт уникальность.',
              },
              fields: [
                {
                  name: 'landmarkName',
                  type: 'text',
                  required: true,
                  admin: { description: 'Название ориентира. Например: «мкр. Кутузовский».' },
                },
              ],
            },
            {
              name: 'localPriceNote',
              type: 'textarea',
              maxLength: 400,
              admin: {
                description: 'Короткий комментарий по цене в этом районе. 1–2 абзаца. Опционально.',
              },
            },
            {
              name: 'leadParagraph',
              type: 'richText',
              required: true,
              admin: {
                description:
                  'Вводный абзац, 2–3 предложения, answer-first. Начинайте с конкретного факта о районе для GEO-выдачи.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Метаданные для поисковиков и шеринга. E-E-A-T и schema.org берутся отсюда.',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              maxLength: 65,
              admin: {
                description:
                  'Заголовок страницы в поиске. 55–60 символов. Пусто — собирается из computedTitle.',
              },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              maxLength: 155,
              admin: {
                description:
                  'Сниппет в поиске. 140–160 символов. Ключевой оффер + район + «фикс-цена».',
              },
            },
            {
              name: 'seoH1',
              type: 'text',
              admin: {
                description:
                  'H1-заголовок страницы. Пусто — берётся computedTitle «Услуга — Район».',
              },
            },
            {
              name: 'canonicalOverride',
              type: 'text',
              admin: {
                description: 'Канонический URL override. Обычно пусто — ставится автоматически.',
              },
            },
            {
              name: 'robots',
              type: 'select',
              defaultValue: 'index,follow',
              options: [
                { label: 'index, follow', value: 'index,follow' },
                { label: 'noindex, follow', value: 'noindex,follow' },
                { label: 'noindex, nofollow', value: 'noindex,nofollow' },
                { label: 'index, nofollow', value: 'index,nofollow' },
              ],
              admin: {
                description: 'Индексация страницы поисковиками. По умолчанию index,follow.',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Картинка для соцсетей при шеринге. 1200×630, до 500 КБ.',
              },
            },
            {
              name: 'lastReviewedAt',
              type: 'date',
              admin: {
                description:
                  'Когда страница последний раз проверена экспертом. Попадает в Article schema как dateModified.',
              },
            },
            {
              name: 'reviewedBy',
              type: 'relationship',
              relationTo: 'authors',
              admin: {
                description: 'Эксперт-автор. Попадает в Article.author для E-E-A-T.',
              },
            },
          ],
        },
        {
          label: 'Статус и реклама',
          description:
            'Управление публикацией, noindex-гейт и маркировка рекламных посадочных (ОРД).',
          fields: [
            {
              name: 'publishStatus',
              type: 'select',
              required: true,
              defaultValue: 'draft',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Review (SEO)', value: 'review' },
                { label: 'Published', value: 'published' },
                { label: 'Archived', value: 'archived' },
              ],
              admin: {
                description:
                  'Статус публикации. Published включает гейт: нужен Hero, 300 слов текста, форма или CTA.',
              },
            },
            {
              name: 'uniquenessScore',
              type: 'number',
              admin: {
                readOnly: true,
                description:
                  'Авто-метрика: доля уникального контента против шаблонного ядра. ≥ 60% — можно публиковать.',
              },
            },
            {
              name: 'noindexUntilCase',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description:
                  'Пока mini-case не прикреплён — страница рендерится с robots noindex. Защита от Scaled Content Abuse.',
              },
            },
            {
              name: 'isOrdMarked',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'ОРД-маркировка: посадочная используется в Яндекс.Директе. Требует ERID-токен.',
              },
            },
            {
              name: 'eridToken',
              type: 'text',
              admin: {
                description:
                  'ERID-токен от ОРД-оператора. Виден только при включённом isOrdMarked.',
                condition: (data) => Boolean(data?.isOrdMarked),
              },
            },
          ],
        },
      ],
    },
    {
      // EPIC-SERVICE-PAGES-UX C4 — feature flag template_v2 per-URL.
      // Default false → sustained legacy rendering. Per-URL rollout через
      // Payload admin (specs/EPIC-SERVICE-PAGES-UX/c4-migration-plan.md).
      // Resolver: lib/master-template/getBlocksForLayer.ts (T4_SD layer).
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
    beforeValidate: [
      requireGatesForPublish,
      computeUniquenessScore,
      buildPublishGate(),
      // EPIC-SERVICE-PAGES-UX C3 — master-template enforcement (ADR-0021).
      // SD = T4_SD layer (programmatic /uslugi/<svc>/<district>/). Гейт после
      // publishGate чтобы базовые правила (Hero / 300 слов / форма) проверялись
      // первыми — sustained UX для редакторов.
      buildMasterTemplateGate({ layerResolver: () => 'T4_SD' }),
    ],
    beforeChange: [
      async ({ data, req }) => {
        if (!data) return data
        try {
          const svc = await req.payload.findByID({
            collection: 'services',
            id: data.service,
          })
          const dst = await req.payload.findByID({
            collection: 'districts',
            id: data.district,
          })
          data.computedTitle = `${svc.title} — ${dst.nameNominative}`
        } catch (e) {
          console.warn('[service-districts.beforeChange] computedTitle skipped:', e)
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        // 1. Прямой in-process revalidateTag — работает без HTTP, без секретов,
        // в пределах того же Next.js процесса. Инвалидирует sitemap +
        // service-districts + конкретную пару sd-<svc>-<dst>.
        try {
          // Next 16: второй аргумент обязателен. 'max' = stale-while-revalidate.
          revalidateTag('sitemap', 'max')
          revalidateTag('service-districts', 'max')
        } catch (e) {
          console.warn('[service-districts.afterChange] revalidateTag failed:', e)
        }

        // 2. HTTP webhook на /api/revalidate — fire-and-forget с 5s timeout
        // (US-3 Wave 0.5 / sustained reference_payload_hooks_async_fire_and_forget).
        // Sync await тут вызывал pg pool starvation на bulk publish 100+ SD
        // (incident audit-payload-hooks Stage 2 W11). НЕ блокируем сохранение
        // документа на сетевые операции; ошибки логируем, не фейлим transaction.
        const url = process.env.SITE_URL
        const secret = process.env.REVALIDATE_SECRET
        if (url && secret) {
          setImmediate(() => {
            void Promise.race([
              (async () => {
                const svc = await req.payload.findByID({
                  collection: 'services',
                  id: doc.service,
                })
                const dst = await req.payload.findByID({
                  collection: 'districts',
                  id: doc.district,
                })
                const tag = `sd-${svc.slug}-${dst.slug}`
                revalidateTag(tag, 'max')
                await fetch(`${url}/api/revalidate?tag=${tag}`, {
                  headers: { 'x-revalidate-secret': secret },
                })
                await fetch(`${url}/api/revalidate?tag=sitemap`, {
                  headers: { 'x-revalidate-secret': secret },
                })
              })(),
              new Promise((_, reject) =>
                setTimeout(
                  () => reject(new Error('service-districts.afterChange timeout 5s')),
                  5000,
                ),
              ),
            ]).catch((e) => {
              console.warn('[service-districts.afterChange] fire-forget failed:', e)
            })
          })
        }
        return doc
      },
    ],
  },
}
