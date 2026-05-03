/**
 * Stage 3 W13 Wave 1 Run 3b — seed 6 case fixtures
 * (`site/content/stage3-w13-cases/*.json`) в Payload `cases` collection.
 *
 * Идемпотентный create-or-update by slug. Service+District resolution
 * через `services` и `districts` collections.
 *
 * heroImage: TBD-fal placeholders в fixtures — НЕ резолвим (honest data
 * sustained). photosBefore/photosAfter не required при update — оставляем
 * пустыми; fal.ai batch отдельной задачей. minRows=1 на photosBefore/After
 * на create — заполняем пустыми каплями только если коллекция позволяет;
 * иначе сохраняем как есть и принимаем validation warn (см. в логах).
 *
 * Запуск:
 *   pnpm seed:stage3-cases                                # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm seed:stage3-cases:prod  # prod
 *
 * Safety-gate (ADR-0001): regex по DATABASE_URI.
 *
 * Контракт: specs/EPIC-SEO-CONTENT-FILL/US-3-priority-b-districts/sa-seo.md
 *           Wave 1 Run 3 (6 cases).
 */

import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../payload.config.js'

interface CaseFixture {
  type: 'case'
  slug: string
  url?: string
  h1: string
  metaTitle?: string
  metaDescription?: string
  service: string
  district: string
  publishedAt?: string
  blocks?: CwBlock[]
  _meta?: {
    priceFact?: string
    objectFacts?: { duration_hours?: string; duration_days?: string }
  }
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

// Cases whitelist: hero, text-content, mini-case, cta-banner, related-services,
// breadcrumbs (sustained Cases.ts blockReferences).
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
      // Cases mini-case fixtures — variant "data-grid" с items[] (label, value).
      // Маппинг на inline.facts[] (≤4) для Payload mini-case schema.
      const itemsCw = (block.items as unknown[]) ?? []
      if (itemsCw.length === 0) return null
      // Cases-fixtures используют плоские items, не nested wrapper. Берём
      // первые 4 как facts (label/value).
      const facts = itemsCw
        .map((it) => {
          const i = it as { label?: string; value?: string }
          if (!i.label || !i.value) return null
          return { label: i.label.slice(0, 40), value: i.value.slice(0, 80) }
        })
        .filter((it): it is { label: string; value: string } => Boolean(it))
        .slice(0, 4)
      return {
        blockType: 'mini-case',
        inline: {
          title: ((block.h2 as string) ?? '').slice(0, 140) || 'В цифрах',
          facts,
        },
      }
    }
    default:
      return null
  }
}

function fixtureBlocksToPayload(fix: CaseFixture): Record<string, unknown>[] {
  return (fix.blocks ?? [])
    .map((b) => cwBlockToPayload(b))
    .filter((b): b is Record<string, unknown> => Boolean(b))
}

function extractBody(fix: CaseFixture): unknown {
  const textBlocks = (fix.blocks ?? []).filter((b) => b.blockType === 'text-content')
  if (textBlocks.length === 0) {
    return lexicalParagraph(fix.metaDescription ?? fix.h1)
  }
  const combined = textBlocks
    .map((b) => (typeof b.body === 'string' ? (b.body as string) : ''))
    .filter(Boolean)
    .join('\n\n')
  return lexicalParagraph(combined.slice(0, 8000))
}

interface SeedResult {
  file: string
  slug: string
  status: 'created' | 'updated' | 'error'
  message: string
}

