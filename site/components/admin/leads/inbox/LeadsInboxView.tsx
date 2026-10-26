import type { ListViewServerProps } from 'payload'
import { headers } from 'next/headers'
import { Gutter } from '@payloadcms/ui'

import { isAdminUser } from '@/lib/auth/access'

import { LeadsInbox } from './LeadsInbox'
import { loadInbox } from './queries'

/**
 * Экран списка «Заявки» вместо штатной таблицы Payload (план 09, этап 5.2) — подключён в
 * collections/Leads.ts → admin.components.views.list. Штатная форма заявки остаётся по ссылке
 * «Все поля заявки» в карточке.
 */
export async function LeadsInboxView({ payload, user, searchParams }: ListViewServerProps) {
  if (!isAdminUser(user, await headers())) {
    return (
      <Gutter>
        <p>Заявки видит только администратор.</p>
      </Gutter>
    )
  }
  const data = await loadInbox(payload, searchParams ?? {})
  return (
    <Gutter className="leads-inbox-gutter">
      <LeadsInbox data={data} />
    </Gutter>
  )
}
