/**
 * T1 hub `/uslugi/` — entry-point для всего раздела услуг.
 * Source HTML: `archive/newui/uslugi-hub.html` (US-2 deliverable).
 *
 * Рендерит:
 *   - 5 pillar grid (динамически из getAllPillarsForPricing)
 *   - Why-us bar
 *   - Photo→смета CTA repeat
 *
 * JSON-LD: T1_HUB через composer — добавляет ItemList + Breadcrumb.
 * Org/WebSite/LocalBusiness рендерятся в layout.tsx — не дублируем.
 */
import Link from 'next/link'
import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/JsonLd'
import { buildJsonLdForTemplate } from '@/lib/seo/composer'
import { metadataBase } from '@/lib/seo/metadata'
import { getAllPillarsForPricing } from '@/lib/seo/queries'
import { getContacts, getSiteChrome } from '@/lib/chrome'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 3600

const META_TITLE = 'Услуги — Обиход · вывоз мусора, арбористика, демонтаж, чистка крыш'
const META_DESCRIPTION =
  'Услуги «Обихода» для дома, дачи и B2B в Москве и МО: вывоз мусора, арбористика, демонтаж, чистка крыш, уборка территории. Фикс-цена в договоре, выезд за 2 часа.'

export const metadata: Metadata = {
  metadataBase,
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  alternates: {
    canonical: '/uslugi/',
    languages: { 'ru-RU': '/uslugi/' },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/uslugi/',
    siteName: 'Обиход',
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: META_TITLE, description: META_DESCRIPTION },
  robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
}

const PILLAR_DESC: Record<string, string> = {
  'vyvoz-musora':
    'Контейнеры 7 / 20 / 30 м³, бытовой и строительный, КГМ. Полигон с актом, без штрафов ОАТИ.',
  arboristika:
    'Спил, валка, кронирование, корчевание пней. Альпинистами 3 разряда, со страховкой 5 млн ₽.',
  demontazh:
    'Бани, сараи, заборы, ветхие дома. С вывозом отходов одной бригадой и закрытием участка.',
  'chistka-krysh':
    'Промальп со страховкой и допусками. Снег, наледь, сосульки, водостоки — без повреждений кровли.',
  'uborka-territorii':
    'Покос травы, сбор листвы, мусора. Регулярные контракты для УК, ТСЖ и FM-компаний.',
}

export default async function UslugiHubPage() {
  const [pillars, chrome, contacts] = await Promise.all([
    getAllPillarsForPricing(),
    getSiteChrome(),
    getContacts(),
  ])

  const breadcrumbs = [
    { name: 'Главная', url: `${SITE_URL}/` },
    { name: 'Услуги', url: `${SITE_URL}/uslugi/` },
  ]

  const schema = buildJsonLdForTemplate('T1_HUB', {
    chrome,
    pillars: pillars.map((p) => ({ slug: p.slug, title: p.title, priceFrom: p.priceFrom })),
    breadcrumbs,
  })

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/uslugi-t1.css" />
      <JsonLd schema={schema} />

      {/* Breadcrumbs */}
      <nav className="t1-crumbs" aria-label="Хлебные крошки">
        <div className="wrap">
          <ol>
            <li>
              <Link href="/">Главная</Link>
            </li>
            <li aria-current="page">Услуги</li>
          </ol>
        </div>
      </nav>

      {/* §01 · HERO */}
      <section className="hp-section t1-hero">
        <div className="wrap">
          <div className="eyebrow">§ 01 · Услуги · Москва и МО</div>
          <h1>Услуги для дома, дачи и B2B</h1>
          <p className="lead">
            Пять направлений «порядка под ключ»: вывозим мусор, спиливаем деревья, демонтируем
            постройки, чистим крыши от снега и убираем территорию. Договор с актами, выезд за 2 часа
            по МО.
          </p>
          <div className="ctas">
            <Link className="btn btn-primary" href="/kalkulyator/foto-smeta/">
              Загрузите фото — получите смету
            </Link>
            <a className="btn btn-secondary" href={`tel:${contacts.phoneE164}`}>
              {contacts.phoneDisplay}
            </a>
          </div>
          <p className="meta">
            Ответ диспетчера &lt; 15 минут · смета фиксируется на 14 дней · работаем 24/7 на аварии
          </p>
        </div>
      </section>

      {/* §02 · 5 PILLAR CARDS */}
      <section className="hp-section alt" aria-labelledby="t1-pillars-title">
        <div className="wrap">
          <div className="eyebrow">§ 02 · Направления</div>
          <h2 id="t1-pillars-title" style={{ maxWidth: '22ch' }}>
            Пять направлений работ — выберите, что нужно сейчас
          </h2>
          <div className="t1-pillars">
            {pillars.map((p) => (
              <article key={p.slug} className="t1-pillar">
                <div className="t1-pillar-head">
                  <h2>{p.title}</h2>
                </div>
                <p className="t1-pillar-desc">{PILLAR_DESC[p.slug] ?? ''}</p>
                {p.priceFrom ? (
                  <span className="t1-pillar-price">
                    <span className="from">от</span> {p.priceFrom.toLocaleString('ru-RU')} ₽
                  </span>
                ) : null}
                {p.subServices.length > 0 ? (
                  <ul className="t1-pillar-subs">
                    {p.subServices.slice(0, 6).map((sub) => (
                      <li key={sub.slug}>
                        <Link href={`/${p.slug}/${sub.slug}/`}>{sub.title}</Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <Link href={`/${p.slug}/`} className="t1-pillar-cta">
                  Подробнее <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
            {pillars.length === 0 ? (
              <p>Идёт обновление каталога услуг. Свяжитесь с нами для актуального расчёта.</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* §03 · WHY US BAR */}
      <section className="hp-section" aria-labelledby="t1-why-title">
        <div className="wrap">
          <div className="eyebrow">§ 03 · Почему «Обиход»</div>
          <h2 id="t1-why-title" style={{ maxWidth: '24ch' }}>
            Что входит в каждый договор — без звёздочек
          </h2>
          <div className="t1-why">
            <div className="t1-why-card">
              <h3>Договор с актами</h3>
              <p>
                Смета, договор, акт КС-2/КС-3, ЭДО для B2B. Фикс-цена без «доплат за
                непредвиденное».
              </p>
            </div>
            <div className="t1-why-card">
              <h3>24/7 на аварии</h3>
              <p>
                Дерево упало на крышу, прорвало кровлю снегом, аварийный демонтаж — выезжаем за 2
                часа по МО без надбавок.
              </p>
            </div>
            <div className="t1-why-card">
              <h3>7+ лет опыта</h3>
              <p>
                С 2020 года — 1 200+ объектов в Москве и МО, штатная бригада, своя техника,
                страховка ответственности 5 млн ₽.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* §04 · PHOTO → СМЕТА CTA */}
      <section className="hp-section" aria-labelledby="t1-cta-title">
        <div className="wrap">
          <div className="eyebrow">§ 04 · Получить смету</div>
          <div className="t1-cta-repeat">
            <div className="t1-cta-text">
              <h2 id="t1-cta-title">Сфотографируйте объект — посчитаем за 10 минут</h2>
              <p>
                Не нужно знать диаметр дерева, объём кучи или площадь крыши. Загрузите фото —
                диспетчер пришлёт ориентир в WhatsApp или Telegram. Цена фиксируется на 14 дней.
              </p>
              <div className="t1-cta-actions">
                <Link className="btn btn-primary" href="/kalkulyator/foto-smeta/">
                  Загрузить фото
                </Link>
                <a className="btn btn-secondary" href={`tel:${contacts.phoneE164}`}>
                  Позвонить
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
