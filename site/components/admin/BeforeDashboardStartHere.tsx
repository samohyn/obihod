import type { CSSProperties, FC } from 'react'
import Link from 'next/link'

import { replyStats, type ReplyStats } from '@/lib/leads/sla'
import { CLOSED_STATUSES } from '@/lib/leads/status'
import { payloadClient } from '@/lib/payload'
import { DashboardTile } from './DashboardTile'
import {
  AddDistrictTileIcon,
  UpdatePriceTileIcon,
  PublishCaseTileIcon,
  ReplaceHeroTileIcon,
  AddPromotionTileIcon,
  BuildPageTileIcon,
} from './icons'

/**
 * BeforeDashboardStartHere — главный экран для оператора на /admin.
 *
 * - Greeting + 6 tile-сценариев (REQ-1.1)
 * - Виджет «Последние правки» — 5 свежих документов из публичных коллекций
 *
 * Server component. Рендерится в beforeDashboard slot Payload.
 *
 * Sa-spec ui-mockups §2.1, AC-3.1.*.
 */

interface RecentEdit {
  id: string
  title: string
  collection: string
  collectionLabel: string
  href: string
  updatedAt: string
}

const COLLECTIONS_TO_SHOW: Array<{
  slug: 'pages' | 'sub-services' | 'services' | 'service-districts' | 'cases' | 'blog' | 'districts'
  label: string
  titleField: string
}> = [
  { slug: 'pages', label: 'Страница', titleField: 'title' },
  { slug: 'sub-services', label: 'Подуслуга', titleField: 'title' },
  { slug: 'services', label: 'Услуга', titleField: 'title' },
  { slug: 'service-districts', label: 'Район × услуга', titleField: 'computedTitle' },
  { slug: 'cases', label: 'Кейс', titleField: 'title' },
  { slug: 'blog', label: 'Блог', titleField: 'title' },
  { slug: 'districts', label: 'Район', titleField: 'nameNominative' },
]

interface LeadStats {
  overdue: number
  fresh: number
  inWork: number
  week: ReplyStats
  month: ReplyStats
}

/** Заявки на главной панели (план 09, этап 5.5) — только реальные цифры, без заглушек. */
async function loadLeadStats(): Promise<LeadStats | null> {
  try {
    const payload = await payloadClient()
    const now = new Date()
    const notArchived = { archivedAt: { exists: false } } as const
    const monthAgo = new Date(now.getTime() - 30 * 86_400_000)
    const [overdue, fresh, inWork, recent] = await Promise.all([
      payload.count({
        collection: 'leads',
        overrideAccess: true,
        where: {
          and: [
            notArchived,
            { status: { not_in: [...CLOSED_STATUSES] } },
            { firstContactAt: { exists: false } },
            { replyDueAt: { less_than: now.toISOString() } },
          ],
        },
      }),
      payload.count({
        collection: 'leads',
        overrideAccess: true,
        where: { and: [notArchived, { status: { equals: 'new' } }] },
      }),
      payload.count({
        collection: 'leads',
        overrideAccess: true,
        where: { and: [notArchived, { status: { in: ['contacted', 'smeta', 'brigade'] } }] },
      }),
      payload.find({
        collection: 'leads',
        overrideAccess: true,
        depth: 0,
        pagination: false,
        limit: 5000,
        where: { createdAt: { greater_than_equal: monthAgo.toISOString() } },
        select: {
          status: true,
          createdAt: true,
          replyDueAt: true,
          firstContactAt: true,
          closedAt: true,
        },
      }),
    ])
    const docs = recent.docs as Parameters<typeof replyStats>[0]
    return {
      overdue: overdue.totalDocs,
      fresh: fresh.totalDocs,
      inWork: inWork.totalDocs,
      week: replyStats(docs, new Date(now.getTime() - 7 * 86_400_000), now),
      month: replyStats(docs, monthAgo, now),
    }
  } catch {
    return null
  }
}

const share = (r: ReplyStats) =>
  r.total ? `${Math.round((r.inTime / r.total) * 100)} %` : 'нет данных'
const shareNote = (r: ReplyStats) =>
  r.total ? `${r.inTime} из ${r.total} в срок` : 'заявок с итогом ещё нет'

