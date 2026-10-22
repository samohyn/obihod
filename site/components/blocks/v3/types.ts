// Типы блоков библиотеки v3. Поля совпадают с Payload-конфигами в site/blocks/v3/*.ts:
// рендер получает данные блока как есть (картинки — уже развёрнутые в BlockImage).

import type { IconName } from './shared'

export type SectionTone = 'default' | 'alt' | 'dark' | 'green'

export interface BlockImage {
  url: string
  alt?: string | null
  /** CSS object-position, например «center 40%». */
  focus?: string | null
  /** Сгенерированное фото — на сайте подписывается «Иллюстрация» (правило 2 плана 09). */
  illustration?: boolean | null
}

export interface BlockLink {
  label: string
  href: string
}

export interface BlockBase {
  id?: string | null
  enabled?: boolean | null
  anchor?: string | null
  eyebrow?: string | null
  title?: string | null
  link?: BlockLink | null
}

export interface IconItem {
  icon: IconName
  title: string
  text?: string | null
}

// 1 · первый экран со слайдами
export interface HeroSlide {
  kicker?: string | null
  title: string
  lead?: string | null
  primary: BlockLink & { icon?: IconName | null }
  secondary?: BlockLink | null
  image: BlockImage
}
export interface HeroSliderBlock extends BlockBase {
  blockType: 'hero-slider'
  slides: HeroSlide[]
  badge?: { value: string; text: string; note?: string | null } | null
  strip: IconItem[]
  autoplaySeconds?: number | null
}

// 2 · услуги плиткой
export interface ServiceTile {
  title: string
  text?: string | null
  price?: string | null
  href: string
  image: BlockImage
}
export interface ServicesTilesBlock extends BlockBase {
  blockType: 'services-tiles'
  items: ServiceTile[]
}

// 3 · о компании и цифры
export interface AboutStatsBlock extends BlockBase {
  blockType: 'about-stats'
  text: string
  checklist?: string[] | null
  stats: { value: string; label: string }[]
  banner?: (BlockLink & { text: string }) | null
}

// 4 · техника
export interface EquipmentItem {
  title: string
  text?: string | null
  price?: string | null
  href?: string | null
  image: BlockImage
}
export interface EquipmentBlock extends BlockBase {
  blockType: 'equipment'
  items: EquipmentItem[]
}

// 5 · проекты «было — стало» со сметой и актом
export interface ProjectItem {
  place: string
  duration?: string | null
  title: string
  sum: string
  matched?: boolean | null
  before: BlockImage
  after: BlockImage
  afterLabel?: string | null
  href?: string | null
}
export interface ProjectsBlock extends BlockBase {
  blockType: 'projects'
  items: ProjectItem[]
}

// 6 · видео
export interface VideoItem {
  title: string
  text?: string | null
  duration?: string | null
  poster: BlockImage
  /** Ссылка на ролик (Rutube / VK Видео / файл). Пусто — карточка без воспроизведения. */
  url?: string | null
}
export interface VideoGalleryBlock extends BlockBase {
  blockType: 'video-gallery'
  items: VideoItem[]
}

// 7 · акции с условиями
export interface PromoItem {
  value: string
  title: string
  text?: string | null
  link?: BlockLink | null
  dark?: boolean | null
}
export interface PromotionsBlock extends BlockBase {
  blockType: 'promotions'
  items: PromoItem[]
}

// 8 · сотрудники
export interface TeamMember {
  role: string
  text?: string | null
  chip?: string | null
  photo: BlockImage
}
export interface TeamBlock extends BlockBase {
  blockType: 'team'
  items: TeamMember[]
}

// 9 · калькулятор
export interface CalcOption {
  label: string
  /** Множитель базовой цены варианта (1 — без изменения). */
  factor: number
}
export interface CalcService {
  key: string
  label: string
  icon: IconName
  kindLabel: string
  kinds: { label: string; base: number; unit: string }[]
  volumeLabel: string
  volumes: { label: string; factor: number }[]
  zones: CalcOption[]
  included: string[]
}
export interface CalculatorBlock extends BlockBase {
  blockType: 'calculator-v3'
  lead?: string | null
  services: CalcService[]
  ctaLabel?: string | null
  note?: string | null
}

// 10 · шаги
export interface StepItem {
  time?: string | null
  title: string
  text?: string | null
}
export interface StepsBlock extends BlockBase {
  blockType: 'steps'
  items: StepItem[]
}

