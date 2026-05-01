'use client'

import { useEffect } from 'react'

/**
 * A11yRowCheckboxOverlay — client-only side-effect, который через
 * MutationObserver добавляет `aria-label` на каждый Payload native
 * row-select checkbox во всех list-views.
 *
 * Закрывает critical axe violation `aria-input-field-name` / `label`
 * (WCAG 2.2 SC 4.1.2 Name/Role/Value, SC 1.3.1 Info & Relationships).
 *
 * DOM структура Payload 3.84 (verified локально 2026-05-01 на /admin/collections/cases):
 *   <th id="heading-_select"><div class="select-all select-all__checkbox checkbox-input">
 *     <div class="checkbox-input__input"><input type="checkbox" id="select-all"/></div>
 *   <td class="cell-_select"><div class="select-row select-row__checkbox checkbox-input">
 *     <div class="checkbox-input__input"><input type="checkbox" id="_R_…"/></div>
 *
 * Класс `checkbox-input__input` — на родительском DIV, НЕ на самом input.
 * Поэтому selector — `.checkbox-input__input > input[type="checkbox"]`.
 *
 * Header (select-all) — `closest('th')` truthy → «Выделить все строки».
 * Row-level — `closest('td')` truthy → «Выделить строку».
 *
 * Гард `if (input.dataset.a11yLabeled) return;` исключает повторную обработку.
 *
 * RU-only label (admin локализован полностью per payload.config.ts).
 *
 * Spec: PANEL-AXE-PAYLOAD-CORE-A11Y / sa-panel.md.
 */

const SELECTOR = '.checkbox-input__input > input[type="checkbox"]'
const LABEL_ROW = 'Выделить строку'
const LABEL_HEADER = 'Выделить все строки'

function hasNonEmptyAccessibleName(input: HTMLInputElement): boolean {
  // aria-label со значением (не пустая строка).
  const ariaLabel = input.getAttribute('aria-label')
  if (ariaLabel && ariaLabel.trim().length > 0) return true

  // aria-labelledby — резолвим IDs и проверяем text content. Если ссылка
  // указывает на сам input или на пустой узел — accessible name пустой
  // (наблюдаемый случай Payload select-all: aria-labelledby="select-all"
  // ссылается на сам checkbox, что даёт пустое имя per ARIA spec).
  const labelledBy = input.getAttribute('aria-labelledby')
  if (labelledBy) {
    const ids = labelledBy.split(/\s+/).filter(Boolean)
    for (const id of ids) {
      if (id === input.id) continue // self-reference — не валидный source
      const el = document.getElementById(id)
      if (el && (el.textContent?.trim().length ?? 0) > 0) return true
    }
  }

  // <label for="..."> с непустым текстом.
  if (input.labels) {
    for (const label of Array.from(input.labels)) {
      if ((label.textContent?.trim().length ?? 0) > 0) return true
    }
  }

  return false
}

function applyLabels(root: ParentNode = document) {
  const inputs = root.querySelectorAll<HTMLInputElement>(SELECTOR)
  inputs.forEach((input) => {
    if (input.dataset.a11yLabeled === '1') return
    if (hasNonEmptyAccessibleName(input)) {
      input.dataset.a11yLabeled = '1'
      return
    }
    const isHeader = input.closest('th') !== null
    input.setAttribute('aria-label', isHeader ? LABEL_HEADER : LABEL_ROW)
    input.dataset.a11yLabeled = '1'
  })
}

export default function A11yRowCheckboxOverlay() {
  useEffect(() => {
    applyLabels()

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type !== 'childList') continue
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue
          // Узел сам — checkbox?
          if (node.matches?.(SELECTOR)) {
            applyLabels(node.parentNode ?? document)
            continue
          }
          // Или содержит checkboxes?
          if (node.querySelector?.(SELECTOR)) {
            applyLabels(node)
          }
        }
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}
