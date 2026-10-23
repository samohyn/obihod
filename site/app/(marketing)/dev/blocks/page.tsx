// Витрина блоков библиотеки v3 (этап 2 плана 09): главная C4 собрана из блоков на демо-данных,
// ниже — варианты для страниц услуг (первый экран с обещанием, «что важно знать», форма с фото)
// и документ.
// Открыта локально и на staging (за паролем nginx; узнаём по SITE_URL из deploy/staging/setup.sh
// или APP_ENV=staging); на проде — 404.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Eyebrow, Section, Wrap } from '@/components/blocks/v3/shared'
import { V3BlockRenderer } from '@/components/blocks/v3/V3BlockRenderer'
import { getContacts } from '@/lib/chrome'
import { C4_DEMO } from '@/lib/dev-blocks/c4-demo'
import { DOC_DEMO, SERVICE_DEMO } from '@/lib/dev-blocks/service-demo'

export const metadata: Metadata = {
  title: 'Витрина блоков',
  robots: { index: false, follow: false },
}

function isShowcaseAllowed(): boolean {
  if (process.env.NODE_ENV !== 'production' || process.env.APP_ENV === 'staging') return true
  try {
    return new URL(process.env.SITE_URL ?? '').hostname.startsWith('staging.')
  } catch {
    return false
  }
}

// Решение «показывать или 404» зависит от переменных окружения сервера — страница не кешируется в сборке.
export const dynamic = 'force-dynamic'

export default async function DevBlocksPage() {
  if (!isShowcaseAllowed()) notFound()
  const contacts = await getContacts()
  return (
    <>
      <V3BlockRenderer blocks={C4_DEMO} phoneDisplay={contacts.phoneDisplay} />
      <Divider
        title="Страница услуги"
        text="Первый экран с обещанием оффера под заголовком, «Что важно знать в районе», форма с открытыми фото и описанием"
      />
      <V3BlockRenderer blocks={SERVICE_DEMO} phoneDisplay={contacts.phoneDisplay} />
      <Divider title="Документ" text="Политика и согласие на обработку персональных данных" />
      <V3BlockRenderer blocks={DOC_DEMO} phoneDisplay={contacts.phoneDisplay} />
    </>
  )
}

/** Разделитель витрины: какой набор блоков ниже. */
function Divider({ title, text }: { title: string; text: string }) {
  return (
    <Section tone="alt">
      <Wrap>
        <Eyebrow>Витрина · вариант</Eyebrow>
        <h2 style={{ margin: '12px 0 8px', fontSize: 32 }}>{title}</h2>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--c-ink-soft)' }}>{text}</p>
      </Wrap>
    </Section>
  )
}
