import type { FC, ReactNode } from 'react'
import GlobalSearchOverlay from './GlobalSearchOverlay'

/**
 * GlobalSearchProvider — server wrapper для admin.components.providers.
 *
 * Pattern из LeadsBadgeProvider — server-component обёртка вокруг client
 * overlay. Cmd+K hotkey listener + dropdown live в overlay (client),
 * provider просто mount-ит его в admin shell.
 *
 * PANEL-GLOBAL-SEARCH (ADR-0013) · brand-guide §12.2 ad-search slot.
 */

const GlobalSearchProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <GlobalSearchOverlay />
    </>
  )
}

export default GlobalSearchProvider
