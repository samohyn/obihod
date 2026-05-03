import type { ComponentType, SVGProps } from 'react'
import Link from 'next/link'

import { DEFAULT_SITE_CHROME, getSiteChrome, menuHref, type HeaderCta } from '@/lib/chrome'

import { CloseDetailsOnClickOutside } from './_shared/CloseDetailsOnClickOutside'
import styles from './Header.module.css'
import {
  AlpinizmIcon,
  AvtovyshkaIcon,
  DemontazhPeregorodokIcon,
  DemontazhSaraevIcon,
  KablingIcon,
  KonteynerIcon,
  KorchevaniyeIcon,
  KronirovaniyeIcon,
  SanitarnayaIcon,
  SpilIcon,
  UborkaSnegaIcon,
  UdalenieCelikomIcon,
  UdalenieChastiamiIcon,
  ValkaIcon,
  VyvozBytovogoIcon,
  VyvozSnegaIcon,
  VyvozStroitelnogoIcon,
} from '@/components/icons/services'

/**
 * Header — server component.
 *
 * Эталон 1:1 — design-system/brand-guide.html секция «Mega-menu каталога услуг»
 * (live demo, ~строка 1216+) + components/navigation/mega-menu.spec.md.
 *
 *  - Brand: О-mark (зелёный круг #2d5a3d) + wordmark «ОБИХОД».
 *  - Услуги ▾ → mega-menu 4 колонки в порядке Q-14 (Мусор 3, Арбо 8,
 *    Крыши 6, Демонтаж 3) + sub-icons 20×20 stroke-only currentColor +
 *    featured row внизу. Порядок — под wsfreq Wave 2 US-4 (ADR-uМ-14).
 *  - Районы ▾ → 7 пилотных районов + «Все районы МО» footer.
 *  - 4 плоские: Кейсы / Цены / Блог / Контакты.
 *  - CTA «Получить смету» → #calc.
 *  - Mega-menu контент — hardcoded (по spec, не Payload). SiteChrome.header.menu
 *    не используется для содержимого dropdown'ов (контракт сохраняется,
 *    просто игнорируется для mega-menu — оператор может расширять
 *    отдельными итерациями).
 *
 * Visual: scoped CSS module Header.module.css, классы маппятся 1:1 на
 * gh-* паттерны эталона (.brand .mark .wordmark .nav .group .panel
 * .megaMenu .column .columnHeader .columnLink .featured).
 */

const BURGER_ID = 'site-header-burger'

type ServiceIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

interface ServiceItem {
  href: string
  label: string
  icon: ServiceIcon
}

interface MegaColumn {
  title: string
  items: ServiceItem[]
  allHref: string
  allLabel: string
}

