// Общее для документов «Страницы»: калькулятор из готовой подуслуги, плитки направлений.

import type { CalculatorBlock, ServiceTile } from '@/components/blocks/v3/types'

import { img } from '../sub-services/_template'
import type { SubServiceContent } from '../sub-services/types'

/** Калькулятор подуслуги — без якоря и фона: на хабе он встаёт в свою позицию. */
export function calcFrom(
  content: SubServiceContent,
  override: Partial<Omit<CalculatorBlock, 'blockType'>> = {},
): Omit<CalculatorBlock, 'blockType'> {
  const block = content.blocks.find((b) => b.blockType === 'calculator-v3')
  if (!block || block.blockType !== 'calculator-v3') {
    throw new Error(`у «${content.slug}» нет калькулятора`)
  }
  const rest = Object.fromEntries(
    Object.entries(block).filter(([k]) => !['blockType', 'tone', 'anchor'].includes(k)),
  ) as Omit<CalculatorBlock, 'blockType'>
  return { ...rest, ...override }
}

/** Направления плитками — «Что ещё делаем» внизу хабов. */
export const PILLAR: Record<string, ServiceTile> = {
  arboristika: {
    title: 'Спил и уход за деревьями',
    text: 'Спил, обрезка, пни, аварийно',
    price: 'от 2 500 ₽',
    href: '/arboristika/',
    image: img('arb-climb', 'Арборист на дереве у дома'),
  },
  vyvoz: {
    title: 'Вывоз мусора',
    text: 'Газель с грузчиками, контейнеры',
    price: 'от 12 800 ₽',
    href: '/vyvoz-musora/',
    image: img('vyvoz-gazel', 'Грузчики загружают Газель'),
  },
  krysha: {
    title: 'Крыши и снег',
    text: 'Кровли, сосульки, дворы',
    price: 'от 150 ₽/м²',
    href: '/chistka-krysh/',
    image: img('zima-krysha-lenta', 'Чистка крыши от снега'),
  },
  demontazh: {
    title: 'Демонтаж и снос',
    text: 'Дачи, бани, сараи, заборы',
    price: 'от 18 000 ₽',
    href: '/demontazh/',
    image: img('demo-dacha', 'Снос старой дачи'),
  },
  landshaft: {
    title: 'Дизайн ландшафта',
    text: 'Проект, газон, мощение, свет',
    price: 'от 250 ₽/м²',
    href: '/dizain-landshafta/',
    image: img('garden', 'Ухоженный участок'),
  },
  arenda: {
    title: 'Аренда техники',
    text: 'Автовышка, измельчитель, самосвал',
    price: 'от 9 600 ₽/смена',
    href: '/arenda-tehniki/',
    image: img('eq-lift', 'Автовышка'),
  },
  uborka: {
    title: 'Уборка территории',
    text: 'Расчистка, покос, уборка участка',
    price: 'от 12 800 ₽',
    href: '/uborka-territorii/',
    image: img('yard-after', 'Чистый участок'),
  },
  alpinizm: {
    title: 'Промышленный альпинизм',
    text: 'Фасады, швы, водостоки',
    price: 'от 280 ₽/м²',
    href: '/promyshlennyj-alpinizm/',
    image: img('zima-sosulki', 'Альпинист на фасаде'),
  },
  bilet: {
    title: 'Порубочный билет',
    text: 'Документы и подача за вас',
    price: 'от 8 600 ₽',
    href: '/porubochnyj-bilet/',
    image: img('act', 'Документы на столе'),
  },
}
