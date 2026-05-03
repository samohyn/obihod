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
 * Иконки из brand-guide §9 — line-art glyph'ы в 4 линейках.
 * Префикс задаёт линейку (`s-` services, `sh-` shop, `d-` districts, `c-` cases).
 * Полный реестр (49 шт.) — в brand-guide.html §9; здесь — только тип-ключ.
 */
export type IconLine = 'services' | 'shop' | 'districts' | 'cases'

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
