/**
 * US-1 Stage 1 W7 — Track E.1 capture + a11y scan для 22 рабочих URL.
 *
 * Контракт: specs/EPIC-SEO-CONTENT-FILL/US-1-pillars-pilot/sa-seo.md AC-10.
 *
 * Для каждого URL × {desktop 1280×800, mobile 375×800}:
 *  - Navigate + waitForLoadState('networkidle')
 *  - Screenshot fullPage → screen/stage1-W7/<slug>-{desktop,mobile}.png
 *  - axe-core scan (desktop only) → screen/stage1-W7/<slug>-axe.json
 *  - SOFT assertions: тест НЕ падает, чтобы capture прошёл по всем 22 URL
 *    даже если у части есть violations. Финальный отчёт строит qa-site из JSON.
 *
 * Total artifacts: 44 PNG + 22 axe.json в `screen/stage1-W7/`.
 *
 * Запуск:
 *   PLAYWRIGHT_EXTERNAL_SERVER=1 pnpm test:e2e --project=chromium tests/e2e/stage1-w7-capture.spec.ts
 *
 * Ожидание: dev-сервер уже запущен на localhost:3000 (PID 22831 из Track D+C).
 *
 * NB: 3 URL отложены post-W7 (404 на Stage 1):
 *  - /sro-licenzii/   (нет роута, US-3)
 *  - /komanda/        (нет роута, US-3)
 *  - /park-tehniki/   (нет роута, US-3)
 */
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const SCREEN_DIR = path.resolve(process.cwd(), '..', 'screen', 'stage1-W7')

test.beforeAll(() => {
  fs.mkdirSync(SCREEN_DIR, { recursive: true })
})

interface Stage1Url {
  slug: string
  url: string
  group:
    | 'home'
    | 'pillar'
    | 'foto-smeta'
    | 'district-hub'
    | 'programmatic-sd'
    | 'blog'
    | 'static'
}

const URLS: Stage1Url[] = [
  // home
  { slug: 'home', url: '/', group: 'home' },

  // 4 pillar
  { slug: 'pillar-vyvoz-musora', url: '/vyvoz-musora/', group: 'pillar' },
  { slug: 'pillar-arboristika', url: '/arboristika/', group: 'pillar' },
  { slug: 'pillar-chistka-krysh', url: '/chistka-krysh/', group: 'pillar' },
  { slug: 'pillar-demontazh', url: '/demontazh/', group: 'pillar' },

  // foto-smeta (USP-pillar)
  { slug: 'foto-smeta', url: '/foto-smeta/', group: 'foto-smeta' },

  // 4 district-hub
  { slug: 'district-odincovo', url: '/raiony/odincovo/', group: 'district-hub' },
  { slug: 'district-krasnogorsk', url: '/raiony/krasnogorsk/', group: 'district-hub' },
  { slug: 'district-mytishchi', url: '/raiony/mytishchi/', group: 'district-hub' },
  { slug: 'district-ramenskoye', url: '/raiony/ramenskoye/', group: 'district-hub' },

  // 4 programmatic SD (Одинцово × 4 услуги)
  { slug: 'sd-vyvoz-odincovo', url: '/vyvoz-musora/odincovo/', group: 'programmatic-sd' },
  { slug: 'sd-arbo-odincovo', url: '/arboristika/odincovo/', group: 'programmatic-sd' },
  { slug: 'sd-krysha-odincovo', url: '/chistka-krysh/odincovo/', group: 'programmatic-sd' },
  { slug: 'sd-demontazh-odincovo', url: '/demontazh/odincovo/', group: 'programmatic-sd' },

  // 5 blog
  { slug: 'blog-4-v-1', url: '/blog/4-v-1-uslugi/', group: 'blog' },
  {
    slug: 'blog-spilit-derevo',
    url: '/blog/mozhno-li-spilit-derevo-na-svoem-uchastke/',
    group: 'blog',
  },
  {
    slug: 'blog-razreshenie',
    url: '/blog/razreshenie-na-spil-moskovskaya-oblast/',
    group: 'blog',
  },
  {
    slug: 'blog-shtraf',
    url: '/blog/shtraf-za-spil-bez-razresheniya/',
    group: 'blog',
  },
  { slug: 'blog-smeta-10-min', url: '/blog/smeta-za-10-minut/', group: 'blog' },

  // 3 static
  { slug: 'static-o-kompanii', url: '/o-kompanii/', group: 'static' },
  { slug: 'static-garantii', url: '/garantii/', group: 'static' },
  { slug: 'static-kak-my-rabotaem', url: '/kak-my-rabotaem/', group: 'static' },
]

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

