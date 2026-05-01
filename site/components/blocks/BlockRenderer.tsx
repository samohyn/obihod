import { Breadcrumbs } from './Breadcrumbs'
import { Calculator } from './Calculator'
import { CtaBanner } from './CtaBanner'
import { Faq } from './Faq'
import { Hero } from './Hero'
import { LeadForm } from './LeadForm'
import { MiniCase } from './MiniCase'
import { NeighborDistricts } from './NeighborDistricts'
import { RelatedServices } from './RelatedServices'
import { ServicesGrid } from './ServicesGrid'
import { TextContent } from './TextContent'
import { Tldr } from './Tldr'
import type { AnyBlock } from './types'

/**
 * Рендерит массив блоков из Payload `blocks[]` поля.
 *
 * Отключённые блоки (`enabled === false`) пропускаются.
 * Неизвестные blockType — тихо игнорируются (forward-compat: be4 может
 * добавить блок 13..N, а fe1 — дорасти в следующей итерации).
 *
 * Поддерживается 12 блоков (5 базовых + 7 новых из US-0).
 * Будущие кандидаты (backlog): photo-estimate-form, cases-carousel,
 * districts-grid, trust-badges, testimonials, promotion-banner,
 * map-region, video, before-after.
 */
export function BlockRenderer({ blocks }: { blocks: AnyBlock[] | null | undefined }) {
  if (!blocks || blocks.length === 0) return null

  const list = blocks.filter((b) => b && b.enabled !== false)

  return (
    <>
      {list.map((block, i) => {
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
          case 'neighbor-districts':
            return <NeighborDistricts key={block.id ?? i} {...block} />
          case 'calculator-placeholder':
            return <Calculator key={block.id ?? i} {...block} />
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
