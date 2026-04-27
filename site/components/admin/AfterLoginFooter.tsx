import type { CSSProperties, FC } from 'react'

/**
 * AfterLoginFooter — copyright под native Payload login form.
 *
 * Часть OBI-24 admin §12.1 anatomy: master lockup сверху + form +
 * footer «© YYYY · Обиход» muted 12px snizu. Через
 * admin.components.afterLogin slot.
 *
 * RSC — Payload подхватывает через importMap.
 */

const wrapStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: '24px 16px 40px',
  fontFamily: 'var(--font-body)',
}

const textStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--brand-obihod-muted, #6b6256)',
  margin: 0,
}

const AfterLoginFooter: FC = () => {
  const year = new Date().getFullYear()
  return (
    <div style={wrapStyle}>
      <p style={textStyle}>© {year} · Обиход</p>
    </div>
  )
}

export default AfterLoginFooter
