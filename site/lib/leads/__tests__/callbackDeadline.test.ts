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

test('часы и срок — из «Компания и контакты»', () => {
  const rule = { opens: '09:00', closes: '20:00', callbackMinutes: 15, nightCallbackTime: '09:30' }
  assert.equal(callbackDeadline(msk(14, 22), rule), '14:37')
  assert.equal(callbackDeadline(msk(8, 30), rule), '9:30')
  assert.equal(callbackDeadline(msk(19, 45), rule), '9:30')
  assert.equal(callbackDeadline(msk(19, 44), rule), '19:59')
})
