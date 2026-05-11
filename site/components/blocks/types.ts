/**
 * Общие типы блоков для публичного рендера.
 *
 * Эта версия (US-0 W3 Track B-3 Consolidation Fix) — обратно совместимая
 * union: новые поля по cw-схеме (h1, eyebrow, ctaPrimary, items[].label/href,
 * iconId, priceAnchor, imageUrl) — приоритетные; старые поля Track B-1
 * (heading, subheading, primaryCta, items[].name/url, icon) — deprecated, но
 * остаются для legacy-данных и для совместимости с Payload Block configs до
 * полной миграции БД на новую схему.
 *
 * Renderer-приоритет: смотрим сначала новое поле (h1 → heading), если null —
 * fallback на старое.
 *
 * Когда удалить deprecated:
 *   1. Все Payload Block configs мигрированы на новые имена (US-0 W3 Track B-3 ✓).
 *   2. Все БД-записи перешли на новые поля через Payload migrations.
 *   3. Все cw fixtures используют только новую схему (US-0 W3 ✓).
 *   4. seed:etalons активирует blocks[] (US-0 W3 Track B-3 ✓).
 *
 * После выполнения 1-4 — следующий PR удаляет deprecated и оставляет только
 * новую схему. До этого — fallback обязателен в рендерерах.
 */

export type SeasonalTheme = 'summer' | 'winter' | 'promo'
export type CtaAccent = 'primary' | 'warning' | 'success'

/**
 * Нормализует Payload `array`-поле к `string[]`.
 *
 * Payload `array` с одним полем (`{ name: 'value' | 'url', type: 'text' }`)
 * после `afterRead` возвращает `[{ id, value }]` / `[{ id, url }]`, а не
 * `string[]`. Если рендерер ожидал `string[]` и делает `<li>{item}</li>` —
 * React падает с «Objects are not valid as a React child (found: object with
 * keys {id, value})». Эта функция принимает оба shape (legacy `string[]`
 * fixtures и реальные Payload-данные) и всегда возвращает `string[]`.
 *
 * EPIC-SERVICE-PAGES-REDESIGN D3-fix · 2026-05-11.
 */
export function toStringList(
  input: ReadonlyArray<string | Record<string, unknown> | null | undefined> | null | undefined,
): string[] {
  if (!input) return []
  const out: string[] = []
  for (const item of input) {
    if (item == null) continue
    if (typeof item === 'string') {
      if (item.length > 0) out.push(item)
      continue
    }
    const raw = item.value ?? item.url
    if (typeof raw === 'string' && raw.length > 0) out.push(raw)
    else if (typeof raw === 'number') out.push(String(raw))
  }
  return out
}

/**
 * Иконки из brand-guide §9 — line-art glyph'ы в 3 линейках.
 * Префикс задаёт линейку (`s-` services, `d-` districts, `c-` cases).
 * Полный реестр — в brand-guide.html §9; здесь — только тип-ключ.
 */
export type IconLine = 'services' | 'districts' | 'cases'

/**
 * CTA-link в новой cw-схеме — `{ label, href }`.
 * Старая схема Track B-1 — `{ label, href, variant }` через CtaLink interface.
 */
export interface CtaLink {
  label?: string | null
  href?: string | null
  /** Variant — только для старой схемы; новый cw cta всегда primary. */
  variant?: 'primary' | 'ghost' | null
}

export interface MediaRef {
  id?: string | number
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

/**
 * Hero image в новой cw-схеме: `{ src, alt, width, height }`.
 * Эквивалент MediaRef но с `src` вместо `url`.
 */
export interface HeroImage {
  src?: string | null
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

/* ───────────────── HERO ───────────────── */

export interface HeroBlock extends BlockBase {
  blockType: 'hero'

