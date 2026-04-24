'use client'

/**
 * Липкая полоса сверху в preview-режиме.
 * Рендерится page.tsx только когда `draftMode().isEnabled === true`.
 *
 * «Выйти» — вызывает /api/exit-preview и возвращает на текущий URL (или /admin).
 * «Опубликовать» — TODO на следующую итерацию (be4 + fe1).
 */
export function PreviewBanner({
  returnPath,
  adminBackPath,
}: {
  returnPath?: string
  adminBackPath?: string
}) {
  function exit() {
    const ret =
      adminBackPath ??
      returnPath ??
      (typeof window !== 'undefined' ? window.location.pathname : '/')
    // Сервер уже делает redirect 307 на safe-путь и отключает draftMode.
    window.location.href = `/api/exit-preview?redirect=${encodeURIComponent(ret)}`
  }

  function publish() {
    alert('TODO: publish в одной из следующих итераций. Пока — нажмите Publish в админке.')
  }

  return (
    <div
      role="status"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--c-accent)',
        color: 'var(--c-ink)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        fontSize: 14,
        fontWeight: 500,
        borderBottom: '1px solid var(--c-accent-ink)',
        flexWrap: 'wrap',
      }}
    >
      <span>Preview-режим. Это черновик — другие пользователи его не видят.</span>
      <span style={{ display: 'inline-flex', gap: 8 }}>
        <button
          type="button"
          onClick={publish}
          style={{
            padding: '6px 14px',
            border: '1px solid var(--c-ink)',
            borderRadius: 6,
            background: 'var(--c-ink)',
            color: 'var(--c-bg)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Опубликовать
        </button>
        <button
          type="button"
          onClick={exit}
          style={{
            padding: '6px 14px',
            border: '1px solid var(--c-ink)',
            borderRadius: 6,
            background: 'transparent',
            color: 'var(--c-ink)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Выйти
        </button>
      </span>
    </div>
  )
}
