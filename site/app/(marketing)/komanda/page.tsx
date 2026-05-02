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
  title: 'Команда Обиход — бригады арбористов, кровельщиков и операторов техники',
  description:
    'Команда Обихода: бригадиры, арбористы с допуском на высоту, кровельщики с СИЗ, операторы спецтехники. Реальные люди на реальных объектах в Москве и МО.',
  alternates: { canonical: canonicalFor('/komanda/') },
  openGraph: {
    title: 'Команда Обиход',
    description: 'Бригады, бригадиры и операторы спецтехники',
    url: `${SITE_URL}/komanda/`,
    type: 'website',
  },
}

export default async function KomandaPage() {
  const [chrome, seo] = await Promise.all([getSiteChrome(), getSeoSettings()])

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Команда', href: '/komanda/' },
  ]

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
        Команда Обихода
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-stone-700">
        На объект приезжает бригада, которая отвечает за результат под ключ. Не диспетчер, не
        посредник — старший бригадир принимает решения на месте, согласовывает изменения и
        подписывает акт. Это то, что отличает «порядок под ключ» от перекупки услуг.
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">Из кого состоит бригада</h2>
      <ul className="mt-4 space-y-3 text-stone-700">
        <li>
          <strong>Старший бригадир.</strong> 5+ лет на объектах. Согласует изменения сметы на месте,
          держит контакт с клиентом, отвечает за технику безопасности.
        </li>
        <li>
          <strong>Арбористы с допуском на высоту.</strong> Спил частями, кронирование, работа с
          альпснаряжением. Удостоверения и СИЗ — комплект на каждого.
        </li>
        <li>
          <strong>Кровельщики.</strong> Чистка снега, наледи, сосулек на МКД и частных домах.
          Страховочные системы, стопперы, обвязка.
        </li>
        <li>
          <strong>Операторы спецтехники.</strong> Контейнеровозы 8-27 м³, манипуляторы,
          мини-экскаваторы для расчистки и демонтажа.
        </li>
        <li>
          <strong>Грузчики и подсобники.</strong> Ручной демонтаж, сортировка строймусора, погрузка
          КГМ.
        </li>
      </ul>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">Как мы решаем «нештатное»</h2>
      <p className="mt-4 text-stone-700">
        На сложных объектах — авария, осложнённый спил, договор на сезон с УК — на выезд
        отправляется бригадир с расширенным допуском. Согласование решений идёт через мессенджер с
        фото в реальном времени. Если объём вырос против сметы — это видно в чате до подписания
        акта.
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">Документы и допуски</h2>
      <p className="mt-4 text-stone-700">
        Все допуски, СРО и страхование — на странице{' '}
        <Link href="/sro-licenzii/" className="text-orange-700 hover:underline">
          СРО и лицензии
        </Link>
        . Парк техники и оборудования — на странице{' '}
        <Link href="/park-tehniki/" className="text-orange-700 hover:underline">
          парк техники
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