  // ── Новая cw-схема (приоритет) ──
  /** Главный заголовок страницы. cw-схема. */
  h1?: string | null
  /** Eyebrow — мини-подпись над h1. */
  eyebrow?: string | null
  /** Sub-USP — короткое USP под h1 (cw-схема). */
  subUsp?: string | null
  /** Trust-row — массив чипов под CTA (cw-схема). */
  trustRow?: string[] | null
  /** Author-meta для blog-эталона (cw-схема). */
  authorMeta?: { name?: string | null; href?: string | null; jobTitle?: string | null } | null
  datePublished?: string | null
  readingTime?: string | null
  /** Cover image для blog hero (cw-схема). */
  coverImage?: HeroImage | null
  /** Job title для author-эталона (cw-схема). */
  jobTitle?: string | null
  /** Avatar для author-эталона (cw-схема). */
  avatar?: HeroImage | null
  /** Facts strip для case-эталона (cw-схема). */
  factsStrip?: { label: string; value: string }[] | null
  /** CTA primary в cw-схеме — всегда primary стиль. */
  ctaPrimary?: CtaLink | null
  ctaSecondary?: CtaLink | null
  /** Hero image в cw-схеме. */
  image?: HeroImage | null
  /** Variant — для разных layout'ов (cw blog/author/case hero). */
  variant?: string | null

  // ── Старая Track B-1 схема (deprecated, legacy data) ──
  /** @deprecated → h1 */
  heading?: string | null
  /** @deprecated → subUsp */
  subheading?: string | null
  /** @deprecated → ctaPrimary */
  primaryCta?: CtaLink | null
  /** @deprecated → ctaSecondary */
  secondaryCta?: CtaLink | null
  /** @deprecated → image */
  backgroundMedia?: MediaRef | string | null
  overlayOpacity?: number | null
  seasonalTheme?: SeasonalTheme | null
}

/* ───────────────── TEXT-CONTENT ───────────────── */

export interface TocItem {
  id: string
  label: string
}

export interface TextContentBlock extends BlockBase {
  blockType: 'text-content'

  // cw-схема
  /** h2 — заголовок секции (cw-схема). Эквивалент heading. */
  h2?: string | null
  /** Markdown body (cw-схема). String, не Lexical. */
  body?: unknown
  /** Table of contents label (cw-схема). */
  tocLabel?: string | null
  /** ToC items (cw-схема). */
  tocItems?: TocItem[] | null

  // legacy / общая совместимость
  eyebrow?: string | null
  /** @deprecated → h2 */
  heading?: string | null
  columns?: '1' | '2' | null
}

/* ───────────────── LEAD-FORM ───────────────── */

export interface LeadFormField {
  name: string
  label?: string | null
  type?: string | null
  required?: boolean | null
  inputmode?: string | null
  placeholder?: string | null
  multiple?: boolean | null
  accept?: string | null
  options?: string[] | null
}

export interface LeadFormBlock extends BlockBase {
  blockType: 'lead-form'

  // cw-схема
  /** h2 — заголовок секции (cw-схема). */
  h2?: string | null
  /** Service hint — текст услуги (cw-схема). */
  serviceHint?: { id?: string; slug?: string; title?: string } | string | null
  /** District hint — район для programmatic SD (cw-схема). */
  districtHint?: { id?: string; slug?: string; nameNominative?: string } | string | null
  /** Fields — конфиг формы (cw-схема). */
  fields?: LeadFormField[] | null
  /** Multi-step fieldsets для b2b (cw-схема). */
  fieldsets?: { legend?: string; fields?: LeadFormField[] }[] | null
  /** Variant — для b2b 2-step. */
  variant?: 'short' | 'long' | string | null
  /** CTA-label на submit-кнопке (cw-схема). */
  ctaLabel?: string | null
  /** Helper-text под формой (cw-схема). */
  helper?: string | null
  /** Consent text (старое имя). */
  consentText?: string | null
  /** Consent href — ссылка на политику. */
  consentHref?: string | null
  successMessage?: string | null

  // legacy
  /** @deprecated → h2 */
  heading?: string | null
  /** @deprecated → helper */
  subheading?: string | null
}

/* ───────────────── CTA-BANNER ───────────────── */

export interface CtaBannerBlock extends BlockBase {
  blockType: 'cta-banner'

  // cw-схема
  /** h2 — заголовок (cw-схема). */
  h2?: string | null
  body?: string | null
  /** CTA primary (cw-схема). */
  ctaPrimary?: CtaLink | null

