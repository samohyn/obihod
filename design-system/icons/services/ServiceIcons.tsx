/**
 * ServiceIcons — domain-специфичные иконки услуг Обихода.
 *
 * Стиль: stroke 1.5, round cap/join, currentColor, viewBox 24×24.
 * DNA: чертёжная эстетика Круга сезонов (agents/brand/logo/master.svg).
 * Правила: design-system/foundations/icons.md + design-system/icons/services/README.md.
 *
 * Использование:
 *   import { SpilIcon, RoofSnowIcon } from '@/design-system/icons/services/ServiceIcons'
 *   <SpilIcon className="text-primary" />
 *
 * Размер задаётся через className (h-5 w-5 / h-6 w-6 / etc.) или через SVG attrs.
 * Цвет — через currentColor, наследуется от родителя (color: var(--c-primary)).
 */
import type { FC, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base: IconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

/* ═══ Арбористика ═══ */

/** Спил — дерево с горизонтальной линией-срезом */
export const SpilIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3 L12 14" />
    <path d="M9 6 L12 3 L15 6" />
    <path d="M8 9 L12 6 L16 9" />
    <path d="M7 12 L12 9 L17 12" />
    <path d="M6 15 L18 15" strokeDasharray="2 1.5" />
    <path d="M12 15 L12 21" />
    <path d="M9 21 L15 21" />
  </svg>
)

/** Валка — наклонённое дерево + стрелка направления падения */
export const ValkaIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M4 20 L20 20" />
    <g transform="rotate(35 10 18)">
      <path d="M10 9 L10 18" />
      <path d="M8 11 L10 9 L12 11" />
      <path d="M7.5 13 L10 11 L12.5 13" />
      <path d="M7 15 L10 13 L13 15" />
    </g>
    <path d="M16 14 L20 14 L20 10" />
    <path d="M20 14 L17 17" />
  </svg>
)

/** Корчевание — пень с уходящими корнями */
export const StumpIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <ellipse cx="12" cy="10" rx="5" ry="1.5" />
    <path d="M7 10 L7 13" />
    <path d="M17 10 L17 13" />
    <path d="M7 13 C 9 14, 15 14, 17 13" />
    <circle cx="12" cy="10" r="1.6" />
    <path d="M6 16 C 5 17, 4 18, 3 19" />
    <path d="M9 16 L8 20" />
    <path d="M15 16 L16 20" />
    <path d="M18 16 C 19 17, 20 18, 21 19" />
  </svg>
)

/** Обрезка / кронирование — дерево с подстриженной кроной (штриховые срезы сверху) */
export const PruneIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 13 L12 21" />
    <path d="M9 21 L15 21" />
    <path d="M5 13 C 5 8, 19 8, 19 13" />
    <path d="M5 5 L9 5" strokeDasharray="1.5 1.2" />
    <path d="M9 5 L19 5" strokeDasharray="1.5 1.2" />
    <path d="M8 8 L8 13" />
    <path d="M12 8 L12 13" />
    <path d="M16 8 L16 13" />
    <path d="M6 6 L8 8" />
    <path d="M18 6 L16 8" />
  </svg>
)

/** Каблинг — два ствола соединены горизонтальной стяжкой */
export const KablingIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M6 3 L6 21" />
    <path d="M18 3 L18 21" />
    <path d="M6 10 C 9 9, 15 9, 18 10" strokeDasharray="2 1.5" />
    <circle cx="6" cy="10" r="1.2" fill="currentColor" />
    <circle cx="18" cy="10" r="1.2" fill="currentColor" />
    <path d="M4 21 L8 21" />
    <path d="M16 21 L20 21" />
  </svg>
)

/** Опрыскивание — распылитель + капли */
export const SprayIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M10 14 L14 14 L14 20 L10 20 Z" />
    <path d="M12 14 L12 10" />
    <path d="M10 10 L14 10 L14 8 L10 8 Z" />
    <path d="M6 6 L8 7" />
    <path d="M6 10 L8 10" />
    <path d="M6 14 L8 13" />
    <circle cx="4" cy="6" r="0.8" />
    <circle cx="4" cy="10" r="0.8" />
    <circle cx="4" cy="14" r="0.8" />
  </svg>
)

