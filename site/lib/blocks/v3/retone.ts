import type { V3BlockWithTone } from '@/components/blocks/v3/types'

/** Блоки со своим фоном — в чередование не входят. */
const OWN_TONE = new Set(['hero-slider', 'photo-cta', 'final-form', 'b2b-plan'])

/** Фон секций чередуется: кремовый / бежевый, кроме секций со своим фоном. */
export function retone(blocks: V3BlockWithTone[]): V3BlockWithTone[] {
  let alt = false
  return blocks.map((b) => {
    if (OWN_TONE.has(b.blockType)) return b
    const tone = alt ? 'alt' : 'default'
    alt = !alt
    return { ...b, tone } as V3BlockWithTone
  })
}
