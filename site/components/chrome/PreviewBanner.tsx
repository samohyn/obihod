import { Wrap } from '@/components/blocks/v3/shared'
import { isDraftPreview } from '@/lib/preview'

import { exitPreview } from './previewActions'
import s from './PreviewBanner.module.css'

/**
 * Плашка предпросмотра над шапкой (план 09, этап 4). Видна только тому, кто открыл
 * черновик кнопкой в админке: draftMode включает /api/preview. Посетители её не видят,
 * страницы для них остаются статичными (ISR) — Next читает draftMode без перехода в динамику.
 */
export async function PreviewBanner() {
  if (!(await isDraftPreview())) return null
  return (
    <aside className={s.bar} role="status" aria-label="Предпросмотр черновиков">
      <Wrap className={s.row}>
        <p className={s.text}>
          <b>Предпросмотр.</b> Вы видите черновики — посетители видят опубликованную версию.
        </p>
        <form action={exitPreview}>
          <button type="submit" className={s.exit}>
            Выйти из предпросмотра
          </button>
        </form>
      </Wrap>
    </aside>
  )
}
