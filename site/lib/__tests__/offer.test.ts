import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  DEFAULT_COMPANY,
  fillOffer,
  fillOfferDeep,
  hours,
  minutes,
  unknownOfferTokens,
} from '../offer'

const NB = ' '

test('метки → значения из «Компания и контакты», число и единица — неразрывным пробелом', () => {
  assert.equal(fillOffer('перезвоним за {перезвон}', DEFAULT_COMPANY), `перезвоним за 10${NB}минут`)
  assert.equal(fillOffer('{смета по фото, мин}', DEFAULT_COMPANY), `30${NB}мин`)
  assert.equal(fillOffer('Ежедневно {часы работы}', DEFAULT_COMPANY), 'Ежедневно 8:00–22:00')
  assert.equal(fillOffer('скидка {скидка за опоздание}', DEFAULT_COMPANY), 'скидка 10%')
})

test('значения меняются вместе с «Компанией»', () => {
  const c = { ...DEFAULT_COMPANY, callbackMinutes: 1, emergencyHours: 5 }
  assert.equal(fillOffer('за {перезвон}', c), `за 1${NB}минуту`)
  assert.equal(fillOffer('за {аварийный выезд}', c), `за 5${NB}часов`)
})

test('склонения', () => {
  assert.deepEqual([1, 2, 5, 11, 21, 22, 25].map(minutes), [
    '1 минуту',
    '2 минуты',
    '5 минут',
    '11 минут',
    '21 минуту',
    '22 минуты',
    '25 минут',
  ])
  assert.deepEqual([1, 2, 5, 12].map(hours), ['1 час', '2 часа', '5 часов', '12 часов'])
})

test('неизвестная метка остаётся как есть и находится проверкой', () => {
  assert.equal(fillOffer('за {перезвонн}', DEFAULT_COMPANY), 'за {перезвонн}')
  assert.deepEqual(unknownOfferTokens({ a: ['{перезвон}', 'текст {перезвонн}'] }), ['{перезвонн}'])
})

test('по всему документу, включая форматированный текст', () => {
  const doc = {
    title: 'А {перезвон}',
    body: { root: { children: [{ text: '{смета по фото}' }] } },
    n: 5,
  }
  const out = fillOfferDeep(doc, DEFAULT_COMPANY)
  assert.equal(out.title, `А 10${NB}минут`)
  assert.equal(out.body.root.children[0].text, `30${NB}минут`)
  assert.equal(out.n, 5)
  assert.equal(doc.title, 'А {перезвон}', 'исходный документ не меняется')
})

test('реквизиты в документах ПДн: заглушки из единиц не выводятся, ссылки собираются из меток', () => {
  const c = { ...DEFAULT_COMPANY, legalName: '', taxId: '1111111111', ogrn: null }
  assert.equal(fillOffer('оператор — {оператор}.', c), 'оператор — Обиход.')
  const filled = { ...c, legalName: 'ООО «Обиход»', taxId: '5040123456', ogrn: '1225000000000' }
  assert.equal(fillOffer('{оператор}', filled), 'ООО «Обиход», ИНН 5040123456, ОГРН 1225000000000')
  assert.equal(
    fillOffer('{адрес}', c),
    'ул. Амет-хан Султана, 15, к1, Жуковский, Московская область, 140185',
  )
  assert.equal(fillOffer('mailto:{почта}', c), 'mailto:partner@obikhod.ru')
  assert.equal(fillOffer('tel:{телефон-ссылка}', c), 'tel:+79851705111')
})
