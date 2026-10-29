/**
 * Шаблоны страниц на живом сайте: по одному URL каждого типа × 360/768/1280/1440.
 *
 * Гейт (тест падает): неверный HTTP-статус и JS-исключения на странице.
 * Отчёт (до эталонов этапа 3 шаблоны заведомо с дефектами, падать каждую ночь
 * на известном — шум): горизонтальный скролл по ширинам, нарушения axe
 * serious/critical, ошибки консоли. Всё — в таблицу сводки запуска и в аннотации;
 * скриншоты всех ширин — во вложениях отчёта (артефакт site-checks-report).
 * После этапа 3 скролл и axe станут гейтом.
 */
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import fs from 'node:fs'

const TEMPLATES: { type: string; url: string; status?: number }[] = [
  { type: 'главная', url: '/' },
  { type: 'хаб услуг', url: '/uslugi/' },
  { type: 'pillar', url: '/arboristika/' },
  { type: 'подуслуга', url: '/arboristika/spil-derevev/' },
  { type: 'гео «услуга × город»', url: '/vyvoz-musora/khimki/' },
  { type: 'район', url: '/raiony/zhukovsky/' },
  { type: 'цены', url: '/uslugi/tseny/arboristika/' },
  { type: 'кейс', url: '/kejsy/sezon-chistka-vpp-spil-zhukovskij-cross-pillar/' },
  { type: 'статья', url: '/blog/strojmusor-kak-pravilno-izbavit-sya/' },
  { type: 'B2B', url: '/b2b/dogovor/' },
  { type: 'автор', url: '/avtory/brigada-vyvoza-obihoda/' },
  { type: 'контакты', url: '/kontakty/' },
  { type: 'калькулятор', url: '/kalkulyator/foto-smeta/' },
  { type: '404', url: '/stranitsa-kotoroy-net/', status: 404 },
  { type: '404 на глубоком адресе', url: '/a/b/c/d/', status: 404 },
]
const WIDTHS = [360, 768, 1280, 1440]
const SUMMARY = process.env.SITE_SUMMARY_FILE

test.beforeAll(() => {
  if (SUMMARY && !fs.existsSync(SUMMARY)) {
    fs.writeFileSync(
      SUMMARY,
      '| Шаблон | URL | Горизонтальный скролл | axe serious/critical | Ошибки консоли |\n|---|---|---|---|---|\n',
    )
  }
})

for (const t of TEMPLATES) {
  test(`${t.type}: ${t.url}`, async ({ page }, testInfo) => {
    // Метрики скорости от проверки не нужны: засоряли бы RUM прода, а частые загрузки
    // одной страницы упираются в лимит /api/rum (429 в консоли).
    await page.route('**/api/rum**', (route) => route.fulfill({ status: 204 }))
    const jsErrors: string[] = []
    const consoleErrors: string[] = []
    page.on('pageerror', (e) => jsErrors.push(e.message.slice(0, 200)))
    page.on('console', (m) => {
      // На странице 404 ошибка загрузки самой страницы — норма.
      if (m.type() === 'error' && !(t.status === 404 && /status of 404/.test(m.text()))) {
        consoleErrors.push(m.text().slice(0, 200))
      }
    })

    const overflowAt: string[] = []
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 })
      const res = await page.goto(t.url, { waitUntil: 'load' })
      expect(res?.status(), `HTTP-статус на ${width}px`).toBe(t.status ?? 200)
      const extra = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      if (extra > 1) overflowAt.push(`${width}px (+${extra})`)
      await testInfo.attach(`${width}px.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      })
    }

    await page.setViewportSize({ width: 1280, height: 900 })
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    const blocking = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    await testInfo.attach('axe.json', {
      body: JSON.stringify(axe.violations, null, 2),
      contentType: 'application/json',
    })

    const axeCell = blocking.length ? blocking.map((v) => v.id).join(', ') : '—'
    const consoleCell =
      [...new Set(consoleErrors)]
        .slice(0, 2)
        .map((e) => e.replace(/\|/g, '/').slice(0, 80))
        .join('; ') || '—'
    testInfo.annotations.push(
      { type: 'скролл', description: overflowAt.join(', ') || 'нет' },
      { type: 'axe', description: axeCell },
    )
    if (SUMMARY) {
      fs.appendFileSync(
        SUMMARY,
        `| ${t.type} | \`${t.url}\` | ${overflowAt.join(', ') || '—'} | ${axeCell} | ${consoleCell} |\n`,
      )
    }

    expect(jsErrors, 'JS-исключения на странице').toEqual([])
  })
}