async function findOneBySlug(
  payload: Payload,
  collection: 'cases' | 'services' | 'districts',
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

// Известные drift-aliases между cw fixtures и БД (на 2026-05-02).
// Хирургический фикс: cw Run 3b использует «zhukovskij», БД sustained
// «zhukovsky» (sustained Stage 1). Не патчим fixtures (TOV-pass, оператор
// ревьюил), а резолвим alias на этапе seed.
const DISTRICT_SLUG_ALIASES: Record<string, string> = {
  zhukovskij: 'zhukovsky',
}

async function resolveDistrict(
  payload: Payload,
  slug: string,
): Promise<{ id: string | number; resolvedSlug: string } | null> {
  const direct = await findOneBySlug(payload, 'districts', slug)
  if (direct) return { id: direct.id, resolvedSlug: slug }
  const alias = DISTRICT_SLUG_ALIASES[slug]
  if (alias) {
    const aliased = await findOneBySlug(payload, 'districts', alias)
    if (aliased) {
      console.log(`  ⚠ district «${slug}» → fallback alias «${alias}» (id=${aliased.id})`)
      return { id: aliased.id, resolvedSlug: alias }
    }
  }
  return null
}

async function seedCase(
  payload: Payload,
  fix: CaseFixture,
  fileName: string,
): Promise<SeedResult> {
  const blocks = fixtureBlocksToPayload(fix)
  const description = extractBody(fix)

  const service = await findOneBySlug(payload, 'services', fix.service)
  const district = await resolveDistrict(payload, fix.district)
  if (!service || !district) {
    return {
      file: fileName,
      slug: fix.slug,
      status: 'error',
      message: `Не найден service «${fix.service}» или district «${fix.district}».`,
    }
  }

  // duration / price из _meta (best-effort; fallbacks безопасные).
  const objectFacts = fix._meta?.objectFacts
  const durStr = objectFacts?.duration_hours ?? objectFacts?.duration_days ?? ''
  const durMatch = durStr.match(/(\d+)/)
  const durationHours = durMatch ? parseInt(durMatch[1], 10) : 8

  const priceFact = fix._meta?.priceFact ?? ''
  const finalPrice =
    parseInt(priceFact.match(/(\d[\d\s]*)/)?.[1].replace(/\s/g, '') ?? '0', 10) || 12800

  const dateCompleted = fix.publishedAt
    ? `${fix.publishedAt}T00:00:00.000Z`
    : '2026-05-03T00:00:00.000Z'

  const existing = await findOneBySlug(payload, 'cases', fix.slug)

  if (existing) {
    try {
      await payload.update({
        collection: 'cases',
        id: existing.id,
        data: {
          title: fix.h1,
          h1: fix.h1,
          service: service.id,
          district: district.id,
          dateCompleted,
          description,
          blocks,
          durationHours,
          finalPrice,
          metaTitle: fix.metaTitle?.slice(0, 60),
          metaDescription: fix.metaDescription?.slice(0, 160),
          _status: 'published',
        } as never,
        overrideAccess: true,
      })
      return {
        file: fileName,
        slug: fix.slug,
        status: 'updated',
        message: `case «${fix.slug}» updated: blocks[] (${blocks.length})`,
      }
    } catch (e) {
      return {
        file: fileName,
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
        title: fix.h1,
        h1: fix.h1,
        service: service.id,
        district: district.id,
        dateCompleted,
        description,
        durationHours,
        finalPrice,
        // photosBefore/After: minRows=1 в schema. heroImage TBD-fal — оставим
        // пустыми массивами; Payload вернёт validation error если minRows
        // strict — в этом случае ловим в catch и репортим в errors.
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
      file: fileName,
      slug: fix.slug,
      status: 'created',
      message: `case «${fix.slug}» created (service=${fix.service}, district=${fix.district})`,
    }
  } catch (e) {
    return {
      file: fileName,
      slug: fix.slug,
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

async function main() {
  const dbUri = process.env.DATABASE_URI ?? ''
  const isProdDb =
    /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri) ||
    process.env.OBIKHOD_ENV === 'production'

  if (isProdDb && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error('ABORT: prod-БД, OBIKHOD_SEED_CONFIRM=yes не выставлен.')
    console.error('  pnpm seed:stage3-cases:prod — только после pg_dump backup.')
    process.exit(1)
  }
  if (isProdDb) console.log('⚠ prod-режим: подтверждён через OBIKHOD_SEED_CONFIRM=yes')

  console.log('[seed-stage3-cases] DATABASE_URI:', dbUri.replace(/:[^@]+@/, ':***@'))

  const payload = await getPayload({ config })

  const dir = resolve(process.cwd(), 'content/stage3-w13-cases')
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== '_manifest.json')
    .sort()

  console.log(`[seed-stage3-cases] Найдено ${files.length} fixtures в ${dir}`)

  const results: SeedResult[] = []

  for (const file of files) {
    const path = resolve(dir, file)
    const raw = readFileSync(path, 'utf-8')
    const fix = JSON.parse(raw) as CaseFixture

    if (fix.type !== 'case') {
      console.log(`[seed-stage3-cases] SKIP ${file}: type="${fix.type}" (только case)`)
      continue
    }

    const r = await seedCase(payload, fix, file)
    results.push(r)
    const icon = r.status === 'created' ? '✓' : r.status === 'updated' ? '↻' : '✗'
    console.log(`${icon} [${r.status.padEnd(7)}] ${file.padEnd(60)} ${r.message}`)
  }

  const counts = {
    created: results.filter((r) => r.status === 'created').length,
    updated: results.filter((r) => r.status === 'updated').length,
    errors: results.filter((r) => r.status === 'error').length,
  }
  console.log('')
  console.log('================ SEED STAGE 3 CASES SUMMARY ================')
  console.log(
    `created ${counts.created} · updated ${counts.updated} · errors ${counts.errors} (всего ${results.length})`,
  )
  console.log('=============================================================')

  if (counts.errors > 0) {
    console.log('')
    console.log('Errors:')
    for (const r of results.filter((rr) => rr.status === 'error')) {
      console.log(`  ✗ ${r.file} → ${r.message}`)
    }
  }

  process.exit(counts.errors === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('seed-content-stage3-cases failed:', err)
  process.exit(1)
})