interface AxeViolation {
  id: string
  impact?: string | null
  description?: string
  help?: string
  helpUrl?: string
  tags?: string[]
  nodes?: Array<{ target?: unknown[]; html?: string }>
}

interface AxeReport {
  slug: string
  url: string
  group: string
  violations: AxeViolation[]
  summary: { critical: number; serious: number; moderate: number; minor: number; total: number }
}

async function captureScreenshots(page: Page, slug: string): Promise<void> {
  // Desktop 1280×800
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(800) // hydration / fonts
  await page.screenshot({
    path: path.join(SCREEN_DIR, `${slug}-desktop.png`),
    fullPage: true,
  })

  // Mobile 375×800
  await page.setViewportSize({ width: 375, height: 800 })
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(500)
  await page.screenshot({
    path: path.join(SCREEN_DIR, `${slug}-mobile.png`),
    fullPage: true,
  })
}

async function runAxeAndSave(
  page: Page,
  slug: string,
  url: string,
  group: string,
): Promise<AxeReport> {
  await page.setViewportSize({ width: 1280, height: 800 })
  const builder = new AxeBuilder({ page }).withTags(WCAG_TAGS)
  const result = await builder.analyze()
  const violations: AxeViolation[] = (result.violations as AxeViolation[]) ?? []

  const summary = violations.reduce(
    (acc, v) => {
      const impact = (v.impact ?? 'minor') as 'critical' | 'serious' | 'moderate' | 'minor'
      // Each violation may have multiple nodes; считаем по violation id (rule),
      // не по node — зеркало отчёта etalons-W3.
      if (impact === 'critical') acc.critical++
      else if (impact === 'serious') acc.serious++
      else if (impact === 'moderate') acc.moderate++
      else acc.minor++
      acc.total++
      return acc
    },
    { critical: 0, serious: 0, moderate: 0, minor: 0, total: 0 },
  )

  const report: AxeReport = { slug, url, group, violations, summary }
  fs.writeFileSync(
    path.join(SCREEN_DIR, `${slug}-axe.json`),
    JSON.stringify(report, null, 2),
    'utf-8',
  )
  return report
}

test.describe('Stage 1 W7 capture — 22 URL × 2 viewports + axe', () => {
  // Изоляция тестов: одна страница не должна блокировать остальные.

  for (const item of URLS) {
    test(`[${item.group}] ${item.slug} (${item.url})`, async ({ page }) => {
      const response = await page.goto(item.url, { waitUntil: 'domcontentloaded' })
      expect.soft(response, `${item.url} no response`).not.toBeNull()
      const status = response?.status() ?? 0
      expect.soft(status, `${item.url} HTTP status`).toBeLessThan(400)

      // networkidle для полноты heroes / fonts
      try {
        await page.waitForLoadState('networkidle', { timeout: 10000 })
      } catch {
        // некоторые страницы могут иметь long-poll / analytics — продолжаем
      }

      await captureScreenshots(page, item.slug)
      const report = await runAxeAndSave(page, item.slug, item.url, item.group)

      // SOFT: не падаем — capture важнее для всех 22.
      // qa-site пишет финальный отчёт по агрегату JSON.
      expect.soft(report.summary.critical, `${item.slug} critical`).toBe(0)
      expect.soft(report.summary.serious, `${item.slug} serious`).toBe(0)
    })
  }
})
