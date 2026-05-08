/**
 * JSON-LD composer для T1/T2/T3/T4 шаблонов раздела `/uslugi/` (US-4).
 *
 * Вместо дублирования сборки массива schema на каждой странице — один
 * switch на `template`. Контракт schema-coverage:
 *   T1_HUB    → 4 узла (Org, WebSite, ItemList, Breadcrumb)
 *   T2_PILLAR → 5 узлов (Org, Service+Rating, FAQ, Breadcrumb, +1 опц.)
 *   T3_SUB    → 4 узла (Org, Service, FAQ, Breadcrumb)
 *   T4_SD     → 6 узлов (Org, LocalBusiness, Service, FAQ, Breadcrumb, Person)
 *
 * caller передаёт уже собранные данные — composer pure (без I/O).
 */

import type { SiteChrome } from '@/lib/chrome'

import {
  breadcrumbListSchema,
  faqPageSchema,
  localBusinessSchema,
  organizationSchema,
  personSchema,
  serviceSchema,
  serviceWithRatingSchema,
  t1HubItemListSchema,
  websiteSchema,
  type Author,
  type District,
  type Service,
  type ServiceLite,
  type SeoSettingsLike,
} from './jsonld'

export type TemplateKind = 'T1_HUB' | 'T2_PILLAR' | 'T3_SUB' | 'T4_SD'

export interface TemplateContext {
  chrome: SiteChrome | null
  seo?: SeoSettingsLike | null
  pillars?: ServiceLite[]
  service?: Service
  sub?: Service
  district?: District
  faqs?: { question: string; answer: string }[]
  breadcrumbs?: { name: string; url: string }[]
  author?: Author
  rating?: { value: number; count: number; bestRating?: number }
  /**
   * Если true — composer не повторяет Organization/WebSite/LocalBusiness
   * (они уже отрендерены на marketing layout). Default false (контракт AC),
   * но page-level вызовы передают `true` чтобы не дублировать.
   */
  skipChrome?: boolean
}

/**
 * Возвращает список schema-объектов для шаблона.
 * Передавать caller'у: <JsonLd schema={buildJsonLdForTemplate(...)} />
 *
 * Все schema-узлы — pure dicts из jsonld.ts. `null`-значения
 * фильтруются на выходе (личный schema PersonSchema опционален).
 */
export function buildJsonLdForTemplate(
  template: TemplateKind,
  ctx: TemplateContext,
): Record<string, unknown>[] {
  const breadcrumbs = ctx.breadcrumbs ?? []
  const faqs = ctx.faqs ?? []

  switch (template) {
    case 'T1_HUB':
      return [
        organizationSchema(ctx.chrome ?? null, ctx.seo ?? null),
        websiteSchema(),
        t1HubItemListSchema(ctx.pillars ?? []),
        breadcrumbListSchema(breadcrumbs),
      ]

    case 'T2_PILLAR':
      if (!ctx.service) return [organizationSchema(ctx.chrome ?? null, ctx.seo ?? null)]
      return [
        organizationSchema(ctx.chrome ?? null, ctx.seo ?? null),
        websiteSchema(),
        serviceWithRatingSchema(ctx.service, undefined, ctx.rating),
        ...(faqs.length > 0 ? [faqPageSchema(faqs)] : []),
        breadcrumbListSchema(breadcrumbs),
      ]

    case 'T3_SUB':
      if (!ctx.service || !ctx.sub) return [organizationSchema(ctx.chrome ?? null, ctx.seo ?? null)]
      return [
        organizationSchema(ctx.chrome ?? null, ctx.seo ?? null),
        // Service schema scoped на sub-name: parent priceFrom + sub.title
        {
          ...serviceSchema(ctx.service),
          serviceType: ctx.sub.title,
          name: ctx.sub.h1 ?? ctx.sub.title,
        },
        ...(faqs.length > 0 ? [faqPageSchema(faqs)] : []),
        breadcrumbListSchema(breadcrumbs),
      ]

    case 'T4_SD': {
      if (!ctx.service || !ctx.district)
        return [organizationSchema(ctx.chrome ?? null, ctx.seo ?? null)]
      const nodes: Record<string, unknown>[] = [
        organizationSchema(ctx.chrome ?? null, ctx.seo ?? null),
        localBusinessSchema(ctx.chrome ?? null, ctx.seo ?? null, ctx.district),
        serviceSchema(ctx.service, ctx.district),
        ...(faqs.length > 0 ? [faqPageSchema(faqs)] : []),
        breadcrumbListSchema(breadcrumbs),
      ]
      if (ctx.author) nodes.push(personSchema(ctx.author))
      return nodes
    }

    default: {
      // Exhaustive check
      const _exhaustive: never = template
      void _exhaustive
      return []
    }
  }
}
