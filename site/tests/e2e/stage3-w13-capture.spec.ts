/**
 * US-3 Stage 3 W13 — Track E.A capture + axe для 16 representative priority-B URL.
 *
 * Контракт: specs/EPIC-SEO-CONTENT-FILL/US-3-priority-b-and-blog-m3/sa-seo.md AC-11
 * (Stage 3 W13 mid-check report).
 *
 * Sample 16 URL (4 pillar + 4 sub + 4 blog M3 + 4 cases) × {desktop 1920×1080,
 * mobile iPhone 13} = 32 PNG + 16 axe.json в `screen/stage3-W13/`.
 *
 * Эталон: tests/e2e/stage2-w11-capture.spec.ts (Stage 2 W11, 50 URL).
 *
 * Запуск:
 *   PLAYWRIGHT_EXTERNAL_SERVER=1 pnpm test:e2e --project=chromium tests/e2e/stage3-w13-capture.spec.ts
 *
 * Soft assertions: capture важнее, qa-site строит финальный отчёт по агрегату JSON
 * (_axe-summary.json создаётся отдельным afterAll-шагом).
 */
import AxeBuilder from '@axe-core/playwright'
import { devices, expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const SCREEN_DIR = path.resolve(process.cwd(), '..', 'screen', 'stage3-W13')

test.beforeAll(() => {
  fs.mkdirSync(SCREEN_DIR, { recursive: true })
})

interface Stage3Url {
  name: string
  path: string
  group: 'pillar-sd' | 'sub-sd' | 'blog-m3' | 'case'
}

const URLS: Stage3Url[] = [
  // 4 priority-B pillar SD (1 на pillar — sample)
  { name: '01-pillar-vyvoz-khimki', path: '/vyvoz-musora/khimki/', group: 'pillar-sd' },
  { name: '02-pillar-arbo-pushkino', path: '/arboristika/pushkino/', group: 'pillar-sd' },
  { name: '03-pillar-chistka-istra', path: '/chistka-krysh/istra/', group: 'pillar-sd' },
  { name: '04-pillar-demontazh-zhukovsky', path: '/demontazh/zhukovsky/', group: 'pillar-sd' },

  // 4 priority-B sub SD (1 на pillar — sample)
  { name: '05-sub-kontejner-khimki', path: '/vyvoz-musora/kontejner/khimki/', group: 'sub-sd' },
  { name: '06-sub-spil-pushkino', path: '/arboristika/spil-derevev/pushkino/', group: 'sub-sd' },
  { name: '07-sub-snega-istra', path: '/chistka-krysh/ot-snega/istra/', group: 'sub-sd' },
  { name: '08-sub-snos-zhukovsky', path: '/demontazh/snos-doma/zhukovsky/', group: 'sub-sd' },

  // 4 Blog M3 sample (1 на pillar)
  { name: '09-blog-raschistka-stroyka', path: '/blog/raschistka-uchastka-pod-stroyku/', group: 'blog-m3' },
  { name: '10-blog-spil-zimoy', path: '/blog/spil-derevev-zimoy/', group: 'blog-m3' },
  { name: '11-blog-chistka-osen', path: '/blog/kogda-zakazat-chistku-krysh-osenyu/', group: 'blog-m3' },
  { name: '12-blog-arbo-vs-sadovnik', path: '/blog/cherta-mezhdu-arbo-i-sadovnikom/', group: 'blog-m3' },

  // 4 Cases sample (1 на district)
  { name: '13-case-khimki-aviasklad', path: '/kejsy/vyvoz-konteyner-27m3-khimki-aviasklad/', group: 'case' },
  { name: '14-case-pushkino-snt', path: '/kejsy/spil-8-derevev-snt-pushkino/', group: 'case' },
  { name: '15-case-istra-livnevki', path: '/kejsy/chistka-livnevyh-krysh-istra/', group: 'case' },
  { name: '16-case-zhukovsky-aviasklad', path: '/kejsy/demontazh-aviasklada-zhukovskij/', group: 'case' },
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
  name: string
  url: string
  group: string
  status: number
  violations: AxeViolation[]
  passesCount: number
  summary: { critical: number; serious: number; moderate: number; minor: number; total: number }
}

async function runAxeAndSave(
  page: Page,
  name: string,
  url: string,
  group: string,
  status: number,
): Promise<AxeReport> {
  const builder = new AxeBuilder({ page }).withTags(WCAG_TAGS)
  const result = await builder.analyze()
  const violations: AxeViolation[] = (result.violations as AxeViolation[]) ?? []
  const passesCount = (result.passes ?? []).length

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

  const report: AxeReport = { name, url, group, status, violations, passesCount, summary }
  fs.writeFileSync(
    path.join(SCREEN_DIR, `${name}-axe.json`),
    JSON.stringify(report, null, 2),
    'utf-8',
  )
  return report
}

test.describe('Stage 3 W13 capture — 16 priority-B URL × 2 viewports + axe', () => {
  for (const item of URLS) {
    test(`[${item.group}] ${item.name} (${item.path})`, async ({ browser }) => {
      // Desktop 1920×1080
      const desktopCtx = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
      const desktopPage = await desktopCtx.newPage()
      const response = await desktopPage.goto(`http://localhost:3000${item.path}`, {
        waitUntil: 'domcontentloaded',
      })
      expect.soft(response, `${item.path} no response`).not.toBeNull()
      const status = response?.status() ?? 0
      // Soft: 4xx/5xx разрешены — capture для qa-site reporting
      expect.soft(status, `${item.path} HTTP status`).toBeLessThan(400)

      try {
        await desktopPage.waitForLoadState('networkidle', { timeout: 10000 })
      } catch {
        // analytics / long-poll OK
      }
      await desktopPage.waitForTimeout(800)

      await desktopPage.screenshot({
        path: path.join(SCREEN_DIR, `${item.name}-desktop.png`),
        fullPage: true,
      })

      // axe (run на desktop viewport)
      const report = await runAxeAndSave(desktopPage, item.name, item.path, item.group, status)
      await desktopCtx.close()

      // Mobile iPhone 13 (375×812)
      const mobileCtx = await browser.newContext({ ...devices['iPhone 13'] })
      const mobilePage = await mobileCtx.newPage()
      await mobilePage.goto(`http://localhost:3000${item.path}`, { waitUntil: 'domcontentloaded' })
      try {
        await mobilePage.waitForLoadState('networkidle', { timeout: 10000 })
      } catch {
        // OK
      }
      await mobilePage.waitForTimeout(500)
      await mobilePage.screenshot({
        path: path.join(SCREEN_DIR, `${item.name}-mobile.png`),
        fullPage: true,
      })
      await mobileCtx.close()

      expect.soft(report.summary.critical, `${item.name} critical`).toBe(0)
      expect.soft(report.summary.serious, `${item.name} serious`).toBe(0)
    })
  }
})

test.afterAll(() => {
  // Aggregate axe results across all 16 URLs
  const files = fs
    .readdirSync(SCREEN_DIR)
    .filter((f) => f.endsWith('-axe.json') && !f.startsWith('_'))
    .sort()

  if (files.length === 0) return

  const reports = files.map((f) => {
    const raw = fs.readFileSync(path.join(SCREEN_DIR, f), 'utf-8')
    return JSON.parse(raw) as AxeReport
  })

  const totals = reports.reduce(
    (acc, r) => {
      acc.critical += r.summary.critical
      acc.serious += r.summary.serious
      acc.moderate += r.summary.moderate
      acc.minor += r.summary.minor
      acc.total += r.summary.total
      return acc
    },
    { critical: 0, serious: 0, moderate: 0, minor: 0, total: 0 },
  )

  // По группам
  const byGroup: Record<
    string,
    { count: number; critical: number; serious: number; moderate: number; minor: number }
  > = {}
  for (const r of reports) {
    if (!byGroup[r.group]) {
      byGroup[r.group] = { count: 0, critical: 0, serious: 0, moderate: 0, minor: 0 }
    }
    byGroup[r.group].count++
    byGroup[r.group].critical += r.summary.critical
    byGroup[r.group].serious += r.summary.serious
    byGroup[r.group].moderate += r.summary.moderate
    byGroup[r.group].minor += r.summary.minor
  }

  // Уникальные violation IDs (для сравнения с Stage 2 W11 baseline)
  const violationIds = new Map<string, { impact: string; pages: number }>()
  for (const r of reports) {
    const seenOnPage = new Set<string>()
    for (const v of r.violations) {
      if (seenOnPage.has(v.id)) continue
      seenOnPage.add(v.id)
      const existing = violationIds.get(v.id)
      if (existing) {
        existing.pages++
      } else {
        violationIds.set(v.id, { impact: v.impact ?? 'minor', pages: 1 })
      }
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    stage: 'Stage 3 W13 mid-check',
    urlsCount: reports.length,
    viewports: ['desktop 1920×1080', 'mobile iPhone 13 (375×812)'],
    totals,
    byGroup,
    violationIds: Object.fromEntries(
      Array.from(violationIds.entries()).map(([id, info]) => [id, info]),
    ),
    reports: reports.map((r) => ({
      name: r.name,
      url: r.url,
      group: r.group,
      status: r.status,
      summary: r.summary,
    })),
  }

  fs.writeFileSync(
    path.join(SCREEN_DIR, '_axe-summary.json'),
    JSON.stringify(summary, null, 2),
    'utf-8',
  )
})
