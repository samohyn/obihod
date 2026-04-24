/**
 * Общие типы блоков для публичного рендера.
 *
 * TODO(be4): после того как Payload сгенерирует `site/payload-types.ts`
 * с `ServiceDistrictBlocks` (или аналогичный union), импортировать оттуда
 * и выпилить локальные интерфейсы ниже. Сейчас форма — по sa.md §3.
 */

export type SeasonalTheme = 'summer' | 'winter' | 'promo'
export type CtaAccent = 'primary' | 'warning' | 'success'

export interface CtaLink {
  label?: string | null
  href?: string | null
  variant?: 'primary' | 'ghost' | null
}

export interface MediaRef {
  id?: string | number
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

export interface BlockBase {
  id?: string | null
  blockType: string
  blockName?: string | null
  enabled?: boolean | null
  anchor?: string | null
}

export interface HeroBlock extends BlockBase {
  blockType: 'hero'
  heading?: string | null
  subheading?: string | null
  primaryCta?: CtaLink | null
  secondaryCta?: { label?: string | null; href?: string | null } | null
  backgroundMedia?: MediaRef | string | null
  overlayOpacity?: number | null
  seasonalTheme?: SeasonalTheme | null
}

export interface TextContentBlock extends BlockBase {
  blockType: 'text-content'
  eyebrow?: string | null
  heading?: string | null
  body?: unknown // Lexical serialized state
  columns?: '1' | '2' | null
}

export interface LeadFormBlock extends BlockBase {
  blockType: 'lead-form'
  heading?: string | null
  subheading?: string | null
  serviceHint?: { id?: string; slug?: string; title?: string } | string | null
  districtHint?: { id?: string; slug?: string; nameNominative?: string } | string | null
  successMessage?: string | null
  consentText?: string | null
}

export interface CtaBannerBlock extends BlockBase {
  blockType: 'cta-banner'
  heading?: string | null
  body?: string | null
  cta?: { label?: string | null; href?: string | null } | null
  variant?: 'primary' | 'dark' | 'accent' | null
  accent?: CtaAccent | null
}

export interface FaqItem {
  question?: string | null
  answer?: unknown // Lexical
}

export interface FaqBlock extends BlockBase {
  blockType: 'faq'
  heading?: string | null
  items?: FaqItem[] | null
  generateFaqPageSchema?: boolean | null
}

export type AnyBlock = HeroBlock | TextContentBlock | LeadFormBlock | CtaBannerBlock | FaqBlock
