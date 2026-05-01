'use client'

import { useState, type FormEvent } from 'react'
import { ModalOverlay } from './SecurityPanel'

/**
 * TwoFactorDisableDialog — отключение 2FA с re-auth (password + OTP/recovery).
 *
 * Spec: PANEL-AUTH-2FA AC-5.
 */

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function TwoFactorDisableDialog({ onClose, onSuccess }: Props) {
  const [password, setPassword] = useState('')
  const [otpOrRecovery, setOtpOrRecovery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth/2fa-disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, otpOrRecovery }),
      })
      const json = (await res.json().catch(() => null)) as
        | { data?: { ok: boolean } }
        | { error?: { message?: string } }
        | null
      if (!res.ok || !json || 'error' in json) {
        const msg = (json && 'error' in json && json.error?.message) || 'Не удалось отключить 2FA.'
        setError(msg)
        setLoading(false)
        return
      }
      onSuccess()
    } catch {
      setError('Сетевая ошибка. Попробуй ещё раз.')
      setLoading(false)
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 0 }}>Отключение 2FA</h2>
      <p style={{ fontSize: 14, color: 'var(--brand-obihod-ink-muted)' }}>
        Подтверди отключение паролем и текущим кодом из приложения (или одним из кодов
        восстановления).
      </p>
      <form onSubmit={handle}>
        <label
          htmlFor="disable-password"
          style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}
        >
          Пароль
        </label>
        <input
          id="disable-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          autoComplete="current-password"
          disabled={loading}
          style={{ width: '100%', marginBottom: 16 }}
        />

        <label
          htmlFor="disable-otp"
          style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}
        >
          Код приложения или код восстановления
        </label>
        <input
          id="disable-otp"
          type="text"
          value={otpOrRecovery}
          onChange={(e) => setOtpOrRecovery(e.target.value)}
          required
          autoComplete="one-time-code"
          disabled={loading}
          style={{ width: '100%', fontFamily: 'JetBrains Mono, monospace' }}
        />

        {error && (
          <div
            role="alert"
            style={{ marginTop: 8, color: 'var(--brand-obihod-danger, #b54828)', fontSize: 13 }}
          >
            {error}
          </div>
        )}

        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '11px 16px',
              background: 'transparent',
              border: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading || !password || !otpOrRecovery}
            style={{
              padding: '11px 16px',
              background: 'var(--brand-obihod-amber, #e6a23c)',
              color: 'var(--brand-obihod-ink, #1c1c1c)',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Отключаем…' : 'Отключить'}
          </button>
        </div>
      </form>
    </ModalOverlay>
  )
}
