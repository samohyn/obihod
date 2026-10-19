/**
 * Доступность (axe-core, WCAG 2.2 AA) на страницах, которые рендерятся без контента в БД.
 *
 * Гейт: нет НОВЫХ нарушений уровня serious/critical. Уже известные — в
 * a11y-baseline.json (страница → правила); их чиним на этапе 2 (блоки и формы).
 * Если нарушение из базы исчезло — тест тоже падает: уберите его из базы.
 * Обновить базу осознанно: A11Y_UPDATE_BASELINE=1 pnpm test:e2e tests/e2e/a11y.spec.ts --project=chromium
 *
 * Все нарушения (включая moderate/minor) и «incomplete» (axe не уверен — нужна
 * ручная проверка) прикладываются к отчёту JSON-ом.
 */
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const BASELINE_FILE = path.join(__dirname, 'a11y-baseline.json')
const UPDATE = process.env.A11Y_UPDATE_BASELINE === '1'

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
  '/stranitsa-kotoroy-net/',
]

type Baseline = Record<string, Record<string, string[]>>
const readBaseline = (): Baseline =>
  fs.existsSync(BASELINE_FILE)
    ? (JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8')) as Baseline)
    : {}

test.describe.configure({ mode: 'serial' })

for (const url of PAGES) {
  test(`axe: ${url}`, async ({ page }, testInfo) => {
    await page.goto(url)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    await testInfo.attach('axe.json', {
      body: JSON.stringify(
        { violations: results.violations, incomplete: results.incomplete },
        null,
        2,
      ),
      contentType: 'application/json',
    })

    const blocking = results.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => v.id)
      .sort()

    const project = testInfo.project.name
    if (UPDATE) {
      const base = readBaseline()
      base[project] = { ...base[project], [url]: blocking }
      fs.writeFileSync(BASELINE_FILE, JSON.stringify(base, null, 2) + '\n')
      return
    }

    const known = readBaseline()[project]?.[url] ?? []
    const fresh = blocking.filter((id) => !known.includes(id))
    const fixed = known.filter((id) => !blocking.includes(id))
    const describe = (ids: string[]) =>
      results.violations
        .filter((v) => ids.includes(v.id))
        .map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} эл.`)
    expect(fresh, `новые нарушения:\n${describe(fresh).join('\n')}`).toEqual([])
    expect(fixed, 'починено — уберите из a11y-baseline.json').toEqual([])
  })
}
