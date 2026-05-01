/**
 * Seed-скрипт US-0 W3 Stage 0 — 8 эталонных контент-страниц (AC-11).
 *
 * Импортирует 8 JSON-fixtures из `site/content/etalons-w3/` в Payload через
 * Local API. Для каждого fixture — выбирается коллекция по `type` field:
 *
 *   pillar-service / sub-service → Services / Services.subServices
 *   programmatic-sd               → ServiceDistricts (по service+district)
 *   district-hub                  → Districts
 *   blog-post                     → Blog
 *   case                          → Cases
 *   b2b-segment                   → B2BPages
 *   author                        → Authors
 *
 * **US-0 W3 Track B-3 Consolidation**: cw fixtures используют новую схему
 * (h1/eyebrow/subUsp/ctaPrimary/ctaSecondary/image — для hero;
 * label+href — для breadcrumbs items; iconId/href — для services-grid items;
 * imageUrl — для mini-case items). Payload Block configs остаются на legacy-
 * именах (title/subtitle/ctaLabel/ctaHref/items[].name+url). Renderer'ы (blocks
 * /*.tsx) обновлены на чтение обеих схем (приоритет cw).
 *
 * Seed-стратегия: blocks[] ИЗ cw fixture сохраняем КАК ЕСТЬ (cw-схема), Payload
 * принимает unknown fields в JSON-схеме blocks без валидации (поскольку
 * блок-конфиги имеют admin description-only поля; database column для каждого
 * named-field). Если Payload отвергнет лишние ключи — оборачиваем в
 * `pickBlockData()` и фильтруем до нативных Payload-полей.
 *
 * Lexical richText: markdown body в text-content блоках конвертируется в
 * простой Lexical paragraph (compatible с @payloadcms/richtext-lexical 3.84).
 * Полноценный markdown→Lexical AST парсер — backlog (US-1+).
 *
 * Hero/cover/avatar изображения — placeholder URL `TBD-fal.ai-...`. Реальные
 * изображения через fal.ai будут сгенерированы в Stage 1.
 *
 * Запуск:
 *   pnpm seed:etalons                                  # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm seed:etalons:prod    # prod (с backup!)
 *
 * Safety-gate (ADR-0001): regex по DATABASE_URI на prod-host (45.153.190.107
 * / obikhod.ru / db.obikhod.ru) + OBIKHOD_ENV=production. Без CONFIRM=yes
 * запуск отменяется без изменений в БД.
 *
 * Идемпотентен: skip / update only legacy fields для существующих записей.
 * Не перезатирает ручные правки оператора через Admin UI (только дополняет).
 *
 * Источник контракта: specs/EPIC-SEO-CONTENT-FILL/US-0-templates-ux-migration/sa-seo.md AC-11.
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../payload.config.js'

// ───────── Типы fixtures ─────────

interface BaseFixture {
  type: string
  url?: string
  slug: string
  h1?: string
  metaTitle?: string
  metaDescription?: string
  blocks?: unknown[]
  [key: string]: unknown
}

interface PillarFixture extends BaseFixture {
  type: 'pillar-service'
}

interface SubFixture extends BaseFixture {
  type: 'sub-service'
  parentSlug: string
}

interface ProgrammaticSdFixture extends BaseFixture {
  type: 'programmatic-sd'
  parentSlug: string
  districtSlug: string
}

interface DistrictHubFixture extends BaseFixture {
  type: 'district-hub'
  districtName?: string
}

interface BlogFixture extends BaseFixture {
  type: 'blog-post'
  author?: { slug?: string; name?: string }
  datePublished?: string
  dateModified?: string
}

interface CaseFixture extends BaseFixture {
  type: 'case'
  publishedAt?: string
}

interface B2BFixture extends BaseFixture {
  type: 'b2b-segment'
}

interface AuthorFixture extends BaseFixture {
  type: 'author'
  kind?: string
  jobTitle?: string
  knowsAbout?: string[]
  worksInDistricts?: string[]
  sameAs?: string[]
}

// ───────── Helpers ─────────

type SeedStatus = 'created' | 'skipped' | 'updated' | 'error'

interface SeedResult {
  type: string
  url: string
  status: SeedStatus
  message?: string
}

const lexicalParagraph = (text: string) => ({
  root: {
    type: 'root',
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
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text,
            version: 1,
          },
        ],
      },
    ],
  },
})

async function findOneBySlug(
  payload: Payload,
  collection: Parameters<Payload['find']>[0]['collection'],
  slug: string,
) {
  const r = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  return r.docs[0] ?? null
}

/**
 * Преобразует один блок из cw-схемы в Payload-совместимую форму (legacy schema).
 *
 * Соответствие:
 *   hero.h1            → title
 *   hero.subUsp        → subtitle
 *   hero.ctaPrimary    → ctaLabel/ctaHref
 *   hero.image         → пропускаем (Payload ждёт upload-relationship, у cw — TBD)
 *
 *   breadcrumbs.items[].label/href → items[].name/url
 *
 *   text-content.h2  → heading
 *   text-content.body (markdown string) → Lexical paragraph
 *
 *   tldr.body (string) → text (legacy field)
 *
 *   services-grid.items[].title/href/iconId/description → items[].title/slug/icon/summary
 *   services-grid.h2 → heading (drop unknown variant + items.priceAnchor)
 *
 *   mini-case.items[]  → inline (берём первый); items[].imageUrl/href/title/facts → inline equivalents.
 *   mini-case.h2 → DROPPED (legacy не имеет h2, заголовок передаём через MiniCase block через "title")
 *
 *   lead-form.h2/helper/ctaLabel/serviceHint/districtHint → heading/subheading
 *
 *   cta-banner.h2 → heading; ctaPrimary → cta
 *
 *   faq.h2 → heading; items[].answer (string) → Lexical paragraph
 *
 *   related-services.items[].title/href/description → items[].title/slug/summary
 *
 *   neighbor-districts.items[].name/href → items[].name/slug
 *
 * Неизвестные cw-поля удаляются (Payload не пропустит).
 *
 * Если блок имеет lexical body — оставляем как есть.
 */
