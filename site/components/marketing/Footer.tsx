import Link from 'next/link'

import { DEFAULT_SITE_CHROME, getSiteChrome } from '@/lib/chrome'
/**
 * Footer — нижняя навигация, контакты, юр.инфа.
 * Source-of-truth: newui/homepage-classic.html (footer block).
 * Stack: Server Component, контент hardcoded.
 *
 * Phase 2 follow-up: вытащить ИНН/ОГРН из SiteChrome.requisites,
 * списки услуг/районов из Services/Districts коллекций.
 */
export async function Footer() {
  const chrome = await getSiteChrome()
  const phoneE164 = chrome?.contacts?.phoneE164 ?? DEFAULT_SITE_CHROME.contacts?.phoneE164 ?? ''
  const phoneDisplay =
    chrome?.contacts?.phoneDisplay ?? DEFAULT_SITE_CHROME.contacts?.phoneDisplay ?? ''
  return (
    <footer className="site-footer-mock">
      <div className="cols">
        <div className="brand-col">
          <div className="mark-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1280 480"
              className="footer-logo-svg"
              role="img"
              aria-label="Обиход"
            >
              <title>Обиход</title>
              <defs>
                <style>{`.fl-stroke-main{fill:none;stroke:currentColor;stroke-width:5.8;stroke-linecap:round;stroke-linejoin:round}.fl-stroke-soft{fill:none;stroke:currentColor;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;opacity:.75}.fl-stroke-thick{fill:none;stroke:currentColor;stroke-width:7.8;stroke-linecap:round;stroke-linejoin:round}.fl-fill-ink{fill:currentColor}.fl-label{font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:160px;font-weight:800;letter-spacing:-4px;fill:currentColor}`}</style>
              </defs>
              <g>
                <g transform="translate(240 240) scale(0.36)">
                  <circle cx="0" cy="0" r="560" className="fl-stroke-thick" />
                  <circle cx="0" cy="0" r="435" className="fl-stroke-soft" />
                  <line x1="-560" y1="0" x2="560" y2="0" className="fl-stroke-soft" />
                  <line x1="0" y1="-560" x2="0" y2="560" className="fl-stroke-soft" />
                  <g transform="translate(-300 -270)">
                    <line x1="0" y1="-150" x2="0" y2="150" className="fl-stroke-main" />
                    <g className="fl-stroke-main">
                      <line x1="0" y1="-20" x2="-60" y2="12" />
                      <line x1="0" y1="-20" x2="60" y2="12" />
                      <line x1="0" y1="30" x2="-72" y2="64" />
                      <line x1="0" y1="30" x2="72" y2="64" />
                      <line x1="0" y1="78" x2="-72" y2="112" />
                      <line x1="0" y1="78" x2="72" y2="112" />
                      <line x1="0" y1="122" x2="-52" y2="150" />
                      <line x1="0" y1="122" x2="52" y2="150" />
                    </g>
                  </g>
                  <g transform="translate(300 -270)">
                    <g className="fl-stroke-main">
                      <line x1="0" y1="-130" x2="0" y2="130" />
                      <line x1="-130" y1="0" x2="130" y2="0" />
                      <line x1="-92" y1="-92" x2="92" y2="92" />
                      <line x1="92" y1="-92" x2="-92" y2="92" />
                      <polyline points="-10,-118 0,-130 10,-118" />
                      <polyline points="-10,118 0,130 10,118" />
                      <polyline points="-118,-10 -130,0 -118,10" />
                      <polyline points="118,-10 130,0 118,10" />
                    </g>
                    <circle cx="0" cy="0" r="9" className="fl-stroke-main" />
                    <circle cx="0" cy="0" r="2.6" className="fl-fill-ink" />
                  </g>
                  <g transform="translate(-300 300)">
                    <rect x="-115" y="-70" width="230" height="140" className="fl-stroke-main" />
                    <line x1="-115" y1="-4" x2="115" y2="-4" className="fl-stroke-main" />
                    <line x1="18" y1="-70" x2="18" y2="-4" className="fl-stroke-main" />
                    <line x1="-42" y1="-4" x2="-42" y2="70" className="fl-stroke-main" />
                  </g>
                  <g transform="translate(300 300)">
                    <polyline points="-100,60 -100,-60 100,-60 100,60" className="fl-stroke-main" />
                    <line x1="-118" y1="-60" x2="118" y2="-60" className="fl-stroke-main" />
                    <g className="fl-stroke-main">
                      <line x1="-48" y1="50" x2="-48" y2="-20" />
                      <line x1="0" y1="50" x2="0" y2="-36" />
                      <polyline points="-14,-20 0,-36 14,-20" />
                      <line x1="48" y1="50" x2="48" y2="-20" />
                    </g>
                  </g>
                </g>
                <text x="520" y="295" className="fl-label">
                  ОБИХОД
                </text>
              </g>
            </svg>
          </div>
          <p>
            Комплексный подрядчик 4-в-1 для Москвы и МО: арбористика, чистка крыш, вывоз мусора,
            демонтаж. Плюс дизайн ландшафта. С 2020 года.
          </p>
          <div className="contacts">
            <a href={`tel:${phoneE164}`}>{phoneDisplay}</a>
            <a href="mailto:hi@obikhod.ru">hi@obikhod.ru</a>
            <span style={{ opacity: '0.7' }}>МО, Раменский р-н, ул. Питомниковая, 3</span>
            <span style={{ opacity: '0.7', fontSize: '12px' }}>
              пн-сб 8:00–22:00, вс 10:00–18:00 · 24/7 на аварии
            </span>
          </div>
        </div>

        <div>
          <h5>Услуги</h5>
          <ul>
            <li>
              <Link href="/arboristika">Арбористика</Link>
            </li>
            <li>
              <Link href="/chistka-krysh">Чистка крыш</Link>
            </li>
            <li>
              <Link href="/vyvoz-musora">Вывоз мусора</Link>
            </li>
            <li>
              <Link href="/demontazh">Демонтаж</Link>
            </li>
            <li>
              <Link href="/dizain-landshafta">Дизайн ландшафта</Link>
            </li>
            <li>
              <Link href="/foto-smeta" style={{ opacity: '0.65' }}>
                Фото → смета →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5>Районы</h5>
          <ul>
            <li>
              <Link href="/raiony/odintsovo">Одинцово</Link>
            </li>
            <li>
              <Link href="/raiony/krasnogorsk">Красногорск</Link>
            </li>
            <li>
              <Link href="/raiony/mytishchi">Мытищи</Link>
            </li>
            <li>
              <Link href="/raiony/khimki">Химки</Link>
            </li>
            <li>
              <Link href="/raiony/istra">Истра</Link>
            </li>
            <li>
              <Link href="/raiony" style={{ opacity: '0.65' }}>
                Все 12 районов →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5>B2B и ресурсы</h5>
          <ul>
            <li>
              <Link href="/b2b/uk-tszh">УК / ТСЖ</Link>
            </li>
            <li>
              <Link href="/b2b/fm">Facility Management</Link>
            </li>
            <li>
              <Link href="/b2b/zastroyshchik">Застройщикам</Link>
            </li>
            <li>
              <Link href="/b2b/gostorgi">Госзакупки</Link>
            </li>
            <li>
              <Link href="/kejsy">Кейсы</Link>
            </li>
            <li>
              <Link href="/blog">Блог</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="legal">
        <span className="copy">© 2026 ООО «Обиход»</span>
        <span className="sep">·</span>
        <span>ИНН 1111111111</span>
        <span className="sep">·</span>
        <span>ОГРН 1111111111111</span>
        <span className="sep">·</span>
        <Link href="/politika">Политика конфиденциальности</Link>
        <span className="sep">·</span>
        <Link href="/oferta">Публичная оферта</Link>
      </div>
    </footer>
  )
}
