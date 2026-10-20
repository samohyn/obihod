import {
  avariynyySpil,
  kronirovanie,
  raschistkaUchastka,
  sanitarnayaObrezka,
  udaleniePnya,
} from './arboristika-1'
import {
  izmelchenieVetok,
  kabling,
  spilAlpinistami,
  spilSAvtovyshki,
  valkaDerevev,
  vyrubkaElok,
} from './arboristika-2'
import { spilDerevev } from './spil-derevev'
import type { SubServiceContent } from './types'

/** Подуслуги с подготовленным наполнением — ключ для `pnpm seed:subservice <ключ>`. */
export const SUB_SERVICE_CONTENT: Record<string, SubServiceContent> = {
  'spil-derevev': spilDerevev,
  kronirovanie,
  'udalenie-pnya': udaleniePnya,
  'avariynyy-spil': avariynyySpil,
  'sanitarnaya-obrezka': sanitarnayaObrezka,
  'raschistka-uchastka': raschistkaUchastka,
  'spil-alpinistami': spilAlpinistami,
  'spil-s-avtovyshki': spilSAvtovyshki,
  'valka-derevev': valkaDerevev,
  'izmelchenie-vetok': izmelchenieVetok,
  kabling,
  'vyrubka-elok': vyrubkaElok,
}

/** Партии для наполнения разом: `pnpm seed:subservice arboristika`. */
export const SUB_SERVICE_BATCHES: Record<string, string[]> = {
  arboristika: Object.keys(SUB_SERVICE_CONTENT),
}
