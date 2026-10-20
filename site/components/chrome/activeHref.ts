import type { NavItem } from '@/lib/chrome'

const norm = (href: string) => (href.endsWith('/') ? href : `${href}/`)

/**
 * Индекс пункта меню, в разделе которого находится страница: самый длинный совпавший адрес
 * среди пунктов и их выпадающих списков («/uslugi/tseny/» — «Цены», а не «Услуги»).
 */
export function activeNavIndex(items: NavItem[], pathname: string): number {
  const path = norm(pathname)
  let best = -1
  let bestLen = 0
  items.forEach((item, i) => {
    for (const href of [item.href, ...(item.children ?? []).map((c) => c.href)]) {
      if (!href.startsWith('/') || href === '/') continue
      const h = norm(href)
      if (path.startsWith(h) && h.length > bestLen) {
        best = i
        bestLen = h.length
      }
    }
  })
  return best
}