/* ═══ Крыши и территория ═══ */

/** Уборка снега с крыши — крыша + снежинки + стрелка вниз */
export const RoofSnowIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M3 14 L12 6 L21 14" />
    <path d="M5 14 L5 20 L19 20 L19 14" />
    <circle cx="8" cy="4" r="0.8" fill="currentColor" />
    <path d="M8 3 L8 5" />
    <path d="M7 4 L9 4" />
    <circle cx="16" cy="4" r="0.8" fill="currentColor" />
    <path d="M16 3 L16 5" />
    <path d="M15 4 L17 4" />
  </svg>
)

/** Чистка водостоков — вертикальная труба + течение */
export const GutterIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M6 3 L18 3 L18 6 L6 6 Z" />
    <path d="M10 6 L10 18" />
    <path d="M14 6 L14 18" />
    <path d="M10 18 C 10 20, 14 20, 14 18" />
    <path d="M10 9 L14 9" strokeDasharray="1.5 1.5" />
    <path d="M10 13 L14 13" strokeDasharray="1.5 1.5" />
    <path d="M12 20 L12 22" />
    <path d="M11 21 L13 21" />
  </svg>
)

/** Промышленный альпинизм — человечек на верёвке */
export const ClimberIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M4 3 L20 3" />
    <path d="M12 3 L12 18" />
    <circle cx="12" cy="10" r="2" />
    <path d="M10 13 L12 12 L14 13" />
    <path d="M10 16 L12 14 L14 16" />
    <path d="M9 19 L15 19" />
    <path d="M12 19 L12 21" />
  </svg>
)

/** Автовышка — телескопическая стрела с корзиной */
export const BoomLiftIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M2 20 L22 20" />
    <path d="M3 20 L3 15 L11 15 L11 20" />
    <circle cx="5.5" cy="20.5" r="1.4" />
    <circle cx="8.5" cy="20.5" r="1.4" />
    <path d="M7 15 L7 13 L10 13" strokeWidth="2" />
    <path d="M10 13 L16 7" strokeWidth="2" />
    <path d="M15 4 L21 4 L21 9 L15 9 Z" />
    <path d="M18 9 L18 4" />
  </svg>
)

/* ═══ Мусор и демонтаж ═══ */

/** Контейнер — dumpster со стрелками вверх (вывоз) */
export const DumpsterIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M3 8 L21 8" />
    <path d="M5 8 L5 19 L19 19 L19 8" />
    <circle cx="7.5" cy="20.5" r="1.4" />
    <circle cx="16.5" cy="20.5" r="1.4" />
    <path d="M9 14 L9 11" />
    <path d="M7.5 12.5 L9 11 L10.5 12.5" />
    <path d="M12 14 L12 11" />
    <path d="M10.5 12.5 L12 11 L13.5 12.5" />
    <path d="M15 14 L15 11" />
    <path d="M13.5 12.5 L15 11 L16.5 12.5" />
  </svg>
)

/** Демонтаж — постройка с трещинами-штрихами (softer Caregiver-tone) */
export const DemolitionIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M3 12 L12 4 L21 12" />
    <path d="M5 12 L5 20 L19 20 L19 12" />
    <path d="M8 20 L8 15 L11 15 L11 20" />
    <path d="M9 6 L11 8" strokeDasharray="1.5 1.2" />
    <path d="M14 9 L16 12" strokeDasharray="1.5 1.2" />
    <path d="M13 15 L15 18" strokeDasharray="1.5 1.2" />
    <path d="M15 13 L16 14" strokeDasharray="1.5 1.2" />
  </svg>
)

