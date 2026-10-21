import Link from 'next/link'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { trail } from '@/lib/breadcrumbs'
import { getAllDistricts } from '@/lib/seo/queries'
import { DistrictGrid } from '@/components/blocks/v3/DistrictGrid'
import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { retone } from '@/lib/blocks/v3/retone'
import { getContacts } from '@/lib/chrome'
import { faqPageSchema } from '@/lib/seo/jsonld'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { getPage } from '@/lib/pages'

export const revalidate = 86400

const LEGACY_METADATA: Metadata = {
  title: 'Районы Москвы и МО, где работает Обиход',
  description:
    'География работы Обихода: 20+ районов Москвы и Московской области. Спил, снег, мусор, демонтаж в каждом районе по фикс-цене.',
  alternates: { canonical: '/raiony/' },
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('raiony')
  return page ? buildBlocksPageMetadata(page, '/raiony/') : LEGACY_METADATA
}

export default async function DistrictsHub() {
  const districts = await getAllDistricts()

  // 0. Из блоков: документ «Страницы» raiony, список районов — под первым экраном
  const page = await getPage('raiony')
  if (page) {
    const contacts = await getContacts()
    const [hero, ...rest] = page.blocks
    const items = (
      districts as unknown as { slug: string; nameNominative: string; distanceFromMkad?: number }[]
    )
      .map((d) => ({ slug: d.slug, name: d.nameNominative, km: d.distanceFromMkad ?? null }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
    const faqs = rest.flatMap((b) => (b.blockType === 'faq-v3' ? b.items : []))
    return (
      <>
        {faqs.length > 0 && <JsonLd schema={faqPageSchema(faqs)} />}
        <Breadcrumbs items={trail('raiony')} />
        <V3BlockRenderer blocks={[hero]} phoneDisplay={contacts.phoneDisplay} />
        <DistrictGrid eyebrow="Районы" title="Выберите свой район" items={items} tone="alt" />
        <V3BlockRenderer blocks={retone(rest)} phoneDisplay={contacts.phoneDisplay} />
      </>
    )
  }

  const grouped: Record<string, any[]> = { A: [], B: [], C: [] }
  for (const d of districts) {
    const key = (d as any).priority ?? 'B'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(d)
  }

  const breadcrumbs = trail('raiony')

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
          Районы, где работает Обиход
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-stone-700">
          Москва и Московская область — 20+ районов. По каждому: спил, снег, мусор, демонтаж по
          фикс-цене.
        </p>

        {(['A', 'B', 'C'] as const).map(
          (priority) =>
            grouped[priority].length > 0 && (
              <div key={priority} className="mt-10">
                <h2 className="text-xl font-semibold text-stone-900">
                  {priority === 'A' && 'Первая волна (приоритет A)'}
                  {priority === 'B' && 'Расширение (приоритет B)'}
                  {priority === 'C' && 'Удалёнка (приоритет C)'}
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[priority].map((d: any) => (
                    <li key={d.slug}>
                      <Link
                        href={`/raiony/${d.slug}/`}
                        className="block rounded-lg border border-stone-200 bg-white p-4 hover:border-orange-300"
                      >
                        <div className="font-medium text-stone-900">{d.nameNominative}</div>
                        <div className="mt-1 text-xs text-stone-500">
                          {d.distanceFromMkad} км от МКАД · {d.coverageRadius} км покрытие
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ),
        )}
      </section>
    </>
  )
}
