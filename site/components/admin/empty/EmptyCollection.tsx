import type { FC } from 'react'
import { EmptyState } from '../EmptyErrorStates'

/**
 * EmptyCollection — generic empty state для list-views Payload коллекций
 * (Wave 5 · PAN-4 part 1, sa-panel-wave5.md §5.1 rewrite).
 *
 * Используется per-collection через тонкий wrapper в `site/components/admin/empty/<Collection>Empty.tsx`,
 * который подключается через `admin.components.views.list.Empty` в CollectionConfig.
 *
 * Tone: matter-of-fact (brand-guide §13 TOV) — без «Упс / К сожалению».
 *
 * cw provisional texts (pending финализация):
 * - Tone позитивный для Leads override (пустой = success).
 * - Default: «<коллекция> пока нет. Создай первую — это основа сайта.»
 */

interface EmptyCollectionProps {
  collectionLabel: string
  ctaLabel: string
  ctaHref: string
  description?: string
}

export const EmptyCollection: FC<EmptyCollectionProps> = ({
  collectionLabel,
  ctaLabel,
  ctaHref,
  description,
}) => (
  <EmptyState
    title={`${collectionLabel} пока нет`}
    text={description ?? 'Создай первую запись — она появится здесь и в каталоге сайта.'}
    actionLabel={ctaLabel}
    actionHref={ctaHref}
  />
)

export default EmptyCollection
