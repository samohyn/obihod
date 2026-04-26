import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbListSchema } from '@/lib/seo/jsonld'
import { canonicalFor } from '@/lib/seo/canonical'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Как мы работаем — фото → смета → бригада → закрытие',
  description:
    'Цикл работы Обихода: 3 фото в Telegram/MAX/WhatsApp → смета за 10 минут → бригада в день заявки → акт и оплата по факту. Москва и МО, без авансов.',
  alternates: { canonical: canonicalFor('/kak-my-rabotaem/') },
}

const STEPS = [
  {
    n: 1,
    title: 'Присылаете 3 фото',
    text: 'Telegram, MAX или WhatsApp на номер +7 (985) 170-51-11. Подходят фото с телефона — ракурс целиком и крупно сложного места. Чем больше деталей, тем точнее смета.',
  },
  {
    n: 2,
    title: 'Смета за 10 минут',
    text: 'Бригадир оценивает по фото с поправкой на район и сезон. Озвучиваем фикс-цену за объект — она не меняется на месте. Если работа нестандартная и не получается оценить дистанционно, выезжаем на оценку бесплатно в день заявки.',
  },
  {
    n: 3,
    title: 'Согласуем день и время',
    text: 'Приоритетные районы (Одинцово, Красногорск, Мытищи, Химки, Раменское) — выезд в день заявки или утром следующего. Аварийные ситуации (упавшее дерево, протечка от снега) — выезд за 1–2 часа.',
  },
  {
    n: 4,
    title: 'Бригада на объекте',
    text: 'Спил, чистка, вывоз — делаем под ключ. Все порубочные остатки, мусор и упаковку забираем с собой. На объекте остаётся чище, чем было.',
  },
  {
    n: 5,
    title: 'Акт и оплата по факту',
    text: 'Без авансов и предоплаты для частных клиентов до 50 000 ₽. Оплата — наличными бригадиру, переводом на счёт или картой через СБП. Для УК и ТСЖ — оплата по факту акта в течение договора, до 30 дней.',
  },
]

export default function HowWeWorkPage() {
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Как мы работаем', href: '/kak-my-rabotaem/' },
  ]

  const howToSchema = {
    '@type': 'HowTo',
    name: 'Как заказать работу у Обихода',
    description:
      'Последовательность шагов от фото до закрытия объекта — для частного дома, дачи, УК или ТСЖ.',
    step: STEPS.map((s) => ({
      '@type': 'HowToStep',
      position: s.n,
      name: s.title,
      text: s.text,
    })),
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
        Как мы работаем
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-stone-700">
        Цикл от фото до акта — пять шагов. Без авансов, без скрытых наценок, без выезда «на оценку»
        с переоценкой по факту работы.
      </p>

      <ol className="mt-12 space-y-8">
        {STEPS.map((s) => (
          <li key={s.n} className="border-l-2 border-orange-300 pl-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                {s.n}
              </span>
              <h2 className="text-xl font-semibold text-stone-900">{s.title}</h2>
            </div>
            <p className="mt-3 text-stone-700">{s.text}</p>
          </li>
        ))}
      </ol>

      <CtaMessengers className="mt-12" />

      <JsonLd
        schema={[
          howToSchema,
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
        ]}
      />
    </article>
  )
}
