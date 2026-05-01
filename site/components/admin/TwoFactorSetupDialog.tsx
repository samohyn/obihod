'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { ModalOverlay } from './SecurityPanel'

/**
 * TwoFactorSetupDialog — Setup flow для 2FA.
 *
 * Spec: PANEL-AUTH-2FA AC-2 + AC-3 (verify).
 *
 * Steps:
 *   1. На mount → POST /2fa-setup → получить QR + manualSecret + tempSecretToken
 *   2. User сканирует QR / вводит manualSecret в Google Authenticator
 *   3. User вводит 6-digit OTP → POST /2fa-verify
 *   4. На success — вызывает onSuccess(plainCodes) для показа recovery
 */

interface Props {
  onClose: () => void
  onSuccess: (codes: string[]) => void
}

export default function TwoFactorSetupDialog({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(true)
  const [setupError, setSetupError] = useState('')
  const [qrPng, setQrPng] = useState('')
  const [manualSecret, setManualSecret] = useState('')
  const [token, setToken] = useState('')
  const [otp, setOtp] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/admin/auth/2fa-setup', { method: 'POST' })
        const json = (await res.json().catch(() => null)) as
          | { data?: { qrPng: string; manualSecret: string; tempSecretToken: string } }
          | { error?: { message?: string } }
          | null
        if (cancelled) return
        if (!res.ok || !json || 'error' in json) {
          const msg =
            (json && 'error' in json && json.error?.message) || 'Не удалось начать настройку.'
          setSetupError(msg)
          setLoading(false)
          return
        }
        const data = 'data' in json ? json.data : null
        if (!data) {
          setSetupError('Сервер вернул пустой ответ.')
          setLoading(false)
          return
        }
        setQrPng(data.qrPng)
        setManualSecret(data.manualSecret)
        setToken(data.tempSecretToken)
        setLoading(false)
      } catch {
        if (!cancelled) {
          setSetupError('Сетевая ошибка. Закрой и попробуй ещё раз.')
          setLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault()
    setVerifying(true)
    setVerifyError('')
    try {
      const res = await fetch('/api/admin/auth/2fa-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempSecretToken: token, otp }),
      })
      const json = (await res.json().catch(() => null)) as
        | { data?: { recoveryCodes: string[] } }
        | { error?: { message?: string } }
        | null
      if (!res.ok || !json || 'error' in json) {
        const msg = (json && 'error' in json && json.error?.message) || 'Неверный код.'
        setVerifyError(msg)
        setVerifying(false)
        return
      }
      const data = 'data' in json ? json.data : null
      if (!data?.recoveryCodes) {
        setVerifyError('Сервер вернул пустой ответ.')
        setVerifying(false)
        return
      }
      onSuccess(data.recoveryCodes)
    } catch {
      setVerifyError('Сетевая ошибка. Попробуй ещё раз.')
      setVerifying(false)
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 0 }}>Включение 2FA</h2>

      {loading && <p style={{ fontSize: 14 }}>Готовим QR-код…</p>}

      {setupError && (
        <div role="alert" style={{ color: 'var(--brand-obihod-danger, #b54828)', fontSize: 13 }}>
          {setupError}
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '11px 16px',
                background: 'transparent',
                border: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {!loading && !setupError && qrPng && (
        <>
          <ol style={{ fontSize: 14, lineHeight: 1.6, paddingLeft: 20 }}>
            <li>Открой приложение Google Authenticator (или 1Password / Authy / Yandex Key).</li>
            <li>Отсканируй QR-код или введи код вручную.</li>
            <li>Введи 6-значный код из приложения ниже.</li>
          </ol>

          <div
            style={{
              display: 'flex',
              gap: 24,
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: 16,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrPng}
              alt="QR-код для настройки 2FA"
              width={160}
              height={160}
              style={{ border: '1px solid var(--brand-obihod-stroke, #e6e1d6)', borderRadius: 6 }}
            />
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 13, color: 'var(--brand-obihod-ink-muted)', marginTop: 0 }}>
                Или введи вручную:
              </p>
              <code
                style={{
                  display: 'block',
                  padding: 12,
                  background: 'var(--brand-obihod-paper, #f7f5f0)',
                  borderRadius: 6,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13,
                  letterSpacing: '0.05em',
                  wordBreak: 'break-all',
                }}
              >
                {manualSecret}
              </code>
            </div>
          </div>

          <form onSubmit={handleVerify}>
            <label
              htmlFor="setup-otp"
              style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}
            >
              Код из приложения
            </label>
            <input
              id="setup-otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              disabled={verifying}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.3em',
                textAlign: 'center',
                fontSize: 18,
                width: '100%',
              }}
            />
            {verifyError && (
              <div
                role="alert"
                style={{ marginTop: 8, color: 'var(--brand-obihod-danger, #b54828)', fontSize: 13 }}
              >
                {verifyError}
              </div>
            )}
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={verifying}
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
                disabled={verifying || otp.length !== 6}
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
                {verifying ? 'Проверяем…' : 'Подтвердить и сохранить'}
              </button>
            </div>
          </form>
        </>
      )}
    </ModalOverlay>
  )
}
