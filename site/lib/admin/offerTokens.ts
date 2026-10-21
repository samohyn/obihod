import {
  APIError,
  type CollectionAfterReadHook,
  type CollectionBeforeValidateHook,
  type GlobalAfterReadHook,
  type GlobalBeforeValidateHook,
  type PayloadRequest,
} from 'payload'

import { getCompany } from '@/lib/company'
import { OFFER_TOKENS, fillOfferDeep, unknownOfferTokens } from '@/lib/offer'

/**
 * Метки оффера в текстах документов (план 09, этап 4.3b): владелец пишет `{перезвон}`,
 * сайт показывает «10 минут» из «Компания и контакты».
 *
 * Подстановка — при чтении (afterRead): сайт, предпросмотр и разметка получают значения.
 * Под входом в админку (`req.user`) и в скриптах данных (`context.rawOffer`) — сами метки,
 * иначе редактор их не увидит, а скрипт, сохранив документ, затрёт их значениями.
 */
const raw = (req: PayloadRequest) => Boolean(req.user || req.context?.rawOffer)

export const fillOfferAfterRead: CollectionAfterReadHook = async ({ doc, req }) =>
  raw(req) ? doc : fillOfferDeep(doc, await getCompany())

export const fillOfferGlobalAfterRead: GlobalAfterReadHook = async ({ doc, req }) =>
  raw(req) ? doc : fillOfferDeep(doc, await getCompany())

function check(data: unknown) {
  const bad = unknownOfferTokens(data)
  if (bad.length)
    throw new APIError(
      `Неизвестная метка ${bad.join(', ')}. Доступные: ${OFFER_TOKENS.map((t) => t.token).join(', ')} — список с пояснениями в «Компания и контакты» → «Оффер».`,
      400,
      { unknownTokens: bad }, // без data Payload прячет текст ошибки
      true,
    )
}

/** Опечатку в метке нельзя опубликовать (черновик сохраняется — пока владелец печатает). */
export const validateOfferTokens: CollectionBeforeValidateHook = ({ data, collection }) => {
  const drafts = Boolean(collection.versions && collection.versions.drafts)
  if (!drafts || data?._status === 'published') check(data)
  return data
}

export const validateOfferTokensGlobal: GlobalBeforeValidateHook = ({ data }) => {
  check(data)
  return data
}
