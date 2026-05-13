/**
 * TEMP — EPIC-SERVICE-PAGES-REDESIGN · screenshots 5 pillars (2026-05-11).
 *
 * Удалить после захвата. Не часть регрессии.
 *
 * 5 pillar URL × {desktop 1440, mobile 375} = 10 fullPage screenshots
 * в screen/PILLARS-2026-05-11/{slug}-{desktop,mobile}.png.
 *
 * Per pillar — console errors check + broken images check.
 *
 * Beget WAF pattern (sustained D4): UA Chrome/132 + sec-ch-ua override +
 * 4s pre-test throttle + 5 retry с backoff.
 *
 * Запуск:
 *   PLAYWRIGHT_EXTERNAL_SERVER=1 PLAYWRIGHT_BASE_URL=https://obikhod.ru \
 *     pnpm exec playwright test tests/e2e/_pillars-shot.spec.ts --project=chromium
 */
import { expect, test, type ConsoleMessage } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const SCREEN_DIR = path.resolve(process.cwd(), '..', 'screen', 'PILLARS-2026-05-11')
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'https://obikhod.ru'

test.beforeAll(() => {
  fs.mkdirSync(SCREEN_DIR, { recursive: true })
})

const PILLARS = [
  { slug: 'vyvoz-musora', path: '/vyvoz-musora/' },
  { slug: 'arboristika', path: '/arboristika/' },
  { slug: 'chistka-krysh', path: '/chistka-krysh/' },
  { slug: 'demontazh', path: '/demontazh/' },
  { slug: 'dizain-landshafta', path: '/dizain-landshafta/' },
]

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 667 },
]

// NOT serial — каждый pillar независим; WAF-блок одного не должен ронять остальные.

const STABLE_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'
const STABLE_HEADERS = {
  'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
  'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="132", "Chromium";v="132"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
}

test.use({ userAgent: STABLE_UA, extraHTTPHeaders: STABLE_HEADERS })

interface ShotResult {
  slug: string
  viewport: string
  http: number
  consoleErrors: string[]
  brokenImages: number
  totalImages: number
  screenshot: string
}

const results: ShotResult[] = []

test.describe('PILLARS screenshots — 5 URL × 2 viewport', () => {
  for (const p of PILLARS) {
    for (const vp of VIEWPORTS) {
      test(`${p.slug} × ${vp.name}`, async ({ page }) => {
        test.setTimeout(360_000)

        // Throttle anti-bot (Beget WAF rate-limit)
        await new Promise((r) => setTimeout(r, 4000 + Math.floor(Math.random() * 2000)))

        await page.setViewportSize({ width: vp.width, height: vp.height })

        const consoleErrors: string[] = []
        page.on('console', (msg: ConsoleMessage) => {
          if (msg.type() !== 'error') return
          const t = msg.text()
          if (t.includes('Download the React DevTools')) return
          if (t.includes('[Fast Refresh]')) return
          if (t.includes('mc.yandex.ru')) return
          if (t.includes('cm.g.doubleclick')) return
          if (t.includes('Failed to load resource')) return
          consoleErrors.push(t)
        })

        const fullUrl = `${BASE_URL}${p.path}`
        let response = null
        for (let attempt = 1; attempt <= 8; attempt++) {
          try {
            response = await page.goto(fullUrl, {
              waitUntil: 'domcontentloaded',
              timeout: 25_000,
            })
            if (response && response.status() === 200) break
          } catch {
            // backoff 4s, 8s, 12s … capped at 20s
            await new Promise((r) => setTimeout(r, Math.min(4000 * attempt, 20_000)))
          }
        }
        const httpStatus = response?.status() ?? 0

        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
        // Trigger lazy images: scroll through the page then back to top.
        await page
          .evaluate(async () => {
            const h = document.body.scrollHeight
            for (let y = 0; y <= h; y += window.innerHeight) {
              window.scrollTo(0, y)
              await new Promise((r) => setTimeout(r, 150))
            }
            window.scrollTo(0, 0)
          })
          .catch(() => {})
        await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})

        const imgStats = await page
          .evaluate(() => {
            const imgs = Array.from(document.querySelectorAll('img'))
            let broken = 0
            for (const img of imgs) {
              if (!img.complete) continue
              if (img.naturalWidth === 0) broken++
            }
            return { broken, total: imgs.length }
          })
          .catch(() => ({ broken: 0, total: 0 }))

        const shotPath = path.join(SCREEN_DIR, `${p.slug}-${vp.name}.png`)
        await page.screenshot({ path: shotPath, fullPage: true })

        results.push({
          slug: p.slug,
          viewport: vp.name,
          http: httpStatus,
          consoleErrors,
          brokenImages: imgStats.broken,
          totalImages: imgStats.total,
          screenshot: shotPath,
        })

        // Soft expectations — capture continues even if a pillar has issues.
        expect(httpStatus, `${p.slug} HTTP`).toBe(200)
        expect(imgStats.broken, `${p.slug} broken images`).toBe(0)
      })
    }
  }

  test.afterAll(() => {
    // eslint-disable-next-line no-console
    console.log('\n=== PILLARS screenshot report ===')
    for (const r of results) {
      // eslint-disable-next-line no-console
      console.log(
        `${r.slug}/${r.viewport}: HTTP ${r.http} · imgs ${r.totalImages} (broken ${r.brokenImages}) · console-errors ${r.consoleErrors.length} · ${r.screenshot}`,
      )
      if (r.consoleErrors.length) {
        // eslint-disable-next-line no-console
        console.log('  errors:', r.consoleErrors.slice(0, 5).join(' | '))
      }
    }
  })
})
