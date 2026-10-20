import { spilDerevev } from './spil-derevev'
import type { SubServiceContent } from './types'

/** Подуслуги с подготовленным наполнением — ключ для `pnpm seed:subservice <ключ>`. */
export const SUB_SERVICE_CONTENT: Record<string, SubServiceContent> = {
  'spil-derevev': spilDerevev,
}
