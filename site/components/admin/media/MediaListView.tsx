import type { ListViewServerProps } from 'payload'
import { Gutter } from '@payloadcms/ui'
import MediaGrid from './MediaGrid'

/**
 * MediaListView — server wrapper для custom list-view коллекции `media`.
 *
 * PANEL-MEDIA-LIBRARY · sa-panel.md AC1.
 *
 * Регистрация: `media.admin.components.views.list.Component` (см. Media.ts).
 *
 * RSC рамки:
 *   - Сервер передаёт в client `<MediaGrid>` ТОЛЬКО сериализуемые primitives
 *     (collectionSlug, hasCreatePermission, hasDeletePermission,
 *     newDocumentURL, listLabel). `payload`, `req`, `i18n`, `collectionConfig`
 *     — НЕ пересекают RSC границу (см. CollectionListWithEmpty.tsx pattern,
 *     hotfix RC-2 от 2026-05-01).
 *   - Initial список media грузится client-side через `/api/media` (Payload
 *     REST). Альтернатива — server-side prefetch через payload Local API +
 *     передача `initialDocs` — оставлено как фаза 2, MVP грузит из браузера
 *     для минимизации RSC payload.
 *
 * Filtered-empty (нашли 0 при активных фильтрах) и onboarding-empty (БД
 * пустая) рендерит сам MediaGrid; здесь пустой path не нужен.
 */
export default function MediaListView(props: ListViewServerProps) {
  const {
    collectionSlug,
    hasCreatePermission,
    hasDeletePermission,
    newDocumentURL,
    collectionConfig,
  } = props

  const listLabel =
    typeof collectionConfig.labels?.plural === 'string'
      ? collectionConfig.labels.plural
      : 'Медиа'

  return (
    <Gutter className="media-library">
      <MediaGrid
        collectionSlug={collectionSlug}
        hasCreatePermission={hasCreatePermission}
        hasDeletePermission={hasDeletePermission ?? false}
        newDocumentURL={newDocumentURL}
        listLabel={listLabel}
      />
    </Gutter>
  )
}
