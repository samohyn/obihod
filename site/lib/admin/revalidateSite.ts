import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

/**
 * Сброс кеша всего сайта после правки в админке (план 09, этап 4).
 *
 * Страниц ~200 и редактор один, а зависимостей много: гео собирается из хаба, района
 * и записи «услуга × район», отзывы, медиа и шапка стоят на десятках страниц. Поэтому
 * помечаем устаревшим весь сайт — `revalidatePath('/', 'layout')`: Next перерисует
 * страницу при следующем визите (вместе с sitemap и llms.txt), старую версию не отдаёт.
 *
 * Вне запроса Next (seed, скрипты данных) кеша в этом процессе нет — они просят
 * работающее приложение через POST /api/revalidate/ (`scripts/_site-revalidate.ts`).
 */
export async function revalidateSite(req: PayloadRequest, reason: string): Promise<void> {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
    req.payload.logger.info(`[revalidate] весь сайт: ${reason}`)
  } catch (e) {
    const msg = (e as Error).message
    if (!msg.includes('static generation store missing')) {
      req.payload.logger.error(`[revalidate] ${reason}: ${msg}`)
    }
  }
}

/**
 * Видна ли правка на сайте. Сохранение черновика (`?draft=true`, в том числе
 * автосохранение) опубликованную версию не меняет. Публикация, снятие с публикации
 * (запрос без `draft`, `_status: 'draft'`) и правка коллекции без черновиков — меняют.
 */
export function changesPublicSite(args: {
  hasDrafts: boolean
  status: unknown
  draftQuery: unknown
}): boolean {
  if (!args.hasDrafts || args.status === 'published') return true
  return String(args.draftQuery) !== 'true'
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({
  collection,
  doc,
  req,
}) => {
  const hasDrafts = Boolean(collection.versions && collection.versions.drafts)
  if (changesPublicSite({ hasDrafts, status: doc?._status, draftQuery: req.query?.draft })) {
    await revalidateSite(req, `${collection.slug} ${doc?.id}`)
  }
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({
  collection,
  doc,
  req,
}) => {
  await revalidateSite(req, `${collection.slug} ${doc?.id} удалён`)
  return doc
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = async ({ doc, global, req }) => {
  await revalidateSite(req, `глобал ${global.slug}`)
  return doc
}