/** Измельчение веток — воронка-измельчитель с щепой */
export const ChipperIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M7 6 L17 6 L14 13 L10 13 Z" />
    <path d="M10 13 L10 18 L14 18 L14 13" />
    <path d="M5 3 L7 6" />
    <path d="M3 5 L7 6" />
    <path d="M17 18 L20 18" />
    <path d="M19 17 L21 17" />
    <path d="M19 19 L21 20" />
    <circle cx="11" cy="20.5" r="1" />
    <circle cx="13" cy="20.5" r="1" />
  </svg>
)

/* ═══ Общие ═══ */

/** Фикс-цена (якорь цены «за объект») — штамп с галочкой */
export const FixedPriceIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12 L11 15 L16 10" />
    <path d="M4 4 L6 6" strokeWidth="0.8" opacity="0.6" />
    <path d="M18 18 L20 20" strokeWidth="0.8" opacity="0.6" />
  </svg>
)

/** Быстрый отклик — часы со стрелкой */
export const FastResponseIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 8 L12 13 L15 15" />
    <path d="M8 3 L12 5" />
    <path d="M16 3 L12 5" />
  </svg>
)

/** Документы ГЖИ/ОАТИ — щит с галочкой */
export const LegalShieldIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3 C 15 5, 18 5, 20 4 C 20 14, 17 19, 12 21 C 7 19, 4 14, 4 4 C 6 5, 9 5, 12 3 Z" />
    <path d="M9 12 L11 14 L15 10" />
  </svg>
)

/** Вывоз снега — грузовик с открытым кузовом + снежинки */
export const SnowTruckIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M2 18 L13 18 L13 12 L17 12 L20 15 L20 18" />
    <circle cx="6" cy="18.5" r="1.4" />
    <circle cx="17" cy="18.5" r="1.4" />
    <path d="M2 18 L2 14 L8 14 L8 18" />
    <circle cx="5" cy="5" r="0.7" fill="currentColor" />
    <path d="M5 4 L5 6" />
    <path d="M4 5 L6 5" />
    <circle cx="10" cy="6" r="0.7" fill="currentColor" />
    <path d="M10 5 L10 7" />
    <path d="M9 6 L11 6" />
  </svg>
)

/** Стрижка газона — газонокосилка */
export const LawnMowerIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M4 17 L16 17 L18 14 L8 14 L6 10 L4 10 Z" />
    <circle cx="7" cy="19" r="1.4" />
    <circle cx="15" cy="19" r="1.4" />
    <path d="M6 10 L4 4" />
    <path d="M2 4 L6 4" />
    <path d="M11 13 L11 9" strokeDasharray="1 1" />
    <path d="M13 13 L13 8" strokeDasharray="1 1" />
    <path d="M15 13 L15 9" strokeDasharray="1 1" />
  </svg>
)

/** Выравнивание участка — экскаватор */
export const ExcavatorIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M3 19 L12 19 L12 14 L9 14 L9 11 L13 11 L15 13" />
    <path d="M15 13 L19 10" />
    <path d="M19 10 L21 6" strokeDasharray="1.5 1" />
    <path d="M19 4 L22 7 L20 9 L17 6 Z" />
    <circle cx="5" cy="20" r="1.2" />
    <circle cx="8" cy="20" r="1.2" />
    <circle cx="11" cy="20" r="1.2" />
  </svg>
)

/** Вырубка кустарников — три кустика */
export const BrushIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M5 20 C 5 14, 8 11, 8 8" />
    <path d="M8 8 L6 6" />
    <path d="M8 8 L10 6" />
    <path d="M10 20 C 10 15, 12 13, 12 10" />
    <path d="M12 10 L10 8" />
    <path d="M12 10 L14 8" />
    <path d="M15 20 C 15 13, 18 11, 18 8" />
    <path d="M18 8 L16 6" />
    <path d="M18 8 L20 6" />
    <path d="M3 20 L21 20" />
  </svg>
)

