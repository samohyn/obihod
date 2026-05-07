import { DEFAULT_SITE_CHROME, getSiteChrome } from '@/lib/chrome'
import type { HomepageGlobal } from '@/lib/homepage'

import { HeroLeadForm } from './HeroLeadForm'

/**
 * Hero — секция §01
 * Note: next/image priority for LCP, hero-фото — background-image на .hpc-hero (CSS).
 * Source: newui/homepage-classic.html. Phase 2: контент из Payload Homepage global
 * (graceful fallback на захардкоженные значения если global ещё не seed'нут).
 */

const FALLBACK = {
  eyebrow: '§ 01 · Хозяйственные работы · Москва и МО',
  titleMain: 'Удаление деревьев',
  titleAccent: 'Москве и МО',
  subhead: 'И ещё 3 направления: чистка крыш, вывоз мусора, демонтаж',
  lead: 'Фикс-цена за объект, страховка 5 млн ₽, штрафы ГЖИ берём на себя по договору.',
  trustBullets: [
    { value: '12 лет', label: 'на рынке хозяйственных работ в Москве и МО' },
    { value: '5 млн ₽', label: 'страхование ответственности в Ингосстрахе' },
    { value: '1 200+', label: 'объектов в портфолио\nс актами и фото-отчётами' },
  ],
}

export async function Hero({ data }: { data?: HomepageGlobal }) {
  const hero = data?.hero
  const eyebrow = hero?.eyebrow ?? FALLBACK.eyebrow
  const titleMain = hero?.titleMain ?? FALLBACK.titleMain
  // Normalize: страйп предлога "в " если он включён в data — JSX уже добавляет
  // "в " между titleMain и accent. Без strip получали "в в Москве и МО"
  // (incident 2026-05-07: prod Payload titleAccent сохранён с включённым "в").
  const titleAccent = (hero?.titleAccent ?? FALLBACK.titleAccent).replace(/^в\s+/i, '')
  const subhead = hero?.subhead ?? FALLBACK.subhead
  const lead = hero?.lead ?? FALLBACK.lead
  const bullets = hero?.trustBullets ?? FALLBACK.trustBullets
  const chrome = await getSiteChrome()
  const phoneE164 = chrome?.contacts?.phoneE164 ?? DEFAULT_SITE_CHROME.contacts?.phoneE164 ?? ''
  const phoneDisplay =
    chrome?.contacts?.phoneDisplay ?? DEFAULT_SITE_CHROME.contacts?.phoneDisplay ?? ''

  return (
    <section className="hpc-hero hp-section">
      <div className="hpc-hero-bg"></div>
      <div className="wrap hpc-hero-grid">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h1>
            {titleMain} <br />в <span className="accent">{titleAccent}</span>
          </h1>
          <p className="hpc-hero-subhead">{subhead}</p>
          <p className="lead">{lead}</p>

          <div className="hpc-trust-bullets">
            {bullets.map((b, i) => (
              <div className="hpc-trust-bullet" key={i}>
                <span className="v">{b.value}</span>
                <p className="l">
                  {b.label.split('\n').map((line, j, arr) => (
                    <span key={j}>
                      {line}
                      {j < arr.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>

          <div className="row" style={{ gap: '12px', flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href="#cta">
              Получить смету за 10 минут
            </a>
            <a className="btn btn-secondary" href={`tel:${phoneE164}`}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2.03Z" />
              </svg>
              {phoneDisplay}
            </a>
          </div>
        </div>

        <HeroLeadForm />
      </div>
    </section>
  )
}
