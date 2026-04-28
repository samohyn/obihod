import type { CSSProperties, FC } from 'react'

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
  slug: 'services' | 'service-districts' | 'cases' | 'blog' | 'b2b-pages' | 'districts'
  label: string
  titleField: string
}> = [
  { slug: 'services', label: 'Услуга', titleField: 'title' },
  { slug: 'service-districts', label: 'Район × услуга', titleField: 'computedTitle' },
  { slug: 'cases', label: 'Кейс', titleField: 'title' },
  { slug: 'blog', label: 'Блог', titleField: 'title' },
  { slug: 'b2b-pages', label: 'B2B-страница', titleField: 'title' },
  { slug: 'districts', label: 'Район', titleField: 'nameNominative' },
]

interface DashboardStats {
  newLeads: number | string
  uniqsWeek: number | string
  publishedPages: number | string
  ciErrors: number | string
}

async function loadStats(): Promise<DashboardStats> {
  // brand-guide §12.3: 4 stat-cards. Реальные значения берём из БД где можем,
  // остальные — placeholder «—» (нет интеграций Я.Метрика / Sentry / GH API).
  let newLeads: number | string = '—'
  let publishedPages: number | string = '—'
  try {
    const payload = await payloadClient()
    // Новые заявки — leads без обработки. Если коллекция пустая или нет
    // status-фильтра — total leads count.
    try {
      const leadsRes = await payload.find({
        collection: 'leads',
        limit: 0,
        pagination: false,
      })
      newLeads = leadsRes.totalDocs ?? 0
    } catch {
      newLeads = 0
    }

    // Опубликованные страницы — суммарный счёт по 7 коллекциям с _status=published.
    const pageCollections = [
      'services',
      'service-districts',
      'cases',
      'blog',
      'b2b-pages',
      'authors',
      'districts',
    ] as const
    let total = 0
    for (const slug of pageCollections) {
      try {
        const r = await payload.find({
          collection: slug,
          where: { _status: { equals: 'published' } },
          limit: 0,
          pagination: false,
        })
        total += r.totalDocs ?? 0
      } catch {
        // skip
      }
    }
    publishedPages = total
  } catch {
    // payloadClient init failed — все «—».
  }
  return {
    newLeads,
    uniqsWeek: '—', // TODO: Я.Метрика API integration
    publishedPages,
    ciErrors: '—', // TODO: Sentry / GH Actions API integration
  }
}

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
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
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

export const BeforeDashboardStartHere: FC = async () => {
  const [recent, stats] = await Promise.all([loadRecentEdits(5), loadStats()])
  const newLeadsNum = typeof stats.newLeads === 'number' ? stats.newLeads : 0
  const newLeadsHasValue = typeof stats.newLeads === 'number' && newLeadsNum > 0

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
          Шесть сценариев ниже — самые частые задачи. Не знаете, с чего начать — откройте
          инструкции.
        </p>
      </section>

      {/* §12.3 4 stat-cards: новые заявки / уник 7д / публ страниц / ошибки CI */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={eyebrowStyle}>Сегодня в обиходе</p>
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={newLeadsHasValue ? statNumWarnStyle : statNumStyle}>
              {String(stats.newLeads)}
            </div>
            <div style={statLabelStyle}>Новые заявки</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumStyle}>{String(stats.uniqsWeek)}</div>
            <div style={statLabelStyle}>Уник. за 7д</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumStyle}>{String(stats.publishedPages)}</div>
            <div style={statLabelStyle}>Публ. страниц</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumStyle}>{String(stats.ciErrors)}</div>
            <div style={statLabelStyle}>Ошибок CI</div>
          </div>
        </div>
      </section>

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
            href="/admin/collections/services"
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
            href="/admin/globals/site-chrome"
            icon={<ReplaceHeroTileIcon width={28} height={28} />}
            title="Заменить hero-баннер"
            caption="≈ 3 мин"
          />
          <DashboardTile
            href="/admin/collections/service-districts/create"
            icon={<AddPromotionTileIcon width={28} height={28} />}
            title="Разместить акцию"
            caption="≈ 6 мин"
            variant="accent"
          />
          <DashboardTile
            href="/admin/collections/service-districts/create"
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
