import type { PageContent } from '../sub-services/types'

import {
  arboristika,
  arendaTehniki,
  chistkaKrysh,
  demontazh,
  dizainLandshafta,
  vyvozMusora,
} from './pillars-1'
import {
  fotoSmeta,
  porubochnyjBilet,
  promyshlennyjAlpinizm,
  raschetStoimosti,
  uborkaTerritorii,
} from './pillars-2'

const PILLARS: Record<string, PageContent> = Object.fromEntries(
  [
    arboristika,
    vyvozMusora,
    chistkaKrysh,
    demontazh,
    dizainLandshafta,
    arendaTehniki,
    uborkaTerritorii,
    porubochnyjBilet,
    promyshlennyjAlpinizm,
    fotoSmeta,
    raschetStoimosti,
  ].map((p) => [p.slug, p]),
)

/** Документы «Страниц» с подготовленным наполнением — ключ = адрес: `pnpm seed:page <адрес>`. */
export const PAGE_CONTENT: Record<string, PageContent> = { ...PILLARS }

/** Партии: `pnpm seed:page napravleniya`. */
export const PAGE_BATCHES: Record<string, string[]> = {
  napravleniya: Object.keys(PILLARS),
}
