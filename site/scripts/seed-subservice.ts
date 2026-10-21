/**
 * Подуслуга в коллекции «Подуслуги» из подготовленного наполнения (план 09, этап 3).
 *
 *   pnpm seed:subservice spil-derevev              — создать ЧЕРНОВИК: сайт не меняется
 *   pnpm seed:subservice spil-derevev --publish    — сразу опубликовать (staging)
 *   pnpm seed:subservice arboristika [--publish]   — партия целиком (SUB_SERVICE_BATCHES)
 *
 * Наполнение — content/sub-services/<ключ>.ts; фото — public/dev-blocks/*.webp → «Медиа»
 * с флагом «Иллюстрация» (повторный запуск их не дублирует). Существующий документ не трогает —
 * правки в админке не теряются; перезаписать — --overwrite (прежнее останется в «Версиях»).
 */
import { getPayload } from 'payload'

import { SUB_SERVICE_BATCHES, SUB_SERVICE_CONTENT } from '../content/sub-services'
import config from '../payload.config.js'

import type { Payload } from 'payload'

import { dropNulls, nbspNumbers, toLayout } from './_v3-seed'
import { requestSiteRevalidate } from './_site-revalidate'

const PUBLISH = process.argv.includes('--publish')
const OVERWRITE = process.argv.includes('--overwrite')
const key = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? ''

async function main() {
  const keys = SUB_SERVICE_BATCHES[key] ?? [key]
  const missing = keys.filter((k) => !SUB_SERVICE_CONTENT[k])
  if (missing.length) {
    throw new Error(
      `нет наполнения «${missing.join(', ')}». Есть: ${Object.keys(SUB_SERVICE_CONTENT).join(', ')}; партии: ${Object.keys(SUB_SERVICE_BATCHES).join(', ')}`,
    )
  }
  const payload = await getPayload({ config })
  let written = 0
  for (const k of keys) if (await seedOne(payload, k)) written++
  if (written) await requestSiteRevalidate('seed:subservice')
  process.exit(0)
}

async function seedOne(payload: Payload, contentKey: string) {
  const content = SUB_SERVICE_CONTENT[contentKey]
  const service = await payload.find({
    collection: 'services',
    where: { slug: { equals: content.service } },
    limit: 1,
    depth: 0,
  })
  const serviceId = service.docs[0]?.id
  if (!serviceId) throw new Error(`нет направления «${content.service}»`)

  const layout = nbspNumbers(dropNulls(await toLayout(payload, content.blocks)))
  const data = {
    title: content.title,
    service: serviceId,
    slug: content.slug,
    layout,
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    _status: PUBLISH ? 'published' : 'draft',
  }
  const existing = await payload.find({
    collection: 'sub-services',
    where: { and: [{ slug: { equals: content.slug } }, { service: { equals: serviceId } }] },
    limit: 1,
    depth: 0,
    draft: true,
  })
  if (existing.docs[0] && !OVERWRITE) {
    console.log(
      `[seed:subservice] /${content.service}/${content.slug}/ уже есть — пропускаю, правки в админке не трогаю (перезаписать — --overwrite)`,
    )
    return false
  }
  const doc = existing.docs[0]
    ? await payload.update({
        collection: 'sub-services',
        id: existing.docs[0].id,
        data: data as never,
        draft: !PUBLISH,
      })
    : await payload.create({ collection: 'sub-services', data: data as never, draft: !PUBLISH })
  console.log(
    `[seed:subservice] /${content.service}/${content.slug}/ id=${doc.id}, блоков ${layout.length}, ${PUBLISH ? 'опубликована' : 'черновик'}`,
  )
  return true
}

main().catch((e) => {
  console.error('[seed:subservice] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
