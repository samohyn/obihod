import type { ListViewClientProps, ListViewServerPropsOnly } from 'payload'
import type { FC } from 'react'

import { DefaultListView } from '@payloadcms/ui'

import { EmptyState } from './EmptyErrorStates'

/**
 * PANEL-EMPTY-LIST-WIRING — обёртка вокруг native Payload list-view.
 *
 * Подключается через `admin.components.views.list.Component` per-collection.
 * При global empty (`data.totalDocs === 0` без active filters) рендерит
 * §12.6 EmptyState с CTA «+ Добавить <singular>». Иначе пробрасывает
 * **только client-safe** props в `<DefaultListView>` — sort / filter /
 * pagination / bulk-actions / search работают идентично native.
 *
 * ADR-0010 — Payload 3.84 не имеет публичного `views.list.Empty` slot
 * (verified в `node_modules/payload/dist/collections/config/types.d.ts:344`),
 * поэтому обходим через custom-view wrapper. См. также `renderListView`
 * в `@payloadcms/next/dist/views/List/index.js:336`.
 *
 * RSC border (hotfix RC-2 от leadqa, 2026-05-01):
 * Когда наш wrapper — RSC (нет `'use client'`), Payload `RenderServerComponent`
 * (`@payloadcms/ui/dist/elements/RenderServerComponent/index.js:28-34`)
 * сливает `clientProps` + `serverProps` и спредит в наш компонент. Server
 * props содержат `collectionConfig` (с function-полями `access`, `hooks`,
 * `endpoints`), `payload`, `req`, `i18n` — non-serializable через RSC border
 * к client `<DefaultListView>`. Поэтому здесь явно собираем pick из
 * `ListViewClientProps`-ключей и в DefaultListView передаём только то, что
 * официально разрешено client API. Split типов сделан Payload именно для
 * type-strict component injection (комментарий в
 * `payload/dist/index.bundled.d.ts:7849-7854`).
 *
 * Filtered-empty (есть docs, фильтр исключает все) → оставляем native
 * «No results»; наш EmptyState — только для onboarding case (БД пустая,
 * оператор открывает коллекцию первый раз).
 */

export type CollectionListWithEmptyProps = ListViewClientProps &
  Partial<ListViewServerPropsOnly> & {
    /**
     * Конфиг empty-state, передаётся через `clientProps` в collection config.
     * Required keys: title, text, actionLabel, actionHref. PO-driven copy.
     */
    emptyConfig?: {
      title: string
      text: string
      actionLabel: string
      actionHref: string
    }
  }

/**
 * Whitelist ключей `ListViewClientProps` (см. `payload/dist/index.bundled.d.ts:7863`)
 * + `ListViewSlots` (там же `:7840`). Всё, что НЕ в этом списке (включая
 * `collectionConfig`, `data`, `payload`, `req`, `i18n`, `permissions`, `user`,
 * etc.) — server-only и НЕ должно пересекать RSC границу к DefaultListView.
 */
const CLIENT_PROP_KEYS = [
  // ListViewClientProps:
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
  // ListViewSlots:
  'AfterList',
  'AfterListTable',
  'BeforeList',
  'BeforeListTable',
  'Description',
  'listMenuItems',
  'Table',
] as const satisfies ReadonlyArray<keyof ListViewClientProps>

const pickClientProps = (props: CollectionListWithEmptyProps): ListViewClientProps => {
  const result = {} as Record<string, unknown>
  for (const key of CLIENT_PROP_KEYS) {
    const value = (props as Record<string, unknown>)[key]
    if (value !== undefined) {
      result[key] = value
    }
  }
  return result as ListViewClientProps
}

const CollectionListWithEmpty: FC<CollectionListWithEmptyProps> = (props) => {
  // `data` — server-only (`ListViewServerPropsOnly`), нужен только для
  // onboarding-check на сервере. Дальше в DefaultListView не пробрасываем.
  if (props.emptyConfig && props.data?.totalDocs === 0) {
    return (
      <EmptyState
        title={props.emptyConfig.title}
        text={props.emptyConfig.text}
        actionLabel={props.emptyConfig.actionLabel}
        actionHref={props.emptyConfig.actionHref}
      />
    )
  }

  return <DefaultListView {...pickClientProps(props)} />
}

export default CollectionListWithEmpty
