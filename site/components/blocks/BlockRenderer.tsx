import { Breadcrumbs } from './Breadcrumbs'
import { BreadcrumbsV2 } from './BreadcrumbsV2'
import { Calculator } from './Calculator'
import { CalculatorShell } from './CalculatorShell'
import { CtaBanner } from './CtaBanner'
import { DistrictChips } from './DistrictChips'
import { Faq } from './Faq'
import { FaqAccordion } from './FaqAccordion'
import { Hero } from './Hero'
import { LeadForm } from './LeadForm'
import { LeadFormFull } from './LeadFormFull'
import { MiniCase } from './MiniCase'
import { MiniCaseV2 } from './MiniCaseV2'
import { NeighborDistricts } from './NeighborDistricts'
import { PricingTable } from './PricingTable'
import { ProcessSteps } from './ProcessSteps'
import { RelatedPosts } from './RelatedPosts'
import { RelatedServices } from './RelatedServices'
import { ServiceHero } from './ServiceHero'
import { ServicesGrid } from './ServicesGrid'
import { TextContent } from './TextContent'
import { Tldr } from './Tldr'
import { TldrV2 } from './TldrV2'
import { TrustBlock } from './TrustBlock'
import { PLACEHOLDER_BY_BLOCK_TYPE } from './placeholders'
import type { AnyBlock } from './types'

/**
 * Рендерит массив блоков из Payload `blocks[]` поля.
 *
 * Отключённые блоки (`enabled === false`) пропускаются.
 * Неизвестные blockType — тихо игнорируются (forward-compat: be4 может
 * добавить блок 13..N, а fe1 — дорасти в следующей итерации).
 *
 * Поддерживается 23 блока:
 *  - 12 базовых (5 US-0 W3 + 7 расширение): hero, text-content, lead-form,
 *    cta-banner, faq, breadcrumbs, tldr, services-grid, mini-case,
 *    related-services, related-posts, neighbor-districts, calculator-placeholder.
 *  - 11 новых из EPIC-SERVICE-PAGES-REDESIGN D3 wave A (brand-guide v2.6):
 *    service-hero, calculator-shell, lead-form-full, pricing-table,
 *    process-steps, trust-block, mini-case-v2, faq-accordion, breadcrumbs-v2,
 *    tldr-v2, district-chips.
 *
 * Будущие кандидаты (backlog): cases-carousel, testimonials, promotion-banner,
 * map-region, video, before-after.
 */
export function BlockRenderer({ blocks }: { blocks: AnyBlock[] | null | undefined }) {
  if (!blocks || blocks.length === 0) return null

  const list = blocks.filter((b) => b && b.enabled !== false)

  return (
    <>
      {list.map((block, i) => {
        // EPIC-SERVICE-PAGES-UX C4 — placeholder branch.
        // Resolver `getBlocksForLayer` помечает missing required sections через
        // `_placeholder: true`. Если есть TODO-копия для blockType — рендерим её
        // вместо sustained block-component.
        if ((block as { _placeholder?: boolean })._placeholder === true) {
          const Placeholder = PLACEHOLDER_BY_BLOCK_TYPE[block.blockType]
          if (Placeholder) {
            return <Placeholder key={block.id ?? `placeholder-${i}`} />
          }
          // Fallback — нет placeholder'а для этого blockType, рендерим sustained
          // block-component (он покажет brand-guide §«Empty state»).
        }

        // discriminated union на blockType
        switch (block.blockType) {
          case 'hero':
            return <Hero key={block.id ?? i} {...block} />
          case 'text-content':
            return <TextContent key={block.id ?? i} {...block} />
          case 'lead-form':
            return <LeadForm key={block.id ?? i} {...block} />
          case 'cta-banner':
            return <CtaBanner key={block.id ?? i} {...block} />
          case 'faq':
            return <Faq key={block.id ?? i} {...block} />
          case 'breadcrumbs':
            return <Breadcrumbs key={block.id ?? i} {...block} />
          case 'tldr':
            return <Tldr key={block.id ?? i} {...block} />
          case 'services-grid':
            return <ServicesGrid key={block.id ?? i} {...block} />
          case 'mini-case':
            return <MiniCase key={block.id ?? i} {...block} />
          case 'related-services':
            return <RelatedServices key={block.id ?? i} {...block} />
          case 'related-posts':
            return <RelatedPosts key={block.id ?? i} {...block} />
          case 'neighbor-districts':
            return <NeighborDistricts key={block.id ?? i} {...block} />
          case 'calculator-placeholder':
            return <Calculator key={block.id ?? i} {...block} />
          // EPIC-SERVICE-PAGES-REDESIGN D3 wave A — 11 new blocks
          case 'service-hero':
            return <ServiceHero key={block.id ?? i} {...block} />
          case 'calculator-shell':
            return <CalculatorShell key={block.id ?? i} {...block} />
          case 'lead-form-full':
            return <LeadFormFull key={block.id ?? i} {...block} />
          case 'pricing-table':
            return <PricingTable key={block.id ?? i} {...block} />
          case 'process-steps':
            return <ProcessSteps key={block.id ?? i} {...block} />
          case 'trust-block':
            return <TrustBlock key={block.id ?? i} {...block} />
          case 'mini-case-v2':
            return <MiniCaseV2 key={block.id ?? i} {...block} />
          case 'faq-accordion':
            return <FaqAccordion key={block.id ?? i} {...block} />
          case 'breadcrumbs-v2':
            return <BreadcrumbsV2 key={block.id ?? i} {...block} />
          case 'tldr-v2':
            return <TldrV2 key={block.id ?? i} {...block} />
          case 'district-chips':
            return <DistrictChips key={block.id ?? i} {...block} />
          default:
            if (process.env.NODE_ENV !== 'production') {
              // Полезно в dev: подскажет, что be4 добавил новый тип.
              console.warn(
                `[BlockRenderer] Неизвестный blockType: ${(block as { blockType: string }).blockType}`,
              )
            }
            return null
        }
      })}
    </>
  )
}
