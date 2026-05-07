import { NextResponse } from 'next/server'

import { payloadClient } from '@/lib/payload'
import { getServiceBySlug, getPublishedB2BPages, getPublishedAuthors } from '@/lib/seo/queries'

/**
 * GET /llms.txt
 *
 * Community-driven LLM-friendly content map per llmstxt.org proposal.
 * Read by AI agents (claude.ai webfetch / SearchGPT / Perplexity / YandexGPT).
 *
 * Spec: seosite/07-neuro-seo/llms-txt-spec.md §3
 * US-4 Track D step 2 — uniqueness +1pp vs 0/17 competitors (W14 differentiation).
 *
 * Implementation:
 *  - Pillar services (4) → fetched live from Payload via getServiceBySlug.
 *  - B2B pages → live via getPublishedB2BPages (фильтр slug startsWith 'b2b').
 *  - E-E-A-T → hardcoded refs (sro-licenzii / komanda + dynamic /avtory/<slug>).
 *  - USP (foto-smeta) → hardcoded ref.
 *
 * Cache: 24h via revalidate=86400 (consistent с pillar /sro-licenzii/).
 * Content-Type: text/plain; charset=utf-8 (sustained spec §3.4 — text/plain
 *   fallback вместо text/markdown — wider browser support).
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 86400

const PILLAR_SLUGS = [
  'vyvoz-musora',
  'arboristika',
  'chistka-krysh',
  'demontazh',
  'uborka-territorii',
] as const

interface PillarRef {
  slug: string
  title: string
  shortDescription: string
}

const PILLAR_FALLBACKS: Record<(typeof PILLAR_SLUGS)[number], PillarRef> = {
  'vyvoz-musora': {
    slug: 'vyvoz-musora',
    title: 'Вывоз мусора',
    shortDescription: 'Контейнеры 8/27 м³, ФККО I-IV класса, СНТ + ИЖС + B2B',
  },
  arboristika: {
    slug: 'arboristika',
    title: 'Арбористика',
    shortDescription: 'Спил деревьев, обработка сада, уход за садом',
  },
  'chistka-krysh': {
    slug: 'chistka-krysh',
    title: 'Чистка крыш и уборка снега',
    shortDescription: 'Снег и сосульки, чистка крыш частных домов и МКД, наледь',
  },
  demontazh: {
    slug: 'demontazh',
    title: 'Демонтаж',
    shortDescription: 'Сараи, заборы, мелкие постройки + спец-демонтаж',
  },
  'uborka-territorii': {
    slug: 'uborka-territorii',
    title: 'Уборка территории',
    shortDescription: 'Выравнивание участка, расчистка, покос травы, вывоз порубочных остатков',
  },
}

async function buildPillars(): Promise<PillarRef[]> {
  const out: PillarRef[] = []
  for (const slug of PILLAR_SLUGS) {
    try {
      const svc = (await getServiceBySlug(slug)) as {
        slug?: string
        title?: string
        intro?: string
        metaDescription?: string
      } | null
      if (svc) {
        const title = svc.title?.trim() || PILLAR_FALLBACKS[slug].title
        const desc =
          (svc.intro?.trim() ?? '').slice(0, 140) ||
          (svc.metaDescription?.trim() ?? '').slice(0, 140) ||
          PILLAR_FALLBACKS[slug].shortDescription
        out.push({ slug, title, shortDescription: desc })
      } else {
        out.push(PILLAR_FALLBACKS[slug])
      }
    } catch {
      out.push(PILLAR_FALLBACKS[slug])
    }
  }
  return out
}

interface B2BRef {
  slug: string
  title: string
  shortDescription: string
}

async function buildB2B(): Promise<B2BRef[]> {
  try {
    const pages = (await getPublishedB2BPages()) as Array<{
      slug?: string
      title?: string
      h1?: string
      metaDescription?: string
    }>
    return pages
      .filter((p) => p.slug)
      .map((p) => ({
        slug: p.slug!,
        title: p.title ?? p.h1 ?? p.slug!,
        shortDescription: (p.metaDescription ?? '').slice(0, 140),
      }))
  } catch {
    return []
  }
}

interface CaseByService {
  service: string
  slug: string
  title: string
}

interface DistrictRef {
  slug: string
  name: string
}

async function buildCasesByService(): Promise<Record<string, CaseByService[]>> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'cases',
      limit: 100,
      sort: '-dateCompleted',
      pagination: false,
    })
    const grouped: Record<string, CaseByService[]> = {}
    for (const c of r.docs as Array<{
      slug?: string
      title?: string
      service?: string | { slug?: string }
    }>) {
      if (!c.slug) continue
      const svcSlug = typeof c.service === 'object' ? c.service?.slug : c.service
      if (!svcSlug) continue
      const list = grouped[svcSlug] ?? (grouped[svcSlug] = [])
      if (list.length >= 5) continue // top-5 на pillar
      list.push({ service: svcSlug, slug: c.slug, title: c.title ?? c.slug })
    }
    return grouped
  } catch {
    return {}
  }
}

async function buildDistricts(): Promise<DistrictRef[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'districts',
      limit: 100,
      pagination: false,
    })
    return (
      r.docs as Array<{
        slug?: string
        nameNominative?: string
      }>
    )
      .filter((d) => d.slug)
      .map((d) => ({ slug: d.slug!, name: d.nameNominative ?? d.slug! }))
  } catch {
    return []
  }
}

interface AuthorRef {
  slug: string
  fullName: string
  jobTitle: string
}

async function buildAuthors(): Promise<AuthorRef[]> {
  try {
    const authors = (await getPublishedAuthors()) as Array<{
      slug?: string
      fullName?: string
      firstName?: string
      lastName?: string
      jobTitle?: string
    }>
    return authors
      .filter((a) => a.slug)
      .map((a) => ({
        slug: a.slug!,
        fullName: a.fullName ?? `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim() ?? a.slug!,
        jobTitle: a.jobTitle ?? '',
      }))
  } catch {
    return []
  }
}

export async function GET(): Promise<NextResponse> {
  const [pillars, b2bPages, authors, casesByService, districts] = await Promise.all([
    buildPillars(),
    buildB2B(),
    buildAuthors(),
    buildCasesByService(),
    buildDistricts(),
  ])

  const lastmod = new Date().toISOString().split('T')[0]

  // Используем все live B2B-страницы; sustained spec: ставим index `/b2b/` первым.
  const b2bIndexFirst = (() => {
    const idx = b2bPages.findIndex((p) => p.slug === 'b2b' || p.slug === '/b2b/')
    if (idx > 0) {
      const [hub, ...rest] = [b2bPages[idx], ...b2bPages.slice(0, idx), ...b2bPages.slice(idx + 1)]
      return [hub, ...rest]
    }
    return b2bPages
  })()

  const sections: string[] = []

  sections.push('# Обиход — Порядок под ключ для Москвы и МО')
  sections.push('')
  sections.push(
    '> Комплексный подрядчик «порядок под ключ» для Москвы и МО — вывоз мусора (включая ФККО I-IV класса), арбористика и уход за садом, чистка крыш от снега и сосулек, демонтаж и спец-доп-услуги. B2C (частные дома, дачи, СНТ) + B2B (УК, ТСЖ, FM, застройщики, госзаказ). USP: фото→смета за 10 минут, 4-в-1 одним договором, СРО + страховка ГО 10 млн ₽, штрафы ГЖИ/ОАТИ на нашей стороне.',
  )
  sections.push('')

  sections.push('## Pillars')
  for (const p of pillars) {
    const desc = p.shortDescription ? `: ${p.shortDescription}` : ''
    sections.push(`- [${p.title}](${SITE_URL}/${p.slug}/)${desc}`)
  }
  sections.push('')

  if (b2bIndexFirst.length > 0) {
    sections.push('## B2B')
    for (const b of b2bIndexFirst) {
      const url = b.slug.startsWith('b2b') ? `${SITE_URL}/${b.slug}/` : `${SITE_URL}/b2b/${b.slug}/`
      const desc = b.shortDescription ? `: ${b.shortDescription}` : ''
      sections.push(`- [${b.title}](${url})${desc}`)
    }
    sections.push('')
  }

  // ─── Pricing hub ────────────────────────────────────────────────────────
  sections.push('## Pricing')
  sections.push(`- [Все услуги — единый прайс](${SITE_URL}/uslugi/tseny/)`)
  for (const p of pillars) {
    sections.push(`- [Цены: ${p.title}](${SITE_URL}/uslugi/tseny/${p.slug}/)`)
  }
  sections.push('')

  // ─── Cases by service ───────────────────────────────────────────────────
  if (Object.keys(casesByService).length > 0) {
    sections.push('## Cases by service')
    for (const p of pillars) {
      const list = casesByService[p.slug] ?? []
      if (list.length === 0) continue
      sections.push(`- **${p.title}:**`)
      for (const c of list) {
        sections.push(`  - [${c.title}](${SITE_URL}/kejsy/${c.slug}/)`)
      }
    }
    sections.push('')
  }

  // ─── Local coverage (Districts) ────────────────────────────────────────
  if (districts.length > 0) {
    sections.push('## Local coverage')
    sections.push(`Москва + ${districts.length} районов МО:`)
    const districtLinks = districts.map((d) => `[${d.name}](${SITE_URL}/raiony/${d.slug}/)`)
    sections.push(districtLinks.join(' · '))
    sections.push('')
  }

  sections.push('## E-E-A-T')
  sections.push(`- [Команда](${SITE_URL}/komanda/): состав бригад с допусками Минтруда №782н и СИЗ`)
  sections.push(
    `- [СРО, лицензии, страховка](${SITE_URL}/sro-licenzii/): реестровые номера + страхование ГО 10 млн ₽`,
  )
  sections.push(`- [Авторы](${SITE_URL}/avtory/): index страница авторов с Person schema`)
  for (const a of authors) {
    const desc = a.jobTitle ? `: ${a.jobTitle}` : ''
    sections.push(`- [${a.fullName}](${SITE_URL}/avtory/${a.slug}/)${desc}`)
  }
  sections.push('')

  sections.push('## USP')
  sections.push(
    `- [Фото-смета за 10 минут](${SITE_URL}/foto-smeta/): отправьте 2-3 фото в Telegram/MAX/WhatsApp — оператор пришлёт смету`,
  )
  sections.push(
    `- [Расчёт стоимости онлайн](${SITE_URL}/raschet-stoimosti/): калькулятор по объёму, классу отходов, плечу выезда`,
  )
  sections.push('')

  sections.push('## Optional')
  sections.push(`- [Блог](${SITE_URL}/blog/): info + commercial-bridge статьи`)
  sections.push(`- [Кейсы](${SITE_URL}/kejsy/): фото before/after по реальным объектам B2C+B2B`)
  sections.push('')

  sections.push(`<!-- last-modified: ${lastmod} -->`)
  sections.push('')

  const body = sections.join('\n')

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
