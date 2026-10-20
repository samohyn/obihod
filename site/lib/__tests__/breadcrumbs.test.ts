import assert from 'node:assert/strict'
import { test } from 'node:test'

import { shortTitle, trail } from '../breadcrumbs'

const names = (crumbs: { name: string }[]) => crumbs.map((c) => c.name)

test('цепочка идёт по карте 08, а не по адресу: Команда — внутри «О компании»', () => {
  assert.deepEqual(names(trail('komanda')), ['Главная', 'О компании', 'Команда'])
  assert.equal(trail('komanda').at(-1)?.href, '/komanda/')
})

test('страница с листом: раздел + своя крошка', () => {
  const crumbs = trail('uslugi', { name: 'Арбористика', href: '/arboristika/' })
  assert.deepEqual(names(crumbs), ['Главная', 'Услуги', 'Арбористика'])
})

test('страница прямо под главной', () => {
  assert.deepEqual(names(trail(null, { name: 'Смета по фото', href: '/foto-smeta/' })), [
    'Главная',
    'Смета по фото',
  ])
})

test('B2B в крошках — «Для бизнеса»', () => {
  assert.deepEqual(names(trail('b2b')), ['Главная', 'Для бизнеса'])
})

test('короткая подпись из SEO-заголовка', () => {
  assert.equal(
    shortTitle('Кронирование деревьев — 3 800 ₽ за дерево, формирование без вреда'),
    'Кронирование деревьев',
  )
  assert.equal(
    shortTitle('Как обрезать сливу весной: пошаговая инструкция'),
    'Как обрезать сливу весной',
  )
  assert.equal(shortTitle('Спил деревьев'), 'Спил деревьев')
  // слишком короткий хвост до разделителя — не режем
  assert.equal(shortTitle('ГЖИ: штрафы'), 'ГЖИ: штрафы')
})
