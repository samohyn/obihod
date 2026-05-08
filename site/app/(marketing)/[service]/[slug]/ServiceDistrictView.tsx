/**
 * T4 ServiceDistrict view — `/<pillar>/<city>/`.
 *
 * Source HTML: `newui/uslugi-service-district.html` (US-2).
 * Token-replace при render — service.title / district.namePrepositional /
 * адаптированная цена (priceFrom × (1 + adjustment/100)) / landmarks /
 * author E-E-A-T блок.
 *
 * JSON-LD: T4_SD через composer (Org + LocalBusiness + Service + FAQ +
 * Breadcrumb + Person). Org/WebSite/LocalBusiness уже на layout — composer
 * получает `skipChrome: true` и добавляет только page-level узлы.
 */
import Link from 'next/link'

import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { CtaMessengers } from '@/components/marketing/CtaMessengers'
import { JsonLd } from '@/components/seo/JsonLd'
import { LicenseBadge } from '@/components/marketing/LicenseBadge'
import { RichTextRenderer } from '@/components/marketing/RichTextRenderer'
import { buildJsonLdForTemplate } from '@/lib/seo/composer'
import type { Author, District as JsonLdDistrict, Service as JsonLdService } from '@/lib/seo/jsonld'
import { getSiteChrome } from '@/lib/chrome'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

type ServiceDoc = {
  slug: string
  title: string
  h1?: string | null
  priceFrom: number
  priceTo: number
  priceUnit: string
  metaDescription?: string | null
  reviewedBy?:
    | {
        slug?: string | null
        firstName?: string | null
        lastName?: string | null
        jobTitle?: string | null
        bio?: string | null
        photoUrl?: string | null
      }
    | string
    | null
}

type DistrictDoc = {
  slug: string
  nameNominative: string
  namePrepositional: string
  localPriceAdjustment?: number | null
  landmarks?: { landmarkName?: string }[] | string[] | null
  centerGeo?: [number, number] | null
  coverageRadius?: number | null
  distanceFromMkad?: number | null
}

type ServiceDistrictDoc = {
  id?: string | number
  seoH1?: string | null
  leadParagraph?: unknown
  localFaq?: { question: string; answer: unknown }[] | null
  localLandmarks?: { landmarkName?: string }[] | null
  localPriceNote?: string | null
  lastReviewedAt?: string | null
  reviewedBy?: ServiceDoc['reviewedBy']
}

type Props = {
  service: ServiceDoc
  district: DistrictDoc
  sd: ServiceDistrictDoc
}

function formatDate(d?: string | null): string {
  if (!d) return new Date().toISOString().slice(0, 10)
  try {
    return new Date(d).toISOString().slice(0, 10)
  } catch {
    return d
  }
}

function plainTextLexical(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(plainTextLexical).join(' ')
  const n = node as { text?: string; children?: unknown; root?: unknown }
  if (n.text) return n.text
  if (n.children) return plainTextLexical(n.children)
  if (n.root) return plainTextLexical(n.root)
  return ''
}

