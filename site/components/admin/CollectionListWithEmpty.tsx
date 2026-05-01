import type { ListViewClientProps, ListViewServerPropsOnly } from 'payload'
import type { FC } from 'react'

import { DefaultListView } from '@payloadcms/ui'

import { LIST_VIEW_CLIENT_PROP_KEYS } from '@/lib/admin/rsc/clientPropKeys'
import { pickClientProps } from '@/lib/admin/rsc/pickClientProps'

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

  // Whitelist через `pickClientProps` — единственный канонический способ
  // пересечь RSC границу к DefaultListView. См. ADR-0015.
  const clientProps = pickClientProps(
    props as unknown as Record<string, unknown>,
    LIST_VIEW_CLIENT_PROP_KEYS,
  ) as unknown as ListViewClientProps
  return <DefaultListView {...clientProps} />
}

export default CollectionListWithEmpty
