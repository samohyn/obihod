import { ButtonLink, Icon, type IconName, Wrap } from '@/components/blocks/v3/shared'
import { ICON_NAMES } from '@/components/blocks/v3/iconNames'
import { getChromeView, getContacts } from '@/lib/chrome'

import { DesktopNav } from './DesktopNav'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import s from './chrome.module.css'

const toIcon = (name: string): IconName =>
  (ICON_NAMES as readonly string[]).includes(name) ? (name as IconName) : 'check'

/**
 * Шапка по макету главной C4 (план 09, этап 2): тёмная полоса фактов, логотип, меню,
 * телефон с режимом работы и главная кнопка. Всё — из «Шапка, подвал и контакты» в админке.
 * Липкая: полоса уезжает, строка с меню остаётся.
 */
export async function SiteHeader() {
  const [view, contacts] = await Promise.all([getChromeView(), getContacts()])
  const phone = { display: contacts.phoneDisplay, href: `tel:${contacts.phoneE164}` }
  const ctaIcon: IconName = view.cta.href.startsWith('tel:') ? 'phone' : 'camera'

  return (
    <header className={s.header}>
      <div className={s.util}>
        <Wrap className={s.utilRow}>
          {view.utility.map((item, i) => (
            <span
              key={item.text}
              className={[s.utilItem, i === 1 ? s.fromTablet : '', i > 1 ? s.fromDesktop : ''].join(
                ' ',
              )}
            >
              <Icon name={toIcon(item.icon)} size={15} />
              {item.text}
            </span>
          ))}
          <span className={s.utilLinks}>
            {view.messengers.map((m) => (
              <a key={m.href} href={m.href} target="_blank" rel="noopener noreferrer">
                <Icon name="send" size={15} />
                {m.label}
              </a>
            ))}
            {contacts.email && <a href={`mailto:${contacts.email}`}>{contacts.email}</a>}
          </span>
        </Wrap>
      </div>

      <div className={s.bar}>
        <Wrap className={s.barRow}>
          <Logo />
          <DesktopNav items={view.nav} />
          <div className={s.contact}>
            <a className={s.tel} href={phone.href}>
              <b>{phone.display}</b>
              <span>{view.hours}</span>
            </a>
            <a className={s.telIcon} href={phone.href} aria-label={`Позвонить: ${phone.display}`}>
              <Icon name="phone" size={22} />
            </a>
            <ButtonLink href={view.cta.href} icon={ctaIcon} className={s.cta}>
              {view.cta.label}
            </ButtonLink>
            <MobileMenu
              nav={view.nav}
              extra={view.mobileExtra}
              phone={phone}
              hours={view.hours}
              cta={view.cta}
              email={contacts.email}
              messengers={view.messengers}
            />
          </div>
        </Wrap>
      </div>
    </header>
  )
}
