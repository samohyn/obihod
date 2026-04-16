import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { payloadClient } from '@/lib/payload'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Кейсы Обихода — реальные объекты Москвы и МО',
  description:
    'Видео и фото-кейсы Обихода: спил, чистка крыш, вывоз мусора, демонтаж. Реальные объекты по районам с ценой, бригадиром и сроком.',
  alternates: { canonical: '/kejsy/' },
}

const getCases = unstable_cache(
  async () => {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'cases',
      limit: 50,
      sort: '-dateCompleted',
      depth: 2,
    })
    return r.docs
  },
  ['cases-list'],
  { revalidate: 86400, tags: ['cases'] },
)

export default async function CasesIndex() {
  const cases = await getCases()
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <Breadcrumbs
        items={[
          { name: 'Главная', href: '/' },
          { name: 'Кейсы', href: '/kejsy/' },
        ]}
      />
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
        Кейсы Обихода
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-700">
        Реальные объекты по Москве и Московской области. Каждый кейс — фото
        до/после, бригадир, цена за объект.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {cases.map((c: any) => {
          const before = c.photosBefore?.[0]
          const url =
            typeof before?.image === 'object' ? before.image.url : null
          return (
            <Link
              key={c.id}
              href={`/kejsy/${c.slug}/`}
              className="group overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:border-orange-300"
            >
              {url && (
                <div className="relative aspect-[3/2]">
                  <Image
                    src={url}
                    alt={(before.image as any).alt ?? ''}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-stone-900">{c.title}</h2>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-600">
                  {c.district?.nameNominative && (
                    <span>📍 {c.district.nameNominative}</span>
                  )}
                  {c.dateCompleted && (
                    <span>
                      🗓{' '}
                      {new Date(c.dateCompleted).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  )}
                  {c.finalPrice && (
                    <span className="font-medium text-stone-800">
                      💰 {c.finalPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
        {cases.length === 0 && (
          <div className="col-span-2 rounded-lg border border-dashed border-stone-300 p-8 text-center text-stone-500">
            Пока нет опубликованных кейсов.
          </div>
        )}
      </div>
    </section>
  )
}
