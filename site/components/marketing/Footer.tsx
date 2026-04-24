import Link from 'next/link'

import {
  DEFAULT_SITE_CHROME,
  getSiteChrome,
  menuHref,
  socialHref,
  socialLabel,
  type FooterColumn,
  type MenuItem,
  type SocialLink,
} from '@/lib/chrome'

import { LogoMark } from './_shared/LogoMark'

/**
 * Footer — server component, тонкая читалка `SiteChrome` global (US-2).
 *
 * Контракт:
 *  - слоган, колонки меню, соцсети, реквизиты, URL политики/оферты —
 *    из Payload;
 *  - копирайт: `{copyrightPrefix} {текущий год}` (год вычисляется в
 *    рантайме — не хранится в БД, см. AC-10.1/10.2);
 *  - при пустом global или ошибке чтения — fallback на DEFAULT_SITE_CHROME
 *    (AC-4.1 / AC-4.2), реквизитный блок при отсутствии данных скрыт;
 *  - визуал сохранён: классы `.foot`, `.foot-grid`, `.foot-col`, `.foot-brand`,
 *    `.foot-slogan`, `.foot-bottom`, `.nav-logo*` не менялись.
 */
export async function Footer() {
  const chrome = (await getSiteChrome()) ?? DEFAULT_SITE_CHROME
  const footer = chrome.footer ?? DEFAULT_SITE_CHROME.footer
  const contacts = chrome.contacts ?? DEFAULT_SITE_CHROME.contacts
  const requisites = chrome.requisites ?? {}
  const social: SocialLink[] = chrome.social ?? []

  const columns: FooterColumn[] = footer?.columns ?? []

  const slogan = footer?.slogan ?? ''
  const privacyUrl = footer?.privacyUrl ?? '/politika-konfidentsialnosti/'
  const ofertaUrl = footer?.ofertaUrl ?? '/oferta/'
  const copyrightPrefix = footer?.copyrightPrefix ?? '© Обиход,'
  const year = new Date().getFullYear()

  const phoneDisplay = contacts?.phoneDisplay ?? ''
  const phoneE164 = contacts?.phoneE164 ?? ''
  const email = contacts?.email ?? ''

  // Реквизиты: блок рендерится, только если есть хотя бы одно заполненное поле.
  const hasAnyRequisite = Boolean(
    requisites.legalName ||
    requisites.taxId ||
    requisites.kpp ||
    requisites.ogrn ||
    requisites.addressRegion ||
    requisites.addressLocality ||
    requisites.streetAddress ||
    requisites.postalCode,
  )
  const addressLine = [
    requisites.postalCode,
    requisites.addressRegion,
    requisites.addressLocality,
    requisites.streetAddress,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="nav-logo" style={{ color: 'var(--c-accent)' }}>
              <LogoMark size={40} />
              <span className="nav-logo-word">Обиход</span>
            </div>
            {slogan ? <div className="foot-slogan">{slogan}</div> : null}
          </div>

          {columns.map((col, idx) => (
            <div className="foot-col" key={`${col.title}-${idx}`}>
              <h4>{col.title}</h4>
              {col.items && col.items.length > 0 ? (
                <ul>
                  {col.items.map((item, itemIdx) => (
                    <li key={`${item.kind}-${item.label}-${itemIdx}`}>
                      <FooterMenuLink item={item} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}

          {(phoneE164 || email || social.length > 0) && (
            <div className="foot-col">
              <h4>Контакты</h4>
              <ul>
                {phoneE164 && phoneDisplay ? (
                  <li>
                    <a href={`tel:${phoneE164}`} data-channel="phone">
                      {phoneDisplay}
                    </a>
                  </li>
                ) : null}
                {email ? (
                  <li>
                    <a href={`mailto:${email}`}>{email}</a>
                  </li>
                ) : null}
                {social.map((link, idx) => (
                  <li key={`${link.type}-${idx}`}>
                    <a
                      href={socialHref(link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-channel={link.type}
                      aria-label={socialLabel(link.type)}
                    >
                      {socialLabel(link.type)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {hasAnyRequisite ? (
          <div
            className="foot-bottom"
            style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}
          >
            <div>
              {[
                requisites.legalName,
                requisites.taxId ? `ИНН ${requisites.taxId}` : null,
                requisites.kpp ? `КПП ${requisites.kpp}` : null,
                requisites.ogrn ? `ОГРН ${requisites.ogrn}` : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </div>
            {addressLine ? <div>{addressLine}</div> : null}
          </div>
        ) : null}

        <div className="foot-bottom">
          <div>
            {copyrightPrefix} {year}
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link href={privacyUrl}>Политика конфиденциальности</Link>
            <Link href={ofertaUrl}>Публичная оферта</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterMenuLink({ item }: { item: MenuItem }) {
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
  return <a href={href}>{item.label}</a>
}
