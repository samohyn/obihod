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
import {
  dlyaUkTszh,
  gazel,
  kontejner,
  krupnogabarit,
  starayaMebel,
  uborkaUchastka,
  vyvozPorubochnyh,
  vyvozSadovogoMusora,
  vyvozStroymusora,
} from './vyvoz-musora'

const ARBORISTIKA: Record<string, SubServiceContent> = {
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

const VYVOZ_MUSORA: Record<string, SubServiceContent> = {
  'vyvoz-stroymusora': vyvozStroymusora,
  kontejner,
  gazel,
  krupnogabarit,
  'staraya-mebel': starayaMebel,
  'vyvoz-sadovogo-musora': vyvozSadovogoMusora,
  'uborka-uchastka': uborkaUchastka,
  'vyvoz-porubochnyh': vyvozPorubochnyh,
  'dlya-uk-tszh': dlyaUkTszh,
}

/** Подуслуги с подготовленным наполнением — ключ для `pnpm seed:subservice <ключ>`. */
export const SUB_SERVICE_CONTENT: Record<string, SubServiceContent> = {
  ...ARBORISTIKA,
  ...VYVOZ_MUSORA,
}

/** Партии для наполнения разом: `pnpm seed:subservice arboristika`. */
export const SUB_SERVICE_BATCHES: Record<string, string[]> = {
  arboristika: Object.keys(ARBORISTIKA),
  'vyvoz-musora': Object.keys(VYVOZ_MUSORA),
}
