/**
 * Документ коллекции «Страницы» из подготовленного наполнения (план 09, этапы 3–4).
 *
 *   pnpm seed:page arboristika                 — создать/обновить ЧЕРНОВИК: сайт не меняется
 *   pnpm seed:page arboristika --publish       — сразу опубликовать (staging)
 *   pnpm seed:page napravleniya [--publish]    — партия целиком (PAGE_BATCHES)
 *
 * Наполнение — content/pages/*.ts; фото — public/dev-blocks/*.webp → «Медиа» с флагом
 * «Иллюстрация». Перезапуск затирает правки в админке — сначала проверьте, что их нет.
 */
import { getPayload } from 'payload'

import { PAGE_BATCHES, PAGE_CONTENT } from '../content/pages'
import config from '../payload.config.js'

import type { Payload } from 'payload'

import { dropNulls, nbspNumbers, toLayout } from './_v3-seed'
import { requestSiteRevalidate } from './_site-revalidate'

const PUBLISH = process.argv.includes('--publish')
const key = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? ''

async function main() {
  const keys = PAGE_BATCHES[key] ?? [key]
  const missing = keys.filter((k) => !PAGE_CONTENT[k])
  if (missing.length) {
    throw new Error(
      `нет наполнения «${missing.join(', ')}». Есть: ${Object.keys(PAGE_CONTENT).join(', ')}; партии: ${Object.keys(PAGE_BATCHES).join(', ')}`,
    )
  }
  const payload = await getPayload({ config })
  for (const k of keys) await seedOne(payload, k)
  await requestSiteRevalidate('seed:page')
  process.exit(0)
}

async function seedOne(payload: Payload, slug: string) {
  const content = PAGE_CONTENT[slug]
  const layout = nbspNumbers(dropNulls(await toLayout(payload, content.blocks)))
  const data = {
    title: content.title,
    slug: content.slug,
    layout,
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    _status: PUBLISH ? 'published' : 'draft',
  }
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: content.slug } },
    limit: 1,
    depth: 0,
    draft: true,
  })
  const doc = existing.docs[0]
    ? await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: data as never,
        draft: !PUBLISH,
      })
    : await payload.create({ collection: 'pages', data: data as never, draft: !PUBLISH })
  console.log(
    `[seed:page] /${content.slug}/ id=${doc.id}, блоков ${layout.length}, ${PUBLISH ? 'опубликована' : 'черновик'}`,
  )
}

main().catch((e) => {
  console.error('[seed:page] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
