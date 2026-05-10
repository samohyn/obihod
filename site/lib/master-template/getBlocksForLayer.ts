/**
 * Resolver `getBlocksForLayer` — EPIC-SERVICE-PAGES-UX C4.
 *
 * Реализует ADR-0021 §«Resolver / migration»:
 *   - reorder sustained blocks[] под master-template fixed order
 *   - filter out hidden sections per layer
 *   - fill missing required sections с placeholder (template_v2 = true mode)
 *   - legacy mode (template_v2 = false) — return blocks as-is
 *
 * Использование (page.tsx integration):
 *
 *   const docBlocks = doc.blocks as DocumentBlock[]
 *   const useV2 = isTemplateV2Enabled(doc)
 *   const blocks = getBlocksForLayer('T2_PILLAR', docBlocks, {
 *     templateV2: useV2,
 *     fillMissingWithPlaceholder: true,
 *   })
 *   return <BlockRenderer blocks={blocks as never} />
 *
 * Контракт:
 *   - templateV2=false  → identity (no transform; sustained legacy behavior)
 *   - templateV2=true   → reorder + filter hidden + fill placeholders
 *
 * Sustained 233 URL — при templateV2=false default rendering identical к
 * baseline. Перевод per-URL через Payload field `useTemplateV2` (см. C4 spec).
 */

import {
  getSectionsForLayer,
  masterTemplate,
  type DocumentBlock,
  type MasterTemplateLayer,
  type MasterTemplateSection,
  type SectionSpec,
} from '@/blocks/master-template'

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

/**
 * Slug → section reverse map.
 *
 * Sustained с master-template.ts SLUG_TO_SECTION (но там private const).
 * Дублируем здесь, потому что resolver работает на уровне `blockType` строки.
 *
 * NB: `calculator-placeholder` slug → `calculator` section — sustained drift
 * fix из master-template.ts (см. ADR-0021 §«SLUG_TO_SECTION mapping»).
 */
const SLUG_TO_SECTION: Record<string, MasterTemplateSection> = {
  hero: 'hero',
  breadcrumbs: 'breadcrumbs',
  tldr: 'tldr',
  'services-grid': 'services-grid',
  'pricing-block': 'pricing-block',
  'calculator-placeholder': 'calculator',
  process: 'process',
  'mini-case': 'mini-case',
  faq: 'faq',
  'cta-banner': 'cta-banner',
  'related-services': 'related-services',
  'neighbor-districts': 'neighbor-districts',
  'lead-form': 'lead-form',
  // Amendment 1 ADR-0021 (2026-05-10) — sustained legacy text-content section.
  'text-content': 'text-content',
}

/**
 * Section → preferred slug (для placeholder-fill).
 *
 * Используется когда required section отсутствует и нужно вставить placeholder
 * с правильным `blockType`.
 */
const SECTION_TO_PLACEHOLDER_SLUG: Record<MasterTemplateSection, string> = {
  hero: 'hero',
  breadcrumbs: 'breadcrumbs',
  tldr: 'tldr',
  'services-grid': 'services-grid',
  'pricing-block': 'pricing-block',
  calculator: 'calculator-placeholder',
  process: 'process',
  'mini-case': 'mini-case',
  faq: 'faq',
  'cta-banner': 'cta-banner',
  'related-services': 'related-services',
  'neighbor-districts': 'neighbor-districts',
  'lead-form': 'lead-form',
  // Amendment 1 ADR-0021 (2026-05-10) — text-content optional на T2/T3.
  'text-content': 'text-content',
}

export interface GetBlocksForLayerOptions {
  /**
   * Feature flag `template_v2`.
   * - false (default): legacy behavior — return blocks as-is.
   * - true: reorder + filter hidden + fill missing required.
   */
  templateV2: boolean
  /**
   * Только при templateV2=true. Если required section отсутствует:
   * - true: вставить placeholder block (с `placeholder: true` маркером).
   * - false: drop section (или throw, см. `onMissingRequired`).
   */
  fillMissingWithPlaceholder: boolean
  /**
   * Только при templateV2=true && fillMissingWithPlaceholder=false.
   * - 'warn' (default): console.warn в dev, silent в prod.
   * - 'throw': бросить Error (для CI / qa режимов).
   * - 'silent': игнорировать.
   */
  onMissingRequired?: 'warn' | 'throw' | 'silent'
}

/**
 * Resolver result — массив blocks в master-template order.
 *
 * Each block имеет sustained shape DocumentBlock + опциональный
 * `_placeholder: true` маркер на placeholder-блоках (renderer может
 * визуально пометить — TODO copy etc).
 */
export type ResolvedBlock = DocumentBlock & { _placeholder?: boolean }

// ────────────────────────────────────────────────────────────────────────────
// Resolver
// ────────────────────────────────────────────────────────────────────────────

