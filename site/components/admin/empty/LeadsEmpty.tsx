import { EmptyState } from '../EmptyErrorStates'

/**
 * LeadsEmpty — особый «позитивный» empty (заявок нет = всё обработано).
 * Без CTA. Decision Q3 popanel 2026-04-28.
 */
const LeadsEmpty = () => (
  <EmptyState
    title="Все заявки обработаны"
    text="Хорошая работа. Новые появятся здесь как только клиенты заполнят форму."
    hideIcon
  />
)

export default LeadsEmpty
