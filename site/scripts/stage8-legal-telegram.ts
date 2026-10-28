/**
 * Политика и согласие ПДн: передача имени и телефона в Telegram через GitHub (решение владельца
 * 28.10.2026, трансграничная передача — ст. 12 152-ФЗ). Те же правки, что в content/pages/legal.ts.
 *
 *   pnpm stage8:legal-telegram            — отчёт (ничего не пишет)
 *   pnpm stage8:legal-telegram --apply    — записать (прежний текст — в «Версиях»)
 *
 * Правка применяется, только если в документе есть прежний текст: свои правки владельца не затираем.
 */
import { getPayload } from 'payload'

import config from '../payload.config.js'
import { requestSiteRevalidate } from './_site-revalidate'

const APPLY = process.argv.includes('--apply')
const RAW = { rawOffer: true, keepPublished: true }
const REVISION = '28 октября 2026 г.'

type R = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

const ABROAD_POLICY: [string, string] = [
  'Передача за рубеж.',
  ' Чтобы менеджер быстрее перезвонил, имя и номер телефона из заявки вместе с её номером и выбранной услугой приходят ему уведомлением в мессенджер Telegram (Telegram FZ-LLC, Объединённые Арабские Эмираты). По пути уведомление проходит через сервис GitHub (GitHub, Inc., Соединённые Штаты Америки) в зашифрованном виде. Это трансграничная передача персональных данных (статья 12 152-ФЗ), она выполняется на основании вашего согласия. Почта, адрес, описание задачи и фотографии за пределы России не передаются.',
]
const ABROAD_CONSENT: [string, string] = [
  'Передача за рубеж:',
  ' я согласен, что имя и номер телефона из заявки передаются менеджеру уведомлением в мессенджер Telegram (Telegram FZ-LLC, Объединённые Арабские Эмираты) через сервис GitHub (GitHub, Inc., Соединённые Штаты Америки) — чтобы мне быстрее перезвонили. Это трансграничная передача персональных данных; остальные данные заявки за пределы России не передаются.',
]
const NO_ABROAD = ' Трансграничную передачу персональных данных мы не осуществляем.'
const BACKUPS = 'резервные копии хранятся на территории Российской Федерации.'
const NOTIFY_ITEM =
  'уведомление менеджеру в Telegram содержит только имя, телефон, номер заявки и услугу, через GitHub оно передаётся в зашифрованном виде.'

// ── узлы редактора (Lexical): по образцу соседних ────────────────────────────────────────────
const text = (t: string, bold = false) => ({
  mode: 'normal',
  text: t,
  type: 'text',
  style: '',
  detail: 0,
  format: bold ? 1 : 0,
  version: 1,
})
const paragraph = ([b, t]: [string, string]) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  children: [text(b, true), text(t)],
  textStyle: '',
  textFormat: 1,
})
const plain = (n: R): string =>
  (n.text ?? '') + ((n.children as R[] | undefined)?.map(plain).join('') ?? '')

/** Политика: раздел 7 — вместо «не осуществляем» абзац о передаче; раздел 10 — пункт об уведомлении. */
function editPolicy(kids: R[]): string | null {
  const i = kids.findIndex((n) => n.type === 'paragraph' && plain(n).includes(NO_ABROAD.trim()))
  const list = kids.find(
    (n) => n.type === 'list' && (n.children as R[]).some((li) => plain(li) === BACKUPS),
  )
  if (i < 0) return 'нет фразы «Трансграничную передачу … не осуществляем»'
  if (!list) return 'нет пункта о резервных копиях'
  const last = (kids[i].children as R[]).find(
    (c) => c.type === 'text' && c.text.includes(NO_ABROAD),
  )
  if (!last) return 'фраза разбита на несколько узлов — поправьте в админке'
  last.text = last.text.replace(NO_ABROAD, '')
  kids.splice(i + 1, 0, paragraph(ABROAD_POLICY))
  const items = list.children as R[]
  const backups = items.find((li) => plain(li) === BACKUPS)!
  ;(backups.children as R[])[0].text = BACKUPS.replace(/\.$/, ';')
  items.push({ ...backups, value: items.length + 1, children: [text(NOTIFY_ITEM)] })
  return null
}

/** Согласие: после «Зачем:» — абзац «Передача за рубеж:». */
function editConsent(kids: R[]): string | null {
  const i = kids.findIndex((n) => n.type === 'paragraph' && plain(n).startsWith('Зачем:'))
  if (i < 0) return 'нет абзаца «Зачем:»'
  kids.splice(i + 1, 0, paragraph(ABROAD_CONSENT))
  return null
}

const EDITS: Record<string, (kids: R[]) => string | null> = {
  'politika-konfidentsialnosti': editPolicy,
  'soglasie-na-obrabotku-personalnyh-dannyh': editConsent,
}

const comparable = (doc: unknown) =>
  JSON.stringify(doc, (k, v) => (k === 'updatedAt' || k === 'createdAt' ? undefined : v))

async function main() {
  const payload = await getPayload({ config })
  let writes = 0
  for (const [slug, edit] of Object.entries(EDITS)) {
    const where = { slug: { equals: slug } }
    const [live, latest] = await Promise.all([
      payload.find({ collection: 'pages', where, limit: 1, depth: 0, context: RAW }),
      payload.find({ collection: 'pages', where, limit: 1, depth: 0, draft: true, context: RAW }),
    ])
    const doc = live.docs[0] as unknown as R | undefined
    if (!doc) {
      console.error(`✗ ${slug}: документа нет`)
      continue
    }
    if (comparable(latest.docs[0]) !== comparable(doc)) {
      console.error(`✗ ${slug}: есть неопубликованная правка — не трогаю, поправьте в админке`)
      continue
    }
    const layout = JSON.parse(JSON.stringify(doc.layout)) as R[]
    const block = layout.find((b) => b.blockType === 'legal-doc')
    const kids = block?.body?.root?.children as R[] | undefined
    if (!block || !kids) {
      console.error(`✗ ${slug}: нет блока «Текст документа»`)
      continue
    }
    if (kids.some((n) => plain(n).startsWith('Передача за рубеж'))) {
      console.error(`= ${slug}: уже обновлён`)
      continue
    }
    const problem = edit(kids)
    if (problem) {
      console.error(`✗ ${slug}: ${problem}`)
      continue
    }
    block.revision = REVISION
    console.error(`→ ${slug}: обновлён, редакция ${REVISION}`)
    if (APPLY) {
      await payload.update({
        collection: 'pages',
        id: doc.id as number,
        data: { layout } as never,
        depth: 0,
        context: RAW,
      })
      writes++
    }
  }
  if (APPLY && writes) await requestSiteRevalidate('stage8:legal-telegram')
  console.error(`[stage8:legal-telegram] ${APPLY ? `записано: ${writes}` : 'отчёт, без записи'}`)
  process.exit(0)
}

main().catch((e) => {
  console.error('[stage8:legal-telegram] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
