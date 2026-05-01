import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import { Gutter } from '@payloadcms/ui'

import AuditTimeline from './AuditTimeline'

/**
 * AuditView — custom Payload view at /admin/audit.
 *
 * Spec: PANEL-AUDIT-LOG AC1+AC2 (timeline + filters).
 * ADR-0014 — Hybrid storage (Payload versions + custom audit_log + PII masking).
 *
 * Server component:
 *   - Проверяет initPageResult.req.user — admin only.
 *   - Рендерит client AuditTimeline (filters, list, pagination).
 *
 * Path: '/audit' зарегистрирован в payload.config.ts admin.views.audit.
 */
export default function AuditView({ initPageResult }: AdminViewServerProps) {
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
      <p
        style={{
          fontSize: 14,
          color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
          marginTop: 0,
          marginBottom: 24,
          lineHeight: 1.5,
          maxWidth: 720,
        }}
      >
        Кто и когда менял документы. Контентные коллекции — через Payload Versions, заявки и
        пользователи — через защищённый журнал с маскированием PII (телефон, email).
      </p>
      <AuditTimeline />
    </Gutter>
  )
}
