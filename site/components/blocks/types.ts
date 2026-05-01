/**
 * Общие типы блоков для публичного рендера.
 *
 * TODO(be4): после того как Payload сгенерирует `site/payload-types.ts`
 * с `ServiceDistrictBlocks` (или аналогичный union), импортировать оттуда
 * и выпилить локальные интерфейсы ниже. Сейчас форма — по sa.md §3.
 */

export type SeasonalTheme = 'summer' | 'winter' | 'promo'
export type CtaAccent = 'primary' | 'warning' | 'success'

/**
 * Иконки из brand-guide §9 — line-art glyph'ы в 4 линейках.
 * Префикс задаёт линейку (`s-` services, `sh-` shop, `d-` districts, `c-` cases).
 * Полный реестр (49 шт.) — в brand-guide.html §9; здесь — только тип-ключ.
 */
export type IconLine = 'services' | 'shop' | 'districts' | 'cases'

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

// ---------- 7 новых блоков (US-0, AC-2) ----------

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface BreadcrumbsBlock extends BlockBase {
  blockType: 'breadcrumbs'
  items?: BreadcrumbItem[] | null
  /**
   * Если true (по умолчанию) — инжектит JSON-LD BreadcrumbList в DOM.
   * Отключить можно для страниц, где breadcrumbs уже инжектится layout-ом.
   */
  generateSchema?: boolean | null
}

export interface TldrBlock extends BlockBase {
  blockType: 'tldr'
  /** Eyebrow по умолчанию: «Если коротко» — нейро-формат. */
  eyebrow?: string | null
  /** Plain-текст вариант (приоритетнее body). 2-3 предложения. */
  text?: string | null
  /** Lexical serialized state (если структурированный). */
  body?: unknown
}

export interface ServicesGridItem {
  title: string
  slug: string
  /** Ключ иконки из brand-guide §9 services line: `s-musor`, `s-spil`, `s-krysha`, ... */
  icon?: string | null
  summary?: string | null
}

export interface ServicesGridBlock extends BlockBase {
  blockType: 'services-grid'
  heading?: string | null
  eyebrow?: string | null
  items?: ServicesGridItem[] | null
}

export interface MiniCaseFact {
  label: string
  value: string
}

export interface MiniCaseInline {
  title: string
  photo?: MediaRef | string | null
  facts?: MiniCaseFact[] | null
  link?: string | null
}

/**
 * MiniCase — карточка кейса. Может быть relationship к Cases (через caseRef)
 * либо inline-данные. Минимум один из них должен быть задан.
 */
export interface MiniCaseBlock extends BlockBase {
  blockType: 'mini-case'
  caseRef?: { id?: string; slug?: string; title?: string } | string | null
  inline?: MiniCaseInline | null
}

export interface RelatedServiceItem {
  title: string
  slug: string
  summary?: string | null
}

export interface RelatedServicesBlock extends BlockBase {
  blockType: 'related-services'
  heading?: string | null
  /** 1..3 элемента; больше — обрезается. */
  items?: RelatedServiceItem[] | null
}

export interface NeighborDistrictItem {
  name: string
  slug: string
  /** Расстояние «сколько-то км» от текущего района (если известно). */
  distance?: string | null
}

export interface NeighborDistrictsBlock extends BlockBase {
  blockType: 'neighbor-districts'
  heading?: string | null
  /** 1..3 элемента; больше — обрезается. */
  items?: NeighborDistrictItem[] | null
  /** Линка на сервис (если блок используется на /<service>/<district>/). */
  serviceSlug?: string | null
}

export type CalculatorServiceType = 'spil' | 'musor' | 'krysha' | 'demontazh' | null

/**
 * Calculator placeholder — НЕ реальная логика расчёта.
 * Карточка-приглашение «Расчёт стоимости — в разработке» + CTA на `/foto-smeta/`.
 *
 * TODO(pa-site): реальная логика рендера форм-калькулятора — отдельная US.
 * Пока этот блок занимает «слот» в шаблонах, чтобы wireframe-ы и эталоны
 * выглядели полно, но clicked-CTA уводит на работающую foto-смета форму.
 */
export interface CalculatorBlock extends BlockBase {
  blockType: 'calculator-placeholder'
  heading?: string | null
  body?: string | null
  serviceType?: CalculatorServiceType
  ctaLabel?: string | null
  ctaHref?: string | null
}

export type AnyBlock =
  | HeroBlock
  | TextContentBlock
  | LeadFormBlock
  | CtaBannerBlock
  | FaqBlock
  | BreadcrumbsBlock
  | TldrBlock
  | ServicesGridBlock
  | MiniCaseBlock
  | RelatedServicesBlock
  | NeighborDistrictsBlock
  | CalculatorBlock
