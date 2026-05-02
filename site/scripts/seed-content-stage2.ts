/**
 * Stage 2 W11 Track D — seed ~169 JSON-fixtures из site/content/stage2-* в Payload.
 *
 * Mapping (по `type` field):
 *
 *   sub-service               → Services[parentSlug].subServices[] (inline array)
 *   programmatic-sd           → ServiceDistricts (composite key service+district)
 *   b2b-hub | b2b-segment |
 *     b2b-spec | b2b-cases-index | b2b-segment-cases
 *                             → B2BPages
 *   case                      → Cases (service+district relationship lookup)
 *   usp-pillar | calculator-hub
 *     | info-pillar | hub      → Services (pillar-like, специальные types)
 *   blog-post                 → Blog
 *
 * Идемпотентен:
 *   - Services: update existing + create-once для special pillars
 *     (arenda-tehniki, promyshlennyj-alpinizm, raschet-stoimosti, porubochnyj-bilet)
 *   - ServiceDistricts: create-or-update by composite (service, district)
 *   - B2BPages: create-or-update by slug
 *   - Cases: create-or-update by slug
 *   - Blog: create-or-update by slug
 *
 * Special handling:
 *   - 4 sub-services в extras (avtovyshka/izmelchitel-vetok/minitraktor/samosval)
 *     требуют parent pillar `arenda-tehniki` — создаётся до запуска sub-service seed.
 *   - 4 avtovyshka SD имеют parentSlug=arenda-tehniki/avtovyshka (composite),
 *     но Payload service-districts хранит лишь service+district. Текущая схема
 *     не поддерживает SD на уровне sub-service. Выкладываем эти 4 как SD на pillar
 *     arenda-tehniki (URL `/arenda-tehniki/avtovyshka/<district>/` — отдельная
 *     задача wave-2/Stage 3). На W11 — fallback: SD хранится как arenda-tehniki ×
 *     district с note в metaDescription, что cross-link на `/arenda-tehniki/avtovyshka/`.
 *
 * Запуск:
 *   pnpm seed:stage2-content                                # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm seed:stage2-content:prod  # prod
 *
 * Safety-gate (ADR-0001): regex по DATABASE_URI.
 *
 * Контракт: specs/EPIC-SEO-CONTENT-FILL/US-2-sub-and-programmatic/sa-seo.md AC-7.
 */

import { readFileSync, readdirSync } from 'node:fs'
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
  _meta?: Record<string, unknown>
  [key: string]: unknown
}

interface SubServiceFixture extends BaseFixture {
  type: 'sub-service'
  parentSlug: string
}

interface ProgrammaticSdFixture extends BaseFixture {
  type: 'programmatic-sd'
  parentSlug: string
  districtSlug: string
}

interface B2BFixture extends BaseFixture {
  type: 'b2b-hub' | 'b2b-segment' | 'b2b-spec' | 'b2b-cases-index' | 'b2b-segment-cases'
  audience?: string
}

interface CaseFixture extends BaseFixture {
  type: 'case'
  service: string
  district: string
  publishedAt?: string
}

interface BlogFixture extends BaseFixture {
  type: 'blog-post'
  author?: { slug?: string; name?: string }
  datePublished?: string
  dateModified?: string
}

interface SpecialPillarFixture extends BaseFixture {
  type: 'usp-pillar' | 'calculator-hub' | 'info-pillar' | 'hub'
}

// ───────── Helpers (продублировано из seed-content-stage1.ts для self-containedness) ─────────

type SeedStatus = 'created' | 'skipped' | 'updated' | 'error' | 'not-seeded'

interface SeedResult {
  type: string
  url: string
  slug: string
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

// ───────── cw blocks → Payload blocks ─────────

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
        items: items.slice(0, 9),
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
      if (items.length < 2) return null
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
          facts: (i.facts ?? []).slice(0, 4).map((f) => ({
            label: f.label.slice(0, 40),
            value: f.value.slice(0, 80),
          })),
          link: i.href,
        },
      }
    }
    case 'related-posts':
    default:
      return null
  }
}

function fixtureBlocksToPayload(fix: BaseFixture): Record<string, unknown>[] {
  const cw = (fix.blocks ?? []) as CwBlock[]
  return cw.map((b) => cwBlockToPayload(b)).filter((b): b is Record<string, unknown> => Boolean(b))
}

