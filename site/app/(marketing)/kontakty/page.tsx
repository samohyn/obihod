import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { trail } from '@/lib/breadcrumbs'
import { getContacts } from '@/lib/chrome'
import { PageBlocksView } from '@/components/blocks/v3/PageBlocksView'
import type { V3BlockWithTone } from '@/components/blocks/v3/types'
import { retone } from '@/lib/blocks/v3/retone'
import { getPage } from '@/lib/pages'
import { buildBlocksPageMetadata } from '@/lib/seo/metadata'
import { getCompany, hoursLine } from '@/lib/company'
import { getPageTemplates } from '@/lib/page-templates-server'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('kontakty')
  return page ? buildBlocksPageMetadata(page, '/kontakty/') : {}
}

/**
 * Контакты — документ «Страницы» kontakty; телефон, почта, адрес, часы и цифры оффера —
 * из «Компания и контакты», сразу под первым экраном. Нет опубликованного документа — 404.
 */
export default async function KontaktyPage() {
  const [page, contacts, company, t] = await Promise.all([
    getPage('kontakty'),
    getContacts(),
    getCompany(),
    getPageTemplates(),
  ])
  if (!page) notFound()
  const [hero, ...rest] = page.blocks
  const info: V3BlockWithTone = {
    blockType: 'about-stats',
    eyebrow: 'Связаться',
    title: t.contactsTitle,
    text: hoursLine(company),
    checklist: [
      `Телефон: ${contacts.phoneDisplay}`,
      `Почта: ${contacts.email}`,
      `Юридический адрес: ${contacts.addressLine}`,
      'Клиентов по этому адресу не принимаем — бригада и оценщик приезжают к вам',
      t.contactsPhoto,
    ],
    stats: [
      { value: `${company.callbackMinutes} мин`, label: 'перезвоним после заявки' },
      { value: `${company.photoEstimateMinutes} мин`, label: 'смета по фото' },
      ...(company.leadsAllDay ? [{ value: '24/7', label: 'приём заявок' }] : []),
      { value: `${company.emergencyHours} ч`, label: 'аварийный выезд' },
    ],
  }
  return (
    <PageBlocksView
      page={{ ...page, blocks: retone([hero, info, ...rest]) }}
      crumbs={trail('kontakty')}
    />
  )
}
