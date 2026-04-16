import Link from 'next/link'

const SERVICES = [
  {
    slug: 'arboristika',
    title: 'Арбористика',
    summary: 'Спил, кронирование, удаление пня, аварийный спил',
  },
  {
    slug: 'ochistka-krysh',
    title: 'Очистка крыш',
    summary: 'Снег, наледь, сосульки, абонентка для УК',
  },
  {
    slug: 'vyvoz-musora',
    title: 'Вывоз мусора',
    summary: 'Строительный, КГМ, ТКО, контейнеры 8/20/27 м³',
  },
  {
    slug: 'demontazh',
    title: 'Демонтаж',
    summary: 'Дом и дача под ключ, внутренний демонтаж',
  },
]

export default function Home() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <div className="mb-2 text-sm font-medium uppercase tracking-widest text-orange-700">
        ОБИХОД
      </div>
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
        Порядок под ключ.
        <br />
        Арбо, снег, мусор, демонтаж — по Москве и МО.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-700">
        Комплексный подрядчик 4-в-1 для частных домов, дач, УК и застройщиков.
        Фиксированная цена за объект, смета по фото за 10 минут в Telegram, MAX
        или WhatsApp. Лицензия Росприроднадзора, СРО, страховка ГО 10 млн ₽,
        порубочный билет за наш счёт.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <article
            key={s.slug}
            className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-stone-300 hover:shadow"
          >
            <h2 className="text-lg font-semibold text-stone-900">{s.title}</h2>
            <p className="mt-2 text-sm text-stone-600">{s.summary}</p>
            <Link
              href={`/${s.slug}/`}
              className="mt-4 inline-block text-sm font-medium text-orange-700 hover:text-orange-800"
            >
              Подробнее →
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        <Link
          href="/raiony/"
          className="group rounded-lg border border-stone-200 bg-white p-6 transition hover:border-orange-300"
        >
          <div className="text-sm font-medium text-orange-700">Районы</div>
          <div className="mt-1 text-lg font-semibold text-stone-900">
            Где работаем →
          </div>
          <p className="mt-2 text-sm text-stone-600">
            Москва и Московская область, 20+ районов первой волны: Раменское,
            Жуковский, Одинцово, Красногорск и другие.
          </p>
        </Link>
        <Link
          href="/b2b/"
          className="group rounded-lg border border-stone-200 bg-white p-6 transition hover:border-orange-300"
        >
          <div className="text-sm font-medium text-orange-700">B2B</div>
          <div className="mt-1 text-lg font-semibold text-stone-900">
            УК, ТСЖ, застройщики, госзаказ →
          </div>
          <p className="mt-2 text-sm text-stone-600">
            Абонентка зима/лето, штрафы ГЖИ берём на себя по договору, работаем
            по 44-ФЗ и 223-ФЗ.
          </p>
        </Link>
      </div>
    </section>
  )
}
