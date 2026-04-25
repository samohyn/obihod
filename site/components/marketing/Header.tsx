import Link from 'next/link'

import { DEFAULT_SITE_CHROME, getSiteChrome, menuHref, type HeaderCta } from '@/lib/chrome'
import { payloadClient } from '@/lib/payload'
import { unstable_cache } from 'next/cache'

import { LogoMark } from './_shared/LogoMark'
import { CloseDetailsOnClickOutside } from './_shared/CloseDetailsOnClickOutside'
import styles from './Header.module.css'

/**
 * Header — server component.
 *
 * Архитектура:
 *  - Sticky-header с backdrop blur.
 *  - 3 native <details>-dropdown'а: Услуги (4 pillar) / Районы (приоритет A)
 *    / Компания (статика).
 *  - Slot 1 — лого, slot 2 — nav, slot 3 — телефон + CTA, slot 4 — burger
 *    (только на mobile <860px).
 *  - Источник данных: SiteChrome global (контракт сохранён) + прямые
 *    payload.find для актуальных slugs Services/Districts.
 *  - Visual: scoped CSS module (Header.module.css), копия паттернов
 *    из design-system/brand-guide.html (.gh-* → camelCase).
 *  - JS-«залипание» решает CloseDetailsOnClickOutside (минимальный
 *    'use client' — единственный hydration-island на header'е).
 *
 * Fallback-стратегия (AC-4.1/4.2): если Payload пуст или упал —
 * подставляем константы для районов/сервисов, чтобы dropdown'ы не были
 * пустыми на первом запуске prod без seed.
 */

const BURGER_ID = 'site-header-burger'

interface NavService {
  slug: string
  title: string
}

interface NavDistrict {
  slug: string
  nameNominative: string
}

const FALLBACK_SERVICES: NavService[] = [
  { slug: 'arboristika', title: 'Арбористика' },
  { slug: 'ochistka-krysh', title: 'Чистка крыш' },
  { slug: 'vyvoz-musora', title: 'Вывоз мусора' },
  { slug: 'demontazh', title: 'Демонтаж' },
]

const FALLBACK_DISTRICTS: NavDistrict[] = [
  { slug: 'odintsovo', nameNominative: 'Одинцово' },
  { slug: 'krasnogorsk', nameNominative: 'Красногорск' },
  { slug: 'mytishchi', nameNominative: 'Мытищи' },
  { slug: 'khimki', nameNominative: 'Химки' },
  { slug: 'istra', nameNominative: 'Истра' },
  { slug: 'pushkino', nameNominative: 'Пушкино' },
  { slug: 'ramenskoye', nameNominative: 'Раменское' },
]

const COMPANY_LINKS = [
  { href: '/kejsy/', label: 'Кейсы' },
  { href: '/komanda/', label: 'Команда' },
  { href: '/litsenzii/', label: 'Лицензии' },
  { href: '/blog/', label: 'Блог' },
]

/**
 * Сервисы для nav-меню. Только slug + title, без тяжёлых полей.
 * Кешируется тегом `services` — синхронно с Services.afterChange revalidate.
 */
const getNavServices = unstable_cache(
  async (): Promise<NavService[]> => {
    try {
      const payload = await payloadClient()
      const r = await payload.find({
        collection: 'services',
        limit: 10,
        pagination: false,
        depth: 0,
        select: { slug: true, title: true },
      })
      const docs: NavService[] = r.docs
        .map((d) => {
          const slug = (d as { slug?: unknown }).slug
          const title = (d as { title?: unknown }).title
          if (typeof slug === 'string' && typeof title === 'string') {
            return { slug, title }
          }
          return null
        })
        .filter((x): x is NavService => x !== null)
      return docs.length > 0 ? docs : FALLBACK_SERVICES
    } catch {
      return FALLBACK_SERVICES
    }
  },
  ['nav-services'],
  { revalidate: 3600, tags: ['services'] },
)

/**
 * Районы priority=A (пилотные). Только slug + nameNominative.
 */
