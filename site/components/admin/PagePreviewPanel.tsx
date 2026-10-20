'use client'

import type { CSSProperties, FC } from 'react'
import { useCallback, useState } from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

/**
 * Предпросмотр «Страницы» в боковой панели: черновик — по защищённой ссылке (/api/preview-sign,
 * 30 минут), опубликованная версия — прямой ссылкой. Как ServicePreviewPanel, но для любой страницы
 * (slug «home» → «/»).
 */

const box: CSSProperties = {
  display: 'grid',
  gap: 10,
  padding: 16,
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 10,
  background: 'var(--brand-obihod-card, #ffffff)',
}
const btn: CSSProperties = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 40,
  padding: '0 14px',
  borderRadius: 8,
  border: '1.5px solid #2d5a3d',
  font: 'inherit',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  textDecoration: 'none',
}
const primary: CSSProperties = { ...btn, background: '#2d5a3d', color: '#f7f5f0' }
const ghost: CSSProperties = { ...btn, background: 'transparent', color: '#2d5a3d' }

const PagePreviewPanel: FC = () => {
  const { id, hasPublishedDoc } = useDocumentInfo()
  const slug = useFormFields(([fields]) =>
    typeof fields?.slug?.value === 'string' ? fields.slug.value : '',
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openDraft = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/preview-sign?collection=pages&id=${encodeURIComponent(String(id))}`,
        { credentials: 'include' },
      )
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!res.ok || !data.url) throw new Error(data.error || `HTTP ${res.status}`)
      window.open(data.url, '_blank', 'noopener,noreferrer')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось получить ссылку')
    } finally {
      setLoading(false)
    }
  }, [id])

  const publicUrl = slug === 'home' ? '/' : slug ? `/${slug}/` : null

  return (
    <section style={box} aria-label="Предпросмотр">
      <b style={{ fontSize: 15 }}>Предпросмотр</b>
      {!id ? (
        <span style={{ fontSize: 13, color: '#6b6358' }}>
          Сохраните черновик — появится кнопка предпросмотра.
        </span>
      ) : (
        <>
          <button type="button" style={primary} onClick={openDraft} disabled={loading}>
            {loading ? 'Готовим ссылку…' : 'Открыть черновик'}
          </button>
          {hasPublishedDoc && publicUrl && (
            <a href={publicUrl} target="_blank" rel="noopener noreferrer" style={ghost}>
              Открыть на сайте
            </a>
          )}
          <span style={{ fontSize: 12.5, color: '#6b6358' }}>
            Черновик виден только вам. На сайт попадает после «Опубликовать».
          </span>
        </>
      )}
      {error && <span style={{ fontSize: 13, color: '#b54828' }}>{error}</span>}
    </section>
  )
}

export default PagePreviewPanel