/**
 * Reorder + filter + fill blocks под master-template для конкретного layer.
 *
 * Контракт:
 *   - templateV2=false → identity (return currentBlocks as-is)
 *   - templateV2=true:
 *     1. Map currentBlocks → section через SLUG_TO_SECTION.
 *     2. Drop blocks where section.presence[layer] === 'hidden'.
 *     3. Drop unknown blockType (не входят в master-template).
 *     4. Reorder под masterTemplate fixed order (1..13).
 *     5. Для каждой `required` section без matching block:
 *        - fillMissingWithPlaceholder=true: вставить placeholder.
 *        - fillMissingWithPlaceholder=false: skip (warn / throw / silent).
 *
 * Edge cases:
 *   - Empty blocks[] + templateV2=true + fill=true → all-placeholders array.
 *   - Duplicate sections в input → keep first, drop rest (защита от
 *     инвалидного БД-state; sustained validator должен это поймать на write).
 */
export function getBlocksForLayer(
  layer: MasterTemplateLayer,
  currentBlocks: readonly DocumentBlock[],
  options: GetBlocksForLayerOptions,
): ResolvedBlock[] {
  // Legacy mode — return as-is (cast к ResolvedBlock; _placeholder отсутствует).
  if (!options.templateV2) {
    return currentBlocks as ResolvedBlock[]
  }

  const sectionsForLayer = getSectionsForLayer(layer) // required + optional, no hidden
  const sectionsForLayerSet = new Set(sectionsForLayer.map((s) => s.section))

  // 1. Map input blocks → section. Drop unknown / hidden / duplicates.
  const blockBySection = new Map<MasterTemplateSection, DocumentBlock>()
  for (const block of currentBlocks) {
    const section = SLUG_TO_SECTION[block.blockType]
    if (!section) {
      // Unknown block — drop (sustained validator уже бы поймал на write).
      continue
    }
    if (!sectionsForLayerSet.has(section)) {
      // Hidden для этого layer — drop.
      continue
    }
    if (blockBySection.has(section)) {
      // Duplicate — keep first.
      continue
    }
    blockBySection.set(section, block)
  }

  // 2. Reorder + fill missing required.
  const result: ResolvedBlock[] = []
  for (const spec of sectionsForLayer) {
    const existing = blockBySection.get(spec.section)
    if (existing) {
      result.push(existing as ResolvedBlock)
      continue
    }

    // Section отсутствует. Если required → handle per options.
    if (spec.presence[layer] === 'required') {
      if (options.fillMissingWithPlaceholder) {
        result.push(buildPlaceholder(spec))
      } else {
        const mode = options.onMissingRequired ?? 'warn'
        const message = `[getBlocksForLayer] Required section '${spec.section}' missing для layer '${layer}'. Включите fillMissingWithPlaceholder=true или вставьте блок в БД.`
        if (mode === 'throw') {
          throw new Error(message)
        }
        if (mode === 'warn' && process.env.NODE_ENV !== 'production') {
          console.warn(message)
        }
        // silent: skip
      }
    }
    // Optional and missing → skip (валидно, ничего не делаем).
  }

  return result
}

// ────────────────────────────────────────────────────────────────────────────
// Placeholder builder
// ────────────────────────────────────────────────────────────────────────────

/**
 * Создаёт placeholder block для missing required section.
 *
 * `_placeholder: true` — marker для рендерера (отрисовать TODO copy).
 *
 * Renderer-side (BlockRenderer.tsx или Placeholder*.tsx components) знает
 * как отобразить TODO copy для каждого section type. Resolver просто
 * сигнализирует «здесь должен быть блок X, но БД пуста».
 */
function buildPlaceholder(spec: SectionSpec): ResolvedBlock {
  const blockType = SECTION_TO_PLACEHOLDER_SLUG[spec.section]
  return {
    blockType,
    _placeholder: true,
    enabled: true,
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Exports for testing / debug tooling
// ────────────────────────────────────────────────────────────────────────────

/**
 * Reverse map для тестов / qa report. Не использовать в runtime коде —
 * runtime читает sustained `SLUG_TO_SECTION` private const.
 */
export const _SLUG_TO_SECTION = SLUG_TO_SECTION
export const _SECTION_TO_PLACEHOLDER_SLUG = SECTION_TO_PLACEHOLDER_SLUG

/**
 * Debug helper — список секций которые resolver считает missing required для
 * данного blocks[] и layer. Используется в qa report (C6 wave).
 */
export function getMissingRequiredSections(
  layer: MasterTemplateLayer,
  currentBlocks: readonly DocumentBlock[],
): MasterTemplateSection[] {
  const present = new Set<MasterTemplateSection>()
  for (const block of currentBlocks) {
    const section = SLUG_TO_SECTION[block.blockType]
    if (section) present.add(section)
  }

  const missing: MasterTemplateSection[] = []
  for (const spec of masterTemplate) {
    if (spec.presence[layer] === 'required' && !present.has(spec.section)) {
      missing.push(spec.section)
    }
  }
  return missing
}
