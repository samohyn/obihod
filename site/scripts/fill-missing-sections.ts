/**
 * EPIC-SERVICE-PAGES-UX C5 wave A — fill missing required sections для
 * vyvoz-musora pillar + 30 pillar-level SD.
 *
 * Запуск:
 *   PAYLOAD_DISABLE_PUSH=1 pnpm tsx --require=./scripts/_payload-cjs-shim.cjs \\
 *     --env-file=.env.local scripts/fill-missing-sections.ts
 *
 * Approach:
 *   - Template-driven content (без Claude API — sustained constraint:
 *     `@anthropic-ai/sdk` не установлен в site/, ANTHROPIC_API_KEY не доступен).
 *     Intake §«Если API key не доступен — generate template content с placeholder
 *     per URL (sufficient для pilot D5 A/B test без Claude)».
 *   - Контент варьируется per-pillar / per-district через Russian morphology
 *     (nameNominative / nameLocative / nameDative / nameGenitive).
 *   - Каждый text адаптирован под TOV brand-guide v2.6 §tov (Caregiver+Ruler).
 *
 * Pillar-level SD (subServiceSlug NULL) — 31 шт. для vyvoz-musora.
 *   - 8 уже full (Hero/TextContent/LeadForm/CtaBanner/Faq seeded ранее).
 *   - 23 пустые → fill: hero, lead-form, cta-banner, faq.
 *
 * Pillar T2 /vyvoz-musora/ — 1 missing fillable: calculator-placeholder.
 *
 * Все mutations — через Payload Local API `payload.update()`. Это проходит через
 * sustained validate-hooks (master-template-gate, requireGatesForPublish, etc).
 *
 * Idempotent: skip URL если все required fillable sections уже present.
 */

import { getPayload } from 'payload'
import config from '../payload.config.js'
import {
  type DocumentBlock,
  type MasterTemplateLayer,
  type MasterTemplateSection,
} from '../blocks/master-template'
import { getMissingRequiredSections } from '../lib/master-template/getBlocksForLayer'

const PILLAR_SLUG = 'vyvoz-musora'

const SERVICES_FILLABLE: ReadonlySet<MasterTemplateSection> = new Set([
  'hero',
  'breadcrumbs',
  'tldr',
  'services-grid',
  'mini-case',
  'related-services',
  'cta-banner',
  'faq',
  'lead-form',
  'calculator',
])
const SERVICE_DISTRICTS_FILLABLE: ReadonlySet<MasterTemplateSection> = new Set([
  'hero',
  'cta-banner',
  'faq',
  'lead-form',
])

// ────────────────────────────────────────────────────────────────────────────
// Lexical helpers
// ────────────────────────────────────────────────────────────────────────────

