import assert from 'node:assert/strict'
import { test } from 'node:test'

import { DEFAULT_COMPANY } from '../../offer'
import { callbackDeadline } from '../callbackDeadline'
import {
  compareQueue,
  formatClockMsk,
  formatDuration,
  replyDueAt,
  replyStats,
  slaLabel,
  slaRuleFrom,
  slaState,
} from '../sla'

// Москва — UTC+3 круглый год.
const msk = (hh: number, mm: number, day = 20) => new Date(Date.UTC(2026, 9, day, hh - 3, mm))
const rule = slaRuleFrom(DEFAULT_COMPANY)

test('днём — плюс 10 минут', () => {
  assert.equal(replyDueAt(msk(14, 22), rule).toISOString(), msk(14, 32).toISOString())
  assert.equal(replyDueAt(msk(8, 0), rule).toISOString(), msk(8, 10).toISOString())
})

test('ночью и в последние минуты — к 8:15 утра', () => {
  assert.equal(replyDueAt(msk(21, 50), rule).toISOString(), msk(8, 15, 21).toISOString())
  assert.equal(replyDueAt(msk(23, 30), rule).toISOString(), msk(8, 15, 21).toISOString())
  assert.equal(replyDueAt(msk(1, 0), rule).toISOString(), msk(8, 15).toISOString())
  assert.equal(replyDueAt(msk(7, 59), rule).toISOString(), msk(8, 15).toISOString())
})

test('переключатель выключен — срок круглосуточно', () => {
  const allDay = { ...rule, replyByWorkingHours: false }
  assert.equal(replyDueAt(msk(23, 30), allDay).toISOString(), msk(23, 40).toISOString())
})

test('срок в панели совпадает с обещанием в форме', () => {
  for (let m = 0; m < 24 * 60; m += 7) {
    const at = msk(Math.floor(m / 60), m % 60)
    const promised = callbackDeadline(at).replace(/^(\d):/, '0$1:')
    assert.equal(formatClockMsk(replyDueAt(at, rule)), promised, `заявка в ${formatClockMsk(at)}`)
  }
})

test('пустые поля «Компания и контакты» — значения по умолчанию', () => {
  const r = slaRuleFrom({ opens: '', callbackMinutes: null, replyByWorkingHours: false })
  assert.equal(r.opens, '08:00')
  assert.equal(r.callbackMinutes, 10)
  assert.equal(r.replyByWorkingHours, false)
})

test('три состояния таймера и подписи', () => {
  const lead = { status: 'new', replyDueAt: msk(14, 32).toISOString() }
  assert.equal(slaState(lead, msk(14, 20)).kind, 'ok')
  assert.equal(slaLabel(slaState(lead, msk(14, 20))), 'Ответить до 14:32')
  assert.equal(slaState(lead, msk(14, 30)).kind, 'soon')
  assert.equal(slaLabel(slaState(lead, msk(14, 30))), 'Скоро: осталось 2:00')
  const late = new Date(msk(14, 34).getTime() + 10_000)
  assert.equal(slaState(lead, late).kind, 'overdue')
  assert.equal(slaLabel(slaState(lead, late)), 'Просрочено на 2:10')
})

test('таймер останавливают итог звонка и закрытие, а не статус «В работе»', () => {
  const due = msk(14, 32).toISOString()
  const now = msk(15, 0)
  assert.equal(slaState({ status: 'contacted', replyDueAt: due }, now).kind, 'overdue')
  assert.equal(slaState({ status: 'new', replyDueAt: due, firstContactAt: due }, now).kind, 'none')
  assert.equal(slaState({ status: 'done', replyDueAt: due }, now).kind, 'none')
  assert.equal(slaState({ status: 'new', replyDueAt: null }, now).kind, 'none')
})

test('длительности', () => {
  assert.equal(formatDuration(-130_000), '2:10')
  assert.equal(formatDuration(65 * 60_000), '1 ч 05 мин')
  assert.equal(formatDuration(51 * 3_600_000), '2 дн 3 ч')
})

test('очередь: просроченные выше, затем ближайший срок, затем остальные — новые сверху', () => {
  const now = msk(15, 0)
  const leads = [
    { id: 'closed-old', status: 'done', createdAt: msk(9, 0).toISOString() },
    { id: 'later', status: 'new', replyDueAt: msk(15, 8).toISOString() },
    { id: 'overdue', status: 'new', replyDueAt: msk(14, 40).toISOString() },
    { id: 'closed-new', status: 'done', createdAt: msk(12, 0).toISOString() },
    { id: 'soon', status: 'new', replyDueAt: msk(15, 2).toISOString() },
  ]
  assert.deepEqual(
    leads.sort(compareQueue(now)).map((l) => l.id),
    ['overdue', 'soon', 'later', 'closed-new', 'closed-old'],
  )
})

test('доля ответов в срок: итог звонка или закрытие до срока, идущий срок и спам не считаются', () => {
  const now = msk(15, 0)
  const from = msk(0, 0)
  const due = msk(12, 10).toISOString()
  const created = msk(12, 0).toISOString()
  const stats = replyStats(
    [
      { createdAt: created, replyDueAt: due, firstContactAt: msk(12, 5).toISOString() },
      { createdAt: created, replyDueAt: due, firstContactAt: msk(12, 30).toISOString() },
      { createdAt: created, replyDueAt: due, status: 'new' },
      {
        createdAt: created,
        replyDueAt: due,
        status: 'cancelled',
        closedAt: msk(12, 8).toISOString(),
      },
      { createdAt: created, replyDueAt: msk(15, 5).toISOString(), status: 'new' },
      { createdAt: created, replyDueAt: due, status: 'spam' },
      { createdAt: msk(9, 0, 19).toISOString(), replyDueAt: due, firstContactAt: due },
    ],
    from,
    now,
  )
  assert.deepEqual(stats, { total: 4, inTime: 2, late: 2 })
})
