import type { ListViewClientProps } from 'payload'

/**
 * Whitelist ключей `ListViewClientProps` (см. `payload/dist/index.bundled.d.ts:7863`)
 * + `ListViewSlots` (там же `:7840`). Всё, что НЕ в этом списке (включая
 * `collectionConfig`, `data`, `payload`, `req`, `i18n`, `permissions`, `user`,
 * etc.) — server-only и НЕ должно пересекать RSC границу к client view.
 *
 * Verified против Payload 3.84 type definitions.
 * При bump Payload — re-verify против новой версии (cr-panel checklist).
 *
 * @see ADR-0015
 * @see hotfix #122 (e9bd3c1) — origin списка
 */
export const LIST_VIEW_CLIENT_PROP_KEYS = [
  // ListViewClientProps
  'beforeActions',
  'collectionSlug',
  'columnState',
  'disableBulkDelete',
  'disableBulkEdit',
  'disableQueryPresets',
  'enableRowSelections',
  'hasCreatePermission',
  'hasDeletePermission',
  'hasTrashPermission',
  'listPreferences',
  'newDocumentURL',
  'preferenceKey',
  'queryPreset',
  'queryPresetPermissions',
  'renderedFilters',
  'resolvedFilterOptions',
  'viewType',
  // ListViewSlots
  'AfterList',
  'AfterListTable',
  'BeforeList',
  'BeforeListTable',
  'Description',
  'listMenuItems',
  'Table',
] as const satisfies ReadonlyArray<keyof ListViewClientProps>

export type ListViewClientPropKey = (typeof LIST_VIEW_CLIENT_PROP_KEYS)[number]
