import type { Metadata } from 'next'

import { canonicalFor } from '@/lib/seo/canonical'

// US-7 audit fix: главная без canonical — добавляем self-canonical
// чтобы избежать дубликатов при utm_*/?ref= параметрах.
export const metadata: Metadata = {
  alternates: { canonical: canonicalFor('/') },
}

import { Cases } from '@/components/marketing/sections/Cases'
import { Coverage } from '@/components/marketing/sections/Coverage'
import { CtaFooter } from '@/components/marketing/sections/CtaFooter'
import { FAQ } from '@/components/marketing/sections/FAQ'
import { Guarantees } from '@/components/marketing/sections/Guarantees'
import { Hero } from '@/components/marketing/sections/Hero'
import { How } from '@/components/marketing/sections/How'
import { PhotoSmeta } from '@/components/marketing/sections/PhotoSmeta'
import { PricingTable } from '@/components/marketing/sections/PricingTable'
import { Reviews } from '@/components/marketing/sections/Reviews'
import { Services } from '@/components/marketing/sections/Services'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <How />
      <PricingTable />
      <PhotoSmeta />
      <Cases />
      <Reviews />
      <Guarantees />
      <Coverage />
      <FAQ />
      <CtaFooter />
    </>
  )
}
