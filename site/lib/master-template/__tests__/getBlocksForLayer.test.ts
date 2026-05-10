/**
 * Tests для resolver `getBlocksForLayer` (EPIC-SERVICE-PAGES-UX C4).
 *
 * Runner: `node:test` через `tsx --test` — sustained constraint, vitest/jest
 * не установлены в site/ (см. master-template.test.ts комментарий).
 *
 * Запуск:
 *   pnpm --filter site exec tsx --test lib/master-template/__tests__/getBlocksForLayer.test.ts
 *
 * Покрывает:
 *   - templateV2=false → identity (legacy mode)
 *   - templateV2=true:
 *     - T2 with all sections present → unchanged order
 *     - T2 with reordered blocks → reorder to template order
 *     - T2 with missing required → placeholder inserted
 *     - T2 with hidden section (neighbor-districts) → filtered out
 *     - T4 SD with optional section (related-services) → kept
 *     - T4 SD with services-grid (hidden для T4) → filtered out
 *     - Empty blocks → all placeholders
 *     - Unknown blockType → dropped
 *     - Duplicate sections → keep first
 *     - onMissingRequired='throw' + fillMissing=false → throws
 *     - onMissingRequired='silent' + fillMissing=false → drops
 *   - feature flag template-v2:
 *     - isTemplateV2Enabled honors env override
 *     - isTemplateV2Enabled honors doc-level field
 *   - getMissingRequiredSections debug helper
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import {
  getBlocksForLayer,
  getMissingRequiredSections,
  type ResolvedBlock,
} from '../getBlocksForLayer'
import { isTemplateV2Enabled, buildResolverOptions } from '@/lib/feature-flags/template-v2'
import type { DocumentBlock } from '@/blocks/master-template'

// ────────────────────────────────────────────────────────────────────────────
// Fixtures
// ────────────────────────────────────────────────────────────────────────────

/** T2_PILLAR полный required + optional набор в master-template order. */
const T2_FULL_ORDERED: DocumentBlock[] = [
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

/** T4_SD набор. services-grid hidden, neighbor-districts required. */
const T4_FULL_ORDERED: DocumentBlock[] = [
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

/**
 * T3_SUB набор (required + optional, без hidden services-grid).
 *
 * T3_SUB presence matrix (см. master-template.ts):
 *   - required: hero, breadcrumbs, tldr, pricing-block, calculator, process,
 *     faq, related-services, neighbor-districts, lead-form
 *   - optional: mini-case, cta-banner
 *   - hidden:   services-grid
 */
const T3_FULL_ORDERED: DocumentBlock[] = [
  { blockType: 'hero' },
  { blockType: 'breadcrumbs' },
  { blockType: 'tldr' },
  { blockType: 'pricing-block' },
  { blockType: 'calculator-placeholder' },
  { blockType: 'process' },
  { blockType: 'mini-case' }, // optional but kept
  { blockType: 'faq' },
  { blockType: 'cta-banner' }, // optional but kept
  { blockType: 'related-services' },
  { blockType: 'neighbor-districts' },
  { blockType: 'lead-form' },
]

const V2_OPTS = { templateV2: true, fillMissingWithPlaceholder: true } as const
const V2_NO_FILL = { templateV2: true, fillMissingWithPlaceholder: false } as const

// ────────────────────────────────────────────────────────────────────────────
// templateV2 = false (legacy mode)
// ────────────────────────────────────────────────────────────────────────────

describe('getBlocksForLayer · templateV2=false (legacy)', () => {
  it('return blocks as-is для T2', () => {
    const out = getBlocksForLayer('T2_PILLAR', T2_FULL_ORDERED, {
      templateV2: false,
      fillMissingWithPlaceholder: true,
    })
    assert.equal(out.length, T2_FULL_ORDERED.length)
    assert.deepEqual(
      out.map((b) => b.blockType),
      T2_FULL_ORDERED.map((b) => b.blockType),
    )
  })

  it('не trim-ит unknown blockType (legacy = passthrough)', () => {
    const blocks: DocumentBlock[] = [
      { blockType: 'hero' },
      { blockType: 'unknown-legacy-block' },
      { blockType: 'lead-form' },
    ]
    const out = getBlocksForLayer('T2_PILLAR', blocks, {
      templateV2: false,
      fillMissingWithPlaceholder: true,
    })
    assert.equal(out.length, 3)
    assert.equal(out[1].blockType, 'unknown-legacy-block')
  })

  it('пустой input → пустой output', () => {
    const out = getBlocksForLayer('T2_PILLAR', [], {
      templateV2: false,
      fillMissingWithPlaceholder: true,
    })
    assert.equal(out.length, 0)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// templateV2 = true: T2_PILLAR
// ────────────────────────────────────────────────────────────────────────────

describe('getBlocksForLayer · templateV2=true · T2_PILLAR', () => {
  it('all sections present и в order → output идентичен по order', () => {
    const out = getBlocksForLayer('T2_PILLAR', T2_FULL_ORDERED, V2_OPTS)
    const expected = T2_FULL_ORDERED.map((b) => b.blockType)
    const actual = out.map((b) => b.blockType)
    assert.deepEqual(actual, expected)
    // Sustained блоки не помечены _placeholder.
    for (const block of out) {
      assert.equal((block as ResolvedBlock)._placeholder ?? false, false)
    }
  })

  it('reordered blocks → reorder под template order', () => {
    // Намеренно перемешан: lead-form в начале, hero в конце.
    const reordered: DocumentBlock[] = [
      { blockType: 'lead-form' },
      { blockType: 'faq' },
      { blockType: 'cta-banner' },
      { blockType: 'pricing-block' },
      { blockType: 'mini-case' },
      { blockType: 'related-services' },
      { blockType: 'tldr' },
      { blockType: 'breadcrumbs' },
      { blockType: 'process' },
      { blockType: 'calculator-placeholder' },
      { blockType: 'services-grid' },
      { blockType: 'hero' },
    ]
    const out = getBlocksForLayer('T2_PILLAR', reordered, V2_OPTS)
    const actual = out.map((b) => b.blockType)
    const expected = T2_FULL_ORDERED.map((b) => b.blockType)
    assert.deepEqual(actual, expected)
  })

  it('missing required (lead-form) + fill=true → placeholder inserted', () => {
    const partial = T2_FULL_ORDERED.filter((b) => b.blockType !== 'lead-form')
    const out = getBlocksForLayer('T2_PILLAR', partial, V2_OPTS)
    const leadForm = out.find((b) => b.blockType === 'lead-form')
    assert.ok(leadForm, 'lead-form должен быть filled placeholder')
    assert.equal((leadForm as ResolvedBlock)._placeholder, true)
    // Order: lead-form в конце (order=13).
    assert.equal(out[out.length - 1].blockType, 'lead-form')
  })

  it('hidden section (neighbor-districts) в input → filtered out на T2', () => {
    const withHidden: DocumentBlock[] = [
      ...T2_FULL_ORDERED,
      { blockType: 'neighbor-districts' }, // hidden для T2_PILLAR
    ]
    const out = getBlocksForLayer('T2_PILLAR', withHidden, V2_OPTS)
    const found = out.find((b) => b.blockType === 'neighbor-districts')
    assert.equal(found, undefined, 'neighbor-districts должен быть отфильтрован для T2')
  })

  it('empty blocks + fill=true → все required-sections становятся placeholders', () => {
    const out = getBlocksForLayer('T2_PILLAR', [], V2_OPTS)
    // Required для T2 (включает все 12 не-hidden, но related-services optional).
    // Optional sections не filled placeholder'ом — только required.
    const allPlaceholders = out.every((b) => (b as ResolvedBlock)._placeholder === true)
    assert.equal(allPlaceholders, true)
    // Order стартует с hero.
    assert.equal(out[0].blockType, 'hero')
    // Order завершается lead-form.
    assert.equal(out[out.length - 1].blockType, 'lead-form')
  })

  it('unknown blockType → drop', () => {
    const blocks: DocumentBlock[] = [
      { blockType: 'hero' },
      { blockType: 'mystery-block' },
      { blockType: 'lead-form' },
    ]
    const out = getBlocksForLayer('T2_PILLAR', blocks, V2_OPTS)
    const found = out.find((b) => b.blockType === 'mystery-block')
    assert.equal(found, undefined)
  })

  it('duplicate sections → keep first, drop rest', () => {
    const dupBlock1 = { blockType: 'hero', _marker: 'first' } as DocumentBlock
    const dupBlock2 = { blockType: 'hero', _marker: 'second' } as DocumentBlock
    const blocks: DocumentBlock[] = [dupBlock1, dupBlock2, { blockType: 'lead-form' }]
    const out = getBlocksForLayer('T2_PILLAR', blocks, V2_OPTS)
    const heroes = out.filter((b) => b.blockType === 'hero')
    assert.equal(heroes.length, 1, 'duplicate hero должен быть deduplicated')
    assert.equal((heroes[0] as DocumentBlock)._marker, 'first', 'keep first dedup')
  })
})

// ────────────────────────────────────────────────────────────────────────────
// templateV2 = true: T4_SD
// ────────────────────────────────────────────────────────────────────────────

describe('getBlocksForLayer · templateV2=true · T4_SD', () => {
  it('full T4 set → output identical по order', () => {
    const out = getBlocksForLayer('T4_SD', T4_FULL_ORDERED, V2_OPTS)
    const actual = out.map((b) => b.blockType)
    const expected = T4_FULL_ORDERED.map((b) => b.blockType)
    assert.deepEqual(actual, expected)
  })

  it('services-grid в T4 input → filtered out (hidden для T4_SD)', () => {
    const withHidden: DocumentBlock[] = [
      { blockType: 'hero' },
      { blockType: 'breadcrumbs' },
      { blockType: 'tldr' },
      { blockType: 'services-grid' }, // hidden для T4
      { blockType: 'pricing-block' },
      { blockType: 'calculator-placeholder' },
      { blockType: 'process' },
      { blockType: 'mini-case' },
      { blockType: 'faq' },
      { blockType: 'cta-banner' },
      { blockType: 'neighbor-districts' },
      { blockType: 'lead-form' },
    ]
    const out = getBlocksForLayer('T4_SD', withHidden, V2_OPTS)
    const found = out.find((b) => b.blockType === 'services-grid')
    assert.equal(found, undefined, 'services-grid должен быть hidden на T4')
  })

  it('optional related-services присутствует → kept', () => {
    const withOptional: DocumentBlock[] = [
      ...T4_FULL_ORDERED.filter((b) => b.blockType !== 'lead-form'),
      { blockType: 'related-services' }, // optional для T4
      { blockType: 'lead-form' },
    ]
    const out = getBlocksForLayer('T4_SD', withOptional, V2_OPTS)
    const found = out.find((b) => b.blockType === 'related-services')
    assert.ok(found, 'optional related-services должен быть kept на T4')
    assert.equal((found as ResolvedBlock)._placeholder ?? false, false)
  })

  it('missing required neighbor-districts → placeholder', () => {
    const partial = T4_FULL_ORDERED.filter((b) => b.blockType !== 'neighbor-districts')
    const out = getBlocksForLayer('T4_SD', partial, V2_OPTS)
    const found = out.find((b) => b.blockType === 'neighbor-districts')
    assert.ok(found)
    assert.equal((found as ResolvedBlock)._placeholder, true)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// templateV2 = true: T3_SUB (C4.T3T4 integration smoke)
// ────────────────────────────────────────────────────────────────────────────

describe('getBlocksForLayer · templateV2=true · T3_SUB', () => {
  it('full T3 set → output identical по order', () => {
    const out = getBlocksForLayer('T3_SUB', T3_FULL_ORDERED, V2_OPTS)
    const actual = out.map((b) => b.blockType)
    const expected = T3_FULL_ORDERED.map((b) => b.blockType)
    assert.deepEqual(actual, expected)
    // Sustained блоки не помечены _placeholder.
    for (const block of out) {
      assert.equal((block as ResolvedBlock)._placeholder ?? false, false)
    }
  })

  it('services-grid в T3 input → filtered out (hidden для T3_SUB)', () => {
    const withHidden: DocumentBlock[] = [
      { blockType: 'hero' },
      { blockType: 'breadcrumbs' },
      { blockType: 'tldr' },
      { blockType: 'services-grid' }, // hidden для T3
      { blockType: 'pricing-block' },
      { blockType: 'calculator-placeholder' },
      { blockType: 'process' },
      { blockType: 'faq' },
      { blockType: 'related-services' },
      { blockType: 'neighbor-districts' },
      { blockType: 'lead-form' },
    ]
    const out = getBlocksForLayer('T3_SUB', withHidden, V2_OPTS)
    const found = out.find((b) => b.blockType === 'services-grid')
    assert.equal(found, undefined, 'services-grid должен быть hidden на T3')
  })

  it('empty blocks → all required-sections заполняются placeholders', () => {
    const out = getBlocksForLayer('T3_SUB', [], V2_OPTS)
    // Все required для T3 должны быть заполнены placeholders (mini-case и
    // cta-banner — optional, missing → не filled).
    const requiredForT3: ReadonlyArray<string> = [
      'hero',
      'breadcrumbs',
      'tldr',
      'pricing-block',
      'calculator-placeholder',
      'process',
      'faq',
      'related-services',
      'neighbor-districts',
      'lead-form',
    ]
    for (const blockType of requiredForT3) {
      const found = out.find((b) => b.blockType === blockType)
      assert.ok(found, `required '${blockType}' должен быть filled placeholder для T3`)
      assert.equal((found as ResolvedBlock)._placeholder, true)
    }
    // Optional sections не filled → отсутствуют в output.
    assert.equal(
      out.find((b) => b.blockType === 'mini-case'),
      undefined,
      'optional mini-case не filled placeholder',
    )
    // services-grid hidden → отсутствует.
    assert.equal(
      out.find((b) => b.blockType === 'services-grid'),
      undefined,
      'hidden services-grid не появляется',
    )
    // Order-преserved: hero первый, lead-form последний.
    assert.equal(out[0].blockType, 'hero')
    assert.equal(out[out.length - 1].blockType, 'lead-form')
  })

  it('reordered T3 blocks → reorder под template order', () => {
    // Перемешан: lead-form в начале, hero в конце.
    const reordered: DocumentBlock[] = [
      { blockType: 'lead-form' },
      { blockType: 'neighbor-districts' },
      { blockType: 'related-services' },
      { blockType: 'faq' },
      { blockType: 'process' },
      { blockType: 'calculator-placeholder' },
      { blockType: 'pricing-block' },
      { blockType: 'tldr' },
      { blockType: 'breadcrumbs' },
      { blockType: 'hero' },
    ]
    const out = getBlocksForLayer('T3_SUB', reordered, V2_OPTS)
    const actual = out.map((b) => b.blockType)
    // hero первый, lead-form последний, без duplicate placeholders для
    // присутствующих блоков.
    assert.equal(actual[0], 'hero')
    assert.equal(actual[actual.length - 1], 'lead-form')
    // Все исходные required блоки → present без placeholder.
    for (const block of out) {
      const isOriginal = reordered.some((r) => r.blockType === block.blockType)
      if (isOriginal) {
        assert.equal(
          (block as ResolvedBlock)._placeholder ?? false,
          false,
          `${block.blockType} должен быть исходным, не placeholder`,
        )
      }
    }
  })

  it('missing required (lead-form) + fill=true → placeholder inserted', () => {
    const partial = T3_FULL_ORDERED.filter((b) => b.blockType !== 'lead-form')
    const out = getBlocksForLayer('T3_SUB', partial, V2_OPTS)
    const leadForm = out.find((b) => b.blockType === 'lead-form')
    assert.ok(leadForm, 'lead-form должен быть filled placeholder')
    assert.equal((leadForm as ResolvedBlock)._placeholder, true)
    assert.equal(out[out.length - 1].blockType, 'lead-form')
  })
})

// ────────────────────────────────────────────────────────────────────────────
// onMissingRequired modes (fillMissingWithPlaceholder=false)
// ────────────────────────────────────────────────────────────────────────────

describe('getBlocksForLayer · onMissingRequired modes', () => {
  it("'throw' mode → бросает Error на missing required", () => {
    const partial: DocumentBlock[] = [{ blockType: 'hero' }]
    assert.throws(
      () =>
        getBlocksForLayer('T2_PILLAR', partial, {
          ...V2_NO_FILL,
          onMissingRequired: 'throw',
        }),
      /Required section/,
    )
  })

  it("'silent' mode → drop missing, без error и без placeholder", () => {
    const partial: DocumentBlock[] = [{ blockType: 'hero' }, { blockType: 'lead-form' }]
    const out = getBlocksForLayer('T2_PILLAR', partial, {
      ...V2_NO_FILL,
      onMissingRequired: 'silent',
    })
    // Только 2 блока — missing required не filled.
    assert.equal(out.length, 2)
    assert.deepEqual(
      out.map((b) => b.blockType),
      ['hero', 'lead-form'],
    )
  })
})

// ────────────────────────────────────────────────────────────────────────────
// getMissingRequiredSections helper
// ────────────────────────────────────────────────────────────────────────────

describe('getMissingRequiredSections', () => {
  it('full set → empty array', () => {
    const missing = getMissingRequiredSections('T2_PILLAR', T2_FULL_ORDERED)
    assert.equal(missing.length, 0)
  })

  it('partial → list missing required', () => {
    const partial: DocumentBlock[] = [{ blockType: 'hero' }, { blockType: 'lead-form' }]
    const missing = getMissingRequiredSections('T2_PILLAR', partial)
    // Должен включать как минимум: breadcrumbs, tldr, services-grid, pricing-block,
    // calculator, process, mini-case, faq, cta-banner, related-services.
    assert.ok(missing.includes('breadcrumbs'))
    assert.ok(missing.includes('faq'))
    assert.ok(missing.includes('lead-form') === false, 'lead-form присутствует, не missing')
    assert.ok(missing.includes('hero') === false, 'hero присутствует, не missing')
  })

  it('T4: services-grid не считается missing (hidden для T4)', () => {
    const empty: DocumentBlock[] = []
    const missing = getMissingRequiredSections('T4_SD', empty)
    assert.equal(missing.includes('services-grid'), false)
    // Но neighbor-districts required для T4.
    assert.equal(missing.includes('neighbor-districts'), true)
  })

  it('T3: services-grid не считается missing (hidden для T3); neighbor-districts required', () => {
    const empty: DocumentBlock[] = []
    const missing = getMissingRequiredSections('T3_SUB', empty)
    assert.equal(missing.includes('services-grid'), false)
    assert.equal(missing.includes('neighbor-districts'), true)
    assert.equal(missing.includes('related-services'), true)
    // mini-case и cta-banner — optional для T3, не должны быть в missing.
    assert.equal(missing.includes('mini-case'), false)
    assert.equal(missing.includes('cta-banner'), false)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// Feature flag: isTemplateV2Enabled
// ────────────────────────────────────────────────────────────────────────────

describe('isTemplateV2Enabled · doc-level', () => {
  it('null doc → false', () => {
    assert.equal(isTemplateV2Enabled(null), false)
  })

  it('undefined doc → false', () => {
    assert.equal(isTemplateV2Enabled(undefined), false)
  })

  it('doc.useTemplateV2 = true → true', () => {
    assert.equal(isTemplateV2Enabled({ useTemplateV2: true }), true)
  })

  it('doc.useTemplateV2 = false → false', () => {
    assert.equal(isTemplateV2Enabled({ useTemplateV2: false }), false)
  })

  it('doc без поля → false (default safe)', () => {
    assert.equal(isTemplateV2Enabled({ slug: 'test' }), false)
  })
})

describe('isTemplateV2Enabled · env override', () => {
  it("env='true' override доминирует над doc.useTemplateV2=false", () => {
    const original = process.env.TEMPLATE_V2_GLOBAL_OVERRIDE
    try {
      process.env.TEMPLATE_V2_GLOBAL_OVERRIDE = 'true'
      assert.equal(isTemplateV2Enabled({ useTemplateV2: false }), true)
      assert.equal(isTemplateV2Enabled(null), true)
    } finally {
      if (original === undefined) delete process.env.TEMPLATE_V2_GLOBAL_OVERRIDE
      else process.env.TEMPLATE_V2_GLOBAL_OVERRIDE = original
    }
  })

  it("env='false' override доминирует над doc.useTemplateV2=true", () => {
    const original = process.env.TEMPLATE_V2_GLOBAL_OVERRIDE
    try {
      process.env.TEMPLATE_V2_GLOBAL_OVERRIDE = 'false'
      assert.equal(isTemplateV2Enabled({ useTemplateV2: true }), false)
    } finally {
      if (original === undefined) delete process.env.TEMPLATE_V2_GLOBAL_OVERRIDE
      else process.env.TEMPLATE_V2_GLOBAL_OVERRIDE = original
    }
  })

  it('env с invalid значением → fall through на doc-level', () => {
    const original = process.env.TEMPLATE_V2_GLOBAL_OVERRIDE
    try {
      process.env.TEMPLATE_V2_GLOBAL_OVERRIDE = 'maybe'
      assert.equal(isTemplateV2Enabled({ useTemplateV2: true }), true)
      assert.equal(isTemplateV2Enabled({ useTemplateV2: false }), false)
    } finally {
      if (original === undefined) delete process.env.TEMPLATE_V2_GLOBAL_OVERRIDE
      else process.env.TEMPLATE_V2_GLOBAL_OVERRIDE = original
    }
  })
})

describe('buildResolverOptions', () => {
  it('возвращает {templateV2, fillMissingWithPlaceholder=true}', () => {
    const opts = buildResolverOptions({ useTemplateV2: true })
    assert.equal(opts.templateV2, true)
    assert.equal(opts.fillMissingWithPlaceholder, true)
  })

  it('null doc → templateV2=false, fill=true', () => {
    const opts = buildResolverOptions(null)
    assert.equal(opts.templateV2, false)
    assert.equal(opts.fillMissingWithPlaceholder, true)
  })
})
