'use client'

import { useState, type CSSProperties } from 'react'

/**
 * RecoveryCodesScreen — single-show 10 recovery codes с warning + ack + download.
 *
 * Spec: PANEL-AUTH-2FA AC-3 + brand-guide §12.6 (warning banner + form rows).
 *
 * UX:
 *   - 10 codes в monospace 2-column grid
 *   - warning banner: «Эти коды показываются один раз»
 *   - кнопка «Скачать .txt» (Blob + download attr)
 *   - чекбокс «Я сохранил коды» — без него «Готово» disabled
 */

interface Props {
  codes: string[]
  userEmail: string
  onAcknowledge: () => void
}

const cardStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius-md, 10px)',
  padding: 24,
  maxWidth: 560,
  marginBottom: 24,
}

const warningStyle: CSSProperties = {
  borderLeft: '3px solid var(--brand-obihod-danger, #b54828)',
  background: '#fff4ec',
  padding: '12px 16px',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  fontSize: 14,
  lineHeight: 1.5,
  marginBottom: 16,
}

const codeGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 8,
  margin: '16px 0',
  padding: 16,
  background: 'var(--brand-obihod-paper, #f7f5f0)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
  fontSize: 14,
  letterSpacing: '0.05em',
}

export default function RecoveryCodesScreen({ codes, userEmail, onAcknowledge }: Props) {
  const [acked, setAcked] = useState(false)

  const handleDownload = () => {
    const date = new Date().toISOString().slice(0, 10)
    const content = [
      '# Обиход — коды восстановления 2FA',
      `# Email: ${userEmail}`,
      `# Сгенерированы: ${date}`,
      '',
      '# Каждый код одноразовый. Использовал → не сработает повторно.',
      '# Если потеряешь телефон — войдёшь по любому из них.',
      '# Перегенерировать можно в /admin/security.',
      '',
      ...codes,
    ].join('\n')
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `obikhod-recovery-codes-${userEmail}-${date}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codes.join('\n'))
    } catch {
      // ignore — кнопка best-effort
    }
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 0, marginBottom: 12 }}>
        Сохрани коды восстановления
      </h2>

      <div style={warningStyle} role="alert">
        Эти коды показываются <strong>один раз</strong>. Если потеряешь — перегенерируй в профиле
        «Безопасность». Каждый код одноразовый.
      </div>

      <div style={codeGridStyle} aria-label="10 кодов восстановления">
        {codes.map((code, i) => (
          <div key={i}>{code}</div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          type="button"
          onClick={handleDownload}
          style={{
            padding: '11px 16px',
            background: 'transparent',
            color: 'var(--brand-obihod-ink, #1c1c1c)',
            border: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
            borderRadius: 6,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Скачать .txt
        </button>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            padding: '11px 16px',
            background: 'transparent',
            color: 'var(--brand-obihod-ink, #1c1c1c)',
            border: '1px solid var(--brand-obihod-stroke, #e6e1d6)',
            borderRadius: 6,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Скопировать все
        </button>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
        <input
          type="checkbox"
          checked={acked}
          onChange={(e) => setAcked(e.target.checked)}
          aria-describedby="ack-helper"
        />
        <span>
          Я сохранил коды{' '}
          <span id="ack-helper" style={{ fontSize: 12, color: 'var(--brand-obihod-ink-muted)' }}>
            (без этого нельзя продолжить)
          </span>
        </span>
      </label>

      <button
        type="button"
        onClick={onAcknowledge}
        disabled={!acked}
        style={{
          marginTop: 16,
          padding: '11px 16px',
          background: acked ? 'var(--brand-obihod-amber, #e6a23c)' : '#cfc7b8',
          color: 'var(--brand-obihod-ink, #1c1c1c)',
          border: 'none',
          borderRadius: 6,
          fontWeight: 600,
          fontSize: 14,
          cursor: acked ? 'pointer' : 'not-allowed',
        }}
      >
        Готово
      </button>
    </div>
  )
}
