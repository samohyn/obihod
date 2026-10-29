'use client'

import { ErrorState } from '@/components/blocks/v3/ErrorState'
import { usePhone } from '@/components/chrome/PhoneContext'

/**
 * 500 по brand-guide §11.5 — внутри layout, шапка и подвал остаются. Ошибку сервер уже записал
 * в журнал pm2 (с digest); сюда приходит только digest, без текста ошибки.
 */
export default function MarketingError({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  const phone = usePhone()
  return (
    <ErrorState
      illustration="saw"
      code="Ошибка 500"
      title="Сбой на нашей стороне"
      text="Страница не загрузилась из-за ошибки на сервере. Обновите её — обычно этого хватает."
      actions={[
        { label: 'Обновить страницу', onClick: retry },
        { label: 'На главную', href: '/', variant: 'ghost' },
      ]}
      fallback={
        <>
          Не помогло — позвоните <a href={`tel:${phone.phoneE164}`}>{phone.phoneDisplay}</a>, примем
          заявку по телефону.
        </>
      }
    />
  )
}
