import { RingsPattern } from '../_shared/graphics'
import { LeadForm } from './LeadForm'

export function CtaFooter() {
  return (
    <section className="cta-final" id="contact">
      <div className="rings-bg">
        <RingsPattern opacity={0.2} id="rings-cta" />
      </div>
      <div className="wrap">
        <div className="cta-box">
          <div>
            <span
              className="eyebrow"
              style={{ color: 'color-mix(in oklab, var(--c-accent) 90%, transparent)' }}
            >
              ПОЗВОНИЛИ — ДАЛЬШЕ МЫ
            </span>
            <h2 className="h-xl" style={{ marginTop: '16px' }}>
              Оставьте заявку — замерщик приедет в&nbsp;течение 24&nbsp;часов.
            </h2>
            <p className="lead" style={{ marginTop: '20px' }}>
              Бесплатно, без обязательств. Назовём точную цену, согласуем удобный день
              и&nbsp;зафиксируем её&nbsp;в&nbsp;договоре.
            </p>
          </div>
          <LeadForm />
        </div>
      </div>
    </section>
  )
}
