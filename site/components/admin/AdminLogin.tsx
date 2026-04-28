'use client'

import type { CSSProperties, FC, FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'

/**
 * AdminLogin — custom login view (Wave 2.A · PAN-5 · US-12).
 *
 * Заменяет дефолтный Payload Login на форму, соответствующую brand-guide
 * §12.1 «Login screen». Auth-flow сохраняется native: используем useAuth().login
 * из @payloadcms/ui. Magic link добавится в Wave 2.B (PAN-11) после закрытия
 * pre-tasks (PAN-9 Telegram bot + PAN-10 Beget SMTP).
 *
 * Anatomy:
 * - BeforeLoginLockup (через admin.components.beforeLogin) — уже на проде
 * - login__form карточка 320px (стилизована в site/app/(payload)/custom.scss
 *   §LOGIN SCREEN)
 * - email + password inputs
 * - btn--style-primary янтарная кнопка «Войти»
 * - link «Забыли пароль? →» на native /admin/forgot
 * - AfterLoginFooter (через admin.components.afterLogin) — уже на проде
 *
 * A11y (WCAG 2.2 AA):
 * - aria-label на form
 * - aria-invalid + aria-describedby на email при error
 * - role="alert" + aria-live="polite" на error region
 * - autocomplete="email" + "current-password" для password managers
 * - keyboard-only flow (Tab → Tab → Enter)
 * - focus-visible — покрыто Wave 1 SCSS на :focus-visible селекторах
 * - reduced-motion — Wave 1 SCSS уже отключает transitions
 *
 * ADR-0005: Уровень 2 (React custom view), тонкий слой над useAuth.
 * Никаких import'ов глубже первого уровня @payloadcms/ui.
 */

type LoginState = 'default' | 'loading' | 'error'
type LoginErrorCode = 'invalid_credentials' | 'locked' | 'network' | 'unknown'

const linkStyle: CSSProperties = {
  display: 'block',
  marginTop: 16,
  fontSize: 13,
  color: 'var(--brand-obihod-primary, #2d5a3d)',
  textDecoration: 'none',
  textAlign: 'center',
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

function describeError(code: LoginErrorCode): string {
  switch (code) {
    case 'invalid_credentials':
      return 'Неверный email или пароль.'
    case 'locked':
      return 'Аккаунт временно заблокирован. Попробуй через 15 минут.'
    case 'network':
      return 'Не удалось войти. Проверь интернет и попробуй ещё раз.'
    case 'unknown':
    default:
      return 'Что-то пошло не так. Попробуй ещё раз.'
  }
}

function classifyError(err: unknown): LoginErrorCode {
  if (err instanceof TypeError) return 'network'
  if (err instanceof Error) {
    const msg = err.message.toLowerCase()
    if (msg.includes('credentials') || msg.includes('email') || msg.includes('password')) {
      return 'invalid_credentials'
    }
    if (msg.includes('lock')) return 'locked'
  }
  return 'unknown'
}

const AdminLogin: FC = () => {
  const { setUser } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState<LoginState>('default')
  const [errorCode, setErrorCode] = useState<LoginErrorCode | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('loading')
    setErrorCode(null)
    try {
      // Payload 3: useAuth() не имеет .login — login делается direct POST,
      // потом setUser() обновляет AuthContext (см. @payloadcms/ui Auth provider).
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        if (res.status === 401 || res.status === 400) {
          setState('error')
          setErrorCode('invalid_credentials')
          return
        }
        if (res.status === 429) {
          setState('error')
          setErrorCode('locked')
          return
        }
        setState('error')
        setErrorCode('unknown')
        return
      }
      const data = (await res.json()) as { user?: unknown; token?: string; exp?: number }
      if (!data.user || typeof data.exp !== 'number') {
        setState('error')
        setErrorCode('unknown')
        return
      }
      // setUser сигнатура: { user, token, exp } — обновляет AuthContext + token timer
      setUser({
        user: data.user as Parameters<typeof setUser>[0] extends null | { user: infer U }
          ? U
          : never,
        token: data.token,
        exp: data.exp,
      } as Parameters<typeof setUser>[0])
      router.push('/admin')
    } catch (err) {
      setState('error')
      setErrorCode(classifyError(err))
    }
  }

  const isEmailInvalid = errorCode === 'invalid_credentials'
  const errorId = 'admin-login-error'

  return (
    <form onSubmit={handleSubmit} className="login__form" aria-label="Вход в админку">
      <div style={fieldStyle}>
        <label htmlFor="admin-login-email" style={labelStyle}>
          Email
        </label>
        <input
          id="admin-login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
          disabled={state === 'loading'}
          aria-invalid={isEmailInvalid ? 'true' : 'false'}
          aria-describedby={errorCode ? errorId : undefined}
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="admin-login-password" style={labelStyle}>
          Пароль
        </label>
        <input
          id="admin-login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={state === 'loading'}
          aria-describedby={errorCode ? errorId : undefined}
        />
      </div>

      {errorCode && (
        <div id={errorId} role="alert" aria-live="polite" style={errorStyle}>
          {describeError(errorCode)}
        </div>
      )}

      <button
        type="submit"
        className="btn btn--style-primary form-submit"
        disabled={state === 'loading' || !email || !password}
        aria-busy={state === 'loading' ? 'true' : 'false'}
      >
        {state === 'loading' ? 'Вход…' : 'Войти'}
      </button>

      <Link href="/admin/forgot" style={linkStyle}>
        Забыли пароль? →
      </Link>
    </form>
  )
}

export default AdminLogin
