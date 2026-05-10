/**
 * Tests для master-template.ts (EPIC-SERVICE-PAGES-UX C3).
 *
 * Runner: `node:test` через `tsx --test`. Sustained — vitest/jest НЕ установлены
 * в site/ (intake constraint: not adding deps).
 *
 * Запуск:
 *   pnpm --filter site exec tsx --test blocks/__tests__/master-template.test.ts
 *
 * Покрывает:
 *   - selfValidate sanity-check
 *   - createMasterTemplateValidator(layer)(blocks) per layer
 *   - validateBlocksAgainstTemplate convenience обёртка
 *   - hidden-section enforcement (T2 не может содержать neighbor-districts)
 *   - duplicate detection
 *   - unknown block reporting
 *   - getSectionsForLayer / getRequiredSectionsForLayer / getOrderIndex helpers
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import {
  createMasterTemplateValidator,
  validateBlocksAgainstTemplate,
  selfValidate,
  getSectionsForLayer,
  getRequiredSectionsForLayer,
  getOrderIndex,
  masterTemplate,
  type DocumentBlock,
} from '../master-template'

// ────────────────────────────────────────────────────────────────────────────
// Test fixtures
// ────────────────────────────────────────────────────────────────────────────

/**
 * T2_PILLAR полный набор required + optional. Sustained slug names per
 * site/blocks/<Block>.ts (calculator-placeholder вместо calculator).
 */
const T2_FULL: DocumentBlock[] = [
  { blockType: 'hero' },
  { blockType: 'breadcrumbs' },
  { blockType: 'tldr' },
  { blockType: 'services-grid' },
  { blockType: 'pricing-block' },
  { blockType: 'calculator-placeholder' },
  { blockType: 'process' },
  { blockType: 'mini-case' },
  { blockType: 'faq' },
  { blockType: 'cta-banner' },
  { blockType: 'related-services' },
  { blockType: 'lead-form' },
]

/**
 * T4_SD полный required + optional. Difference vs T2: services-grid hidden,
 * neighbor-districts required, related-services optional.
 */
const T4_FULL: DocumentBlock[] = [
  { blockType: 'hero' },
  { blockType: 'breadcrumbs' },
  { blockType: 'tldr' },
  { blockType: 'pricing-block' },
  { blockType: 'calculator-placeholder' },
  { blockType: 'process' },
  { blockType: 'mini-case' },
  { blockType: 'faq' },
  { blockType: 'cta-banner' },
  { blockType: 'neighbor-districts' },
  { blockType: 'lead-form' },
]

// ────────────────────────────────────────────────────────────────────────────
// selfValidate
// ────────────────────────────────────────────────────────────────────────────

describe('master-template self-validation', () => {
  it('returns valid=true для sustained masterTemplate', () => {
    const result = selfValidate()
    assert.equal(
      result.valid,
      true,
      `Expected valid=true, got errors: ${result.errors.map((e) => e.message).join('; ')}`,
    )
    assert.equal(result.errors.length, 0)
    assert.equal(result.found_sections.length, 13)
  })

  it('master-template содержит ровно 13 секций', () => {
    assert.equal(masterTemplate.length, 13)
  })

  it('order monotonic 1..13 без дыр', () => {
    const orders = masterTemplate.map((s) => s.order).sort((a, b) => a - b)
    for (let i = 0; i < orders.length; i++) {
      assert.equal(orders[i], i + 1, `Order at index ${i} expected ${i + 1}, got ${orders[i]}`)
    }
  })
})

// ────────────────────────────────────────────────────────────────────────────
// T2_PILLAR validator
// ────────────────────────────────────────────────────────────────────────────

describe('createMasterTemplateValidator(T2_PILLAR)', () => {
  const validate = createMasterTemplateValidator('T2_PILLAR')

  it('full required+optional set → valid=true', () => {
    const result = validate(T2_FULL)
    assert.equal(
      result.valid,
      true,
      `Expected valid, got errors: ${result.errors.map((e) => e.message).join(' | ')}`,
    )
  })

  it('missing hero → valid=false с MISSING_REQUIRED для hero', () => {
    const blocks = T2_FULL.filter((b) => b.blockType !== 'hero')
    const result = validate(blocks)
    assert.equal(result.valid, false)
    const heroErr = result.errors.find((e) => e.code === 'MISSING_REQUIRED' && e.section === 'hero')
    assert.ok(heroErr, 'Expected MISSING_REQUIRED для hero')
  })

  it('hidden section (neighbor-districts) → valid=false с PRESENT_HIDDEN', () => {
    const blocks: DocumentBlock[] = [...T2_FULL, { blockType: 'neighbor-districts' }]
    const result = validate(blocks)
    assert.equal(result.valid, false)
    const hiddenErr = result.errors.find(
      (e) => e.code === 'PRESENT_HIDDEN' && e.section === 'neighbor-districts',
    )
    assert.ok(hiddenErr, 'Expected PRESENT_HIDDEN для neighbor-districts на T2')
  })

  it('duplicate section → valid=false с DUPLICATE_SECTION', () => {
    const blocks: DocumentBlock[] = [...T2_FULL, { blockType: 'hero' }]
    const result = validate(blocks)
    assert.equal(result.valid, false)
    const dupErr = result.errors.find((e) => e.code === 'DUPLICATE_SECTION' && e.section === 'hero')
    assert.ok(dupErr, 'Expected DUPLICATE_SECTION для hero')
  })

  it('unknown block (text-content legacy) → UNKNOWN_BLOCK report но не fail-only', () => {
    const blocks: DocumentBlock[] = [...T2_FULL, { blockType: 'text-content' }]
    const result = validate(blocks)
    // text-content — legacy блок, не в master-template. Validator репортит для qa,
    // но не считает его missing required. Все required присутствуют, поэтому
    // основная проверка — что UNKNOWN_BLOCK error появляется.
    const unknownErr = result.errors.find(
      (e) => e.code === 'UNKNOWN_BLOCK' && e.blockType === 'text-content',
    )
    assert.ok(unknownErr, 'Expected UNKNOWN_BLOCK для text-content')
  })

  it('empty blocks[] → valid=false с MISSING_REQUIRED для каждой required секции T2', () => {
    const result = validate([])
    assert.equal(result.valid, false)
    const required = getRequiredSectionsForLayer('T2_PILLAR')
    for (const spec of required) {
      const err = result.errors.find(
        (e) => e.code === 'MISSING_REQUIRED' && e.section === spec.section,
      )
      assert.ok(err, `Expected MISSING_REQUIRED для ${spec.section} (T2 required)`)
    }
  })
})

