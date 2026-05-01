import type { CollectionConfig, CollectionBeforeValidateHook } from 'payload'
import { revalidateTag } from 'next/cache'
import { Hero } from '@/blocks/Hero'
import { TextContent } from '@/blocks/TextContent'
import { LeadForm } from '@/blocks/LeadForm'
import { CtaBanner } from '@/blocks/CtaBanner'
import { Faq } from '@/blocks/Faq'
import { buildPublishGate } from '@/lib/admin/publish-gate'

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
  indexes: [{ fields: ['service', 'district'], unique: true }],
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
              blockReferences: [Hero, TextContent, LeadForm, CtaBanner, Faq],
              blocks: [],
              admin: {
                initCollapsed: true,
                description:
                  'Соберите страницу из блоков: Hero, текст, форма, FAQ, CTA. Для публикации нужен один Hero, текст от 300 слов и хотя бы одна форма или CTA.',
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
  ],
  hooks: {
    beforeValidate: [requireGatesForPublish, buildPublishGate()],
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

        // 2. HTTP webhook на /api/revalidate — нужен только если Payload
        // запускается отдельным процессом (не embedded в Next.js).
        // На текущем deploy embedded, но оставляем как defense-in-depth.
        const url = process.env.SITE_URL
        const secret = process.env.REVALIDATE_SECRET
        if (!url || !secret) return doc
        try {
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
        } catch (e) {
          console.warn('[service-districts.afterChange] revalidate webhook failed:', e)
        }
        return doc
      },
    ],
  },
}