/** Украшение к Новому Году — ёлка с гирляндой */
export const WinterDecorIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4 L12 21" />
    <path d="M9 7 L12 4 L15 7" />
    <path d="M7 10 L12 7 L17 10" />
    <path d="M6 14 L12 10 L18 14" />
    <path d="M5 18 L12 14 L19 18" />
    <circle cx="9" cy="13" r="0.9" fill="currentColor" />
    <circle cx="15" cy="13" r="0.9" fill="currentColor" />
    <circle cx="8" cy="17" r="0.9" fill="currentColor" />
    <circle cx="12" cy="16" r="0.9" fill="currentColor" />
    <circle cx="16" cy="17" r="0.9" fill="currentColor" />
    <path d="M12 3 L11 2" />
    <path d="M12 3 L13 2" />
  </svg>
)

/** Мойка фасадов — фасад с высотных работ */
export const FacadeCleanIcon: FC<IconProps> = (p) => (
  <svg {...base} {...p}>
    <path d="M5 3 L19 3 L19 21 L5 21 Z" />
    <path d="M5 8 L19 8" />
    <path d="M5 13 L19 13" />
    <path d="M5 18 L19 18" />
    <path d="M9 3 L9 21" strokeDasharray="1.5 2" />
    <path d="M15 3 L15 21" strokeDasharray="1.5 2" />
    <path d="M2 10 L4 11" />
    <path d="M2 14 L4 14" />
    <path d="M2 18 L4 17" />
    <circle cx="1" cy="10" r="0.7" />
    <circle cx="1" cy="14" r="0.7" />
    <circle cx="1" cy="18" r="0.7" />
  </svg>
)

/* Каталог для реестра и mega-menu */

export const SERVICE_ICONS = {
  spil: { Component: SpilIcon, label: 'Спил деревьев', cluster: 'arboristika' },
  valka: { Component: ValkaIcon, label: 'Валка деревьев', cluster: 'arboristika' },
  stump: { Component: StumpIcon, label: 'Корчевание пней', cluster: 'arboristika' },
  prune: { Component: PruneIcon, label: 'Обрезка, кронирование', cluster: 'arboristika' },
  kabling: { Component: KablingIcon, label: 'Каблинг, брейсинг', cluster: 'arboristika' },
  spray: { Component: SprayIcon, label: 'Опрыскивание', cluster: 'arboristika' },
  'roof-snow': { Component: RoofSnowIcon, label: 'Уборка снега с крыш', cluster: 'krishi' },
  gutter: { Component: GutterIcon, label: 'Чистка водостоков', cluster: 'krishi' },
  climber: { Component: ClimberIcon, label: 'Промышленный альпинизм', cluster: 'krishi' },
  boomlift: { Component: BoomLiftIcon, label: 'Автовышка', cluster: 'krishi' },
  dumpster: { Component: DumpsterIcon, label: 'Вывоз мусора, контейнер', cluster: 'musor' },
  demolition: { Component: DemolitionIcon, label: 'Демонтаж сараев, перегородок', cluster: 'demontazh' },
  chipper: { Component: ChipperIcon, label: 'Измельчение веток', cluster: 'arboristika' },
  'fixed-price': { Component: FixedPriceIcon, label: 'Фикс-цена за объект', cluster: 'common' },
  'fast-response': { Component: FastResponseIcon, label: 'Смета за 10 минут', cluster: 'common' },
  'legal-shield': { Component: LegalShieldIcon, label: 'Штрафы ГЖИ/ОАТИ на нас', cluster: 'common' },
  'snow-truck': { Component: SnowTruckIcon, label: 'Вывоз снега', cluster: 'krishi' },
  'lawn-mower': { Component: LawnMowerIcon, label: 'Стрижка газона', cluster: 'territory' },
  excavator: { Component: ExcavatorIcon, label: 'Выравнивание участка', cluster: 'demontazh' },
  brush: { Component: BrushIcon, label: 'Вырубка кустарников', cluster: 'arboristika' },
  'winter-decor': { Component: WinterDecorIcon, label: 'Украшение к НГ', cluster: 'krishi' },
  'facade-clean': { Component: FacadeCleanIcon, label: 'Мойка фасадов', cluster: 'krishi' },
} as const

export type ServiceIconKey = keyof typeof SERVICE_ICONS
