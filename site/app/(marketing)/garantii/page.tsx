import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbListSchema } from '@/lib/seo/jsonld'
import { canonicalFor } from '@/lib/seo/canonical'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Гарантии Обихода — фикс-цена и штрафы ГЖИ на нас',
  description:
    'Гарантии Обихода: фиксированная цена за объект (без доплат), страховка ГО до 10 млн ₽, штрафы ГЖИ и ОАТИ берём на себя по договору. Москва и МО.',
  alternates: { canonical: canonicalFor('/garantii/') },
}

export default function GuaranteesPage() {
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Гарантии', href: '/garantii/' },
  ]

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
        Гарантии Обихода
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-stone-700">
        Что мы гарантируем письменно — на каждом договоре и на каждой смете.
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">Фикс-цена за объект</h2>
      <p className="mt-4 text-stone-700">
        Цену называем после оценки фото за 10 минут — она не меняется на объекте. Никаких «нашли
        непредвиденные сложности» или «нужна дополнительная техника, доплатите». Если бригада
        ошиблась с оценкой — это наша проблема, не ваша.
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">Страховка ответственности</h2>
      <p className="mt-4 text-stone-700">
        Страховка гражданской ответственности до 10 млн ₽ — на каждую бригаду. Если что-то повредим
        (забор, теплицу, машину соседа) — оплачиваем восстановление по полису, не из вашего кармана.
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">Штрафы ГЖИ и ОАТИ — на нас</h2>
      <p className="mt-4 text-stone-700">
        Для УК и ТСЖ: <strong>штрафы Госжилинспекции и ОАТИ переходят на нас</strong> с момента
        подписания договора обслуживания. Если предписание выписано из-за нашей работы или{' '}
        бездействия — платит Обиход. Это не bonus и не маркетинг — это пункт договора.
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">
        Порубочный билет — за наш счёт
      </h2>
      <p className="mt-4 text-stone-700">
        Если для спила нужно разрешение администрации — оформляем сами и оплачиваем госпошлину. Без
        вашего участия в очередях и согласованиях.
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-stone-900">
        Чистая территория после работы
      </h2>
      <p className="mt-4 text-stone-700">
        Увозим все порубочные остатки, строймусор и упаковку. На объекте остаётся{' '}
        <strong>чище, чем было</strong> — это инвариант. Если оставили что-то — приедем и уберём
        бесплатно.
      </p>

      <CtaMessengers className="mt-12" />

      <JsonLd
        schema={[
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
        ]}
      />
    </article>
  )
}
