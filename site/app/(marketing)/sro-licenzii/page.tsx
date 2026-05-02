import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbListSchema, organizationSchema } from '@/lib/seo/jsonld'
import { getSiteChrome } from '@/lib/chrome'
import { getSeoSettings } from '@/lib/seo/queries'
import { canonicalFor } from '@/lib/seo/canonical'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'СРО и лицензии Обиход — официальные допуски и реестры',
  description:
    'Допуск СРО, лицензии Обихода для арбористики, чистки крыш, вывоза мусора и демонтажа в Москве и МО. Реестровые номера, страхование ответственности, договор на сезон с УК и ТСЖ.',
  alternates: { canonical: canonicalFor('/sro-licenzii/') },
  openGraph: {
    title: 'СРО и лицензии Обиход',
    description: 'Официальные допуски и реестровые номера',
    url: `${SITE_URL}/sro-licenzii/`,
    type: 'website',
  },
}

export default async function SroLicenziiPage() {
  const [chrome, seo] = await Promise.all([getSiteChrome(), getSeoSettings()])

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'СРО и лицензии', href: '/sro-licenzii/' },
  ]

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
        СРО и лицензии
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-stone-700">
        Обиход работает по договору с реестровыми допусками СРО и страхованием ответственности. Это
        значит: ответственность за объект и риски — на нас, штрафы ГЖИ и ОАТИ берём по договору, акт
        сдачи подписывают обе стороны.
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">Допуски и страхование</h2>
      <ul className="mt-4 space-y-3 text-stone-700">
        <li>
          <strong>СРО на демонтаж и подготовку площадки</strong> — допуск к работам по сносу
          построек до 3 этажей и расчистке территории.
        </li>
        <li>
          <strong>Страхование гражданской ответственности</strong> — покрытие при работах на высоте,
          при спиле деревьев и при вывозе.
        </li>
        <li>
          <strong>Лицензия на обращение с отходами IV-V класса</strong> — вывоз КГМ, садового
          мусора, строймусора с передачей на лицензированные полигоны (ФККО).
        </li>
        <li>
          <strong>Внутренние удостоверения бригад</strong> — арбористы с допуском на работу на
          высоте, кровельщики с СИЗ, операторы спецтехники.
        </li>
      </ul>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">Реестровые номера</h2>
      <p className="mt-4 text-stone-700">
        Реестровые номера и сканы допусков высылаем по запросу при заключении договора (B2B и B2C).
        Для УК / ТСЖ / FM / госзаказа — комплект документов в стандартной форме до подписания
        договора на сезон.
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">B2B-договор и штрафы</h2>
      <p className="mt-4 text-stone-700">
        Для УК и ТСЖ — договор на сезон или годовое обслуживание.{' '}
        <strong>Штрафы ГЖИ и ОАТИ берём на себя по договору.</strong> Подробнее на странице{' '}
        <Link href="/b2b/" className="text-orange-700 hover:underline">
          для бизнеса
        </Link>
        .
      </p>

      <CtaMessengers className="mt-12" />

      <JsonLd
        schema={[
          organizationSchema(chrome, seo),
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
        ]}
      />
    </article>
  )
}
