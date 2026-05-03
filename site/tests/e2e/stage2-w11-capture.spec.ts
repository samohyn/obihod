/**
 * US-2 Stage 2 W11 — Track E.A capture + axe для 50 sample URL.
 *
 * Контракт: specs/EPIC-SEO-CONTENT-FILL/US-2-sub-and-programmatic/sa-seo.md AC-10.
 *
 * Sample 50 URL из ~250 (репрезентативно):
 *   - 4 pillar (re-capture после Stage 2 cohesion)
 *   - 4 priority-A districts (re-capture)
 *   - 8 sub-services (top wsfreq из 33)
 *   - 12 SD из 100 batch (3 на pillar × 4 districts)
 *   - 4 avtovyshka SD (programmatic Run 5)
 *   - 5 B2B (главная + 4 segments)
 *   - 4 cases (1 на pillar)
 *   - 5 extras (raschet, promalp, arenda, avtovyshka-sub, izmelchitel-vetok-sub)
 *   - 5 blog M2 (sample)
 *
 * Каждый × {desktop 1280×800, mobile 375×800} = 100 PNG + 50 axe.json в `screen/stage2-W11/`.
 *
 * Запуск:
 *   PLAYWRIGHT_EXTERNAL_SERVER=1 pnpm test:e2e --project=chromium tests/e2e/stage2-w11-capture.spec.ts
 *
 * Soft assertions: capture важнее, qa-site строит финальный отчёт по агрегату JSON.
 */
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const SCREEN_DIR = path.resolve(process.cwd(), '..', 'screen', 'stage2-W11')

test.beforeAll(() => {
  fs.mkdirSync(SCREEN_DIR, { recursive: true })
})

interface Stage2Url {
  slug: string
  url: string
  group:
    | 'pillar'
    | 'district-hub'
    | 'sub-service'
    | 'programmatic-sd'
    | 'sd-avtovyshka'
    | 'b2b'
    | 'case'
    | 'extras'
    | 'blog-m2'
}

