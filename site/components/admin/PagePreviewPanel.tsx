'use client'

import type { CSSProperties, FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

/**
 * Предпросмотр «Страницы» и «Подуслуги» в боковой панели: черновик — по защищённой ссылке
 * (/api/preview-sign, 30 минут), опубликованная версия — прямой ссылкой. Как ServicePreviewPanel,
 * но для документов из блоков (slug «home» → «/», подуслуга → /направление/адрес/).
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
  const { id, hasPublishedDoc, collectionSlug } = useDocumentInfo()
  const collection = collectionSlug ?? 'pages'
  const slug = useFormFields(([fields]) =>
    typeof fields?.slug?.value === 'string' ? fields.slug.value : '',
  )
  const serviceId = useFormFields(([fields]) => {
    const v = fields?.service?.value
    return typeof v === 'string' || typeof v === 'number' ? String(v) : ''
  })
  const [serviceSlug, setServiceSlug] = useState('')

  // У подуслуги адрес начинается с направления — берём его slug по выбранной связи.
  useEffect(() => {
    if (collection !== 'sub-services' || !serviceId) return
    let cancelled = false
    fetch(`/api/services/${encodeURIComponent(serviceId)}?depth=0`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { slug?: string } | null) => {
        if (!cancelled) setServiceSlug(d?.slug ?? '')
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [collection, serviceId])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openDraft = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/preview-sign?collection=${collection}&id=${encodeURIComponent(String(id))}`,
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
  }, [id, collection])

  const publicUrl =
    collection === 'sub-services'
      ? serviceSlug && slug
        ? `/${serviceSlug}/${slug}/`
        : null
      : slug === 'home'
        ? '/'
        : slug
          ? `/${slug}/`
          : null

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
