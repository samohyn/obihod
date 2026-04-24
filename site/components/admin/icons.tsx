/**
 * Admin icons — Lucide-like линейный стиль (24x24, stroke-width 2, currentColor).
 * Один файл, без внешних зависимостей (не используем lucide-react).
 *
 * Цвет задаётся через CSS (color: var(--theme-success-500) и т.п.),
 * так как stroke="currentColor" на всех иконках.
 *
 * Стиль бренда Обихода (Caregiver + Ruler):
 *   - квадратные линии, round cap/join (каретливо, но уверенно)
 *   - без декоративных шумов, без градиентов
 *   - формы «хозяйственные»: инструмент, бирка, ведро, строчки в блокноте
 *
 * Server + client compatible (чистые pure SVG без хуков/эффектов).
 */

import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

// ---------- базовый wrapper ----------

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

// =====================================================================
// 1. Иконки коллекций (11)
// =====================================================================

/** Services — дерево с секатором-арбористикой (крона + ствол). */
export function ServicesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      {/* Крона — три круга как листва */}
      <path d="M12 3c-2 0-3.5 1.5-3.5 3.5 0 .5.1 1 .3 1.4C7.1 8.3 6 9.7 6 11.3c0 2 1.6 3.7 3.6 3.7h4.8c2 0 3.6-1.7 3.6-3.7 0-1.6-1.1-3-2.8-3.4.2-.4.3-.9.3-1.4C15.5 4.5 14 3 12 3Z" />
      {/* Ствол */}
      <path d="M12 15v6" />
      <path d="M9 21h6" />
    </Svg>
  )
}

/** Districts — pin-метка с точкой-центром. */
export function DistrictsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </Svg>
  )
}

/** ServiceDistricts — pin + маленькое дерево внутри (посадочная service×district). */
export function ServiceDistrictsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" />
      {/* Маленькое дерево в месте точки */}
      <path d="M12 6.2a2 2 0 0 0-1.6 3.2 2 2 0 0 0 .6 3.2h2a2 2 0 0 0 .6-3.2A2 2 0 0 0 12 6.2Z" />
      <path d="M12 12.6V14" />
    </Svg>
  )
}

/** Cases — фото-альбом с галочкой «выполнено». */
export function CasesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 15l5-4 4 3 3-2 6 5" />
      <path d="M15 8.5l1.5 1.5L20 6.5" />
    </Svg>
  )
}

/** Blog — бумажный лист со строчками. */
export function BlogIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
      <path d="M14 3v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </Svg>
  )
}

/** B2BPages — офисное здание. */
export function B2BPagesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 21V7l8-4 8 4v14" />
      <path d="M4 21h16" />
      <path d="M9 21v-4h6v4" />
      <path d="M9 9h2M13 9h2M9 13h2M13 13h2" />
    </Svg>
  )
}

/** Persons — силуэт человека в каске (бригадир). */
export function PersonsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      {/* Каска */}
      <path d="M5 11a7 7 0 0 1 14 0" />
      <path d="M4 11h16" />
      <path d="M12 4v3" />
      {/* Плечи */}
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      {/* Голова ниже каски */}
      <circle cx="12" cy="13" r="0.5" fill="currentColor" />
    </Svg>
  )
}

/** Leads — телефонная трубка. */
export function LeadsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </Svg>
  )
}

/** Redirects — стрелка-переход (301). */
export function RedirectsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 7h13" />
      <path d="M13 3l4 4-4 4" />
      <path d="M21 17H8" />
      <path d="M11 21l-4-4 4-4" />
    </Svg>
  )
}

/** Media — картинка с горами и солнцем. */
export function MediaIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5-5-8 8" />
    </Svg>
  )
}

/** Users — два силуэта. */
export function UsersIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
      <path d="M16 11a3 3 0 0 0 0-6" />
      <path d="M21 20v-1a4 4 0 0 0-3-3.9" />
    </Svg>
  )
}

// =====================================================================
// 2. Иконки блоков (15)
// =====================================================================

