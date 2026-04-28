'use client'

import { useEffect } from 'react'
import Link from 'next/link'

/**
 * Global error boundary для admin route group (Wave 5 · PAN-4).
 *
 * Срабатывает при uncaught exception в server/client рендере /admin/*.
 * Показывает 500 fallback по brand-guide §12.5 + кнопку retry через `reset()`.
 *
 * Sentry conditional integration (popanel decision Q2 2026-04-28):
 * captureException обёрнут в `if (window.Sentry)` — no-op если Sentry не
 * подключен. Когда `do` включит Sentry — заработает автоматом.
 *
 * ADR-0005 Уровень 2: native Next.js Route Segment, не override Payload core.
 */

import type { CSSProperties } from 'react'

const wrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '60px 24px',
  fontFamily: 'var(--font-body)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  background: 'var(--brand-obihod-card, #ffffff)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius, 10px)',
  maxWidth: 480,
  margin: '32px auto',
}

const eyebrowStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--brand-obihod-muted, #6b6256)',
  margin: 0,
  marginBottom: 8,
}

const titleStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  letterSpacing: '-0.015em',
  lineHeight: 1.2,
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  margin: 0,
  marginBottom: 8,
}

const textStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.5,
  color: 'var(--brand-obihod-ink-soft, #2b2b2b)',
  margin: 0,
  marginBottom: 20,
  maxWidth: 320,
}

const actionsRowStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  justifyContent: 'center',
}

const primaryBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 16px',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  border: '1px solid var(--brand-obihod-accent, #e6a23c)',
  background: 'var(--brand-obihod-accent, #e6a23c)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  fontWeight: 600,
  fontSize: 13,
  textDecoration: 'none',
  minHeight: 40,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const secondaryBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 16px',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  background: 'transparent',
  color: 'var(--brand-obihod-primary, #2d5a3d)',
  fontWeight: 500,
  fontSize: 13,
  textDecoration: 'none',
  minHeight: 40,
}

const detailsStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--brand-obihod-muted, #6b6256)',
  marginTop: 16,
  padding: '8px 12px',
  background: 'var(--brand-obihod-paper-warm, #efebe0)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  maxWidth: 420,
  wordBreak: 'break-word',
  textAlign: 'left' as const,
}

interface AdminErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    // Conditional Sentry — no-op если Sentry не подключен (popanel Q2 2026-04-28)
    if (typeof window !== 'undefined') {
      const sentry = (window as unknown as { Sentry?: { captureException?: (err: Error) => void } })
        .Sentry
      if (sentry?.captureException) {
        sentry.captureException(error)
      }
    }
    // eslint-disable-next-line no-console
    console.error('[admin/error.tsx]', error)
  }, [error])

  return (
    <section style={wrapStyle} role="region" aria-label="Ошибка сервера">
      <p style={eyebrowStyle}>500 · server error</p>
      <h2 style={titleStyle}>Что-то пошло не так на сервере</h2>
      <p style={textStyle}>
        Мы получили уведомление и разбираемся. Попробуй обновить страницу через минуту.
      </p>
      <div style={actionsRowStyle}>
        <button type="button" onClick={reset} style={primaryBtnStyle}>
          Попробовать ещё раз
        </button>
        <Link href="/admin" style={secondaryBtnStyle}>
          На главную
        </Link>
      </div>
      {process.env.NODE_ENV === 'development' && error.message ? (
        <pre style={detailsStyle}>
          {error.message}
          {error.digest ? `\ndigest: ${error.digest}` : ''}
        </pre>
      ) : null}
    </section>
  )
}
