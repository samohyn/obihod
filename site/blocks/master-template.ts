/**
 * Master template schema для service-страниц `/uslugi/*` (T2/T3/T4).
 *
 * Реализует ADR-0021 (`team/adr/ADR-0021-service-page-master-template.md`).
 *
 * Schema описывает:
 *   - 13 секций master-template в фиксированном порядке
 *   - per-layer (T2_PILLAR / T3_SUB / T4_SD) флаги required / optional / hidden
 *   - mapping каждой секции на §brand-guide.html (sustained ready vs requires-extension)
 *   - validator factory `validateMasterTemplate()` — для Payload publish hook + CI
 *
 * Resolver-логика `getBlocksForLayer(layer, blocks, masterTemplate)` — это C4 wave
 * (`site/lib/blocks/resolver.ts`), НЕ часть этого файла. Здесь только schema +
 * validator factory.
 *
 * NB: Используем TS literal types + plain runtime validator вместо Zod runtime —
 * zod не sustained dependency в `site/package.json`, добавление через
 * `pnpm install` запрещено intake constraint'ами. Архитектурно эквивалентно:
 * compile-time type safety + runtime check + явные error messages.
 *
 * Связь с composer.ts:
 *   `MasterTemplateLayer` совпадает с `TemplateKind` из `lib/seo/composer.ts`
 *   за исключением `T1_HUB` — это другой template (homepage), не покрывается
 *   этим ADR (intake out-of-scope «Главная — отдельный EPIC»).
 */

import type { Block } from 'payload'

import {
  Breadcrumbs,
  Calculator,
  CtaBanner,
  Faq,
  Hero,
  LeadForm,
  MiniCase,
  NeighborDistricts,
  RelatedServices,
  ServicesGrid,
  TextContent,
  Tldr,
} from './index'

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

/**
 * Layer service-страницы — соответствует `TemplateKind` из `composer.ts`
 * за исключением `T1_HUB` (homepage = отдельный template).
 *
 * - `T2_PILLAR` — pillar-страница (`/<pillar>/`), 5 шт
 * - `T3_SUB` — sub-service (`/<pillar>/<sub>/`), 35 шт
 * - `T4_SD` — service × district (`/<pillar>/<city>/`), 150 шт
 */
export type MasterTemplateLayer = 'T2_PILLAR' | 'T3_SUB' | 'T4_SD'

/**
 * 14 секций master-template в фиксированном порядке.
 *
 * Базовый набор 13 — ADR-0021 §«Структура».
 * Section `text-content` (order=4, optional на T2/T3, hidden на T4) — Amendment 1
 * к ADR-0021 (2026-05-10). Long-form richText body для extended SEO-копий
 * на pillar/sub URL. Не required — sustained pillar/sub без text-content
 * остаются валидными. Hidden на T4_SD — для programmatic SD есть
 * leadParagraph + localFaq + landmarks, long-form text-content там избыточен.
 *
 * Order — invariant: reorder только через новый ADR.
 */
export type MasterTemplateSection =
  | 'hero'
  | 'breadcrumbs'
  | 'tldr'
  | 'text-content'
  | 'services-grid'
  | 'pricing-block'
  | 'calculator'
  | 'process'
  | 'mini-case'
  | 'faq'
  | 'cta-banner'
  | 'related-services'
  | 'neighbor-districts'
  | 'lead-form'

/**
 * Per-layer presence для секции:
 * - `required` — обязательна, validator fail если отсутствует
 * - `optional`  — допустима, не fail если отсутствует
 * - `hidden`    — запрещена, validator fail если присутствует
 */
export type SectionPresence = 'required' | 'optional' | 'hidden'

/**
 * Brand-guide mapping для секции.
 *
 * - `ready`  — sustained компонент готов (`brand_guide_anchor` обязателен)
 * - `requires-extension` — design расширяет brand-guide.html в C2.5 wave
 *   (`extension_spec` обязателен — какой § добавить, что внутри)
 */
export type BrandGuideStatus = 'ready' | 'requires-extension'

