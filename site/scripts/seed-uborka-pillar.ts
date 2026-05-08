/**
 * seed-uborka-pillar — создаёт `uborka-territorii` pillar Service (US-3, EPIC-SEO-USLUGI).
 *
 * Sustained `seed.ts` имеет fixture (line 485+), но запуск полного seed.ts
 * перепишет 4 sustained pillar — небезопасно. Этот скрипт извлекает только
 * uborka-territorii fixture и создаёт его idempotent.
 *
 * Запуск:
 *   PAYLOAD_DISABLE_PUSH=1 pnpm tsx --require=./scripts/_payload-cjs-shim.cjs --env-file=.env.local scripts/seed-uborka-pillar.ts
 */
/* eslint-disable no-console */

import { getPayload } from 'payload'
import config from '../payload.config.js'

const lex = (text: string) => ({
  root: {
    type: 'root' as const,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        textFormat: 0,
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal' as const, style: '', text, version: 1 },
        ],
      },
    ],
  },
})

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'services',
    where: { slug: { equals: 'uborka-territorii' } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    console.log('• uborka-territorii: уже есть, пропуск')
    process.exit(0)
  }

  const result = await payload.create({
    collection: 'services',
    data: {
      slug: 'uborka-territorii',
      title: 'Уборка территории',
      h1: 'Уборка территории',
      metaTitle: 'Уборка территории в Москве и МО — Обиход',
      metaDescription:
        'Покос травы, выравнивание участка, расчистка от деревьев и кустарников, вывоз порубочных остатков. Смета по фото за 10 минут, фикс-цена за сотку.',
      intro: lex(
        'Обиход выполняет уборку территории в Москве и Московской области с фиксированной ценой за сотку — от 80 ₽ за покос травы до 8 000 ₽ за расчистку участка. Покос, выравнивание, расчистка, вывоз порубочных остатков. Смета по 3 фото за 10 минут.',
      ),
      priceFrom: 80,
      priceTo: 8000,
      priceUnit: 'm2',
      faqGlobal: [
        {
          question: 'Что входит в фикс-цену за сотку?',
          answer: lex(
            'Выезд бригады с инструментом, работа, погрузка и вывоз растительных остатков, итоговая уборка. Без скрытых наценок в пределах ЦКАД.',
          ),
        },
        {
          question: 'Можно ли совместить уборку территории с другими услугами?',
          answer: lex(
            'Да. Часто связка: расчистка → демонтаж сарая → вывоз мусора → выравнивание под фундамент. Дисконт 5–10%.',
          ),
        },
      ],
      subServices: [
        { slug: 'vyravnivanie-uchastka', title: 'Выравнивание участка', h1: 'Выравнивание участка', priceFrom: 250 },
        { slug: 'raschistka-uchastka', title: 'Расчистка участка', h1: 'Расчистка участка', priceFrom: 800 },
        { slug: 'pokos-travy', title: 'Покос травы', h1: 'Покос травы', priceFrom: 80 },
        { slug: 'vyvoz-porubochnyh-ostatkov', title: 'Вывоз порубочных остатков', h1: 'Вывоз порубочных остатков', priceFrom: 1800 },
      ],
    } as never,
  })

  console.log(`✓ uborka-territorii: создан (id=${(result as { id: number }).id})`)
  process.exit(0)
}

main().catch((e) => {
  console.error('[seed-uborka-pillar] упал:', e instanceof Error ? e.message : e)
  process.exit(1)
})
