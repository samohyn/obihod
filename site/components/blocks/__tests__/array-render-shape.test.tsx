/**
 * Regression tests для EPIC-SERVICE-PAGES-REDESIGN D3-fix (2026-05-11).
 *
 * Баг: Payload `array`-поля с единственным sub-полем (`{ name: 'value', ... }`)
 * после `afterRead` приходят как `[{ id, value }]`, а не `string[]`. Рендереры
 * D3 wave A блоков (PricingTable, TldrV2, MiniCaseV2, ServiceHero) делали
 * `<li>{item}</li>` напрямую → React 500: «Objects are not valid as a React
 * child (found: object with keys {id, value})». На проде это уронило
 * /vyvoz-musora/ после enable use_template_v2=true.
 *
 * Fix: `toStringList()` в types.ts нормализует оба shape; рендереры зовут её.
 *
 * Runner: `node:test` через `tsx --test` — vitest/jest НЕ установлены в site/
 * (sustained constraint, см. blocks/__tests__/master-template.test.ts).
 * Рендер — `react-dom/server.renderToStaticMarkup` (без DOM).
 *
 * Запуск:
 *   pnpm --filter site exec tsx --test components/blocks/__tests__/array-render-shape.test.tsx
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { renderToStaticMarkup } from 'react-dom/server'

import { toStringList } from '../types'
import { PricingTable } from '../PricingTable'
import { TldrV2 } from '../TldrV2'
import { MiniCaseV2 } from '../MiniCaseV2'
import { ServiceHero } from '../ServiceHero'
import type { PricingTableBlock, TldrV2Block, MiniCaseV2Block, ServiceHeroBlock } from '../types'

// ────────────────────────────────────────────────────────────────────────────
// toStringList unit
// ────────────────────────────────────────────────────────────────────────────

describe('toStringList', () => {
  it('passes through plain string[] (legacy fixtures)', () => {
    assert.deepEqual(toStringList(['a', 'b', 'c']), ['a', 'b', 'c'])
  })

  it('unwraps Payload {id, value}[] array-field shape', () => {
    assert.deepEqual(
      toStringList([
        { id: '1', value: 'first' },
        { id: '2', value: 'second' },
      ]),
      ['first', 'second'],
    )
  })

  it('unwraps Payload {id, url}[] array-field shape', () => {
    assert.deepEqual(
      toStringList([
        { id: '1', url: 'https://a' },
        { id: '2', url: 'https://b' },
      ]),
      ['https://a', 'https://b'],
    )
  })

  it('handles mixed / empty / null safely', () => {
    assert.deepEqual(toStringList(null), [])
    assert.deepEqual(toStringList(undefined), [])
    assert.deepEqual(toStringList([]), [])
    assert.deepEqual(
      toStringList(['x', { id: '1', value: 'y' }, null, '', { id: '2', value: '' }]),
      ['x', 'y'],
    )
    assert.deepEqual(toStringList([{ id: '1', value: 42 }]), ['42'])
  })
})

// ────────────────────────────────────────────────────────────────────────────
// Component render — Payload {id, value}[] shape must NOT crash
// ────────────────────────────────────────────────────────────────────────────

describe('D3 wave A blocks — Payload array-field shape render', () => {
  it('PricingTable: tier.features as [{id, value}] renders, no crash', () => {
    const block = {
      blockType: 'pricing-table',
      h2: 'Тарифы',
      tiers: [
        {
          name: 'Эконом',
          price: '12 800',
          unit: 'выезд',
          features: [
            { id: '1', value: 'Подача контейнера 8 м³' },
            { id: '2', value: 'Вывоз и утилизация' },
          ],
        },
      ],
    } as unknown as PricingTableBlock
    const html = renderToStaticMarkup(<PricingTable {...block} />)
    assert.ok(html.includes('Эконом'))
    assert.ok(html.includes('Подача контейнера 8 м³'))
    assert.ok(html.includes('Вывоз и утилизация'))
    assert.ok(!html.includes('[object Object]'))
  })

  it('PricingTable: legacy string[] features still renders', () => {
    const block = {
      blockType: 'pricing-table',
      tiers: [{ name: 'Стандарт', price: '14 200', features: ['Фича A', 'Фича B'] }],
    } as unknown as PricingTableBlock
    const html = renderToStaticMarkup(<PricingTable {...block} />)
    assert.ok(html.includes('Фича A'))
    assert.ok(html.includes('Фича B'))
  })

  it('TldrV2: bullets as [{id, value}] renders, no crash', () => {
    const block = {
      blockType: 'tldr-v2',
      badge: 'Кратко',
      bullets: [
        { id: '1', value: 'Пункт раз' },
        { id: '2', value: 'Пункт два' },
        { id: '3', value: 'Пункт три' },
      ],
    } as unknown as TldrV2Block
    const html = renderToStaticMarkup(<TldrV2 {...block} />)
    assert.ok(html.includes('Пункт раз'))
    assert.ok(html.includes('Пункт три'))
    assert.ok(!html.includes('[object Object]'))
  })

  it('MiniCaseV2: meta as [{id, value}] renders, no crash', () => {
    const block = {
      blockType: 'mini-case-v2',
      title: 'Вывоз мусора, Одинцово',
      meta: [
        { id: '1', value: 'Одинцово' },
        { id: '2', value: '12 м³' },
      ],
    } as unknown as MiniCaseV2Block
    const html = renderToStaticMarkup(<MiniCaseV2 {...block} />)
    assert.ok(html.includes('Одинцово'))
    assert.ok(html.includes('12 м³'))
    assert.ok(!html.includes('[object Object]'))
  })

  it('ServiceHero: trust as [{id, value}] renders, no crash', () => {
    const block = {
      blockType: 'service-hero',
      h1: 'Вывоз мусора в Москве и МО',
      trust: [
        { id: '1', value: 'Лицензия 50 МО' },
        { id: '2', value: 'Договор и закрывающие' },
      ],
    } as unknown as ServiceHeroBlock
    const html = renderToStaticMarkup(<ServiceHero {...block} />)
    assert.ok(html.includes('Вывоз мусора в Москве и МО'))
    assert.ok(html.includes('Лицензия 50 МО'))
    assert.ok(html.includes('Договор и закрывающие'))
    assert.ok(!html.includes('[object Object]'))
  })
})