export interface BrandGuideMapping {
  status: BrandGuideStatus
  /**
   * Anchor в `design-system/brand-guide.html`. Формат: `#section-id` или
   * `#section-id:line-number` (пример: `#components:1299-1311`). Sustained
   * line-numbers могут смещаться при правках brand-guide; anchor +
   * текстовое описание section-id — single source of truth.
   */
  brand_guide_anchor: string | null
  /**
   * Спека для C2.5 design wave (только при status='requires-extension').
   * Формат: «§Title (priority): описание что добавить».
   */
  extension_spec: string | null
  /**
   * Customer journey step (ADR-0021 §«Customer journey»):
   * 1=Awareness, 2=Comprehension, 3=Trust, 4=Action.
   * Guard для design review: новая секция должна маппиться на step.
   */
  journey_step: 1 | 2 | 3 | 4
}

/**
 * Spec одной секции master-template.
 */
export interface SectionSpec {
  section: MasterTemplateSection
  /**
   * Order index в final layout (1..13). Resolver выводит секции в этом
   * порядке независимо от позиции в `blocks[]` Payload-документа.
   */
  order: number
  /**
   * Per-layer presence matrix.
   */
  presence: Record<MasterTemplateLayer, SectionPresence>
  /**
   * Brand-guide mapping.
   */
  brand_guide: BrandGuideMapping
  /**
   * Связь с sustained Payload Block (если есть). `null` для секций,
   * которые требуют создания нового блока (см. ADR-0021 §«Brand-guide
   * расширения» Critical-список).
   */
  payload_block: Block | null
}

/**
 * Полный master-template — 13 SectionSpec в фиксированном order.
 */
export type MasterTemplate = readonly SectionSpec[]

// ────────────────────────────────────────────────────────────────────────────
// Master template constant
// ────────────────────────────────────────────────────────────────────────────

/**
 * Master template для service-страниц.
 *
 * Order — invariant. Hidden ≠ удалён: секция исключена для конкретного layer
 * на уровне validator (validation error если присутствует в blocks[]).
 *
 * Brand-guide mapping cross-checked с `design-system/inventory-services-2026-05.md`
 * и ADR-0021 §«Mapping table».
 */
