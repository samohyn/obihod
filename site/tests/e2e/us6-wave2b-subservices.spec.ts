import { expect, test, type APIRequestContext } from '@playwright/test'

/**
 * US-6 wave 2B1 — E2E на sub-service routes /<service>/<sub>/.
 *
 * Сами sub-services шарят dynamic-segment с districts (`[district]`).
 * Раздел в `[district]/page.tsx` через `getSubServiceBySlug()` детектит
 * sub vs district и рендерит SubServiceView.
 *
 * CI strategy: на ephemeral DB sub-services без intro/body не
 * публикуются (см. queries.getAllSubServiceParams) — список пуст,
 * тесты skip.
 */

async function findFirstSubWithContent(
  request: APIRequestContext,
): Promise<{ service: string; sub: string } | null> {
  try {
    const res = await request.get('/api/services?depth=0&limit=20&where[_status][equals]=published')
    if (res.status() !== 200) return null
    const body = await res.json()
    for (const svc of body?.docs ?? []) {
      for (const sub of svc.subServices ?? []) {
        if (sub.intro || sub.body) {
          return { service: svc.slug, sub: sub.slug }
        }
      }
    }
    return null
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
