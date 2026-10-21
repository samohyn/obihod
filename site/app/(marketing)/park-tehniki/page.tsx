import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { trail } from '@/lib/breadcrumbs'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbListSchema, organizationSchema } from '@/lib/seo/jsonld'
import { getSiteChrome } from '@/lib/chrome'
import { getSeoSettings } from '@/lib/seo/queries'
import { canonicalFor } from '@/lib/seo/canonical'

import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

const LEGACY_METADATA: Metadata = {
  title: 'Парк техники Обиход — контейнеры, манипуляторы, спецтехника для МО',
  description:
    'Парк техники Обихода: контейнеры 8-27 м³, манипуляторы, мини-экскаваторы, автовышки, бензопилы и альпснаряжение. Свой автопарк — без перекупки в Москве и МО.',
  alternates: { canonical: canonicalFor('/park-tehniki/') },
  openGraph: {
    title: 'Парк техники Обиход',
    description: 'Контейнеры, манипуляторы, спецтехника, инструмент',
    url: `${SITE_URL}/park-tehniki/`,
    type: 'website',
  },
}

const techItems = [
  {
    title: 'Контейнеры 8-27 м³',
    text: 'Бункеры 8 / 12 / 20 / 27 м³ для строймусора, КГМ, садового мусора. Автомобиль-контейнеровоз с гидрокраном.',
  },
  {
    title: 'Манипуляторы',
    text: 'Грузоподъёмность до 7 т, вылет стрелы до 8 м. Снимаем спиленные части дерева, грузим строймусор, перевозим КГМ.',
  },
  {
    title: 'Мини-экскаваторы',
    text: 'Bobcat и аналоги для расчистки участка, демонтажа фундаментов, перемещения грунта на ограниченных площадках.',
  },
  {
    title: 'Автовышки',
    text: 'Высота подъёма 18-28 м. Используем для арбористики на высоте и для чистки крыш МКД.',
  },
  {
    title: 'Альпснаряжение и пилы',
    text: 'Профессиональные бензопилы Stihl/Husqvarna, альпснаряжение, страховочные системы, СИЗ. Полный комплект на каждую бригаду.',
  },
  {
    title: 'Контейнеры под раздельный сбор',
    text: 'Отдельные ёмкости под металлолом, древесину, бетон. Передача на лицензированные полигоны (ФККО) с актом.',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('park-tehniki')
  return page ? buildBlocksPageMetadata(page, '/park-tehniki/') : LEGACY_METADATA
}

export default async function ParkTehnikiPage() {
  // 0. Из блоков: документ «Страницы» park-tehniki
  const blocksPage = await getPage('park-tehniki')
  if (blocksPage) return <PageBlocksView page={blocksPage} crumbs={trail('parkTehniki')} />

  const [chrome, seo] = await Promise.all([getSiteChrome(), getSeoSettings()])

  const breadcrumbs = trail('parkTehniki')

  return (
    <>
      <Breadcrumbs items={breadcrumbs} schema={false} />
      <article className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
          Парк техники
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-stone-700">
          Свой автопарк и инструмент — без перекупки и посредников. Это значит: техника на объекте
          приезжает в согласованный день и не зависит от субподрядчика, который «забыл вывести
          манипулятор».
        </p>

        <ul className="mt-12 space-y-4 text-stone-700">
          {techItems.map((item, i) => (
            <li key={i}>
              <strong className="text-stone-900">{item.title}.</strong> {item.text}
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-2xl font-semibold text-stone-900">Аренда техники без бригады</h2>
        <p className="mt-4 text-stone-700">
          Если нужна только техника без бригады — смотрите{' '}
          <Link href="/arenda-tehniki/" className="text-orange-700 hover:underline">
            аренда техники
          </Link>
          . Контейнеры на день/неделю, манипуляторы по часам, автовышки по сменам.
        </p>

        <h2 className="mt-12 text-2xl font-semibold text-stone-900">Связанные страницы</h2>
        <p className="mt-4 text-stone-700">
          Команда — на странице{' '}
          <Link href="/komanda/" className="text-orange-700 hover:underline">
            команда Обихода
          </Link>
          . Допуски и СРО — на странице{' '}
          <Link href="/sro-licenzii/" className="text-orange-700 hover:underline">
            СРО и лицензии
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
    </>
  )
}