export const masterTemplate: MasterTemplate = [
  {
    section: 'hero',
    order: 1,
    presence: { T2_PILLAR: 'required', T3_SUB: 'required', T4_SD: 'required' },
    brand_guide: {
      status: 'requires-extension',
      brand_guide_anchor: '#type',
      extension_spec:
        '§Hero patterns (critical): 6 mockup T2/T3/T4 × desktop/mobile. T2 — h-display + lead + photo-upload USP CTA. T3 — district-pill + photo-сверху mobile. T4 — city-specific photo + 150+ слов city-вступления.',
      journey_step: 1,
    },
    payload_block: Hero,
  },
  {
    section: 'breadcrumbs',
    order: 2,
    presence: { T2_PILLAR: 'required', T3_SUB: 'required', T4_SD: 'required' },
    brand_guide: {
      status: 'requires-extension',
      brand_guide_anchor: '#nav',
      extension_spec:
        '§Breadcrumbs (medium): visual variant + BreadcrumbList JSON-LD snippet (composer.ts done). Mobile — collapsible если ≥4 уровня (T4 SD).',
      journey_step: 1,
    },
    payload_block: Breadcrumbs,
  },
  {
    section: 'tldr',
    order: 3,
    presence: { T2_PILLAR: 'required', T3_SUB: 'required', T4_SD: 'required' },
    brand_guide: {
      status: 'requires-extension',
      brand_guide_anchor: '#components',
      extension_spec:
        '§TL;DR / Summary block (medium): card с border-left 4px primary, eyebrow «Кратко», 3-5 пунктов ul. Speakable атрибуты для нейровыдачи (sustained US-3).',
      journey_step: 2,
    },
    payload_block: Tldr,
  },
  {
    // Amendment 1 ADR-0021 (2026-05-10): legacy long-form richText body.
    // Optional на T2/T3 (extended SEO-копии под intent-кластеры pillar/sub).
    // Hidden на T4_SD (programmatic SD имеет leadParagraph + localFaq +
    // landmarks для locale-content; long-form там избыточен).
    section: 'text-content',
    order: 4,
    presence: { T2_PILLAR: 'optional', T3_SUB: 'optional', T4_SD: 'hidden' },
    brand_guide: {
      status: 'ready',
      brand_guide_anchor: '#components',
      extension_spec: null,
      journey_step: 2,
    },
    payload_block: TextContent,
  },
  {
    section: 'services-grid',
    order: 5,
    presence: { T2_PILLAR: 'required', T3_SUB: 'hidden', T4_SD: 'hidden' },
    brand_guide: {
      status: 'requires-extension',
      brand_guide_anchor: '#components:1299',
      extension_spec:
        '§Services Grid layout-spec (critical extension существующей Карточки услуги): 3 col desktop / 2 col tablet / 1 col mobile, gap 16px, опц filter chips (radius-sm pill).',
      journey_step: 2,
    },
    payload_block: ServicesGrid,
  },
  {
    section: 'pricing-block',
    order: 6,
    presence: { T2_PILLAR: 'required', T3_SUB: 'required', T4_SD: 'required' },
    brand_guide: {
      status: 'requires-extension',
      brand_guide_anchor: '#components',
      extension_spec:
        '§Pricing table (critical): 3-col tier (Базовый / Стандарт / Под ключ), highlighted middle col, tabular-nums (#type mono.tnum). Mobile collapse в accordion-cards. Tooltip на feature row.',
      journey_step: 2,
    },
    payload_block: null, // C2.5 design wave создаёт новый блок PricingTable
  },
  {
    section: 'calculator',
    order: 7,
    presence: { T2_PILLAR: 'required', T3_SUB: 'required', T4_SD: 'required' },
    brand_guide: {
      status: 'requires-extension',
      brand_guide_anchor: '#notifications:2387',
      extension_spec:
        '§Calculator UI shell (critical): 5 состояний idle/drag-over/uploading/processing/result. Reuse 5-state flow + skeleton + success-card из #notifications. Drag-drop area dashed border, photo-thumbnail row 60x60px с remove. Mobile: full-width hero, camera/gallery alternative.',
      journey_step: 3,
    },
    payload_block: Calculator,
  },
  {
    section: 'process',
    order: 8,
    presence: { T2_PILLAR: 'required', T3_SUB: 'required', T4_SD: 'required' },
    brand_guide: {
      status: 'requires-extension',
      brand_guide_anchor: '#components',
      extension_spec:
        '§Process steps (high): horizontal numbered (desktop 4-7 шагов) / vertical (mobile, номер 32px слева). Service-icon из #icons line-art 1.5px. Reduce-motion guard.',
      journey_step: 3,
    },
    payload_block: null, // C2.5 design wave создаёт новый блок ProcessSteps
  },
  {
    section: 'mini-case',
    order: 9,
    presence: { T2_PILLAR: 'required', T3_SUB: 'optional', T4_SD: 'required' },
    brand_guide: {
      status: 'requires-extension',
      brand_guide_anchor: '#icons:1487',
      extension_spec:
        '§Mini-case teaser (high): icon + before/after photo (fal.ai) + 1 metric (числовой) + link на /kejsy/<slug>/. T2 horizontal, T4 city-photo. Empty state из #notifications если нет кейсов.',
      journey_step: 3,
    },
    payload_block: MiniCase,
  },
  {
    section: 'faq',
    order: 10,
    presence: { T2_PILLAR: 'required', T3_SUB: 'required', T4_SD: 'required' },
    brand_guide: {
      status: 'requires-extension',
      brand_guide_anchor: '#nav:2019',
      extension_spec:
        '§FAQ accordion (high): reuse mobile-mega-menu <details>/<summary> pattern. Chevron rotation 180°. ≥44pt tap-area. JSON-LD FAQPage уже в composer.ts (US-3 done).',
      journey_step: 3,
    },
    payload_block: Faq,
  },
  {
    section: 'cta-banner',
    order: 11,
    presence: { T2_PILLAR: 'required', T3_SUB: 'optional', T4_SD: 'required' },
    brand_guide: {
      status: 'ready',
      brand_guide_anchor: '#site-chrome:3934',
      extension_spec:
        'minor: §Inline CTA banner variant — тот же markup pre-footer (sustained §33.4.1), другой spacing для inline вставки (margin: 80px 0 inline vs final pre-footer).',
      journey_step: 4,
    },
    payload_block: CtaBanner,
  },
  {
    section: 'related-services',
    order: 12,
    presence: { T2_PILLAR: 'required', T3_SUB: 'required', T4_SD: 'optional' },
    brand_guide: {
      status: 'ready',
      brand_guide_anchor: '#components:1299',
      extension_spec: null,
      journey_step: 4,
    },
    payload_block: RelatedServices,
  },
  {
    section: 'neighbor-districts',
    order: 13,
    presence: { T2_PILLAR: 'hidden', T3_SUB: 'required', T4_SD: 'required' },
    brand_guide: {
      status: 'requires-extension',
      brand_guide_anchor: '#icons:1417',
      extension_spec:
        '§District chips/grid (medium): pill с landmark-иконкой + название + расстояние «12 км». 3-6 chips в row. Расширение списка до 28+ районов через wsfreq US-4.',
      journey_step: 4,
    },
    payload_block: NeighborDistricts,
  },
  {
    section: 'lead-form',
    order: 14,
    presence: { T2_PILLAR: 'required', T3_SUB: 'required', T4_SD: 'required' },
    brand_guide: {
      status: 'requires-extension',
      brand_guide_anchor: '#components:1291',
      extension_spec:
        '§Lead form (full) (critical): phone (autocomplete=tel) + name + photo upload (multi) + 152-ФЗ checkbox + textarea коммент. 5-state flow Idle→Filled→Submitting→Success→Error (sustained #notifications:2387). Anti-TOV guard (sustained #tov anti-words list). Mobile input height ≥44pt.',
      journey_step: 4,
    },
    payload_block: LeadForm,
  },
] as const

