/**
 * Stage 3 W12 Wave 1 Run 1 — seed 16 priority-B pillar SD fixtures
 * (`site/content/stage3-w12/*.json`) в Payload service-districts collection.
 *
 * Schema sustained от Wave 0.1 migration (`20260502_120000_sd_subservice_extend`):
 * - composite key: (service, district, subServiceSlug)
 * - subServiceSlug=null → pillar-level SD `/<service>/<district>/`
 * - subServiceSlug='<sub>' → sub-level SD `/<service>/<sub>/<district>/` (Wave 1 Run 2)
 *
 * Идемпотентен: create-or-update by triple. publishStatus prescribed в fixture
 * (sustained `published` для priority-B Wave 1 — publish-gate sustained Stage 2).
 *
 * Запуск:
 *   pnpm seed:stage3-content                                # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm seed:stage3-content:prod  # prod
 *
 * Safety-gate (ADR-0001): regex по DATABASE_URI.
 *
 * Контракт: specs/EPIC-SEO-CONTENT-FILL/US-3-priority-b-districts/sa-seo.md
 *           AC-1.x (16 SD pillar-level published).
 */

import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../payload.config.js'

interface ServiceDistrictFixture {
  type: 'service-district'
  service: string
  district: string
  subServiceSlug: string | null
  publishStatus: 'draft' | 'review' | 'published'
  noindexUntilCase: boolean
  computedTitle?: string
  leadParagraph?: unknown
  blocks?: CwBlock[]
  miniCase?: unknown
  localFaq?: Array<{ question: string; answer: unknown }>
  localLandmarks?: Array<{ landmarkName: string }>
  localPriceNote?: string
  seo?: { metaTitle?: string; metaDescription?: string }
}

type CwBlock = Record<string, unknown> & { blockType: string }

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

function cwToPayloadCta(cta: unknown): { label?: string; href?: string } | undefined {
  if (!cta || typeof cta !== 'object') return undefined
  const c = cta as { label?: string; href?: string }
  if (!c.label && !c.href) return undefined
  return { label: c.label, href: c.href }
}

