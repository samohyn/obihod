'use client'

import { useEffect } from 'react'

/**
 * Минимальный client-island для Header'а.
 *
 * 1. Закрывает открытые `<details data-header-group>` при клике вне группы —
 *    иначе native <details> «залипает» после клика по триггеру на desktop
 *    (hover-open работает, а click-open так и остаётся открытым).
 * 2. Esc закрывает все группы + сбрасывает burger-чекбокс.
 * 3. Клик по якорю/ссылке внутри nav на mobile сбрасывает burger.
 *
 * Эталон поведения — inline-script в design-system/brand-guide.html.
 */
export function CloseDetailsOnClickOutside({ burgerId }: { burgerId: string }) {
  useEffect(() => {
    function closeAllGroups() {
      document
        .querySelectorAll<HTMLDetailsElement>('details[data-header-group][open]')
        .forEach((d) => {
          d.removeAttribute('open')
        })
    }
    function uncheckBurger() {
      const burger = document.getElementById(burgerId) as HTMLInputElement | null
      if (burger && burger.checked) burger.checked = false
    }

    function onClick(e: MouseEvent) {
      const target = e.target as Node | null
      if (!target) return
      document
        .querySelectorAll<HTMLDetailsElement>('details[data-header-group][open]')
        .forEach((d) => {
          if (!d.contains(target)) d.removeAttribute('open')
        })
      // клик по anchor внутри nav на mobile → сбросить burger
      if (target instanceof Element) {
        const anchor = target.closest('a[data-header-link]')
        if (anchor) {
          uncheckBurger()
          closeAllGroups()
        }
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeAllGroups()
        uncheckBurger()
      }
    }

    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [burgerId])

  return null
}
