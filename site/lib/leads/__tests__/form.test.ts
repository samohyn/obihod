import assert from 'node:assert/strict'
import { test } from 'node:test'

import sharp from 'sharp'

import { processPhotos, PHOTO_LIMITS } from '../photos'
import { leadSchema, normalizePhone } from '../schema'

test('телефон: +7, 8 и 10 цифр → «+7 (900) 123-45-67», остальное — нет', () => {
  for (const raw of ['+7 900 123-45-67', '89001234567', '9001234567', '+7 (900) 123-45-67'])
    assert.equal(normalizePhone(raw), '+7 (900) 123-45-67', raw)
  for (const raw of ['123', '+44 20 7946 0958', '0001234567', ''])
    assert.equal(normalizePhone(raw), null, raw)
})

test('заявка: согласие из формы приходит строкой, пустые поля отбрасываются', () => {
  const r = leadSchema.safeParse({
    phone: '89001234567',
    consent: 'true',
    message: '  ',
    name: 'Ира',
  })
  assert.ok(r.success)
  assert.equal(r.data.phone, '+7 (900) 123-45-67')
  assert.equal(r.data.consent, true)
  assert.equal(r.data.message, undefined)
  assert.equal(r.data.name, 'Ира')
})

test('заявка: без телефона и с неверным телефоном — ошибка поля phone', () => {
  for (const body of [{}, { phone: '12-34' }]) {
    const r = leadSchema.safeParse(body)
    assert.equal(r.success, false)
    assert.equal(r.error?.issues[0].path[0], 'phone')
  }
})

const file = (buf: Buffer, name: string, type: string) =>
  new File([new Uint8Array(buf)], name, { type })

test('фото: EXIF и GPS сняты, большие уменьшены до 2000 px, формат — JPEG', async () => {
  const src = await sharp({
    create: { width: 3000, height: 1500, channels: 3, background: '#4a7c59' },
  })
    .withExif({ IFD0: { Copyright: 'секрет', ImageDescription: 'участок' } })
    .jpeg()
    .toBuffer()
  assert.ok((await sharp(src).metadata()).exif, 'у исходника есть EXIF')
  const { photos, errors } = await processPhotos([file(src, 'a.jpg', 'image/jpeg')])
  assert.deepEqual(errors, [])
  const meta = await sharp(photos[0].data).metadata()
  assert.equal(meta.format, 'jpeg')
  assert.equal(meta.exif, undefined)
  assert.equal(Math.max(meta.width ?? 0, meta.height ?? 0), 2000)
  assert.match(photos[0].name, /^lead-[0-9a-f-]+\.jpg$/)
})

test('фото: HEIC, не-картинка и лишние файлы — понятные ошибки', async () => {
  const heic = Buffer.concat([
    Buffer.from([0, 0, 0, 24]),
    Buffer.from('ftypheic0000'),
    Buffer.alloc(20),
  ])
  const r1 = await processPhotos([
    file(heic, 'a.heic', 'image/heic'),
    file(Buffer.from('просто текст, не картинка'), 'b.jpg', 'image/jpeg'),
  ])
  assert.deepEqual(
    r1.errors.map((e) => [e.index, /HEIC/.test(e.message), /не фото/.test(e.message)]),
    [
      [0, true, false],
      [1, false, true],
    ],
  )
  const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: '#fff' } })
    .png()
    .toBuffer()
  const many = Array.from({ length: PHOTO_LIMITS.count + 1 }, (_, i) =>
    file(png, `${i}.png`, 'image/png'),
  )
  const r2 = await processPhotos(many)
  assert.equal(r2.photos.length, 0)
  assert.match(r2.errors[0].message, /Не больше 5 фото/)
})
