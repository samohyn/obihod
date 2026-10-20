// Витрина блоков библиотеки v3 (этап 2 плана 09): главная C4 собрана из блоков на демо-данных.
// Открыта локально и на staging (APP_ENV=staging, за паролем nginx); на проде — 404.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { getContacts } from '@/lib/chrome'
import { C4_DEMO } from '@/lib/dev-blocks/c4-demo'

export const metadata: Metadata = {
  title: 'Витрина блоков',
  robots: { index: false, follow: false },
}

function isShowcaseAllowed(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.APP_ENV === 'staging'
}

export default async function DevBlocksPage() {
  if (!isShowcaseAllowed()) notFound()
  const contacts = await getContacts()
  return <V3BlockRenderer blocks={C4_DEMO} phoneDisplay={contacts.phoneDisplay} />
}
