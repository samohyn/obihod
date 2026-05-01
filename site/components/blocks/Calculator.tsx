import Link from 'next/link'

import type { CalculatorBlock } from './types'

/**
 * Calculator — PLACEHOLDER (НЕ реальная логика).
 *
 * Карточка-приглашение «Расчёт стоимости — в разработке» + CTA на /foto-smeta/.
 * Занимает «слот» в шаблонах (pillar / sub / sd / b2b), чтобы wireframe-ы
 * выглядели полно и оператор апрувил эталоны W3.
 *
 * TODO(pa-site): реальная логика — отдельная US с product analyst (формы,
 * расчёт по площади / объёму / дереву, A/B на CR). Пока этот блок только
 * показывает «скоро» и уводит на работающую foto-смета форму.
 *
 * Server component (нет интерактивности — только Link). Когда появится
 * настоящий калькулятор, нужно будет добавить "use client" и интерактивную
 * форму, и выпилить эту карточку (или задизайнить как fallback).
 *
 * Контракт: US-0 sa-seo AC-2.5 «Calculator — placeholder с TODO для
 * US-расчёт; рендерит карточку «Калькулятор стоимости — скоро» + CTA
 * «Запросить смету через фото»».
 */

const SERVICE_LABELS: Record<string, string> = {
  spil: 'спил деревьев',
  musor: 'вывоз мусора',
  krysha: 'чистку крыш',
  demontazh: 'демонтаж',
}

export function Calculator(block: CalculatorBlock) {
  const serviceLabel = block.serviceType ? SERVICE_LABELS[block.serviceType] : null

  const heading = block.heading ?? 'Калькулятор стоимости — в разработке'
  const body =
    block.body ??
    (serviceLabel
      ? `Точная цена на ${serviceLabel} зависит от объекта. Пришлите фото — пересчитаем за 15 минут с точностью до рубля.`
      : 'Точная цена зависит от объекта. Пришлите фото — пересчитаем за 15 минут с точностью до рубля.')
  const ctaLabel = block.ctaLabel ?? 'Запросить смету через фото'
  const ctaHref = block.ctaHref ?? '/foto-smeta/'

  return (
    <section id={block.anchor ?? undefined} style={{ padding: 'clamp(48px, 8vw, 80px) 0' }}>
      <div className="wrap" style={{ maxWidth: 720 }}>
        <div
          style={{
            background: 'var(--c-bg)',
            border: '1px dashed color-mix(in oklab, var(--c-primary) 40%, transparent)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(24px, 4vw, 40px)',
            textAlign: 'left',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: 999,
              background: 'color-mix(in oklab, var(--c-accent) 18%, var(--c-bg))',
              color: 'var(--c-accent-ink)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Скоро
          </span>

          <h2
            className="h-l"
            style={{
              margin: '0 0 12px',
              fontSize: 'clamp(20px, 2.4vw, 28px)',
            }}
          >
            {heading}
          </h2>

          <p
            style={{
              margin: '0 0 24px',
              fontSize: 'clamp(15px, 1.5vw, 17px)',
              lineHeight: 1.55,
              color: 'var(--c-ink-soft)',
            }}
          >
            {body}
          </p>

          <Link
            href={ctaHref}
            className="btn btn-primary btn-lg"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 44,
            }}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
