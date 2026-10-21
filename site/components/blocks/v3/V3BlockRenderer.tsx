// Рендер блоков библиотеки v3: один путь для любой страницы (план 09, раздел 5).
// Выключенные блоки (enabled === false) пропускаются, неизвестные — тоже (совместимость вперёд).

import { AboutStats } from './AboutStats'
import { Articles } from './Articles'
import { B2bPlan } from './B2bPlan'
import { Calculator } from './Calculator'
import { Documents } from './Documents'
import { Equipment } from './Equipment'
import { FaqV3 } from './FaqV3'
import { FinalForm } from './FinalForm'
import { Guarantees } from './Guarantees'
import { HeroSlider } from './HeroSlider'
import { LegalDoc } from './LegalDoc'
import { ObjectsMap } from './ObjectsMap'
import { PhotoCta } from './PhotoCta'
import { PriceTabs } from './PriceTabs'
import { Projects } from './Projects'
import { Promotions } from './Promotions'
import { Reviews } from './Reviews'
import { ServicesTiles } from './ServicesTiles'
import { Steps } from './Steps'
import { Team } from './Team'
import { TreeCheck } from './TreeCheck'
import { VideoGallery } from './VideoGallery'
import type { V3BlockWithTone } from './types'
import { getCompany, type Company } from '@/lib/company'

function renderBlock(block: V3BlockWithTone, key: string, company: Company, phoneDisplay?: string) {
  const tone = block.tone ?? undefined
  switch (block.blockType) {
    case 'hero-slider':
      return <HeroSlider key={key} {...block} />
    case 'services-tiles':
      return <ServicesTiles key={key} {...block} tone={tone} />
    case 'about-stats':
      return <AboutStats key={key} {...block} tone={tone} />
    case 'equipment':
      return <Equipment key={key} {...block} tone={tone} />
    case 'projects':
      return <Projects key={key} {...block} tone={tone} />
    case 'video-gallery':
      return <VideoGallery key={key} {...block} tone={tone} />
    case 'promotions':
      return <Promotions key={key} {...block} tone={tone} />
    case 'team':
      return <Team key={key} {...block} tone={tone} />
    case 'calculator-v3':
      return <Calculator key={key} {...block} tone={tone} />
    case 'steps':
      return <Steps key={key} {...block} tone={tone} />
    case 'price-tabs':
      return <PriceTabs key={key} {...block} tone={tone} />
    case 'photo-cta':
      return <PhotoCta key={key} {...block} />
    case 'reviews-v3':
      return <Reviews key={key} {...block} tone={tone} />
    case 'documents':
      return <Documents key={key} {...block} tone={tone} />
    case 'b2b-plan':
      return <B2bPlan key={key} {...block} tone={tone} />
    case 'tree-check':
      return <TreeCheck key={key} {...block} tone={tone} />
    case 'articles':
      return <Articles key={key} {...block} tone={tone} />
    case 'objects-map':
      return (
        <ObjectsMap
          key={key}
          {...block}
          tone={tone}
          rings={[company.emergencyRadiusKm, company.freeVisitRadiusKm]}
        />
      )
    case 'guarantees':
      return <Guarantees key={key} {...block} tone={tone} />
    case 'faq-v3':
      return <FaqV3 key={key} {...block} tone={tone} />
    case 'final-form':
      return <FinalForm key={key} {...block} phoneDisplay={phoneDisplay} />
    case 'legal-doc':
      return <LegalDoc key={key} {...block} tone={tone} />
    default:
      return null
  }
}

export async function V3BlockRenderer({
  blocks,
  phoneDisplay,
}: {
  blocks: V3BlockWithTone[] | null | undefined
  phoneDisplay?: string
}) {
  if (!blocks?.length) return null
  const company = await getCompany()
  return (
    <>
      {blocks
        .filter((b) => b && b.enabled !== false)
        .map((b, i) => renderBlock(b, b.id ?? `${b.blockType}-${i}`, company, phoneDisplay))}
    </>
  )
}
