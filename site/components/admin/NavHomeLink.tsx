import type { FC } from 'react'
import Link from 'next/link'

/**
 * NavHomeLink — sidebar link «Вернуться в панель» → /admin/.
 *
 * Wired через admin.components.beforeNavLinks (payload.config.ts) — рендерится
 * первой записью внутри <nav class="nav__wrap"> перед native NavGroups.
 *
 * Оператор 2026-05-01: переименован с «На сайт» (target=_blank → obikhod.ru/)
 * на «Вернуться в панель» (same-tab → /admin/).
 *
 * - className `nav__link nav__link--home` — наследует W1+W8 sidebar styling
 *   (focus-visible, hover, opacity 0.65→0.9)
 * - SVG 14×14 line-art currentColor, brand-guide §9
 */
const NavHomeLink: FC = () => {
  return (
    <Link className="nav__link nav__link--home" href="/admin/" aria-label="Вернуться в панель">
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
        <path d="M3 11 L12 4 L21 11" />
        <path d="M5 10 L5 20 L19 20 L19 10" />
        <path d="M10 20 L10 14 L14 14 L14 20" />
      </svg>
      <span className="nav__link-label">Вернуться в панель</span>
    </Link>
  )
}

export default NavHomeLink
