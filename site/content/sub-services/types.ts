import type { V3BlockWithTone } from '@/components/blocks/v3/types'

/** Начальное наполнение подуслуги: адрес /service/slug/, SEO и блоки в формате рендера. */
export type SubServiceContent = {
  service: string
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  blocks: V3BlockWithTone[]
}