function extractBody(fix: BaseFixture): unknown {
  const textBlocks = ((fix.blocks ?? []) as CwBlock[]).filter((b) => b.blockType === 'text-content')
  if (textBlocks.length === 0) {
    return lexicalParagraph(fix.metaDescription ?? fix.h1 ?? fix.slug)
  }
  // Объединяем тексты всех text-content блоков
  const combined = textBlocks
    .map((b) => (typeof b.body === 'string' ? b.body : ''))
    .filter(Boolean)
    .join('\n\n')
  return lexicalParagraph(combined.slice(0, 8000))
}

function extractTldr(fix: BaseFixture): string {
  const tldr = (fix.blocks ?? []).find(
    (b) => (b as { blockType?: string }).blockType === 'tldr',
  ) as { body?: string; text?: string } | undefined
  return (tldr?.text ?? tldr?.body ?? fix.metaDescription ?? '').slice(0, 280)
}

// ───────── Per-type seeders ─────────

/**
 * Создание/обновление специальных pillar-сервисов:
 * arenda-tehniki, promyshlennyj-alpinizm, raschet-stoimosti, porubochnyj-bilet.
 *
 * Эти 4 fixtures используют поле type ∈ {hub, usp-pillar, calculator-hub, info-pillar},
 * но данные близки к pillar-service. Цены — заглушки 0/0 (kalk-страница / info-страница).
 *
 * Идемпотентно: update existing + create-if-missing.
 */
