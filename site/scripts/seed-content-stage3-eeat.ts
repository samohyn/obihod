/**
 * Stage 3 W14 Track D step 1 — seed E-E-A-T fixtures
 * (`site/content/stage3-w14-eeat/*.json`) в Payload Local API.
 *
 * Mapping (по `type` field в fixture):
 *
 *   author        → authors collection (update by slug; обновляет blocks/meta/sameAs/credentials/knowsAbout)
 *   static-page   → SKIPPED (sro-licenzii / komanda — hard-coded routes в site/app/(marketing)/, обновляются TSX-edit'ом).
 *
 * Игнорирует `.skip` файлы (avtory-operator-conditional.json.skip — placeholder pending real-name).
 *
 * Идемпотентен:
 *   - Authors: update existing by slug (Track A заполнил расширенные поля sro/credentials/knowsAbout/blocks);
 *     если author не найден — error (предварительно `pnpm seed:authors`).
 *   - static-page: not-seeded (hardcoded routes — обновляются через site/app/(marketing)/<slug>/page.tsx).
 *
 * Запуск:
 *   pnpm seed:stage3-eeat                                  # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm seed:stage3-eeat:prod    # prod
 *
 * Safety-gate (ADR-0001): regex по DATABASE_URI.
 *
 * Контракт: specs/EPIC-SEO-CONTENT-FILL/US-4-eeat-monitoring/sa-seo.md AC-2.3 / AC-2.5 / AC-2.6.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../payload.config.js'

interface BaseFixture {
  type: string
  url?: string
  slug: string
  h1?: string
  metaTitle?: string
  metaDescription?: string
  blocks?: CwBlock[]
  _meta?: Record<string, unknown>
  [key: string]: unknown
}

interface AuthorFixture extends BaseFixture {
  type: 'author'
  jobTitle?: string
  knowsAbout?: string[]
  worksInDistricts?: string[]
  sameAs?: string[]
  credentials?: Array<{ name: string; issuer?: string; issuedAt?: string }>
  bio?: string
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

// Whitelist Authors: hero, text-content, related-services, cta-banner, breadcrumbs.
// related-posts конвертируется в related-services (схема BlockEditor унифицирована).
function cwBlockToPayload(block: CwBlock): Record<string, unknown> | null {
  switch (block.blockType) {
    case 'hero': {
      const ctaPrimary = cwToPayloadCta(block.ctaPrimary)
      return {
        blockType: 'hero',
        title: (block.h1 as string) ?? (block.title as string) ?? '',
        subtitle: (block.jobTitle as string) ?? (block.subtitle as string) ?? undefined,
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
    case 'related-posts':
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
        heading: (block.h2 as string) ?? (block.heading as string) ?? 'Похожие материалы',
        items: items.slice(0, 3),
      }
    }
    default:
      return null
  }
}

function fixtureBlocksToPayload(fix: AuthorFixture): Record<string, unknown>[] {
  return (fix.blocks ?? [])
    .map((b) => cwBlockToPayload(b))
    .filter((b): b is Record<string, unknown> => Boolean(b))
}

function extractBio(fix: AuthorFixture): string {
  if (fix.bio && typeof fix.bio === 'string') return fix.bio.slice(0, 2000)
  // Fallback: первый text-content block с h2 «Кто мы».
  const tc = (fix.blocks ?? []).find(
    (b) => b.blockType === 'text-content' && /^кто мы/i.test((b.h2 as string) ?? ''),
  ) as { body?: string } | undefined
  if (tc?.body) return tc.body.slice(0, 2000)
  return (fix.metaDescription ?? '').slice(0, 2000)
}

interface SeedResult {
  file: string
  slug: string
  status: 'created' | 'updated' | 'skipped' | 'not-seeded' | 'error'
  message: string
}

async function findAuthorBySlug(
  payload: Payload,
  slug: string,
): Promise<{ id: string | number } | null> {
  const r = await payload.find({
    collection: 'authors',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  return (r.docs[0] as { id: string | number } | undefined) ?? null
}

// Alias map для устаревших slug (sustained seed-content-stage3-cases.ts pattern).
const DISTRICT_SLUG_ALIASES: Record<string, string> = {
  zhukovskij: 'zhukovsky',
}

async function findDistrictIdsBySlug(
  payload: Payload,
  slugs: string[],
): Promise<(string | number)[]> {
  if (slugs.length === 0) return []
  const normalized = slugs.map((s) => DISTRICT_SLUG_ALIASES[s] ?? s)
  const r = await payload.find({
    collection: 'districts',
    where: { slug: { in: normalized } },
    limit: 100,
    pagination: false,
    overrideAccess: true,
  })
  return r.docs.map((d) => (d as { id: string | number }).id)
}

async function seedAuthor(
  payload: Payload,
  fix: AuthorFixture,
  fileName: string,
): Promise<SeedResult> {
  const existing = await findAuthorBySlug(payload, fix.slug)
  if (!existing) {
    return {
      file: fileName,
      slug: fix.slug,
      status: 'error',
      message: `Author «${fix.slug}» не найден. Сначала pnpm seed:authors.`,
    }
  }

  const blocks = fixtureBlocksToPayload(fix)
  const bio = extractBio(fix)
  const knowsAbout = (fix.knowsAbout ?? []).map((topic) => ({ topic }))
  const sameAs = (fix.sameAs ?? []).map((url) => ({ url }))
  const credentials = (fix.credentials ?? []).map((c) => ({
    name: c.name,
    issuer: c.issuer,
    issuedAt: c.issuedAt,
  }))
  const districtIds = await findDistrictIdsBySlug(payload, fix.worksInDistricts ?? [])

  try {
    await payload.update({
      collection: 'authors',
      id: existing.id,
      data: {
        bio,
        jobTitle: fix.jobTitle?.slice(0, 120),
        knowsAbout,
        sameAs,
        credentials,
        worksInDistricts: districtIds,
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
      status: 'updated',
      message: `author «${fix.slug}» updated: blocks[] (${blocks.length}), knowsAbout (${knowsAbout.length}), credentials (${credentials.length}), districts (${districtIds.length})`,
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
    console.error('  pnpm seed:stage3-eeat:prod — только после pg_dump backup.')
    process.exit(1)
  }
  if (isProdDb) console.log('⚠ prod-режим: подтверждён через OBIKHOD_SEED_CONFIRM=yes')

  console.log('[seed-stage3-eeat] DATABASE_URI:', dbUri.replace(/:[^@]+@/, ':***@'))

  const payload = await getPayload({ config })

  const dir = resolve(process.cwd(), 'content/stage3-w14-eeat')
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== '_manifest.json')
    .sort()

  console.log(`[seed-stage3-eeat] Найдено ${files.length} fixtures в ${dir}`)

  const results: SeedResult[] = []

  for (const file of files) {
    const path = resolve(dir, file)
    const raw = readFileSync(path, 'utf-8')
    let fix: BaseFixture
    try {
      fix = JSON.parse(raw) as BaseFixture
    } catch (e) {
      results.push({
        file,
        slug: '',
        status: 'error',
        message: `JSON parse failed: ${e instanceof Error ? e.message : String(e)}`,
      })
      continue
    }

    let r: SeedResult
    switch (fix.type) {
      case 'author':
        r = await seedAuthor(payload, fix as AuthorFixture, file)
        break
      case 'static-page':
        r = {
          file,
          slug: fix.slug,
          status: 'not-seeded',
          message:
            'hardcoded route (site/app/(marketing)/<slug>/page.tsx) — обновляется TSX-edit, не seed',
        }
        break
      default:
        r = {
          file,
          slug: fix.slug,
          status: 'error',
          message: `unknown type «${fix.type}» — поддерживаются author / static-page`,
        }
    }

    results.push(r)
    const icon =
      r.status === 'updated'
        ? '↻'
        : r.status === 'created'
          ? '✓'
          : r.status === 'skipped'
            ? '•'
            : r.status === 'not-seeded'
              ? '⏭'
              : '✗'
    console.log(`${icon} [${r.status.padEnd(11)}] ${file.padEnd(60)} ${r.message}`)
  }

  const counts = {
    created: results.filter((r) => r.status === 'created').length,
    updated: results.filter((r) => r.status === 'updated').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    notSeeded: results.filter((r) => r.status === 'not-seeded').length,
    errors: results.filter((r) => r.status === 'error').length,
  }
  console.log('')
  console.log('================ SEED STAGE 3 EEAT SUMMARY ================')
  console.log(
    `created ${counts.created} · updated ${counts.updated} · skipped ${counts.skipped} · not-seeded ${counts.notSeeded} · errors ${counts.errors} (всего ${results.length})`,
  )
  console.log('============================================================')

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
  console.error('seed-content-stage3-eeat failed:', err)
  process.exit(1)
})
