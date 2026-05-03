/**
 * EPIC SEO-CONTENT-FILL closure W14 — leadqa real-browser smoke ≥10 representative URL.
 *
 * Контракт: specs/EPIC-SEO-CONTENT-FILL/US-4-eeat-monitoring/sa-seo.md AC-10.8 (Hard).
 * Sustained iron rule: feedback_leadqa_must_browser_smoke_before_push.md (incident 2026-04-28).
 *
 * Per URL verify:
 *   1. HTTP 200
 *   2. Real browser load: no console.error, no 5xx subresource failures
 *   3. JSON-LD parses correctly
 *   4. Visible H1 (или semantic heading)
 *   5. Screenshot 1920×1080 в screen/leadqa-W14/
 *
 * + 1 representative URL — mobile viewport 375×812 smoke (`/foto-smeta/`).
 *
 * Запуск:
 *   PLAYWRIGHT_EXTERNAL_SERVER=1 pnpm test:e2e --project=chromium tests/e2e/leadqa-w14-smoke.spec.ts
 */
import { expect, test, type Page, type ConsoleMessage } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const SCREEN_DIR = path.resolve(process.cwd(), '..', 'screen', 'leadqa-W14')

test.beforeAll(() => {
  fs.mkdirSync(SCREEN_DIR, { recursive: true })
})

interface SmokeUrl {
  name: string
  path: string
  group: 'eeat' | 'pillar-sd' | 'sub-sd' | 'blog' | 'case' | 'usp' | 'asset'
  expectJsonLd?: boolean
  expectH1?: boolean
}

const URLS: SmokeUrl[] = [
  // 3 E-E-A-T pages (Track A)
  {
    name: '01-eeat-sro-licenzii',
    path: '/sro-licenzii/',
    group: 'eeat',
    expectJsonLd: true,
    expectH1: true,
  },
  { name: '02-eeat-komanda', path: '/komanda/', group: 'eeat', expectJsonLd: true, expectH1: true },
  {
    name: '03-eeat-author-brigada',
    path: '/avtory/brigada-vyvoza-obihoda/',
    group: 'eeat',
    expectJsonLd: true,
    expectH1: true,
  },

  // 4 priority-B pillar SD (1 per pillar — Stage 3)
  {
    name: '04-pillar-vyvoz-khimki',
    path: '/vyvoz-musora/khimki/',
    group: 'pillar-sd',
    expectJsonLd: true,
    expectH1: true,
  },
  {
    name: '05-pillar-arbo-pushkino',
    path: '/arboristika/pushkino/',
    group: 'pillar-sd',
    expectJsonLd: true,
    expectH1: true,
  },
  {
    name: '06-pillar-chistka-istra',
    path: '/chistka-krysh/istra/',
    group: 'pillar-sd',
    expectJsonLd: true,
    expectH1: true,
  },
  {
    name: '07-pillar-demontazh-zhukovsky',
    path: '/demontazh/zhukovsky/',
    group: 'pillar-sd',
    expectJsonLd: true,
    expectH1: true,
  },

  // 2 representative sub SD
  {
    name: '08-sub-kontejner-khimki',
    path: '/vyvoz-musora/kontejner/khimki/',
    group: 'sub-sd',
    expectJsonLd: true,
    expectH1: true,
  },
  {
    name: '09-sub-spil-pushkino',
    path: '/arboristika/spil-derevev/pushkino/',
    group: 'sub-sd',
    expectJsonLd: true,
    expectH1: true,
  },

  // 2 Blog M3 sample
  {
    name: '10-blog-raschistka-stroyka',
    path: '/blog/raschistka-uchastka-pod-stroyku/',
    group: 'blog',
    expectJsonLd: true,
    expectH1: true,
  },
  {
    name: '11-blog-arbo-vs-sadovnik',
    path: '/blog/cherta-mezhdu-arbo-i-sadovnikom/',
    group: 'blog',
    expectJsonLd: true,
    expectH1: true,
  },

  // 2 Cases sample
  {
    name: '12-case-khimki-aviasklad',
    path: '/kejsy/vyvoz-konteyner-27m3-khimki-aviasklad/',
    group: 'case',
    expectJsonLd: true,
    expectH1: true,
  },
  {
    name: '13-case-zhukovsky-aviasklad',
    path: '/kejsy/demontazh-aviasklada-zhukovskij/',
    group: 'case',
    expectJsonLd: true,
    expectH1: true,
  },

  // 1 USP
  {
    name: '14-usp-foto-smeta',
    path: '/foto-smeta/',
    group: 'usp',
    expectJsonLd: true,
    expectH1: true,
  },

  // 1 NEW asset (Track D step 2 verification)
  { name: '15-asset-llms-txt', path: '/llms.txt', group: 'asset' }, // text/markdown asset
]

interface SmokeResult {
  name: string
  path: string
  group: string
  http: number
  consoleErrors: string[]
  failedRequests: string[]
  jsonLdBlocks: number
  jsonLdValid: boolean
  h1Text: string | null
  h1Visible: boolean
  screenshot: string
}

const results: SmokeResult[] = []

test.describe.configure({ mode: 'serial' })

