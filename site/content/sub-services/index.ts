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
  obrezkaPlodovyh,
  spilAlpinistami,
  spilSAvtovyshki,
  valkaDerevev,
  vyrubkaElok,
} from './arboristika-2'
import { avtovyshka, izmelchitelVetok, minitraktor, samosval } from './arenda-tehniki'
import {
  chistkaKryshChastnyyDom,
  chistkaKryshMkd,
  dogovorNaSezon,
  otSnega,
  sbivanieSosulek,
  uborkaTerritoriiZima,
} from './chistka-krysh'
import {
  demontazhBani,
  demontazhDachi,
  demontazhSaraya,
  snosDoma,
  snosGarazha,
  snosZabora,
} from './demontazh'
import {
  gazonIPoliv,
  moshchenieIDorozhki,
  osveshcheniyeUchastka,
  posadkaRasteniy,
  proektUchastka,
} from './dizain-landshafta'
import { spilDerevev } from './spil-derevev'
import type { SubServiceContent } from './types'
import {
  dlyaUkTszh,
  gazel,
  kontejner,
  krupnogabarit,
  sDachiSnt,
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
  'obrezka-plodovyh': obrezkaPlodovyh,
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
  's-dachi-snt': sDachiSnt,
}

const CHISTKA_KRYSH: Record<string, SubServiceContent> = {
  'chistka-krysh-chastnyy-dom': chistkaKryshChastnyyDom,
  'chistka-krysh-mkd': chistkaKryshMkd,
  'sbivanie-sosulek': sbivanieSosulek,
  'ot-snega': otSnega,
  'uborka-territorii-zima': uborkaTerritoriiZima,
  'dogovor-na-sezon': dogovorNaSezon,
}

const DEMONTAZH: Record<string, SubServiceContent> = {
  'demontazh-dachi': demontazhDachi,
  'demontazh-bani': demontazhBani,
  'demontazh-saraya': demontazhSaraya,
  'snos-doma': snosDoma,
  'snos-garazha': snosGarazha,
  'snos-zabora': snosZabora,
}

const DIZAIN_LANDSHAFTA: Record<string, SubServiceContent> = {
  'proekt-uchastka': proektUchastka,
  'posadka-rasteniy': posadkaRasteniy,
  'gazon-i-poliv': gazonIPoliv,
  'osvescheniye-uchastka': osveshcheniyeUchastka,
  'moshchenie-i-dorozhki': moshchenieIDorozhki,
}

const ARENDA_TEHNIKI: Record<string, SubServiceContent> = {
  avtovyshka,
  'izmelchitel-vetok': izmelchitelVetok,
  minitraktor,
  samosval,
}

/** Подуслуги с подготовленным наполнением — ключ для `pnpm seed:subservice <ключ>`. */
export const SUB_SERVICE_CONTENT: Record<string, SubServiceContent> = {
  ...ARBORISTIKA,
  ...VYVOZ_MUSORA,
  ...CHISTKA_KRYSH,
  ...DEMONTAZH,
  ...DIZAIN_LANDSHAFTA,
  ...ARENDA_TEHNIKI,
}

/** Партии для наполнения разом: `pnpm seed:subservice arboristika`. */
export const SUB_SERVICE_BATCHES: Record<string, string[]> = {
  arboristika: Object.keys(ARBORISTIKA),
  'vyvoz-musora': Object.keys(VYVOZ_MUSORA),
  'chistka-krysh': Object.keys(CHISTKA_KRYSH),
  demontazh: Object.keys(DEMONTAZH),
  'dizain-landshafta': Object.keys(DIZAIN_LANDSHAFTA),
  'arenda-tehniki': Object.keys(ARENDA_TEHNIKI),
  /** План 09, этап 6, волна A, партия A1 (26.10.2026) */
  'volna-a1': ['obrezka-plodovyh', 's-dachi-snt'],
}
