import type { FC } from 'react'
import Link from 'next/link'

/**
 * NavHelpLink — пункт меню «Как сделать…» → /admin/help (HelpView). Подключён через
 * admin.components.beforeNavLinks (payload.config.ts) после «Истории».
 */
const NavHelpLink: FC = () => {
  return (
    <Link className="nav__link nav__link--help" href="/admin/help" aria-label="Как сделать…">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14" />
        <path d="M12 17.5h.01" />
      </svg>
      <span className="nav__link-label">Как сделать…</span>
    </Link>
  )
}

export default NavHelpLink
