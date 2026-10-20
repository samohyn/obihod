import assert from 'node:assert/strict'
import { test } from 'node:test'

import { mediaPath, toImage } from '../fromPayload'

test('медиа: абсолютный URL Payload → путь без хвостового слеша', () => {
  assert.equal(mediaPath('https://obikhod.ru/api/media/file/a.jpg/'), '/api/media/file/a.jpg')
  assert.equal(mediaPath('http://localhost:3000/api/media/file/b.webp'), '/api/media/file/b.webp')
  assert.equal(mediaPath('/dev-blocks/c.webp'), '/dev-blocks/c.webp')
})

test('медиа: флаг «Иллюстрация» и фокус переходят в картинку блока', () => {
  const img = toImage({
    url: 'https://obikhod.ru/api/media/file/a.jpg/',
    alt: 'Спил',
    illustration: true,
    focalX: 40,
    focalY: 60,
  })
  assert.deepEqual(img, {
    url: '/api/media/file/a.jpg',
    alt: 'Спил',
    focus: '40% 60%',
    illustration: true,
  })
  assert.equal(toImage(null), null)
  assert.equal(toImage({ alt: 'без url' }), null)
})
