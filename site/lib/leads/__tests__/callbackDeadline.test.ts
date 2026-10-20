import assert from 'node:assert/strict'
import { test } from 'node:test'

import { callbackDeadline } from '../callbackDeadline'

// Москва — UTC+3 круглый год.
const msk = (hh: number, mm: number) => new Date(Date.UTC(2026, 9, 20, hh - 3, mm))

test('днём — плюс 10 минут по Москве', () => {
  assert.equal(callbackDeadline(msk(14, 22)), '14:32')
  assert.equal(callbackDeadline(msk(8, 0)), '08:10')
  assert.equal(callbackDeadline(msk(12, 55)), '13:05')
})

test('ночью и после 21:50 — 8:15 утра', () => {
  assert.equal(callbackDeadline(msk(21, 50)), '8:15')
  assert.equal(callbackDeadline(msk(23, 30)), '8:15')
  assert.equal(callbackDeadline(msk(7, 59)), '8:15')
})
