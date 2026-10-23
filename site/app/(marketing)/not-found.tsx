import { PageHeader } from '@/components/blocks/v3/PageHeader'
import type { ServicesTilesBlock, V3BlockWithTone } from '@/components/blocks/v3/types'
import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { retone } from '@/lib/blocks/v3/retone'
import { getContacts } from '@/lib/chrome'
import { getPage } from '@/lib/pages'
import { getPageTemplates } from '@/lib/page-templates-server'

/** 404 по дизайну v3: куда пойти дальше — направления из «Услуг» и заявка. */
export default async function NotFound() {
  const [contacts, uslugi, t] = await Promise.all([
    getContacts(),
    getPage('uslugi'),
    getPageTemplates(),
  ])
  const tiles = uslugi?.blocks.find((b) => b.blockType === 'services-tiles') as
    ServicesTilesBlock | undefined
  const form = uslugi?.blocks.find((b) => b.blockType === 'final-form')
  const blocks: V3BlockWithTone[] = []
  if (tiles) blocks.push({ ...tiles, eyebrow: 'Услуги', title: t.notFoundTilesTitle })
  if (form) blocks.push(form)
  return (
    <>
      <PageHeader eyebrow={t.notFoundEyebrow} title={t.notFoundTitle} lead={t.notFoundLead} />
      <V3BlockRenderer blocks={retone(blocks)} phoneDisplay={contacts.phoneDisplay} />
    </>
  )
}