// ────────────────────────────────────────────────────────────────────────────
// Validator factory
// ────────────────────────────────────────────────────────────────────────────

export interface ValidationError {
  code: 'MISSING_REQUIRED' | 'PRESENT_HIDDEN' | 'UNKNOWN_BLOCK' | 'DUPLICATE_SECTION' | 'NO_LAYER'
  section?: MasterTemplateSection
  blockType?: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  /**
   * Sustained sections found in input — для debug / qa review tooling.
   */
  found_sections: MasterTemplateSection[]
}

/**
 * Mapping `block.slug` (Payload) → `MasterTemplateSection` (template).
 *
 * Slug-namespace следует sustained naming convention sustained блоков
 * (см. `site/blocks/<Block>.ts` каждый имеет `slug: '<kebab>'`).
 *
 * NB: pricing-block и process не имеют sustained payload_block — они
 * создаются в C2.5 design wave + C3 schema reference. Validator знает их
 * по slug заранее (ожидаемые slugs зарегистрированы в этой map'е), но при
 * приёме blocks[] от Payload эти секции могут отсутствовать (sustained
 * data) — это hand-off C4 resolver fills с placeholder.
 */
const SLUG_TO_SECTION: Record<string, MasterTemplateSection> = {
  hero: 'hero',
  breadcrumbs: 'breadcrumbs',
  tldr: 'tldr',
  // Amendment 1 ADR-0021 (2026-05-10): text-content — long-form richText
  // body, optional на T2/T3, hidden на T4 (см. masterTemplate const выше).
  'text-content': 'text-content',
  'services-grid': 'services-grid',
  'pricing-block': 'pricing-block', // C3 future block
  // D3 wave A blockReferences: PricingTable.slug = 'pricing-table'.
  // Master-template section name = 'pricing-block' (ADR-0021). Alias.
  'pricing-table': 'pricing-block',
  // Sustained Payload block slug = 'calculator-placeholder' (см. blocks/Calculator.ts).
  // Master-template section name = 'calculator' (ADR-0021). Mapping fixes drift.
  'calculator-placeholder': 'calculator',
  process: 'process', // C3 future block
  // D3 wave A blockReferences: ProcessSteps.slug = 'process-steps'.
  // Master-template section name = 'process' (ADR-0021). Alias.
  'process-steps': 'process',
  'mini-case': 'mini-case',
  faq: 'faq',
  'cta-banner': 'cta-banner',
  'related-services': 'related-services',
  'neighbor-districts': 'neighbor-districts',
  'lead-form': 'lead-form',
}

/**
 * Минимальный type для blocks[] в Payload doc.
 * Совпадает с тем, что Payload отдаёт в afterRead / beforeChange.
 */
export interface DocumentBlock {
  blockType: string
  // другие поля игнорируются — мы валидируем только presence по blockType
  [key: string]: unknown
}