/** HeroBlock — большая картинка-заливка с текстом поверх. */
export function HeroBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 14l5-4 5 4 4-3 4 3" />
      <path d="M7 8h6" />
    </Svg>
  )
}

/** TextContentBlock — строки текста разной длины. */
export function TextContentBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 6h16" />
      <path d="M4 10h16" />
      <path d="M4 14h10" />
      <path d="M4 18h13" />
    </Svg>
  )
}

/** LeadFormBlock — форма с полями и кнопкой. */
export function LeadFormBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9h10" />
      <path d="M7 13h10" />
      <rect x="7" y="16" width="6" height="2.5" rx="0.8" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** PhotoEstimateFormBlock — камера + прайс-тег. */
export function PhotoEstimateFormBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      {/* Камера */}
      <path d="M3 8h3l1.5-2h5L14 8h3a2 2 0 0 1 2 2v4" />
      <circle cx="9.5" cy="12" r="3" />
      {/* Прайс-тег снизу-справа */}
      <path d="M14 19l5.5-5.5a1.5 1.5 0 0 1 2 2L16 21l-2-2Z" />
      <circle cx="18.5" cy="15.5" r="0.7" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** CalculatorBlock — калькулятор с экраном и кнопками. */
export function CalculatorBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <rect x="7.5" y="5.5" width="9" height="3" rx="0.5" />
      <path d="M8.5 13h0" />
      <path d="M12 13h0" />
      <path d="M15.5 13h0" />
      <path d="M8.5 17h0" />
      <path d="M12 17h0" />
      <path d="M15.5 17h0" />
    </Svg>
  )
}

/** CasesCarouselBlock — три карточки в ряд с индикаторами. */
export function CasesCarouselBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="6" width="5" height="10" rx="1" />
      <rect x="9.5" y="6" width="5" height="10" rx="1" />
      <rect x="16" y="6" width="5" height="10" rx="1" />
      <path d="M9 20h6" />
    </Svg>
  )
}

/** FaqBlock — знак вопроса в круге. */
export function FaqBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** ServicesGridBlock — 4 плитки-квадрата. */
export function ServicesGridBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </Svg>
  )
}

/** DistrictsGridBlock — карта-сетка с точками районов. */
export function DistrictsGridBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M3 15h18" />
      <path d="M9 4v16" />
      <path d="M15 4v16" />
      <circle cx="6" cy="7" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="18" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** TrustBadgesBlock — щит-печать с галочкой. */
export function TrustBadgesBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6Z" />
      <path d="M8.5 12l2.5 2.5L16 10" />
    </Svg>
  )
}

/** TestimonialsBlock — открывающие кавычки. */
export function TestimonialsBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 10c0-2.2 1.8-4 4-4v2.5c-.9 0-1.5.6-1.5 1.5H10a1.5 1.5 0 0 1 1.5 1.5V14a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 14Z" />
      <path d="M14 10c0-2.2 1.8-4 4-4v2.5c-.9 0-1.5.6-1.5 1.5H18a1.5 1.5 0 0 1 1.5 1.5V14a1.5 1.5 0 0 1-1.5 1.5h-2.5A1.5 1.5 0 0 1 14 14Z" />
    </Svg>
  )
}

/** CtaBannerBlock — баннер со стрелкой вправо. */
export function CtaBannerBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M8 12h7" />
      <path d="M13 9l3 3-3 3" />
    </Svg>
  )
}

/** PromotionBannerBlock — тег-скидка с «%». */
export function PromotionBannerBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20.5 12.5 12.5 20.5a2 2 0 0 1-2.8 0L3 13.8V4h9.8l7.7 7.7a2 2 0 0 1 0 2.8Z" />
      <circle cx="7" cy="8" r="1.3" />
      <path d="M14 10l-4 4" />
      <circle cx="10" cy="10" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="14" cy="14" r="0.5" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** MapRegionBlock — контур области с точкой. */
export function MapRegionBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7l5-3 6 3 5-2v13l-5 2-6-3-5 3Z" />
      <path d="M9 4v14" />
      <path d="M15 7v13" />
    </Svg>
  )
}