test.describe('leadqa W14 — real-browser smoke ≥10 URL (US-4 closure)', () => {
  for (const u of URLS) {
    test(`smoke: ${u.name} — ${u.path}`, async ({ page }, testInfo) => {
      // 1. Set viewport 1920×1080
      await page.setViewportSize({ width: 1920, height: 1080 })

      // 2. Listen console + network failures
      const consoleErrors: string[] = []
      const failedRequests: string[] = []

      page.on('console', (msg: ConsoleMessage) => {
        if (msg.type() === 'error') {
          const text = msg.text()
          // Filter known noise: dev fast-refresh sourcemap, third-party tracking
          if (text.includes('Download the React DevTools')) return
          if (text.includes('[Fast Refresh]')) return
          consoleErrors.push(text)
        }
      })
      page.on('response', (resp) => {
        const status = resp.status()
        if (status >= 500) {
          failedRequests.push(`${status} ${resp.url()}`)
        }
      })

      // 3. Navigate
      const response = await page.goto(u.path, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      })
      const httpStatus = response?.status() ?? 0
      expect(httpStatus, `HTTP for ${u.path}`).toBe(200)

      // For asset (llms.txt) — content-type text/plain, skip rest
      if (u.group === 'asset') {
        const body = await page.content()
        const screenshotPath = path.join(SCREEN_DIR, `${u.name}.png`)
        await page.screenshot({ path: screenshotPath, fullPage: false })
        results.push({
          name: u.name,
          path: u.path,
          group: u.group,
          http: httpStatus,
          consoleErrors,
          failedRequests,
          jsonLdBlocks: 0,
          jsonLdValid: body.includes('# Обиход'),
          h1Text: null,
          h1Visible: false,
          screenshot: screenshotPath,
        })
        await testInfo.attach('asset-snippet', {
          body: body.slice(0, 500),
          contentType: 'text/plain',
        })
        return
      }

      // 4. Wait network idle for hydration
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

      // 5. JSON-LD inspect
      const jsonLdData = await page.evaluate(() => {
        const blocks = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        const parsed: { ok: boolean; type: string; error?: string }[] = []
        for (const b of blocks) {
          try {
            const obj = JSON.parse(b.textContent || '{}')
            const t =
              Array.isArray(obj) && obj[0]?.['@type']
                ? obj.map((x) => x['@type']).join(',')
                : obj['@type'] || 'unknown'
            parsed.push({ ok: true, type: t })
          } catch (e) {
            parsed.push({ ok: false, type: 'parse-error', error: (e as Error).message })
          }
        }
        return { count: blocks.length, parsed }
      })

      const allParsed = jsonLdData.parsed.every((p) => p.ok)
      expect(jsonLdData.count, `JSON-LD blocks for ${u.path}`).toBeGreaterThanOrEqual(1)
      expect(allParsed, `JSON-LD parses for ${u.path}: ${JSON.stringify(jsonLdData.parsed)}`).toBe(
        true,
      )

      // 6. H1 inspect (semantic heading; могут быть многоуровневые)
      const h1 = await page.evaluate(() => {
        const el = document.querySelector('h1')
        if (!el) return { text: null, visible: false }
        const rect = el.getBoundingClientRect()
        const visible = rect.width > 0 && rect.height > 0
        return { text: el.textContent?.trim() || null, visible }
      })
      if (u.expectH1) {
        expect(h1.text, `H1 text for ${u.path}`).toBeTruthy()
        expect(h1.visible, `H1 visible for ${u.path}`).toBe(true)
      }

      // 7. Screenshot 1920×1080 above-the-fold
      const screenshotPath = path.join(SCREEN_DIR, `${u.name}.png`)
      await page.screenshot({ path: screenshotPath, fullPage: false })

      results.push({
        name: u.name,
        path: u.path,
        group: u.group,
        http: httpStatus,
        consoleErrors,
        failedRequests,
        jsonLdBlocks: jsonLdData.count,
        jsonLdValid: allParsed,
        h1Text: h1.text,
        h1Visible: h1.visible,
        screenshot: screenshotPath,
      })
    })
  }

  test('mobile smoke: /foto-smeta/ at 375×812', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    const consoleErrors: string[] = []
    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') {
        const t = msg.text()
        if (t.includes('Download the React DevTools')) return
        if (t.includes('[Fast Refresh]')) return
        consoleErrors.push(t)
      }
    })
    const resp = await page.goto('/foto-smeta/', { waitUntil: 'domcontentloaded' })
    expect(resp?.status()).toBe(200)
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    const screenshotPath = path.join(SCREEN_DIR, '14-usp-foto-smeta-mobile-375.png')
    await page.screenshot({ path: screenshotPath, fullPage: false })

    expect(consoleErrors, `console errors mobile foto-smeta: ${consoleErrors.join(' | ')}`).toEqual(
      [],
    )
  })

  test.afterAll(async () => {
    const summary = {
      tested_at: new Date().toISOString(),
      total: results.length,
      passed: results.filter(
        (r) =>
          r.http === 200 &&
          r.consoleErrors.length === 0 &&
          r.failedRequests.length === 0 &&
          (r.group === 'asset'
            ? r.jsonLdValid
            : r.jsonLdBlocks >= 1 && r.jsonLdValid && r.h1Visible),
      ).length,
      results,
    }
    fs.writeFileSync(path.join(SCREEN_DIR, '_summary.json'), JSON.stringify(summary, null, 2))
  })
})
