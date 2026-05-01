import type { FC, ReactNode } from 'react'
import A11yRowCheckboxOverlay from './A11yRowCheckboxOverlay'

/**
 * A11yRowCheckboxProvider — server-side wrapper для admin.components.providers.
 * Подмешивает A11yRowCheckboxOverlay (client-side MutationObserver) в admin
 * app shell, чтобы вешать `aria-label` на Payload native row-select checkbox
 * (`input.checkbox-input__input`) во всех list-views.
 *
 * Spec: PANEL-AXE-PAYLOAD-CORE-A11Y / sa-panel.md (Approach: JS injection,
 * CSS pseudo-elements не дают accessible name input'у).
 *
 * Pattern зеркалит LeadsBadgeProvider.tsx (Wave 3 · PAN-6 part 3).
 */

const A11yRowCheckboxProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <A11yRowCheckboxOverlay />
    </>
  )
}

export default A11yRowCheckboxProvider
