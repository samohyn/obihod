import assert from 'node:assert/strict'
import { test } from 'node:test'

import { ICON_NAMES } from '../iconNames'
import { SERVICE_ICON_PATHS } from '../serviceIconPaths'
import { UI_ICON_PATHS } from '../uiIconPaths'

test('список иконок в админке совпадает с отрисовываемыми иконками', () => {
  const rendered = [...Object.keys(UI_ICON_PATHS), ...Object.keys(SERVICE_ICON_PATHS)].sort()
  assert.deepEqual([...ICON_NAMES].sort(), rendered)
})
