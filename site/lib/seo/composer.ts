/**
 * JSON-LD страниц услуг: T1 хаб, T2 направление, T3 подуслуга, T4 услуга или подуслуга в районе.
 *
 * Organization и WebSite выводит макет сайта (app/(marketing)/layout.tsx) — один
 * раз на странице, с постоянными @id; здесь только узлы самой страницы со ссылкой на них
 * (`provider: { '@id': ORG_ID }`). Раньше они выводились второй раз (план 09, этап 7, пробел 1).
 *   T1_HUB    → ItemList, Breadcrumb
 *   T2_PILLAR → Service (+ рейтинг только если передан), FAQ, Breadcrumb
 *   T3_SUB    → Service подуслуги — её адрес, название и цена (пробел 2), FAQ, Breadcrumb
 *   T4_SD     → Service с areaServed района, FAQ, Breadcrumb, Person
 *
 * caller передаёт уже собранные данные — composer pure (без I/O).
 */

import {
  breadcrumbListSchema,
  faqPageSchema,
  personSchema,
  serviceSchema,
  serviceWithRatingSchema,
  t1HubItemListSchema,
  type Author,
  type District,
  type Service,
  type ServiceLite,
} from './jsonld'

export type TemplateKind = 'T1_HUB' | 'T2_PILLAR' | 'T3_SUB' | 'T4_SD'

export interface TemplateContext {
  pillars?: ServiceLite[]
  service?: Service
  sub?: Service
  district?: District
  faqs?: { question: string; answer: string }[]
  breadcrumbs?: { name: string; url: string }[]
  author?: Author
  rating?: { value: number; count: number; bestRating?: number }
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

  const tail = [
    ...(faqs.length > 0 ? [faqPageSchema(faqs)] : []),
    breadcrumbListSchema(breadcrumbs),
  ]

  switch (template) {
    case 'T1_HUB':
      return [t1HubItemListSchema(ctx.pillars ?? []), breadcrumbListSchema(breadcrumbs)]

    case 'T2_PILLAR':
      if (!ctx.service) return tail
      return [serviceWithRatingSchema(ctx.service, undefined, ctx.rating), ...tail]

    case 'T3_SUB':
      if (!ctx.service || !ctx.sub) return tail
      return [serviceSchema({ ...ctx.sub, slug: `${ctx.service.slug}/${ctx.sub.slug}` }), ...tail]

    case 'T4_SD': {
      if (!ctx.service || !ctx.district) return tail
      const nodes: Record<string, unknown>[] = [
        // подуслуга в районе — Service подуслуги: её адрес, название и цена
        serviceSchema(
          ctx.sub ? { ...ctx.sub, slug: `${ctx.service.slug}/${ctx.sub.slug}` } : ctx.service,
          ctx.district,
        ),
        ...tail,
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
