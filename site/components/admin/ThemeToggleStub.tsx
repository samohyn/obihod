'use client'

import { useState } from 'react'

/**
 * ThemeToggleStub — UI-only переключатель темы для admin.
 *
 * UI-only (по решению оператора 2026-05-01):
 *   - на click: визуальная подмена sun ↔ moon icon
 *   - НЕТ persistence (localStorage/cookie/Payload preferences)
 *   - НЕТ реального theme apply (data-theme attr НЕ меняется)
 *   - на reload — возвращается в default (sun = light)
 *
 * Полная dark-theme логика — отдельный US PANEL-DARK-THEME-LOGIC
 * (blocked by §5 brand-guide dark-mode tokens verification).
 *
 * Размещён в admin.components.settingsMenu — gear-popup в nav__controls.
 *
 * a11y:
 *   - aria-pressed отражает visual state (true = moon visible)
 *   - aria-label полный с «coming soon» — пользователь понимает, что persist отсутствует
 *   - SVG aria-hidden="true" focusable="false" (декор)
 *
 * Spec: PANEL-HEADER-CHROME-POLISH §C.
 */
export default function ThemeToggleStub() {
  const [isDark, setIsDark] = useState(false)

  return (
    <button
      type="button"
      className="theme-toggle-stub"
      onClick={() => setIsDark((v) => !v)}
      aria-pressed={isDark}
      aria-label={
        isDark
          ? 'Тёмная тема (демо · переключение пока не сохраняется)'
          : 'Светлая тема (демо · переключение пока не сохраняется)'
      }
      title="Тёмная тема — coming soon"
    >
      {isDark ? (
        // Moon — line-art, brand-guide §9 stroke 1.5 currentColor
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M20 14.5 A8 8 0 0 1 9.5 4 A8 8 0 1 0 20 14.5 Z" />
        </svg>
      ) : (
        // Sun — line-art, 8 rays + circle
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2 L12 4" />
          <path d="M12 20 L12 22" />
          <path d="M2 12 L4 12" />
          <path d="M20 12 L22 12" />
          <path d="M5 5 L6.5 6.5" />
          <path d="M17.5 17.5 L19 19" />
          <path d="M5 19 L6.5 17.5" />
          <path d="M17.5 6.5 L19 5" />
        </svg>
      )}
      <span className="theme-toggle-stub__label">{isDark ? 'Тёмная тема' : 'Светлая тема'}</span>
    </button>
  )
}
