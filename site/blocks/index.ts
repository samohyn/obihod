/**
 * Библиотека блоков Payload (US-0 Track B-2 + EPIC-SERVICE-PAGES-REDESIGN D3 wave A).
 *
 * Используется в коллекциях через `type: 'blocks'`.
 *
 * 5 базовых: Hero, TextContent, LeadForm, CtaBanner, Faq.
 * 7 US-0: Breadcrumbs, Tldr, ServicesGrid, MiniCase, RelatedServices,
 *         NeighborDistricts, Calculator.
 * 11 v2.6 (D3 wave A): ServiceHero, CalculatorShell, LeadFormFull, PricingTable,
 *                       ProcessSteps, TrustBlock, MiniCaseV2, FaqAccordion,
 *                       BreadcrumbsV2, TldrV2, DistrictChips.
 *
 * Total: 23 blocks.
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

// EPIC-SERVICE-PAGES-REDESIGN D3 wave A — 11 v2.6 blocks
export { ServiceHero } from './ServiceHero'
export { CalculatorShell } from './CalculatorShell'
export { LeadFormFull } from './LeadFormFull'
export { PricingTable } from './PricingTable'
export { ProcessSteps } from './ProcessSteps'
export { TrustBlock } from './TrustBlock'
export { MiniCaseV2 } from './MiniCaseV2'
export { FaqAccordion } from './FaqAccordion'
export { BreadcrumbsV2 } from './BreadcrumbsV2'
export { TldrV2 } from './TldrV2'
export { DistrictChips } from './DistrictChips'

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

import { ServiceHero } from './ServiceHero'
import { CalculatorShell } from './CalculatorShell'
import { LeadFormFull } from './LeadFormFull'
import { PricingTable } from './PricingTable'
import { ProcessSteps } from './ProcessSteps'
import { TrustBlock } from './TrustBlock'
import { MiniCaseV2 } from './MiniCaseV2'
import { FaqAccordion } from './FaqAccordion'
import { BreadcrumbsV2 } from './BreadcrumbsV2'
import { TldrV2 } from './TldrV2'
import { DistrictChips } from './DistrictChips'

import type { Block } from 'payload'

/**
 * Полный набор блоков (23 шт).
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
  // D3 wave A — v2.6 service-page blocks
  ServiceHero,
  CalculatorShell,
  LeadFormFull,
  PricingTable,
  ProcessSteps,
  TrustBlock,
  MiniCaseV2,
  FaqAccordion,
  BreadcrumbsV2,
  TldrV2,
  DistrictChips,
]
