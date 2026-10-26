import type { PageData } from '@/lib/pages'

/**
 * Цена «от» для разметки Service — из плашки первого экрана: «от 700 ₽» → 700. Сумма ищется только
 * рядом со знаком ₽ (в плашке бывает «за 2 часа»), сначала в значении, потом в подписях.
 */
export function priceFromBadge(blocks: PageData['blocks']): number | null {
  const hero = blocks.find((b) => b.blockType === 'hero-slider')
  const badge = hero && hero.blockType === 'hero-slider' ? hero.badge : null
  for (const text of [badge?.value, badge?.note, badge?.text]) {
    const m = text?.match(/(\d[\d\s\u00a0]*)\s*₽/)
    if (m) return Number(m[1].replace(/[^\d]/g, ''))
  }
  return null
}
