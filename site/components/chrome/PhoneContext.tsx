'use client'

// Телефон из «Компания и контакты» для клиентских компонентов без доступа к базе — страницы ошибки
// app/(marketing)/error.tsx. Значение кладёт layout; без него — номер по умолчанию из lib/offer.ts.

import { createContext, useContext, type ReactNode } from 'react'

import { DEFAULT_COMPANY } from '@/lib/offer'

export interface Phone {
  phoneDisplay: string
  phoneE164: string
}

const PhoneContext = createContext<Phone>({
  phoneDisplay: DEFAULT_COMPANY.phoneDisplay,
  phoneE164: DEFAULT_COMPANY.phoneE164,
})

export function PhoneProvider({ value, children }: { value: Phone; children: ReactNode }) {
  return <PhoneContext value={value}>{children}</PhoneContext>
}

export const usePhone = () => useContext(PhoneContext)
