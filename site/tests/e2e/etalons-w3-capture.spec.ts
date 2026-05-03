import { test } from '@playwright/test'

/**
 * Capture-only spec для финального operator-gate review (Track B-3 W3).
 *
 * 8 эталонных URL × {desktop 1280×800, mobile 375×800} = 16 PNG.
 * Никаких axe-assertions — только визуальный snapshot fullPage.
 *
 * Output: ../screen/etalons-W3-final/<name>-<viewport>.png
 *
 * Запуск:
 *   PLAYWRIGHT_EXTERNAL_SERVER=1 pnpm test:e2e --project=chromium tests/e2e/etalons-w3-capture.spec.ts
 */
const ETALONS = [
  { name: 'pillar-service', url: '/vyvoz-musora/' },
  { name: 'sub-service', url: '/vyvoz-musora/staraya-mebel/' },
  { name: 'programmatic-sd', url: '/vyvoz-musora/odincovo/' },
  { name: 'district-hub', url: '/raiony/odincovo/' },
  { name: 'blog-post', url: '/blog/chto-takoe-4-v-1/' },
  { name: 'case', url: '/kejsy/snyali-pen-v-gostice/' },
  { name: 'b2b-segment', url: '/b2b/uk-tszh/' },
  { name: 'author', url: '/avtory/brigada-vyvoza-obihoda/' },
]

for (const etalon of ETALONS) {
  test(`capture ${etalon.name} desktop`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto(etalon.url)
    await page.waitForLoadState('networkidle')
    await page.screenshot({
      path: `../screen/etalons-W3-final/${etalon.name}-desktop.png`,
      fullPage: true,
    })
  })

  test(`capture ${etalon.name} mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto(etalon.url)
    await page.waitForLoadState('networkidle')
    await page.screenshot({
      path: `../screen/etalons-W3-final/${etalon.name}-mobile.png`,
      fullPage: true,
    })
  })
}
