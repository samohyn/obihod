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
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: 'var(--brand-obihod-ink, #1c1c1c)',
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  background: 'var(--brand-obihod-bg, #f7f5f0)',
}

const greetingStyle: CSSProperties = {
  background: 'var(--brand-obihod-card, #ffffff)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 12,
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

const tileGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 20,
  maxWidth: 1080,
}

const widgetStyle: CSSProperties = {
  background: 'var(--brand-obihod-card, #ffffff)',
  border: '1px solid var(--brand-obihod-line, #e6e1d6)',
  borderRadius: 12,
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
  borderRadius: 6,
}

export const BeforeDashboardStartHere: FC = async () => {
  const recent = await loadRecentEdits(5)

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
                  fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
                }}
              >
                {r.collectionLabel}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{r.title}</span>
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--brand-obihod-muted, #6b6256)',
                  fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
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