async function loadRecentEdits(limit = 5): Promise<RecentEdit[]> {
  try {
    const payload = await payloadClient()
    const all: RecentEdit[] = []
    for (const c of COLLECTIONS_TO_SHOW) {
      try {
        const res = await payload.find({
          collection: c.slug,
          limit: 3,
          sort: '-updatedAt',
          depth: 0,
        })
        for (const doc of res.docs) {
          const d = doc as Record<string, unknown>
          const title =
            (typeof d[c.titleField] === 'string' && (d[c.titleField] as string)) ||
            (typeof d.title === 'string' && (d.title as string)) ||
            (typeof d.slug === 'string' && (d.slug as string)) ||
            String(d.id)
          all.push({
            id: String(d.id),
            title,
            collection: c.slug,
            collectionLabel: c.label,
            href: `/admin/collections/${c.slug}/${d.id}`,
            updatedAt: typeof d.updatedAt === 'string' ? d.updatedAt : new Date().toISOString(),
          })
        }
      } catch {
        // коллекция может ещё не иметь документов / схема меняется — пропускаем
      }
    }
    return all.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, limit)
  } catch {
    return []
  }
}

function formatRelative(iso: string): string {
  try {
    const ms = Date.now() - new Date(iso).getTime()
    const min = Math.round(ms / 60_000)
    if (min < 1) return 'только что'
    if (min < 60) return `${min} мин назад`
    const h = Math.round(min / 60)
    if (h < 24) return `${h} ч назад`
    const d = Math.round(h / 24)
    if (d === 1) return 'вчера'
    return `${d} дн назад`
  } catch {
    return ''
  }
}

const wrapStyle: CSSProperties = {
  padding: '24px 32px',
  fontFamily: 'var(--font-body)',
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  background: 'var(--brand-obihod-paper, #f7f5f0)',
}

const greetingStyle: CSSProperties = {
  background: 'var(--brand-obihod-card, #ffffff)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius, 10px)',
  padding: '24px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

const headingStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  margin: 0,
  lineHeight: 1.2,
}

const sectionHeadingStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  letterSpacing: '-0.015em',
  margin: 0,
  lineHeight: 1.2,
}

const eyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: 'var(--brand-obihod-muted, #6b6256)',
  margin: 0,
}

const statsGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: 12,
  maxWidth: 1080,
}

const statCardStyle: CSSProperties = {
  background: 'var(--brand-obihod-card, #ffffff)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
  padding: '14px 16px',
}

const statNumStyle: CSSProperties = {
  fontSize: 26,
  fontWeight: 700,
  color: 'var(--brand-obihod-primary, #2d5a3d)',
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1,
}

const statNumWarnStyle: CSSProperties = {
  ...statNumStyle,
  color: 'var(--brand-obihod-accent-ink, #c18724)',
}

const statLinkStyle: CSSProperties = {
  ...statCardStyle,
  display: 'block',
  minHeight: 44,
  color: 'inherit',
  textDecoration: 'none',
}

const statNumDangerStyle: CSSProperties = {
  ...statNumStyle,
  color: 'var(--brand-obihod-danger, #b54828)',
}

const statNoteStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--brand-obihod-muted, #6b6256)',
  marginTop: 4,
}

const statLabelStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--brand-obihod-muted, #6b6256)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  marginTop: 6,
}

const tileGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 20,
  maxWidth: 1080,
}

const widgetStyle: CSSProperties = {
  background: 'var(--brand-obihod-card, #ffffff)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 'var(--brand-obihod-radius, 10px)',
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  maxWidth: 720,
}

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: 12,
  padding: '12px 8px',
  minHeight: 44,
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
  borderRadius: 'var(--brand-obihod-radius-sm, 6px)',
}

/** Документ главной в «Страницах»: первый экран и «Акции» правятся в нём. */
async function loadHomeHref(): Promise<string> {
  try {
    const payload = await payloadClient()
    const res = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
      depth: 0,
      draft: true,
    })
    const id = res.docs[0]?.id
    if (id !== undefined) return `/admin/collections/pages/${id}`
  } catch {
    // нет базы — список «Страниц»
  }
  return '/admin/collections/pages'
}

