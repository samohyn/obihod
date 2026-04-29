import type { FC, ReactNode } from 'react'
import LeadsBadgeOverlay from './LeadsBadgeOverlay'

/**
 * LeadsBadgeProvider — server-side wrapper для admin.components.providers,
 * рендерит client-overlay LeadsBadgeOverlay внутри admin app shell.
 *
 * Wave 3 · PAN-6 part 3. Spec: sa-panel-wave3.md §3.5.
 */

const LeadsBadgeProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <LeadsBadgeOverlay />
    </>
  )
}

export default LeadsBadgeProvider
