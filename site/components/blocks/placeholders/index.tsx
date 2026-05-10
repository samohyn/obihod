/**
 * Placeholder blocks для master-template missing required sections.
 *
 * EPIC-SERVICE-PAGES-UX C4 — resolver `getBlocksForLayer` помечает заглушки
 * через `_placeholder: true`. Эти компоненты — TODO copy для рендера.
 *
 * Стиль: brand-guide §«Empty states» (ready) + §«Notifications» 5-state flow.
 * Используем sustained tokens (--c-*, --radius, --font-*) — никакого custom
 * CSS вне brand-guide.
 *
 * 13 секций master-template. Здесь — 5 critical placeholders для C5
 * content-fill кандидатов:
 *   - tldr           (если cw ещё не написал)
 *   - process        (новый sustained блок, ждёт C5 + design wave)
 *   - pricing-block  (новый sustained блок, ждёт C5 + design wave)
 *   - mini-case      (если кейс ещё не отснят)
 *   - lead-form      (всегда required — должна быть, fallback на минимальную форму)
 *
 * Остальные 8 — sustained блоки (hero/breadcrumbs/services-grid/calculator/
 * faq/cta-banner/related-services/neighbor-districts) — у них есть base-state
 * рендеры в `BlockRenderer.tsx`. Им не нужен отдельный placeholder.
 */

import * as React from 'react'

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

interface PlaceholderShellProps {
  eyebrow: string
  title: string
  body: string
  /**
   * Anchor в brand-guide для design review (audit-trail). Optional.
   */
  brandGuideAnchor?: string
}

/**
 * Generic shell для всех placeholder'ов — единый layout / spacing.
 * Использует sustained tokens (.text-muted, .border-line, --pad, --radius).
 */
function PlaceholderShell({ eyebrow, title, body, brandGuideAnchor }: PlaceholderShellProps) {
  return (
    <section
      data-placeholder
      aria-label={`${title} (черновик, в работе)`}
      className="bg-bg-alt my-12 sm:my-16"
    >
      <div className="mx-auto max-w-3xl px-[var(--pad)] py-10 sm:py-12">
        <div className="border-line bg-card rounded-[var(--radius)] border border-dashed p-6 sm:p-8">
          <p className="text-muted text-xs tracking-wide uppercase">{eyebrow}</p>
          <h2 className="text-ink mt-2 text-xl font-semibold sm:text-2xl">{title}</h2>
          <p className="text-muted mt-3 text-sm leading-relaxed sm:text-base">{body}</p>
          {brandGuideAnchor && process.env.NODE_ENV !== 'production' && (
            <p className="text-muted mt-4 text-xs italic">
              brand-guide: <code>{brandGuideAnchor}</code>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Per-section placeholders
// ────────────────────────────────────────────────────────────────────────────

/**
 * TL;DR placeholder — section.order=3, presence=required для T2/T3/T4.
 * cw seed candidate. brand-guide v2.6 §tldr-block.
 */
export function TldrPlaceholderBlock() {
  return (
    <PlaceholderShell
      eyebrow="Если коротко"
      title="TL;DR будет добавлен"
      body="Кратко за 30 секунд: 3-5 пунктов с цифрами и ссылками. cw готовит текст по брифу — публикуем через Payload в течение 24 часов."
      brandGuideAnchor="#tldr-block"
    />
  )
}

/**
 * Process steps placeholder — section.order=7, presence=required для T2/T3/T4.
 * Новый блок (нет sustained Payload Block), ждёт C5 + design wave.
 * brand-guide v2.5 §process-steps.
 */
export function ProcessPlaceholderBlock() {
  return (
    <PlaceholderShell
      eyebrow="Как мы работаем"
      title="Шаги работы добавляются"
      body="Этапы оказания услуги: 4-7 шагов с эта́па и ответственным. Дизайн и текст готовим по брифу sustained brand-guide §process-steps."
      brandGuideAnchor="#process-steps"
    />
  )
}

/**
 * Pricing-block placeholder — section.order=5, presence=required для T2/T3/T4.
 * Новый блок (нет sustained Payload Block), ждёт C5 + design wave.
 * brand-guide v2.4 §pricing-table.
 */
export function PricingPlaceholderBlock() {
  return (
    <PlaceholderShell
      eyebrow="Цены"
      title="Прайс-лист добавляется"
      body="3-tier pricing (Базовый / Стандарт / Под ключ) или price-list по работам. Точная цена — после фото в Telegram, MAX или WhatsApp за 10 минут."
      brandGuideAnchor="#pricing-table"
    />
  )
}

/**
 * Mini-case placeholder — section.order=8, presence=required для T2/T4
 * (optional T3). brand-guide v2.5 §mini-case.
 */
export function MiniCasePlaceholderBlock() {
  return (
    <PlaceholderShell
      eyebrow="Кейс"
      title="Свежий кейс готовится"
      body="Фото до/после + 3-4 KPI (срок, объём, стоимость). Архив всех кейсов pillar — на странице sustained /kejsy/."
      brandGuideAnchor="#mini-case"
    />
  )
}

/**
 * Lead-form placeholder — section.order=13, presence=required для T2/T3/T4.
 * Sustained блок (LeadForm.tsx), но при отсутствии в БД render минимальной
 * fallback-формы с кнопкой messengers (без отправки на Payload Leads — это
 * только safety-net на случай если cw / dev забыли seed).
 */
export function LeadFormPlaceholderBlock() {
  return (
    <PlaceholderShell
      eyebrow="Заявка"
      title="Свяжитесь с нами"
      body="Форма заявки настраивается. Пока — пишите в Telegram, MAX или WhatsApp: ответим за 10 минут и пришлём смету по фото."
      brandGuideAnchor="#lead-form-full"
    />
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Lookup map
// ────────────────────────────────────────────────────────────────────────────

/**
 * Map blockType → placeholder component. Используется в `BlockRenderer.tsx`
 * через `block._placeholder === true` branch.
 *
 * Только для секций которые нужны в C5 content-fill. Остальные 8 — рендерятся
 * через sustained block-component (Hero / Breadcrumbs / etc) с пустыми
 * пропсами — они уже handle empty state из brand-guide §«Empty states».
 */
export const PLACEHOLDER_BY_BLOCK_TYPE: Record<string, React.ComponentType> = {
  tldr: TldrPlaceholderBlock,
  process: ProcessPlaceholderBlock,
  'pricing-block': PricingPlaceholderBlock,
  'mini-case': MiniCasePlaceholderBlock,
  'lead-form': LeadFormPlaceholderBlock,
}
