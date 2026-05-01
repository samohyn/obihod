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
 *
 * --- Race-condition mitigation (PANEL-AXE-PAYLOAD-CORE-A11Y fix-forward 2026-05-01) ---
 *
 * Проблема CI run 25216555569: на медленных runners axe-core scan стартовал
 * раньше, чем MutationObserver успевал навесить aria-label, → critical
 * `label (1 node)` violation на /admin/, /admin/catalog,
 * /admin/collections/services/. Локально race не воспроизводится.
 *
 * Solution layered:
 *   1. Initial pass через `applyLabels()` — синхронно при mount effect.
 *   2. Сразу же 2 requestAnimationFrame passes — догоняют React commits
 *      от Payload SWR/data fetching, которые рендерят rows ПОСЛЕ нашего
 *      first effect (классический race на async data hydration).
 *   3. Long-running MutationObserver — для последующих sort/filter/pagination.
 *
 * Дополнительно — провайдер расширен на ВСЕ unlabeled form inputs в admin
 * (top-bar search, hidden filter inputs, etc.), которые могут вылезти на
 * dashboard / catalog / list-views. Закрывает pre-existing label violation
 * который был замаскирован глобальным `label` exception до W7→fix-forward.
 */

const ROW_CHECKBOX_SELECTOR = '.checkbox-input__input > input[type="checkbox"]'
const LABEL_ROW = 'Выделить строку'
const LABEL_HEADER = 'Выделить все строки'

// Generic catch-all selector для прочих unlabeled inputs в Payload admin
// (search bar, hidden _payload toggles, и пр. native widgets). Скрипт
// никогда не трогает inputs которые УЖЕ имеют accessible name.
const ALL_INPUTS_SELECTOR =
  'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]), select, textarea'

function hasNonEmptyAccessibleName(input: HTMLElement): boolean {
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
  if (input instanceof HTMLInputElement && input.labels) {
    for (const label of Array.from(input.labels)) {
      if ((label.textContent?.trim().length ?? 0) > 0) return true
    }
  }

  // НЕ используем `title` как accessible name source: Payload native ставит
  // `title="select-all"` (технический ID) на header checkbox, что НЕ является
  // human-readable name. axe rule `label` (WCAG 4.1.2) требует именно
  // visible label / aria-label / aria-labelledby; title является только
  // last-resort fallback и часто не учитывается для inputs.
  return false
}

function applyRowCheckboxLabels(root: ParentNode = document) {
  const inputs = root.querySelectorAll<HTMLInputElement>(ROW_CHECKBOX_SELECTOR)
  inputs.forEach((input) => {
    // НЕ используем `data-a11yLabeled` гард для row-checkbox, т.к. Payload
    // 3.84 после нашего setAttribute может React-rerender'ом перезаписать
    // aria-label на пустую строку (наблюдаемое поведение на select-all
    // — `aria-labelledby="select-all"` self-reference + `aria-label=""`).
    // Каждый pass проверяем актуальный accessible name заново.
    if (hasNonEmptyAccessibleName(input)) {
      input.dataset.a11yLabeled = '1'
      return
    }
    const isHeader = input.closest('th') !== null
    input.setAttribute('aria-label', isHeader ? LABEL_HEADER : LABEL_ROW)
    input.dataset.a11yLabeled = '1'
  })
}

/**
 * Generic fallback — присваивает aria-label из placeholder/name/role/type
 * прочим Payload native inputs, у которых нет accessible name. Защищает от
 * скрытых widgets (top-bar search, filter inputs, etc.), которые могут
 * вылезать в любой list-view.
 */
function applyGenericLabels(root: ParentNode = document) {
  const inputs = root.querySelectorAll<HTMLElement>(ALL_INPUTS_SELECTOR)
  inputs.forEach((input) => {
    // То же rationale, что и в applyRowCheckboxLabels: не доверяем
    // `data-a11yLabeled` flag — проверяем актуальный accessible name
    // (Payload может React-rerender'ом перезаписать aria-label).
    if (hasNonEmptyAccessibleName(input)) {
      input.dataset.a11yLabeled = '1'
      return
    }
    // Derive label из placeholder → name → type. Fallback string «Поле ввода».
    const placeholder = input.getAttribute('placeholder')?.trim()
    const name = input.getAttribute('name')?.trim()
    const ariaRole = input.getAttribute('role')?.trim()
    const type = input.getAttribute('type')?.trim()
    const derived =
      placeholder || name || ariaRole || (type ? `Поле ${type}` : null) || 'Поле ввода'
    input.setAttribute('aria-label', derived)
    input.dataset.a11yLabeled = '1'
  })
}

function applyAll(root: ParentNode = document) {
  applyRowCheckboxLabels(root)
  applyGenericLabels(root)
}

export default function A11yRowCheckboxOverlay() {
  useEffect(() => {
    // Initial sync pass — до первого paint после mount.
    applyAll()

    // Догоняем React async commits (Payload SWR data hydration) — 2 rAF
    // pass'а покрывают типичный 1-tick async render и race с axe scan.
    let raf1 = 0
    let raf2 = 0
    raf1 = requestAnimationFrame(() => {
      applyAll()
      raf2 = requestAnimationFrame(() => {
        applyAll()
      })
    })

    const observer = new MutationObserver((mutations) => {
      let needsFullScan = false
      for (const m of mutations) {
        // childList — новые inputs добавлены в DOM (sort/filter/pagination).
        if (m.type === 'childList') {
          for (const node of m.addedNodes) {
            if (!(node instanceof Element)) continue
            if (node.matches?.(ROW_CHECKBOX_SELECTOR) || node.matches?.(ALL_INPUTS_SELECTOR)) {
              needsFullScan = true
              break
            }
            if (
              node.querySelector?.(ROW_CHECKBOX_SELECTOR) ||
              node.querySelector?.(ALL_INPUTS_SELECTOR)
            ) {
              needsFullScan = true
              break
            }
          }
        }
        // attributes — React rerender перезаписал aria-label/aria-labelledby
        // на нашем input. Перепрогоняем applyAll, чтобы восстановить label.
        // Filter on attributeName via observer config (ниже) ограничивает
        // только релевантные аттрибуты — overhead minimal.
        if (m.type === 'attributes' && m.target instanceof Element) {
          if (
            m.target.matches?.(ROW_CHECKBOX_SELECTOR) ||
            m.target.matches?.(ALL_INPUTS_SELECTOR)
          ) {
            needsFullScan = true
          }
        }
        if (needsFullScan) break
      }
      if (needsFullScan) applyAll()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-label', 'aria-labelledby'],
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      observer.disconnect()
    }
  }, [])

  return null
}
