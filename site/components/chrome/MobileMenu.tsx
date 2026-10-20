'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { ButtonLink, Icon } from '@/components/blocks/v3/shared'
import type { NavItem, NavLink } from '@/lib/chrome'

import { activeNavIndex } from './activeHref'
import s from './chrome.module.css'
import { CloseIcon, MenuIcon } from './icons'

/**
 * Меню на телефоне и планшете: панель справа на нативном <dialog> (фокус внутри, Esc,
 * фон неактивен). Разделы со списками — раскрывающиеся; внизу телефон и две кнопки.
 */
export function MobileMenu({
  nav,
  extra,
  phone,
  hours,
  cta,
  email,
  messengers,
}: {
  nav: NavItem[]
  extra: NavLink[]
  phone: { display: string; href: string }
  hours: string
  cta: NavLink
  email: string
  messengers: NavLink[]
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const pathname = usePathname() ?? '/'
  const active = activeNavIndex(nav, pathname)

  useEffect(() => {
    dialog.current?.close()
  }, [pathname])

  const close = () => dialog.current?.close()

  return (
    <>
      <button
        type="button"
        className={s.burger}
        aria-haspopup="dialog"
        aria-label="Открыть меню"
        onClick={() => dialog.current?.showModal()}
      >
        <MenuIcon />
      </button>
      <dialog
        ref={dialog}
        className={s.drawer}
        aria-label="Меню сайта"
        data-site-menu
        onClick={(e) => {
          // Клик по затемнению (сам <dialog>) или по ссылке — закрыть.
          const target = e.target as Element
          if (target === dialog.current || target.closest('a')) close()
        }}
      >
        <div className={s.drawerInner}>
          <div className={s.drawerHead}>
            <span className={s.drawerTitle}>Меню</span>
            <button
              type="button"
              className={s.drawerClose}
              aria-label="Закрыть меню"
              onClick={close}
            >
              <CloseIcon />
            </button>
          </div>

          <nav aria-label="Разделы сайта">
            <ul className={s.mList}>
              {nav.map((item, i) => {
                const children = item.children ?? []
                return (
                  <li key={item.href}>
                    {children.length === 0 ? (
                      <Link
                        href={item.href}
                        className={s.mLink}
                        aria-current={active === i ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <details className={s.mGroup}>
                        <summary className={s.mLink}>
                          {item.label}
                          <Icon name="chevron" size={18} className={s.mChevron} />
                        </summary>
                        <ul className={s.mSub}>
                          {children.map((child) => (
                            <li key={child.href}>
                              <Link href={child.href}>{child.label}</Link>
                            </li>
                          ))}
                          <li>
                            <Link href={item.href} className={s.mAll}>
                              Весь раздел «{item.label}»
                            </Link>
                          </li>
                        </ul>
                      </details>
                    )}
                  </li>
                )
              })}
            </ul>
            {extra.length > 0 && (
              <ul className={s.mExtra}>
                {extra.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </nav>

          <div className={s.mContact}>
            <a className={s.mTel} href={phone.href}>
              {phone.display}
            </a>
            <span className={s.mHours}>{hours}</span>
            <div className={s.mButtons}>
              <ButtonLink href={phone.href} variant="ghost" icon="phone">
                Позвонить
              </ButtonLink>
              <ButtonLink href={cta.href} icon="camera">
                {cta.label}
              </ButtonLink>
            </div>
            <div className={s.mLinks}>
              {messengers.map((m) => (
                <a key={m.href} href={m.href} target="_blank" rel="noopener noreferrer">
                  {m.label}
                </a>
              ))}
              {email && <a href={`mailto:${email}`}>{email}</a>}
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
