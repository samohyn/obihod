import { SeasonCalendar } from '@/components/marketing/_shared/graphics'
import { B2B } from '@/components/marketing/sections/B2B'
import { Calculator } from '@/components/marketing/sections/Calculator'
import { Cases } from '@/components/marketing/sections/Cases'
import { CtaFooter } from '@/components/marketing/sections/CtaFooter'
import { FAQ } from '@/components/marketing/sections/FAQ'
import { Guarantees } from '@/components/marketing/sections/Guarantees'
import { Hero } from '@/components/marketing/sections/Hero'
import { How } from '@/components/marketing/sections/How'
import { Reviews } from '@/components/marketing/sections/Reviews'
import { Services } from '@/components/marketing/sections/Services'
import { Subscription } from '@/components/marketing/sections/Subscription'
import { Team } from '@/components/marketing/sections/Team'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <section id="calendar" className="band-alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">§&nbsp;02 · Круглый год</span>
              <h2 className="h-xl">
                Сезонная карта<br />услуг.
              </h2>
            </div>
            <p className="section-sub">
              Каждая услуга — в свой сезон. Абонемент «Обиход.Участок» закрывает все&nbsp;четыре
              без&nbsp;дополнительных звонков: весной — обрезка, летом — демонтаж, осенью — вывоз, зимой — снег.
            </p>
          </div>
          <SeasonCalendar />
        </div>
      </section>
      <Calculator />
      <How />
      <Guarantees />
      <Cases />
      <Subscription />
      <Reviews />
      <Team />
      <B2B />
      <FAQ />
      <CtaFooter />
    </>
  )
}
