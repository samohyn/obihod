// brand-guide v2.6 §process-steps (line 1341+)
// EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10 · fe role
//
// 4-7 шагов вертикальный timeline (mobile-first) + horizontal variant @≥1100px.
// Step-num pill 56px + ETA pill optional. Reduced-motion guard через CSS-class.
// Server component (no client interactivity).

import type { ProcessStepsBlock } from './types'

export function ProcessSteps(block: ProcessStepsBlock) {
  const steps = block.steps ?? []
  if (steps.length === 0) return null

  const heading = block.h2 ?? null
  const helper = block.helper ?? null
  const layout = block.layout ?? 'vertical'
  const layoutClass = layout === 'horizontal' ? 'horizontal' : ''

  return (
    <section
      id={block.anchor ?? undefined}
      style={{ padding: 'clamp(48px, 8vw, 96px) 0', background: 'var(--c-bg)' }}
    >
      <div className="wrap">
        {heading && (
          <h2 className="h-l" style={{ marginBottom: helper ? 12 : 32, maxWidth: 760 }}>
            {heading}
          </h2>
        )}
        {helper && (
          <p
            className="lead"
            style={{ marginBottom: 40, maxWidth: 720, color: 'var(--c-ink-soft)' }}
          >
            {helper}
          </p>
        )}

        <ol
          className={`sp-process-steps ${layoutClass}`}
          style={
            layout === 'horizontal'
              ? ({ ['--steps' as string]: String(steps.length) } as React.CSSProperties)
              : undefined
          }
        >
          {steps.map((step, i) => (
            <li key={`step-${i}`} className="sp-process-step">
              <span className="sp-step-num" aria-hidden>
                {step.num ?? i + 1}
              </span>
              <div className="sp-step-body">
                <h3 className="sp-step-title">{step.title}</h3>
                {step.description && <p className="sp-step-desc">{step.description}</p>}
                {step.eta && <span className="sp-step-eta">{step.eta}</span>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
