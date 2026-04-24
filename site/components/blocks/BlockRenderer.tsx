import { CtaBanner } from './CtaBanner'
import { Faq } from './Faq'
import { Hero } from './Hero'
import { LeadForm } from './LeadForm'
import { TextContent } from './TextContent'
import type { AnyBlock } from './types'

/**
 * Рендерит массив блоков из Payload `blocks[]` поля.
 *
 * Отключённые блоки (`enabled === false`) пропускаются.
 * Неизвестные blockType — тихо игнорируются (forward-compat: be4 может
 * добавить блок 6..15, а fe1 — дорасти в следующей итерации).
 *
 * TODO(fe1): поддержать оставшиеся 10 блоков из sa.md §3:
 * photo-estimate-form, calculator, cases-carousel, services-grid,
 * districts-grid, trust-badges, testimonials, promotion-banner,
 * map-region, video.
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
