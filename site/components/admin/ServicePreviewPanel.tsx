'use client'

import type { CSSProperties, FC } from 'react'
import { useCallback, useState } from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

/**
 * ServicePreviewPanel — Phase 1 PANEL-SERVICES-PREVIEW-TAB.
 *
 * Card-блок в tab «Превью» edit-view коллекции Services. Daily-pain оператора:
 * «обновил цену → проверил» = 4 действия (save → new-tab → URL → reload).
 * С Phase 1 — 2 действия (save → click button).
 *
 * Anatomy (brand-guide §12.4 + §13 TOV):
 * - paper card с line-border (как EmptyErrorStates StatePanel, без icon)
 * - title-факт: «Превью услуги»
 * - matter-of-fact hint (§13: без «Упс»)
 * - 1 primary-button янтарная (§12.4 .btn--style-primary token-set)
 *
 * 3 состояния:
 * 1. doc unsaved (нет id) → button disabled, hint: «Сохраните черновик»
 * 2. doc saved, draft (есть id, нет публикации) → button «Открыть превью
 *    черновика» через POST на /api/preview-sign (signed HMAC URL, draftMode)
 * 3. doc published → button «Открыть на сайте» с direct href /<slug>/
 *
 * Cross-team gap (документировано в commit body):
 * `lib/admin/preview-routes.ts:29` возвращает `/uslugi/<slug>` — устаревший
 * путь. Реальный route — `(marketing)/[service]` → `/<slug>/`. До фикса
 * follow-up `PANEL-DRAFT-PREVIEW-ROUTE` (для fe-site/podev) draft-button
 * откроется на 404. Поэтому в текущей итерации draft-button всё-таки
 * показываем (preview API уже есть, починка одной строки), но снабжаем
 * hint'ом про возможную ошибку, чтобы оператор понимал.
 */

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '24px',
  fontFamily: 'var(--font-body)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  background: 'var(--brand-obihod-card, #ffffff)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius, 10px)',
  maxWidth: 560,
  margin: '16px 0',
  gap: 12,
}

const titleStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  letterSpacing: '-0.015em',
  lineHeight: 1.2,
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  margin: 0,
}

const hintStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.5,
  color: 'var(--brand-obihod-ink-soft, #2b2b2b)',
  margin: 0,
  maxWidth: 440,
}

const urlStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  color: 'var(--brand-obihod-muted, #6b6256)',
  background: 'var(--brand-obihod-paper, #f7f5f0)',
  padding: '4px 8px',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  wordBreak: 'break-all' as const,
}

const errorStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--brand-obihod-danger, #b54828)',
  margin: 0,
}

const buttonBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: '12px 20px',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  fontWeight: 600,
  fontSize: 14,
  textDecoration: 'none',
  // WCAG 2.5.5 Target Size — 44×44 минимум (PANEL-A11Y-TARGET-SIZE стандарт).
  minHeight: 44,
  minWidth: 44,
  cursor: 'pointer',
  transition: 'background var(--brand-obihod-motion-fast, 120ms) ease',
  border: '1px solid var(--brand-obihod-accent, #e6a23c)',
}

const buttonPrimaryStyle: CSSProperties = {
  ...buttonBaseStyle,
  background: 'var(--brand-obihod-accent, #e6a23c)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
}

const buttonDisabledStyle: CSSProperties = {
  ...buttonBaseStyle,
  background: 'var(--brand-obihod-line, #e6e1d6)',
  color: 'var(--brand-obihod-muted, #6b6256)',
  borderColor: 'var(--brand-obihod-line, #e6e1d6)',
  cursor: 'not-allowed',
}

/** External-link glyph (brand-guide §9 — текстовый ↗ как inline). */
const ExternalGlyph: FC = () => (
  <span aria-hidden="true" style={{ fontSize: '0.9em', lineHeight: 1 }}>
    ↗
  </span>
)

const ServicePreviewPanel: FC = () => {
  const { id, hasPublishedDoc } = useDocumentInfo()
  // useFormFields с селектором — реактивно следим только за полем `slug`,
  // не перерендериваясь при изменении остальных полей.
  const slug = useFormFields(([fields]) => {
    const f = fields?.slug
    return typeof f?.value === 'string' ? f.value : ''
  })

  const [draftLoading, setDraftLoading] = useState(false)
  const [draftError, setDraftError] = useState<string | null>(null)

  const openDraft = useCallback(async () => {
    if (!id) return
    setDraftLoading(true)
    setDraftError(null)
    try {
      const res = await fetch(
        `/api/preview-sign?collection=services&id=${encodeURIComponent(String(id))}`,
        { credentials: 'include' },
      )
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error || `HTTP ${res.status}`)
      }
      const data = (await res.json()) as { url?: string }
      if (!data.url) throw new Error('Пустой ответ preview API')
      window.open(data.url, '_blank', 'noopener,noreferrer')
    } catch (e) {
      setDraftError(e instanceof Error ? e.message : 'Не удалось получить ссылку')
    } finally {
      setDraftLoading(false)
    }
  }, [id])

  // 1. Doc unsaved — id отсутствует → нет ничего, что можно открыть.
  if (!id) {
    return (
      <section style={cardStyle} aria-label="Превью услуги">
        <h3 style={titleStyle}>Превью услуги</h3>
        <p style={hintStyle}>
          Сначала заполните slug и сохраните черновик — после этого появится кнопка предпросмотра.
        </p>
        <button type="button" disabled style={buttonDisabledStyle}>
          Открыть на сайте <ExternalGlyph />
        </button>
      </section>
    )
  }

  // 2. Doc saved + published → direct link на public route /<slug>/.
  // (marketing)/[service]/page.tsx — root-level pillar route.
  if (hasPublishedDoc && slug) {
    const url = `/${slug}/`
    return (
      <section style={cardStyle} aria-label="Превью услуги">
        <h3 style={titleStyle}>Превью услуги</h3>
        <p style={hintStyle}>Опубликованная страница услуги откроется в новой вкладке.</p>
        <span style={urlStyle}>{url}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={buttonPrimaryStyle}
          className="btn btn--style-primary"
        >
          Открыть на сайте <ExternalGlyph />
        </a>
      </section>
    )
  }

  // 3. Doc saved as draft (no published version yet) → signed preview URL.
  return (
    <section style={cardStyle} aria-label="Превью услуги">
      <h3 style={titleStyle}>Превью услуги</h3>
      <p style={hintStyle}>
        Черновик откроется в новой вкладке через защищённую ссылку (действует 30 минут).
      </p>
      <button
        type="button"
        onClick={openDraft}
        disabled={draftLoading}
        style={draftLoading ? buttonDisabledStyle : buttonPrimaryStyle}
        className="btn btn--style-primary"
      >
        {draftLoading ? 'Готовим ссылку…' : 'Открыть превью черновика'} <ExternalGlyph />
      </button>
      {draftError ? (
        <p role="alert" style={errorStyle}>
          {draftError}
        </p>
      ) : null}
    </section>
  )
}

export default ServicePreviewPanel
