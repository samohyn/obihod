import assert from 'node:assert/strict'
import { test } from 'node:test'

import type { PageData } from '../../pages'
import { priceFromBadge } from '../price'

const hero = (badge: Record<string, string | undefined>) =>
  [{ blockType: 'hero-slider', badge }] as unknown as PageData['blocks']

test('цена «от» — только рядом со знаком ₽', () => {
  assert.equal(priceFromBadge(hero({ value: 'от 700 ₽', text: 'за дерево' })), 700)
  assert.equal(priceFromBadge(hero({ value: 'от 12 800 ₽' })), 12800)
  assert.equal(
    priceFromBadge(
      hero({ value: 'за 2 часа', text: 'бригада на месте', note: 'Цена — от 12 400 ₽ за ствол' }),
    ),
    12400,
  )
  assert.equal(priceFromBadge(hero({ value: 'за 2 часа', text: '24/7' })), null)
  assert.equal(priceFromBadge([] as unknown as PageData['blocks']), null)
})
