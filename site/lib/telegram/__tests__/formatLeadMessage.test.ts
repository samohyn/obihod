import assert from 'node:assert/strict'
import { test } from 'node:test'

import { formatLeadMessage } from '../sendMessage'

// Заявка со всеми личными полями. В Telegram уходят только имя и телефон (решение владельца 28.10,
// согласие на передачу за рубеж — только на них); почта, адрес и описание задачи — нет.
const lead = {
  id: 321,
  phone: '+7 985 170-51-11',
  name: 'Иван Петров',
  email: 'ivan@example.ru',
  message: 'Спилить берёзу у дома, ул. Ленина, 5',
  address: 'Жуковский, ул. Ленина, 5',
  sourcePage: '/arboristika/spil-derevev/',
  replyDueAt: '2026-10-28T11:32:00.000Z',
  photoFiles: [1, 2],
  service: 3,
  district: 7,
}

test('имя и телефон есть; почты, адреса и текста задачи нет', () => {
  const text = formatLeadMessage(lead, { service: 'Спил деревьев', district: 'Жуковский' })
  assert.match(text, /^Имя: Иван Петров$/m)
  assert.match(text, /^Телефон: \+7 985 170-51-11$/m)
  for (const pd of ['ivan@', 'Ленина', 'берёзу']) {
    assert.ok(!text.includes(pd), `в тексте не должно быть «${pd}»`)
  }
})

test('номер, срок ответа, услуга и район словами, фото, страница, ссылка на карточку', () => {
  const text = formatLeadMessage(lead, { service: 'Спил деревьев', district: 'Жуковский' })
  assert.match(text, /^Новая заявка № 321$/m)
  assert.match(text, /^Ответить до 14:32 \(МСК\)$/m)
  assert.match(text, /^Услуга: Спил деревьев$/m)
  assert.match(text, /^Район: Жуковский$/m)
  assert.match(text, /^Фото: 2$/m)
  assert.match(text, /^Страница: \/arboristika\/spil-derevev\/$/m)
  assert.match(text, /^Открыть: https?:\/\/[^\s]+\/admin\/collections\/leads\?tab=all&lead=321$/m)
})

test('без названий из базы — номера связей не показываем', () => {
  const text = formatLeadMessage(lead)
  assert.ok(!/Услуга|Район/.test(text))
})