const URLS: Stage2Url[] = [
  // 4 pillar (re-capture)
  { slug: 'pillar-vyvoz-musora', url: '/vyvoz-musora/', group: 'pillar' },
  { slug: 'pillar-arboristika', url: '/arboristika/', group: 'pillar' },
  { slug: 'pillar-chistka-krysh', url: '/chistka-krysh/', group: 'pillar' },
  { slug: 'pillar-demontazh', url: '/demontazh/', group: 'pillar' },

  // 4 priority-A districts (re-capture)
  { slug: 'district-odincovo', url: '/raiony/odincovo/', group: 'district-hub' },
  { slug: 'district-krasnogorsk', url: '/raiony/krasnogorsk/', group: 'district-hub' },
  { slug: 'district-mytishchi', url: '/raiony/mytishchi/', group: 'district-hub' },
  { slug: 'district-ramenskoye', url: '/raiony/ramenskoye/', group: 'district-hub' },

  // 8 sub-services (top wsfreq из 33)
  { slug: 'sub-kontejner', url: '/vyvoz-musora/kontejner/', group: 'sub-service' },
  { slug: 'sub-vyvoz-stroymusora', url: '/vyvoz-musora/vyvoz-stroymusora/', group: 'sub-service' },
  { slug: 'sub-spil-derevev', url: '/arboristika/spil-derevev/', group: 'sub-service' },
  { slug: 'sub-kronirovanie', url: '/arboristika/kronirovanie/', group: 'sub-service' },
  { slug: 'sub-chistka-mkd', url: '/chistka-krysh/chistka-krysh-mkd/', group: 'sub-service' },
  { slug: 'sub-sbivanie-sosulek', url: '/chistka-krysh/sbivanie-sosulek/', group: 'sub-service' },
  { slug: 'sub-demontazh-dachi', url: '/demontazh/demontazh-dachi/', group: 'sub-service' },
  { slug: 'sub-snos-doma', url: '/demontazh/snos-doma/', group: 'sub-service' },

  // 12 SD из 100 batch (3 на pillar × 4 districts)
  {
    slug: 'sd-vyvoz-kontejner-odincovo',
    url: '/vyvoz-musora/kontejner/odincovo/',
    group: 'programmatic-sd',
  },
  {
    slug: 'sd-vyvoz-stroymusor-krasnogorsk',
    url: '/vyvoz-musora/vyvoz-stroymusora/krasnogorsk/',
    group: 'programmatic-sd',
  },
  {
    slug: 'sd-vyvoz-mebel-mytishchi',
    url: '/vyvoz-musora/staraya-mebel/mytishchi/',
    group: 'programmatic-sd',
  },
  {
    slug: 'sd-arbo-spil-odincovo',
    url: '/arboristika/spil-derevev/odincovo/',
    group: 'programmatic-sd',
  },
  {
    slug: 'sd-arbo-kronirovanie-ramenskoye',
    url: '/arboristika/kronirovanie/ramenskoye/',
    group: 'programmatic-sd',
  },
  {
    slug: 'sd-arbo-pen-mytishchi',
    url: '/arboristika/udalenie-pnya/mytishchi/',
    group: 'programmatic-sd',
  },
  {
    slug: 'sd-krysha-mkd-krasnogorsk',
    url: '/chistka-krysh/chistka-krysh-mkd/krasnogorsk/',
    group: 'programmatic-sd',
  },
  {
    slug: 'sd-krysha-sosulki-odincovo',
    url: '/chistka-krysh/sbivanie-sosulek/odincovo/',
    group: 'programmatic-sd',
  },
  {
    slug: 'sd-krysha-dom-mytishchi',
    url: '/chistka-krysh/chistka-krysh-chastnyy-dom/mytishchi/',
    group: 'programmatic-sd',
  },
  {
    slug: 'sd-demont-dachi-odincovo',
    url: '/demontazh/demontazh-dachi/odincovo/',
    group: 'programmatic-sd',
  },
  {
    slug: 'sd-demont-doma-krasnogorsk',
    url: '/demontazh/snos-doma/krasnogorsk/',
    group: 'programmatic-sd',
  },
  {
    slug: 'sd-demont-zabora-ramenskoye',
    url: '/demontazh/snos-zabora/ramenskoye/',
    group: 'programmatic-sd',
  },

  // 4 avtovyshka SD (programmatic Run 5)
  { slug: 'sd-avto-odincovo', url: '/arenda-tehniki/avtovyshka/odincovo/', group: 'sd-avtovyshka' },
  {
    slug: 'sd-avto-krasnogorsk',
    url: '/arenda-tehniki/avtovyshka/krasnogorsk/',
    group: 'sd-avtovyshka',
  },
  {
    slug: 'sd-avto-mytishchi',
    url: '/arenda-tehniki/avtovyshka/mytishchi/',
    group: 'sd-avtovyshka',
  },
  {
    slug: 'sd-avto-ramenskoye',
    url: '/arenda-tehniki/avtovyshka/ramenskoye/',
    group: 'sd-avtovyshka',
  },

  // 5 B2B
  { slug: 'b2b-hub', url: '/b2b/', group: 'b2b' },
  { slug: 'b2b-uk-tszh', url: '/b2b/uk-tszh/', group: 'b2b' },
  { slug: 'b2b-fm', url: '/b2b/fm-operatoram/', group: 'b2b' },
  { slug: 'b2b-zastr', url: '/b2b/zastrojschikam/', group: 'b2b' },
  { slug: 'b2b-goszakaz', url: '/b2b/goszakaz/', group: 'b2b' },

  // 4 cases (1 на pillar)
  { slug: 'case-vyvoz-stroymusora', url: '/kejsy/vyvoz-stroymusora-odincovo-mart/', group: 'case' },
  { slug: 'case-spil-avariynyy', url: '/kejsy/spil-avariynyy-krasnogorsk/', group: 'case' },
  { slug: 'case-chistka-naledi', url: '/kejsy/chistka-naledi-mkd-odincovo/', group: 'case' },
  {
    slug: 'case-demontazh-dachi',
    url: '/kejsy/demontazh-dachi-staraya-krasnogorsk/',
    group: 'case',
  },

  // 5 extras (special pillars + sub)
  { slug: 'extras-raschet', url: '/raschet-stoimosti/', group: 'extras' },
  { slug: 'extras-promalp', url: '/promyshlennyj-alpinizm/', group: 'extras' },
  { slug: 'extras-arenda-hub', url: '/arenda-tehniki/', group: 'extras' },
  { slug: 'extras-avtovyshka-sub', url: '/arenda-tehniki/avtovyshka/', group: 'extras' },
  { slug: 'extras-porubochnyj', url: '/porubochnyj-bilet/', group: 'extras' },

  // 5 blog M2
  { slug: 'blog-m2-spil-berezy', url: '/blog/spil-berezy-na-uchastke/', group: 'blog-m2' },
  { slug: 'blog-m2-spil-letom', url: '/blog/spil-derevev-letom/', group: 'blog-m2' },
  { slug: 'blog-m2-szhigat-musor', url: '/blog/mozhno-li-szhigat-musor/', group: 'blog-m2' },
  { slug: 'blog-m2-sortirovat', url: '/blog/kak-sortirovat-musor/', group: 'blog-m2' },
  { slug: 'blog-m2-kalkulyatory', url: '/blog/kalkulyatory-obihod/', group: 'blog-m2' },
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
  status: number
  violations: AxeViolation[]
  summary: { critical: number; serious: number; moderate: number; minor: number; total: number }
}

