/**
 * US-3 Wave 0 verify (do, 2026-05-02): минимальный seed для проверки sub-level
 * SD route `/vyvoz-musora/kontejner/odincovo/`.
 *
 * Идемпотентен: если SD уже существует — пропускает создание.
 * Использование: `PAYLOAD_DISABLE_PUSH=1 pnpm tsx --require=./scripts/_payload-cjs-shim.cjs --env-file=.env.local scripts/seed-test-sub-sd.ts`
 *
 * Удалить после Wave 0 verify (вызывается ad-hoc, не часть production seed).
 */
import { getPayload } from 'payload'
import config from '../payload.config'

async function main(): Promise<void> {
  const payload = await getPayload({ config })

  const SVC_SLUG = 'vyvoz-musora'
  const SUB_SLUG = 'kontejner'
  const DST_SLUG = 'odincovo'

  const [serviceRes, districtRes] = await Promise.all([
    payload.find({ collection: 'services', where: { slug: { equals: SVC_SLUG } }, limit: 1 }),
    payload.find({ collection: 'districts', where: { slug: { equals: DST_SLUG } }, limit: 1 }),
  ])

  const service = serviceRes.docs[0]
  const district = districtRes.docs[0]

  if (!service) {
    console.error(`[seed-test-sub-sd] service ${SVC_SLUG} not found — bail`)
    process.exit(1)
  }
  if (!district) {
    console.error(`[seed-test-sub-sd] district ${DST_SLUG} not found — bail`)
    process.exit(1)
  }

  const existing = await payload.find({
    collection: 'service-districts',
    where: {
      and: [
        { service: { equals: service.id } },
        { district: { equals: district.id } },
        { subServiceSlug: { equals: SUB_SLUG } },
      ],
    },
    limit: 1,
  })

  if (existing.docs[0]) {
    console.log(`[seed-test-sub-sd] SD already exists: id=${existing.docs[0].id} — skip`)
    process.exit(0)
  }

  // Минимальный валидный Lexical RichText (ServiceDistricts.ts требует leadParagraph).
  const leadParagraph = {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [
            {
              type: 'text',
              format: 0,
              detail: 0,
              mode: 'normal' as const,
              style: '',
              text: 'Контейнер 8 м³ в Одинцово — фикс-цена за объект, смета по фото за 10 минут.',
              version: 1,
            },
          ],
        },
      ],
    },
  }

  const created = await payload.create({
    collection: 'service-districts',
    data: {
      service: service.id,
      district: district.id,
      subServiceSlug: SUB_SLUG,
      // Bizness gate ServiceDistricts.ts requireGatesForPublish: запрещает
      // publish без mini-case. Для verify используем draft — route рендерится
      // с amber warning «нужны mini-case + 2 локальных FAQ».
      publishStatus: 'draft',
      noindexUntilCase: true,
      computedTitle: 'Контейнер 8 м³ в Одинцово — фикс-цена за объект',
      leadParagraph,
      _status: 'draft',
    } as never,
  })

  console.log(
    `[seed-test-sub-sd] created SD id=${created.id} (${SVC_SLUG}/${SUB_SLUG}/${DST_SLUG})`,
  )
  process.exit(0)
}

main().catch((err) => {
  console.error('[seed-test-sub-sd] fatal:', err)
  process.exit(1)
})
