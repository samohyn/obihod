import { EmptyState } from '@/components/admin/EmptyErrorStates'

/**
 * 404 boundary для admin route group (Wave 5 · PAN-4).
 *
 * Срабатывает при `notFound()` или несуществующем URL внутри /admin/*.
 * Использует EmptyState из Wave 1 — но с матерью «404» tone.
 *
 * brand-guide §12.5.
 */
export default function AdminNotFound() {
  return (
    <EmptyState
      title="Страница не найдена"
      text="Возможно, запись удалили или URL неправильный. Вернись в админку и попробуй заново."
      actionLabel="Назад в админку"
      actionHref="/admin"
    />
  )
}
