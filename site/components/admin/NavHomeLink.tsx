import type { FC } from 'react'

/**
 * NavHomeLink — sidebar link «На сайт» для возврата на публичный obikhod.ru.
 *
 * Wired через admin.components.beforeNavLinks (payload.config.ts) — рендерится
 * первой записью внутри <nav class="nav__wrap"> перед native NavGroups.
 *
 * - target="_blank" + rel="noopener noreferrer" (security + UX: не теряем admin tab)
 * - aria-label полный («На сайт obikhod.ru, открыть в новой вкладке»)
 * - className `nav__link nav__link--home` — наследует W1+W8 sidebar styling
 *   (focus-visible, hover, opacity 0.65→0.9), но добавляем suffix для §B CSS hook
 * - SVG 14×14 line-art currentColor, brand-guide §9 (W8 visual language)
 *
 * Spec: PANEL-HEADER-CHROME-POLISH §B.
 */
const NavHomeLink: FC = () => {
  const href = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://obikhod.ru/'
  return (
    <a
      className="nav__link nav__link--home"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="На сайт obikhod.ru, открыть в новой вкладке"
    >
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
      <span className="nav__link-label">На сайт</span>
    </a>
  )
}

export default NavHomeLink
