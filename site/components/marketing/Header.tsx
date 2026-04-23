import Link from 'next/link'

import {
  DEFAULT_SITE_CHROME,
  getSiteChrome,
  menuHref,
  type HeaderCta,
  type MenuItem,
} from '@/lib/chrome'

import { LogoMark } from './_shared/LogoMark'

/**
 * Header — server component, тонкая читалка `SiteChrome` global (US-2).
 *
 * Контракт:
 *  - все редактируемые тексты/ссылки/телефон — из global;
 *  - если global пуст или чтение упало — рендерим fallback
 *    (DEFAULT_SITE_CHROME), чтобы первый запуск prod без seed не падал
 *    в белый экран (AC-4.1 / AC-4.2);
 *  - визуал сохранён: классы Tailwind/globals.css (`.nav`, `.nav-*`,
 *    `.btn btn-primary`) не менялись.
 */
export async function Header() {
  const chrome = (await getSiteChrome()) ?? DEFAULT_SITE_CHROME
  const header = chrome.header ?? DEFAULT_SITE_CHROME.header
  const contacts = chrome.contacts ?? DEFAULT_SITE_CHROME.contacts

  const menu: MenuItem[] =
    header?.menu && header.menu.length > 0
      ? header.menu
      : (DEFAULT_SITE_CHROME.header?.menu ?? [])

  const cta: HeaderCta | null | undefined =
    header?.cta ?? DEFAULT_SITE_CHROME.header?.cta

  const phoneDisplay = contacts?.phoneDisplay ?? ''
  const phoneE164 = contacts?.phoneE164 ?? ''

  return (
    <nav className="nav" aria-label="Основное меню">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" style={{ color: 'var(--c-primary)' }}>
          <LogoMark size={36} animated />
          <span className="nav-logo-word" style={{ color: 'var(--c-ink)' }}>
            Обиход<sup className="nav-reg">®</sup>
          </span>
        </Link>
        <div className="nav-links">
          {menu.map((item, idx) => (
            <MenuLink key={`${item.kind}-${item.label}-${idx}`} item={item} />
          ))}
        </div>
        <div className="nav-right">
          {phoneE164 && phoneDisplay ? (
            <a href={`tel:${phoneE164}`} className="nav-phone">
              {phoneDisplay}
            </a>
          ) : null}
          {cta?.label ? (
            <CtaLink cta={cta} />
          ) : null}
        </div>
      </div>
    </nav>
  )
}

function MenuLink({ item }: { item: MenuItem }) {
  const href = menuHref(item)
  if (item.kind === 'route') {
    return <Link href={href}>{item.label}</Link>
  }
  if (item.kind === 'external') {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {item.label}
      </a>
    )
  }
  // anchor
  return <a href={href}>{item.label}</a>
}

function CtaLink({ cta }: { cta: HeaderCta }) {
  const href = menuHref(cta)
  const label = cta.label ?? ''
  const className = 'btn btn-primary'
  const style = { padding: '12px 18px', fontSize: '14px' } as const
  if (cta.kind === 'route') {
    return (
      <Link href={href} className={className} style={style}>
        {label}
      </Link>
    )
  }
  if (cta.kind === 'external') {
    return (
      <a
        href={href}
        className={className}
        style={style}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    )
  }
  return (
    <a href={href} className={className} style={style}>
      {label}
    </a>
  )
}