  // legacy
  /** @deprecated → h2 */
  heading?: string | null
  /** @deprecated → ctaPrimary */
  cta?: CtaLink | null
  variant?: 'primary' | 'dark' | 'accent' | null
  accent?: CtaAccent | null
}

/* ───────────────── FAQ ───────────────── */

export interface FaqItem {
  question?: string | null
  answer?: unknown // Lexical or plain string
}

export interface FaqBlock extends BlockBase {
  blockType: 'faq'
  /** h2 — заголовок (cw-схема). */
  h2?: string | null
  /** @deprecated → h2 */
  heading?: string | null
  items?: FaqItem[] | null
  generateFaqPageSchema?: boolean | null
}

/* ───────────────── BREADCRUMBS ───────────────── */

/**
 * Breadcrumb item: cw-схема использует `label/href`,
 * старая Track B-1 — `name/url`. Поддерживаем оба.
 */
export interface BreadcrumbItem {
  /** cw-схема. */
  label?: string | null
  /** cw-схема. */
  href?: string | null
  /** @deprecated → label */
  name?: string | null
  /** @deprecated → href */
  url?: string | null
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

/* ───────────────── TLDR ───────────────── */

export interface TldrBlock extends BlockBase {
  blockType: 'tldr'
  /** Eyebrow по умолчанию: «Если коротко» — нейро-формат. */
  eyebrow?: string | null
  /**
   * cw-схема: `body: string` (plain-текст).
   * Track B-1 схема: `text: string` (приоритетный) + `body: Lexical` (опциональный).
   *
   * Renderer проверяет text → body.string → body.Lexical в этом порядке.
   */
  text?: string | null
  /**
   * В cw-схеме body — plain-string. В старой схеме — Lexical.
   * Renderer определяет тип runtime.
   */
  body?: unknown
}

/* ───────────────── SERVICES-GRID ───────────────── */

export interface ServicesGridItem {
  // cw-схема
  /** Заголовок карточки (cw-схема). */
  title?: string | null
  /** Описание (cw-схема). */
  description?: string | null
  /** href — URL-путь (cw-схема). */
  href?: string | null
  /** iconId — ключ иконки (cw-схема). */
  iconId?: string | null
  /** Price-anchor — текстовый якорь цены (cw-схема). */
  priceAnchor?: string | null

