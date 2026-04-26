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
  title: 'О компании Обиход — комплексный подрядчик для Москвы и МО',
  description:
    'Обиход — комплексный подрядчик 4-в-1 для Москвы и Московской области. Спил, чистка крыш, вывоз мусора, демонтаж. Фикс-цена за объект, смета за 10 минут по фото.',
  alternates: { canonical: canonicalFor('/o-kompanii/') },
  openGraph: {
    title: 'О компании Обиход',
    description: 'Комплексный подрядчик 4-в-1 — порядок под ключ',
    url: `${SITE_URL}/o-kompanii/`,
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/og?title=${encodeURIComponent('О компании Обиход')}&subtitle=${encodeURIComponent('Порядок под ключ')}`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default async function AboutPage() {
  const [chrome, seo] = await Promise.all([getSiteChrome(), getSeoSettings()])

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'О компании', href: '/o-kompanii/' },
  ]

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
        О компании Обиход
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-stone-700">
        Обиход — комплексный подрядчик 4-в-1 для Москвы и Московской области. Делаем то, что нужно
        для порядка на участке: арбористика, чистка крыш от снега, вывоз мусора, демонтаж построек.
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">Что мы умеем</h2>
      <ul className="mt-4 space-y-3 text-stone-700">
        <li>
          <strong>Арбористика</strong> — спил аварийных и здоровых деревьев частями и целиком,{' '}
          кронирование, удаление пней, расчистка участка под стройку.
        </li>
        <li>
          <strong>Чистка крыш</strong> — снег, наледь, сосульки, водостоки. Договор на сезон с УК и
          ТСЖ.
        </li>
        <li>
          <strong>Вывоз мусора</strong> — стройматериалы, старая мебель, КГМ, садовый, контейнеры от
          8 м³.
        </li>
        <li>
          <strong>Демонтаж</strong> — дачи, бани, сараи, гаражи, заборы. С вывозом и расчисткой.
        </li>
      </ul>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">Как работаем</h2>
      <ol className="mt-4 space-y-3 text-stone-700">
        <li>
          <strong>1. Фото объекта.</strong> Присылаете 3 фото в Telegram, MAX или WhatsApp.
        </li>
        <li>
          <strong>2. Смета за 10 минут.</strong> Фикс-цена за объект — без скрытых наценок.
        </li>
        <li>
          <strong>3. Бригада на объекте.</strong> Приезжаем в согласованный день, делаем работу под
          ключ.
        </li>
        <li>
          <strong>4. Уборка территории.</strong> Увозим всё, оставляем порядок.
        </li>
      </ol>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">B2B — для УК и ТСЖ</h2>
      <p className="mt-4 text-stone-700">
        Договор на сезон или годовое обслуживание.{' '}
        <strong>Штрафы ГЖИ и ОАТИ берём на себя по договору.</strong> FM-операторам, застройщикам,
        госзаказу — отдельные условия. Подробнее на странице{' '}
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