const getNavDistricts = unstable_cache(
  async (): Promise<NavDistrict[]> => {
    try {
      const payload = await payloadClient()
      const r = await payload.find({
        collection: 'districts',
        where: { priority: { equals: 'A' } },
        limit: 10,
        pagination: false,
        depth: 0,
        sort: 'nameNominative',
        select: { slug: true, nameNominative: true },
      })
      const docs: NavDistrict[] = r.docs
        .map((d) => {
          const slug = (d as { slug?: unknown }).slug
          const nameNominative = (d as { nameNominative?: unknown }).nameNominative
          if (typeof slug === 'string' && typeof nameNominative === 'string') {
            return { slug, nameNominative }
          }
          return null
        })
        .filter((x): x is NavDistrict => x !== null)
      return docs.length > 0 ? docs : FALLBACK_DISTRICTS
    } catch {
      return FALLBACK_DISTRICTS
    }
  },
  ['nav-districts-a'],
  { revalidate: 3600, tags: ['districts'] },
)

export async function Header() {
  const [chrome, services, districts] = await Promise.all([
    getSiteChrome(),
    getNavServices(),
    getNavDistricts(),
  ])
  const safeChrome = chrome ?? DEFAULT_SITE_CHROME
  const header = safeChrome.header ?? DEFAULT_SITE_CHROME.header
  const contacts = safeChrome.contacts ?? DEFAULT_SITE_CHROME.contacts

  const cta: HeaderCta | null | undefined = header?.cta ?? DEFAULT_SITE_CHROME.header?.cta

  const phoneDisplay = contacts?.phoneDisplay ?? ''
  const phoneE164 = contacts?.phoneE164 ?? ''

  return (
    <header className={styles.site}>
      {/* sibling-checkbox для burger — должен идти ДО .inner, чтобы
          селектор `.burger:checked ~ .inner ...` работал. */}
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
          <span className={styles.brandMark} aria-hidden="true">
            <LogoMark size={36} animated />
          </span>
          <span className={styles.brandWord}>
            Обиход<sup className={styles.brandReg}>®</sup>
          </span>
        </Link>

        <nav className={styles.navWrap} aria-label="Основное меню">
          <ul className={styles.nav}>
            <li>
              <details className={styles.group} data-header-group>
                <summary aria-haspopup="menu">
                  Услуги
                  <Chev />
                </summary>
                <div className={styles.panel} role="menu">
                  <ul>
                    {services.map((s, idx) => (
                      <li key={s.slug}>
                        <Link role="menuitem" href={`/${s.slug}/`} data-header-link>
                          <span className={styles.panelNum}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </li>
            <li>
              <details className={styles.group} data-header-group>
                <summary aria-haspopup="menu">
                  Районы
                  <Chev />
                </summary>
                <div className={styles.panel} role="menu">
                  <ul>
                    {districts.map((d, idx) => (
                      <li key={d.slug}>
                        <Link role="menuitem" href={`/raiony/${d.slug}/`} data-header-link>
                          <span className={styles.panelNum}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          {d.nameNominative}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </li>
            <li>
              <details className={styles.group} data-header-group>
                <summary aria-haspopup="menu">
                  Компания
                  <Chev />
                </summary>
                <div className={styles.panel} role="menu">
                  <ul>
                    {COMPANY_LINKS.map((c, idx) => (
                      <li key={c.href}>
                        <Link role="menuitem" href={c.href} data-header-link>
                          <span className={styles.panelNum}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </li>
          </ul>
        </nav>

        <div className={styles.right}>
          {phoneE164 && phoneDisplay ? (
            <a href={`tel:${phoneE164}`} className={styles.phone}>
              {phoneDisplay}
            </a>
          ) : null}
          {cta?.label ? <CtaLink cta={cta} /> : null}
        </div>

        <label
          htmlFor={BURGER_ID}
          className={styles.burgerLabel}
          aria-label="Открыть меню"
          role="button"
          tabIndex={0}
        >
          <span className={styles.burgerIcon}>
            <span />
          </span>
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