// ────────────────────────────────────────────────────────────────────────────
// T4_SD validator
// ────────────────────────────────────────────────────────────────────────────

describe('createMasterTemplateValidator(T4_SD)', () => {
  const validate = createMasterTemplateValidator('T4_SD')

  it('full required+optional set → valid=true', () => {
    const result = validate(T4_FULL)
    assert.equal(
      result.valid,
      true,
      `Expected valid, got errors: ${result.errors.map((e) => e.message).join(' | ')}`,
    )
  })

  it('services-grid (hidden для T4) → valid=false с PRESENT_HIDDEN', () => {
    const blocks: DocumentBlock[] = [...T4_FULL, { blockType: 'services-grid' }]
    const result = validate(blocks)
    assert.equal(result.valid, false)
    const hiddenErr = result.errors.find(
      (e) => e.code === 'PRESENT_HIDDEN' && e.section === 'services-grid',
    )
    assert.ok(hiddenErr, 'Expected PRESENT_HIDDEN для services-grid на T4')
  })

  it('missing neighbor-districts (required для T4) → MISSING_REQUIRED', () => {
    const blocks = T4_FULL.filter((b) => b.blockType !== 'neighbor-districts')
    const result = validate(blocks)
    assert.equal(result.valid, false)
    const err = result.errors.find(
      (e) => e.code === 'MISSING_REQUIRED' && e.section === 'neighbor-districts',
    )
    assert.ok(err, 'Expected MISSING_REQUIRED для neighbor-districts на T4')
  })
})

// ────────────────────────────────────────────────────────────────────────────
// T3_SUB validator (smoke — services-grid hidden, остальное близко к T2)
// ────────────────────────────────────────────────────────────────────────────

describe('createMasterTemplateValidator(T3_SUB)', () => {
  const validate = createMasterTemplateValidator('T3_SUB')

  it('services-grid (hidden для T3) → valid=false', () => {
    const blocks: DocumentBlock[] = [...T2_FULL, { blockType: 'services-grid' }]
    // T2_FULL содержит services-grid, но для T3 он hidden + neighbor-districts
    // required отсутствует → expect failure.
    const result = validate(blocks)
    assert.equal(result.valid, false)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// validateBlocksAgainstTemplate (convenience обёртка для intake §1)
// ────────────────────────────────────────────────────────────────────────────

describe('validateBlocksAgainstTemplate', () => {
  it('возвращает { valid, errors: string[] }', () => {
    const result = validateBlocksAgainstTemplate('T2_PILLAR', T2_FULL)
    assert.equal(result.valid, true)
    assert.deepEqual(result.errors, [])
  })

  it('errors — массив строк (не ValidationError objects)', () => {
    const result = validateBlocksAgainstTemplate('T2_PILLAR', [])
    assert.equal(result.valid, false)
    assert.ok(result.errors.length > 0)
    for (const e of result.errors) {
      assert.equal(typeof e, 'string', 'Expected string error, got ' + typeof e)
    }
  })

  it('error message содержит RU-текст и ADR-ссылку', () => {
    const result = validateBlocksAgainstTemplate('T2_PILLAR', [])
    assert.ok(result.errors.length > 0)
    const firstErr = result.errors[0]
    assert.match(firstErr, /обязательна|ADR-0021/i)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

describe('getSectionsForLayer / getRequiredSectionsForLayer / getOrderIndex', () => {
  it('getSectionsForLayer(T2_PILLAR) исключает neighbor-districts (hidden)', () => {
    const sections = getSectionsForLayer('T2_PILLAR')
    const has = sections.some((s) => s.section === 'neighbor-districts')
    assert.equal(has, false)
  })

  it('getSectionsForLayer(T4_SD) исключает services-grid (hidden)', () => {
    const sections = getSectionsForLayer('T4_SD')
    const has = sections.some((s) => s.section === 'services-grid')
    assert.equal(has, false)
  })

  it('getRequiredSectionsForLayer(T2_PILLAR) включает hero/breadcrumbs/tldr/etc', () => {
    const required = getRequiredSectionsForLayer('T2_PILLAR')
    const slugs = required.map((s) => s.section)
    for (const must of ['hero', 'breadcrumbs', 'tldr', 'lead-form']) {
      assert.ok(slugs.includes(must as never), `Expected ${must} в required для T2`)
    }
  })

  it('getOrderIndex возвращает order для visible section, null для hidden', () => {
    assert.equal(getOrderIndex('hero', 'T2_PILLAR'), 1)
    assert.equal(getOrderIndex('lead-form', 'T2_PILLAR'), 13)
    assert.equal(getOrderIndex('neighbor-districts', 'T2_PILLAR'), null)
    assert.equal(getOrderIndex('services-grid', 'T4_SD'), null)
  })
})
