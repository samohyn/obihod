import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getAllSubServiceParams, getServiceBySlug, getSubServiceBySlug } from '@/lib/seo/queries'
import { canonicalFor } from '@/lib/seo/canonical'
import { SubServiceView } from './SubServiceView'

export const revalidate = 43200
export const dynamicParams = false

export async function generateStaticParams() {
  const subs = await getAllSubServiceParams()
  return subs.map((s) => ({ service: s.service, district: s.sub }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; district: string }>
}): Promise<Metadata> {
  const { service: serviceSlug, district: subSlug } = await params

  const subResult = await getSubServiceBySlug(serviceSlug, subSlug)
  if (!subResult) return {}

  const { service, sub } = subResult as unknown as {
    service: { slug: string; metaDescription?: string }
    sub: {
      slug: string
      title: string
      h1: string
      intro?: string | null
      body?: unknown
      metaTitle?: string | null
      metaDescription?: string | null
    }
  }
  if (!sub.intro && !sub.body) return {}

  return {
    title: { absolute: sub.metaTitle ?? sub.h1 },
    description: sub.metaDescription ?? sub.intro ?? service.metaDescription,
    alternates: { canonical: canonicalFor(`/${service.slug}/${sub.slug}/`) },
    openGraph: {
      type: 'article',
      locale: 'ru_RU',
      url: `/${service.slug}/${sub.slug}/`,
      title: sub.h1,
      description: sub.intro ?? sub.metaDescription ?? undefined,
    },
    robots: { index: true, follow: true },
  }
}

export default async function SubServicePage({
  params,
}: {
  params: Promise<{ service: string; district: string }>
}) {
  const { service: serviceSlug, district: subSlug } = await params

  const [subResult, service] = await Promise.all([
    getSubServiceBySlug(serviceSlug, subSlug),
    getServiceBySlug(serviceSlug),
  ])

  if (!subResult || !service) notFound()

  const { sub } = subResult as { service: any; sub: any }
  if (!sub.intro && !sub.body) notFound()

  return <SubServiceView service={service as any} sub={sub} />
}
