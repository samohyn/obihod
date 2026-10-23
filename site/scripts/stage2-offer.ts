/**
 * Этап 2 плана 09 — оффер на первом экране и честная кнопка калькулятора (сверено с Perplexity).
 *
 *   pnpm stage2:offer            — отчёт: что поменяется
 *   pnpm stage2:offer --apply    — записать (статус документа не меняется, прежнее — в «Версиях»)
 *
 * 1. «Обещание под заголовком» у первого экрана страниц направлений и калькуляторов — из
 *    content/pages (тот же текст, что у seed); у подуслуг поле пустое — сайт берёт обещание
 *    направления. Свою строку, если владелец уже заполнил, не трогаем.
 *    Если подзаголовок подуслуги повторяет обещание («— по твёрдой смете, оплата после приёмки»),
 *    повтор убираем.
 * 2. Кнопка калькулятора «Зафиксировать цену» → «Получить твёрдую смету»: калькулятор даёт
 *    ориентир, твёрдая цена — в смете (оффер, правила формулировок). Другие подписи не трогаем.
 *
 * Опубликованные документы, у которых последняя версия отличается от опубликованной, пропускаем;
 * черновики правим по последней версии и сохраняем черновиком (как fix:offer-logic).
 */
import { getPayload } from 'payload'

import config from '../payload.config.js'
import { PAGE_CONTENT } from '../content/pages'
import { requestSiteRevalidate } from './_site-revalidate'

const APPLY = process.argv.includes('--apply')
const RAW = { rawOffer: true, keepPublished: true }
const OLD_CTA = 'Зафиксировать цену'
const NEW_CTA = 'Получить твёрдую смету'
const DUP = / — по твёрдой смете, оплата после приёмки(?=\.)/

type Block = Record<string, unknown> & { blockType?: string }

/** Обещания из контента: slug страницы → текст первого слайда. */
function promises(): Map<string, string> {
  const out = new Map<string, string>()
  for (const page of Object.values(PAGE_CONTENT)) {
    const hero = page.blocks.find((b) => b.blockType === 'hero-slider')
    const promise = hero && hero.blockType === 'hero-slider' ? hero.slides[0]?.promise : null
    if (promise) out.set(page.slug, promise)
  }
  return out
}

const comparable = (doc: unknown) =>
  JSON.stringify(doc, (k, v) => (k === 'updatedAt' || k === 'createdAt' ? undefined : v))

async function main() {
  const payload = await getPayload({ config })
  const PROMISE = promises()
  const writes: (() => Promise<unknown>)[] = []
  const skipped: string[] = []
  for (const collection of ['pages', 'sub-services'] as const) {
    const [live, latest] = await Promise.all([
      payload.find({ collection, limit: 1000, pagination: false, depth: 0, context: RAW }),
      payload.find({
        collection,
        limit: 1000,
        pagination: false,
        depth: 0,
        draft: true,
        context: RAW,
      }),
    ])
    const latestById = new Map(
      latest.docs.map((d) => [d.id, d as unknown as Record<string, unknown>]),
    )
    for (const row of live.docs as unknown as Record<string, unknown>[]) {
      const last = latestById.get(row.id as number)
      const isDraft = row._status === 'draft' && last?._status === 'draft'
      const d = isDraft ? last! : row
      const where = `${collection}/${d.slug}`
      const changes: string[] = []
      const layout = ((d.layout as Block[] | undefined) ?? []).map((b) => {
        if (b.blockType === 'hero-slider' && collection === 'pages') {
          const promise = PROMISE.get(String(d.slug))
          const slides = (b.slides as Record<string, unknown>[] | undefined) ?? []
          if (promise && slides[0] && !slides[0].promise) {
            changes.push(`обещание: «${promise}»`)
            return { ...b, slides: [{ ...slides[0], promise }, ...slides.slice(1)] }
          }
        }
        // подуслуга берёт обещание у направления — то же самое в подзаголовке становится повтором
        if (b.blockType === 'hero-slider' && collection === 'sub-services') {
          const slides = (b.slides as Record<string, unknown>[] | undefined) ?? []
          const lead = typeof slides[0]?.lead === 'string' ? (slides[0].lead as string) : ''
          const fixed = lead.replace(DUP, '')
          if (slides[0] && !slides[0].promise && fixed !== lead) {
            changes.push(`подзаголовок без повтора обещания: «${fixed.slice(0, 60)}…»`)
            return { ...b, slides: [{ ...slides[0], lead: fixed }, ...slides.slice(1)] }
          }
        }
        if (b.blockType === 'calculator-v3' && b.ctaLabel === OLD_CTA) {
          changes.push(`кнопка калькулятора: «${OLD_CTA}» → «${NEW_CTA}»`)
          return { ...b, ctaLabel: NEW_CTA }
        }
        return b
      })
      if (!changes.length) continue
      if (!isDraft && last && comparable(last) !== comparable(d)) {
        skipped.push(`${where} — последняя версия отличается от опубликованной`)
        continue
      }
      console.error(`${where}${isDraft ? ' (черновик)' : ''}: ${changes.join('; ')}`)
      writes.push(() =>
        payload.update({
          collection,
          id: d.id as number,
          data: { layout, _status: d._status } as never,
          draft: isDraft,
          depth: 0,
          context: RAW,
        }),
      )
    }
  }
  if (skipped.length) console.error(`\n== пропущено: ${skipped.length}\n  ${skipped.join('\n  ')}`)
  if (!APPLY) {
    console.error(`\n[stage2:offer] документов к записи: ${writes.length} (для записи — --apply)`)
    process.exit(0)
  }
  let ok = 0
  for (const w of writes) {
    try {
      await w()
      ok++
    } catch (e) {
      console.error(`  ✗ ${e instanceof Error ? e.message : e}`)
    }
  }
  console.error(`\n[stage2:offer] записано: ${ok} из ${writes.length}`)
  if (ok) await requestSiteRevalidate('stage2:offer')
  process.exit(0)
}

main().catch((e) => {
  console.error('[stage2:offer] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
