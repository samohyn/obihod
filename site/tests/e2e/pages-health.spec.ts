/**
 * Здоровье страниц (DoD плана 09) на страницах, которые рендерятся без контента в БД:
 *   - нет горизонтального скролла на 360 / 768 / 1280 / 1440;
 *   - нет ошибок в консоли браузера;
 *   - нет упавших запросов к своему сайту (4xx/5xx, кроме самой страницы 404).
 *
 * Ширины задаются здесь, поэтому спека идёт только в проекте chromium (playwright.config).
 * Шаблоны с контентом (pillar, подуслуга, гео…) проверяются так же на staging.
 */
import { expect, test } from '@playwright/test'

import { uniqueIp } from './_helpers/leads'

const PAGES = [
  '/',
  '/kontakty/',
  '/kalkulyator/foto-smeta/',
  '/otzyvy/',
  '/uslugi/',
  '/b2b/',
  '/raiony/',
  '/kejsy/',
  '/blog/',
  '/o-kompanii/',
  '/garantii/',
  '/politika-konfidentsialnosti/',
]
const WIDTHS = [360, 768, 1280, 1440]

/** Известный горизонтальный скролл: страница → ширина → где чиним. Починили — тест попросит убрать. */
const KNOWN_OVERFLOW: Record<string, Record<number, string>> = {
  '/': { 360: 'этап 2: калькулятор главной (.hp-calc-fields) на 2px шире экрана' },
}

for (const url of PAGES) {
  test(`${url}: без горизонтального скролла на ${WIDTHS.join('/')}`, async ({ page }) => {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(url)
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement
        const extra = doc.scrollWidth - doc.clientWidth
        if (extra <= 1) return null
        // Самый правый элемент, вылезающий за экран, — чтобы было что чинить.
        // Содержимое каруселей и блоков с собственной прокруткой/обрезкой не в счёт.
        const clipped = (el: Element) => {
          for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            if (getComputedStyle(p).overflowX !== 'visible') return true
          }
          return false
        }
        let worst: { sel: string; right: number } | null = null
        for (const el of Array.from(document.body.querySelectorAll('*'))) {
          if (clipped(el)) continue
          const r = el.getBoundingClientRect()
          if (r.right > doc.clientWidth + 1 && (!worst || r.right > worst.right)) {
            const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : ''
            worst = {
              sel: el.tagName.toLowerCase() + (cls ? `.${cls}` : ''),
              right: Math.round(r.right),
            }
          }
        }
        return { extra, worst }
      })
      const known = KNOWN_OVERFLOW[url]?.[width]
      if (known) {
        test
          .info()
          .annotations.push({ type: 'известный дефект', description: `${width}px — ${known}` })
        expect(
          overflow,
          `${width}px: скролла больше нет — уберите из KNOWN_OVERFLOW`,
        ).not.toBeNull()
      } else {
        expect(overflow, `ширина ${width}px`).toBeNull()
      }
    }
  })

  test(`${url}: без ошибок в консоли и упавших запросов`, async ({ page, baseURL }) => {
    // Свой IP на тест: иначе метрики скорости всех страниц упираются в лимит /api/rum (429).
    await page.context().setExtraHTTPHeaders({ 'x-real-ip': uniqueIp() })
    const problems: string[] = []
    page.on('console', (m) => {
      if (m.type() === 'error') problems.push(`console: ${m.text().slice(0, 200)}`)
    })
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message.slice(0, 200)}`))
    page.on('response', (r) => {
      const sameOrigin = baseURL && r.url().startsWith(baseURL)
      if (sameOrigin && r.status() >= 400 && r.request().resourceType() !== 'document') {
        problems.push(`HTTP ${r.status()}: ${r.url().replace(baseURL!, '')}`)
      }
    })
    await page.goto(url, { waitUntil: 'networkidle' })
    expect(problems).toEqual([])
  })
}
