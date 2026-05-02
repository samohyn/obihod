/**
 * Stage 3 W13 Wave 1 Run 3a — seed 10 blog-post fixtures
 * (`site/content/stage3-w13-blog/*.json`) в Payload `blog` collection.
 *
 * Идемпотентный create-or-update by slug. Author resolution через
 * `authors` collection (default `brigada-vyvoza-obihoda`); если нет —
 * fallback на любого первого author + warn.
 *
 * Запуск:
 *   pnpm seed:stage3-blog                                # local
 *   OBIKHOD_SEED_CONFIRM=yes pnpm seed:stage3-blog:prod  # prod
 *
 * Safety-gate (ADR-0001): regex по DATABASE_URI.
 *
 * Контракт: specs/EPIC-SEO-CONTENT-FILL/US-3-priority-b-districts/sa-seo.md
 *           Wave 1 Run 3 (10 blog articles).
 */

import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../payload.config.js'

interface BlogFixture {
  type: 'blog-post'
  slug: string
  url?: string
  h1: string
  metaTitle?: string
  metaDescription?: string
  author?: { slug?: string; name?: string }
  category?: string
  datePublished?: string
  dateModified?: string
  blocks?: CwBlock[]
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

// Adapter из seed-content-stage3.ts (sustained whitelist Blog: hero, text-content,
// faq, cta-banner, tldr, breadcrumbs, related-services).
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
    default:
      return null
  }
}

function fixtureBlocksToPayload(fix: BlogFixture): Record<string, unknown>[] {
  return (fix.blocks ?? [])
    .map((b) => cwBlockToPayload(b))
    .filter((b): b is Record<string, unknown> => Boolean(b))
}

function extractTldr(fix: BlogFixture): string {
  const tldr = (fix.blocks ?? []).find((b) => b.blockType === 'tldr') as
    | { body?: string; text?: string }
    | undefined
  return (tldr?.body ?? tldr?.text ?? fix.metaDescription ?? '').slice(0, 280)
}

function extractBody(fix: BlogFixture): unknown {
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
  collection: 'blog' | 'authors',
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

async function findFallbackAuthor(payload: Payload): Promise<{ id: string | number } | null> {
  const r = await payload.find({
    collection: 'authors',
    limit: 1,
    overrideAccess: true,
  })
  return (r.docs[0] as { id: string | number } | undefined) ?? null
}

async function seedBlog(
  payload: Payload,
  fix: BlogFixture,
  fileName: string,
): Promise<SeedResult> {
  const blocks = fixtureBlocksToPayload(fix)
  const intro = extractTldr(fix)
  const body = extractBody(fix)
  const category = fix.category ?? 'evergreen'
  const publishedAt = fix.datePublished ?? '2026-05-03'
  const modifiedAt = fix.dateModified ?? publishedAt

  const existing = await findOneBySlug(payload, 'blog', fix.slug)

  if (existing) {
    try {
      await payload.update({
        collection: 'blog',
        id: existing.id,
        data: {
          title: fix.h1,
          h1: fix.h1,
          intro,
          body,
          blocks,
          category,
          publishedAt,
          modifiedAt,
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
        message: `blog «${fix.slug}» updated: blocks[] (${blocks.length})`,
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

  // Author resolution
  const authorSlug = fix.author?.slug ?? 'brigada-vyvoza-obihoda'
  let author = await findOneBySlug(payload, 'authors', authorSlug)
  if (!author) {
    const fb = await findFallbackAuthor(payload)
    if (!fb) {
      return {
        file: fileName,
        slug: fix.slug,
        status: 'error',
        message: `Author «${authorSlug}» не найден и нет ни одного author в БД. Сначала pnpm seed:authors / seed:etalons.`,
      }
    }
    console.log(`  ⚠ Author «${authorSlug}» не найден — fallback на первый author (id=${fb.id}).`)
    author = fb
  }

  try {
    await payload.create({
      collection: 'blog',
      data: {
        slug: fix.slug,
        title: fix.h1,
        h1: fix.h1,
        author: author.id,
        category,
        publishedAt,
        modifiedAt,
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
      file: fileName,
      slug: fix.slug,
      status: 'created',
      message: `blog «${fix.slug}» created (author=${authorSlug}, category=${category})`,
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
    console.error('  pnpm seed:stage3-blog:prod — только после pg_dump backup.')
    process.exit(1)
  }
  if (isProdDb) console.log('⚠ prod-режим: подтверждён через OBIKHOD_SEED_CONFIRM=yes')

  console.log('[seed-stage3-blog] DATABASE_URI:', dbUri.replace(/:[^@]+@/, ':***@'))

  const payload = await getPayload({ config })

  const dir = resolve(process.cwd(), 'content/stage3-w13-blog')
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== '_manifest.json')
    .sort()

  console.log(`[seed-stage3-blog] Найдено ${files.length} fixtures в ${dir}`)

  const results: SeedResult[] = []

  for (const file of files) {
    const path = resolve(dir, file)
    const raw = readFileSync(path, 'utf-8')
    const fix = JSON.parse(raw) as BlogFixture

    if (fix.type !== 'blog-post') {
      console.log(`[seed-stage3-blog] SKIP ${file}: type="${fix.type}" (только blog-post)`)
      continue
    }

    const r = await seedBlog(payload, fix, file)
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
  console.log('================ SEED STAGE 3 BLOG SUMMARY ================')
  console.log(
    `created ${counts.created} · updated ${counts.updated} · errors ${counts.errors} (всего ${results.length})`,
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
  console.error('seed-content-stage3-blog failed:', err)
  process.exit(1)
})