/** VideoBlock — треугольник-play в рамке. */
export function VideoBlockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M10.5 9.5v5l4.5-2.5Z" />
    </Svg>
  )
}

// =====================================================================
// 3. Dashboard-tile иконки (6)
// =====================================================================

/** Добавить район: pin + plus. */
export function AddDistrictTileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 .5-.1 1-.2 1.5" />
      <circle cx="10" cy="9" r="2" />
      <path d="M18 15v6" />
      <path d="M15 18h6" />
    </Svg>
  )
}

/** Обновить цену: знак рубля со стрелкой вверх. */
export function UpdatePriceTileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      {/* Знак рубля */}
      <path d="M8 4h4a3.5 3.5 0 0 1 0 7H8" />
      <path d="M8 4v16" />
      <path d="M6 13h7" />
      {/* Стрелка */}
      <path d="M18 14v7" />
      <path d="M15 17l3-3 3 3" />
    </Svg>
  )
}

/** Опубликовать кейс: галочка + фото. */
export function PublishCaseTileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="14" height="12" rx="2" />
      <circle cx="7.5" cy="9.5" r="1.3" />
      <path d="M3 14l4-3 4 3" />
      {/* Галочка поверх */}
      <path d="M14 18l2.5 2.5L21 16" />
    </Svg>
  )
}

/** Заменить hero: кисть + большой прямоугольник. */
export function ReplaceHeroTileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="10" rx="1.5" />
      {/* Кисть */}
      <path d="M6 21l3-3 2 2-3 3Z" />
      <path d="M11 20l8-8a1.5 1.5 0 0 0-2-2l-8 8" />
    </Svg>
  )
}

/** Добавить акцию: тег-скидка + календарь. */
export function AddPromotionTileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M13 3h5a3 3 0 0 1 3 3v5l-8.5 8.5a2 2 0 0 1-2.8 0L4 13.8Z" />
      <circle cx="16" cy="8" r="1.3" />
      {/* Календарь-полоски */}
      <path d="M8 10v-3" />
      <path d="M6 8h4" />
    </Svg>
  )
}

/** Собрать страницу: кубики-блоки + plus. */
export function BuildPageTileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <path d="M17 15v6" />
      <path d="M14 18h6" />
    </Svg>
  )
}

// =====================================================================
// 4. Сезонные иконки для Hero SeasonalTheme (3)
// =====================================================================

/** Лето — солнце с лучами. */
export function SummerIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <path d="M4.9 4.9l2.1 2.1" />
      <path d="M17 17l2.1 2.1" />
      <path d="M4.9 19.1 7 17" />
      <path d="M17 7l2.1-2.1" />
    </Svg>
  )
}

/** Зима — снежинка. */
export function WinterIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="M5 5l14 14" />
      <path d="M19 5 5 19" />
      {/* Мелкие «пёрышки» на концах */}
      <path d="M9 3l3 2 3-2" />
      <path d="M9 21l3-2 3 2" />
      <path d="M3 9l2 3-2 3" />
      <path d="M21 9l-2 3 2 3" />
    </Svg>
  )
}

/** Promo — пламя акции. */
export function PromoIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 1-5 1 1 2 2 3 0Z" />
      <path d="M10.5 17.5a2 2 0 0 0 3 0" />
    </Svg>
  )
}

// =====================================================================
// 5. Системные иконки
// =====================================================================

/**
 * ObikhodLogoMark — монограмма «О» в квадрате со скруглением.
 * ВАЖНО: эта иконка НЕ использует currentColor — это полноцветный знак
 * в бренд-палитре (зелёный #2d5a3d + кремовый #f7f5f0). Используется как
 * favicon-replacement, decor на Dashboard-tile, splash-элемент.
 *
 * Если нужна одноцветная версия — см. Icon.tsx рядом (легаси).
 */
export function ObikhodLogoMark(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect width="24" height="24" rx="5" fill="#2d5a3d" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="15"
        fontWeight="700"
        fill="#f7f5f0"
        letterSpacing="-0.02em"
      >
        О
      </text>
    </svg>
  )
}