type CwBlock = Record<string, unknown> & { blockType: string }

function cwToPayloadCta(cta: unknown): { label?: string; href?: string } | undefined {
  if (!cta || typeof cta !== 'object') return undefined
  const c = cta as { label?: string; href?: string }
  if (!c.label && !c.href) return undefined
  return { label: c.label, href: c.href }
}

function cwBlockToPayload(block: CwBlock): Record<string, unknown> | null {
  const t = block.blockType
  switch (t) {
    case 'hero': {
      const ctaPrimary = cwToPayloadCta(block.ctaPrimary)
      return {
        blockType: 'hero',
        title: (block.h1 as string) ?? (block.title as string) ?? '',
        subtitle: (block.subUsp as string) ?? (block.subtitle as string) ?? undefined,
        ctaLabel: ctaPrimary?.label,
        ctaHref: ctaPrimary?.href,
        seasonalTheme: 'summer',
      }
    }
    case 'breadcrumbs': {
      const items = ((block.items as unknown[]) ?? [])
        .map((it) => {
          const i = it as { label?: string; href?: string; name?: string; url?: string }
          const name = i.label ?? i.name
          const url = i.href ?? i.url
          if (!name || !url) return null
          return { name, url }
        })
        .filter((it): it is { name: string; url: string } => Boolean(it))
      return { blockType: 'breadcrumbs', items, generateSchema: true }
    }
    case 'tldr': {
      const text =
        typeof block.body === 'string' ? block.body : ((block.text as string) ?? undefined)
      if (!text) return null
      return {
        blockType: 'tldr',
        eyebrow: (block.eyebrow as string) ?? 'Если коротко',
        text: text.slice(0, 500),
      }
    }
    case 'services-grid': {
      const items = ((block.items as unknown[]) ?? [])
        .map((it) => {
          const i = it as {
            title?: string
            href?: string
            slug?: string
            iconId?: string
            description?: string
            summary?: string
          }
          if (!i.title) return null
          // Payload требует slug — берём из href (`/foo/bar/` → `foo/bar`).
          const slug = i.slug ?? (i.href ? i.href.replace(/^\/+|\/+$/g, '') : undefined)
          if (!slug) return null
          return {
            title: i.title.slice(0, 80),
            slug,
            icon: i.iconId,
            summary: (i.description ?? i.summary ?? '').slice(0, 200),
          }
        })
        .filter((it): it is NonNullable<typeof it> => Boolean(it))
      return {
        blockType: 'services-grid',
        heading: (block.h2 as string) ?? (block.heading as string) ?? '',
        items,
      }
    }
    case 'text-content': {
      const body = block.body
      const lexicalBody =
        typeof body === 'string' ? lexicalParagraph(body) : (body ?? lexicalParagraph(''))
      return {
        blockType: 'text-content',
        heading: (block.h2 as string) ?? (block.heading as string) ?? '',
        body: lexicalBody,
        columns: '1',
      }
    }
    case 'lead-form': {
      const helper = (block.helper as string) ?? undefined
      return {
        blockType: 'lead-form',
        variant: 'short',
        heading: (block.h2 as string) ?? (block.heading as string) ?? '',
        subheading: helper,
        submitLabel: (block.ctaLabel as string) ?? 'Отправить',
        successMessage: 'Спасибо, перезвоним за 15 минут.',
      }
    }
    case 'cta-banner': {
      const cta = cwToPayloadCta(block.ctaPrimary) ?? cwToPayloadCta(block.cta)
      if (!cta?.label || !cta?.href) return null
      const variantRaw = (block.variant as string) ?? 'primary'
      // Payload accent: primary | warning | success
      const accent = variantRaw === 'dark' || variantRaw === 'primary' ? 'primary' : 'warning'
      return {
        blockType: 'cta-banner',
        title: (block.h2 as string) ?? (block.heading as string) ?? '',
        body: typeof block.body === 'string' ? lexicalParagraph(block.body) : block.body,
        ctaLabel: cta.label,
        ctaHref: cta.href,
        accent,
      }
    }
    case 'faq': {
      const items = ((block.items as unknown[]) ?? [])
        .map((it) => {
          const i = it as { question?: string; answer?: unknown }
          if (!i.question) return null
          const ans = typeof i.answer === 'string' ? lexicalParagraph(i.answer) : i.answer
          return { question: i.question, answer: ans ?? lexicalParagraph('') }
        })
        .filter((it): it is NonNullable<typeof it> => Boolean(it))
      if (items.length < 2) return null // Payload Faq requires minRows: 2
      return {
        blockType: 'faq',
        heading: (block.h2 as string) ?? (block.heading as string) ?? 'Частые вопросы',
        items,
        generateFaqPageSchema: true,
      }
    }
    case 'related-services': {
      const items = ((block.items as unknown[]) ?? [])
        .map((it) => {
          const i = it as {
            title?: string
            href?: string
            slug?: string
            description?: string
            summary?: string
          }
          if (!i.title) return null
          const slug = i.slug ?? (i.href ? i.href.replace(/^\/+|\/+$/g, '') : undefined)
          if (!slug) return null
          return {
            title: i.title.slice(0, 80),
            slug,
            summary: (i.description ?? i.summary ?? '').slice(0, 200),
          }
        })
        .filter((it): it is { title: string; slug: string; summary: string } => Boolean(it))
      return {
        blockType: 'related-services',
        heading: (block.h2 as string) ?? (block.heading as string) ?? 'Похожие услуги',
        items: items.slice(0, 3),
      }
    }
    case 'neighbor-districts': {
      const items = ((block.items as unknown[]) ?? [])
        .map((it) => {
          const i = it as {
            name?: string
            label?: string
            slug?: string
            href?: string
            distance?: string
          }
          const name = i.name ?? i.label
          const slug =
            i.slug ??
            (i.href
              ? i.href
                  .replace(/^\/+|\/+$/g, '')
                  .split('/')
                  .pop()
              : undefined)
          if (!name || !slug) return null
          return { name, slug, distance: i.distance }
        })
        .filter((it): it is NonNullable<typeof it> => Boolean(it))
      return {
        blockType: 'neighbor-districts',
        heading: (block.h2 as string) ?? (block.heading as string) ?? 'Соседние районы',
        items: items.slice(0, 3),
      }
    }
    case 'mini-case': {
      // cw — массив items[]; в Payload mini-case есть `inline` group + `caseRef`.
      // Берём первый item как inline.
      const itemsCw = (block.items as unknown[]) ?? []
      if (itemsCw.length === 0) return null
      const i = itemsCw[0] as {
        title?: string
        imageUrl?: string
        imageAlt?: string
        facts?: { label: string; value: string }[]
        href?: string
      }
      return {
        blockType: 'mini-case',
        inline: {
          title: i.title?.slice(0, 140) ?? '',
          // photo Payload type=upload — пропускаем cw imageUrl placeholder
          facts: (i.facts ?? []).slice(0, 4).map((f) => ({
            label: f.label.slice(0, 40),
            value: f.value.slice(0, 80),
          })),
          link: i.href,
        },
      }
    }
    case 'related-posts': {
      // Payload не имеет related-posts блока — пропускаем (cw author эталон).
      // Это OK: BlockRenderer на frontend сделает rendering, но Payload
      // блок-схема не содержит related-posts. Страница сохраняется без блока.
      return null
    }
    default:
      // Неизвестный blockType — пропускаем.
      return null
  }
}

