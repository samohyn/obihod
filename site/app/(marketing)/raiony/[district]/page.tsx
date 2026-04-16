import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { buildDistrictHubMetadata } from '@/lib/seo/metadata'
import {
  breadcrumbListSchema,
  localBusinessSchema,
} from '@/lib/seo/jsonld'
import { getAllDistricts, getDistrictBySlug } from '@/lib/seo/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

const ALL_SERVICES = [
  { slug: 'arboristika', title: 'Спил деревьев' },
  { slug: 'ochistka-krysh', title: 'Очистка крыш' },
  { slug: 'vyvoz-musora', title: 'Вывоз мусора' },
  { slug: 'demontazh', title: 'Демонтаж' },
]

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  const districts = await getAllDistricts()
  return districts.map((d: any) => ({ district: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ district: string }>
}): Promise<Metadata> {
  const { district: districtSlug } = await params
  const d = await getDistrictBySlug(districtSlug)
  if (!d) return {}
  return buildDistrictHubMetadata(d as any)
}

export default async function DistrictHub({
  params,
}: {
  params: Promise<{ district: string }>
}) {
  const { district: districtSlug } = await params
  const district = await getDistrictBySlug(districtSlug)
  if (!district) notFound()

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Районы', href: '/raiony/' },
    { name: district.nameNominative, href: `/raiony/${district.slug}/` },
  ]

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
        Обиход {district.namePrepositional}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-700">
        Спил, снег, мусор, демонтаж {district.namePrepositional} и Раменском ГО.
        Расстояние от МКАД — {district.distanceFromMkad} км. Покрытие — радиус{' '}
        {district.coverageRadius} км.
      </p>

      <CtaMessengers className="mt-8 max-w-2xl" />

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">
        Услуги {district.namePrepositional}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ALL_SERVICES.map((s) => (
          <Link
            key={s.slug}
            href={`/${s.slug}/${district.slug}/`}
            className="rounded-lg border border-stone-200 bg-white p-4 hover:border-orange-300"
          >
            <div className="font-medium text-stone-900">{s.title}</div>
            <div className="mt-1 text-xs text-stone-500">
              {s.title} {district.namePrepositional}
            </div>
          </Link>
        ))}
      </div>

      {(district as any).landmarks && (district as any).landmarks.length > 0 && (
        <>
          <h2 className="mt-12 text-2xl font-semibold text-stone-900">
            Где именно работаем
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {(district as any).landmarks.map((l: any, i: number) => (
              <li key={i} className="text-stone-700">
                · {l.name}{' '}
                <span className="text-xs text-stone-500">
                  ({labelLandmarkType(l.type)})
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {(district as any).neighborDistricts && (district as any).neighborDistricts.length > 0 && (
        <>
          <h2 className="mt-12 text-2xl font-semibold text-stone-900">
            Соседние районы
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(district as any).neighborDistricts.map((n: any) => {
              const slug = typeof n === 'object' ? n.slug : n
              const name = typeof n === 'object' ? n.nameNominative : n
              return (
                <Link
                  key={slug}
                  href={`/raiony/${slug}/`}
                  className="rounded-full border border-stone-300 px-4 py-1 text-sm text-stone-700 hover:border-orange-300"
                >
                  {name}
                </Link>
              )
            })}
          </div>
        </>
      )}

      <JsonLd
        schema={[
          localBusinessSchema(district as any),
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
        ]}
      />
    </section>
  )
}

function labelLandmarkType(t: string) {
  switch (t) {
    case 'kp':
      return 'КП'
    case 'mkr':
      return 'микрорайон'
    case 'snt':
      return 'СНТ'
    case 'object':
      return 'объект'
    default:
      return t
  }
}