export const BeforeDashboardStartHere: FC = async () => {
  const [recent, leads, homeHref] = await Promise.all([
    loadRecentEdits(5),
    loadLeadStats(),
    loadHomeHref(),
  ])

  return (
    <div style={wrapStyle}>
      <section style={greetingStyle}>
        <p style={eyebrowStyle}>Начало</p>
        <h1 style={headingStyle}>Здравствуйте. Что будем делать сегодня?</h1>
        <p
          style={{
            margin: 0,
            color: 'var(--brand-obihod-muted, #6b6256)',
            fontSize: 14,
            lineHeight: 1.55,
          }}
        >
          Шесть сценариев ниже — самые частые задачи. Не знаете, с чего начать — откройте{' '}
          <Link href="/admin/help" style={{ color: 'var(--brand-obihod-primary, #2d5a3d)' }}>
            инструкции
          </Link>
          .
        </p>
      </section>

      {/* План 09, этап 5.5: заявки сверху — просрочка, новые, в работе, доля ответов в срок */}
      {leads && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={eyebrowStyle}>Заявки</p>
          <div style={statsGridStyle}>
            <Link href="/admin/collections/leads?tab=urgent" style={statLinkStyle}>
              <div style={leads.overdue > 0 ? statNumDangerStyle : statNumStyle}>
                {leads.overdue}
              </div>
              <div style={statLabelStyle}>Просрочено</div>
            </Link>
            <Link href="/admin/collections/leads?tab=new" style={statLinkStyle}>
              <div style={leads.fresh > 0 ? statNumWarnStyle : statNumStyle}>{leads.fresh}</div>
              <div style={statLabelStyle}>Новые</div>
            </Link>
            <Link href="/admin/collections/leads?tab=work" style={statLinkStyle}>
              <div style={statNumStyle}>{leads.inWork}</div>
              <div style={statLabelStyle}>В работе</div>
            </Link>
            <div style={statCardStyle}>
              <div style={statNumStyle}>{share(leads.week)}</div>
              <div style={statLabelStyle}>В срок за 7 дней</div>
              <div style={statNoteStyle}>{shareNote(leads.week)}</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumStyle}>{share(leads.month)}</div>
              <div style={statLabelStyle}>В срок за 30 дней</div>
              <div style={statNoteStyle}>{shareNote(leads.month)}</div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 14 }}>
            <Link
              href="/admin/collections/leads"
              style={{ color: 'var(--brand-obihod-primary, #2d5a3d)' }}
            >
              Открыть очередь заявок →
            </Link>{' '}
            <span style={{ color: 'var(--brand-obihod-muted, #6b6256)' }}>
              Срок ответа считается от «Перезвоним за» в «Компания и контакты».
            </span>
          </p>
        </section>
      )}

      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={eyebrowStyle}>С чего начать</p>
        <div style={tileGridStyle}>
          <DashboardTile
            href="/admin/collections/districts/create"
            icon={<AddDistrictTileIcon width={28} height={28} />}
            title="Добавить район"
            caption="≈ 5 мин"
            variant="primary"
          />
          <DashboardTile
            href="/admin/collections/pages?where[slug][like]=tseny"
            icon={<UpdatePriceTileIcon width={28} height={28} />}
            title="Обновить цену"
            caption="≈ 2 мин"
          />
          <DashboardTile
            href="/admin/collections/cases/create"
            icon={<PublishCaseTileIcon width={28} height={28} />}
            title="Опубликовать кейс"
            caption="≈ 8 мин"
          />
          <DashboardTile
            href={homeHref}
            icon={<ReplaceHeroTileIcon width={28} height={28} />}
            title="Заменить первый экран"
            caption="≈ 3 мин"
          />
          <DashboardTile
            href={homeHref}
            icon={<AddPromotionTileIcon width={28} height={28} />}
            title="Разместить акцию"
            caption="≈ 6 мин"
            variant="accent"
          />
          <DashboardTile
            href="/admin/collections/pages/create"
            icon={<BuildPageTileIcon width={28} height={28} />}
            title="Собрать страницу из блоков"
            caption="≈ 10 мин"
          />
        </div>
      </section>

      <section style={widgetStyle}>
        <h2 style={sectionHeadingStyle}>Последние правки</h2>
        {recent.length === 0 ? (
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: 'var(--brand-obihod-muted, #6b6256)',
            }}
          >
            Пока нет правок. После первого сохранения они появятся здесь.
          </p>
        ) : (
          recent.map((r) => (
            <a key={`${r.collection}-${r.id}`} href={r.href} style={rowStyle}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--brand-obihod-primary, #2d5a3d)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {r.collectionLabel}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{r.title}</span>
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--brand-obihod-muted, #6b6256)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {formatRelative(r.updatedAt)}
              </span>
            </a>
          ))
        )}
      </section>
    </div>
  )
}

export default BeforeDashboardStartHere
