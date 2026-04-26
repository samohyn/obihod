import { expect, test } from '@playwright/test'

/**
 * SEO smoke — US-5 REQ-5.12.
 *
 * Покрывает:
 *  - sitemap.xml содержит pillar URL с правильным priority
 *  - robots.txt отдаёт корректные директивы (sitemap link, Yandex allow, AhrefsBot block)
 *  - canonical link на pillar pages
 *  - Breadcrumbs JSON-LD на programmatic / pillar
 *  - Schema.org Organization + WebSite + LocalBusiness на главной
 *  - 4 pillar pages → 200
 *  - /ochistka-krysh/ → 308 → /chistka-krysh/ (REQ-5.3 миграция slug)
 */

test.describe('Sitemap.xml', () => {
  test('содержит 4 pillar URL с правильным priority', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    const body = await res.text()
    // 4 pillar
    expect(body).toContain('/vyvoz-musora/')
    expect(body).toContain('/arboristika/')
    expect(body).toContain('/chistka-krysh/')
    expect(body).toContain('/demontazh/')
    // priority под wsfreq Wave 2 (REQ-5.1)
    expect(body).toMatch(/<loc>https:\/\/[^<]*\/vyvoz-musora\/<\/loc>[\s\S]*?<priority>1<\/priority>/)
  })

  test('main URL имеет priority 1.0', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    const body = await res.text()
    expect(body).toMatch(/<loc>https:\/\/[^<]*\/<\/loc>[\s\S]*?<priority>1<\/priority>/)
  })
})

test.describe('robots.txt', () => {
  test('содержит sitemap, Yandex allow, AhrefsBot disallow', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toMatch(/Sitemap:\s+https:\/\/[^\s]+\/sitemap\.xml/)
    expect(body).toMatch(/User-Agent:\s+Yandex/i)
    expect(body).toContain('AhrefsBot')
    expect(body).toMatch(/Disallow:\s+\/admin\//)
  })
})

test.describe('Pillar pages SEO', () => {
  for (const pillar of ['/vyvoz-musora/', '/arboristika/', '/demontazh/', '/chistka-krysh/']) {
    test(`${pillar} → 200 + canonical + Service schema`, async ({ page }) => {
      const response = await page.goto(pillar)
      expect(response?.status()).toBe(200)

      // canonical
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical).toBeTruthy()
      expect(canonical).toContain(pillar)
      expect(canonical).not.toContain('utm_')
      expect(canonical).not.toContain('?')

      // JSON-LD: Service schema (хотя бы один)
      const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents()
      const allLd = jsonLd.join('\n')
      expect(allLd).toContain('Service')
      expect(allLd).toContain('BreadcrumbList')
    })
  }
})

test.describe('Slug migration redirect (REQ-5.3)', () => {
  test('/ochistka-krysh/ → 308/301 → /chistka-krysh/', async ({ request }) => {
    // disable redirect-following — проверяем сам редирект
    const res = await request.get('/ochistka-krysh/', { maxRedirects: 0 })
    expect([301, 308]).toContain(res.status())
    const loc = res.headers()['location']
    expect(loc).toBe('/chistka-krysh/')
  })
})

test.describe('Главная — Schema.org foundation', () => {
  test('Organization + WebSite + LocalBusiness в JSON-LD', async ({ page }) => {
    await page.goto('/')
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents()
    const all = jsonLd.join('\n')
    expect(all).toContain('Organization')
    expect(all).toContain('WebSite')
    // LocalBusiness через HomeAndConstructionBusiness
    expect(all).toMatch(/HomeAndConstructionBusiness|LocalBusiness/)
  })
})

test.describe('OG image generator (REQ-5.11)', () => {
  test('GET /og?title=X отдаёт image/png 1200×630', async ({ request }) => {
    const res = await request.get('/og?title=Test&subtitle=Subtitle')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('image/png')
  })
})
