/**
 * Главная C4 в коллекции «Страницы» (slug «home») — начальное наполнение (план 09, этап 2).
 *
 *   pnpm seed:home              — создать/обновить ЧЕРНОВИК: сайт не меняется, владелец правит в админке
 *   pnpm seed:home --publish    — сразу опубликовать (staging)
 *
 * Фото — public/dev-blocks/*.webp → «Медиа» с флагом «Иллюстрация» (повторный запуск их не дублирует).
 * Контент — из витрины lib/dev-blocks/c4-demo.ts, но без непроверенного: рейтинга, выдуманных отзывов
 * (блок отзывов берёт только проверенные из админки), ссылок на несуществующие мессенджеры.
 * Цифры, цены и сроки остаются как в витрине — их владелец подтверждает перед публикацией на проде.
 */
import { getPayload } from 'payload'

import { C4_DEMO } from '../lib/dev-blocks/c4-demo'
import config from '../payload.config.js'

import { dropNulls, toLayout } from './_v3-seed'

const PUBLISH = process.argv.includes('--publish')

async function main() {
  const payload = await getPayload({ config })
  const layout = dropNulls(await toLayout(payload, C4_DEMO, { unknownTileHref: '/uslugi/' }))
  const data = {
    title: 'Главная',
    slug: 'home',
    layout,
    metaTitle: 'Обиход — порядок под ключ на участке · Москва и МО',
    metaDescription:
      'Деревья, вывоз мусора, крыши и снег, уборка, планировка, демонтаж. Твёрдая смета, оплата после приёмки, уборка и вывоз в цене.',
    _status: PUBLISH ? 'published' : 'draft',
  }
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
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
    `[seed:home] страница home id=${doc.id}, блоков ${layout.length}, ${PUBLISH ? 'опубликована' : 'черновик'}`,
  )
  process.exit(0)
}

main().catch((e) => {
  console.error('[seed:home] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
