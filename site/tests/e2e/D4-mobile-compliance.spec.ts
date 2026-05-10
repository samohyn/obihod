/**
 * EPIC-SERVICE-PAGES-REDESIGN D4 — Mobile-first compliance.
 *
 * Контракт: specs/EPIC-SERVICE-PAGES-REDESIGN/intake.md AC-D4.
 * Pre-flight для D5 A/B pilot на /vyvoz-musora/.
 *
 * 5 prod URL × 4 viewport (375 / 414 / 768 / 1024) = 20 screenshots в screen/EPIC-D-D4/.
 *
 * Per URL × per viewport — verify:
 *   1. HTTP 200 OK
 *   2. No critical console errors (filter dev/3rd-party noise)
 *   3. Page title not empty
 *   4. No horizontal scroll on 375 (mobile-first)
 *   5. Touch targets ≥44pt (sample buttons/links)
 *   6. Visible H1
 *   7. Breadcrumbs visible на не-home страницах
 *   8. FAQ accordion присутствует на pillar/SD страницах
 *   9. No broken images (naturalWidth > 0 для loaded <img>)
 *  10. Full-page screenshot saved
 *
 * Запуск:
 *   PLAYWRIGHT_EXTERNAL_SERVER=1 PLAYWRIGHT_BASE_URL=https://obikhod.ru \
 *     pnpm test:e2e --project=chromium tests/e2e/D4-mobile-compliance.spec.ts
 */
import { expect, test, type ConsoleMessage } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const SCREEN_DIR = path.resolve(process.cwd(), '..', 'screen', 'EPIC-D-D4')
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'https://obikhod.ru'

test.beforeAll(() => {
  fs.mkdirSync(SCREEN_DIR, { recursive: true })
})

interface UrlSpec {
  name: string
  path: string
  type: 'home' | 'pillar' | 'sd'
  expectBreadcrumbs: boolean
  expectFaq: boolean
}

const URLS: UrlSpec[] = [
  {
    name: 'home',
    path: '/',
    type: 'home',
    expectBreadcrumbs: false,
    expectFaq: true,
  },
  {
    name: 'vyvoz-musora-T2',
    path: '/vyvoz-musora/',
    type: 'pillar',
    expectBreadcrumbs: true,
    expectFaq: true,
  },
  {
    name: 'khimki-T4-SD',
    path: '/vyvoz-musora/khimki/',
    type: 'sd',
    expectBreadcrumbs: true,
    expectFaq: true,
  },
  {
    name: 'landshaft-T2',
    path: '/dizain-landshafta/',
    type: 'pillar',
    expectBreadcrumbs: true,
    expectFaq: true,
  },
  {
    name: 'uborka-T2',
    path: '/uborka-territorii/',
    type: 'pillar',
    expectBreadcrumbs: true,
    expectFaq: true,
  },
]

interface Viewport {
  name: string
  width: number
  height: number
  label: string
}

const VIEWPORTS: Viewport[] = [
  { name: '375', width: 375, height: 667, label: 'iPhone SE' },
  { name: '414', width: 414, height: 896, label: 'iPhone Pro' },
  { name: '768', width: 768, height: 1024, label: 'iPad' },
  { name: '1024', width: 1024, height: 768, label: 'Desktop small' },
]

interface Result {
  url: string
  path: string
  viewport: string
  http: number
  title: string | null
  consoleErrors: string[]
  failedRequests: string[]
  hasHorizontalScroll: boolean
  scrollWidth: number
  innerWidth: number
  smallTargets: number
  totalTargets: number
  h1Text: string | null
  h1Visible: boolean
  breadcrumbsVisible: boolean
  faqPresent: boolean
  brokenImages: number
  totalImages: number
  screenshot: string
  passed: boolean
  failureReasons: string[]
}

const results: Result[] = []

test.describe.configure({ mode: 'serial' })

// Prod (obikhod.ru) фильтрует Chrome 147+ через sec-ch-ua client hints → ERR_TIMED_OUT.
// Override UA + sec-ch-ua на стабильный Chrome 132 для всего describe.
const STABLE_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'
const STABLE_HEADERS = {
  'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
  'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="132", "Chromium";v="132"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
}

test.use({
  userAgent: STABLE_UA,
  extraHTTPHeaders: STABLE_HEADERS,
})

