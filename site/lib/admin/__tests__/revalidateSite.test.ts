import assert from 'node:assert/strict'
import { test } from 'node:test'

import { changesPublicSite } from '../revalidateSite'

test('публикация меняет сайт', () => {
  assert.equal(
    changesPublicSite({ hasDrafts: true, status: 'published', draftQuery: undefined }),
    true,
  )
})

test('черновик и автосохранение из админки (?draft=true) сайт не меняют', () => {
  assert.equal(changesPublicSite({ hasDrafts: true, status: 'draft', draftQuery: 'true' }), false)
})

test('снятие с публикации (без ?draft, статус draft) меняет сайт', () => {
  assert.equal(changesPublicSite({ hasDrafts: true, status: 'draft', draftQuery: undefined }), true)
})

test('коллекция без черновиков (медиа) — любая правка видна на сайте', () => {
  assert.equal(changesPublicSite({ hasDrafts: false, status: undefined, draftQuery: 'true' }), true)
})