/**
 * DraftIcon — круг с точкой (статус: черновик, янтарь).
 * Рекомендованный цвет через style: color: '#e6a23c' (--c-accent).
 */
export function DraftIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/**
 * PublishedIcon — залитый круг с галочкой (статус: опубликовано, зелёный).
 * Рекомендованный цвет через style: color: '#2d5a3d' (--c-primary).
 */
export function PublishedIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" fill="currentColor" stroke="currentColor" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#f7f5f0" />
    </Svg>
  )
}

/**
 * ExpiredIcon — круг с косой чертой (статус: истёк / снят).
 * Рекомендованный цвет через style: color: '#b54828' (--c-error) или muted.
 */
export function ExpiredIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.5 5.5l13 13" />
    </Svg>
  )
}

// =====================================================================
// Явная мапа коллекция → иконка (для be4/ui использовать при интеграции)
// =====================================================================

/**
 * Мапа «slug коллекции Payload → React-компонент иконки».
 * Использовать в `site/payload.config.ts` при сборке `admin.components.graphics`
 * или в кастомных views, чтобы не гадать по имени файла.
 *
 * Ключи — `slug` коллекций из `site/collections/*.ts` (как они объявлены в
 * Payload config). Если коллекция переименована — правим здесь, а не во всех
 * местах использования.
 */
export const collectionIconMap = {
  services: ServicesIcon,
  districts: DistrictsIcon,
  'service-districts': ServiceDistrictsIcon,
  cases: CasesIcon,
  blog: BlogIcon,
  'b2b-pages': B2BPagesIcon,
  persons: PersonsIcon,
  leads: LeadsIcon,
  redirects: RedirectsIcon,
  media: MediaIcon,
  users: UsersIcon,
} as const

export type CollectionSlug = keyof typeof collectionIconMap

/**
 * Мапа «slug блока → React-компонент иконки».
 * Ключи — значения поля `blockType` из каждого блока в `site/blocks/*`.
 */
export const blockIconMap = {
  hero: HeroBlockIcon,
  textContent: TextContentBlockIcon,
  leadForm: LeadFormBlockIcon,
  photoEstimateForm: PhotoEstimateFormBlockIcon,
  calculator: CalculatorBlockIcon,
  casesCarousel: CasesCarouselBlockIcon,
  faq: FaqBlockIcon,
  servicesGrid: ServicesGridBlockIcon,
  districtsGrid: DistrictsGridBlockIcon,
  trustBadges: TrustBadgesBlockIcon,
  testimonials: TestimonialsBlockIcon,
  ctaBanner: CtaBannerBlockIcon,
  promotionBanner: PromotionBannerBlockIcon,
  mapRegion: MapRegionBlockIcon,
  video: VideoBlockIcon,
} as const

export type BlockSlug = keyof typeof blockIconMap

/**
 * Мапа «сценарий Dashboard-tile → иконка».
 * Ключи совпадают со списком tile-кнопок в Dashboard-макете (ui-mockups.md §Dashboard).
 */
export const tileIconMap = {
  addDistrict: AddDistrictTileIcon,
  updatePrice: UpdatePriceTileIcon,
  publishCase: PublishCaseTileIcon,
  replaceHero: ReplaceHeroTileIcon,
  addPromotion: AddPromotionTileIcon,
  buildPage: BuildPageTileIcon,
} as const

export type TileSlug = keyof typeof tileIconMap

/**
 * Мапа «сезон → Hero SeasonalTheme иконка».
 * Ключи совпадают с enum `SeasonalTheme` в `site/blocks/Hero/*`.
 */
export const seasonalIconMap = {
  summer: SummerIcon,
  winter: WinterIcon,
  promo: PromoIcon,
} as const

export type SeasonSlug = keyof typeof seasonalIconMap

/**
 * Мапа «статус → иконка». Цвет НЕ зашит — задаётся style={{ color: '...' }}.
 */
export const statusIconMap = {
  draft: DraftIcon,
  published: PublishedIcon,
  expired: ExpiredIcon,
} as const

export type StatusSlug = keyof typeof statusIconMap
