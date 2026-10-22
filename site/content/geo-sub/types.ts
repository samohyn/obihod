import type { IconName } from '@/components/blocks/v3/shared'

/** Карточка «Что важно в районе»: кто отвечает, что проверить, как считаем цену. */
export type InfoCard = {
  icon: IconName
  title: string
  text: string
  metaLabel?: string
  metaValue?: string
}

/**
 * Местное наполнение записи «Услуга × район» с подуслугой (/направление/подуслуга/район/).
 * Только проверяемые факты (источники — districts.ts) и обещания оффера метками.
 */
export type GeoSubContent = {
  /** Первый экран и description для поисковиков: первое предложение — до 150 знаков. */
  lead: string
  info: InfoCard[]
  faq: [question: string, answer: string][]
  /** Микрорайоны и населённые пункты округа — блок «Работаем в …». */
  landmarks: string[]
  /** Строка под первой вкладкой цен: как калькулятор считает этот район. */
  price: string
}

/** Ключ — `направление/подуслуга/район`. */
export type GeoSubMap = Record<string, GeoSubContent>