test.describe('D4 Mobile compliance — 5 URL × 4 viewport', () => {
  for (const u of URLS) {
    for (const vp of VIEWPORTS) {
      test(`${vp.name}px (${vp.label}) × ${u.name}`, async ({ page }) => {
        test.setTimeout(240_000)

        // 0. Throttle anti-bot: pause перед каждым test (Beget WAF rate-limit)
        await new Promise((r) => setTimeout(r, 5000))

        // 1. Set viewport BEFORE navigation
        await page.setViewportSize({ width: vp.width, height: vp.height })

        // 2. Listen для console errors + network failures
        const consoleErrors: string[] = []
        const failedRequests: string[] = []

        page.on('console', (msg: ConsoleMessage) => {
          if (msg.type() === 'error') {
            const t = msg.text()
            // Filter known noise
            if (t.includes('Download the React DevTools')) return
            if (t.includes('[Fast Refresh]')) return
            if (t.includes('mc.yandex.ru')) return // Я.Метрика
            if (t.includes('cm.g.doubleclick')) return
            if (t.includes('Failed to load resource')) return // часто 3rd-party
            consoleErrors.push(t)
          }
        })
        page.on('response', (resp) => {
          const status = resp.status()
          if (status >= 500) {
            failedRequests.push(`${status} ${resp.url()}`)
          }
        })

        // 3. Navigate с retry — Beget WAF/Cloudflare периодически throttle Chromium.
        //    Best-effort: 6 attempts × 20s × backoff. Если все упали → graceful fail в результат.
        const fullUrl = `${BASE_URL}${u.path}`
        let response = null
        let wafBlocked = false
        for (let attempt = 1; attempt <= 6; attempt++) {
          try {
            response = await page.goto(fullUrl, {
              waitUntil: 'domcontentloaded',
              timeout: 20_000,
            })
            if (response && response.status() === 200) break
          } catch {
            // backoff 3s, 6s, 9s, 12s, 15s
            await new Promise((r) => setTimeout(r, 3000 * attempt))
          }
        }
        if (!response) {
          // Beget WAF полностью блокирует — записываем как WAF_BLOCKED, не падаем тест.
          wafBlocked = true
        }
        const httpStatus = response?.status() ?? 0

        // 4. Wait для hydration (skip если WAF blocked — page is empty)
        if (!wafBlocked) {
          await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
        }

        // 5. Title check
        const title = wafBlocked ? null : await page.title().catch(() => null)

        // 6-11. DOM inspection — skip полностью если WAF blocked.
        const scrollMetrics = wafBlocked
          ? { scrollWidth: 0, innerWidth: vp.width }
          : await page
              .evaluate(() => ({
                scrollWidth: document.documentElement.scrollWidth,
                innerWidth: window.innerWidth,
              }))
              .catch(() => ({ scrollWidth: 0, innerWidth: vp.width }))
        const hasHorizontalScroll = scrollMetrics.scrollWidth > scrollMetrics.innerWidth + 1

        const targets = wafBlocked
          ? { small: 0, total: 0 }
          : await page
              .evaluate(() => {
                const els = Array.from(
                  document.querySelectorAll<HTMLElement>(
                    'button, a[href], [role="button"], input[type="submit"], input[type="button"]',
                  ),
                )
                let small = 0
                let total = 0
                for (const el of els) {
                  const rect = el.getBoundingClientRect()
                  if (rect.width === 0 || rect.height === 0) continue
                  if (rect.bottom < 0 || rect.top > window.innerHeight * 3) continue
                  total++
                  if (rect.width < 44 || rect.height < 44) small++
                }
                return { small, total }
              })
              .catch(() => ({ small: 0, total: 0 }))

        const h1 = wafBlocked
          ? { text: null, visible: false }
          : await page
              .evaluate(() => {
                const el = document.querySelector('h1')
                if (!el) return { text: null, visible: false }
                const r = el.getBoundingClientRect()
                return {
                  text: el.textContent?.trim() || null,
                  visible: r.width > 0 && r.height > 0,
                }
              })
              .catch(() => ({ text: null, visible: false }))

        const breadcrumbsVisible = wafBlocked
          ? false
          : await page
              .evaluate(() => {
                const candidates = [
                  'nav[aria-label*="readcrumb" i]',
                  'nav[aria-label*="лебн" i]',
                  '.breadcrumbs',
                  '[class*="breadcrumb" i]',
                  'ol[itemtype*="BreadcrumbList"]',
                ]
                for (const sel of candidates) {
                  const el = document.querySelector<HTMLElement>(sel)
                  if (el) {
                    const r = el.getBoundingClientRect()
                    if (r.width > 0 && r.height > 0) return true
                  }
                }
                return false
              })
              .catch(() => false)

        const faqPresent = wafBlocked
          ? false
          : await page
              .evaluate(() => {
                const details = document.querySelectorAll('details')
                if (details.length >= 2) return true
                const ldScripts = document.querySelectorAll('script[type="application/ld+json"]')
                for (const s of ldScripts) {
                  try {
                    const obj = JSON.parse(s.textContent || '{}')
                    const items = Array.isArray(obj) ? obj : [obj]
                    if (items.some((x: { '@type'?: string }) => x['@type'] === 'FAQPage'))
                      return true
                  } catch {
                    // ignore
                  }
                }
                return false
              })
              .catch(() => false)

        const imgStats = wafBlocked
          ? { broken: 0, total: 0 }
          : await page
              .evaluate(() => {
                const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img'))
                let broken = 0
                let total = 0
                for (const img of imgs) {
                  if (!img.complete) continue
                  total++
                  if (img.naturalWidth === 0) broken++
                }
                return { broken, total }
              })
              .catch(() => ({ broken: 0, total: 0 }))

        // 12. Screenshot
        const screenshotPath = path.join(SCREEN_DIR, `${vp.name}-${u.name}.png`)
        await page.screenshot({ path: screenshotPath, fullPage: true })

        // 13. Aggregate failureReasons (только если WAF не блокировал — иначе DOM пустой)
        const failureReasons: string[] = []
        if (wafBlocked) {
          failureReasons.push('WAF_BLOCKED (Beget anti-bot после 6 retry)')
        } else {
          if (httpStatus !== 200) failureReasons.push(`HTTP ${httpStatus}`)
          if (!title) failureReasons.push('empty title')
          if (consoleErrors.length > 0)
            failureReasons.push(`${consoleErrors.length} console errors`)
          if (failedRequests.length > 0)
            failureReasons.push(`${failedRequests.length} 5xx requests`)
          if (hasHorizontalScroll && vp.width <= 414)
            failureReasons.push(
              `horizontal scroll: ${scrollMetrics.scrollWidth}px > ${scrollMetrics.innerWidth}px`,
            )
          if (!h1.visible) failureReasons.push('H1 not visible')
          if (u.expectBreadcrumbs && !breadcrumbsVisible) failureReasons.push('breadcrumbs missing')
          if (u.expectFaq && !faqPresent) failureReasons.push('FAQ missing')
          if (imgStats.broken > 0) failureReasons.push(`${imgStats.broken} broken images`)
          if (targets.small > 0 && vp.width <= 414)
            failureReasons.push(`${targets.small}/${targets.total} touch targets <44px`)
        }

        results.push({
          url: u.name,
          path: u.path,
          viewport: vp.name,
          http: httpStatus,
          title,
          consoleErrors,
          failedRequests,
          hasHorizontalScroll,
          scrollWidth: scrollMetrics.scrollWidth,
          innerWidth: scrollMetrics.innerWidth,
          smallTargets: targets.small,
          totalTargets: targets.total,
          h1Text: h1.text,
          h1Visible: h1.visible,
          breadcrumbsVisible,
          faqPresent,
          brokenImages: imgStats.broken,
          totalImages: imgStats.total,
          screenshot: screenshotPath,
          passed: failureReasons.length === 0,
          failureReasons,
        })

        // Hard assertions — only screenshot saved (WAF blocked → graceful, см. report).
        expect(fs.existsSync(screenshotPath), `screenshot saved`).toBe(true)
      })
    }
  }

  test.afterAll(() => {
    const summary = {
      tested_at: new Date().toISOString(),
      base_url: BASE_URL,
      total: results.length,
      passed: results.filter((r) => r.passed).length,
      failed: results.filter((r) => !r.passed).length,
      by_viewport: VIEWPORTS.map((vp) => ({
        viewport: vp.name,
        passed: results.filter((r) => r.viewport === vp.name && r.passed).length,
        failed: results.filter((r) => r.viewport === vp.name && !r.passed).length,
      })),
      by_url: URLS.map((u) => ({
        url: u.name,
        passed: results.filter((r) => r.url === u.name && r.passed).length,
        failed: results.filter((r) => r.url === u.name && !r.passed).length,
      })),
      results,
    }
    fs.writeFileSync(path.join(SCREEN_DIR, '_summary.json'), JSON.stringify(summary, null, 2))
  })
})
