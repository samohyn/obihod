import { createHash } from 'node:crypto'

import type { Payload } from 'payload'

/**
 * Какую редакцию согласия на обработку ПДн видел клиент (152-ФЗ, ред. с 1 сентября 2025 —
 * согласие отдельным документом; доказать его должен оператор). Документ — «Страницы»
 * soglasie-na-obrabotku-personalnyh-dannyh, все версии хранятся (план 09, 4.4b).
 *
 * В заявку пишем время, редакцию («Редакция от» в блоке документа и номер опубликованной
 * версии) и SHA-256 блоков — по нему видно, что текст с тех пор не менялся.
 * IP и браузер не храним: закон их не требует, а это лишние персональные данные.
 */
export const CONSENT_SLUG = 'soglasie-na-obrabotku-personalnyh-dannyh'

export type ConsentRecord = { version: string; hash: string | null }

let cached: { at: number; value: ConsentRecord } | null = null
const TTL_MS = 5 * 60_000

export async function currentConsent(payload: Payload): Promise<ConsentRecord> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.value
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: CONSENT_SLUG } },
    limit: 1,
    depth: 0,
    context: { rawOffer: true },
  })
  const doc = res.docs[0] as { id?: number; layout?: unknown[]; _status?: string } | undefined
  let value: ConsentRecord = { version: 'документ согласия не опубликован', hash: null }
  if (doc?.id && doc._status === 'published') {
    const versions = await payload.findVersions({
      collection: 'pages',
      where: {
        and: [{ parent: { equals: doc.id } }, { 'version._status': { equals: 'published' } }],
      },
      sort: '-updatedAt',
      limit: 1,
      depth: 0,
    })
    const versionId = versions.docs[0]?.id
    const block = (doc.layout ?? []).find(
      (b) => (b as { blockType?: string }).blockType === 'legal-doc',
    ) as { revision?: string | null } | undefined
    const parts = [
      block?.revision ? `редакция от ${block.revision}` : null,
      versionId ? `версия ${versionId}` : null,
    ].filter(Boolean)
    value = {
      version: `«Согласие на обработку персональных данных»${parts.length ? `, ${parts.join(', ')}` : ''}`,
      hash: createHash('sha256')
        .update(JSON.stringify(doc.layout ?? []))
        .digest('hex'),
    }
  }
  cached = { at: Date.now(), value }
  return value
}
