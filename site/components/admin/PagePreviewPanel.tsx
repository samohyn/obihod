'use client'

import type { CSSProperties, FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

/**
 * Панель «Предпросмотр» в документе любой коллекции со страницей на сайте («Страницы»,
 * «Подуслуги», «Блог», «Кейсы», «Авторы», «Районы», «Услуга × район»):
 * - «Открыть черновик» — свежая защищённая ссылка на каждое нажатие (/api/preview-sign, 5 минут);
 * - «Открыть на сайте» — опубликованная версия; адрес считает сервер (lib/admin/preview-routes.ts).
 * У «Услуг» страницы своей нет: направление собирается в «Страницах» — панель ведёт туда.
 */

const box: CSSProperties = {
  display: 'grid',
  gap: 10,
  padding: 16,
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 10,
  background: 'var(--brand-obihod-card, #ffffff)',
  marginBottom: 24,
}
const btn: CSSProperties = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 44,
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
const hint: CSSProperties = { fontSize: 12.5, color: '#6b6358' }

const PagePreviewPanel: FC = () => {
  const { id, hasPublishedDoc, collectionSlug } = useDocumentInfo()
  const collection = collectionSlug ?? 'pages'
  const slug = useFormFields(([fields]) =>
    typeof fields?.slug?.value === 'string' ? fields.slug.value : '',
  )
  const [publicUrl, setPublicUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sign = useCallback(async () => {
    const res = await fetch(
      `/api/preview-sign/?collection=${collection}&id=${encodeURIComponent(String(id))}`,
      { credentials: 'include' },
    )
    const data = (await res.json().catch(() => ({}))) as {
      url?: string
      publicUrl?: string | null
      error?: string
    }
    if (!res.ok || !data.url) throw new Error(data.error || `HTTP ${res.status}`)
    return data
  }, [collection, id])

  // Адрес на сайте — от сервера: у подуслуги и «услуги × района» он собирается из связей.
  useEffect(() => {
    if (!id || collection === 'services') return
    let cancelled = false
    sign()
      .then((d) => !cancelled && setPublicUrl(d.publicUrl ?? null))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [id, collection, sign])

  const openDraft = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { url } = await sign()
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось получить ссылку')
    } finally {
      setLoading(false)
    }
  }, [sign])

  if (collection === 'services') {
    return (
      <section style={box} aria-label="Страница направления">
        <b style={{ fontSize: 15 }}>Страница направления</b>
        <span style={hint}>
          Текст и блоки страницы /{slug || '…'}/ редактируются в разделе «Страницы». Здесь — данные
          услуги: название, цены, разметка.
        </span>
        {slug && (
          <>
            <a
              href={`/admin/collections/pages?where[slug][equals]=${encodeURIComponent(slug)}`}
              style={primary}
            >
              Открыть в «Страницах»
            </a>
            <a href={`/${slug}/`} target="_blank" rel="noopener noreferrer" style={ghost}>
              Открыть на сайте
            </a>
          </>
        )}
      </section>
    )
  }

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
          {/* Районы и «услуга × район» есть на сайте и без публикации (noindex) */}
          {(hasPublishedDoc || collection === 'districts' || collection === 'service-districts') &&
            publicUrl && (
              <a href={publicUrl} target="_blank" rel="noopener noreferrer" style={ghost}>
                Открыть на сайте
              </a>
            )}
          <span style={hint}>
            Черновик виден только вам. На сайт попадает после «Опубликовать».
          </span>
        </>
      )}
      {error && <span style={{ fontSize: 13, color: '#b54828' }}>{error}</span>}
    </section>
  )
}

export default PagePreviewPanel