export default async function ServiceDistrictView({ service, district, sd }: Props) {
  const chrome = await getSiteChrome()

  // Token-replace локально (sa-seo §5)
  const adj = district.localPriceAdjustment ?? 0
  const localPriceFrom = Math.round(service.priceFrom * (1 + adj / 100))
  const localResponseTime = '2 часа'
  const cityPriceNote =
    sd.localPriceNote?.trim() ||
    (adj
      ? `В ${district.nameNominative} цены на ${Math.abs(adj)}% ${
          adj > 0 ? 'выше' : 'ниже'
        } стандарта МО — ${adj > 0 ? 'плечо до полигонов больше' : 'местные полигоны ближе'}.`
      : '')

  // Микрорайоны: sd.localLandmarks > district.landmarks fallback
  const microDistricts = (() => {
    const fromSd = (sd.localLandmarks ?? [])
      .map((l) => l?.landmarkName?.trim())
      .filter((s): s is string => Boolean(s))
    if (fromSd.length > 0) return fromSd
    const dl = district.landmarks
    if (Array.isArray(dl)) {
      return (dl as Array<{ landmarkName?: string } | string>)
        .map((x) => (typeof x === 'string' ? x : x?.landmarkName))
        .filter((s): s is string => Boolean(s && s.trim()))
    }
    return []
  })()

  // Author block
  const sourceAuthor = sd.reviewedBy ?? service.reviewedBy
  const authorObj =
    typeof sourceAuthor === 'object' && sourceAuthor !== null
      ? (sourceAuthor as {
          slug?: string | null
          firstName?: string | null
          lastName?: string | null
          jobTitle?: string | null
          bio?: string | null
          photoUrl?: string | null
        })
      : null
  const authorName = authorObj
    ? `${authorObj.firstName ?? ''} ${authorObj.lastName ?? ''}`.trim() || 'Эксперт Обихода'
    : 'Эксперт Обихода'
  const authorRole = authorObj?.jobTitle ?? 'Эксперт «Обихода»'
  const authorBio =
    authorObj?.bio ||
    `Руковожу полевыми бригадами Обихода. Знаю местные полигоны, нюансы выезда в ${district.nameNominative}, требования УК к документообороту.`
  const lastReviewedAt = formatDate(sd.lastReviewedAt ?? null)

  // FAQ → plain text для schema
  const faqs = (sd.localFaq ?? []).map((f) => ({
    question: f.question,
    answer: plainTextLexical(f.answer),
  }))

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Услуги', href: '/uslugi/' },
    { name: service.title, href: `/${service.slug}/` },
    { name: district.nameNominative, href: `/${service.slug}/${district.slug}/` },
  ]

  const jsonLdService: JsonLdService = {
    slug: service.slug,
    title: service.title,
    h1: service.h1 ?? service.title,
    priceFrom: localPriceFrom,
    priceTo: Math.round(service.priceTo * (1 + adj / 100)),
    priceUnit: service.priceUnit,
  }
  const jsonLdDistrict: JsonLdDistrict = {
    slug: district.slug,
    nameNominative: district.nameNominative,
    namePrepositional: district.namePrepositional,
    centerGeo: district.centerGeo ?? null,
    coverageRadius: district.coverageRadius ?? null,
  }
  const jsonLdAuthor: Author | undefined =
    authorObj && authorObj.slug
      ? {
          slug: authorObj.slug,
          firstName: authorObj.firstName ?? authorName.split(' ')[0] ?? '',
          lastName: authorObj.lastName ?? authorName.split(' ').slice(1).join(' ') ?? '',
          jobTitle: authorObj.jobTitle ?? authorRole,
          bio: authorObj.bio ?? null,
          imageUrl: authorObj.photoUrl ?? null,
        }
      : undefined

  const schema = buildJsonLdForTemplate('T4_SD', {
    chrome,
    skipChrome: true,
    service: jsonLdService,
    district: jsonLdDistrict,
    faqs,
    breadcrumbs: breadcrumbs.map((b) => ({ name: b.name, url: `${SITE_URL}${b.href}` })),
    author: jsonLdAuthor,
  })

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/uslugi-t4.css" />
      <JsonLd schema={schema} />

      <div className="sd-page">
        {/* Breadcrumbs (стандартная компонента — не sd-crumbs из newui, но семантически 1-в-1) */}
        <div className="mx-auto max-w-6xl px-6 pt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* §3 · HERO */}
        <section className="sd-hero">
          <div className="sd-wrap">
            <div className="sd-hero-grid">
              <div>
                <div className="sd-eyebrow">
                  § 03 · {service.title} · {district.nameNominative} и микрорайоны
                </div>
                <h1>
                  {service.title} {district.namePrepositional}
                </h1>
                {sd.leadParagraph ? (
                  <RichTextRenderer data={sd.leadParagraph} className="sd-hero-lead" />
                ) : (
                  <p className="sd-hero-lead">
                    Обиход выполняет {service.title.toLowerCase()} {district.namePrepositional} и во
                    всех микрорайонах: бригада с техникой приедет за {localResponseTime} от заявки.
                    Работаем с частными домами, дачами, новостройками и старым фондом. Полный пакет
                    документов для УК и ТСЖ: договор, акт выполненных работ, талоны на размещение
                    отходов на лицензированных полигонах. Цена фиксируется на 14 дней.
                  </p>
                )}
                <div className="sd-hero-cta">
                  <Link href="/kalkulyator/foto-smeta/" className="sd-btn sd-btn--primary">
                    Загрузить фото — получить смету
                  </Link>
                  <a href="tel:+74950000000" className="sd-btn sd-btn--ghost">
                    +7 (495) 000-00-00
                  </a>
                </div>
                <CtaMessengers className="mt-4" />
              </div>
              <div
                className="sd-hero-photo"
                role="img"
                aria-label={`Фото бригады Обиход на выезде в ${district.nameNominative}`}
              >
                <span style={{ fontSize: '12px' }}>
                  Фото · Бригада в {district.namePrepositional} · placeholder
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* §4 · METRICS */}
        <section className="sd-section">
          <div className="sd-wrap">
            <div
              className="sd-metrics"
              aria-label={`Ключевые показатели по ${district.nameNominative}`}
            >
              <div className="sd-metric">
                <div className="sd-metric-num">от {localPriceFrom.toLocaleString('ru-RU')} ₽</div>
                <div className="sd-metric-label">{service.title.toLowerCase()}, фикс-цена</div>
              </div>
              <div className="sd-metric">
                <div className="sd-metric-num">за {localResponseTime}</div>
                <div className="sd-metric-label">
                  выезд бригады в любую точку {district.nameNominative}
                </div>
              </div>
              <div className="sd-metric">
                <div className="sd-metric-num">
                  {microDistricts.length > 0
                    ? `${microDistricts.length}+ микрорайонов`
                    : '25+ микрорайонов'}
                </div>
                <div className="sd-metric-label">
                  покрытие всей территории {district.namePrepositional}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* §6 · PHOTO → CMETA */}
        <section className="sd-section sd-section--alt">
          <div className="sd-wrap">
            <div className="sd-photo-cta" id="sd-photo-cta">
              <div>
                <h2 className="sd-photo-cta-h">Пришлите фото — посчитаем смету за 10 минут</h2>
                <p className="sd-photo-cta-p">
                  Сфотографируйте объект телефоном — наш алгоритм оценит объём и тип работ, бригада
                  в {district.namePrepositional} подтвердит цену по телефону. Без выезда оценщика.
                </p>
                <p
                  className="sd-muted"
                  style={{ color: 'rgba(247,245,240,0.7)', marginTop: '10px' }}
                >
                  Город:{' '}
                  <strong style={{ color: 'var(--c-accent)' }}>{district.nameNominative}</strong> ·
                  pre-filled
                </p>
              </div>
              <Link
                href={`/kalkulyator/foto-smeta/?city=${district.slug}`}
                className="sd-btn sd-btn--accent"
              >
                Загрузить фото →
              </Link>
            </div>
          </div>
        </section>

        {/* §7 · PRICING NOTE */}
        {cityPriceNote && (
          <section className="sd-section">
            <div className="sd-wrap">
              <div className="sd-eyebrow">§ 07 · Прайс</div>
              <h2 className="sd-h2">
                Цены на {service.title.toLowerCase()} {district.namePrepositional}
              </h2>
              <p className="sd-price-note">
                <strong>Локальная корректировка для {district.nameNominative}:</strong>{' '}
                {cityPriceNote}
              </p>
              <p className="mt-4 max-w-3xl text-stone-700">
                Базовая цена — от {service.priceFrom.toLocaleString('ru-RU')} ₽. Адаптированная для{' '}
                {district.namePrepositional}:{' '}
                <strong>от {localPriceFrom.toLocaleString('ru-RU')} ₽</strong>.
              </p>
            </div>
          </section>
        )}

        {/* §10 · FAQ */}
        {faqs.length > 0 && (
          <section className="sd-section">
            <div className="sd-wrap">
              <div className="sd-eyebrow">§ 10 · Часто спрашивают</div>
              <h2 className="sd-h2">
                Вопросы клиентов из {district.namePrepositional.replace(/^в /u, '')}
              </h2>
              <div className="sd-faq" id="sd-faq">
                {(sd.localFaq ?? []).map((f, i) => (
                  <details key={i} className="sd-faq-item">
                    <summary className="sd-faq-q">
                      <span>{f.question}</span>
                      <span aria-hidden="true">+</span>
                    </summary>
                    <div className="sd-faq-a">
                      <RichTextRenderer data={f.answer} />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* §11 · MICRODISTRICTS */}
        {microDistricts.length > 0 && (
          <section className="sd-section sd-section--alt">
            <div className="sd-wrap">
              <div className="sd-eyebrow">§ 11 · География работ</div>
              <h2 className="sd-h2">Микрорайоны {district.nameNominative}</h2>
              <div className="sd-geo">
                <div className="sd-geo-grid" aria-label={`Микрорайоны ${district.nameNominative}`}>
                  {microDistricts.map((m, i) => (
                    <span key={i} className="sd-geo-item">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* §14 · AUTHOR */}
        <section className="sd-section sd-section--alt">
          <div className="sd-wrap">
            <div className="sd-eyebrow">§ 14 · Автор материала</div>
            <div className="sd-author">
              <div className="sd-author-photo" aria-hidden="true">
                {authorName
                  .split(' ')
                  .map((s) => s[0] ?? '')
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <div className="sd-author-name">{authorName}</div>
                <div className="sd-author-role">{authorRole}</div>
                <p className="sd-author-bio">{authorBio}</p>
                <div className="sd-author-meta">
                  Текст подготовлен {authorName}, обновлено {lastReviewedAt} · Reviewed by: главный
                  редактор Обихода
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* §16 · FINAL CTA */}
        <section className="sd-section sd-section--card" id="sd-final">
          <div className="sd-wrap">
            <div className="sd-final">
              <div className="sd-eyebrow">§ 16 · Последний шаг</div>
              <h2 className="sd-final-h">
                Закажите {service.title.toLowerCase()} {district.namePrepositional}
              </h2>
              <p className="sd-final-p">
                За {localResponseTime} от заявки. Документы для УК сразу. Цена фиксируется на 14
                дней.
              </p>
              <div className="sd-final-ctas">
                <Link
                  href={`/kalkulyator/foto-smeta/?city=${district.slug}`}
                  className="sd-btn sd-btn--primary"
                >
                  Загрузить фото — получить смету
                </Link>
                <a href="tel:+74950000000" className="sd-btn sd-btn--ghost">
                  +7 (495) 000-00-00
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-10">
          <LicenseBadge />
        </div>
      </div>
    </>
  )
}
