import { getSiteChrome, DEFAULT_SITE_CHROME } from '@/lib/chrome'

import { Icon } from '../_shared/Icon'
import { Placeholder } from '../_shared/Placeholder'
import { AmberSeal, RingsPattern } from '../_shared/graphics'

export async function Hero() {
  const chrome = await getSiteChrome()
  const phoneE164 = chrome?.contacts?.phoneE164 ?? DEFAULT_SITE_CHROME.contacts?.phoneE164 ?? ''
  const phoneDisplay =
    chrome?.contacts?.phoneDisplay ?? DEFAULT_SITE_CHROME.contacts?.phoneDisplay ?? ''

  return (
    <section className="hero">
      <div className="rings-bg">
        <RingsPattern opacity={0.22} id="rings-hero" />
      </div>
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">Хозяйственные работы · Московская область</span>
            <h1 className="hero-slogan">
              Участок
              <br />
              в&nbsp;порядке
              <span className="dot">.</span>
            </h1>
            <p className="hero-sub">
              Один подрядчик на весь год: спил, снег, демонтаж и вывоз мусора. Одна бригада, один
              менеджер, фиксированная цена — без сюрпризов.
            </p>
            <div className="hero-cta-row">
              <a href="#calc" className="btn btn-primary btn-lg">
                Рассчитать стоимость
                <Icon.ArrowRight size={20} />
              </a>
              {phoneE164 ? (
                <a href={`tel:${phoneE164}`} className="btn btn-ghost btn-lg">
                  <Icon.Phone size={18} />
                  {phoneDisplay}
                </a>
              ) : null}
            </div>

            <div className="hero-meta">
              <div className="hero-meta-item">
                <div className="v">
                  4 <span style={{ color: 'var(--c-accent-ink)' }}>в&nbsp;1</span>
                </div>
                <div className="l">услуги одной бригадой по одному договору</div>
              </div>
              <div className="hero-meta-item">
                <div className="v">&lt;15&nbsp;мин</div>
                <div className="l">отвечаем на&nbsp;заявку, в&nbsp;любой день недели</div>
              </div>
              <div className="hero-meta-item">
                <div className="v">5&nbsp;млн&nbsp;₽</div>
                <div className="l">страхование ответственности за&nbsp;ущерб</div>
              </div>
              <div className="hero-meta-item">
                <div className="v">12&nbsp;мес</div>
                <div className="l">гарантия на&nbsp;работу в&nbsp;сертификате</div>
              </div>
            </div>
          </div>

          <div>
            <div className="hero-visual">
              <div className="hero-seal">
                <AmberSeal size={124} label="ОБИХОД · УЧАСТОК В ПОРЯДКЕ · " center={'4\nуслуги'} />
              </div>
              <Placeholder
                label="ФОТО · Бригада в форме на объекте — арборист в обвязке на берёзе, самосвал с логотипом у забора, 4:5, тёплый цвет"
                aspect="4/5"
              />
              <div className="hero-badge">Работает Обиход</div>
              <div className="hero-caption">
                <div className="t">СНТ «Берёзовая роща», Истринский р-н</div>
                <div className="d">
                  Спил 2&nbsp;аварийных берёз · 14&nbsp;200&nbsp;₽ · 11&nbsp;апреля 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
