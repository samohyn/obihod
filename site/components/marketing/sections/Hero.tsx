import { getSiteChrome, DEFAULT_SITE_CHROME } from '@/lib/chrome'
import { HeroForm } from './HeroForm'

export async function Hero() {
  const chrome = await getSiteChrome()
  const phoneE164 = chrome?.contacts?.phoneE164 ?? DEFAULT_SITE_CHROME.contacts?.phoneE164 ?? ''
  const phoneDisplay =
    chrome?.contacts?.phoneDisplay ?? DEFAULT_SITE_CHROME.contacts?.phoneDisplay ?? ''

  return (
    <section className="hpc-hero hp-section">
      <div className="hpc-hero-bg"></div>
      <div className="wrap hpc-hero-grid">
        <div>
          <div className="eyebrow">§ 01 · Хозяйственные работы · Москва и МО</div>
          <h1>
            Удаление деревьев
            <br />
            и хозяйственные работы
            <br />в <span className="accent">Москве и Подмосковье</span>
          </h1>
          <p className="lead">
            4 направления в одном договоре: арбористика, чистка крыш, вывоз мусора, демонтаж.
            Фикс-цена за объект, страховка 5 млн ₽, штрафы ГЖИ берём на себя по договору.
          </p>

          <div className="hpc-trust-bullets">
            <div className="hpc-trust-bullet">
              <span className="v">12 лет</span>
              <p className="l">на рынке хозяйственных работ в Москве и МО</p>
            </div>
            <div className="hpc-trust-bullet">
              <span className="v">5 млн ₽</span>
              <p className="l">страхование ответственности в Ингосстрахе</p>
            </div>
            <div className="hpc-trust-bullet">
              <span className="v">1 200+</span>
              <p className="l">
                объектов в портфолио
                <br />с актами и фото-отчётами
              </p>
            </div>
          </div>

          <div className="row" style={{ gap: '12px', flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href="#cta">
              Получить смету за 10 минут
            </a>
            <a
              className="btn btn-secondary"
              href={phoneE164 ? `tel:${phoneE164}` : 'tel:+74950000000'}
            >
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
              {phoneDisplay || '+7 (495) 000-00-00'}
            </a>
          </div>
        </div>

        {/* Hero form-card — client component (интерактивная форма) */}
        <HeroForm />
      </div>
    </section>
  )
}
