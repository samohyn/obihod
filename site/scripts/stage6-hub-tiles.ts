/**
 * Плитки новых подуслуг на страницах направлений (план 09, этап 6): новая страница должна быть
 * доступна по ссылке с хаба. Дописывает плитку в конец блока «Услуги плиткой» документа
 * «Страницы», если такой ссылки там ещё нет, и публикует документ.
 *
 *   pnpm stage6:hub-tiles            — на сервере после выкатки (как другие разовые правки данных)
 *
 * Не трогает страницу, у которой в админке есть неопубликованный черновик: иначе вместе с плиткой
 * вышли бы чужие правки — такая страница пропускается с предупреждением. Повторный запуск ничего
 * не дублирует.
 */
import path from 'node:path'

import { getPayload, type Payload } from 'payload'

import config from '../payload.config.js'

import { requestSiteRevalidate } from './_site-revalidate'

type Tile = { title: string; text: string; price: string; href: string; image: string; alt: string }

const TILES: { page: string; block: string; tile: Tile }[] = [
  {
    page: 'arboristika',
    block: 'Что делаем с деревьями',
    tile: {
      title: 'Обрезка плодовых',
      text: 'Яблони, груши, сливы и вишни',
      price: 'от 2 600 ₽',
      href: '/arboristika/obrezka-plodovyh/',
      image: 'obrezka-plod.webp',
      alt: 'Садовник обрезает старую яблоню',
    },
  },
  {
    page: 'vyvoz-musora',
    block: 'Что вывозим',
    tile: {
      title: 'С дачи и из СНТ',
      text: 'Всё, что не взять в общий бункер',
      price: 'от 12 800 ₽',
      href: '/vyvoz-musora/s-dachi-snt/',
      image: 'vyvoz-gazel.webp',
      alt: 'Грузчики загружают мешки в Газель у дачи',
    },
  },
]

type Doc = Record<string, unknown> & { id: number | string }

async function mediaId(payload: Payload, filename: string, alt: string) {
  const found = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (found.docs[0]) return found.docs[0].id
  const created = await payload.create({
    collection: 'media',
    data: { alt, illustration: true } as never,
    filePath: path.resolve(process.cwd(), 'public/dev-blocks', filename),
    overrideAccess: true,
  })
  return created.id
}

async function main() {
  const payload = await getPayload({ config })
  let changed = 0
  for (const { page, block, tile } of TILES) {
    const res = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page } },
      limit: 1,
      depth: 0,
      draft: true,
      overrideAccess: true,
    })
    const doc = res.docs[0] as Doc | undefined
    if (!doc) {
      console.warn(`[hub-tiles] ${page}: нет страницы — пропускаю`)
      continue
    }
    if (doc._status === 'draft') {
      console.warn(`[hub-tiles] ${page}: в админке неопубликованный черновик — пропускаю`)
      continue
    }
    const layout = (doc.layout as Doc[]) ?? []
    const target = layout.find((b) => b.blockType === 'services-tiles' && b.title === block)
    if (!target) {
      console.warn(`[hub-tiles] ${page}: нет блока «${block}» — пропускаю`)
      continue
    }
    const items = (target.items as Doc[] | undefined) ?? []
    if (items.some((i) => i.href === tile.href)) {
      console.log(`[hub-tiles] ${page}: плитка ${tile.href} уже есть`)
      continue
    }
    target.items = [
      ...items,
      {
        title: tile.title,
        text: tile.text,
        price: tile.price,
        href: tile.href,
        image: await mediaId(payload, tile.image, tile.alt),
      },
    ]
    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: { layout, _status: 'published' } as never,
      overrideAccess: true,
    })
    console.log(`[hub-tiles] ${page}: + ${tile.title} (${items.length + 1} плиток)`)
    changed++
  }
  if (changed) await requestSiteRevalidate('stage6:hub-tiles')
  process.exit(0)
}

main().catch((err) => {
  console.error('[hub-tiles]', err)
  process.exit(1)
})