// Порядок колонок в mega-menu = immutable из CLAUDE.md (Q-14, ADR-uМ-14):
// Мусор → Арбо → Крыши → Демонтаж — под wsfreq Wave 2 US-4 (vyvoz-musora 161К,
// arboristika 27К, chistka-krysh 888, demontazh 225).
//
// Все href — canonical из site/app/api/seed/route.ts +
// seosite/04-url-map/sitemap-tree.md v0.4 (US-5 REQ-5.6 follow-up, 2026-04-26).
// Раньше использовали legacy slug (`/musor/`, `/krysha/`, `/arboristika/spil/`)
// из brand-guide.html spec — переписаны на canonical, чтобы Header не вёл на
// 404. Sub-service страницы для большинства slug ещё не существуют (US-6),
// но pillar-страницы и programmatic district SD уже работают.
const MEGA_COLUMNS: MegaColumn[] = [
  {
    title: 'Вывоз мусора',
    items: [
      { href: '/vyvoz-musora/staraya-mebel/', label: 'Старая мебель', icon: VyvozBytovogoIcon },
      {
        href: '/vyvoz-musora/vyvoz-stroymusora/',
        label: 'Строительный мусор',
        icon: VyvozStroitelnogoIcon,
      },
      { href: '/vyvoz-musora/kontejner/', label: 'Контейнеры 7–30 м³', icon: KonteynerIcon },
    ],
    allHref: '/vyvoz-musora/',
    allLabel: 'Все услуги вывоза',
  },
  {
    title: 'Арбористика',
    items: [
      { href: '/arboristika/spil-derevev/', label: 'Спил деревьев', icon: SpilIcon },
      { href: '/arboristika/valka-derevev/', label: 'Валка частями', icon: ValkaIcon },
      {
        href: '/arboristika/avariynyy-spil/',
        label: 'Аварийный спил',
        icon: UdalenieCelikomIcon,
      },
      {
        href: '/arboristika/spil-alpinistami/',
        label: 'Спил альпинистами',
        icon: UdalenieChastiamiIcon,
      },
      { href: '/arboristika/udalenie-pnya/', label: 'Удаление пней', icon: KorchevaniyeIcon },
      { href: '/arboristika/kronirovanie/', label: 'Кронирование', icon: KronirovaniyeIcon },
      {
        href: '/arboristika/sanitarnaya-obrezka/',
        label: 'Санитарная обрезка',
        icon: SanitarnayaIcon,
      },
      { href: '/arboristika/kabling/', label: 'Каблинг', icon: KablingIcon },
    ],
    allHref: '/arboristika/',
    allLabel: 'Все услуги арбористики',
  },
  {
    title: 'Чистка крыш',
    items: [
      { href: '/chistka-krysh/ot-snega/', label: 'От снега', icon: UborkaSnegaIcon },
      {
        href: '/chistka-krysh/sbivanie-sosulek/',
        label: 'Сбивание сосулек',
        icon: VyvozSnegaIcon,
      },
      { href: '/promyshlennyj-alpinizm/', label: 'Промальп', icon: AlpinizmIcon },
      { href: '/arenda-tehniki/avtovyshka/', label: 'Автовышка', icon: AvtovyshkaIcon },
    ],
    allHref: '/chistka-krysh/',
    allLabel: 'Все услуги по крышам',
  },
  {
    title: 'Демонтаж',
    items: [
      { href: '/demontazh/demontazh-saraya/', label: 'Демонтаж сарая', icon: DemontazhSaraevIcon },
      {
        href: '/demontazh/demontazh-bani/',
        label: 'Демонтаж бани',
        icon: DemontazhPeregorodokIcon,
      },
    ],
    allHref: '/demontazh/',
    allLabel: 'Все услуги демонтажа',
  },
]

const PILOT_DISTRICTS: { slug: string; name: string }[] = [
  { slug: 'odincovo', name: 'Одинцово' },
  { slug: 'krasnogorsk', name: 'Красногорск' },
  { slug: 'mytishchi', name: 'Мытищи' },
  { slug: 'khimki', name: 'Химки' },
  { slug: 'istra', name: 'Истра' },
  { slug: 'pushkino', name: 'Пушкино' },
  { slug: 'ramenskoye', name: 'Раменское' },
]

/**
 * Плоские ссылки header'а — соответствуют эталону brand-guide.
 */
const FLAT_LINKS: { href: string; label: string }[] = [
  { href: '/kejsy/', label: 'Кейсы' },
  { href: '/#subscription', label: 'Цены' },
  { href: '/blog/', label: 'Блог' },
  { href: '/#contact', label: 'Контакты' },
]

/**
 * Header CTA по эталону brand-guide: текст всегда «Получить смету».
 */
const FIXED_CTA_LABEL = 'Получить смету'
const FALLBACK_CTA_TARGET: HeaderCta = {
  kind: 'anchor',
  anchor: 'calc',
}

