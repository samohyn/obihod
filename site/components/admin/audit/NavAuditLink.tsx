import type { FC } from 'react'
import Link from 'next/link'

/**
 * NavAuditLink — sidebar link «История» → /admin/audit.
 *
 * Spec: PANEL-AUDIT-LOG AC1 + brand-guide §12 sidebar entry.
 * Wired через admin.components.beforeNavLinks (payload.config.ts) после NavHomeLink.
 *
 * Visible для всех ролей; на сервер endpoint /admin/audit RBAC enforced
 * (admin only). Линка остаётся видимой — operator UX feedback «функция
 * существует, тебе недоступна» лучше hidden.
 *
 * - className `nav__link nav__link--audit` — наследует sidebar styling
 * - SVG 14×14 line-art clock-history (brand-guide §9 49-glyph set fallback)
 */
const NavAuditLink: FC = () => {
  return (
    <Link className="nav__link nav__link--audit" href="/admin/audit" aria-label="История изменений">
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
        <path d="M12 7 L12 12 L15 14" />
        <path d="M3 12 L5 12" />
      </svg>
      <span className="nav__link-label">История</span>
    </Link>
  )
}

export default NavAuditLink
