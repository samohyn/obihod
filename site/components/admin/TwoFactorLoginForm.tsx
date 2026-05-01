'use client'

import { useState, type CSSProperties, type FormEvent } from 'react'

/**
 * TwoFactorLoginForm — client UI для /admin/login/2fa.
 *
 * Spec: PANEL-AUTH-2FA AC-4 + brand-guide §12.1 (Login screen карточка).
 * Reuses existing custom.scss .login__form classes (W1 brand pass).
 *
 * A11y:
 * - autocomplete="one-time-code" (iOS / 1Password подсказка)
 * - aria-live="polite" на error region
 * - keyboard-only flow
 * - inputmode="numeric" для OTP
 */

type Mode = 'otp' | 'recovery'
type State = 'default' | 'loading' | 'error'

const linkStyle: CSSProperties = {
  display: 'inline-block',
  marginTop: 16,
  fontSize: 13,
  color: 'var(--brand-obihod-primary, #2d5a3d)',
  textDecoration: 'none',
  textAlign: 'center',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  padding: 0,
  width: '100%',
}

const errorStyle: CSSProperties = {
  marginTop: 8,
  marginBottom: 8,
  padding: '8px 10px',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  background: 'rgba(181, 72, 40, 0.08)',
  color: 'var(--brand-obihod-danger, #b54828)',
  fontSize: 13,
  lineHeight: 1.4,
}

const helperStyle: CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
  lineHeight: 1.4,
}

const fieldStyle: CSSProperties = {
  marginBottom: 16,
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: '0.02em',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  marginBottom: 6,
}

const otpInputStyle: CSSProperties = {
  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
  letterSpacing: '0.3em',
  textAlign: 'center',
  fontSize: 18,
}

export default function TwoFactorLoginForm() {
  const [mode, setMode] = useState<Mode>('otp')
  const [otp, setOtp] = useState('')
  const [recovery, setRecovery] = useState('')
  const [state, setState] = useState<State>('default')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [remaining, setRemaining] = useState<number | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')
    try {
      const body = mode === 'otp' ? { otp } : { recoveryCode: recovery }
      const res = await fetch('/api/admin/auth/2fa-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = (await res.json().catch(() => null)) as
        | { data?: { ok: boolean; usedRecoveryCode: boolean; recoveryCodesRemaining: number } }
        | { error?: { message?: string } }
        | null
      if (!res.ok) {
        const message =
          (json && 'error' in json && json.error?.message) || 'Не удалось проверить код.'
        setErrorMsg(message)
        setState('error')
        return
      }
      const data = json && 'data' in json ? json.data : null
      if (data?.usedRecoveryCode) {
        setRemaining(data.recoveryCodesRemaining)
      }
      // Hard navigation — гарантирует server-side re-eval с новым
      // obihod_2fa_passed cookie. router.push() без refresh не вызывает RSC
      // re-render, и страница `/admin/login/2fa` повторно showает форму.
      window.location.href = '/admin/'
    } catch {
      setErrorMsg('Не удалось проверить код. Проверь интернет.')
      setState('error')
    }
  }

  const switchMode = () => {
    setMode((m) => (m === 'otp' ? 'recovery' : 'otp'))
    setErrorMsg('')
    setState('default')
  }

  return (
    <div className="template-minimal">
      <div className="template-minimal__wrap">
        <form
          onSubmit={handleSubmit}
          className="login__form"
          aria-label="Подтверждение второй ступени"
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              marginTop: 0,
              marginBottom: 8,
              color: 'var(--brand-obihod-ink, #1c1c1c)',
            }}
          >
            {mode === 'otp' ? 'Введи код из приложения' : 'Код восстановления'}
          </h2>
          <p
            style={{
              fontSize: 13,
              color: 'var(--brand-obihod-ink-muted, #6b6b6b)',
              marginTop: 0,
              marginBottom: 16,
              lineHeight: 1.4,
            }}
          >
            {mode === 'otp'
              ? 'Открой Google Authenticator / 1Password / Authy и введи 6-значный код.'
              : 'Один из 10 кодов формата XXXX-XXXX-XXXX, сохранённых при настройке 2FA.'}
          </p>

          {mode === 'otp' ? (
            <div style={fieldStyle}>
              <label htmlFor="admin-2fa-otp" style={labelStyle}>
                Код приложения
              </label>
              <input
                id="admin-2fa-otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                autoFocus
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                autoComplete="one-time-code"
                disabled={state === 'loading'}
                style={otpInputStyle}
                aria-describedby="admin-2fa-helper"
              />
              <p id="admin-2fa-helper" style={helperStyle}>
                Не приходит код? Проверь время на телефоне — оно должно совпадать с серверным.
              </p>
            </div>
          ) : (
            <div style={fieldStyle}>
              <label htmlFor="admin-2fa-recovery" style={labelStyle}>
                Код восстановления
              </label>
              <input
                id="admin-2fa-recovery"
                type="text"
                value={recovery}
                onChange={(e) => setRecovery(e.target.value.toUpperCase().slice(0, 16))}
                required
                autoFocus
                placeholder="XXXX-XXXX-XXXX"
                autoComplete="off"
                disabled={state === 'loading'}
                style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}
              />
              <p style={helperStyle}>
                Каждый код одноразовый. После использования он больше не сработает.
              </p>
            </div>
          )}

          {errorMsg && (
            <div role="alert" aria-live="polite" style={errorStyle}>
              {errorMsg}
            </div>
          )}

          {remaining !== null && remaining <= 3 && (
            <div
              role="status"
              aria-live="polite"
              style={{
                ...errorStyle,
                background: 'rgba(230, 162, 60, 0.12)',
                color: 'var(--brand-obihod-warning, #b58415)',
              }}
            >
              Осталось {remaining} код{remaining === 1 ? '' : remaining < 5 ? 'а' : 'ов'}{' '}
              восстановления. Перегенерируй в профиле.
            </div>
          )}

          <button
            type="submit"
            className="btn btn--style-primary form-submit"
            disabled={
              state === 'loading' ||
              (mode === 'otp' ? otp.length !== 6 : recovery.replace(/[^A-Z0-9]/g, '').length < 12)
            }
            aria-busy={state === 'loading' ? 'true' : 'false'}
          >
            {state === 'loading' ? 'Проверяем…' : 'Подтвердить'}
          </button>

          <button type="button" onClick={switchMode} style={linkStyle}>
            {mode === 'otp'
              ? 'Использовать код восстановления →'
              : '← Вернуться к коду из приложения'}
          </button>
        </form>
      </div>
    </div>
  )
}