export async function Header() {
  const chrome = await getSiteChrome()
  const safeChrome = chrome ?? DEFAULT_SITE_CHROME
  const header = safeChrome.header ?? DEFAULT_SITE_CHROME.header
  const contacts = safeChrome.contacts ?? DEFAULT_SITE_CHROME.contacts

  const ctaTarget = header?.cta && header.cta.kind ? header.cta : FALLBACK_CTA_TARGET
  const cta: HeaderCta = { ...ctaTarget, label: FIXED_CTA_LABEL }

  const phoneDisplay = contacts?.phoneDisplay ?? ''
  const phoneE164 = contacts?.phoneE164 ?? ''

  return (
    <header className={styles.site}>
      {/* sibling-checkbox для burger — должен идти ДО .inner. */}
      <input
        type="checkbox"
        id={BURGER_ID}
        className={styles.burger}
        hidden
        aria-hidden="true"
        defaultChecked={false}
      />
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Обиход — на главную" data-header-link>
          <span className={styles.mark} aria-hidden="true">
            О
          </span>
          <span className={styles.wordmark}>ОБИХОД</span>
        </Link>

        <nav className={styles.navWrap} aria-label="Основное меню">
          <ul className={styles.nav}>
            {/* ─── Услуги · MEGA MENU 3 колонки ─── */}
            <li>
              <details className={`${styles.group} ${styles.groupMega}`} data-header-group>
                <summary aria-haspopup="menu">
                  Услуги
                  <Chev />
                </summary>
                <div className={`${styles.panel} ${styles.megaPanel}`} role="menu">
                  <div className={styles.megaCols}>
                    {MEGA_COLUMNS.map((col) => (
                      <div key={col.title} className={styles.column}>
                        <h4 className={styles.columnHeader}>{col.title}</h4>
                        <ul className={styles.columnList}>
                          {col.items.map((item) => {
                            const Icon = item.icon
                            return (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  role="menuitem"
                                  className={styles.columnLink}
                                  data-header-link
                                >
                                  <span className={styles.columnIcon} aria-hidden="true">
                                    <Icon />
                                  </span>
                                  <span className={styles.columnLabel}>{item.label}</span>
                                  <span className={styles.columnArrow} aria-hidden="true">
                                    →
                                  </span>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                        <Link href={col.allHref} className={styles.columnAll} data-header-link>
                          {col.allLabel} →
                        </Link>
                      </div>
                    ))}
                  </div>

                  <div className={styles.featured}>
                    <strong className={styles.featuredTitle}>Раменское · зима 2026</strong>
                    <span className={styles.featuredCopy}>
                      фикс <span className={styles.featuredPrice}>12 800 ₽</span> за объект · смета
                      за 10 минут
                    </span>
                    <a href="#calc" className={styles.featuredBtn} data-header-link>
                      Оставить заявку
                    </a>
                  </div>
                </div>
              </details>
            </li>

            {/* ─── Районы dropdown ─── */}
            <li>
              <details className={styles.group} data-header-group>
                <summary aria-haspopup="menu">
                  Районы
                  <Chev />
                </summary>
                <div className={styles.panel} role="menu">
                  <ul className={styles.districtsList}>
                    {PILOT_DISTRICTS.map((d) => (
                      <li key={d.slug}>
                        <Link
                          role="menuitem"
                          href={`/raiony/${d.slug}/`}
                          className={styles.districtLink}
                          data-header-link
                        >
                          {d.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href="/raiony/" className={styles.districtsAll} data-header-link>
                    Все районы МО →
                  </Link>
                </div>
              </details>
            </li>

            {FLAT_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={styles.link} data-header-link>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.right}>
          {phoneE164 && phoneDisplay ? (
            <a href={`tel:${phoneE164}`} className={styles.phone}>
              {phoneDisplay}
            </a>
          ) : null}
          {cta.label ? <CtaLink cta={cta} /> : null}
        </div>

        <label
          htmlFor={BURGER_ID}
          className={styles.burgerLabel}
          aria-label="Открыть меню"
          role="button"
          tabIndex={0}
        >
          <span className={styles.burgerIcon} aria-hidden="true">
            <span />
          </span>
          <span className={styles.srOnly}>Открыть меню</span>
        </label>
      </div>

      <CloseDetailsOnClickOutside burgerId={BURGER_ID} />
    </header>
  )
}

function Chev() {
  return (
    <svg className={styles.chev} viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="M1.5 3.5 L5 7 L8.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CtaLink({ cta }: { cta: HeaderCta }) {
  const href = menuHref(cta)
  const label = cta.label ?? ''
  if (cta.kind === 'route') {
    return (
      <Link href={href} className={styles.cta} data-header-link>
        {label}
      </Link>
    )
  }
  if (cta.kind === 'external') {
    return (
      <a
        href={href}
        className={styles.cta}
        target="_blank"
        rel="noopener noreferrer"
        data-header-link
      >
        {label}
      </a>
    )
  }
  return (
    <a href={href} className={styles.cta} data-header-link>
      {label}
    </a>
  )
}
