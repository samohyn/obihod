'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/blocks/v3/shared'
import type { NavItem } from '@/lib/chrome'

import { activeNavIndex } from './activeHref'
import s from './chrome.module.css'

/**
 * Верхнее меню на компьютере. Пункт со списком — кнопка-раскрывашка (WAI-ARIA disclosure):
 * открывается наведением и кликом, закрывается Esc, кликом мимо, уходом фокуса и переходом.
 */
export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname() ?? '/'
  const active = activeNavIndex(items, pathname)
  // Список помнит адрес, на котором открыт: после перехода он закрыт сам собой.
  const [state, setState] = useState<{ index: number; path: string } | null>(null)
  const open = state?.path === pathname ? state.index : null
  const setOpen = (index: number | null) =>
    setState(index === null ? null : { index, path: pathname })
  const navRef = useRef<HTMLElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setState(null)
      navRef.current?.querySelector<HTMLButtonElement>(`[data-dd="${open}"]`)?.focus()
    }
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setState(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  const hoverOpen = (i: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(i)
  }
  const hoverClose = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 150)
  }

  return (
    <nav ref={navRef} className={s.nav} aria-label="Основное меню">
      <ul className={s.navList}>
        {items.map((item, i) => {
          const children = item.children ?? []
          if (children.length === 0) {
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={s.navLink}
                  aria-current={active === i ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            )
          }
          const panelId = `nav-panel-${i}`
          return (
            <li
              key={item.href}
              className={s.navDd}
              onPointerEnter={(e) => e.pointerType === 'mouse' && hoverOpen(i)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && hoverClose()}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(null)
              }}
            >
              <button
                type="button"
                data-dd={i}
                className={s.navLink}
                aria-expanded={open === i}
                aria-controls={panelId}
                data-active={active === i || undefined}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {item.label}
                <Icon name="chevron" size={14} className={s.navChevron} />
              </button>
              <div
                id={panelId}
                className={[s.panel, children.length > 5 ? s.panelWide : ''].join(' ')}
                hidden={open !== i}
              >
                <ul className={s.panelList}>
                  {children.map((child) => (
                    <li key={child.href}>
                      <Link href={child.href} className={s.panelLink}>
                        <b>{child.label}</b>
                        {child.text && <span>{child.text}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={item.href} className={s.panelAll}>
                  Весь раздел «{item.label}»
                  <Icon name="arrow" size={16} />
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
