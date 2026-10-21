/**
 * Чистка старых текстов «Услуга × район» под шаблон гео-страниц (план 09, этап 3).
 *
 *   pnpm clean:geo-legacy            — показать, что изменится (ничего не пишет)
 *   pnpm clean:geo-legacy --apply    — очистить заголовок, вводный абзац и местные вопросы
 *
 * Шаблон собирает страницу из хаба направления и района; эти поля — ручная настройка поверх.
 * В старых записях они были сгенерированы с ошибками (чужие заголовки, заниженные цены,
 * «талоны полигона»): заголовок очищается, вводный абзац и два местных вопроса (обязательны
 * для опубликованных) заменяются фактами района и обещаниями оффера. До записи в stdout печатается JSON-копия старых значений:
 * `> geo-legacy-backup.json`. Цена-заметка и местные ориентиры не трогаются.
 *
 * Уже очищенные записи пропускаются — повторный запуск ничего не пишет.
 *
 * ВНИМАНИЕ: Payload `update` при включённых черновиках берёт за основу ПОСЛЕДНЮЮ ВЕРСИЮ записи. Если
 * она черновик (у части старых записей статус выставлен в базе напрямую, опубликованных версий нет),
 * опубликованная запись станет черновиком с полями этого черновика (ориентиры, publishStatus,
 * noindexUntilCase). 21.10.2026 на проде так и вышло — откатано из дампа таблиц перед запуском.
 * Перед `--apply` на базе с опубликованными записями — дамп `service_districts*` и сверка после.
 */
import { getPayload } from 'payload'

import config from '../payload.config.js'

const APPLY = process.argv.includes('--apply')

async function main() {
  const payload = await getPayload({ config })
  const found = await payload.find({
    collection: 'service-districts',
    where: { subServiceSlug: { exists: false } },
    limit: 1000,
    pagination: false,
    depth: 1,
  })
  // Очищенная запись: без своего заголовка и с двумя нашими местными вопросами
  const cleaned = (d: unknown) => {
    const doc = d as { seoH1?: string | null; localFaq?: { question?: string }[] | null }
    return (
      !doc.seoH1 &&
      doc.localFaq?.length === 2 &&
      Boolean(doc.localFaq[0]?.question?.startsWith('Как быстро приедете'))
    )
  }
  const res = { docs: found.docs.filter((d) => !cleaned(d)) }
  const backup = res.docs.map((d) => {
    const doc = d as unknown as Record<string, unknown>
    return {
      id: doc.id,
      service: (doc.service as { slug?: string } | null)?.slug,
      district: (doc.district as { slug?: string } | null)?.slug,
      seoH1: doc.seoH1 ?? null,
      leadParagraph: doc.leadParagraph ?? null,
      localFaq: doc.localFaq ?? [],
    }
  })
  process.stdout.write(JSON.stringify(backup, null, 2) + '\n')
  if (!APPLY) {
    console.error(`[clean:geo-legacy] записей: ${backup.length}. Для записи — --apply`)
    process.exit(0)
  }
  const pages = await payload.find({ collection: 'pages', limit: 200, depth: 0 })
  const pillarTitle = new Map(
    pages.docs.map((p) => [
      String((p as { slug?: string }).slug),
      String((p as { title?: string }).title),
    ]),
  )
  let n = 0
  for (const d of res.docs) {
    const doc = d as unknown as {
      id: number
      service?: { slug?: string; title?: string } | null
      district?: { namePrepositional?: string; distanceFromMkad?: number | null } | null
    }
    const service = doc.service?.slug ?? ''
    const where = doc.district?.namePrepositional ?? ''
    const km = doc.district?.distanceFromMkad ?? null
    const name = pillarTitle.get(service) ?? doc.service?.title ?? ''
    const text = [
      `${name} ${where} и по всему округу${km !== null ? ` — ${km} км от МКАД` : ''}.`,
      'Смету присылаем по фото за 30 минут,',
      km !== null && km <= 50 ? 'оценщик выезжает бесплатно,' : 'выезд оценщика — по согласованию,',
      'оплата после приёмки.',
    ].join(' ')
    const localFaq = [
      {
        question: `Как быстро приедете ${where}?`,
        answer: lexical(
          km !== null && km <= 30
            ? 'Оценщик — бесплатно сегодня или завтра, аварийная бригада — за 2 часа. Плановые работы — в согласованное окно 2 часа, опоздали — скидка 10%.'
            : 'Оценщик — бесплатно сегодня или завтра, плановые работы — в согласованное окно 2 часа. Срок аварийного выезда назовём при звонке.',
        ),
      },
      {
        question: `Как узнать цену ${where}?`,
        answer: lexical(
          'Пришлите 2–3 фото — смета за 30 минут. Твёрдую цену фиксируем в договоре до начала работ, оплата — после приёмки.',
        ),
      },
    ]
    await payload.update({
      collection: 'service-districts',
      id: doc.id,
      data: { seoH1: null, leadParagraph: lexical(text), localFaq } as never,
      context: { skipMasterTemplateGate: true },
    })
    n++
  }
  console.error(`[clean:geo-legacy] очищено записей: ${n}`)
  process.exit(0)
}

function lexical(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          textFormat: 0,
          children: [
            { mode: 'normal', text, type: 'text', style: '', detail: 0, format: 0, version: 1 },
          ],
        },
      ],
    },
  }
}

main().catch((e) => {
  console.error('[clean:geo-legacy] ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
