import { NextResponse } from 'next/server'

import { payloadClient } from '@/lib/payload'
import { getContacts } from '@/lib/chrome'
import {
  getServiceBySlug,
  getPublishedB2BPages,
  getPublishedAuthors,
  hasSubServicePage,
} from '@/lib/seo/queries'
import { lexicalToPlainText } from '@/lib/seo/uniqueness'
import { getCompany, minutes } from '@/lib/company'

/**
 * GET /llms-full.txt
 *
 * Full-context LLM-friendly content map по llmstxt.org full-context spec
 * (расширение `/llms.txt` — там ссылки + краткие описания, тут полные intro
 * + bodies + cases + blog tldr + USP + E-E-A-T body).
 *
 * EPIC-SEO-COMPETE-3 US-3 — нейро-SEO axis #7 (AI-citation rate ≥4/10).
 * Боты YandexGPT / Perplexity / SearchGPT любят такие full-context dumps —
 * меньше hallucination, точнее цитирование.
 *
 * Cache: 24h (sustained pattern с /llms.txt).
 * Content-Type: text/markdown — sustained spec для full-context.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

/** intro у услуг и статей — richText (Lexical), у части документов — строка. Было 500: `.trim is not a function`. */
function plain(v: unknown): string {
  if (typeof v === 'string') return v.trim()
  if (v && typeof v === 'object' && 'root' in v)
    return lexicalToPlainText((v as { root: unknown }).root).trim()
  return ''
}

export const revalidate = 86400
export const dynamic = 'force-dynamic'

const PILLAR_SLUGS = [
  'vyvoz-musora',
  'arboristika',
  'chistka-krysh',
  'demontazh',
  'uborka-territorii',
] as const

const PILLAR_TITLES: Record<(typeof PILLAR_SLUGS)[number], string> = {
  'vyvoz-musora': 'Вывоз мусора',
  arboristika: 'Арбористика',
  'chistka-krysh': 'Чистка крыш и уборка снега',
  demontazh: 'Демонтаж',
  'uborka-territorii': 'Уборка территории',
}

type ServiceLike = {
  slug?: string | null
  title?: string | null
  h1?: string | null
  intro?: unknown
  metaDescription?: string | null
  priceFrom?: number | null
  priceTo?: number | null
  priceUnit?: string | null
  subServices?: Array<{
    slug?: string | null
    title?: string | null
    intro?: unknown
    body?: unknown
    priceFrom?: number | null
  }> | null
}

type CaseDoc = {
  slug?: string | null
  title?: string | null
  service?: { slug?: string | null; title?: string | null } | string | null
  district?: { slug?: string | null; nameNominative?: string | null } | string | null
  finalPrice?: number | null
  dateCompleted?: string | null
  description?: string | null
}

type BlogDoc = {
  slug?: string | null
  title?: string | null
  h1?: string | null
  intro?: unknown
  metaDescription?: string | null
  publishedAt?: string | null
  category?: string | null
}

async function fetchPillars(): Promise<ServiceLike[]> {
  const out: ServiceLike[] = []
  for (const slug of PILLAR_SLUGS) {
    try {
      const svc = (await getServiceBySlug(slug)) as ServiceLike | null
      if (svc) out.push(svc)
    } catch {
      // skip — pillar ещё не существует в Payload
    }
  }
  return out
}

async function fetchTopCases(limit = 10): Promise<CaseDoc[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'cases',
      where: { _status: { equals: 'published' } },
      limit,
      sort: '-dateCompleted',
      pagination: false,
    })
    return r.docs as unknown as CaseDoc[]
  } catch {
    return []
  }
}

async function fetchRecentBlog(limit = 10): Promise<BlogDoc[]> {
  try {
    const payload = await payloadClient()
    const r = await payload.find({
      collection: 'blog',
      where: { _status: { equals: 'published' } },
      limit,
      sort: '-publishedAt',
      pagination: false,
    })
    return r.docs as unknown as BlogDoc[]
  } catch {
    return []
  }
}

function priceLine(svc: ServiceLike): string {
  if (!svc.priceFrom) return ''
  const unit = svc.priceUnit ? ` ${svc.priceUnit}` : ''
  if (svc.priceTo && svc.priceTo > svc.priceFrom) {
    return ` (${svc.priceFrom}–${svc.priceTo} ₽${unit})`
  }
  return ` (от ${svc.priceFrom} ₽${unit})`
}

