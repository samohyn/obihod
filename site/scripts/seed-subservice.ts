/**
 * Подуслуга в коллекции «Подуслуги» из подготовленного наполнения (план 09, этап 3).
 *
 *   pnpm seed:subservice spil-derevev              — создать/обновить ЧЕРНОВИК: сайт не меняется
 *   pnpm seed:subservice spil-derevev --publish    — сразу опубликовать (staging)
 *
 * Наполнение — content/sub-services/<ключ>.ts; фото — public/dev-blocks/*.webp → «Медиа»
 * с флагом «Иллюстрация» (повторный запуск их не дублирует). Перезапуск затирает правки
 * в админке — сначала проверьте, что их нет.
 */
import { getPayload } from 'payload'

import { SUB_SERVICE_CONTENT } from '../content/sub-services'
import config from '../payload.config.js'

import { dropNulls, toLayout } from './_v3-seed'

const PUBLISH = process.argv.includes('--publish')
const key = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? ''

async function main() {
  const content = SUB_SERVICE_CONTENT[key]
  if (!content) {
    throw new Error(`нет наполнения «${key}». Есть: ${Object.keys(SUB_SERVICE_CONTENT).join(', ')}`)
  }
  const payload = await getPayload({ config })
  const service = await payload.find({
    collection: 'services',
    where: { slug: { equals: content.service } },
    limit: 1,
    depth: 0,
  })
  const serviceId = service.docs[0]?.id
  if (!serviceId) throw new Error(`нет направления «${content.service}»`)

  const layout = dropNulls(await toLayout(payload, content.blocks))
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
  process.exit(0)
}

main().catch((e) => {
  console.error('[seed:subservice] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
