import Link from 'next/link'
import type { Metadata } from 'next'

import { LeadForm } from '@/components/blocks/LeadForm'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbListSchema, howToSchema, speakableSchema } from '@/lib/seo/jsonld'
import { metadataBase } from '@/lib/seo/metadata'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'
const TELEGRAM_LINK = 'https://t.me/+79852294111'
const WA_LINK = 'https://wa.me/79852294111'

export const revalidate = 86400

const META_TITLE = 'Фото-смета за 10 минут — отправьте 3 фото | Обиход'
const META_DESCRIPTION =
  'Отправьте 2-3 фото объекта в Telegram, MAX или WhatsApp — оператор Обихода пришлёт точную смету за 10 минут с фиксированной ценой и сроком работ. Без выезда на оценку, без скрытых наценок.'

export const metadata: Metadata = {
  metadataBase,
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  alternates: {
    canonical: '/kalkulyator/foto-smeta/',
    languages: { 'ru-RU': '/kalkulyator/foto-smeta/' },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/kalkulyator/foto-smeta/',
    siteName: 'Обиход',
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: META_TITLE, description: META_DESCRIPTION },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
  },
}

const HOW_TO_STEPS = [
  {
    name: 'Сделайте 2-3 фото',
    text: 'Сфотографируйте объект с 2-3 ракурсов: общий план + крупный план проблемного места. Для деревьев — фото от ствола, ракурс снизу-вверх. Для крыш — фото с земли с обзором свеса. Для участка — общий план + точка проблемы.',
  },
  {
    name: 'Отправьте в любой мессенджер',
    text: 'Telegram, MAX, WhatsApp — на тот номер +7 (985) 229-41-11 (либо через форму на этой странице с загрузкой файлов). Оператор подтвердит получение в течение 1-2 минут.',
  },
  {
    name: 'Оператор оценит за 10 минут',
    text: 'Опытный мастер посмотрит фото и оценит объём, класс работ, нужна ли спецтехника, требуется ли порубочный билет. Сложные случаи могут потребовать выезд (бесплатно, в течение дня).',
  },
  {
    name: 'Получите точную смету',
    text: 'Фиксированная цена за объект (не «от ... до ...»). С указанием сроков, состава бригады, какие документы оформляем за наш счёт (порубочный билет / СРО-выписка / договор с штрафами ГЖИ).',
  },
]

export default function FotoSmetaPage() {
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Калькулятор', href: '/kalkulyator/' },
    { name: 'Фото-смета', href: '/kalkulyator/foto-smeta/' },
  ]

  const howTo = howToSchema({
    name: 'Как получить фото-смету за 10 минут',
    description:
      'Отправьте 2-3 фото объекта в любой мессенджер — оператор Обихода пришлёт точную смету с фиксированной ценой за 10 минут.',
    totalTime: 'PT10M',
    steps: HOW_TO_STEPS,
  })

  const speakable = speakableSchema(['.foto-smeta-page__hero h1', '.foto-smeta-page__hero p'])

  const webApp = {
    '@type': 'WebApplication',
    name: 'Фото-смета Обихода',
    description: META_DESCRIPTION,
    url: `${SITE_URL}/kalkulyator/foto-smeta/`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'RUB',
      description: 'Расчёт сметы по фото — бесплатно',
    },
    speakable,
  }

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbListSchema(
            breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
          ),
          howTo,
          webApp,
        ]}
      />
      <main className="foto-smeta-page container">
        <Breadcrumbs items={breadcrumbs} />
        <header className="foto-smeta-page__hero">
          <h1>Фото-смета за 10 минут</h1>
          <p>
            Отправьте 2-3 фото объекта в Telegram, MAX или WhatsApp — оператор пришлёт точную смету
            с фиксированной ценой за 10 минут. Без выезда на оценку, без скрытых наценок.
          </p>
          <p className="foto-smeta-page__cta-row">
            <a
              className="foto-smeta-page__primary"
              href={`${TELEGRAM_LINK}?text=${encodeURIComponent('Здравствуйте! Хочу фото-смету.')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Отправить в Telegram →
            </a>
            <a
              className="foto-smeta-page__secondary"
              href={`${WA_LINK}?text=${encodeURIComponent('Здравствуйте! Хочу фото-смету.')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <a className="foto-smeta-page__secondary" href="tel:+79852294111">
              Позвонить
            </a>
          </p>
        </header>

        <section className="foto-smeta-page__how">
          <h2>Как это работает — 4 шага</h2>
          <ol className="foto-smeta-page__steps">
            {HOW_TO_STEPS.map((step, i) => (
              <li key={i}>
                <h3>
                  {i + 1}. {step.name}
                </h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="foto-smeta-page__form">
          <h2>Или загрузите фото прямо здесь</h2>
          <LeadForm
            blockType="lead-form"
            h2="Фото-смета через форму"
            helper="Прикрепите 2-3 фото объекта и оставьте номер. Оператор подключится в Telegram/MAX/WhatsApp с расчётом."
            ctaLabel="Получить смету"
            successMessage="Спасибо! Смотрим фото — пришлём смету в течение 10 минут на ваш телефон."
            fields={[
              { name: 'name', label: 'Имя', type: 'text', required: false },
              {
                name: 'phone',
                label: 'Телефон',
                type: 'tel',
                required: true,
                inputmode: 'numeric',
              },
              {
                name: 'service',
                label: 'Что нужно сделать',
                type: 'text',
                required: false,
                placeholder: 'спил дерева, чистка крыши, вывоз мусора, демонтаж...',
              },
              {
                name: 'photos',
                label: 'Фото объекта (2-3 файла)',
                type: 'file',
                required: false,
                multiple: true,
                accept: 'image/*',
              },
            ]}
          />
          <p className="foto-smeta-page__hint">
            Не получается загрузить?{' '}
            <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer">
              Отправьте фото в Telegram
            </a>{' '}
            — это самый быстрый канал.
          </p>
        </section>

        <section className="foto-smeta-page__why">
          <h2>Почему это работает</h2>
          <ul>
            <li>
              <strong>Опытный оператор</strong> — мастер с 5+ годами в арбористике / клининге /
              демонтаже. Видит на фото, что именно нужно делать.
            </li>
            <li>
              <strong>Фиксированная цена за объект</strong> — не «от ... до ...». Если на месте
              окажется больше работы — наша проблема, не ваша.
            </li>
            <li>
              <strong>Документы за наш счёт</strong> — порубочный билет (если требуется),
              СРО-выписка (для B2B), штрафы ГЖИ/ОАТИ — на нашей стороне.
            </li>
            <li>
              <strong>СРО + страховка ГО 10 млн ₽</strong> — реестровый номер на странице{' '}
              <Link href="/sro-licenzii/">/sro-licenzii/</Link>.
            </li>
          </ul>
        </section>

        <section className="foto-smeta-page__cta-bottom">
          <h2>Не подходит фото-смета?</h2>
          <p>
            Бывает, нужен выезд для замеров (например — расчистка большого участка с поросли). В
            этом случае мастер выезжает <strong>бесплатно</strong> в течение дня.{' '}
            <Link href="/kontakty/?utm_source=lead-infra&utm_medium=foto-smeta">
              Свяжитесь по телефону или мессенджерам →
            </Link>
          </p>
        </section>
      </main>
    </>
  )
}
