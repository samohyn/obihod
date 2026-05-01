import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Gutter } from '@payloadcms/ui'

import AuditDiffPanel from './AuditDiffPanel'

/**
 * AuditDiffView — custom Payload view at /admin/audit/[id].
 *
 * Spec: PANEL-AUDIT-LOG AC3 (side-by-side diff).
 * Server-side fetches user → guards admin role → mounts client diff panel.
 *
 * id parsed from path segments (Payload передаёт routeSegments в initPageResult).
 */
export default function AuditDiffView({ initPageResult }: AdminViewServerProps) {
  const user = initPageResult.req.user as
    | { id: string | number; email: string; role?: string }
    | null
    | undefined

  if (!user) {
    redirect('/admin/login')
  }
  if (user?.role !== 'admin') {
    return (
      <Gutter>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 600,
            marginBottom: 8,
            color: 'var(--brand-obihod-ink, #1c1c1c)',
          }}
        >
          История изменений
        </h1>
        <p style={{ color: 'var(--brand-obihod-ink-muted, #6b6b6b)' }}>
          Доступно только администраторам.
        </p>
      </Gutter>
    )
  }

  // initPageResult.params is unstable typing; safer parse from URL on client.
  return (
    <Gutter>
      <Link
        href="/admin/audit"
        style={{
          fontSize: 13,
          color: 'var(--brand-obihod-primary, #2d5a3d)',
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: 12,
        }}
      >
        ← К истории
      </Link>
      <h1
        style={{
          fontSize: 22,
          fontWeight: 600,
          marginBottom: 8,
          color: 'var(--brand-obihod-ink, #1c1c1c)',
        }}
      >
        Изменение
      </h1>
      <AuditDiffPanel />
    </Gutter>
  )
}
