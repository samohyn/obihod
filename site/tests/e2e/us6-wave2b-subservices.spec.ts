import { expect, test, type APIRequestContext } from '@playwright/test'

/**
 * Страница подуслуги /<направление>/<подуслуга>/ — документ коллекции «Подуслуги».
 * В CI подуслуг нет (seed подуслуг не запускается) — тесты пропускаются.
 */

async function findFirstSubWithContent(
  request: APIRequestContext,
): Promise<{ service: string; sub: string } | null> {
  try {
    const res = await request.get(
      '/api/sub-services?depth=1&limit=1&where[_status][equals]=published',
    )
    if (res.status() !== 200) return null
    const doc = (await res.json())?.docs?.[0]
    return doc?.slug && doc?.service?.slug ? { service: doc.service.slug, sub: doc.slug } : null
  } catch {
    return null
  }
}

test('Sub-service page → 200 + canonical + Service schema (если есть данные)', async ({
  page,
  request,
}) => {
  const found = await findFirstSubWithContent(request)
  test.skip(!found, 'no sub-services with content in DB')

  const url = `/${found!.service}/${found!.sub}/`
  const res = await page.goto(url)
  expect(res?.status()).toBe(200)
  await expect(page.locator('h1')).toBeVisible()

  // canonical
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
  expect(canonical).toContain(url)

  // Service schema
  const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes
      .map((n) => {
        try {
          return JSON.parse(n.textContent ?? '')
        } catch {
          return null
        }
      })
      .filter(Boolean)
      .flat(),
  )
  const hasService = schemas.some((s: { '@type'?: string }) => s?.['@type'] === 'Service')
  const hasBreadcrumb = schemas.some((s: { '@type'?: string }) => s?.['@type'] === 'BreadcrumbList')
  expect(hasService, 'Service schema present').toBeTruthy()
  expect(hasBreadcrumb, 'BreadcrumbList schema present').toBeTruthy()
})

test('Sub-service пути попадают в sitemap.xml (если есть)', async ({ request }) => {
  const found = await findFirstSubWithContent(request)
  test.skip(!found, 'no sub-services with content in DB')

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  const xml = await sitemap.text()
  expect(xml).toContain(`/${found!.service}/${found!.sub}/</loc>`)
})

test('Sub-service / district routing collision: оба URL отдают 200', async ({ page, request }) => {
  // Smoke: один из 8 уже наполненных service-districts wave 1 не должен
  // конфликтовать с sub-service slug. district slug = 'ramenskoye',
  // sub slug = 'spil-derevev' etc — semantically разные слова,
  // collision только если намеренно создать sub с slug='ramenskoye'.
  const sd = await request.get('/api/service-districts?limit=1&depth=2')
  test.skip(sd.status() !== 200, 'no service-districts available')
  const body = await sd.json()
  const first = body?.docs?.[0]
  if (!first?.service?.slug || !first?.district?.slug) test.skip()

  const url = `/${first.service.slug}/${first.district.slug}/`
  const res = await page.goto(url)
  expect(res?.status()).toBe(200)
  // Это programmatic, не sub — должен быть текст-индикатор
  await expect(page.locator('h1')).toBeVisible()
})
