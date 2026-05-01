'use client'

import { useState, type CSSProperties } from 'react'
import TwoFactorSetupDialog from './TwoFactorSetupDialog'
import TwoFactorDisableDialog from './TwoFactorDisableDialog'
import RecoveryCodesScreen from './RecoveryCodesScreen'

/**
 * SecurityPanel — client orchestrator для /admin/security view.
 *
 * Spec: PANEL-AUTH-2FA AC-2 + AC-5.
 *
 * State machine:
 *   idle → setup → showCodes → idle (enabled=true)
 *   idle (enabled) → disable → idle (enabled=false)
 *   idle (enabled) → regenerate → showCodes → idle
 */

type Phase = 'idle' | 'setup' | 'disable' | 'regenerate' | 'showCodes'

const cardStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius-md, 10px)',
  padding: 24,
  maxWidth: 560,
  marginBottom: 24,
}

const badgeStyle = (enabled: boolean): CSSProperties => ({
  display: 'inline-block',
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  background: enabled ? 'rgba(45, 90, 61, 0.12)' : 'rgba(107, 107, 107, 0.12)',
  color: enabled
    ? 'var(--brand-obihod-primary, #2d5a3d)'
    : 'var(--brand-obihod-ink-muted, #6b6b6b)',
})

const buttonPrimary: CSSProperties = {
  marginTop: 16,
  padding: '11px 16px',
  background: 'var(--brand-obihod-amber, #e6a23c)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  border: 'none',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
}

const buttonSecondary: CSSProperties = {
  marginTop: 16,
  marginRight: 8,
  padding: '11px 16px',
  background: 'transparent',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  border: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  fontWeight: 500,
  fontSize: 14,
  cursor: 'pointer',
}

interface Props {
  initialEnabled: boolean
  userEmail: string
}

export default function SecurityPanel({ initialEnabled, userEmail }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [phase, setPhase] = useState<Phase>('idle')
  const [pendingCodes, setPendingCodes] = useState<string[]>([])

  const handleEnableSuccess = (codes: string[]) => {
    setEnabled(true)
    setPendingCodes(codes)
    setPhase('showCodes')
  }

  const handleDisableSuccess = () => {
    setEnabled(false)
    setPhase('idle')
  }

  const handleRegenerateSuccess = (codes: string[]) => {
    setPendingCodes(codes)
    setPhase('showCodes')
  }

  const handleAck = () => {
    setPendingCodes([])
    setPhase('idle')
  }

  if (phase === 'showCodes') {
    return (
      <RecoveryCodesScreen codes={pendingCodes} userEmail={userEmail} onAcknowledge={handleAck} />
    )
  }

  return (
    <>
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 6px 0' }}>
              Двухфакторная аутентификация
            </h2>
            <span style={badgeStyle(enabled)}>{enabled ? '2FA включена' : '2FA не включена'}</span>
          </div>
        </div>

        {enabled ? (
          <>
            <p style={{ fontSize: 14, color: 'var(--brand-obihod-ink-muted)', marginTop: 16 }}>
              При следующем входе после email и пароля система запросит 6-значный код из
              приложения-аутентификатора.
            </p>
            <div>
              <button type="button" style={buttonSecondary} onClick={() => setPhase('disable')}>
                Отключить 2FA
              </button>
              <button type="button" style={buttonSecondary} onClick={() => setPhase('regenerate')}>
                Перегенерировать коды восстановления
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: 14, color: 'var(--brand-obihod-ink-muted)', marginTop: 16 }}>
              Включи 2FA, чтобы утечка одного пароля не давала доступа к админке. Понадобится
              приложение Google Authenticator, 1Password, Authy или Yandex Key.
            </p>
            <button type="button" style={buttonPrimary} onClick={() => setPhase('setup')}>
              Включить 2FA
            </button>
          </>
        )}
      </div>

      {phase === 'setup' && (
        <TwoFactorSetupDialog onClose={() => setPhase('idle')} onSuccess={handleEnableSuccess} />
      )}
      {phase === 'disable' && (
        <TwoFactorDisableDialog onClose={() => setPhase('idle')} onSuccess={handleDisableSuccess} />
      )}
      {phase === 'regenerate' && (
        <TwoFactorRegenerateDialog
          onClose={() => setPhase('idle')}
          onSuccess={handleRegenerateSuccess}
        />
      )}
    </>
  )
}

/* ============================================================================
 *  Inline Regenerate Dialog (light enough not to extract)
 * ========================================================================= */

function TwoFactorRegenerateDialog({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: (codes: string[]) => void
}) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth/2fa-regenerate-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      })
      const json = (await res.json().catch(() => null)) as
        | { data?: { recoveryCodes: string[] } }
        | { error?: { message?: string } }
        | null
      if (!res.ok || !json || 'error' in json) {
        const msg =
          (json && 'error' in json && json.error?.message) || 'Не удалось перегенерировать коды.'
        setError(msg)
        setLoading(false)
        return
      }
      const data = 'data' in json ? json.data : null
      if (!data?.recoveryCodes) {
        setError('Сервер вернул пустой ответ.')
        setLoading(false)
        return
      }
      onSuccess(data.recoveryCodes)
    } catch {
      setError('Сетевая ошибка. Попробуй ещё раз.')
      setLoading(false)
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 0 }}>
        Перегенерация кодов восстановления
      </h2>
      <p style={{ fontSize: 14, color: 'var(--brand-obihod-ink-muted)' }}>
        Старые коды перестанут работать. Введи текущий код приложения для подтверждения.
      </p>
      <form onSubmit={handle}>
        <label
          htmlFor="regen-otp"
          style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}
        >
          Код приложения
        </label>
        <input
          id="regen-otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          required
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          disabled={loading}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.3em',
            textAlign: 'center',
          }}
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
          <button type="button" style={buttonSecondary} onClick={onClose} disabled={loading}>
            Отмена
          </button>
          <button type="submit" style={buttonPrimary} disabled={loading || otp.length !== 6}>
            {loading ? 'Проверяем…' : 'Перегенерировать'}
          </button>
        </div>
      </form>
    </ModalOverlay>
  )
}

export function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 'var(--brand-obihod-radius-md, 10px)',
          padding: 32,
          maxWidth: 480,
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  )
}
