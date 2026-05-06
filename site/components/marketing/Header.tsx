import Link from 'next/link'

import { DEFAULT_SITE_CHROME, getSiteChrome } from '@/lib/chrome'
/**
 * Header — главная навигация, mega-menu (Услуги / Районы / Магазин), auth CTA.
 * Source-of-truth: newui/_header.html (canonical mockup).
 * Stack: Server Component, mega-menu работает на pure CSS :hover (см. .mm-has-drop:hover).
 *
 * При изменении: правка в newui/_header.html → копировать сюда заново.
 * См. EPIC-HOMEPAGE-MIGRATION (team/product/podev).
 */
export async function Header() {
  const chrome = await getSiteChrome()
  const phoneE164 = chrome?.contacts?.phoneE164 ?? DEFAULT_SITE_CHROME.contacts?.phoneE164 ?? ''
  const phoneDisplay =
    chrome?.contacts?.phoneDisplay ?? DEFAULT_SITE_CHROME.contacts?.phoneDisplay ?? ''
  return (
    <header className="mm-demo site-mm" aria-label="Главное меню Обихода">
      <div className="mm-header">
        <Link className="mm-brand" href="/" aria-label="Обиход — на главную">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1280 480"
            className="mm-logo-svg"
            role="img"
            aria-label="Обиход"
          >
            <title>Обиход</title>
            <defs>
              <style>{`.stroke-main{fill:none;stroke:currentColor;stroke-width:5.8;stroke-linecap:round;stroke-linejoin:round}.stroke-soft{fill:none;stroke:currentColor;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;opacity:.75}.stroke-thick{fill:none;stroke:currentColor;stroke-width:7.8;stroke-linecap:round;stroke-linejoin:round}.fill-ink{fill:currentColor}.label-wordmark{font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:160px;font-weight:800;letter-spacing:-4px;fill:currentColor}`}</style>
            </defs>
            <g color="#2d5a3d">
              <g transform="translate(240 240) scale(0.36)">
                <circle cx="0" cy="0" r="560" className="stroke-thick" />
                <circle cx="0" cy="0" r="435" className="stroke-soft" />
                <line x1="-560" y1="0" x2="560" y2="0" className="stroke-soft" />
                <line x1="0" y1="-560" x2="0" y2="560" className="stroke-soft" />
                <g transform="translate(-300 -270)">
                  <line x1="0" y1="-150" x2="0" y2="150" className="stroke-main" />
                  <g className="stroke-main">
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
                  <g className="stroke-main">
                    <line x1="0" y1="-130" x2="0" y2="130" />
                    <line x1="-130" y1="0" x2="130" y2="0" />
                    <line x1="-92" y1="-92" x2="92" y2="92" />
                    <line x1="92" y1="-92" x2="-92" y2="92" />
                    <polyline points="-10,-118 0,-130 10,-118" />
                    <polyline points="-10,118 0,130 10,118" />
                    <polyline points="-118,-10 -130,0 -118,10" />
                    <polyline points="118,-10 130,0 118,10" />
                  </g>
                  <circle cx="0" cy="0" r="9" className="stroke-main" />
                  <circle cx="0" cy="0" r="2.6" className="fill-ink" />
                </g>
                <g transform="translate(-300 300)">
                  <rect x="-115" y="-70" width="230" height="140" className="stroke-main" />
                  <line x1="-115" y1="-4" x2="115" y2="-4" className="stroke-main" />
                  <line x1="18" y1="-70" x2="18" y2="-4" className="stroke-main" />
                  <line x1="-42" y1="-4" x2="-42" y2="70" className="stroke-main" />
                </g>
                <g transform="translate(300 300)">
                  <polyline points="-100,60 -100,-60 100,-60 100,60" className="stroke-main" />
                  <line x1="-118" y1="-60" x2="118" y2="-60" className="stroke-main" />
                  <g className="stroke-main">
                    <line x1="-48" y1="50" x2="-48" y2="-20" />
                    <line x1="0" y1="50" x2="0" y2="-36" />
                    <polyline points="-14,-20 0,-36 14,-20" />
                    <line x1="48" y1="50" x2="48" y2="-20" />
                  </g>
                </g>
              </g>
              <text x="520" y="295" className="label-wordmark">
                ОБИХОД
              </text>
            </g>
          </svg>
        </Link>
        <div className="mm-nav">
          <div className="mm-has-drop">
            <button className="mm-trigger" type="button" aria-haspopup="true">
              Услуги <span className="mm-chevron">▼</span>
            </button>
            <div className="mm-panel" role="menu">
              <div className="mm-panel-cols">
                <div className="mm-col">
                  <h4>Арбористика</h4>
                  <ul>
                    <li>
                      <Link href="/arboristika/spil-derevev">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 3 L12 14" />
                          <path d="M9 6 L12 3 L15 6" />
                          <path d="M8 9 L12 6 L16 9" />
                          <path d="M7 12 L12 9 L17 12" />
                          <path d="M6 15 L18 15" strokeDasharray="2 1.5" />
                          <path d="M12 15 L12 21" />
                          <path d="M9 21 L15 21" />
                        </svg>
                        Спил деревьев<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/arboristika/valka">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 20 L20 20" />
                          <g transform="rotate(35 10 18)">
                            <path d="M10 9 L10 18" />
                            <path d="M8 11 L10 9 L12 11" />
                            <path d="M7.5 13 L10 11 L12.5 13" />
                            <path d="M7 15 L10 13 L13 15" />
                          </g>
                          <path d="M16 14 L20 14 L20 10" />
                          <path d="M20 14 L17 17" />
                        </svg>
                        Валка<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/arboristika/udalenie-pnej">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <ellipse cx="12" cy="10" rx="5" ry="1.5" />
                          <path d="M7 10 L7 13" />
                          <path d="M17 10 L17 13" />
                          <path d="M7 13 C 9 14, 15 14, 17 13" />
                          <circle cx="12" cy="10" r="1.6" />
                          <path d="M6 16 C 5 17, 4 18, 3 19" />
                          <path d="M9 16 L8 20" />
                          <path d="M15 16 L16 20" />
                          <path d="M18 16 C 19 17, 20 18, 21 19" />
                        </svg>
                        Корчевание пней<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/arboristika/kronirovanie">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 11 L12 21" />
                          <path d="M9 21 L15 21" />
                          <path d="M5 11 C 5 6, 19 6, 19 11" />
                          <path d="M8 11 L8 13" />
                          <path d="M12 11 L12 8" />
                          <path d="M16 11 L16 13" />
                          <path d="M3 4 L6 7" />
                          <path d="M4 4 L6 4 L6 6" />
                        </svg>
                        Обрезка, кронирование<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/arboristika/kabling">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 3 L6 21" />
                          <path d="M18 3 L18 21" />
                          <path d="M6 10 C 9 9, 15 9, 18 10" strokeDasharray="2 1.5" />
                          <circle cx="6" cy="10" r="1.2" fill="currentColor" />
                          <circle cx="18" cy="10" r="1.2" fill="currentColor" />
                          <path d="M4 21 L8 21" />
                          <path d="M16 21 L20 21" />
                        </svg>
                        Каблинг, брейсинг<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/arboristika/opryskivanie">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 14 L14 14 L14 20 L10 20 Z" />
                          <path d="M12 14 L12 10" />
                          <path d="M10 10 L14 10 L14 8 L10 8 Z" />
                          <path d="M6 6 L8 7" />
                          <path d="M6 10 L8 10" />
                          <path d="M6 14 L8 13" />
                          <circle cx="4" cy="6" r="0.8" />
                          <circle cx="4" cy="10" r="0.8" />
                          <circle cx="4" cy="14" r="0.8" />
                        </svg>
                        Опрыскивание<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/arboristika/izmelchenie">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 6 L17 6 L14 13 L10 13 Z" />
                          <path d="M10 13 L10 18 L14 18 L14 13" />
                          <path d="M5 3 L7 6" />
                          <path d="M3 5 L7 6" />
                          <path d="M17 18 L20 18" />
                          <path d="M19 17 L21 17" />
                          <path d="M19 19 L21 20" />
                          <circle cx="11" cy="20.5" r="1" />
                          <circle cx="13" cy="20.5" r="1" />
                        </svg>
                        Измельчение веток<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                  </ul>
                  <Link href="/arboristika" className="mm-all">
                    Все услуги арбористики →
                  </Link>
                </div>

                <div className="mm-col">
                  <h4>Крыши и территория</h4>
                  <ul>
                    <li>
                      <Link href="/chistka-krysh/ot-snega">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 14 L12 6 L21 14" />
                          <path d="M5 14 L5 20 L19 20 L19 14" />
                          <circle cx="8" cy="4" r="0.8" fill="currentColor" />
                          <path d="M8 3 L8 5" />
                          <path d="M7 4 L9 4" />
                          <circle cx="16" cy="4" r="0.8" fill="currentColor" />
                          <path d="M16 3 L16 5" />
                          <path d="M15 4 L17 4" />
                        </svg>
                        Уборка снега с крыш<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/chistka-krysh/vodostoki">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 3 L18 3 L18 6 L6 6 Z" />
                          <path d="M10 6 L10 18" />
                          <path d="M14 6 L14 18" />
                          <path d="M10 18 C 10 20, 14 20, 14 18" />
                          <path d="M10 9 L14 9" strokeDasharray="1.5 1.5" />
                          <path d="M10 13 L14 13" strokeDasharray="1.5 1.5" />
                          <path d="M12 20 L12 22" />
                          <path d="M11 21 L13 21" />
                        </svg>
                        Чистка водостоков<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/chistka-krysh/promalp">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 3 L20 3" />
                          <path d="M12 3 L12 18" />
                          <circle cx="12" cy="10" r="2" />
                          <path d="M10 13 L12 12 L14 13" />
                          <path d="M10 16 L12 14 L14 16" />
                          <path d="M9 19 L15 19" />
                          <path d="M12 19 L12 21" />
                        </svg>
                        Промышленный альпинизм<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/chistka-krysh/avtovyshka">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 20 L22 20" />
                          <path d="M4 20 L4 16 L10 16 L10 20" />
                          <circle cx="6" cy="20" r="1.2" />
                          <circle cx="8" cy="20" r="1.2" />
                          <path d="M10 18 L15 13" />
                          <path d="M15 13 L18 10" strokeDasharray="1.8 1.2" />
                          <path d="M17 8 L21 8 L21 12 L17 12 Z" />
                          <path d="M19 10 L19 8" />
                        </svg>
                        Автовышка<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                  </ul>
                  <Link href="/chistka-krysh" className="mm-all">
                    Все услуги по крышам →
                  </Link>
                </div>

                <div className="mm-col">
                  <h4>Мусор и демонтаж</h4>
                  <ul>
                    <li>
                      <Link href="/vyvoz-musora">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 8 L21 8" />
                          <path d="M5 8 L5 19 L19 19 L19 8" />
                          <circle cx="7.5" cy="20.5" r="1.4" />
                          <circle cx="16.5" cy="20.5" r="1.4" />
                          <path d="M9 14 L9 11" />
                          <path d="M7.5 12.5 L9 11 L10.5 12.5" />
                          <path d="M12 14 L12 11" />
                          <path d="M10.5 12.5 L12 11 L13.5 12.5" />
                          <path d="M15 14 L15 11" />
                          <path d="M13.5 12.5 L15 11 L16.5 12.5" />
                        </svg>
                        Вывоз мусора<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/vyvoz-musora/kontejner">
                        Контейнеры 7 / 20 / 30 м³<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/demontazh/saraj">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 11 L12 5 L20 11" />
                          <path d="M6 11 L6 20 L18 20 L18 11" />
                          <path d="M10 20 L10 14 L14 14 L14 20" />
                          <path d="M3 4 L7 8" strokeWidth="2" />
                          <path d="M5 2 L9 6" strokeWidth="2" />
                          <path d="M6 7 L2 11 L5 14 L9 10" />
                        </svg>
                        Демонтаж сараев<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/demontazh/raschistka">
                        Расчистка участка<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                  </ul>
                  <Link href="/demontazh" className="mm-all">
                    Все услуги по мусору и демонтажу →
                  </Link>
                </div>
              </div>

              <div className="mm-featured">
                <strong>Раменское · зима-2026</strong>
                <span className="muted" style={{ fontSize: '13px' }}>
                  фикс <span className="mm-price">12 800 ₽</span> за объект · смета за 10 минут по
                  фото
                </span>
                <a href="#foto-smeta" className="mm-btn">
                  Прислать фото
                </a>
              </div>
            </div>
          </div>

          <div className="mm-has-drop">
            <button className="mm-trigger" type="button" aria-haspopup="true">
              Районы <span className="mm-chevron">▼</span>
            </button>
            <div className="mm-panel" role="menu">
              <div className="mm-panel-cols">
                <div className="mm-col">
                  <h4>Запад МО</h4>
                  <ul>
                    <li>
                      <Link href="/raiony/odintsovo">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4 L20 20" />
                          <path d="M20 4 L4 20" />
                          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
                        </svg>
                        Одинцово<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/raiony/krasnogorsk">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 18 L9 12 L13 15 L21 18" />
                          <path d="M9 12 L9 8 L11 7 L11 9" />
                          <path d="M9 8 L11 8" />
                        </svg>
                        Красногорск<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/raiony/istra">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 13 C 7 10, 12 16, 17 12 C 19 11, 21 12, 22 13" />
                          <path d="M9 8 C 9 5, 15 5, 15 8" />
                          <path d="M9 8 L15 8" />
                          <line x1="12" y1="2.5" x2="12" y2="5" />
                          <line x1="11" y1="3.5" x2="13" y2="3.5" />
                          <path d="M9 8 L9 18 L15 18 L15 8" />
                        </svg>
                        Истра<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                  </ul>
                  <Link href="/raiony#zapad" className="mm-all">
                    Все районы запада →
                  </Link>
                </div>

                <div className="mm-col">
                  <h4>Север МО</h4>
                  <ul>
                    <li>
                      <Link href="/raiony/khimki">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 12 L8 11 L11 4 L13 4 L12 11 L20 10 L21 12 L20 14 L12 13 L13 20 L15 22 L9 22 L11 20 L12 13 L8 13 L2 12 Z" />
                        </svg>
                        Химки<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/raiony/mytishchi">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 6 L18 6" />
                          <path d="M8 6 L8 9 L16 9 L16 6" />
                          <path d="M9 9 L9 20 L15 20 L15 9" />
                          <line x1="9" y1="13" x2="15" y2="13" />
                          <line x1="11" y1="20" x2="11" y2="22" />
                          <line x1="13" y1="20" x2="13" y2="22" />
                        </svg>
                        Мытищи<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/raiony/pushkino">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 3 L8 9 L10 9 L7 14 L9 14 L7 18 L17 18 L15 14 L17 14 L14 9 L16 9 Z" />
                          <line x1="3" y1="20" x2="21" y2="20" />
                          <line x1="6" y1="19" x2="6" y2="21" />
                          <line x1="12" y1="19" x2="12" y2="21" />
                          <line x1="18" y1="19" x2="18" y2="21" />
                        </svg>
                        Пушкино<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                  </ul>
                  <Link href="/raiony#sever" className="mm-all">
                    Все районы севера →
                  </Link>
                </div>

                <div className="mm-col">
                  <h4>Юго-Восток МО</h4>
                  <ul>
                    <li>
                      <Link href="/raiony/ramenskoe">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 13 C 8 7, 16 7, 21 13" />
                          <line x1="3" y1="13" x2="21" y2="13" />
                          <line x1="6" y1="13" x2="6" y2="18" />
                          <line x1="18" y1="13" x2="18" y2="18" />
                          <path d="M3 18 L21 18" strokeDasharray="2 1.5" />
                          <path d="M3 21 L21 21" strokeDasharray="2 1.5" />
                        </svg>
                        Раменское<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/raiony/zhukovskij">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 3 L13 11 L21 13 L21 14 L13 13 L13 19 L15 21 L15 22 L9 22 L9 21 L11 19 L11 13 L3 14 L3 13 L11 11 Z" />
                        </svg>
                        Жуковский<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/raiony/moskva">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 3 L12 21" />
                          <path d="M3 12 L21 12" />
                          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
                        </svg>
                        Москва — все округа<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                  </ul>
                  <Link href="/raiony" className="mm-all">
                    Карта всех 12 районов →
                  </Link>
                </div>
              </div>

              <div className="mm-featured">
                <strong>Не нашли свой район?</strong>
                <span className="muted" style={{ fontSize: '13px' }}>
                  Возим технику и бригаду до 120 км от МКАД · фикс-цена за объект
                </span>
                <a href="#cta" className="mm-btn">
                  Запросить выезд
                </a>
              </div>
            </div>
          </div>

          <Link className="mm-trigger" href="/dizain-landshafta">
            Дизайн ландшафта
          </Link>

          <div className="mm-has-drop">
            <button className="mm-trigger" type="button" aria-haspopup="true">
              Магазин <span className="mm-chevron">▼</span>
            </button>
            <div className="mm-panel" role="menu">
              <div className="mm-panel-cols">
                <div className="mm-col">
                  <h4>Деревья</h4>
                  <ul>
                    <li>
                      <Link href="/shop/plodovye-derevya">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="9" r="6" />
                          <path d="M12 15 L12 21" />
                          <path d="M9 21 L15 21" />
                          <circle cx="9.5" cy="8" r="1.1" fill="currentColor" />
                          <circle cx="14" cy="10" r="1.1" fill="currentColor" />
                          <circle cx="11" cy="12" r="1.1" fill="currentColor" />
                        </svg>
                        Плодовые деревья<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop/kolonovidnye">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 3 C 8.5 3, 8.5 16, 12 16 C 15.5 16, 15.5 3, 12 3 Z" />
                          <path d="M12 16 L12 21" />
                          <path d="M9.5 21 L14.5 21" />
                          <circle cx="11" cy="9" r="0.9" fill="currentColor" />
                          <circle cx="13" cy="12" r="0.9" fill="currentColor" />
                        </svg>
                        Колоновидные<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop/listvennye">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="7" cy="9" r="3" />
                          <circle cx="12" cy="6.5" r="3.2" />
                          <circle cx="17" cy="9" r="3" />
                          <path d="M12 12 L12 21" />
                          <path d="M9 21 L15 21" />
                        </svg>
                        Лиственные<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop/khvojnye">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 3 L8 9 L10 9 L7 13 L9 13 L6 17 L18 17 L15 13 L17 13 L14 9 L16 9 Z" />
                          <path d="M12 17 L12 21" />
                          <path d="M10 21 L14 21" />
                          <circle cx="9" cy="14" r="0.6" fill="currentColor" />
                          <circle cx="14" cy="11" r="0.6" fill="currentColor" />
                        </svg>
                        Хвойные<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop/krupnomery">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 11 C 3 4, 9 2, 12 2 C 15 2, 21 4, 21 11" />
                          <path d="M5 14 C 5 9, 12 8, 19 14" />
                          <path d="M12 11 L12 21" />
                          <path d="M9 21 L15 21" />
                          <path d="M3 21 L3 5" />
                          <path d="M2 6 L3 5 L4 6" />
                          <path d="M2 20 L3 21 L4 20" />
                        </svg>
                        Крупномеры<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                  </ul>
                  <Link href="/shop/derevya" className="mm-all">
                    Все деревья →
                  </Link>
                </div>

                <div className="mm-col">
                  <h4>Кустарники</h4>
                  <ul>
                    <li>
                      <Link href="/shop/plodovye-kustarniki">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 18 C 3 13, 7 12, 8 14 C 8.5 11.5, 15.5 11.5, 16 14 C 17 12, 21 13, 21 18" />
                          <path d="M2 21 L22 21" />
                          <circle cx="7" cy="15" r="1" fill="currentColor" />
                          <circle cx="12" cy="14" r="1" fill="currentColor" />
                          <circle cx="17" cy="15" r="1" fill="currentColor" />
                        </svg>
                        Плодовые кустарники<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop/dekorativnye-kustarniki">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="11" r="6" />
                          <path d="M6 11 C 9 9, 15 9, 18 11" strokeDasharray="2 1.5" />
                          <path d="M6 13 C 9 15, 15 15, 18 13" strokeDasharray="2 1.5" />
                          <path d="M12 17 L12 21" />
                          <path d="M9.5 21 L14.5 21" />
                        </svg>
                        Декоративные кустарники<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                  </ul>
                  <Link href="/shop/kustarniki" className="mm-all">
                    Все кустарники →
                  </Link>
                </div>

                <div className="mm-col">
                  <h4>Цветы</h4>
                  <ul>
                    <li>
                      <Link href="/shop/cvety">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="6" r="1.6" />
                          <circle cx="15.5" cy="8.5" r="1.6" />
                          <circle cx="14" cy="11.5" r="1.6" />
                          <circle cx="10" cy="11.5" r="1.6" />
                          <circle cx="8.5" cy="8.5" r="1.6" />
                          <circle cx="12" cy="9" r="0.9" fill="currentColor" />
                          <path d="M12 13 L12 21" />
                          <path d="M9 21 L15 21" />
                          <path d="M12 17 C 10 16.5, 8.5 17.5, 9 19" />
                        </svg>
                        Цветы<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop/rozy">
                        <svg
                          className="mm-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="7" r="4" />
                          <path d="M12 4 C 14 5, 14 9, 12 10" />
                          <path d="M9.5 7 C 10.5 6.5, 13 7, 13.5 8.5" />
                          <path d="M12 11 L12 21" />
                          <path d="M9.5 21 L14.5 21" />
                          <path d="M12 14 C 14 13, 16 14, 15 16" />
                          <path d="M12 17 L10.5 16.5" />
                          <path d="M12 19 L13.5 18.5" />
                        </svg>
                        Розы<span className="mm-arrow">→</span>
                      </Link>
                    </li>
                  </ul>
                  <Link href="/shop/cvety-i-rozy" className="mm-all">
                    Весь каталог цветов →
                  </Link>
                </div>
              </div>

              <div className="mm-featured">
                <strong>Сезон посадки 2026</strong>
                <span className="muted" style={{ fontSize: '13px' }}>
                  доставка по МО · посадка с гарантией приживаемости{' '}
                  <span className="mm-price">1 год</span> · смета за день
                </span>
                <Link href="/shop" className="mm-btn">
                  В каталог
                </Link>
              </div>
            </div>
          </div>

          <Link className="mm-trigger" href="/kontakty">
            Контакты
          </Link>
        </div>
        <div className="mm-right">
          <a className="mm-phone" href={`tel:${phoneE164}`}>
            {phoneDisplay}
          </a>
          <div className="auth-cta">
            <button className="btn-login" type="button">
              Войти
            </button>
            <button className="btn-register" type="button">
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
