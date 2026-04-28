import { ForbiddenState } from '@/components/admin/EmptyErrorStates'

/**
 * 403 boundary для admin route group (Wave 5 · PAN-4).
 *
 * Next.js 16 App Router fires forbidden.tsx когда `forbidden()` вызван
 * в server component или access-check failed.
 *
 * Использует существующий `ForbiddenState` из EmptyErrorStates (Wave 1).
 *
 * brand-guide §12.5 anatomy.
 */
export default function AdminForbidden() {
  return (
    <ForbiddenState
      title="Нет доступа"
      text="У этого аккаунта нет прав на эту страницу. Если думаешь, что это ошибка — напиши Георгию."
      homeHref="/admin"
    />
  )
}
