/**
 * Stage 1 W6-W7 Track D — Seed 25 cw fixtures из site/content/stage1-w{4,5,6}/
 * в Payload Local API.
 *
 * Mapping (по `type` field в fixture):
 *
 *   pillar-service        → Services (4 услуги уже созданы pnpm seed; foto-smeta —
 *                            создаётся как USP-pillar с priceFrom/To=0, priceUnit='object')
 *   programmatic-sd       → ServiceDistricts (composite key service+district)
 *   district-hub          → Districts (4 districts уже созданы pnpm seed)
 *   blog-post             → Blog
 *   home                  → SKIPPED (hard-coded site/app/(marketing)/page.tsx)
 *   static-page           → SKIPPED (hard-coded routes / нет роута для sro-licenzii/komanda/park-tehniki)
 *
 * Дублирование с seed-content-etalons.ts намеренное: cwBlockToPayload и lexicalParagraph
 * вынесены inline для self-containedness; helpers те же по контракту, чтобы поведение
 * Stage 0 ↔ Stage 1 совпадало.
 *
 * Идемпотентен:
 *   - Services: только update existing (pnpm seed создаёт 4 pillar; foto-smeta create-once)
 *   - ServiceDistricts: create or update by composite (service, district)
 *   - Districts: only update existing
 *   - Blog: create or update by slug
 *
 * Запуск:
 *   pnpm seed:stage1-content                                # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm seed:stage1-content:prod  # prod
 *
 * Safety-gate (ADR-0001): regex по DATABASE_URI.
 *
 * Контракт: specs/EPIC-SEO-CONTENT-FILL/US-1-pillars-pilot/sa-seo.md AC-7 + AC-8.
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

interface PillarFixture extends BaseFixture {
  type: 'pillar-service'
  parentSlug?: string
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

// ───────── Helpers ─────────

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
        // Payload ServicesGrid maxRows: 9. cw fixtures могут содержать больше
        // (arboristika 12); slice до 9 чтобы не падать на validate.
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

// ───────── Per-type seeders ─────────

async function seedPillar(payload: Payload, fix: PillarFixture): Promise<SeedResult> {
  const url = fix.url ?? `/${fix.slug}/`
  const existing = await findOneBySlug(payload, 'services', fix.slug)
  const blocks = fixtureBlocksToPayload(fix)

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
        } as never,
        overrideAccess: true,
      })
      return {
        type: fix.type,
        url,
        slug: fix.slug,
        status: 'updated',
        message: `pillar updated: h1+meta+intro + blocks[] (${blocks.length})`,
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

  // foto-smeta — USP-pillar. Создаём новую запись Service с минимальной обвязкой.
  // priceFrom=0, priceTo=0 (страница процесса, не услуги).
  if (fix.slug !== 'foto-smeta') {
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'error',
      message: `Service «${fix.slug}» не найден. Сначала pnpm seed.`,
    }
  }

  try {
    await payload.create({
      collection: 'services',
      data: {
        slug: fix.slug,
        title: 'Смета по фото',
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
      message: `USP-pillar foto-smeta created (priceFrom/To=0, USP-page)`,
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
      slug: fix.slug,
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
        slug: fix.slug,
        status: 'updated',
        message: `SD ${fix.parentSlug}×${fix.districtSlug} legacy-fields updated, blocks[] (${blocks.length})`,
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
      message: `SD ${fix.parentSlug}×${fix.districtSlug} создан (draft, до miniCase)`,
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

async function seedDistrictHub(payload: Payload, fix: DistrictHubFixture): Promise<SeedResult> {
  const url = fix.url ?? `/raiony/${fix.slug}/`
  const existing = await findOneBySlug(payload, 'districts', fix.slug)
  if (!existing) {
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'error',
      message: `District «${fix.slug}» не найден. pnpm seed создаёт 8 districts.`,
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
      slug: fix.slug,
      status: 'updated',
      message: `district hub updated: meta + blocks[] (${blocks.length})`,
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
          metaTitle: fix.metaTitle,
          metaDescription: fix.metaDescription,
          _status: 'published',
        } as never,
        overrideAccess: true,
      })
      return {
        type: fix.type,
        url,
        slug: fix.slug,
        status: 'updated',
        message: `blog updated: title+meta+intro+body+blocks[] (${blocks.length})`,
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
        metaTitle: fix.metaTitle,
        metaDescription: fix.metaDescription,
        _status: 'published',
      } as never,
      overrideAccess: true,
    })
    return {
      type: fix.type,
      url,
      slug: fix.slug,
      status: 'created',
      message: `blog created + blocks[] (${blocks.length})`,
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

const STAGES = ['stage1-w4', 'stage1-w5', 'stage1-w6'] as const

function readAllFixtures(): { path: string; fix: BaseFixture }[] {
  const all: { path: string; fix: BaseFixture }[] = []
  for (const stage of STAGES) {
    const dir = resolve(process.cwd(), 'content', stage)
    const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
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
  // Safety-gate (ADR-0001)
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('ABORT: prod-БД, OBIKHOD_SEED_CONFIRM=yes не выставлен.')
    console.error('  pnpm seed:stage1-content:prod — только после pg_dump backup.')
    process.exit(1)
  }
  if (isProdDb) console.log('⚠ prod-режим: подтверждён через OBIKHOD_SEED_CONFIRM=yes')

  const started = Date.now()
  const payload = await getPayload({ config })

  const fixtures = readAllFixtures()
  console.log(`Stage 1 W6-W7 seed: ${fixtures.length} fixture(s) обнаружено`)

  const results: SeedResult[] = []

  // Сортируем по type → детерминированный порядок: districts → pillar → SD → blog → static.
  const order: Record<string, number> = {
    'district-hub': 1,
    'pillar-service': 2,
    'programmatic-sd': 3,
    'blog-post': 4,
    home: 5,
    'static-page': 6,
  }
  fixtures.sort((a, b) => (order[a.fix.type] ?? 99) - (order[b.fix.type] ?? 99))

  for (const { path, fix } of fixtures) {
    let r: SeedResult
    try {
      switch (fix.type) {
        case 'pillar-service':
          r = await seedPillar(payload, fix as PillarFixture)
          break
        case 'programmatic-sd':
          r = await seedProgrammaticSd(payload, fix as ProgrammaticSdFixture)
          break
        case 'district-hub':
          r = await seedDistrictHub(payload, fix as DistrictHubFixture)
          break
        case 'blog-post':
          r = await seedBlogPost(payload, fix as BlogFixture)
          break
        case 'home':
        case 'static-page': {
          // Hard-coded routes в site/app/(marketing)/ — Payload не хранит.
          // sro-licenzii, komanda, park-tehniki — роутов ещё нет (TODO Track B-1).
          r = {
            type: fix.type,
            url: fix.url ?? `/${fix.slug}/`,
            slug: fix.slug,
            status: 'not-seeded',
            message: 'hard-coded route (site/app/(marketing)/) — Pages collection отсутствует',
          }
          break
        }
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
    console.log(`${icon} [${r.status.padEnd(11)}] ${path.padEnd(40)} ${r.url}`)
    if (r.message) console.log(`           → ${r.message}`)
    results.push(r)
  }

  // ───────── Summary ─────────
  const duration = ((Date.now() - started) / 1000).toFixed(1)
  console.log('')
  console.log('================ SEED STAGE 1 SUMMARY ================')
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
  if (counts.notSeeded > 0) {
    console.log('')
    console.log('Не-seeded страницы (hard-coded routes):')
    for (const r of results.filter((rr) => rr.status === 'not-seeded')) {
      console.log(`  ⏭ ${r.url} (${r.slug})`)
    }
  }

  process.exit(counts.errors === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('seed-content-stage1 failed:', err)
  process.exit(1)
})
