import { ARBORISTIKA } from './arboristika'
import { CHISTKA_KRYSH } from './chistka-krysh'
import { DEMONTAZH } from './demontazh'
import type { GeoSubMap } from './types'
import { VYVOZ_MUSORA } from './vyvoz-musora'

export { DISTRICT_FIXES } from './districts'
export type { GeoSubContent, InfoCard } from './types'

/** 61 страница «подуслуга в районе»: ключ — `направление/подуслуга/район`. */
export const GEO_SUB: GeoSubMap = {
  ...ARBORISTIKA,
  ...CHISTKA_KRYSH,
  ...DEMONTAZH,
  ...VYVOZ_MUSORA,
}
