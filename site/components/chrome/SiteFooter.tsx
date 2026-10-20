import Link from 'next/link'

import { ButtonLink, Wrap } from '@/components/blocks/v3/shared'
import { getChromeView, getContacts } from '@/lib/chrome'
import { CONSENT_URL, PRIVACY_URL } from '@/lib/legal'

import { Logo } from './Logo'
import s from './chrome.module.css'

/**
 * Подвал по макету C4: логотип и текст, до трёх колонок ссылок из админки, колонка контактов,
 * реквизиты и документы. На телефоне — закреплённая снизу панель «Позвонить» + главная кнопка.
 */
export async function SiteFooter() {
  const [view, contacts] = await Promise.all([getChromeView(), getContacts()])
  const phoneHref = `tel:${contacts.phoneE164}`
  const address = [contacts.addressLocality, contacts.streetAddress].filter(Boolean).join(', ')
  const legal = [
    `© ${new Date().getFullYear()} ${contacts.legalName}`,
    contacts.taxId && `ИНН ${contacts.taxId}`,
    contacts.ogrn && `ОГРН ${contacts.ogrn}`,
  ].filter(Boolean)

  return (
    <>
      <footer className={s.footer}>
        <Wrap>
          <div className={s.footTop}>
            <div className={s.footBrand}>
              <Logo light />
              <p className={s.footAbout}>{view.footerAbout}</p>
            </div>
            {view.footerNav.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className={s.footTitle}>{col.title}</h2>
                <ul className={s.footList}>
                  {(col.items ?? []).map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div>
              <h2 className={s.footTitle}>Контакты</h2>
              <ul className={s.footList}>
                <li>
                  <a className={s.footTel} href={phoneHref}>
                    {contacts.phoneDisplay}
                  </a>
                </li>
                {contacts.email && (
                  <li>
                    <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
                  </li>
                )}
                {address && <li>{address}</li>}
                <li>{view.hours}</li>
                {view.messengers.map((m) => (
                  <li key={m.href}>
                    <a href={m.href} target="_blank" rel="noopener noreferrer">
                      {m.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={s.footBottom}>
            <span>{legal.join(' · ')}</span>
            <span className={s.footDocs}>
              <Link href={PRIVACY_URL}>Политика конфиденциальности</Link>
              <span aria-hidden> · </span>
              <Link href={CONSENT_URL}>Согласие на обработку данных</Link>
            </span>
          </div>
        </Wrap>
      </footer>
      <div className={s.mbarSpacer} aria-hidden />
      <div className={s.mbar}>
        <ButtonLink href={phoneHref} variant="ghost" icon="phone">
          Позвонить
        </ButtonLink>
        <ButtonLink href={view.cta.href} icon="camera">
          {view.cta.label}
        </ButtonLink>
      </div>
    </>
  )
}