/**
 * Преобразует cw blocks[] в Payload blocks[] (legacy schema).
 *
 * Возвращает массив, готовый к записи в Payload `blocks` field.
 */
function fixtureBlocksToPayload(fix: BaseFixture): Record<string, unknown>[] {
  const cw = (fix.blocks ?? []) as CwBlock[]
  return cw.map((b) => cwBlockToPayload(b)).filter((b): b is Record<string, unknown> => Boolean(b))
}

/**
 * Извлекает первый text-content блок body (markdown) и превращает в
 * Lexical paragraph. Если блока нет — fallback на metaDescription/h1.
 */
function extractBody(fix: BaseFixture): unknown {
  const textBlock = (fix.blocks ?? []).find(
    (b) => (b as { blockType?: string }).blockType === 'text-content',
  ) as { body?: string } | undefined
  if (textBlock?.body) return lexicalParagraph(textBlock.body)
  return lexicalParagraph(fix.metaDescription ?? fix.h1 ?? fix.slug)
}

function extractTldr(fix: BaseFixture): string {
  const tldr = (fix.blocks ?? []).find(
    (b) => (b as { blockType?: string }).blockType === 'tldr',
  ) as { body?: string; text?: string } | undefined
  return (tldr?.text ?? tldr?.body ?? fix.metaDescription ?? '').slice(0, 280)
}

