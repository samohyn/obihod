/**
 * Библиотека блоков Payload (US-0 Track B-2 — расширение волны 1 на 12 блоков).
 *
 * Используется в коллекциях через `type: 'blocks'`.
 * Sa-spec US-0 AC-2 + US-3 sa-spec §3, §4 (matrix коллекция × разрешённые блоки).
 *
 * 5 базовых: Hero, TextContent, LeadForm, CtaBanner, Faq.
 * 7 новых (US-0 AC-2): Breadcrumbs, Tldr, ServicesGrid, MiniCase, RelatedServices,
 *                       NeighborDistricts, Calculator.
 */
export { Hero } from './Hero'
export { TextContent } from './TextContent'
export { LeadForm } from './LeadForm'
export { CtaBanner } from './CtaBanner'
export { Faq } from './Faq'
export { Breadcrumbs } from './Breadcrumbs'
export { Tldr } from './Tldr'
export { ServicesGrid } from './ServicesGrid'
export { MiniCase } from './MiniCase'
export { RelatedServices } from './RelatedServices'
export { NeighborDistricts } from './NeighborDistricts'
export { Calculator } from './Calculator'

import { Hero } from './Hero'
import { TextContent } from './TextContent'
import { LeadForm } from './LeadForm'
import { CtaBanner } from './CtaBanner'
import { Faq } from './Faq'
import { Breadcrumbs } from './Breadcrumbs'
import { Tldr } from './Tldr'
import { ServicesGrid } from './ServicesGrid'
import { MiniCase } from './MiniCase'
import { RelatedServices } from './RelatedServices'
import { NeighborDistricts } from './NeighborDistricts'
import { Calculator } from './Calculator'

import type { Block } from 'payload'

/**
 * Полный набор блоков (12 шт).
 *
 * Передаётся в `blocks: [...allBlocks]` коллекции, либо подмножество через
 * matrix-фильтр (whitelist на коллекцию — см. US-0 spec §AC-3.1 + Track B-2
 * mandate).
 */
export const allBlocks: Block[] = [
  Hero,
  TextContent,
  LeadForm,
  CtaBanner,
  Faq,
  Breadcrumbs,
  Tldr,
  ServicesGrid,
  MiniCase,
  RelatedServices,
  NeighborDistricts,
  Calculator,
]