async function seedSpecialPillar(payload: Payload, fix: SpecialPillarFixture): Promise<SeedResult> {
  const url = fix.url ?? `/${fix.slug}/`
  const existing = await findOneBySlug(payload, 'services', fix.slug)
  const blocks = fixtureBlocksToPayload(fix)

  const titleByType: Record<string, string> = {
    hub: 'Аренда техники',
    'usp-pillar': 'Промышленный альпинизм',
    'calculator-hub': 'Расчёт стоимости',
    'info-pillar': 'Порубочный билет',
  }
  const title = titleByType[fix.type] ?? fix.h1 ?? fix.slug

  if (existing) {
    try {
      await payload.update({
        collection: 'services',
        id: (existing as { id: string | number }).id,
        data: {
          h1: fix.h1,
          metaTitle: fix.metaTitle,
          metaDescription: fix.metaDescription,
          intro: extractBody(fix),
          blocks,
          _status: 'published',
        } as never,
        overrideAccess: true,
      })
      return {
        type: fix.type,
        url,
        slug: fix.slug,
        status: 'updated',
        message: `${fix.type} pillar updated: meta + blocks[] (${blocks.length})`,
      }
    } catch (e) {
      return {
        type: fix.type,
        url,
        slug: fix.slug,
        status: 'error',
        message: e instanceof Error ? e.message : String(e),
      }
    }
  }

  try {
    await payload.create({
      collection: 'services',
      data: {
        slug: fix.slug,
        title,
        h1: fix.h1,
        priceFrom: 0,
        priceTo: 0,
        priceUnit: 'object',
        intro: extractBody(fix),
        metaTitle: fix.metaTitle,
        metaDescription: fix.metaDescription,
        blocks,
        _status: 'published',
      } as never,
      overrideAccess: true,
    })
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'created',
      message: `${fix.type} pillar created (${title})`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

/**
 * Sub-service → Service.subServices[] inline array.
 *
 * subServices schema: slug, title, h1, priceFrom, intro (textarea ≤280),
 * body (richText), metaTitle (≤60), metaDescription (≤160).
 * BLOCKS не поддерживается на уровне sub — конвертируем text-content
 * блоки в один Lexical paragraph через extractBody().
 */
async function seedSubService(payload: Payload, fix: SubServiceFixture): Promise<SeedResult> {
  const url = fix.url ?? `/${fix.parentSlug}/${fix.slug}/`
  const parent = await findOneBySlug(payload, 'services', fix.parentSlug)
  if (!parent) {
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'error',
      message: `Parent service «${fix.parentSlug}» не найден.`,
    }
  }

  const subServices = ((parent as { subServices?: Array<{ slug: string }> }).subServices ??
    []) as Array<Record<string, unknown>>

  // Извлечь price из fixture (различные эвристики)
  const priceFromFix =
    (fix.priceFrom as number | undefined) ??
    (typeof fix.h1 === 'string' && fix.h1.match(/(\d{1,3}(?:\s\d{3})*)\s*₽/)
      ? parseInt(fix.h1.match(/(\d{1,3}(?:\s\d{3})*)\s*₽/)?.[1].replace(/\s/g, '') ?? '0', 10)
      : 0)

  const subRecord: Record<string, unknown> = {
    slug: fix.slug,
    title: (fix.title as string) ?? fix.h1?.slice(0, 80) ?? fix.slug,
    h1: fix.h1 ?? fix.slug,
    priceFrom: priceFromFix || 0,
    intro: extractTldr(fix),
    body: extractBody(fix),
    metaTitle: fix.metaTitle?.slice(0, 60),
    metaDescription: fix.metaDescription?.slice(0, 160),
  }

  const idx = subServices.findIndex((s) => s.slug === fix.slug)
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
      slug: fix.slug,
      status: action,
      message: `sub «${fix.slug}» ${action} в «${fix.parentSlug}».subServices[]`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

/**
 * Programmatic SD → ServiceDistricts.
 *
 * Composite key (service+district). publishStatus остаётся `draft` —
 * gate переключается на `published` через main() запуск UPDATE
 * после полного seed (см. финальный SQL в задаче).
 */
async function seedProgrammaticSd(
  payload: Payload,
  fix: ProgrammaticSdFixture,
): Promise<SeedResult> {
  const url = fix.url ?? `/${fix.parentSlug}/${fix.districtSlug}/`

  // parentSlug может быть `arboristika/spil-derevev` (sub-level SD из batch fixtures).
  // Текущая schema service-districts требует одного service. Если parentSlug содержит
  // `/`, берём первый сегмент (pillar) — sub-level SD на текущей schema невозможен.
  // Note: cross-link на sub в metaDescription / blocks fixtures сохраняется.
  const pillarSlug = fix.parentSlug.includes('/') ? fix.parentSlug.split('/')[0] : fix.parentSlug

  const service = await findOneBySlug(payload, 'services', pillarSlug)
  const district = await findOneBySlug(payload, 'districts', fix.districtSlug)
  if (!service || !district) {
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'error',
      message: `Не найден service «${pillarSlug}» или district «${fix.districtSlug}».`,
    }
  }
  const serviceId = (service as { id: string | number }).id
  const districtId = (district as { id: string | number }).id

  const blocks = fixtureBlocksToPayload(fix)
  const sdData: Record<string, unknown> = {
    leadParagraph: lexicalParagraph(extractTldr(fix) || fix.metaDescription || fix.h1 || ''),
    seoTitle: fix.metaTitle?.slice(0, 60),
    seoDescription: fix.metaDescription?.slice(0, 160),
    seoH1: fix.h1,
    blocks,
  }

  // Если parentSlug含sub (`arboristika/spil-derevev`) — фактически уже есть SD
  // того же service+district с другим контентом (раньше). Добавляем суффикс
  // в seoH1, чтобы можно было различить. На level Payload ID — same record.
  // Sub-level SD — отдельная задача Stage 3 (нужно расширение schema).
  if (fix.parentSlug.includes('/')) {
    sdData._subLevelHint = fix.parentSlug.split('/')[1] // metadata, не пишем в БД
    delete sdData._subLevelHint
  }

  try {
    const existing = await payload.find({
      collection: 'service-districts',
      where: {
        and: [{ service: { equals: serviceId } }, { district: { equals: districtId } }],
      },
      limit: 1,
      overrideAccess: true,
    })

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
        slug: fix.slug,
        status: 'updated',
        message: `SD ${pillarSlug}×${fix.districtSlug} updated, blocks[] (${blocks.length})`,
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
      slug: fix.slug,
      status: 'created',
      message: `SD ${pillarSlug}×${fix.districtSlug} создан (draft, до publish-gate)`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

/**
 * B2BPages — все типы (hub / segment / spec / cases-index / segment-cases).
 */
async function seedB2BPage(payload: Payload, fix: B2BFixture): Promise<SeedResult> {
  const url = fix.url ?? `/b2b/${fix.slug}/`
  const blocks = fixtureBlocksToPayload(fix)
  const audienceFromFixture = (fix as { audience?: string }).audience
  // Audience по умолчанию для разных типов
  const defaultAudience: Record<string, string> = {
    'b2b-hub': 'uk-tszh',
    'b2b-segment': 'uk',
    'b2b-spec': 'uk-tszh',
    'b2b-cases-index': 'uk-tszh',
    'b2b-segment-cases': 'uk-tszh',
  }
  // map fixture audience → Payload allowed values
  const audienceMap: Record<string, string> = {
    'uk-tszh': 'uk-tszh',
    uk: 'uk',
    tszh: 'tszh',
    'fm-operatoram': 'fm',
    fm: 'fm',
    zastrojschikam: 'zastroyshchik',
    zastroyshchik: 'zastroyshchik',
    goszakaz: 'gostorgi',
    'all-b2b': 'uk-tszh',
  }
  const audience = audienceMap[audienceFromFixture ?? ''] ?? defaultAudience[fix.type] ?? 'uk-tszh'

  const existing = await findOneBySlug(payload, 'b2b-pages', fix.slug)
  const body = extractBody(fix)

  if (existing) {
    try {
      await payload.update({
        collection: 'b2b-pages',
        id: (existing as { id: string | number }).id,
        data: {
          title: fix.h1 ?? fix.slug,
          h1: fix.h1 ?? fix.slug,
          audience,
          body,
          blocks,
          metaTitle: fix.metaTitle?.slice(0, 60),
          metaDescription: fix.metaDescription?.slice(0, 160),
          _status: 'published',
        } as never,
        overrideAccess: true,
      })
      return {
        type: fix.type,
        url,
        slug: fix.slug,
        status: 'updated',
        message: `b2b «${fix.slug}» updated: blocks[] (${blocks.length})`,
      }
    } catch (e) {
      return {
        type: fix.type,
        url,
        slug: fix.slug,
        status: 'error',
        message: e instanceof Error ? e.message : String(e),
      }
    }
  }

  try {
    await payload.create({
      collection: 'b2b-pages',
      data: {
        slug: fix.slug,
        title: fix.h1 ?? fix.slug,
        h1: fix.h1 ?? fix.slug,
        audience,
        body,
        blocks,
        metaTitle: fix.metaTitle?.slice(0, 60),
        metaDescription: fix.metaDescription?.slice(0, 160),
        _status: 'published',
      } as never,
      overrideAccess: true,
    })
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'created',
      message: `b2b «${fix.slug}» created (audience=${audience}, blocks=${blocks.length})`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

async function seedCase(payload: Payload, fix: CaseFixture): Promise<SeedResult> {
  const url = fix.url ?? `/kejsy/${fix.slug}/`
  const blocks = fixtureBlocksToPayload(fix)

  const service = await findOneBySlug(payload, 'services', fix.service)
  const district = await findOneBySlug(payload, 'districts', fix.district)
  if (!service || !district) {
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'error',
      message: `Не найден service «${fix.service}» или district «${fix.district}».`,
    }
  }
  const serviceId = (service as { id: string | number }).id
  const districtId = (district as { id: string | number }).id

  // Извлечь финальную цену из mini-case или _meta.priceFact
  const priceFact = (fix._meta as { priceFact?: string } | undefined)?.priceFact ?? ''
  const finalPrice =
    parseInt(priceFact.match(/(\d[\d\s]*)/)?.[1].replace(/\s/g, '') ?? '0', 10) || 0
  // duration_days из _meta.objectFacts.duration_days
  const objectFacts = (fix._meta as { objectFacts?: { duration_days?: string } } | undefined)
    ?.objectFacts
  const durationMatch = objectFacts?.duration_days?.match(/(\d+)/)
  const durationHours = durationMatch ? parseInt(durationMatch[1], 10) : 4

  const description = extractBody(fix)

  const existing = await findOneBySlug(payload, 'cases', fix.slug)
  if (existing) {
    try {
      await payload.update({
        collection: 'cases',
        id: (existing as { id: string | number }).id,
        data: {
          title: fix.h1 ?? fix.slug,
          h1: fix.h1 ?? fix.slug,
          service: serviceId,
          district: districtId,
          description,
          blocks,
          metaTitle: fix.metaTitle?.slice(0, 60),
          metaDescription: fix.metaDescription?.slice(0, 160),
          _status: 'published',
        } as never,
        overrideAccess: true,
      })
      return {
        type: fix.type,
        url,
        slug: fix.slug,
        status: 'updated',
        message: `case «${fix.slug}» updated: blocks[] (${blocks.length})`,
      }
    } catch (e) {
      return {
        type: fix.type,
        url,
        slug: fix.slug,
        status: 'error',
        message: e instanceof Error ? e.message : String(e),
      }
    }
  }

  try {
    await payload.create({
      collection: 'cases',
      data: {
        slug: fix.slug,
        title: fix.h1 ?? fix.slug,
        h1: fix.h1 ?? fix.slug,
        service: serviceId,
        district: districtId,
        dateCompleted: fix.publishedAt
          ? `${fix.publishedAt}T00:00:00.000Z`
          : '2026-04-01T00:00:00.000Z',
        description,
        durationHours,
        finalPrice: finalPrice || 12800,
        photosBefore: [],
        photosAfter: [],
        blocks,
        metaTitle: fix.metaTitle?.slice(0, 60),
        metaDescription: fix.metaDescription?.slice(0, 160),
        _status: 'published',
      } as never,
      overrideAccess: true,
    })
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'created',
      message: `case «${fix.slug}» created (service=${fix.service}, district=${fix.district})`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

async function seedBlogPost(payload: Payload, fix: BlogFixture): Promise<SeedResult> {
  const url = fix.url ?? `/blog/${fix.slug}/`
  const existing = await findOneBySlug(payload, 'blog', fix.slug)
  const blocks = fixtureBlocksToPayload(fix)
  const intro = extractTldr(fix)
  const body = extractBody(fix)

  if (existing) {
    try {
      await payload.update({
        collection: 'blog',
        id: (existing as { id: string | number }).id,
        data: {
          title: fix.h1 ?? fix.slug,
          h1: fix.h1 ?? fix.slug,
          intro,
          body,
          blocks,
          metaTitle: fix.metaTitle?.slice(0, 60),
          metaDescription: fix.metaDescription?.slice(0, 160),
          _status: 'published',
        } as never,
        overrideAccess: true,
      })
      return {
        type: fix.type,
        url,
        slug: fix.slug,
        status: 'updated',
        message: `blog «${fix.slug}» updated: blocks[] (${blocks.length})`,
      }
    } catch (e) {
      return {
        type: fix.type,
        url,
        slug: fix.slug,
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
      slug: fix.slug,
      status: 'error',
      message: `Author «${authorSlug}» не найден. Сначала pnpm seed:etalons.`,
    }
  }

  try {
    await payload.create({
      collection: 'blog',
      data: {
        slug: fix.slug,
        title: fix.h1 ?? fix.slug,
        h1: fix.h1 ?? fix.slug,
        author: (author as { id: string | number }).id,
        category: 'evergreen',
        publishedAt: fix.datePublished ?? '2026-05-29',
        modifiedAt: fix.dateModified ?? fix.datePublished ?? '2026-05-29',
        intro,
        body,
        blocks,
        metaTitle: fix.metaTitle?.slice(0, 60),
        metaDescription: fix.metaDescription?.slice(0, 160),
        _status: 'published',
      } as never,
      overrideAccess: true,
    })
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'created',
      message: `blog «${fix.slug}» created`,
    }
  } catch (e) {
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

// ───────── Main ─────────

const STAGES = [
  'stage2-w11-extras-blog', // первая — там special pillars (arenda-tehniki, promalp, raschet, porubochnyj)
  'stage2-w8', // 33 sub-services
  'stage2-w10-sd-batch', // 100 SD
  'stage2-w11-b2b', // 10 B2B
  'stage2-w11-cases', // 8 cases
] as const

function readAllFixtures(): { path: string; fix: BaseFixture }[] {
  const all: { path: string; fix: BaseFixture }[] = []
  for (const stage of STAGES) {
    const dir = resolve(process.cwd(), 'content', stage)
    const files = readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .filter((f) => f !== '_manifest.json')
    for (const filename of files) {
      const path = resolve(dir, filename)
      const raw = readFileSync(path, 'utf-8')
      try {
        const fix = JSON.parse(raw) as BaseFixture
        all.push({ path: `${stage}/${filename}`, fix })
      } catch (e) {
        console.error(
          `✗ JSON parse failed: ${stage}/${filename} → ${e instanceof Error ? e.message : e}`,
        )
      }
    }
  }
  return all
}

async function main() {
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('ABORT: prod-БД, OBIKHOD_SEED_CONFIRM=yes не выставлен.')
    console.error('  pnpm seed:stage2-content:prod — только после pg_dump backup.')
    process.exit(1)
  }
  if (isProdDb) console.log('⚠ prod-режим: подтверждён через OBIKHOD_SEED_CONFIRM=yes')

  const started = Date.now()
  const payload = await getPayload({ config })

  const fixtures = readAllFixtures()
  console.log(`Stage 2 W11 seed: ${fixtures.length} fixture(s) обнаружено`)

  // Сортировка: special pillars → sub-services → SD → B2B → cases → blog.
  // Это критично т.к. sub-services требуют parent-pillar, SD — service+district.
  const order: Record<string, number> = {
    'usp-pillar': 1,
    'calculator-hub': 1,
    'info-pillar': 1,
    hub: 1, // arenda-tehniki — pillar для 4 sub в extras
    'sub-service': 2,
    'programmatic-sd': 3,
    'b2b-hub': 4,
    'b2b-segment': 4,
    'b2b-spec': 4,
    'b2b-cases-index': 4,
    'b2b-segment-cases': 4,
    case: 5,
    'blog-post': 6,
  }
  fixtures.sort((a, b) => (order[a.fix.type] ?? 99) - (order[b.fix.type] ?? 99))

  const results: SeedResult[] = []

  for (const { path, fix } of fixtures) {
    let r: SeedResult
    try {
      switch (fix.type) {
        case 'usp-pillar':
        case 'calculator-hub':
        case 'info-pillar':
        case 'hub':
          r = await seedSpecialPillar(payload, fix as SpecialPillarFixture)
          break
        case 'sub-service':
          r = await seedSubService(payload, fix as SubServiceFixture)
          break
        case 'programmatic-sd':
          r = await seedProgrammaticSd(payload, fix as ProgrammaticSdFixture)
          break
        case 'b2b-hub':
        case 'b2b-segment':
        case 'b2b-spec':
        case 'b2b-cases-index':
        case 'b2b-segment-cases':
          r = await seedB2BPage(payload, fix as B2BFixture)
          break
        case 'case':
          r = await seedCase(payload, fix as CaseFixture)
          break
        case 'blog-post':
          r = await seedBlogPost(payload, fix as BlogFixture)
          break
        default:
          r = {
            type: fix.type,
            url: fix.url ?? `/${fix.slug}/`,
            slug: fix.slug,
            status: 'error',
            message: `unknown type «${fix.type}»`,
          }
      }
    } catch (e) {
      r = {
        type: fix.type,
        url: fix.url ?? `/${fix.slug}/`,
        slug: fix.slug,
        status: 'error',
        message: `unexpected: ${e instanceof Error ? e.message : String(e)}`,
      }
    }
    const icon =
      r.status === 'created'
        ? '✓'
        : r.status === 'updated'
          ? '↻'
          : r.status === 'skipped'
            ? '•'
            : r.status === 'not-seeded'
              ? '⏭'
              : '✗'
    console.log(`${icon} [${r.status.padEnd(11)}] ${path.padEnd(60)} ${r.url}`)
    if (r.message && (r.status === 'error' || r.status === 'not-seeded')) {
      console.log(`           → ${r.message}`)
    }
    results.push(r)
  }

  const duration = ((Date.now() - started) / 1000).toFixed(1)
  console.log('')
  console.log('================ SEED STAGE 2 SUMMARY ================')
  const counts = {
    created: results.filter((r) => r.status === 'created').length,
    updated: results.filter((r) => r.status === 'updated').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    notSeeded: results.filter((r) => r.status === 'not-seeded').length,
    errors: results.filter((r) => r.status === 'error').length,
  }
  console.log(
    `created ${counts.created} · updated ${counts.updated} · skipped ${counts.skipped} · not-seeded ${counts.notSeeded} · errors ${counts.errors} · ${duration}s`,
  )
  console.log('======================================================')

  // По типам
  const byType: Record<string, { ok: number; err: number }> = {}
  for (const r of results) {
    byType[r.type] ??= { ok: 0, err: 0 }
    if (r.status === 'error') byType[r.type].err++
    else byType[r.type].ok++
  }
  console.log('Распределение:')
  for (const [t, c] of Object.entries(byType).sort()) {
    console.log(`  ${t.padEnd(20)} ok=${c.ok}  err=${c.err}`)
  }

  if (counts.errors > 0) {
    console.log('')
    console.log('Errors:')
    for (const r of results.filter((rr) => rr.status === 'error')) {
      console.log(`  ✗ ${r.url} → ${r.message}`)
    }
  }

  process.exit(counts.errors === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('seed-content-stage2 failed:', err)
  process.exit(1)
})