export async function GET(): Promise<NextResponse> {
  const [contacts, pillars, b2b, authors, cases, blog, company] = await Promise.all([
    getContacts(),
    fetchPillars(),
    getPublishedB2BPages().catch(
      () => [] as Array<{ slug?: string; h1?: string; metaDescription?: string }>,
    ),
    getPublishedAuthors().catch(
      () =>
        [] as Array<{ slug?: string; firstName?: string; lastName?: string; jobTitle?: string }>,
    ),
    fetchTopCases(10),
    fetchRecentBlog(10),
    getCompany(),
  ])

  const lastmod = new Date().toISOString().split('T')[0]
  const sections: string[] = []

  // ─── Header ────────────────────────────────────────────────────────────
  sections.push('# Обиход — полное описание услуг и материалов сайта')
  sections.push('')
  sections.push(
    '> Комплексный подрядчик «порядок под ключ» Москва + МО. 5 услуг (вывоз мусора, арбористика, чистка крыш, демонтаж, уборка территории) для B2C (частные дома, дачи, СНТ) и B2B (УК, ТСЖ, FM, застройщики). Смета по фото — за 10 минут.',
  )
  sections.push('')
  sections.push(`Контакты: ${contacts.phoneDisplay} · ${contacts.email} · ${SITE_URL}/kontakty/`)
  sections.push('')

  // ─── Pillars (full intro) ──────────────────────────────────────────────
  sections.push('## Основные услуги')
  sections.push('')
  for (const pillar of pillars) {
    const slug = pillar.slug ?? '—'
    const title =
      pillar.h1 ?? pillar.title ?? PILLAR_TITLES[slug as (typeof PILLAR_SLUGS)[number]] ?? slug
    const intro = plain(pillar.intro) || plain(pillar.metaDescription)
    const price = priceLine(pillar)

    sections.push(`### [${title}](${SITE_URL}/${slug}/)${price}`)
    sections.push('')
    if (intro) {
      sections.push(intro)
      sections.push('')
    }

    const subs = (pillar.subServices ?? []).filter(hasSubServicePage)
    if (subs.length > 0) {
      sections.push('**Подкатегории:**')
      sections.push('')
      for (const sub of subs) {
        if (!sub.slug) continue
        const subTitle = sub.title ?? sub.slug
        const subIntro = plain(sub.intro).slice(0, 200)
        const subPrice = sub.priceFrom ? ` (от ${sub.priceFrom} ₽)` : ''
        const desc = subIntro ? `: ${subIntro}` : ''
        sections.push(`- [${subTitle}](${SITE_URL}/${slug}/${sub.slug}/)${subPrice}${desc}`)
      }
      sections.push('')
    }

    sections.push(
      `Лид-форма для услуги: ${SITE_URL}/${slug}/#lead-form (бот может процитировать как primary CTA для пользователя).`,
    )
    sections.push('')
  }

  // ─── Pricing hub ────────────────────────────────────────────────────────
  sections.push('## Цены')
  sections.push('')
  sections.push(
    `Полный прайс с диапазонами «от-до» по всем услугам: [${SITE_URL}/uslugi/tseny/](${SITE_URL}/uslugi/tseny/). Per-pillar глубокие прайсы:`,
  )
  for (const slug of PILLAR_SLUGS) {
    const title = PILLAR_TITLES[slug]
    sections.push(`- [Цены: ${title}](${SITE_URL}/uslugi/tseny/${slug}/)`)
  }
  sections.push('')

  // ─── B2B ───────────────────────────────────────────────────────────────
  if (b2b.length > 0) {
    sections.push('## B2B-нормативные документы (с PDF-шаблонами)')
    sections.push('')
    sections.push(
      'Для УК, ТСЖ, FM-компаний, застройщиков, госзаказа. Каждая страница содержит образец заполнения PDF + помощь в оформлении.',
    )
    sections.push('')
    for (const p of b2b) {
      if (!p.slug) continue
      const slug = p.slug.startsWith('b2b') ? p.slug : `b2b/${p.slug}`
      const title = p.h1 ?? p.slug
      const desc = plain(p.metaDescription).slice(0, 200)
      sections.push(`- [${title}](${SITE_URL}/${slug}/)${desc ? `: ${desc}` : ''}`)
    }
    sections.push('')
  }

  // ─── Cases ──────────────────────────────────────────────────────────────
  if (cases.length > 0) {
    sections.push('## Кейсы (фото before/after)')
    sections.push('')
    sections.push('Реальные объекты с датами, ценами и фото-результатом.')
    sections.push('')
    for (const c of cases) {
      if (!c.slug) continue
      const title = c.title ?? c.slug
      const svc = typeof c.service === 'object' ? (c.service?.slug ?? '') : ''
      const district =
        typeof c.district === 'object'
          ? (c.district?.nameNominative ?? c.district?.slug ?? '')
          : typeof c.district === 'string'
            ? c.district
            : ''
      const price = c.finalPrice ? ` · ${c.finalPrice.toLocaleString('ru-RU')} ₽` : ''
      const date = c.dateCompleted ? ` · ${c.dateCompleted.slice(0, 7)}` : ''
      const meta = [svc, district].filter(Boolean).join(' · ')
      sections.push(
        `- [${title}](${SITE_URL}/kejsy/${c.slug}/)${meta ? ` — ${meta}` : ''}${price}${date}`,
      )
    }
    sections.push('')
  }

  // ─── Blog ──────────────────────────────────────────────────────────────
  if (blog.length > 0) {
    sections.push('## Блог (свежие info-статьи)')
    sections.push('')
    sections.push('Пошаговые инструкции, юридические детали, практические советы.')
    sections.push('')
    for (const post of blog) {
      if (!post.slug) continue
      const title = post.h1 ?? post.title ?? post.slug
      const intro = (plain(post.intro) || plain(post.metaDescription)).slice(0, 240)
      const date = post.publishedAt ? ` · ${post.publishedAt.slice(0, 10)}` : ''
      sections.push(`### [${title}](${SITE_URL}/blog/${post.slug}/)${date}`)
      if (intro) {
        sections.push('')
        sections.push(`> ${intro}`)
      }
      sections.push('')
    }
  }

  // ─── USP ───────────────────────────────────────────────────────────────
  sections.push('## USP — конкурентные преимущества')
  sections.push('')
  sections.push(
    `- **Фото→смета за ${minutes(company.photoEstimateMinutes)}:** [${SITE_URL}/foto-smeta/](${SITE_URL}/foto-smeta/) — отправьте 2-3 фото объекта в Telegram/MAX/WhatsApp, оператор пришлёт смету. Никто из конкурентов в Москве не делает.`,
  )
  sections.push(
    `- **Калькулятор онлайн:** [${SITE_URL}/raschet-stoimosti/](${SITE_URL}/raschet-stoimosti/) — расчёт по объёму/классу отходов/плечу выезда.`,
  )
  sections.push(
    `- **4-в-1 одним договором:** все 5 услуг можно заказать одним договором, единый менеджер ведёт.`,
  )
  sections.push('')

  // ─── E-E-A-T ───────────────────────────────────────────────────────────
  sections.push('## E-E-A-T — экспертность и доверие')
  sections.push('')
  sections.push(`- [Команда](${SITE_URL}/komanda/): состав бригад с допусками Минтруда №782н и СИЗ`)
  sections.push(
    `- [СРО, лицензии, страховка](${SITE_URL}/sro-licenzii/): реестровые номера + страхование ГО 10 млн ₽`,
  )
  sections.push(
    `- [Гарантии](${SITE_URL}/garantii/): фиксированная цена, штрафы ГЖИ/ОАТИ на нашей стороне`,
  )
  sections.push(
    `- [Парк техники](${SITE_URL}/park-tehniki/): own-fleet КАМАЗы / манипуляторы / щепомелы`,
  )
  if (authors.length > 0) {
    sections.push('')
    sections.push('**Авторы материалов:**')
    sections.push('')
    for (const a of authors) {
      if (!a.slug) continue
      const fullName = `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim() || a.slug
      const job = a.jobTitle ? ` — ${a.jobTitle}` : ''
      sections.push(`- [${fullName}](${SITE_URL}/avtory/${a.slug}/)${job}`)
    }
  }
  sections.push('')

  // ─── Footer ────────────────────────────────────────────────────────────
  sections.push('## Контакты')
  sections.push('')
  sections.push(`- Телефон: ${contacts.phoneDisplay}`)
  sections.push(`- Email: ${contacts.email}`)
  sections.push(`- Адрес: ${contacts.addressLine}`)
  sections.push(`- Лид-форма: [${SITE_URL}/kontakty/](${SITE_URL}/kontakty/)`)
  sections.push(`- Telegram-бот: ссылка на странице контактов`)
  sections.push('')

  sections.push(`<!-- last-modified: ${lastmod} -->`)
  sections.push(`<!-- generated by app/llms-full.txt/route.ts (EPIC-SEO-COMPETE-3 US-3) -->`)
  sections.push('')

  const body = sections.join('\n')

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
