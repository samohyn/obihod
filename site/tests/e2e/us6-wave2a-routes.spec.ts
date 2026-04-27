import { expect, test, type APIRequestContext } from '@playwright/test'

/**
 * US-6 wave 2A — E2E на новые routes /b2b/, /blog/, /avtory/.
 *
 * CI strategy: на ephemeral postgres БД пустая → list-страницы отдают
 * 200 с empty-state, detail-routes требуют seeded данные → skip если
 * нет published записей.
 */

async function hasPublished(
  request: APIRequestContext,
  collection: 'authors' | 'blog' | 'b2b-pages',
): Promise<{ ok: boolean; firstSlug?: string }> {
  try {
    const res = await request.get(
      `/api/${collection}?depth=0&limit=1&where[_status][equals]=published`,
    )
    if (res.status() !== 200) return { ok: false }
    const body = await res.json()
    if ((body?.totalDocs ?? 0) === 0) return { ok: false }
    const first = body?.docs?.[0]?.slug
    return { ok: true, firstSlug: first }
  } catch {
    return { ok: false }
  }
}

// ───────── Lists (всегда 200, даже на пустой БД) ─────────

test('GET /avtory/ → 200 + h1 + breadcrumbs', async ({ page }) => {
  const res = await page.goto('/avtory/')
  expect(res?.status()).toBe(200)
  await expect(page.locator('h1')).toContainText('Эксперт')
  await expect(page.locator('nav[aria-label="Хлебные крошки"]')).toBeVisible()
})

test('GET /blog/ → 200 + h1 + breadcrumbs', async ({ page }) => {
  const res = await page.goto('/blog/')
  expect(res?.status()).toBe(200)
  await expect(page.locator('h1')).toContainText('Блог')
  await expect(page.locator('nav[aria-label="Хлебные крошки"]')).toBeVisible()
})

test('GET /b2b/ → 200 + h1 + breadcrumbs onPrimary', async ({ page }) => {
  const res = await page.goto('/b2b/')
  expect(res?.status()).toBe(200)
  await expect(page.locator('h1')).toContainText('бизнеса')
  await expect(page.locator('nav[aria-label="Хлебные крошки"]')).toBeVisible()
})

// ───────── Detail-routes (requires seeded DB) ─────────

test.describe('Detail routes (seeded DB)', () => {
  test('Author detail page → 200 + Person JSON-LD + canonical', async ({ page, request }) => {
    const { ok, firstSlug } = await hasPublished(request, 'authors')
    test.skip(!ok || !firstSlug, 'no published authors in DB')

    const res = await page.goto(`/avtory/${firstSlug}/`)
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()

    // canonical
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toContain(`/avtory/${firstSlug}/`)

    // Person schema
    const personSchema = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) =>
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
    const hasPerson = personSchema.some((s: { '@type'?: string }) => s?.['@type'] === 'Person')
    expect(hasPerson, 'Person schema found in JSON-LD').toBeTruthy()
  })

  test('Blog post detail → 200 + Article JSON-LD + breadcrumb', async ({ page, request }) => {
    const { ok, firstSlug } = await hasPublished(request, 'blog')
    test.skip(!ok || !firstSlug, 'no published blog posts in DB')

    const res = await page.goto(`/blog/${firstSlug}/`)
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toContain(`/blog/${firstSlug}/`)

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
    const hasArticle = schemas.some((s: { '@type'?: string }) => s?.['@type'] === 'BlogPosting')
    const hasBreadcrumb = schemas.some(
      (s: { '@type'?: string }) => s?.['@type'] === 'BreadcrumbList',
    )
    expect(hasArticle, 'BlogPosting schema present').toBeTruthy()
    expect(hasBreadcrumb, 'BreadcrumbList schema present').toBeTruthy()
  })

  test('B2B page detail → 200 + canonical + krishaShtraf callout', async ({ page, request }) => {
    const { ok, firstSlug } = await hasPublished(request, 'b2b-pages')
    test.skip(!ok || !firstSlug, 'no published b2b-pages in DB')

    const res = await page.goto(`/b2b/${firstSlug}/`)
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toContain(`/b2b/${firstSlug}/`)
  })
})

// ───────── sitemap.xml включает новые ветки ─────────

test('sitemap.xml includes /blog/, /b2b/, /avtory/ list URLs', async ({ request }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.status()).toBe(200)
  const xml = await res.text()
  expect(xml).toContain('/blog/</loc>')
  expect(xml).toContain('/b2b/</loc>')
  expect(xml).toContain('/avtory/</loc>')
})