// 11 · прайс по вкладкам
export interface PriceTab {
  label: string
  icon: IconName
  unit: string
  columns: string[]
  rows: { name: string; note?: string | null; values: string[] }[]
  notes?: string[] | null
}
export interface PriceTabsBlock extends BlockBase {
  blockType: 'price-tabs'
  tabs: PriceTab[]
}

// 12 · баннер с фото и призывом
export interface PhotoCtaBlock extends BlockBase {
  blockType: 'photo-cta'
  text?: string | null
  image: BlockImage
  primary: BlockLink & { icon?: IconName | null }
  secondary?: (BlockLink & { icon?: IconName | null }) | null
}

// 13 · отзывы
export interface ReviewItem {
  author: string
  place?: string | null
  text: string
  service?: string | null
  rating?: number | null
}
export interface ReviewsBlock extends BlockBase {
  blockType: 'reviews-v3'
  rating?: { value: string; source: string; href?: string | null } | null
  items: ReviewItem[]
}

// 14 · документы
export interface DocumentItem {
  icon: IconName
  title: string
  text?: string | null
  metaLabel?: string | null
  metaValue?: string | null
}
export interface DocumentsBlock extends BlockBase {
  blockType: 'documents'
  items: DocumentItem[]
}

// 15 · для УК и организаций
export interface B2bPlanBlock extends BlockBase {
  blockType: 'b2b-plan'
  text?: string | null
  kpis: { value: string; label: string }[]
  primary: BlockLink
  secondary?: BlockLink | null
  audiences: IconItem[]
  note?: { title: string; text: string } | null
}

// 16 · «нужно ли убирать дерево» + консультация
export interface TreeCheckBlock extends BlockBase {
  blockType: 'tree-check'
  checklistTitle: string
  checklist: string[]
  consult: {
    eyebrow?: string | null
    title: string
    text?: string | null
    points?: string[] | null
    cta: BlockLink
  }
}

// 17 · статьи
export interface ArticleItem {
  kicker?: string | null
  title: string
  text?: string | null
  href: string
  image: BlockImage
}
export interface ArticlesBlock extends BlockBase {
  blockType: 'articles'
  items: ArticleItem[]
}

// 18 · карта объектов
export interface ObjectsMapBlock extends BlockBase {
  blockType: 'objects-map'
  legend: { label: string; count: number; color?: 'primary' | 'success' | 'muted' | 'accent' }[]
  districts: string[]
  zones: { value: string; label: string }[]
  /** Точки объектов: угол (°, 0 — север) и расстояние от МКАД в км. */
  points: { angle: number; km: number }[]
  base?: { label: string; angle: number; km: number } | null
}

// 19 · гарантии с условиями
export interface GuaranteeItem {
  icon: IconName
  title: string
  text: string
  conditionLabel: string
  conditionValue: string
}
export interface GuaranteesBlock extends BlockBase {
  blockType: 'guarantees'
  items: GuaranteeItem[]
}

// 20 · FAQ
export interface FaqV3Block extends BlockBase {
  blockType: 'faq-v3'
  items: { question: string; answer: string }[]
}

// 21 · финальная форма
export interface FinalFormBlock extends BlockBase {
  blockType: 'final-form'
  lead?: string | null
  background?: BlockImage | null
  channels: { icon: IconName; title: string; text: string; href: string }[]
  formTitle: string
  source: string
  /** Фото и описание задачи в форме открыты сразу («Фото → смета») */
  openDetails?: boolean | null
}

// 22 · текст документа (политика ПДн, согласие)
export interface LegalDocBlock extends BlockBase {
  blockType: 'legal-doc'
  title: string
  /** «19 октября 2026 г.» — в шапке «Редакция от …» */
  revision?: string | null
  /** Lexical (форматированный текст из админки) */
  body: unknown
}

export type V3Block =
  | HeroSliderBlock
  | ServicesTilesBlock
  | AboutStatsBlock
  | EquipmentBlock
  | ProjectsBlock
  | VideoGalleryBlock
  | PromotionsBlock
  | TeamBlock
  | CalculatorBlock
  | StepsBlock
  | PriceTabsBlock
  | PhotoCtaBlock
  | ReviewsBlock
  | DocumentsBlock
  | B2bPlanBlock
  | TreeCheckBlock
  | ArticlesBlock
  | ObjectsMapBlock
  | GuaranteesBlock
  | FaqV3Block
  | FinalFormBlock
  | LegalDocBlock

/** Блок + тон фона секции (чередование задаёт страница). */
export type V3BlockWithTone = V3Block & { tone?: SectionTone | null }