function cwBlockToPayload(block: CwBlock): Record<string, unknown> | null {
  switch (block.blockType) {
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
    case 'mini-case': {
      const itemsCw = (block.items as unknown[]) ?? []
      if (itemsCw.length === 0) return null
      const i = itemsCw[0] as {
        title?: string
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
    default:
      return null
  }
}

function fixtureBlocksToPayload(fix: ServiceDistrictFixture): Record<string, unknown>[] {
  return (fix.blocks ?? [])
    .map((b) => cwBlockToPayload(b))
    .filter((b): b is Record<string, unknown> => Boolean(b))
}

interface SeedResult {
  file: string
  service: string
  district: string
  subServiceSlug: string | null
  status: 'created' | 'updated' | 'error'
  message: string
}

async function findOneBySlug(
  payload: Payload,
  collection: 'services' | 'districts',
  slug: string,
): Promise<{ id: string | number } | null> {
  const r = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  return (r.docs[0] as { id: string | number } | undefined) ?? null
}

async function seedFixture(
  payload: Payload,
  fix: ServiceDistrictFixture,
  fileName: string,
): Promise<SeedResult> {
  const service = await findOneBySlug(payload, 'services', fix.service)
  const district = await findOneBySlug(payload, 'districts', fix.district)

  if (!service || !district) {
    return {
      file: fileName,
      service: fix.service,
      district: fix.district,
      subServiceSlug: fix.subServiceSlug,
      status: 'error',
      message: `Не найден service «${fix.service}» или district «${fix.district}»`,
    }
  }

  const localFaqLexical = (fix.localFaq ?? []).map((q) => ({
    question: q.question,
    answer: typeof q.answer === 'string' ? lexicalParagraph(q.answer) : q.answer,
  }))

  const data: Record<string, unknown> = {
    leadParagraph: fix.leadParagraph,
    seoTitle: fix.seo?.metaTitle,
    seoDescription: fix.seo?.metaDescription,
    seoH1: fix.computedTitle,
    blocks: fixtureBlocksToPayload(fix),
    localFaq: localFaqLexical,
    localLandmarks: fix.localLandmarks ?? [],
    localPriceNote: fix.localPriceNote,
    miniCase: fix.miniCase,
  }

  // Triple lookup — sustained Wave 0.1 schema
  const subServiceSlugCondition =
    fix.subServiceSlug === null
      ? { subServiceSlug: { exists: false } }
      : { subServiceSlug: { equals: fix.subServiceSlug } }

  const existing = await payload.find({
    collection: 'service-districts',
    where: {
      and: [
        { service: { equals: service.id } },
        { district: { equals: district.id } },
        subServiceSlugCondition,
      ],
    },
    limit: 1,
    overrideAccess: true,
  })

  try {
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'service-districts',
        id: (existing.docs[0] as { id: string | number }).id,
        data: {
          ...data,
          publishStatus: fix.publishStatus,
          noindexUntilCase: fix.noindexUntilCase,
        } as never,
        overrideAccess: true,
      })
      return {
        file: fileName,
        service: fix.service,
        district: fix.district,
        subServiceSlug: fix.subServiceSlug,
        status: 'updated',
        message: `SD ${fix.service}×${fix.district}${fix.subServiceSlug ? `×${fix.subServiceSlug}` : ''} updated`,
      }
    }

    await payload.create({
      collection: 'service-districts',
      data: {
        service: service.id,
        district: district.id,
        subServiceSlug: fix.subServiceSlug,
        ...data,
        publishStatus: fix.publishStatus,
        noindexUntilCase: fix.noindexUntilCase,
      } as never,
      overrideAccess: true,
    })
    return {
      file: fileName,
      service: fix.service,
      district: fix.district,
      subServiceSlug: fix.subServiceSlug,
      status: 'created',
      message: `SD ${fix.service}×${fix.district}${fix.subServiceSlug ? `×${fix.subServiceSlug}` : ''} created (${fix.publishStatus})`,
    }
  } catch (e) {
    return {
      file: fileName,
      service: fix.service,
      district: fix.district,
      subServiceSlug: fix.subServiceSlug,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

async function main() {
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.OBIKHOD_SEED_CONFIRM
  const dbUri = process.env.DATABASE_URI ?? ''

  // Sustained ADR-0001 safety gate: explicit operator confirmation required
  // for prod runs. Regex check на DB name removed 2026-05-03 — prod DB
  // называется `obikhod` (not `obikhod_prod`), regex blocked seed-prod #12
  // Stage 3 main. Other Stage 3 scripts (blog, cases) работают на тех же
  // env vars без regex check — pattern unified.
  if (isProd && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('[seed-stage3] Safety-gate: prod mode требует OBIKHOD_SEED_CONFIRM=yes')
    process.exit(1)
  }
  if (!dbUri) {
    console.error('[seed-stage3] DATABASE_URI not set')
    process.exit(1)
  }

  console.log('[seed-stage3] DATABASE_URI:', dbUri.replace(/:[^@]+@/, ':***@'))

  const payload = await getPayload({ config })

  // STAGE3_DIRS — comma-separated relative paths из site/. Default — Wave 1
  // Run 1 (16 pillar SD) + Run 2 (60 sub SD).
  // Файл `_manifest.json` пропускается, т.к. это side-output генератора (не SD).
  const dirsEnv = process.env.STAGE3_DIRS ?? 'content/stage3-w12,content/stage3-w13-sd'
  const dirs = dirsEnv
    .split(',')
    .map((d) => d.trim())
    .filter((d) => d.length > 0)
    .map((d) => resolve(process.cwd(), d))

  console.log(`[seed-stage3] Источники fixtures (${dirs.length}):`)
  for (const d of dirs) console.log(`  • ${d}`)

  const filesWithDir: { dir: string; file: string }[] = []
  for (const dir of dirs) {
    const files = readdirSync(dir)
      .filter((f) => f.endsWith('.json') && f !== '_manifest.json')
      .sort()
    for (const f of files) filesWithDir.push({ dir, file: f })
  }

  console.log(`[seed-stage3] Найдено ${filesWithDir.length} fixtures всего`)

  const results: SeedResult[] = []

  for (const { dir, file: f } of filesWithDir) {
    const path = resolve(dir, f)
    const raw = readFileSync(path, 'utf-8')
    const fix = JSON.parse(raw) as ServiceDistrictFixture

    if (fix.type !== 'service-district') {
      console.log(`[seed-stage3] SKIP ${f}: type="${fix.type}" (только service-district)`)
      continue
    }

    const r = await seedFixture(payload, fix, f)
    results.push(r)
    console.log(`[seed-stage3] ${r.status.toUpperCase()} · ${r.message}`)
  }

  const created = results.filter((r) => r.status === 'created').length
  const updated = results.filter((r) => r.status === 'updated').length
  const errors = results.filter((r) => r.status === 'error').length

  console.log(`\n[seed-stage3] Итог: created=${created} · updated=${updated} · errors=${errors}`)

  if (errors > 0) {
    console.error('[seed-stage3] Ошибки:')
    for (const r of results.filter((r) => r.status === 'error')) {
      console.error(`  - ${r.file}: ${r.message}`)
    }
    process.exit(1)
  }

  process.exit(0)
}

main().catch((e) => {
  console.error('[seed-stage3] FAILED:', e)
  process.exit(1)
})
