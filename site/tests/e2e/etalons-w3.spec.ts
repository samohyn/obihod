/**
 * US-0 Stage 0 W3 — 8 эталонных страниц AC-11.
 *
 * Для каждого из 8 типов страниц (см. sa-seo §5 AC-11):
 *  - Navigate to URL
 *  - Wait for hydration / load
 *  - Screenshot desktop (1280×800) + mobile (375×800) → screen/etalons-W3/
 *  - Run axe-core scan, save violations to screen/etalons-W3/<type>-axe.json
 *  - Assert: no `severity: 'critical'` and no `severity: 'serious'` violations
 *
 * Запуск:
 *   pnpm test:e2e --project=chromium tests/e2e/etalons-w3.spec.ts
 *
 * Контракт: specs/EPIC-SEO-CONTENT-FILL/US-0-templates-ux-migration/sa-seo.md AC-11.
 *
 * NB: blocks[] из fixtures намеренно пропускаются seed:etalons (Track B-1
 * dependency). Страницы рендерятся с legacy-полями (intro, body, faqGlobal,
 * subServices, и т.д.) — то, что есть в page.tsx сейчас. После Track B-1 +
 * Track B-1.5 (page.tsx → BlockRenderer) тестируем повторно с blocks[].
 */
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const SCREEN_DIR = path.resolve(process.cwd(), '..', 'screen', 'etalons-W3')

// Гарантируем что папка `screen/etalons-W3/` существует.
test.beforeAll(() => {
  fs.mkdirSync(SCREEN_DIR, { recursive: true })
})

interface EtalonCase {
  type: string
  url: string
}

const ETALONS: EtalonCase[] = [
  { type: 'pillar-service', url: '/vyvoz-musora/' },
  { type: 'sub-service', url: '/vyvoz-musora/staraya-mebel/' },
  { type: 'programmatic-sd', url: '/vyvoz-musora/odincovo/' },
  { type: 'district-hub', url: '/raiony/odincovo/' },
  { type: 'blog-post', url: '/blog/chto-takoe-4-v-1/' },
  { type: 'case', url: '/kejsy/snyali-pen-v-gostice/' },
  { type: 'b2b-segment', url: '/b2b/uk-tszh/' },
  { type: 'author', url: '/avtory/brigada-vyvoza-obihoda/' },
]

// WCAG 2.2 AA + 2.1 AA + 2.0 A
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

async function captureScreenshots(page: Page, type: string): Promise<void> {
  // Desktop
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.waitForLoadState('domcontentloaded')
  // small wait for hydration / fonts
  await page.waitForTimeout(800)
  await page.screenshot({
    path: path.join(SCREEN_DIR, `${type}-desktop.png`),
    fullPage: true,
  })

  // Mobile
  await page.setViewportSize({ width: 375, height: 800 })
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(500)
  await page.screenshot({
    path: path.join(SCREEN_DIR, `${type}-mobile.png`),
    fullPage: true,
  })
}

interface AxeViolation {
  id: string
  impact?: string | null
  description?: string
  help?: string
  helpUrl?: string
  nodes?: Array<{ target?: unknown[]; html?: string }>
}

interface AxeReport {
  type: string
  url: string
  violations: AxeViolation[]
  summary: { critical: number; serious: number; moderate: number; minor: number; total: number }
}

async function runAxeAndSave(page: Page, type: string, url: string): Promise<AxeReport> {
  await page.setViewportSize({ width: 1280, height: 800 })
  const builder = new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    // Те же исключения что у admin-a11y — Payload framework constraints, не отвечаем за них.
    // Marketing-страницы не используют Payload admin chrome, но возможны false-positives
    // от reduced animations / CSP. Включаем все базовые правила.
    .disableRules([
      // Marketing-сайт: некоторые seed-страницы пока не имеют достаточного контента
      // для строгих проверок (Track B-1 не завершён, blocks[] не рендерятся).
      // Но не дисейблим ничего критичного — оставляем violations видимыми в JSON.
    ])

  const result = await builder.analyze()
  const violations: AxeViolation[] = (result.violations as AxeViolation[]) ?? []

  const summary = violations.reduce(
    (acc, v) => {
      const k = (v.impact ?? 'minor') as keyof typeof acc
      if (k === 'critical') acc.critical++
      else if (k === 'serious') acc.serious++
      else if (k === 'moderate') acc.moderate++
      else acc.minor++
      acc.total++
      return acc
    },
    { critical: 0, serious: 0, moderate: 0, minor: 0, total: 0 },
  )

  const report: AxeReport = { type, url, violations, summary }
  fs.writeFileSync(
    path.join(SCREEN_DIR, `${type}-axe.json`),
    JSON.stringify(report, null, 2),
    'utf-8',
  )
  return report
}

test.describe('Etalons W3 — 8 reference pages (AC-11)', () => {
  // Default mode (parallel-isolated) — каждый тест независим. Падение одного
  // не должно блокировать остальные 7 для полного отчёта по эталонам.

  for (const etalon of ETALONS) {
    test(`${etalon.type} renders + a11y at ${etalon.url}`, async ({ page }) => {
      // 1. Navigate
      const response = await page.goto(etalon.url, { waitUntil: 'domcontentloaded' })
      expect(response, `${etalon.url} returned no response`).not.toBeNull()
      const status = response?.status() ?? 0
      expect.soft(status, `${etalon.url} HTTP status`).toBeLessThan(400)

      // 2. Screenshots
      await captureScreenshots(page, etalon.type)

      // 3. Axe-core scan + save
      const report = await runAxeAndSave(page, etalon.type, etalon.url)

      // 4. Assert: no critical / serious violations (AC-11.5)
      // soft so мы видим все падения, не bail на первом.
      expect.soft(report.summary.critical, `${etalon.type} critical violations`).toBe(0)
      expect.soft(report.summary.serious, `${etalon.type} serious violations`).toBe(0)
    })
  }
})
