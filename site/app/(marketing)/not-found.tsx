import type { Metadata } from 'next'

import { ErrorState } from '@/components/blocks/v3/ErrorState'
import type { ServicesTilesBlock, V3BlockWithTone } from '@/components/blocks/v3/types'
import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { retone } from '@/lib/blocks/v3/retone'
import { getContacts } from '@/lib/chrome'
import { getPage } from '@/lib/pages'
import { getPageTemplates } from '@/lib/page-templates-server'

// Код 404 и <meta robots noindex> ставит сам Next; здесь — свой title и сброс «index, follow» из layout.
export const metadata: Metadata = {
  title: { absolute: 'Страница не найдена — Обиход' },
  robots: null,
}

/** 404 по brand-guide §11.5 (тексты — «Шаблоны страниц»), ниже — направления из «Услуг» и заявка. */
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
      <ErrorState
        illustration="compass"
        code={t.notFoundEyebrow}
        title={t.notFoundTitle}
        text={t.notFoundLead}
        actions={[
          { label: 'На главную', href: '/' },
          { label: 'Все услуги', href: '/uslugi/', variant: 'ghost' },
        ]}
        fallback={
          <>
            Пришли по ссылке с нашего сайта или из закладок? Позвоните{' '}
            <a href={`tel:${contacts.phoneE164}`}>{contacts.phoneDisplay}</a> — подскажем, где
            нужная страница.
          </>
        }
      />
      <V3BlockRenderer blocks={retone(blocks, true)} phoneDisplay={contacts.phoneDisplay} />
    </>
  )
}