async function captureScreenshots(page: Page, slug: string): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(800)
  await page.screenshot({
    path: path.join(SCREEN_DIR, `${slug}-desktop.png`),
    fullPage: true,
  })

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
  status: number,
): Promise<AxeReport> {
  await page.setViewportSize({ width: 1280, height: 800 })
  const builder = new AxeBuilder({ page }).withTags(WCAG_TAGS)
  const result = await builder.analyze()
  const violations: AxeViolation[] = (result.violations as AxeViolation[]) ?? []

  const summary = violations.reduce(
    (acc, v) => {
      const impact = (v.impact ?? 'minor') as 'critical' | 'serious' | 'moderate' | 'minor'
      if (impact === 'critical') acc.critical++
      else if (impact === 'serious') acc.serious++
      else if (impact === 'moderate') acc.moderate++
      else acc.minor++
      acc.total++
      return acc
    },
    { critical: 0, serious: 0, moderate: 0, minor: 0, total: 0 },
  )

  const report: AxeReport = { slug, url, group, status, violations, summary }
  fs.writeFileSync(
    path.join(SCREEN_DIR, `${slug}-axe.json`),
    JSON.stringify(report, null, 2),
    'utf-8',
  )
  return report
}

test.describe('Stage 2 W11 capture — 50 URL × 2 viewports + axe', () => {
  for (const item of URLS) {
    test(`[${item.group}] ${item.slug} (${item.url})`, async ({ page }) => {
      const response = await page.goto(item.url, { waitUntil: 'domcontentloaded' })
      expect.soft(response, `${item.url} no response`).not.toBeNull()
      const status = response?.status() ?? 0
      // Soft: 4xx/5xx разрешены — capture для qa-site reporting
      expect.soft(status, `${item.url} HTTP status`).toBeLessThan(400)

      try {
        await page.waitForLoadState('networkidle', { timeout: 10000 })
      } catch {
        // analytics / long-poll OK
      }

      await captureScreenshots(page, item.slug)
      const report = await runAxeAndSave(page, item.slug, item.url, item.group, status)

      expect.soft(report.summary.critical, `${item.slug} critical`).toBe(0)
      expect.soft(report.summary.serious, `${item.slug} serious`).toBe(0)
    })
  }
})
