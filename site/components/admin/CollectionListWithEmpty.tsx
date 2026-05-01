import type { ListViewClientProps, ListViewServerPropsOnly } from 'payload'
import type { FC } from 'react'

import { DefaultListView } from '@payloadcms/ui'

import { EmptyState } from './EmptyErrorStates'

/**
 * PANEL-EMPTY-LIST-WIRING — обёртка вокруг native Payload list-view.
 *
 * Подключается через `admin.components.views.list.Component` per-collection.
 * При global empty (`data.totalDocs === 0` без active filters) рендерит
 * §12.6 EmptyState с CTA «+ Добавить <singular>». Иначе пробрасывает все
 * client-props в `<DefaultListView>` — sort / filter / pagination /
 * bulk-actions / search работают идентично native.
 *
 * ADR-0010 — Payload 3.84 не имеет публичного `views.list.Empty` slot
 * (verified в `node_modules/payload/dist/collections/config/types.d.ts:344`),
 * поэтому обходим через custom-view wrapper. См. также `renderListView`
 * в `@payloadcms/next/dist/views/List/index.js:336` — он передаёт нам
 * объединённый набор server+client props через `RenderServerComponent`.
 *
 * Filtered-empty (есть docs, фильтр исключает все) → оставляем native
 * «No results»; наш EmptyState — только для onboarding case (БД пустая,
 * оператор открывает коллекцию первый раз).
 *
 * Server component (RSC) — `data.totalDocs` доступен синхронно из props,
 * никаких client-side fetch. EmptyState и DefaultListView оба совместимы
 * с RSC border (DefaultListView — client component, server рендерит client
 * через стандартный Next.js pattern).
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

const CollectionListWithEmpty: FC<CollectionListWithEmptyProps> = (props) => {
  const { emptyConfig, ...listProps } = props
  // `data` приходит из server-render layer (renderListView). Если нас
  // вызвали через `views.list.Component` — Payload собрал serverProps,
  // включая `data: PaginatedDocs` с `totalDocs`. Если props.data
  // отсутствует (drawer / nested context) — fail-open в native.
  const totalDocs = listProps.data?.totalDocs

  if (emptyConfig && totalDocs === 0) {
    return (
      <EmptyState
        title={emptyConfig.title}
        text={emptyConfig.text}
        actionLabel={emptyConfig.actionLabel}
        actionHref={emptyConfig.actionHref}
      />
    )
  }

  return <DefaultListView {...listProps} />
}

export default CollectionListWithEmpty