function lexicalParagraph(text: string): unknown {
  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          textFormat: 0,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Content templates — vyvoz-musora pillar (TOV: Caregiver+Ruler)
// ────────────────────────────────────────────────────────────────────────────

interface DistrictMeta {
  slug: string
  nameNominative: string
  nameLocative?: string // «в Красногорске»
  nameDative?: string // «по Красногорску»
  nameGenitive?: string // «из Красногорска»
}

/**
 * District namePrepositional уже содержит предлог («в Лобне»), nameGenitive
 * часто == nominative (sustained data), nameLocative обычно отсутствует.
 * Helper'ы делают: locativePhrase → «в <city>» (без двойного предлога), genitive
 * → fallback nominative.
 */
function locativePhrase(d: DistrictMeta): string {
  const prep = d.nameLocative?.trim() ?? ''
  if (!prep) return d.nameNominative
  // если уже начинается с «в » или «во » — используем как есть
  if (/^в[оъ]?\s+/iu.test(prep)) return prep
  return `в ${prep}`
}
function genitive(d: DistrictMeta): string {
  return d.nameGenitive && d.nameGenitive !== d.nameNominative ? d.nameGenitive : d.nameNominative
}

function buildHeroBlock(district: DistrictMeta): DocumentBlock {
  return {
    blockType: 'hero',
    enabled: true,
    title: `Вывоз мусора ${locativePhrase(district)} — от 12 800 ₽ за объект`,
    subtitle: `Контейнер 8/20/27 м³, бригада с грузчиками, акт о вывозе на полигон. Подача послезавтра, оплата по факту работ.`,
    ctaLabel: 'Получить смету по фото',
    ctaHref: '/foto-smeta/',
    seasonalTheme: 'summer',
  }
}

function buildLeadFormBlock(district: DistrictMeta): DocumentBlock {
  return {
    blockType: 'lead-form',
    enabled: true,
    variant: 'short',
    heading: `Заявка из ${genitive(district)}`,
    subheading: 'Перезвоним в 8:00–22:00 МСК. Смета за 10 минут, оплата по факту.',
    submitLabel: 'Получить смету',
    successMessage: 'Спасибо, перезвоним за 15 минут.',
    services: [],
  }
}

function buildCtaBannerBlock(district: DistrictMeta): DocumentBlock {
  return {
    blockType: 'cta-banner',
    enabled: true,
    title: `4 услуги ${locativePhrase(district)} одной бригадой`,
    body: lexicalParagraph(
      `Если параллельно нужна арбористика, демонтаж или чистка крыш — бригада совмещает выезды и считает скидку до 15%. Пишите услугу в комментарии — пересчитаем смету одной строкой.`,
    ),
    ctaLabel: 'Запросить смету через фото',
    ctaHref: '/foto-smeta/',
    accent: 'primary',
  }
}

function lexicalAnswer(text: string): unknown {
  return lexicalParagraph(text)
}

function buildFaqBlock(district: DistrictMeta): DocumentBlock {
  const loc = locativePhrase(district)
  return {
    blockType: 'faq',
    enabled: true,
    heading: `Частые вопросы по вывозу мусора ${loc}`,
    generateFaqPageSchema: true,
    items: [
      {
        question: `Как быстро бригада приезжает ${loc}?`,
        answer: lexicalAnswer(
          `На срочный вызов — в день обращения, если место подачи в пределах 30 км от МКАД. Стандартный режим — послезавтра до 12:00. ${district.nameNominative} входит в зону регулярного выезда: контейнер подаём с собственной площадки, без ожидания свободной машины.`,
        ),
      },
      {
        question: 'Сколько стоит вывоз — фикс или по факту?',
        answer: lexicalAnswer(
          `Фиксированная цена за объект: 12 800 ₽ — Газель 5 м³, 14 200 ₽ — садовый мусор, 14 800 ₽ — контейнер 8 м³. Доплата только если объём вырос больше чем на 25% относительно вашего фото — об этом предупредим до старта работ. Без скрытых наценок, без «по факту посмотрим».`,
        ),
      },
      {
        question: 'Какие документы выдаёте после вывоза?',
        answer: lexicalAnswer(
          'Акт о вывозе с указанием полигона, талон взвешивания, договор и кассовый чек. Для УК и ТСЖ — счёт-фактура с НДС или без (по запросу). Документы передаём на месте или электронно в день вывоза.',
        ),
      },
      {
        question: 'Что не вывозите?',
        answer: lexicalAnswer(
          'Не вывозим жидкие отходы, медицинский, биологический и радиоактивный мусор, опасные классы I–II (ртутные лампы, аккумуляторы, химия) — это отдельные лицензированные операторы. Строительный, бытовой, садовый, КГМ и старая мебель — берём без ограничений до 27 м³ за один заезд.',
        ),
      },
      {
        question: 'Можно оплатить безналом или картой?',
        answer: lexicalAnswer(
          'Да: банковская карта водителю на месте, перевод по реквизитам для юрлиц, СБП по QR-коду. Для УК и ТСЖ — отсрочка платежа до 14 дней по договору. Чек или счёт-фактура — в течение часа после оплаты.',
        ),
      },
      {
        question: `Работаете ли с УК и ТСЖ ${loc}?`,
        answer: lexicalAnswer(
          `Да, годовой договор с фиксированной ставкой за вывоз и отдельным счётом за КГМ-эпизоды. Бригадир ${district.nameNominative} закреплён за объектом — нет «новых исполнителей» каждую неделю. Штрафы ГЖИ за переполненные баки берём на свой счёт, если просрочили выезд по нашей вине.`,
        ),
      },
    ],
  }
}

// ─── Pillar T2 calculator-placeholder ───
function buildCalculatorBlock(): DocumentBlock {
  return {
    blockType: 'calculator-placeholder',
    enabled: true,
    heading: 'Калькулятор вывоза мусора — пришлите фото',
    body: 'Пересчитываем стоимость по фото свалки за 15 минут. Указываем точный объём, тип машины и срок подачи. Без выезда замерщика и без обязательств.',
    serviceType: 'musor',
    ctaLabel: 'Запросить смету через фото',
    ctaHref: '/foto-smeta/',
  }
}

// ────────────────────────────────────────────────────────────────────────────
// LocalFAQ helpers (publish-gate soft-fail fix)
// ────────────────────────────────────────────────────────────────────────────

function buildLocalFaqItems(district: DistrictMeta): Array<{ question: string; answer: unknown }> {
  const loc = locativePhrase(district)
  return [
    {
      question: `Сколько стоит подача контейнера ${loc} в выходной?`,
      answer: lexicalAnswer(
        `Цена та же, что в будний день — без коэффициента «выходной». ${district.nameNominative} обслуживается с собственной площадки, дежурная бригада работает 7/7. Если нужна подача в субботу до 9:00 — бронируйте за день, машин на ранний слот меньше.`,
      ),
    },
    {
      question: `Можно ли поставить контейнер во двор многоквартирного дома ${loc}?`,
      answer: lexicalAnswer(
        `Да, по согласованию с УК или старшим по дому. Перед подачей высылаем габариты площадки и схему манёвра — если двор узкий, ставим Газель вместо 8-м³ контейнера. Для официального согласования с местной администрацией ${district.nameNominative} даём пакет документов и ждём ответа до 3 рабочих дней.`,
      ),
    },
  ]
}

// ────────────────────────────────────────────────────────────────────────────
// Stats + main loop
// ────────────────────────────────────────────────────────────────────────────

interface FillStats {
  total: number
  filled: number
  skipped: number
  failed: number
  blocksAdded: number
  faqsAdded: number
  wordsAdded: number
  errors: string[]
}

function countWordsInBlock(block: DocumentBlock): number {
  let count = 0
  const visit = (v: unknown): void => {
    if (typeof v === 'string') count += v.split(/\s+/).filter(Boolean).length
    else if (Array.isArray(v)) v.forEach(visit)
    else if (v && typeof v === 'object') Object.values(v as Record<string, unknown>).forEach(visit)
  }
  visit(block)
  return count
}

async function fillPillarT2(
  payload: Awaited<ReturnType<typeof getPayload>>,
  stats: FillStats,
): Promise<void> {
  const r = await payload.find({
    collection: 'services',
    where: { slug: { equals: PILLAR_SLUG } },
    limit: 1,
    depth: 0,
  })
  if (!r.docs.length) return
  const doc = r.docs[0] as Record<string, unknown> & { id: number }
  const blocks = (doc.blocks ?? []) as DocumentBlock[]
  const missing = getMissingRequiredSections('T2_PILLAR', blocks).filter((s) =>
    SERVICES_FILLABLE.has(s),
  )
  if (!missing.length) {
    console.log(`[T2] /${PILLAR_SLUG}/ — already complete`)
    stats.skipped++
    return
  }
  console.log(`[T2] /${PILLAR_SLUG}/ — adding ${missing.join(', ')}`)
  const newBlocks: DocumentBlock[] = [...blocks]
  for (const section of missing) {
    if (section === 'calculator') {
      const block = buildCalculatorBlock()
      newBlocks.push(block)
      stats.blocksAdded++
      stats.wordsAdded += countWordsInBlock(block)
    }
    // TODO другие секции если появятся в schema (pricing-block / process / breadcrumbs / ...)
  }
  stats.total++
  try {
    await payload.update({
      collection: 'services',
      id: doc.id,
      data: { blocks: newBlocks } as never,
    })
    stats.filled++
    console.log(`  ✓ updated services#${doc.id}`)
  } catch (e) {
    const err = (e as Error).message
    stats.failed++
    stats.errors.push(`T2 services#${doc.id}: ${err.substring(0, 200)}`)
    console.error(`  ✗ FAIL services#${doc.id}: ${err.substring(0, 200)}`)
  }
}

async function fillT4SDs(
  payload: Awaited<ReturnType<typeof getPayload>>,
  stats: FillStats,
): Promise<void> {
  const pillar = await payload.find({
    collection: 'services',
    where: { slug: { equals: PILLAR_SLUG } },
    limit: 1,
    depth: 0,
  })
  if (!pillar.docs.length) return
  const pillarId = (pillar.docs[0] as { id: number }).id

  const sds = await payload.find({
    collection: 'service-districts',
    where: { service: { equals: pillarId } },
    limit: 200,
    pagination: false,
    depth: 1,
  })

  for (const doc of sds.docs as Array<Record<string, unknown> & { id: number }>) {
    if (doc.subServiceSlug != null && doc.subServiceSlug !== '') continue // sub-level out of wave A
    const district = doc.district as
      | {
          slug: string
          nameNominative?: string
          namePrepositional?: string
          nameDative?: string
          nameGenitive?: string
        }
      | undefined
    if (!district || typeof district !== 'object') continue
    const meta: DistrictMeta = {
      slug: district.slug,
      nameNominative: district.nameNominative ?? district.slug,
      nameLocative: district.namePrepositional, // «о Красногорске» / «в Красногорске» — namePrepositional ≈ Locative
      nameDative: district.nameDative,
      nameGenitive: district.nameGenitive,
    }
    const blocks = (doc.blocks ?? []) as DocumentBlock[]
    const missing = getMissingRequiredSections('T4_SD', blocks).filter((s) =>
      SERVICE_DISTRICTS_FILLABLE.has(s),
    )

    // Если все 4 fillable секции присутствуют — skip blocks fill, но проверим soft-gates
    const localFaq = (doc.localFaq ?? []) as Array<{ question?: string; answer?: unknown }>
    const localFaqShortage = Math.max(0, 2 - localFaq.length)
    const needsLeadParagraph = !doc.leadParagraph

    if (!missing.length && !localFaqShortage && !needsLeadParagraph) {
      console.log(`[T4] /${PILLAR_SLUG}/${meta.slug}/ — already complete`)
      stats.skipped++
      continue
    }

    stats.total++
    console.log(
      `[T4] /${PILLAR_SLUG}/${meta.slug}/ — adding blocks=[${missing.join(',') || '—'}]` +
        (localFaqShortage ? ` localFaq+${localFaqShortage}` : '') +
        (needsLeadParagraph ? ' leadParagraph' : ''),
    )

    const newBlocks: DocumentBlock[] = [...blocks]
    for (const section of missing) {
      let block: DocumentBlock
      if (section === 'hero') block = buildHeroBlock(meta)
      else if (section === 'lead-form') block = buildLeadFormBlock(meta)
      else if (section === 'cta-banner') block = buildCtaBannerBlock(meta)
      else if (section === 'faq') block = buildFaqBlock(meta)
      else continue
      newBlocks.push(block)
      stats.blocksAdded++
      stats.wordsAdded += countWordsInBlock(block)
    }

    const updateData: Record<string, unknown> = {}
    if (missing.length) updateData.blocks = newBlocks
    if (localFaqShortage > 0) {
      const additions = buildLocalFaqItems(meta).slice(0, localFaqShortage)
      updateData.localFaq = [...localFaq, ...additions]
      stats.faqsAdded += additions.length
      stats.wordsAdded += additions.reduce(
        (a, f) => a + countWordsInBlock({ blockType: 'localfaq', ...f }),
        0,
      )
    }
    if (needsLeadParagraph) {
      const lead = `${meta.nameNominative} — район плотного жилого фонда и промзон с регулярными подачами контейнеров. Бригада знает заезды и согласования с УК, поэтому смета приходит за 15 минут, а машина — послезавтра до 12:00.`
      updateData.leadParagraph = lexicalParagraph(lead)
      stats.wordsAdded += lead.split(/\s+/).filter(Boolean).length
    }

    try {
      await payload.update({
        collection: 'service-districts',
        id: doc.id,
        data: updateData as never,
      })
      stats.filled++
      console.log(`  ✓ updated service-districts#${doc.id}`)
    } catch (e) {
      const err = (e as Error).message
      stats.failed++
      stats.errors.push(`T4 SD#${doc.id} ${meta.slug}: ${err.substring(0, 200)}`)
      console.error(`  ✗ FAIL service-districts#${doc.id} ${meta.slug}: ${err.substring(0, 200)}`)
    }
  }
}

async function main(): Promise<void> {
  console.log('[fill-missing-sections] Starting…')
  const payload = await getPayload({ config })

  const stats: FillStats = {
    total: 0,
    filled: 0,
    skipped: 0,
    failed: 0,
    blocksAdded: 0,
    faqsAdded: 0,
    wordsAdded: 0,
    errors: [],
  }

  await fillPillarT2(payload, stats)
  await fillT4SDs(payload, stats)

  console.log('\n=== FILL SUMMARY ===')
  console.log(`URLs targeted: ${stats.total}`)
  console.log(`URLs filled:   ${stats.filled}`)
  console.log(`URLs skipped:  ${stats.skipped}`)
  console.log(`URLs failed:   ${stats.failed}`)
  console.log(`Blocks added:  ${stats.blocksAdded}`)
  console.log(`LocalFAQs added: ${stats.faqsAdded}`)
  console.log(`Words added:   ${stats.wordsAdded}`)
  if (stats.errors.length) {
    console.log('\nERRORS:')
    for (const e of stats.errors) console.log('  ', e)
  }
  process.exit(stats.failed > 0 ? 1 : 0)
}

main().catch((e: unknown) => {
  console.error('[fill-missing-sections] FAIL:', e)
  process.exit(1)
})

// Type signature usage to satisfy TS strict in unused-imports cases.
export type _Used = MasterTemplateLayer
