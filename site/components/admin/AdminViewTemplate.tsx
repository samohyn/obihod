import type { ReactNode } from 'react'
import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'

/**
 * Рамка админки (шапка и меню слева) для своих экранов — /admin/help, /admin/security,
 * /admin/audit: без неё Payload рисует экран на пустой странице и из него некуда уйти.
 */
export function AdminViewTemplate({
  initPageResult,
  params,
  searchParams,
  children,
}: Pick<AdminViewServerProps, 'initPageResult' | 'params' | 'searchParams'> & {
  children: ReactNode
}) {
  const { req, locale, permissions, visibleEntities } = initPageResult
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={req.user || undefined}
      visibleEntities={visibleEntities}
    >
      {children}
    </DefaultTemplate>
  )
}