  // legacy Track B-1
  /** @deprecated → href (берётся в Card если href пуст). */
  slug?: string | null
  /** @deprecated → iconId */
  icon?: string | null
  /** @deprecated → description */
  summary?: string | null
}

export interface ServicesGridBlock extends BlockBase {
  blockType: 'services-grid'
  /** h2 (cw-схема). */
  h2?: string | null
  /** @deprecated → h2 */
  heading?: string | null
  eyebrow?: string | null
  /** Variant — для b2b grid layouts (cw-схема). */
  variant?: string | null
  items?: ServicesGridItem[] | null
}

/* ───────────────── MINI-CASE ───────────────── */

export interface MiniCaseFact {
  label: string
  value: string
}

export interface MiniCaseInline {
  title: string
  photo?: MediaRef | string | null
  /** cw-схема: imageUrl. */
  imageUrl?: string | null
  imageAlt?: string | null
  facts?: MiniCaseFact[] | null
  /** href в cw-схеме. */
  href?: string | null
  /** @deprecated → href */
  link?: string | null
}

/**
 * MiniCase — карточка кейса. cw-схема использует items[] (массив карточек).
 * Track B-1 схема использует caseRef + inline (одна карточка).
 *
 * Renderer проверяет items[] → inline → caseRef.
 */
export interface MiniCaseBlock extends BlockBase {
  blockType: 'mini-case'
  /** h2 (cw-схема). */
  h2?: string | null
  /** Variant — для case-эталона. */
  variant?: string | null
  /** items[] cw-схема — массив карточек. */
  items?: MiniCaseInline[] | null
  /** @deprecated → items[0] */
  inline?: MiniCaseInline | null
  caseRef?: { id?: string; slug?: string; title?: string } | string | null
}

/* ───────────────── RELATED-SERVICES ───────────────── */

export interface RelatedServiceItem {
  title?: string | null
  /** cw-схема. */
  description?: string | null
  /** cw-схема. */
  href?: string | null
  /** cw-схема. */
  iconId?: string | null
  /** @deprecated → href */
  slug?: string | null
  /** @deprecated → description */
  summary?: string | null
}

export interface RelatedServicesBlock extends BlockBase {
  blockType: 'related-services'
  /** h2 (cw-схема). */
  h2?: string | null
  /** @deprecated → h2 */
  heading?: string | null
  /** 1..N элементов (cw-схема), но рендерер обрезает на 3. */
  items?: RelatedServiceItem[] | null
}

/* ───────────────── RELATED-POSTS (cw для author-эталона) ───────────────── */

export interface RelatedPostItem {
  title?: string | null
  href?: string | null
  description?: string | null
  publishedAt?: string | null
}

export interface RelatedPostsBlock extends BlockBase {
  blockType: 'related-posts'
  h2?: string | null
  items?: RelatedPostItem[] | null
}

/* ───────────────── NEIGHBOR-DISTRICTS ───────────────── */

export interface NeighborDistrictItem {
  /** Название района (нормально-falladbacks: name → label). */
  name?: string | null
  /** cw-схема (если cw присылает label — мы читаем его). */
  label?: string | null
  /** cw-схема: full URL (`/raiony/<slug>/`). */
  href?: string | null
  /** Старое имя — slug части URL. */
  slug?: string | null
  /** Расстояние «сколько-то км» от текущего района (если известно). */
  distance?: string | null
}

export interface NeighborDistrictsBlock extends BlockBase {
  blockType: 'neighbor-districts'
  /** h2 (cw-схема). */
  h2?: string | null
  /** @deprecated → h2 */
  heading?: string | null
  /** 1..N элементов (cw-схема), рендерер обрезает на 3. */
  items?: NeighborDistrictItem[] | null
  /** Линка на сервис (если блок используется на /<service>/<district>/). */
  serviceSlug?: string | null
}

/* ───────────────── CALCULATOR ───────────────── */

export type CalculatorServiceType = 'spil' | 'musor' | 'krysha' | 'demontazh' | null

export interface CalculatorBlock extends BlockBase {
  blockType: 'calculator-placeholder'
  heading?: string | null
  body?: string | null
  serviceType?: CalculatorServiceType
  ctaLabel?: string | null
  ctaHref?: string | null
}

/* ───────────────── EPIC-SERVICE-PAGES-REDESIGN D3 wave A ─────────────────
 * 11 новых блоков для T2 pillar redesign per brand-guide v2.6 extensions.
 * Все типы — additive, не ломают legacy union AnyBlock (включены ниже). */

/* §service-hero (line 4571 brand-guide v2.6) */
export interface ServiceHeroBlock extends BlockBase {
  blockType: 'service-hero'
  /** T2 / T3 / T4 layout variant — controls grid + photo visibility. */
  variant?: 'T2_PILLAR' | 'T3_SUB' | 'T4_SD' | null
  eyebrow?: string | null
  /** H1 — главный заголовок. */
  h1?: string | null
  /** Strapline — lead-параграф 2-3 строки. */
  strapline?: string | null
  /** USP × 3 — короткие выгоды (нумерованные пилы). */
  usps?: { num?: string | null; text: string }[] | null
  /** Primary CTA — «Загрузить фото / получить смету». */
  ctaPrimary?: CtaLink | null
  /** Secondary CTA — `tel:` link. */
  ctaSecondary?: CtaLink | null
  /** 4 trust-pills под CTA. */
  trust?: string[] | null
  /** Hero photo (T2 only). */
  image?: HeroImage | null
  /** Photo-tag subtitle (e.g. «реальный объект, Раменское»). */
  photoTag?: string | null
}

/* §calculator-shell (line 4757 brand-guide v2.6) */
export interface CalculatorShellBlock extends BlockBase {
  blockType: 'calculator-shell'
  h2?: string | null
  helper?: string | null
  /** Тип услуги для presets и default-сметы. */
  serviceType?: 'spil' | 'musor' | 'krysha' | 'demontazh' | string | null
  /** API endpoint для photo→quote (по умолчанию /api/quote). */
  apiEndpoint?: string | null
  /** Куда вести при success (по умолчанию #lead-form). */
  successHref?: string | null
}

/* §lead-form-full (line 4922 brand-guide v2.6) */
export interface LeadFormFullBlock extends BlockBase {
  blockType: 'lead-form-full'
  h2?: string | null
  helper?: string | null
  ctaLabel?: string | null
  successMessage?: string | null
  serviceHint?: { id?: string; slug?: string; title?: string } | string | null
  districtHint?: { id?: string; slug?: string; nameNominative?: string } | string | null
  consentText?: string | null
  consentHref?: string | null
}

/* §pricing-table (line 5129 brand-guide v2.6) */
export interface PricingTier {
  name: string
  price: string
  unit?: string | null
  tagline?: string | null
  features?: string[] | null
  highlighted?: boolean | null
  badge?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
}

export interface PricingTableBlock extends BlockBase {
  blockType: 'pricing-table'
  h2?: string | null
  helper?: string | null
  /** 3-tier OR per-district adjustment OR single-list. */
  variant?: 'tiers' | 'list' | 'per-district' | null
  tiers?: PricingTier[] | null
}

/* §process-steps (line 5278 brand-guide v2.6) */
export interface ProcessStep {
  num?: string | number | null
  title: string
  description?: string | null
  eta?: string | null
}

export interface ProcessStepsBlock extends BlockBase {
  blockType: 'process-steps'
  h2?: string | null
  helper?: string | null
  /** vertical (mobile-first) или horizontal (desktop ≥1100px). */
  layout?: 'vertical' | 'horizontal' | null
  steps?: ProcessStep[] | null
}

/* §trust-block (line 5452 brand-guide v2.6) */
export interface TrustItem {
  icon?: string | null
  label: string
  sub?: string | null
  href?: string | null
}

export interface TrustBlockBlock extends BlockBase {
  blockType: 'trust-block'
  /** bar (4-pill) | cards-4 (hero-adjacent) | cards-6 (pre-footer). */
  variant?: 'bar' | 'cards-4' | 'cards-6' | null
  title?: string | null
  items?: TrustItem[] | null
}

/* §mini-case v2.6 (line 5815 brand-guide v2.6) */
export interface MiniCaseV2Block extends BlockBase {
  blockType: 'mini-case-v2'
  badge?: string | null
  meta?: string[] | null
  title: string
  imageUrl?: string | null
  imageAlt?: string | null
  photoLabel?: string | null
  kpis?: { k: string; v: string }[] | null
  thumbs?: string[] | null
  ctaLabel?: string | null
  ctaHref?: string | null
}

/* §faq-accordion (line 5952 brand-guide v2.6) */
export interface FaqAccordionItem {
  question: string
  answer: string
}

export interface FaqAccordionBlock extends BlockBase {
  blockType: 'faq-accordion'
  h2?: string | null
  items?: FaqAccordionItem[] | null
  generateFaqPageSchema?: boolean | null
}

/* §breadcrumbs v2.6 (line 6128 brand-guide v2.6) */
export interface BreadcrumbsV2Block extends BlockBase {
  blockType: 'breadcrumbs-v2'
  items?: BreadcrumbItem[] | null
  generateSchema?: boolean | null
}

/* §tldr-block v2.6 (line 6256 brand-guide v2.6) */
export interface TldrV2Block extends BlockBase {
  blockType: 'tldr-v2'
  badge?: string | null
  title?: string | null
  bullets?: string[] | null
}

/* §district-chips (line 6404 brand-guide v2.6) */
export interface DistrictChip {
  label: string
  href: string
  priority?: boolean | null
}

export interface DistrictChipsBlock extends BlockBase {
  blockType: 'district-chips'
  title?: string | null
  meta?: string | null
  items?: DistrictChip[] | null
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
  | RelatedPostsBlock
  | NeighborDistrictsBlock
  | CalculatorBlock
  // EPIC-SERVICE-PAGES-REDESIGN D3 wave A — 11 new blocks
  | ServiceHeroBlock
  | CalculatorShellBlock
  | LeadFormFullBlock
  | PricingTableBlock
  | ProcessStepsBlock
  | TrustBlockBlock
  | MiniCaseV2Block
  | FaqAccordionBlock
  | BreadcrumbsV2Block
  | TldrV2Block
  | DistrictChipsBlock