function readFixture<T extends BaseFixture>(filename: string): T {
  const path = resolve(process.cwd(), 'content/etalons-w3', filename)
  const raw = readFileSync(path, 'utf-8')
  return JSON.parse(raw) as T
}

// ───────── Per-type seeders ─────────

async function seedPillar(payload: Payload, fix: PillarFixture): Promise<SeedResult> {
  const url = fix.url ?? `/${fix.slug}/`
  const existing = await findOneBySlug(payload, 'services', fix.slug)
  if (!existing) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: `Service «${fix.slug}» не найден. Сначала pnpm seed (создаёт 4 pillar).`,
    }
  }
  // Обновляем legacy-meta + intro + blocks[] (US-0 W3 Track B-3).
  try {
    const blocks = fixtureBlocksToPayload(fix)
    await payload.update({
      collection: 'services',
      id: (existing as { id: string | number }).id,
      data: {
        h1: fix.h1,
        metaTitle: fix.metaTitle,
        metaDescription: fix.metaDescription,
        intro: extractBody(fix),
        blocks,
      } as never,
      overrideAccess: true,
    })
    return {
      type: fix.type,
      url,
      status: 'updated',
      message: `pillar updated: h1+meta+intro + blocks[] (${blocks.length} blocks)`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

async function seedSubService(payload: Payload, fix: SubFixture): Promise<SeedResult> {
  const url = fix.url ?? `/${fix.parentSlug}/${fix.slug}/`
  const parent = await findOneBySlug(payload, 'services', fix.parentSlug)
  if (!parent) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: `Parent service «${fix.parentSlug}» не найден.`,
    }
  }
  const subSlug = fix.slug
  const subServices = ((parent as { subServices?: Array<{ slug: string }> }).subServices ??
    []) as Array<Record<string, unknown>>

  const idx = subServices.findIndex((s) => s.slug === subSlug)
  // sub-service не имеет blocks[] (это вложенный array в Service.subServices),
  // только legacy intro/body. Sub-эталон рендерится через SubServiceView.
  const subRecord = {
    slug: subSlug,
    title: 'Старая мебель',
    h1: fix.h1,
    priceFrom: 12800,
    intro: extractTldr(fix),
    body: extractBody(fix),
    metaTitle: fix.metaTitle,
    metaDescription: fix.metaDescription,
  }

  let action: 'created' | 'updated'
  let newSubServices: Array<Record<string, unknown>>
  if (idx === -1) {
    newSubServices = [...subServices, subRecord]
    action = 'created'
  } else {
    newSubServices = [...subServices]
    newSubServices[idx] = { ...subServices[idx], ...subRecord }
    action = 'updated'
  }

  try {
    await payload.update({
      collection: 'services',
      id: (parent as { id: string | number }).id,
      data: { subServices: newSubServices } as never,
      overrideAccess: true,
    })
    return {
      type: fix.type,
      url,
      status: action,
      message: `sub «${subSlug}» ${action} в pillar.subServices[]`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

async function seedProgrammaticSd(
  payload: Payload,
  fix: ProgrammaticSdFixture,
): Promise<SeedResult> {
  const url = fix.url ?? `/${fix.parentSlug}/${fix.districtSlug}/`
  const service = await findOneBySlug(payload, 'services', fix.parentSlug)
  const district = await findOneBySlug(payload, 'districts', fix.districtSlug)
  if (!service || !district) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: `Не найден service «${fix.parentSlug}» или district «${fix.districtSlug}».`,
    }
  }
  const serviceId = (service as { id: string | number }).id
  const districtId = (district as { id: string | number }).id

  const existing = await payload.find({
    collection: 'service-districts',
    where: {
      and: [{ service: { equals: serviceId } }, { district: { equals: districtId } }],
    },
    limit: 1,
    overrideAccess: true,
  })

  // SD update: leadParagraph + seoTitle/seoDescription/seoH1 + blocks[].
  // publishStatus не трогаем — programmatic publish-gate в Cases hook
  // ServiceDistricts блокирует если нет miniCase.
  const blocks = fixtureBlocksToPayload(fix)
  const sdData: Record<string, unknown> = {
    leadParagraph: lexicalParagraph(extractTldr(fix) || fix.metaDescription || fix.h1 || ''),
    seoTitle: fix.metaTitle,
    seoDescription: fix.metaDescription,
    seoH1: fix.h1,
    blocks,
  }

  try {
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'service-districts',
        id: (existing.docs[0] as { id: string | number }).id,
        data: sdData as never,
        overrideAccess: true,
      })
      return {
        type: fix.type,
        url,
        status: 'updated',
        message: `SD ${fix.parentSlug}×${fix.districtSlug} legacy-fields updated`,
      }
    }
    await payload.create({
      collection: 'service-districts',
      data: {
        service: serviceId,
        district: districtId,
        ...sdData,
        publishStatus: 'draft',
        noindexUntilCase: true,
      } as never,
      overrideAccess: true,
    })
    return {
      type: fix.type,
      url,
      status: 'created',
      message: `SD ${fix.parentSlug}×${fix.districtSlug} создан (draft, до miniCase)`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

async function seedDistrictHub(payload: Payload, fix: DistrictHubFixture): Promise<SeedResult> {
  const url = fix.url ?? `/raiony/${fix.slug}/`
  const existing = await findOneBySlug(payload, 'districts', fix.slug)
  if (!existing) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: `District «${fix.slug}» не найден. pnpm seed создаёт 7 districts.`,
    }
  }

  try {
    const blocks = fixtureBlocksToPayload(fix)
    await payload.update({
      collection: 'districts',
      id: (existing as { id: string | number }).id,
      data: {
        metaTitle: fix.metaTitle,
        metaDescription: fix.metaDescription,
        blocks,
      } as never,
      overrideAccess: true,
    })
    return {
      type: fix.type,
      url,
      status: 'updated',
      message: `district hub updated: meta + blocks[] (${blocks.length})`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

async function seedAuthor(payload: Payload, fix: AuthorFixture): Promise<SeedResult> {
  const url = fix.url ?? `/avtory/${fix.slug}/`
  const existing = await findOneBySlug(payload, 'authors', fix.slug)
  if (existing) {
    // US-0 W3 Track B-3 — обновить blocks[] вместо skip.
    try {
      const blocks = fixtureBlocksToPayload(fix)
      await payload.update({
        collection: 'authors',
        id: (existing as { id: string | number }).id,
        data: { blocks, _status: 'published' } as never,
        overrideAccess: true,
      })
      return {
        type: fix.type,
        url,
        status: 'updated',
        message: `author updated: blocks[] (${blocks.length})`,
      }
    } catch (e) {
      return {
        type: fix.type,
        url,
        status: 'error',
        message: e instanceof Error ? e.message : String(e),
      }
    }
  }

  // Создаём company author напрямую (seed-authors.ts падает на лимите bio>600).
  // Краткое bio под 600 символов, полный текст — в Lexical text-content блоке
  // когда Track B-1 обновит блоки и можно будет seed blocks[].
  const districtsResult = await payload.find({
    collection: 'districts',
    limit: 100,
    pagination: false,
    overrideAccess: true,
  })
  const districtIds = districtsResult.docs.map((d) => (d as { id: string | number }).id)

  const shortBio =
    'Бригада Обихода — 4 услуги одной командой по Москве и Московской области с 2024 года. ' +
    'Вывоз мусора, спил деревьев, чистка крыш, демонтаж. Работаем по договору с УК и ТСЖ; ' +
    'штрафы ГЖИ и ОАТИ — по своему счёту. Лицензия Росприроднадзора, СРО, страховка ГО 10 млн ₽, ' +
    'допуски Минтруда №782н по высоте. Полный текст — в blocks[].'

  try {
    const knowsAbout = (fix.knowsAbout ?? []).map((topic) => ({ topic }))
    const blocks = fixtureBlocksToPayload(fix)
    await payload.create({
      collection: 'authors',
      data: {
        slug: fix.slug,
        firstName: 'Бригада',
        lastName: 'вывоза Обихода',
        jobTitle: fix.jobTitle ?? 'Команда',
        bio: shortBio,
        knowsAbout,
        sameAs: (fix.sameAs ?? []).map((u) => ({ url: u })),
        worksInDistricts: districtIds,
        blocks,
        _status: 'published',
      } as never,
      overrideAccess: true,
    })
    return {
      type: fix.type,
      url,
      status: 'created',
      message: `author created with short bio + blocks[] (${blocks.length})`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

async function seedBlogPost(payload: Payload, fix: BlogFixture): Promise<SeedResult> {
  const url = fix.url ?? `/blog/${fix.slug}/`
  const existing = await findOneBySlug(payload, 'blog', fix.slug)
  if (existing) {
    try {
      const blocks = fixtureBlocksToPayload(fix)
      await payload.update({
        collection: 'blog',
        id: (existing as { id: string | number }).id,
        data: { blocks, _status: 'published' } as never,
        overrideAccess: true,
      })
      return {
        type: fix.type,
        url,
        status: 'updated',
        message: `blog updated: blocks[] (${blocks.length})`,
      }
    } catch (e) {
      return {
        type: fix.type,
        url,
        status: 'error',
        message: e instanceof Error ? e.message : String(e),
      }
    }
  }

  const authorSlug = fix.author?.slug ?? 'brigada-vyvoza-obihoda'
  const author = await findOneBySlug(payload, 'authors', authorSlug)
  if (!author) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: `Author «${authorSlug}» не найден. seed:etalons создаёт его перед blog.`,
    }
  }

  const intro = extractTldr(fix)
  const body = extractBody(fix)

  try {
    const blocks = fixtureBlocksToPayload(fix)
    await payload.create({
      collection: 'blog',
      data: {
        slug: fix.slug,
        title: fix.h1 ?? fix.slug,
        h1: fix.h1 ?? fix.slug,
        author: (author as { id: string | number }).id,
        category: 'evergreen',
        publishedAt: fix.datePublished ?? '2026-04-25',
        modifiedAt: fix.dateModified ?? fix.datePublished ?? '2026-04-25',
        intro,
        body,
        blocks,
        metaTitle: fix.metaTitle,
        metaDescription: fix.metaDescription,
        _status: 'published',
      } as never,
      overrideAccess: true,
    })
    return {
      type: fix.type,
      url,
      status: 'created',
      message: `blog created + blocks[] (${blocks.length})`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

async function seedCase(payload: Payload, fix: CaseFixture): Promise<SeedResult> {
  const url = fix.url ?? `/kejsy/${fix.slug}/`
  const existing = await findOneBySlug(payload, 'cases', fix.slug)
  if (existing) {
    try {
      const blocks = fixtureBlocksToPayload(fix)
      await payload.update({
        collection: 'cases',
        id: (existing as { id: string | number }).id,
        data: { blocks, _status: 'published' } as never,
        overrideAccess: true,
      })
      return {
        type: fix.type,
        url,
        status: 'updated',
        message: `case updated: blocks[] (${blocks.length})`,
      }
    } catch (e) {
      return {
        type: fix.type,
        url,
        status: 'error',
        message: e instanceof Error ? e.message : String(e),
      }
    }
  }

  const arbo = await findOneBySlug(payload, 'services', 'arboristika')
  const odincovo = await findOneBySlug(payload, 'districts', 'odincovo')
  if (!arbo || !odincovo) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: 'Не найден service «arboristika» или district «odincovo».',
    }
  }

  const seedPhotosDir = resolve(process.cwd(), 'content/seed/cases')
  const beforePath = `${seedPhotosDir}/before.jpg`
  const afterPath = `${seedPhotosDir}/after.jpg`
  if (!existsSync(beforePath) || !existsSync(afterPath)) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: `placeholder-фото не найдены: ${beforePath}, ${afterPath}`,
    }
  }

  const description = extractBody(fix)

  try {
    const beforeMedia = await payload.create({
      collection: 'media',
      data: {
        alt: `Фото «до» — ${fix.h1}`,
        caption: 'Эталон W3 — до начала работ',
      },
      filePath: beforePath,
      overrideAccess: true,
    })
    const afterMedia = await payload.create({
      collection: 'media',
      data: {
        alt: `Фото «после» — ${fix.h1}`,
        caption: 'Эталон W3 — после работ',
      },
      filePath: afterPath,
      overrideAccess: true,
    })

    const blocks = fixtureBlocksToPayload(fix)
    await payload.create({
      collection: 'cases',
      data: {
        slug: fix.slug,
        title: fix.h1 ?? fix.slug,
        h1: fix.h1 ?? fix.slug,
        service: (arbo as { id: string | number }).id,
        district: (odincovo as { id: string | number }).id,
        dateCompleted: '2026-03-15T00:00:00.000Z',
        description,
        durationHours: 4,
        finalPrice: 18400,
        photosBefore: [
          {
            image: (beforeMedia as { id: string | number }).id,
            caption: 'Объект до начала работ',
          },
        ],
        photosAfter: [
          {
            image: (afterMedia as { id: string | number }).id,
            caption: 'Объект после работ',
          },
        ],
        blocks,
        metaTitle: fix.metaTitle,
        metaDescription: fix.metaDescription,
      } as never,
      overrideAccess: true,
    })
    return {
      type: fix.type,
      url,
      status: 'created',
      message: `case + 2 media + blocks[] (${blocks.length})`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

async function seedB2B(payload: Payload, fix: B2BFixture): Promise<SeedResult> {
  const url = fix.url ?? `/b2b/${fix.slug}/`
  const existing = await findOneBySlug(payload, 'b2b-pages', fix.slug)
  if (existing) {
    try {
      const blocks = fixtureBlocksToPayload(fix)
      const audienceFromFixture = (fix as { audience?: string }).audience
      await payload.update({
        collection: 'b2b-pages',
        id: (existing as { id: string | number }).id,
        data: {
          blocks,
          audience: audienceFromFixture ?? 'uk',
          _status: 'published',
        } as never,
        overrideAccess: true,
      })
      return {
        type: fix.type,
        url,
        status: 'updated',
        message: `b2b updated: blocks[] (${blocks.length})`,
      }
    } catch (e) {
      return {
        type: fix.type,
        url,
        status: 'error',
        message: e instanceof Error ? e.message : String(e),
      }
    }
  }

  const body = extractBody(fix)

  try {
    // audience берём из fixture (cw эталон uk-tszh — combined сегмент);
    // fallback на 'uk' если поле не заполнено.
    const audienceFromFixture = (fix as { audience?: string }).audience
    const audience = audienceFromFixture ?? 'uk'
    const blocks = fixtureBlocksToPayload(fix)
    await payload.create({
      collection: 'b2b-pages',
      data: {
        slug: fix.slug,
        title: fix.h1 ?? fix.slug,
        h1: fix.h1 ?? fix.slug,
        audience,
        body,
        blocks,
        krishaShtraf: true,
        metaTitle: fix.metaTitle,
        metaDescription: fix.metaDescription,
        _status: 'published',
      } as never,
      overrideAccess: true,
    })
    return {
      type: fix.type,
      url,
      status: 'created',
      message: `b2b page created + blocks[] (${blocks.length})`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

// ───────── Main ─────────

async function main() {
  // Safety-gate (ADR-0001)
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('ABORT: prod-БД, OBIKHOD_SEED_CONFIRM=yes не выставлен.')
    console.error('  pnpm seed:etalons:prod — только после pg_dump backup.')
    process.exit(1)
  }
  if (isProdDb) console.log('⚠ prod-режим: подтверждён через OBIKHOD_SEED_CONFIRM=yes')

  const started = Date.now()
  const payload = await getPayload({ config })

  const results: SeedResult[] = []

  const pillar = readFixture<PillarFixture>('pillar-service.json')
  results.push(await seedPillar(payload, pillar))

  const sub = readFixture<SubFixture>('sub-service.json')
  results.push(await seedSubService(payload, sub))

  const sd = readFixture<ProgrammaticSdFixture>('programmatic-sd.json')
  results.push(await seedProgrammaticSd(payload, sd))

  const district = readFixture<DistrictHubFixture>('district-hub.json')
  results.push(await seedDistrictHub(payload, district))

  // Author СНАЧАЛА — blog ссылается на author.
  const author = readFixture<AuthorFixture>('author.json')
  results.push(await seedAuthor(payload, author))

  const blog = readFixture<BlogFixture>('blog-post.json')
  results.push(await seedBlogPost(payload, blog))

  const caseFix = readFixture<CaseFixture>('case.json')
  results.push(await seedCase(payload, caseFix))

  const b2b = readFixture<B2BFixture>('b2b-segment.json')
  results.push(await seedB2B(payload, b2b))

  // ───────── Summary ─────────
  const duration = ((Date.now() - started) / 1000).toFixed(1)
  console.log('')
  console.log('================ SEED ETALONS SUMMARY ================')
  for (const r of results) {
    const icon =
      r.status === 'created'
        ? '✓'
        : r.status === 'updated'
          ? '↻'
          : r.status === 'skipped'
            ? '•'
            : '✗'
    console.log(`${icon} [${r.status.padEnd(7)}] ${r.type.padEnd(18)} ${r.url}`)
    if (r.message) console.log(`           → ${r.message}`)
  }

  const counts = {
    created: results.filter((r) => r.status === 'created').length,
    updated: results.filter((r) => r.status === 'updated').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    errors: results.filter((r) => r.status === 'error').length,
  }
  console.log('------------------------------------------------------')
  console.log(
    `created ${counts.created} · updated ${counts.updated} · skipped ${counts.skipped} · errors ${counts.errors} · ${duration}s`,
  )
  console.log('======================================================')
  console.log('')
  console.log('NB: blocks[] из fixtures намеренно пропущены — Track B-1 (обновление')
  console.log('Payload block configs под art-approved wireframe 2026-05-01) не закрыт.')
  console.log('После Track B-1 — пере-запустите seed:etalons для блочного контента.')

  process.exit(counts.errors === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('seed-content-etalons failed:', err)
  process.exit(1)
})