/**
 * Validator factory: возвращает функцию-валидатор для конкретного layer.
 *
 * Использование (C3 wave):
 *
 *   import { createMasterTemplateValidator } from '@/blocks/master-template'
 *   const validate = createMasterTemplateValidator('T2_PILLAR')
 *   const result = validate(doc.blocks)
 *   if (!result.valid) throw new Error(result.errors.map(e => e.message).join('; '))
 *
 * Sustained Payload publish hook (`Services.ts` → `hooks.beforeChange`):
 *
 *   beforeChange: [({ data, operation }) => {
 *     if (operation === 'create' || operation === 'update') {
 *       const layer = inferLayer(data) // pillar | sub | district
 *       const result = createMasterTemplateValidator(layer)(data.blocks ?? [])
 *       if (!result.valid) throw new APIError(result.errors[0].message, 400)
 *     }
 *     return data
 *   }]
 *
 * Для CI-gate: одинаковый вызов из `pnpm lint:template` script (C6 wave).
 */
export function createMasterTemplateValidator(layer: MasterTemplateLayer) {
  return function validateMasterTemplate(blocks: readonly DocumentBlock[]): ValidationResult {
    const errors: ValidationError[] = []
    const foundSections: MasterTemplateSection[] = []
    const seenSections = new Set<MasterTemplateSection>()

    // 1. Проверка blocks[] на unknown / duplicate / hidden
    for (const block of blocks) {
      const section = SLUG_TO_SECTION[block.blockType]

      if (!section) {
        // Unknown block — может быть legacy `text-content` или новый блок
        // вне master-template. Не fail (не наш scope), но репортим для qa.
        errors.push({
          code: 'UNKNOWN_BLOCK',
          blockType: block.blockType,
          message: `Block '${block.blockType}' не входит в master-template (ADR-0021). Допустимые: ${Object.keys(SLUG_TO_SECTION).join(', ')}.`,
        })
        continue
      }

      if (seenSections.has(section)) {
        errors.push({
          code: 'DUPLICATE_SECTION',
          section,
          message: `Section '${section}' встречается дважды. Master-template требует уникальности (ADR-0021 §«Структура»).`,
        })
        continue
      }
      seenSections.add(section)
      foundSections.push(section)

      const spec = masterTemplate.find((s) => s.section === section)
      if (!spec) {
        // unreachable — SLUG_TO_SECTION в sync с masterTemplate
        continue
      }

      if (spec.presence[layer] === 'hidden') {
        errors.push({
          code: 'PRESENT_HIDDEN',
          section,
          message: `Section '${section}' скрыта для layer '${layer}' (ADR-0021 §«Per-layer matrix»). Удалите блок из документа.`,
        })
      }
    }

    // 2. Проверка отсутствующих required секций
    for (const spec of masterTemplate) {
      if (spec.presence[layer] === 'required' && !seenSections.has(spec.section)) {
        errors.push({
          code: 'MISSING_REQUIRED',
          section: spec.section,
          message: `Section '${spec.section}' обязательна для layer '${layer}' (ADR-0021 §«Per-layer matrix»). Добавьте блок в документ.`,
        })
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      found_sections: foundSections,
    }
  }
}

/**
 * Convenience-обёртка для intake §1 / Payload validate-hook: возвращает
 * `{ valid, errors: string[] }` вместо `ValidationError[]`. Layer передаётся
 * аргументом — `inferLayerForCollection` помогает в hook'е.
 *
 * Использование:
 *
 *   import { validateBlocksAgainstTemplate } from '@/blocks/master-template'
 *   const { valid, errors } = validateBlocksAgainstTemplate('T2_PILLAR', doc.blocks)
 *   if (!valid) throw new Error(errors[0])
 */
export function validateBlocksAgainstTemplate(
  layer: MasterTemplateLayer,
  blocks: ReadonlyArray<{ blockType: string; [key: string]: unknown }>,
): { valid: boolean; errors: string[] } {
  const result = createMasterTemplateValidator(layer)(blocks as readonly DocumentBlock[])
  return {
    valid: result.valid,
    errors: result.errors.map((e) => e.message),
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers (для resolver C4 wave + qa review tooling)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Возвращает sections в правильном order для конкретного layer.
 * Включает required + optional, исключает hidden.
 *
 * Используется в C4 resolver (`getBlocksForLayer`) для reorder + fill missing.
 */
export function getSectionsForLayer(layer: MasterTemplateLayer): readonly SectionSpec[] {
  return masterTemplate.filter((s) => s.presence[layer] !== 'hidden')
}

/**
 * Возвращает только required sections для layer.
 * Используется в qa report tooling (C6).
 */
export function getRequiredSectionsForLayer(layer: MasterTemplateLayer): readonly SectionSpec[] {
  return masterTemplate.filter((s) => s.presence[layer] === 'required')
}

/**
 * Возвращает order index секции для layer.
 * `null` если секция hidden для этого layer (resolver не должна её включать).
 *
 * Используется в C4 resolver для sort'а sustained blocks[] под master-template
 * order (ADR-0021 invariant: fixed order для всех layer).
 */
export function getOrderIndex(
  section: MasterTemplateSection,
  layer: MasterTemplateLayer,
): number | null {
  const spec = masterTemplate.find((s) => s.section === section)
  if (!spec) return null
  if (spec.presence[layer] === 'hidden') return null
  return spec.order
}

/**
 * Sanity-check: master-template self-validation.
 *
 * Запускается в test:unit (C6) — гарантирует что:
 *   - 13 секций (фиксированное число из ADR-0021)
 *   - Order monotonic 1..13 без дыр
 *   - Каждая section уникальна
 *   - SLUG_TO_SECTION в sync с masterTemplate (нет orphan slugs)
 *   - Каждая requires-extension имеет non-null extension_spec
 *   - Каждая ready секция имеет non-null brand_guide_anchor
 */
export function selfValidate(): ValidationResult {
  const errors: ValidationError[] = []

  // Amendment 1 (2026-05-10): 13 → 14 (+text-content optional на T2/T3).
  if (masterTemplate.length !== 14) {
    errors.push({
      code: 'MISSING_REQUIRED',
      message: `Master-template должен содержать 14 секций, найдено ${masterTemplate.length} (ADR-0021 + Amendment 1).`,
    })
  }

  const orders = masterTemplate.map((s) => s.order).sort((a, b) => a - b)
  for (let i = 0; i < orders.length; i++) {
    if (orders[i] !== i + 1) {
      errors.push({
        code: 'MISSING_REQUIRED',
        message: `Order monotonic violation: ожидался ${i + 1}, найден ${orders[i]}.`,
      })
      break
    }
  }

  const sectionSet = new Set<string>()
  for (const spec of masterTemplate) {
    if (sectionSet.has(spec.section)) {
      errors.push({
        code: 'DUPLICATE_SECTION',
        section: spec.section,
        message: `Section '${spec.section}' дублируется в masterTemplate const.`,
      })
    }
    sectionSet.add(spec.section)

    if (spec.brand_guide.status === 'requires-extension' && !spec.brand_guide.extension_spec) {
      errors.push({
        code: 'MISSING_REQUIRED',
        section: spec.section,
        message: `Section '${spec.section}' status='requires-extension', но extension_spec=null. Заполните спеку для C2.5 wave.`,
      })
    }

    if (spec.brand_guide.status === 'ready' && !spec.brand_guide.brand_guide_anchor) {
      errors.push({
        code: 'MISSING_REQUIRED',
        section: spec.section,
        message: `Section '${spec.section}' status='ready', но brand_guide_anchor=null. Укажите #section:line.`,
      })
    }
  }

  // SLUG_TO_SECTION ↔ masterTemplate sync
  const templateSections = new Set(masterTemplate.map((s) => s.section))
  for (const [slug, section] of Object.entries(SLUG_TO_SECTION)) {
    if (!templateSections.has(section)) {
      errors.push({
        code: 'UNKNOWN_BLOCK',
        blockType: slug,
        message: `SLUG_TO_SECTION имеет orphan entry '${slug}' → '${section}', section не в masterTemplate.`,
      })
    }
  }
  for (const spec of masterTemplate) {
    const slugInMap = Object.values(SLUG_TO_SECTION).includes(spec.section)
    if (!slugInMap) {
      errors.push({
        code: 'UNKNOWN_BLOCK',
        section: spec.section,
        message: `Section '${spec.section}' отсутствует в SLUG_TO_SECTION reverse map. Validator её не увидит в blocks[].`,
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    found_sections: masterTemplate.map((s) => s.section),
  }
}
