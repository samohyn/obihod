import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { LicenseBadge } from '@/components/marketing/LicenseBadge'
import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'
import { buildPillarMetadata } from '@/lib/seo/metadata'
import { breadcrumbListSchema, faqPageSchema, serviceSchema } from '@/lib/seo/jsonld'
import { getAllServiceSlugs, getServiceBySlug } from '@/lib/seo/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400
// dynamicParams = true: разрешаем рендер любых service-slug на runtime.
// Если в БД появилась новая услуга после build — она доступна через ISR.
// Если slug несуществующий — getServiceBySlug вернёт null → notFound().
//
// Контекст OBI-16:
//   До PR #28: unstable_cache внутри getAllServiceSlugs возвращал [] на build →
//     все 4 pillar 404. Поправили cache-layer.
//   После PR #28 + публикации services: PILLAR_SLUGS fallback пред-rendered 4
//     страницы как 404, потому что Postgres на VPS недоступен с GH runner →
//     getServiceBySlug() в catch возвращал null → notFound() → 404 prerender.
//     revalidatePath не помогает: при regenerate тот же runner-side payload
//     init без БД → опять null → опять 404 в кэше.
//   Текущий фикс: возвращаем [] если БД недоступна. Все service-страницы
//     рендерятся on-demand на VPS (где БД доступна), кэшируются на 24ч,
//     revalidate работает штатно.
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs()
  // Если БД недоступна на build (типичный case на GH runner без VPN) —
  // возвращаем пусто, dynamicParams=true генерирует страницы on-demand.
  // Никогда не делаем fallback на захардкоженный список slugs — это
  // приводит к prerender 404 (см. историю выше).
  return slugs.map((service) => ({ service }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>
}): Promise<Metadata> {
  const { service } = await params
  const s = await getServiceBySlug(service)
  if (!s) return {}
  return buildPillarMetadata(s as any, s.metaTitle, s.metaDescription)
}

export default async function PillarPage({ params }: { params: Promise<{ service: string }> }) {
  const { service: serviceSlug } = await params
  const service = await getServiceBySlug(serviceSlug)
  if (!service) notFound()

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: service.title, href: `/${service.slug}/` },
  ]

  const richTextFaq = (service.faqGlobal ?? []).map((q: any) => ({
    question: q.question,
    answer: extractText(q.answer),
  }))

  return (
    <article>
      <section className="mx-auto max-w-5xl px-6 pt-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
          {service.h1}
        </h1>
        <RichTextRenderer
          data={service.intro}
          className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-700"
        />
        <CtaMessengers className="mt-8 max-w-2xl" />
      </section>

      <section className="mx-auto mt-12 max-w-5xl px-6">
        <h2 className="text-2xl font-semibold text-stone-900">Цены</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-100 text-left text-stone-700">
              <tr>
                <th className="px-4 py-3">Услуга</th>
                <th className="px-4 py-3">Цена от</th>
              </tr>
            </thead>
            <tbody>
              {(service.subServices ?? []).map((sub: any) => (
                <tr key={sub.slug} className="border-t border-stone-200">
                  <td className="px-4 py-3 text-stone-900">{sub.title}</td>
                  <td className="px-4 py-3 text-stone-700">
                    {sub.priceFrom?.toLocaleString('ru-RU')} ₽
                  </td>
                </tr>
              ))}
              {(!service.subServices || service.subServices.length === 0) && (
                <tr className="border-t border-stone-200">
                  <td className="px-4 py-3 text-stone-700" colSpan={2}>
                    От {service.priceFrom.toLocaleString('ru-RU')} ₽ до{' '}
                    {service.priceTo.toLocaleString('ru-RU')} ₽
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-5xl px-6">
        <LicenseBadge />
      </section>

      {service.faqGlobal && service.faqGlobal.length > 0 && (
        <section className="mx-auto mt-12 max-w-5xl px-6">
          <h2 className="text-2xl font-semibold text-stone-900">Частые вопросы</h2>
          <div className="mt-4 space-y-4">
            {service.faqGlobal.map((qa: any, i: number) => (
              <details key={i} className="rounded-lg border border-stone-200 bg-white p-4">
                <summary className="cursor-pointer font-medium text-stone-900">
                  {qa.question}
                </summary>
                <RichTextRenderer
                  data={qa.answer}
                  className="mt-3 text-sm leading-relaxed text-stone-700"
                />
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-12 mb-16 max-w-5xl px-6">
        <h2 className="text-2xl font-semibold text-stone-900">{service.h1} по районам</h2>
        <p className="mt-2 text-stone-700">Работаем во всех районах Москвы и Московской области.</p>
        <div className="mt-4">
          <Link
            href="/raiony/"
            className="text-sm font-medium text-orange-700 hover:text-orange-800"
          >
            Все районы →
          </Link>
        </div>
      </section>

      <JsonLd
        schema={[
          serviceSchema(service as any),
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
          ...(richTextFaq.length > 0 ? [faqPageSchema(richTextFaq)] : []),
        ]}
      />
    </article>
  )
}

/** Минимальный извлекатель текста из Lexical для FAQ schema. */
function extractText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join(' ')
  if (node.text) return node.text
  if (node.children) return extractText(node.children)
  if (node.root) return extractText(node.root)
  return ''
}
