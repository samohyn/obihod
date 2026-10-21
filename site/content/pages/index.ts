import type { PageContent } from '../sub-services/types'

import { B2B } from './b2b'
import { COMPANY } from './company'
import { raiony } from './geo'
import { blog, kejsy } from './lists'
import { PRICES } from './prices'
import { uslugi } from './uslugi'

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
  kalkulyatorFotoSmeta,
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
const USLUGI: Record<string, PageContent> = Object.fromEntries(
  [uslugi, ...PRICES].map((p) => [p.slug, p]),
)

const GEO: Record<string, PageContent> = {
  raiony,
  blog,
  kejsy,
  'kalkulyator/foto-smeta': kalkulyatorFotoSmeta,
}

const B2B_PAGES: Record<string, PageContent> = Object.fromEntries(B2B.map((p) => [p.slug, p]))
const COMPANY_PAGES: Record<string, PageContent> = Object.fromEntries(
  COMPANY.map((p) => [p.slug, p]),
)

export const PAGE_CONTENT: Record<string, PageContent> = {
  ...PILLARS,
  ...USLUGI,
  ...GEO,
  ...B2B_PAGES,
  ...COMPANY_PAGES,
}

/** Партии: `pnpm seed:page napravleniya`. */
export const PAGE_BATCHES: Record<string, string[]> = {
  napravleniya: Object.keys(PILLARS),
  uslugi: Object.keys(USLUGI),
  geo: Object.keys(GEO),
  b2b: Object.keys(B2B_PAGES),
  company: Object.keys(COMPANY_PAGES),
}
